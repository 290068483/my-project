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
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 表格区域 -->
      <el-table
        v-else
        :data="paginatedData"
        border
        style="width: 100%"
        class="custom-table"
        v-loading="isLoading"
        element-loading-text="加载中..."
      >
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

      <!-- 空数据提示 -->
      <div
        v-if="!isLoading && filteredTableData.length === 0"
        class="empty-data"
      >
        <el-empty description="暂无数据" />
      </div>
      <!-- footer 表格数据统计 -->
      <TableCount
        :stats="countData"
        :field-map="{
          estimateAmount: 'amount',
          deposit: 'deposit',
          unitPrice: 'price',
          contractAmount: 'contract',
        }"
        @data-updated="handleTableCountUpdate"
      />
      <!-- 分页 -->
      <div
        v-if="!isLoading && filteredTableData.length > 0"
        class="pagination-container"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTableData.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import { ref, onMounted, computed } from "vue";
import Header from "@/views/components/header/Header.vue";
import MessageUtils from "@/utils/message";
import TableCount from "./components/TableCount.vue";

// 搜索类型选项
// const searchTypes = [
//   { value: "id", label: "订单ID" },
//   { value: "user", label: "客户名称" },
//   { value: "all", label: "全部内容" },
// ];
// 给统计组件显示的数据
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
    index: "avgDeposit",
    value: 28.9,
    label: "订单平均定金",
  },
  {
    index: "totalUnitPrice",
    value: 53205,
    label: "订单总单价",
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

// 搜索类型
const searchType = ref("id");

// 搜索值
const searchValue = ref("");

// 是否显示表格
const showTable = ref(true);

// 加载状态
const isLoading = ref(false);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 统计数据
const tableStatistics = ref({
  total: 0,
  totalAmount: 0,
  totalDeposit: 0,
  avgDeposit: 0,
  totalUnitPrice: 0,
  avgUnitPrice: 0,
  totalContract: 0,
  avgContract: 0,
});

// 分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end);
});

