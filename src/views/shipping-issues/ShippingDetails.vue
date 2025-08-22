<template>
  <div class="shipping-page">
    <Header
      title="出货进度及问题汇总表"
      preset="shipping"
      :show-search="true"
      title-style="text-3xl text-center pl-0 w-full text-blue-600"
      @search="handleSearch"
    />
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <TableCount :stats="countData" />
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import TableCount from "../components/TableCount.vue";
import { ref } from "vue";
import Header from "@/views/components/header/Header.vue";

const countData = ref([
  {
    index: "total",
    value: 12,
    label: "订单总数",
  },
  {
    index: "totalAmount",
    value: 1730.5,
    label: "订单总金额",
  },
  {
    index: "totalDeposit",
    value: 346.3,
    label: "订单总定金",
  },

  {
    index: "avgUnitPrice",
    value: 4434,
    label: "订单平均单价",
  },
  {
    index: "totalContract",
    value: 1501.7,
    label: "订单总合同款",
  },
  {
    index: "avgContract",
    value: 386.7,
    label: "订单平均合同款",
  },
]);

const handleSearch = (value: string) => {
  console.log("搜索:", value);
};

const tableData = ref([
  {
    date: "2016-05-02",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1518 弄",
  },
  {
    date: "2016-05-04",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1517 弄",
  },
  {
    date: "2016-05-01",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1519 弄",
  },
  {
    date: "2016-05-03",
    name: "王小虎",
    address: "上海市普陀区金沙江路 1516 弄",
  },
]);
</script>

<style scoped>
.ShippingDetails {
  padding: 20px;
}

.shipping-page {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.shipping-page :deep(.el-table) {
  margin-top: 20px;
}

.shipping-page :deep(.table-count) {
  margin-top: 20px;
}
</style>
