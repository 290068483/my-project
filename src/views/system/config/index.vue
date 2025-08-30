<template>
  <div class="config-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="参数名称" prop="configName">
          <el-input
            v-model="queryParams.configName"
            placeholder="请输入参数名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="参数键名" prop="configKey">
          <el-input
            v-model="queryParams.configKey"
            placeholder="请输入参数键名"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="系统内置" prop="configType">
          <el-select v-model="queryParams.configType" placeholder="系统内置" clearable style="width: 120px">
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"> 搜索 </el-button>
          <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作工具栏 -->
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button v-permission="'system:config:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button
            v-permission="'system:config:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'system:config:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button v-permission="'system:config:export'" type="warning" icon="Download" @click="handleExport">
            导出
          </el-button>
          <el-button v-permission="'system:config:remove'" type="danger" icon="Refresh" @click="handleRefreshCache">
            刷新缓存
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 参数表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="configList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="参数主键" prop="configId" width="80" align="center" />

        <el-table-column label="参数名称" prop="configName" min-width="120" show-overflow-tooltip />

        <el-table-column label="参数键名" prop="configKey" min-width="120" show-overflow-tooltip />

        <el-table-column label="参数键值" prop="configValue" min-width="120" show-overflow-tooltip />

        <el-table-column label="系统内置" prop="configType" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.configType === 'Y' ? 'success' : 'danger'">
              {{ row.configType === "Y" ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="备注" prop="remark" min-width="120" show-overflow-tooltip />

        <el-table-column label="创建时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:config:edit'"
                type="text"
                icon="Edit"
                @click="handleUpdate(row)"
                size="small" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:config:remove'"
                type="text"
                icon="Delete"
                @click="handleDelete(row)"
                size="small" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList" />
    </el-card>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
      :before-close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数名称" />
        </el-form-item>

        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>

        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" type="textarea" />
        </el-form-item>

        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="form.configType">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElForm, ElTable } from 'element-plus'
import { getConfigList, getConfig, addConfig, updateConfig, delConfig, refreshCache } from '@/api/system/config'
import type { ConfigQueryParams, ConfigForm } from '@/types/system/config'
import RightToolbar from '@/components/RightToolbar/RightToolbar.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { formatDateTime } from '@/utils'

// 定义引用
const queryFormRef = ref<InstanceType<typeof ElForm>>()
const formRef = ref<InstanceType<typeof ElForm>>()
const tableRef = ref<InstanceType<typeof ElTable>>()

// 定义响应式数据
const loading = ref(false)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const configList = ref<ConfigForm[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 查询参数
const queryParams = reactive<ConfigQueryParams>({
  pageNum: 1,
  pageSize: 10,
  configName: '',
  configKey: '',
  configType: '',
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 表单参数
const form = reactive<ConfigForm>({
  configId: undefined,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'Y',
  remark: ''
})

// 表单校验规则
const rules = reactive({
  configName: [
    { required: true, message: '参数名称不能为空', trigger: 'blur' }
  ],
  configKey: [
    { required: true, message: '参数键名不能为空', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '参数键值不能为空', trigger: 'blur' }
  ]
})

// 是否单选
const isSingleSelection = computed(() => {
  return single.value && ids.value.length === 1
})

// 是否多选
const isMultipleSelection = computed(() => {
  return multiple.value && ids.value.length > 0
})

// 生命周期钩子
onMounted(() => {
  getList()
})

// 获取参数列表
function getList() {
  loading.value = true
  getConfigList({
    ...queryParams,
    beginTime: dateRange.value[0],
    endTime: dateRange.value[1]
  }).then(response => {
    configList.value = response.rows
    total.value = response.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 搜索
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置搜索
function resetQuery() {
  queryFormRef.value?.resetFields()
  dateRange.value = ['', '']
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection: ConfigForm[]) {
  ids.value = selection.map(item => item.configId!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
function handleAdd() {
  dialogTitle.value = '添加参数'
  dialogVisible.value = true
  resetForm()
}

// 修改按钮操作
function handleUpdate(row?: ConfigForm) {
  const configId = row?.configId || ids.value[0]
  getConfig(configId).then(response => {
    Object.assign(form, response.data)
    dialogTitle.value = '修改参数'
    dialogVisible.value = true
  })
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.configId) {
        updateConfig(form).then(() => {
          ElMessage.success('修改成功')
          dialogVisible.value = false
          getList()
        })
      } else {
        addConfig(form).then(() => {
          ElMessage.success('新增成功')
          dialogVisible.value = false
          getList()
        })
      }
    }
  })
}

// 取消按钮
function cancel() {
  dialogVisible.value = false
  resetForm()
}

// 关闭对话框
function handleDialogClose() {
  dialogVisible.value = false
  resetForm()
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields()
  Object.assign(form, {
    configId: undefined,
    configName: '',
    configKey: '',
    configValue: '',
    configType: 'Y',
    remark: ''
  })
}

// 删除按钮操作
function handleDelete(row?: ConfigForm) {
  const configIds = row?.configId || ids.value
  ElMessageBox.confirm(
    `是否确认删除参数编号为"${configIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => delConfig(configIds)).then(() => {
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 导出按钮操作
function handleExport() {
  // TODO: 实现导出功能
  ElMessage.info('导出功能待实现')
}

// 刷新缓存按钮操作
function handleRefreshCache() {
  refreshCache().then(() => {
    ElMessage.success('刷新成功')
  })
}
</script>

<style scoped>
.config-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>