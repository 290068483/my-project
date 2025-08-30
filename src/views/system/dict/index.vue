<template>
  <div class="dict-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="queryParams.dictName"
            placeholder="请输入字典名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="queryParams.dictType"
            placeholder="请输入字典类型"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
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
          <el-button v-permission="'system:dict:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button
            v-permission="'system:dict:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'system:dict:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button v-permission="'system:dict:export'" type="warning" icon="Download" @click="handleExport">
            导出
          </el-button>
          <el-button v-permission="'system:dict:remove'" type="danger" icon="Refresh" @click="handleRefreshCache">
            刷新缓存
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 字典表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="dictList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="字典主键" prop="dictId" width="80" align="center" />

        <el-table-column label="字典名称" prop="dictName" min-width="120" show-overflow-tooltip />

        <el-table-column label="字典类型" prop="dictType" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button type="text" @click="handleDictData(row)">{{ row.dictType }}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "正常" : "停用" }}
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
                v-permission="'system:dict:edit'"
                type="text"
                icon="Edit"
                @click="handleUpdate(row)"
                size="small" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:dict:remove'"
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

    <!-- 添加或修改字典对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      append-to-body
      :before-close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>

        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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
import { getDictList, getDict, addDict, updateDict, delDict, refreshCache } from '@/api/system/dict'
import type { DictQueryParams, DictForm } from '@/types/system/dict'
import RightToolbar from '@/components/RightToolbar/RightToolbar.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { formatDateTime } from '@/utils'
import router from '@/router'

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
const dictList = ref<DictForm[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 查询参数
const queryParams = reactive<DictQueryParams>({
  pageNum: 1,
  pageSize: 10,
  dictName: '',
  dictType: '',
  status: '',
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 表单参数
const form = reactive<DictForm>({
  dictId: undefined,
  dictName: '',
  dictType: '',
  status: '0',
  remark: ''
})

// 表单校验规则
const rules = reactive({
  dictName: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' }
  ],
  dictType: [
    { required: true, message: '字典类型不能为空', trigger: 'blur' }
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

// 获取字典列表
function getList() {
  loading.value = true
  getDictList({
    ...queryParams,
    beginTime: dateRange.value[0],
    endTime: dateRange.value[1]
  }).then(response => {
    dictList.value = response.rows
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
function handleSelectionChange(selection: DictForm[]) {
  ids.value = selection.map(item => item.dictId!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
function handleAdd() {
  dialogTitle.value = '添加字典'
  dialogVisible.value = true
  resetForm()
}

// 修改按钮操作
function handleUpdate(row?: DictForm) {
  const dictId = row?.dictId || ids.value[0]
  getDict(dictId).then(response => {
    Object.assign(form, response.data)
    dialogTitle.value = '修改字典'
    dialogVisible.value = true
  })
}

// 字典数据按钮操作
function handleDictData(row: DictForm) {
  router.push({
    name: 'DictData',
    params: { dictId: row.dictId },
    query: { dictType: row.dictType }
  })
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.dictId) {
        updateDict(form).then(() => {
          ElMessage.success('修改成功')
          dialogVisible.value = false
          getList()
        })
      } else {
        addDict(form).then(() => {
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
    dictId: undefined,
    dictName: '',
    dictType: '',
    status: '0',
    remark: ''
  })
}

// 删除按钮操作
function handleDelete(row?: DictForm) {
  const dictIds = row?.dictId || ids.value
  ElMessageBox.confirm(
    `是否确认删除字典编号为"${dictIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => delDict(dictIds)).then(() => {
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
.dict-container {
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