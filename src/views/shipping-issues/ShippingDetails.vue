<template>
  <div class="ShippingDetails"></div>
  <Header
    title="发货详情"
    preset="order-progress"
    :show-search="true"
    title-style="text-3xl text-center pl-0 w-full text-blue-600"
    @search="handleSearch"
  />
  <TableCount :stats="countData" />
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
    value: 125.1,
    label: "订单平均合同款",
  },
]);

const handleSearch = (val: string) => {
  console.log(val);
};
</script>

<style scoped>
/* 组件样式 */
.ShippingDetails {
  height: 100%;
  margin: 0 auto;
  text-align: center;
}
</style>
