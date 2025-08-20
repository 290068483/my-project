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
      <el-table :data="filteredTableData" border style="width: 100%" class="custom-table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="cusTitle" label="时间" width="180">
          <template #default="{ row }">
            <span>{{ row.cusTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="intention" label="用户名称" width="120">
          <template #default="{ row }">
            <span>{{ row.intention }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span :class="row.style">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="描述">
          <template #default="{ row }">
            <span>{{ row.details }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { ref, onMounted, computed } from "vue";
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
    status: "待处理",
    style: "text-red-500",
    details: "客户订单待处理",
  },
  {
    id: "002",
    cusTitle: "2023-01-16 14:20",
    intention: "李四",
    status: "处理中",
    style: "text-yellow-500",
    details: "客户订单处理中",
  },
  {
    id: "003",
    cusTitle: "2023-01-17 09:15",
    intention: "王五",
    status: "已完成",
    style: "text-green-500",
    details: "客户订单已完成",
  },
]);

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchValue.value.trim()) {
    return tableData.value;
  }

  const searchVal = searchValue.value.toLowerCase();
  
  return tableData.value.filter(item => {
    if (searchType.value === "id") {
      return item.id.toLowerCase().includes(searchVal);
    } else if (searchType.value === "user") {
      return item.intention.toLowerCase().includes(searchVal);
    } else {
      return (
        item.id.toLowerCase().includes(searchVal) ||
        item.intention.toLowerCase().includes(searchVal) ||
        item.status.toLowerCase().includes(searchVal) ||
        item.details.toLowerCase().includes(searchVal)
      );
    }
  });
});

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

  // 显示搜索成功消息
  const resultCount = filteredTableData.value.length;
  MessageUtils.success(`找到 ${resultCount} 条匹配记录`);
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

/* 自定义表格样式 */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.custom-table .el-table__header {
  background-color: #f5f7fa;
}

.custom-table .el-table__header th {
  background-color: #f5f7fa !important;
  color: #333;
  font-weight: bold;
}

.custom-table .el-table__body tr:hover {
  background-color: #f5f7fa;
}

/* 状态标签样式 */
.text-red-500 {
  color: #f56c6c;
  font-weight: bold;
}

.text-yellow-500 {
  color: #e6a23c;
  font-weight: bold;
}

.text-green-500 {
  color: #67c23a;
  font-weight: bold;
}
</style>
