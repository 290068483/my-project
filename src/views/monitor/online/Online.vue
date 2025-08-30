<template>
  <div class="online-container">
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

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"> 搜索 </el-button>
          <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 在线用户表格 -->
    <el-card class="table-card">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
        border
        stripe>
        <el-table-column label="序号" width="50" type="index" align="center">
          <template #default="scope">
            <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="会话编号" prop="tokenId" min-width="120" show-overflow-tooltip />

        <el-table-column label="登录名称" prop="userName" min-width="120" show-overflow-tooltip />

        <el-table-column label="所属部门" prop="deptName" min-width="120" show-overflow-tooltip />

        <el-table-column label="主机" prop="ipaddr" min-width="120" show-overflow-tooltip />

        <el-table-column label="登录地点" prop="loginLocation" min-width="120" show-overflow-tooltip />

        <el-table-column label="操作系统" prop="os" min-width="120" show-overflow-tooltip />

        <el-table-column label="浏览器" prop="browser" min-width="120" show-overflow-tooltip />

        <el-table-column label="登录时间" prop="loginTime" width="160" align="center">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.loginTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="强退" placement="top">
              <el-button
                v-permission="'monitor:online:forceLogout'"
                type="text"
                icon="Delete"
                @click="handleForceLogout(row)"
                size="small" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="pageNum"
        v-model:limit="pageSize"
        @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElForm, ElTable } from 'element-plus'
import Pagination from '@/components/Pagination/Pagination.vue'
import { formatDateTime } from '@/utils'

// 定义引用
const queryFormRef = ref<InstanceType<typeof ElForm>>()
const tableRef = ref<InstanceType<typeof ElTable>>()

// 定义响应式数据
const loading = ref(true)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const onlineList = ref<any[]>([])

// 查询参数
const queryParams = reactive({
  ipaddr: undefined,
  userName: undefined
})

// 生命周期钩子
onMounted(() => {
  getList()
})

// 获取在线用户列表
function getList() {
  loading.value = true
  // TODO: 实现获取在线用户列表的API调用
  loading.value = false
}

// 搜索
function handleQuery() {
  pageNum.value = 1
  getList()
}

// 重置搜索
function resetQuery() {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 强退按钮操作
function handleForceLogout(row: any) {
  ElMessageBox.confirm(
    `是否确认强退名称为"${row.userName}"的用户?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现强退用户的API调用
    getList()
    ElMessage.success('强退成功')
  }).catch(() => {})
}
</script>

<style scoped>
.online-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}
</style>