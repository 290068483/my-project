<template>
  <div class="cache-list-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <collection style="width: 1em; height: 1em; vertical-align: middle;" /> 
            <span style="vertical-align: middle;">缓存列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              icon="Refresh"
              @click="refreshCacheNames()"
            ></el-button>
          </template>
          <el-table
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            @row-click="getCacheKeys"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>

            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            ></el-table-column>

            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  icon="Delete"
                  @click="handleClearCacheName(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <key style="width: 1em; height: 1em; vertical-align: middle;" /> 
            <span style="vertical-align: middle;">键名列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              icon="Refresh"
              @click="refreshCacheKeys()"
            ></el-button>
          </template>
          <el-table
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  icon="Delete"
                  @click="handleClearCacheKey(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card :style="{ height: 'calc(100vh - 125px)' }">
          <template #header>
            <Document style="width: 1em; height: 1em; vertical-align: middle;" /> 
            <span style="vertical-align: middle;">缓存内容</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              icon="Refresh"
              @click="handleClearCacheAll()"
            >清理全部</el-button>
          </template>
          <div class="cache-content">
            <el-form :model="cacheForm">
              <el-row :gutter="32">
                <el-col :span="24">
                  <el-form-item label="缓存名称:" prop="cacheName">
                    <el-input v-model="cacheForm.cacheName" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="缓存键名:" prop="cacheKey">
                    <el-input v-model="cacheForm.cacheKey" :readonly="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="缓存内容:" prop="cacheValue">
                    <el-input
                      v-model="cacheForm.cacheValue"
                      type="textarea"
                      :rows="8"
                      :readonly="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { 
  Collection,
  Key,
  Document
} from '@element-plus/icons-vue'

// 定义引用
const { proxy } = getCurrentInstance() as any

// 定义响应式数据
const loading = ref(true)
const subLoading = ref(false)
const tableHeight = ref(window.innerHeight - 200)
const cacheNames = ref<any[]>([])
const cacheKeys = ref<any[]>([])
const cacheForm = ref({
  cacheName: '',
  cacheKey: '',
  cacheValue: ''
})

// 生命周期钩子
onMounted(() => {
  refreshCacheNames()
})

// 刷新缓存名称列表
function refreshCacheNames() {
  loading.value = true
  // TODO: 实现获取缓存名称列表的API调用
  loading.value = false
}

// 获取缓存键名列表
function getCacheKeys(row: any) {
  cacheForm.value.cacheName = row.cacheName
  subLoading.value = true
  // TODO: 实现获取缓存键名列表的API调用
  subLoading.value = false
}

// 刷新缓存键名列表
function refreshCacheKeys() {
  if (!cacheForm.value.cacheName) {
    ElMessage.warning('请先选择缓存名称')
    return
  }
  getCacheKeys({ cacheName: cacheForm.value.cacheName })
}

// 处理缓存值
function handleCacheValue(row: any) {
  // TODO: 实现获取缓存值的API调用
}

// 清理缓存名称
function handleClearCacheName(row: any) {
  ElMessageBox.confirm(
    `是否确认清理缓存名称为"${row.cacheName}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清理缓存名称的API调用
    ElMessage.success('清理成功')
    refreshCacheNames()
  }).catch(() => {})
}

// 清理缓存键名
function handleClearCacheKey(row: any) {
  ElMessageBox.confirm(
    `是否确认清理缓存键名为"${row.cacheKey}"的数据项？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清理缓存键名的API调用
    ElMessage.success('清理成功')
    refreshCacheKeys()
  }).catch(() => {})
}

// 清理全部缓存
function handleClearCacheAll() {
  ElMessageBox.confirm(
    '是否确认清理全部缓存数据项？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现清理全部缓存的API调用
    ElMessage.success('清理成功')
    refreshCacheNames()
  }).catch(() => {})
}

// 名称格式化
function nameFormatter(row: any, column: any, cellValue: any) {
  return row.cacheName || row.name
}

// 键名格式化
function keyFormatter(row: any, column: any, cellValue: any) {
  return row.cacheKey || row.key
}
</script>

<style scoped>
.cache-list-container {
  padding: 20px;
}

.cache-content {
  padding: 20px;
}
</style>