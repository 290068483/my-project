<template>
  <div class="pendding-order">
    <Header
      preset="order-progress"
      :show-search="true"
      :search-type="'id'"
      title-style="text-3xl text-center pl-0 w-full text-blue-600"
      @search="handleSearch"
    />

    <!-- 表格区域 -->
    <div class="table-container" v-if="showTable">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="user" label="用户名称" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="description" label="描述" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { ref, onMounted } from "vue";
import Header from "@/views/components/header/Header.vue";
import MessageUtils from "@/utils/message";

// 搜索类型
const searchType = ref("id");

// 搜索值
const searchValue = ref("");

// 是否显示表格
const showTable = ref(true);

// 表格数据
const tableData = ref([
  {
    id: "001",
    cusTitle: "2023-01-15 10:30",
    intention: "张三",
    orderTime: "待处理",
    amount: "客户订单待处理",
    status: "待处理",
    style: "text-red-500",
    LastContactDate: "2023-01-15",
    cusSource: "客户订单待处理",
    saler: "张三",
    details: "客户订单待处理",
  },
  {
    id: "002",
    cusTitle: "2023-01-15 10:30",
    intention: "张三",
    orderTime: "待处理",
    amount: "客户订单待处理",
    status: "待处理",
    style: "text-red-500",
    LastContactDate: "2023-01-15",
    cusSource: "客户订单待处理",
    saler: "张三",
    details: "客户订单待处理",
  },
]);

// 搜索方法
const handleSearch = (params: { type: string; value: string }) => {
  if (!params.value.trim()) {
    MessageUtils.warning("请输入搜索内容");
    return;
  }

  // 更新搜索类型和值
  searchType.value = params.type;
  searchValue.value = params.value;

  // 显示表格
  showTable.value = true;

  // 这里可以添加实际的搜索逻辑
  console.log("搜索类型:", searchType.value);
  console.log("搜索值:", searchValue.value);

  // 显示搜索成功消息
  MessageUtils.success("搜索成功");
};

// 组件挂载时初始化数据
onMounted(() => {
  // 可以在这里初始化数据
});
</script>

<style scoped>
/* 组件样式 */
.pendding-order {
  padding: 0;
  margin: 0;
  width: 100%;
}

/* 表格区域样式 */
.table-container {
  margin: 20px 0;
  padding: 0 20px;
}
</style>
