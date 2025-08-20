<template>
  <div class="pending-measurement">
    <Header
      preset="order-progress"
      :show-search="false"
      title-style="text-3xl text-center pl-0 w-full text-blue-600"
    />

    <!-- 高级表格区域 -->
    <AdvancedTable
      v-model:page="currentPage"
      v-model:size="pageSize"
      v-model:searchType="searchType"
      v-model:searchValue="searchValue"
      :data="filteredTableData"
      :total="total"
      :loading="loading"
      :defaultSearchType="'id'"
      @search="handleSearch"
      @change="handleTableChange"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="cusTitle" label="客户名称" width="120" />
      <el-table-column prop="intention" label="客户称呼" width="100" />
      <el-table-column prop="orderTime" label="预计测量时间" width="150" />
      <el-table-column prop="amount" label="意向度" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" effect="dark">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="style" label="关注风格" width="120" />
      <el-table-column prop="LastContactDate" label="上次联系时间" width="150" />
      <el-table-column prop="cusSource" label="客户来源" width="120" />
      <el-table-column prop="saler" label="业务员" width="100" />
      <el-table-column prop="details" label="详情">
        <template #default="scope">
          <el-button type="primary" link @click="handleDetails(scope.row)" :icon="View">查看详情</el-button>
        </template>
      </el-table-column>
    </AdvancedTable>

    <!-- 分页 -->
    <div class="pagination-container mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 无数据提示 -->
    <div v-if="filteredTableData.length === 0" class="no-data text-center py-10 text-gray-500">
      <div class="empty-icon mb-4">📋</div>
      <p>暂无数据</p>
      <p class="text-sm mt-2">请尝试使用搜索框查询</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { ref, computed, onMounted, watch } from "vue";
import { View } from "@element-plus/icons-vue";
import Header from "@/views/components/header/Header.vue";
import MessageUtils from "@/utils/message";
import AdvancedTable from "@/components/AdvancedTable/index.vue";

// 搜索类型
const searchType = ref("id");

// 搜索值
const searchValue = ref("");

// 加载状态
const loading = ref(false);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 是否显示表格
const showTable = ref(true);

// 表格数据
const tableColsData = ref([
  {
    id: "001",
    cusTitle: "张先生",
    intention: "张先生",
    orderTime: "2023-06-15",
    amount: "高意向",
    status: "待测量",
    style: "现代简约",
    LastContactDate: "2023-06-10",
    cusSource: "朋友推荐",
    saler: "李销售",
    details: "客户已预约测量时间，待确认具体日期",
  },
  {
    id: "002",
    cusTitle: "王女士",
    intention: "王女士",
    orderTime: "2023-06-20",
    amount: "中意向",
    status: "待测量",
    style: "欧式风格",
    LastContactDate: "2023-06-12",
    cusSource: "线上咨询",
    saler: "赵销售",
    details: "客户对设计方案有兴趣，需要进一步沟通",
  },
  {
    id: "003",
    cusTitle: "刘先生",
    intention: "刘先生",
    orderTime: "2023-06-18",
    amount: "高意向",
    status: "待测量",
    style: "中式风格",
    LastContactDate: "2023-06-08",
    cusSource: "门店咨询",
    saler: "王销售",
    details: "客户已确定预算范围，待安排测量",
  },
  {
    id: "004",
    cusTitle: "陈女士",
    intention: "陈女士",
    orderTime: "2023-06-25",
    amount: "中意向",
    status: "待测量",
    style: "美式风格",
    LastContactDate: "2023-06-05",
    cusSource: "老客户介绍",
    saler: "孙销售",
    details: "客户对产品有疑问，需要解答后安排测量",
  },
  {
    id: "005",
    cusTitle: "周先生",
    intention: "周先生",
    orderTime: "2023-06-22",
    amount: "高意向",
    status: "待测量",
    style: "北欧风格",
    LastContactDate: "2023-06-03",
    cusSource: "线上广告",
    saler: "吴销售",
    details: "客户已确定大致需求，待上门测量",
  },
]);

// 计算总数据量
total.value = tableColsData.value.length;

// 根据搜索条件过滤数据
const filteredTableData = computed(() => {
  let result = tableColsData.value;

  // 应用搜索过滤
  if (searchValue.value.trim()) {
    const searchVal = searchValue.value.toLowerCase();

    result = result.filter(item => {
      // 根据搜索类型进行过滤
      if (searchType.value === "id") {
        return item.id.toLowerCase().includes(searchVal);
      } else if (searchType.value === "cusTitle") {
        return item.cusTitle.toLowerCase().includes(searchVal);
      } else if (searchType.value === "saler") {
        return item.saler.toLowerCase().includes(searchVal);
      } else if (searchType.value === "status") {
        return item.status.toLowerCase().includes(searchVal);
      }
      return false;
    });
  }

  // 应用分页
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return result.slice(start, end);
});

// 监听数据变化，更新总数据量
watch(
  () => filteredTableData.value.length,
  (newLength) => {
    total.value = newLength;
  }
)

// 获取状态对应的标签类型
const getStatusType = (status: string) => {
  if (status.includes("待测量")) return "warning";
  if (status.includes("待合同")) return "info";
  if (status.includes("待下单")) return "primary";
  if (status.includes("待安装")) return "success";
  if (status.includes("待收尾")) return "warning";
  if (status.includes("待归档")) return "info";
  return ""; // 默认类型
};

// 定义表格行数据类型
interface TableRowData {
  id: string;
  cusTitle: string;
  intention: string;
  orderTime: string;
  amount: string;
  status: string;
  style: string;
  LastContactDate: string;
  cusSource: string;
  saler: string;
  details: string;
}

// 处理详情点击
const handleDetails = (row: TableRowData) => {
  MessageUtils.success(`查看 ${row.cusTitle} 的详情`);
  // 这里可以添加跳转到详情页的逻辑
};

// 处理表格变化
const handleTableChange = (params: { page: number; size: number; searchType: string; searchValue: string }) => {
  // 这里可以添加处理变化的逻辑
  console.log("表格变化:", params);
};

// 处理搜索
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

  // 重置分页
  currentPage.value = 1;

  // 显示加载状态
  loading.value = true;

  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false;
    MessageUtils.success("搜索成功");
  }, 500);
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置页码
};

// 组件挂载时初始化数据
onMounted(() => {
  // 模拟初始加载
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    // 确保表格数据能正确显示
    showTable.value = true;
    // 设置初始总数据量
    total.value = tableColsData.value.length;
  }, 800);
});
</script>

<style scoped>
/* 组件样式 */
.pending-measurement {
  padding: 0;
  margin: 0;
  width: 100%;
}

/* 表格容器 */
.table-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 表格状态标签 */
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

/* 表格按钮样式 */
:deep(.el-button--primary) {
  color: #409eff;
  font-weight: 500;
}

/* 表格行悬停效果 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 表格表头样式 */
:deep(.el-table__header) {
  background-color: #f5f7fa;
}
</style>
