<template>
  <div class="notice-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input
            v-model="queryParams.noticeTitle"
            placeholder="请输入公告标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="操作人员" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入操作人员"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="类型" prop="noticeType">
          <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable style="width: 120px">
            <el-option label="通知" value="1" />
            <el-option label="公告" value="2" />
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
          <el-button v-permission="'system:notice:add'" type="primary" icon="Plus" @click="handleAdd"> 新增 </el-button>
          <el-button
            v-permission="'system:notice:edit'"
            type="success"
            icon="Edit"
            :disabled="!isSingleSelection"
            @click="handleUpdate">
            修改
          </el-button>
          <el-button
            v-permission="'system:notice:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
        </div>

        <div class="toolbar-right">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </div>
      </div>
    </el-card>

    <!-- 通知公告表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="noticeList"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="序号" prop="noticeId" width="80" align="center" />

        <el-table-column label="公告标题" prop="noticeTitle" min-width="120" show-overflow-tooltip />

        <el-table-column label="公告类型" prop="noticeType" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.noticeType === '1' ? 'primary' : 'success'">
              {{ row.noticeType === "1" ? "通知" : "公告" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "正常" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建者" prop="createBy" width="100" align="center" />

        <el-table-column label="创建时间" prop="createTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                v-permission="'system:notice:edit'"
                type="text"
                icon="Edit"
                @click="handleUpdate(row)"
                size="small" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                v-permission="'system:notice:remove'"
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

    <!-- 添加或修改通知公告对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      append-to-body
      :before-close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-radio-group v-model="form.noticeType">
                <el-radio label="1">通知</el-radio>
                <el-radio label="2">公告</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="内容" prop="noticeContent">
              <el-input 
                v-model="form.noticeContent" 
                placeholder="请输入公告内容" 
                type="textarea" 
                :rows="6" />
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
const noticeList = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  noticeTitle: '',
  createBy: '',
  noticeType: '',
})

// 表单参数
const form = reactive({
  noticeId: undefined,
  noticeTitle: '',
  noticeType: '1',
  status: '0',
  noticeContent: '',
  createBy: '',
  remark: ''
})

// 表单校验规则
const rules = reactive({
  noticeTitle: [
    { required: true, message: '公告标题不能为空', trigger: 'blur' }
  ],
  noticeType: [
    { required: true, message: '公告类型不能为空', trigger: 'blur' }
  ],
  noticeContent: [
    { required: true, message: '公告内容不能为空', trigger: 'blur' }
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

// 获取通知公告列表
function getList() {
  loading.value = true
  // TODO: 实现获取通知公告列表的API调用
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
function handleSelectionChange(selection: any[]) {
  ids.value = selection.map(item => item.noticeId!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮操作
function handleAdd() {
  dialogTitle.value = '添加通知公告'
  dialogVisible.value = true
  resetForm()
}

// 修改按钮操作
function handleUpdate(row?: any) {
  // TODO: 实现获取通知公告详情的API调用
  dialogTitle.value = '修改通知公告'
  dialogVisible.value = true
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      // TODO: 实现新增或修改通知公告的API调用
      ElMessage.success('操作成功')
      dialogVisible.value = false
      getList()
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
    noticeId: undefined,
    noticeTitle: '',
    noticeType: '1',
    status: '0',
    noticeContent: '',
    createBy: '',
    remark: ''
  })
}

// 删除按钮操作
function handleDelete(row?: any) {
  const noticeIds = row?.noticeId || ids.value
  ElMessageBox.confirm(
    `是否确认删除公告编号为"${noticeIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除通知公告的API调用
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.notice-container {
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