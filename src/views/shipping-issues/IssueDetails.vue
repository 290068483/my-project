<template>
  <div class="component-name">
    <!-- Header -->

    <Header
      title="出货问题详情"
      preset="shipping"
      :show-search="true"
      title-style="text-3xl text-center pl-0 w-full text-blue-600"
    />
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <TableCount :stats="countData" />
  </div>
</template>

<script setup lang="ts">
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
]);
interface User {
  date: string;
  name: string;
  address: string;
}
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User;
  rowIndex: number;
}) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};

const tableData: User[] = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