// 表格数据
const tableData = [
  {
    id: "001",
    cusTitle: "2023-01-15 10:30",
    intention: "张三",
    status: "待处理",
    style: "text-red-500",
    details: "客户订单待处理",
    amount: 125.5, // 估算金额
    deposit: 25.3, // 定金
    price: 4505, // 单价
    contract: 113.2, // 合同款
  },
  {
    id: "002",
    cusTitle: "2023-01-16 14:20",
    intention: "李四",
    status: "处理中",
    style: "text-yellow-500",
    details: "客户订单处理中",
    amount: 98.7, // 估算金额
    deposit: 19.8, // 定金
    price: 3800, // 单价
    contract: 89.5, // 合同款
  },
  {
    id: "003",
    cusTitle: "2023-01-17 09:15",
    intention: "王五",
    status: "已完成",
    style: "text-green-500",
    details: "客户订单已完成",
    amount: 156.3, // 估算金额
    deposit: 31.2, // 定金
    price: 5200, // 单价
    contract: 135.8, // 合同款
  },
  {
    id: "004",
    cusTitle: "2023-01-18 11:45",
    intention: "赵六",
    status: "待处理",
    style: "text-red-500",
    details: "客户订单待处理",
    amount: 78.9, // 估算金额
    deposit: 15.8, // 定金
    price: 3200, // 单价
    contract: 70.5, // 合同款
  },
  {
    id: "005",
    cusTitle: "2023-01-19 16:30",
    intention: "钱七",
    status: "处理中",
    style: "text-yellow-500",
    details: "客户订单处理中",
    amount: 145.2, // 估算金额
    deposit: 29.0, // 定金
    price: 4800, // 单价
    contract: 125.8, // 合同款
  },
  {
    id: "006",
    cusTitle: "2023-01-20 08:20",
    intention: "孙八",
    status: "已完成",
    style: "text-green-500",
    details: "客户订单已完成",
    amount: 189.7, // 估算金额
    deposit: 38.2, // 定金
    price: 5500, // 单价
    contract: 165.3, // 合同款
  },
  {
    id: "007",
    cusTitle: "2023-01-21 13:15",
    intention: "周九",
    status: "待处理",
    style: "text-red-500",
    details: "客户订单待处理",
    amount: 95.4, // 估算金额
    deposit: 19.1, // 定金
    price: 3500, // 单价
    contract: 85.7, // 合同款
  },
  {
    id: "008",
    cusTitle: "2023-01-22 15:40",
    intention: "吴十",
    status: "处理中",
    style: "text-yellow-500",
    details: "客户订单处理中",
    amount: 167.8, // 估算金额
    deposit: 33.6, // 定金
    price: 5100, // 单价
    contract: 145.2, // 合同款
  },
  {
    id: "009",
    cusTitle: "2023-01-23 10:10",
    intention: "郑一",
    status: "已完成",
    style: "text-green-500",
    details: "客户订单已完成",
    amount: 112.3, // 估算金额
    deposit: 22.5, // 定金
    price: 4200, // 单价
    contract: 98.7, // 合同款
  },
  {
    id: "010",
    cusTitle: "2023-01-24 14:55",
    intention: "王二",
    status: "待处理",
    style: "text-red-500",
    details: "客户订单待处理",
    amount: 134.6, // 估算金额
    deposit: 26.9, // 定金
    price: 4700, // 单价
    contract: 118.4, // 合同款
  },
  {
    id: "011",
    cusTitle: "2023-01-25 09:30",
    intention: "李三",
    status: "处理中",
    style: "text-yellow-500",
    details: "客户订单处理中",
    amount: 178.9, // 估算金额
    deposit: 35.8, // 定金
    price: 5300, // 单价
    contract: 155.3, // 合同款
  },
  {
    id: "012",
    cusTitle: "2023-01-26 12:45",
    intention: "张四",
    status: "已完成",
    style: "text-green-500",
    details: "客户订单已完成",
    amount: 98.2, // 估算金额
    deposit: 19.6, // 定金
    price: 3600, // 单价
    contract: 88.5, // 合同款
  },
];

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchValue.value.trim()) {
    return tableData.value;
  }

  const searchVal = searchValue.value.toLowerCase();

  return tableData.value.filter((item) => {
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

  // 显示加载状态
  isLoading.value = true;

  // 更新搜索类型和值
  searchType.value = params.type;
  searchValue.value = params.value;

  // 重置分页
  currentPage.value = 1;

  // 模拟异步加载
  setTimeout(() => {
    // 显示表格
    showTable.value = true;

    // 显示搜索成功消息
    const resultCount = filteredTableData.value.length;
    MessageUtils.success(`找到 ${resultCount} 条匹配记录`);

    // 隐藏加载状态
    isLoading.value = false;

    // 触发统计数据更新
    handleTableCountUpdate([
      { index: "total", value: paginatedData.value.length, label: "订单总数" },
      {
        index: "totalAmount",
        value: paginatedData.value.reduce((sum, item) => sum + item.amount, 0),
        label: "订单总金额",
      },
      {
        index: "totalDeposit",
        value: paginatedData.value.reduce((sum, item) => sum + item.deposit, 0),
        label: "订单总定金",
      },
      {
        index: "avgDeposit",
        value:
          paginatedData.value.reduce((sum, item) => sum + item.deposit, 0) /
          paginatedData.value.length,
        label: "订单平均定金",
      },
      {
        index: "totalUnitPrice",
        value: paginatedData.value.reduce((sum, item) => sum + item.price, 0),
        label: "订单总单价",
      },
      {
        index: "avgUnitPrice",
        value:
          paginatedData.value.reduce((sum, item) => sum + item.price, 0) /
          paginatedData.value.length,
        label: "订单平均单价",
      },
      {
        index: "totalContract",
        value: paginatedData.value.reduce(
          (sum, item) => sum + item.contract,
          0
        ),
        label: "订单总合同款",
      },
      {
        index: "avgContract",
        value:
          paginatedData.value.reduce((sum, item) => sum + item.contract, 0) /
          paginatedData.value.length,
        label: "订单平均合同款",
      },
    ]);
  }, 500);
};

// 分页大小变化处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页

  // 更新统计数据
  handleTableCountUpdate([
    { index: "total", value: paginatedData.value.length, label: "订单总数" },
    {
      index: "totalAmount",
      value: paginatedData.value.reduce((sum, item) => sum + item.amount, 0),
      label: "订单总金额",
    },
    {
      index: "totalDeposit",
      value: paginatedData.value.reduce((sum, item) => sum + item.deposit, 0),
      label: "订单总定金",
    },
    {
      index: "avgDeposit",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.deposit, 0) /
        paginatedData.value.length,
      label: "订单平均定金",
    },
    {
      index: "totalUnitPrice",
      value: paginatedData.value.reduce((sum, item) => sum + item.price, 0),
      label: "订单总单价",
    },
    {
      index: "avgUnitPrice",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.price, 0) /
        paginatedData.value.length,
      label: "订单平均单价",
    },
    {
      index: "totalContract",
      value: paginatedData.value.reduce((sum, item) => sum + item.contract, 0),
      label: "订单总合同款",
    },
    {
      index: "avgContract",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.contract, 0) /
        paginatedData.value.length,
      label: "订单平均合同款",
    },
  ]);
};

