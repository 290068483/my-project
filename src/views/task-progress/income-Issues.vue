<template>
  <div class="component-CusDtl-Issues"></div>
  <!-- 头部 -->
  <Header />

  <!-- 内容表格 -->
  <div class="table-container">
    <el-table
      :data="tableData"
      header-align="center"
      highlight-current-row
      border
      v-loading="loading"
      :element-loading-text="loadingText">
      <el-table-column align="center" prop="nameOfPayment" label="款项名称" />
      <el-table-column align="center" prop="performanceRatio" label="业绩占比" />
      <el-table-column align="center" prop="accountsReceivable" label="应收支款" />
      <el-table-column align="center" prop="currentSettlement" label="当前结算" />

      <el-table-column align="center" prop="completionRate" label="完成率">
        <!-- 单个单元格容器 -->
        <template #default="{ row }">
          <span :class="row.style">{{ row.completionRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="settlementEventNumber" label="结算事件号" />
    </el-table>
    <!-- <TableCount :stats="countData" /> -->
  </div>
</template>

<script setup lang="ts">
import Header from "@/views/components/header/Header.vue";
import { ref, onMounted } from "vue";

// 表格加载状态
const loading = ref(false);
const loadingText = ref("加载中...");

// 给完成率配置颜色
function formatterRate(row: number) {
  const rate = row;
  let color = "Danger";
  if (rate >= 80) color = "Success";
  else if (rate >= 50) color = "Warning";
  else color = "Danger";
  console.log("row:", row);
  return color;
}

// 表格数据
const tableData = ref([
  {
    nameOfPayment: "家具安装",
    performanceRatio: "30%",
    accountsReceivable: "494444",
    currentSettlement: "结算",
    completionRate: "100%",
    settlementEventNumber: "00112441",
    style: formatterRate(100),
  },
  {
    nameOfPayment: "家具安装",
    performanceRatio: "30%",
    accountsReceivable: "494444",
    currentSettlement: "结算",
    completionRate: "100%",
    settlementEventNumber: "00112441",
    style: formatterRate(30),
  },
  {
    nameOfPayment: "家具安装",
    performanceRatio: "40%",
    accountsReceivable: "494444",
    currentSettlement: "结算",
    completionRate: "50%",
    settlementEventNumber: "00112441",
    style: formatterRate(50),
  },
  {
    nameOfPayment: "家具安装",
    performanceRatio: "50%",
    accountsReceivable: "494444",
    currentSettlement: "结算",
    completionRate: "30%",
    settlementEventNumber: "00112441",
    style: formatterRate(30),
  },
]);

// 模拟加载数据
onMounted(() => {
  loading.value = true;
  // 模拟异步加载数据
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<style scoped>
/* 组件样式 */
.table-container {
  width: 80%;
  margin: 0 auto;
}
</style>
