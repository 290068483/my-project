<template>
  <div class="logininfor-container">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="80px" class="query-form">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="登录状态" clearable style="width: 120px">
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="登录时间">
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
            v-permission="'monitor:logininfor:remove'"
            type="danger"
            icon="Delete"
            :disabled="!isMultipleSelection"
            @click="handleDelete">
            删除
          </el-button>
          <el-button
            v-permission="'monitor:logininfor:remove'"
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

    <!-- 登录日志表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="logininforList"
        border
        stripe
        @selection-change="handleSelectionChange"
        :default-sort="defaultSort"
        @sort-change="handleSortChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="访问编号" prop="infoId" width="80" align="center" />

        <el-table-column 
          label="用户名称" 
          prop="userName" 
          min-width="100" 
          show-overflow-tooltip 
          sortable="custom" 
          :sort-orders="['descending', 'ascending']" />

        <el-table-column label="地址" prop="ipaddr" min-width="120" show-overflow-tooltip />

        <el-table-column label="登录地点" prop="loginLocation" min-width="120" show-overflow-tooltip />

        <el-table-column label="浏览器" prop="browser" min-width="100" show-overflow-tooltip />

        <el-table-column label="操作系统" prop="os" min-width="100" show-overflow-tooltip />

        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">
              {{ row.status === "0" ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="msg" min-width="120" show-overflow-tooltip />

        <el-table-column 
          label="访问时间" 
          prop="loginTime" 
          width="160" 
          align="center" 
          sortable="custom" 
          :sort-orders="['descending', 'ascending']">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.loginTime) }}</span>
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
const tableRef = ref<InstanceType<typeof ElTable>>()

// 定义响应式数据
const loading = ref(false)
const showSearch = ref(true)
const ids = ref<number[]>([])
const multiple = ref(true)
const total = ref(0)
const logininforList = ref<Record<string, any>[]>([])

// 默认排序
const defaultSort = reactive({
  prop: 'loginTime',
  order: 'descending'
})

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  ipaddr: '',
  userName: '',
  status: '',
  orderByColumn: 'loginTime',
  isAsc: 'descending'
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 是否多选
const isMultipleSelection = computed(() => {
  return multiple.value && ids.value.length > 0
})

// 生命周期钩子
onMounted(() => {
  getList()
})

// 获取登录日志列表
function getList() {
  loading.value = true
  // TODO: 实现获取登录日志列表的API调用
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
  ids.value = selection.map(item => item.infoId!)
  multiple.value = !selection.length
}

// 排序
function handleSortChange(column: { prop: string; order: string }) {
  queryParams.orderByColumn = column.prop
  queryParams.isAsc = column.order === 'ascending' ? 'asc' : 'desc'
  getList()
}

// 删除按钮操作
function handleDelete() {
  const infoIds = ids.value
  ElMessageBox.confirm(
    `是否确认删除访问编号为"${infoIds}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除登录日志的API调用
    getList()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 清空按钮操作
function handleClean() {
  ElMessageBox.confirm(
    '是否确认清空所有登录日志数据项？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清空登录日志的API调用
    getList()
    ElMessage.success('清空成功')
  }).catch(() => {})
}
</script>

<style scoped>
.logininfor-container {
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
</style>