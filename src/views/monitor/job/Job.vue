<template>
  <div class="job-container">
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

        <el-form-item label="任务状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable style="width: 120px">
            <el-option label="正常" value="0" />
            <el-option label="暂停" value="1" />
          </el-select>
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
            v-permission="'monitor:job:add'"
            type="primary"
            icon="Plus"
            @click="handleAdd">
            新增
          </el-button>
          <el-button
            v-permission="'monitor:job:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'monitor:job:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button
            v-permission="'monitor:job:export'"
            type="warning"
            icon="Download"
            @click="handleExport">
            导出
          </el-button>
          <el-button
            v-permission="'monitor:job:query'"
            type="info"
            icon="Operation"
            @click="handleJobLog">
            日志
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 定时任务表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="jobList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="任务编号" prop="jobId" width="80" align="center" />

        <el-table-column label="任务名称" prop="jobName" min-width="120" show-overflow-tooltip />

        <el-table-column label="任务组名" prop="jobGroup" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.jobGroup === 'DEFAULT' ? 'primary' : 'success'">
              {{ row.jobGroup === "DEFAULT" ? "默认" : "系统" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="调用目标字符串" prop="invokeTarget" min-width="150" show-overflow-tooltip />

        <el-table-column label="cron执行表达式" prop="cronExpression" min-width="120" show-overflow-tooltip />

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'monitor:job:edit'"
                type="text"
                icon="Edit"
                @click="handleUpdate(row)"
                size="small" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'monitor:job:remove'"
                type="text"
                icon="Delete"
                @click="handleDelete(row)"
                size="small" />
            </el-tooltip>
            <el-tooltip content="执行一次" placement="top">
              <el-button
                v-permission="'monitor:job:edit'"
                type="text"
                icon="CaretRight"
                @click="handleRun(row)"
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      append-to-body
      :before-close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择任务分组" style="width: 100%">
                <el-option label="默认" value="DEFAULT" />
                <el-option label="系统" value="SYSTEM" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="调用目标方法" prop="invokeTarget">
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标方法" />
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式" />
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="执行策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy">
                <el-radio label="1">立即执行</el-radio>
                <el-radio label="2">执行一次</el-radio>
                <el-radio label="3">放弃执行</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent">
                <el-radio label="0">允许</el-radio>
                <el-radio label="1">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">暂停</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
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
const jobList = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: '',
  jobGroup: '',
  status: ''
})

// 表单参数
const form = reactive({
  jobId: undefined,
  jobName: '',
  jobGroup: 'DEFAULT',
  invokeTarget: '',
  cronExpression: '',
  misfirePolicy: '1',
  concurrent: '1',
  status: '0',
  remark: ''
})

// 表单校验规则
const rules = reactive({
  jobName: [
    { required: true, message: '任务名称不能为空', trigger: 'blur' }
  ],
  invokeTarget: [
    { required: true, message: '调用目标方法不能为空', trigger: 'blur' }
  ],
  cronExpression: [
    { required: true, message: 'cron执行表达式不能为空', trigger: 'blur' }
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

// 获取定时任务列表
function getList() {
  loading.value = true
  // TODO: 实现获取定时任务列表的API调用
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
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection: Record<string, unknown>[]) {
  ids.value = selection.map(item => item.jobId as number)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
function handleAdd() {
  dialogTitle.value = '添加任务'
  dialogVisible.value = true
  resetForm()
}

// 修改按钮操作
function handleUpdate(row?: Record<string, unknown>) {
  // TODO: 实现获取定时任务详情的API调用
  dialogTitle.value = '修改任务'
  dialogVisible.value = true
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.jobId) {
        // TODO: 实现修改定时任务的API调用
        ElMessage.success('修改成功')
        dialogVisible.value = false
        getList()
      } else {
        // TODO: 实现新增定时任务的API调用
        ElMessage.success('新增成功')
        dialogVisible.value = false
        getList()
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
    jobId: undefined,
    jobName: '',
    jobGroup: 'DEFAULT',
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '1',
    concurrent: '1',
    status: '0',
    remark: ''
  })
}

// 删除按钮操作
function handleDelete(row?: Record<string, unknown>) {
  const jobIds = row?.jobId || ids.value
  ElMessageBox.confirm(
    `是否确认删除任务编号为"${jobIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除定时任务的API调用
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 导出按钮操作
function handleExport() {
  // TODO: 实现导出定时任务的API调用
  ElMessage.info('导出功能待实现')
}

// 日志按钮操作
function handleJobLog() {
  // TODO: 实现跳转到定时任务日志页面
  ElMessage.info('查看日志功能待实现')
}

// 状态修改
function handleStatusChange(row: Record<string, unknown>) {
  // TODO: 实现修改定时任务状态的API调用
  ElMessage.success(`任务${row.status === '0' ? '启用' : '停用'}成功`)
}

// 执行一次按钮操作
function handleRun(row: Record<string, unknown>) {
  ElMessageBox.confirm(
    `确认要立即执行一次"${row.jobName}"任务吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现执行一次定时任务的API调用
    ElMessage.success('执行成功')
  }).catch(() => {})
}
</script>

<style scoped>
.job-container {
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