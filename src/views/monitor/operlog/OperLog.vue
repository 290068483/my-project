<template>
  <div class="operlog-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="操作地址" prop="operIp">
          <el-input
            v-model="queryParams.operIp"
            placeholder="请输入操作地址"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="系统模块" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="操作人员" prop="operName">
          <el-input
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="类型" prop="businessType">
          <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable style="width: 120px">
            <el-option label="其他" value="0" />
            <el-option label="新增" value="1" />
            <el-option label="修改" value="2" />
            <el-option label="删除" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="操作状态" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="异常" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
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
          <el-button
            v-permission="'monitor:operlog:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button
            v-permission="'monitor:operlog:remove'"
            type="danger"
            icon="Delete"
            @click="handleClean">
            清空
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 操作日志表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="operlogList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="日志编号" prop="operId" width="80" align="center" />

        <el-table-column label="系统模块" prop="title" min-width="120" show-overflow-tooltip />

        <el-table-column label="操作类型" prop="businessType" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getBusinessTypeTagType(row.businessType)">
              {{ getBusinessTypeName(row.businessType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="请求方式" prop="requestMethod" width="100" align="center" />

        <el-table-column label="操作人员" prop="operName" width="100" align="center" />

        <el-table-column label="主机" prop="operIp" width="120" align="center" />

        <el-table-column label="操作状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "正常" : "异常" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作日期" prop="operTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.operTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="详细" placement="top">
              <el-button
                type="text"
                icon="View"
                @click="handleView(row)"
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

    <!-- 操作日志详细 -->
    <el-dialog
      title="操作日志详细"
      v-model="detailDialogVisible"
      width="800px"
      append-to-body>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ getBusinessTypeName(form.businessType) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录信息：">{{ form.operName }} / {{ form.operIp }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === '0'">
                <el-tag type="success">正常</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger">异常</el-tag>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ formatDateTime(form.operTime) }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === '1'">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElForm, ElTable } from 'element-plus'
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
const multiple = ref(true)
const total = ref(0)
const operlogList = ref<Record<string, any>[]>([])
const detailDialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  operIp: '',
  title: '',
  operName: '',
  businessType: '',
  status: ''
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 表单参数
const form = reactive({
  operId: undefined,
  title: '',
  businessType: '',
  requestMethod: '',
  operName: '',
  operIp: '',
  status: '',
  operUrl: '',
  method: '',
  operParam: '',
  jsonResult: '',
  errorMsg: '',
  operTime: ''
})

// 是否多选
const isMultipleSelection = computed(() => {
  return multiple.value && ids.value.length > 0
})

// 生命周期钩子
onMounted(() => {
  getList()
})

// 获取操作日志列表
function getList() {
  loading.value = true
  // TODO: 实现获取操作日志列表的API调用
  loading.value = false
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
function handleSelectionChange(selection: Record<string, any>[]) {
  ids.value = selection.map(item => item.operId!)
  multiple.value = !selection.length
}

// 获取操作类型标签类型
function getBusinessTypeTagType(businessType: string) {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | ''> = {
    '1': 'success', // 新增
    '2': 'warning', // 修改
    '3': 'danger',  // 删除
    '0': 'primary'  // 其他
  }
  return typeMap[businessType] || ''
}

// 获取操作类型名称
function getBusinessTypeName(businessType: string) {
  const nameMap: Record<string, string> = {
    '1': '新增',
    '2': '修改',
    '3': '删除',
    '0': '其他'
  }
  return nameMap[businessType] || '其他'
}

// 删除按钮操作
function handleDelete() {
  const operIds = ids.value
  ElMessageBox.confirm(
    `是否确认删除日志编号为"${operIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除操作日志的API调用
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 清空按钮操作
function handleClean() {
  ElMessageBox.confirm(
    '是否确认清空所有操作日志数据项？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清空操作日志的API调用
    getList()
    ElMessage.success('清空成功')
  }).catch(() => {})
}

// 详细按钮操作
function handleView(row: Record<string, any>) {
  Object.assign(form, row)
  detailDialogVisible.value = true
}
</script>

<style scoped>
.operlog-container {
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