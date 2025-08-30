<template>
  <div class="job-log-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable style="width: 120px">
            <el-option label="默认" value="DEFAULT" />
            <el-option label="系统" value="SYSTEM" />
          </el-select>
        </el-form-item>

        <el-form-item label="执行状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择执行状态" clearable style="width: 120px">
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="执行时间">
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
          <el-button
            v-permission="'monitor:job:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button
            v-permission="'monitor:job:remove'"
            type="danger"
            icon="Delete"
            @click="handleClean">
            清空
          </el-button>
          <el-button
            v-permission="'monitor:job:export'"
            type="warning"
            icon="Download"
            @click="handleExport">
            导出
          </el-button>
          <el-button 
            type="warning" 
            icon="Close"
            @click="handleClose">
            关闭
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 定时任务日志表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="jobLogList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="日志编号" prop="jobLogId" width="80" align="center" />

        <el-table-column label="任务名称" prop="jobName" min-width="120" show-overflow-tooltip />

        <el-table-column label="任务组名" prop="jobGroup" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.jobGroup === 'DEFAULT' ? 'primary' : 'success'">
              {{ row.jobGroup === "DEFAULT" ? "默认" : "系统" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="调用目标字符串" prop="invokeTarget" min-width="150" show-overflow-tooltip />

        <el-table-column label="日志信息" prop="jobMessage" min-width="150" show-overflow-tooltip />

        <el-table-column label="执行状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="执行时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
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

    <!-- 定时任务日志详细 -->
    <el-dialog
      title="调度日志详细"
      v-model="detailDialogVisible"
      width="800px"
      append-to-body>
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行时间：">{{ formatDateTime(form.createTime) }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status === '0'">
                <el-tag type="success">成功</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger">失败</el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === '1'">{{ form.exceptionInfo }}</el-form-item>
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
import { useRouter } from 'vue-router'

// 定义引用
const queryFormRef = ref<InstanceType<typeof ElForm>>()
const formRef = ref<InstanceType<typeof ElForm>>()
const tableRef = ref<InstanceType<typeof ElTable>>()
const router = useRouter()

// 定义响应式数据
const loading = ref(false)
const showSearch = ref(true)
const ids = ref<number[]>([])
const multiple = ref(true)
const total = ref(0)
const jobLogList = ref<Record<string, unknown>[]>([])
const detailDialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: '',
  jobGroup: '',
  status: ''
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 表单参数
const form = reactive({
  jobLogId: undefined,
  jobName: '',
  jobGroup: '',
  invokeTarget: '',
  jobMessage: '',
  status: '',
  exceptionInfo: '',
  createTime: ''
})

// 是否多选
const isMultipleSelection = computed(() => {
  return multiple.value && ids.value.length > 0
})

// 生命周期钩子
onMounted(() => {
  getList()
})

// 获取定时任务日志列表
function getList() {
  loading.value = true
  // TODO: 实现获取定时任务日志列表的API调用
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
function handleSelectionChange(selection: Record<string, unknown>[]) {
  ids.value = selection.map(item => item.jobLogId as number)
  multiple.value = !selection.length
}

// 删除按钮操作
function handleDelete() {
  const jobLogIds = ids.value
  ElMessageBox.confirm(
    `是否确认删除日志编号为"${jobLogIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除定时任务日志的API调用
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 清空按钮操作
function handleClean() {
  ElMessageBox.confirm(
    '是否确认清空所有调度日志数据项？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清空定时任务日志的API调用
    getList()
    ElMessage.success('清空成功')
  }).catch(() => {})
}

// 导出按钮操作
function handleExport() {
  // TODO: 实现导出定时任务日志的API调用
  ElMessage.info('导出功能待实现')
}

// 关闭按钮操作
function handleClose() {
  router.back()
}

// 详细按钮操作
function handleView(row: Record<string, unknown>) {
  Object.assign(form, row)
  detailDialogVisible.value = true
}
</script>

<style scoped>
.job-log-container {
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