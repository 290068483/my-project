<template>
  <div class="component-product-details">
    <!-- 头部 -->
    <Header />
    <div class="table-container">
      <el-table :data="tableData" align="center" style="width: 100%">
        <el-table-column prop="id" label="id:" width="180" />
        <el-table-column prop="name" label="名称：" width="180" />
        <el-table-column prop="type1" label="规格1:" />
        <el-table-column prop="type2" label="规格2:" />
        <el-table-column prop="type3" label="规格3:" />
        <el-table-column prop="count" label="数量:" />
        <el-table-column prop="unit" label="单位:" />
        <el-table-column prop="supplier" label="供货商:" />
        <el-table-column prop="source" label="来源方式:" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑

// 引入组件
import Header from "@/views/components/header/Header.vue";
import { ref } from "vue";

const tableData = ref([
  {
    id: 1,
    name: "产品1",
    type1: "规格1",
    type2: "规格2",
    type3: "规格3",
    count: 100,
    unit: "个",
    supplier: "供货商1",
    source: "采购",
  },
  {
    id: 2,
    name: "产品2",
    type1: "规格1",
    type2: "规格2",
    type3: "规格3",
    count: 200,
    unit: "个",
    supplier: "供货商2",
    source: "采购",
  },
  {
    id: 3,
    name: "产品3",
    type1: "规格1",
    type2: "规格2",
    type3: "规格3",
    count: 300,
    unit: "个",
    supplier: "供货商3",
    source: "采购",
  },
  {
    id: 4,
    name: "产品4",
    type1: "规格1",
    type2: "规格2",
    type3: "规格3",
    count: 400,
    unit: "个",
    supplier: "供货商4",
    source: "采购",
  },
]);
</script>

<style scoped>
/* 组件样式 */
</style>