// 当前页变化处理
const handleCurrentChange = (val: number) => {
  currentPage.value = val;

  // 更新统计数据
  handleTableCountUpdate([
    { index: "total", value: paginatedData.value.length, label: "订单总数" },
    {
      index: "totalAmount",
      value: paginatedData.value.reduce((sum, item) => sum + item.amount, 0),
      label: "订单总金额",
    },
    {
      index: "totalDeposit",
      value: paginatedData.value.reduce((sum, item) => sum + item.deposit, 0),
      label: "订单总定金",
    },
    {
      index: "avgDeposit",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.deposit, 0) /
        paginatedData.value.length,
      label: "订单平均定金",
    },
    {
      index: "totalUnitPrice",
      value: paginatedData.value.reduce((sum, item) => sum + item.price, 0),
      label: "订单总单价",
    },
    {
      index: "avgUnitPrice",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.price, 0) /
        paginatedData.value.length,
      label: "订单平均单价",
    },
    {
      index: "totalContract",
      value: paginatedData.value.reduce((sum, item) => sum + item.contract, 0),
      label: "订单总合同款",
    },
    {
      index: "avgContract",
      value:
        paginatedData.value.reduce((sum, item) => sum + item.contract, 0) /
        paginatedData.value.length,
      label: "订单平均合同款",
    },
  ]);
};

// 统计数据项类型定义
interface StatItem {
  index: string;
  value: string | number;
  label: string;
}

// 处理统计数据更新
const handleTableCountUpdate = (data: StatItem[]) => {
  console.log("统计数据更新:", data);

  // 更新统计数据对象
  if (data && data.length > 0) {
    // 根据实际需求解析数据
    tableStatistics.value = {
      total: parseInt(data.find((item) => item.index === "total")?.value) || 0,
      totalAmount:
        parseFloat(data.find((item) => item.index === "totalAmount")?.value) ||
        0,
      totalDeposit:
        parseFloat(data.find((item) => item.index === "totalDeposit")?.value) ||
        0,
      avgDeposit:
        parseFloat(data.find((item) => item.index === "avgDeposit")?.value) ||
        0,
      totalUnitPrice:
        parseFloat(
          data.find((item) => item.index === "totalUnitPrice")?.value
        ) || 0,
      avgUnitPrice:
        parseFloat(data.find((item) => item.index === "avgUnitPrice")?.value) ||
        0,
      totalContract:
        parseFloat(
          data.find((item) => item.index === "totalContract")?.value
        ) || 0,
      avgContract:
        parseFloat(data.find((item) => item.index === "avgContract")?.value) ||
        0,
    };

    // 更新countData的值
    countData.value = data;
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  // 模拟加载数据
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    showTable.value = true;

    // 初始化统计数据
    handleTableCountUpdate([
      { index: "total", value: tableData.value.length, label: "订单总数" },
      {
        index: "totalAmount",
        value: tableData.value.reduce((sum, item) => sum + item.amount, 0),
        label: "订单总金额",
      },
      {
        index: "totalDeposit",
        value: tableData.value.reduce((sum, item) => sum + item.deposit, 0),
        label: "订单总定金",
      },
      {
        index: "avgDeposit",
        value:
          tableData.value.reduce((sum, item) => sum + item.deposit, 0) /
          tableData.value.length,
        label: "订单平均定金",
      },
      {
        index: "totalUnitPrice",
        value: tableData.value.reduce((sum, item) => sum + item.price, 0),
        label: "订单总单价",
      },
      {
        index: "avgUnitPrice",
        value:
          tableData.value.reduce((sum, item) => sum + item.price, 0) /
          tableData.value.length,
        label: "订单平均单价",
      },
      {
        index: "totalContract",
        value: tableData.value.reduce((sum, item) => sum + item.contract, 0),
        label: "订单总合同款",
      },
      {
        index: "avgContract",
        value:
          tableData.value.reduce((sum, item) => sum + item.contract, 0) /
          tableData.value.length,
        label: "订单平均合同款",
      },
    ]);
  }, 800);
});
</script>

<style scoped>
/* 组件样式 */
.pendding-order {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 表格区域样式 */
.table-container {
  margin: 20px 0;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 加载状态样式 */
.loading-container {
  padding: 20px;
}

/* 空数据样式 */
.empty-data {
  padding: 40px 0;
  text-align: center;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
}

/* 自定义表格样式 */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
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

/* 响应式布局 */
@media (max-width: 768px) {
  .pendding-order {
    padding: 10px;
  }

  .table-container {
    padding: 0 10px;
  }

  .pagination-container {
    justify-content: center;
  }

  .custom-table {
    font-size: 14px;
  }

  .custom-table .el-table th,
  .custom-table .el-table td {
    padding: 8px;
  }
}
</style>
