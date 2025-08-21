<template>
  <div class="custom-header mb-10 mt-10">
    <!-- 标题和按钮区域 -->
    <div class="titleBox mt-5 flex justify-between items-center px-6 mb-3">
      <div class="flex-1 flex justify-center">
        <h1 :class="titleStyle">
          {{ computedTitle }}
        </h1>
      </div>
      <el-button type="primary" class="text-white" @click="handleProfileClick"
        >进入客户档案</el-button
      >
    </div>

    <!-- 导航和搜索区域 -->
    <div
      class="nav-search-container flex justify-between items-center px-6 mb-3"
    >
      <!-- 面包屑导航区域 -->
      <div class="nav-container flex-1 mr-4">
        <el-breadcrumb
          separator="/"
          :default-active="computedDefaultActive"
          class="el-menu-demo active:text-red active:bg-white"
          mode="horizontal"
          @select="handleSelect"
          :ellipsis="false"
        >
          <el-breadcrumb-item
            :to="{ path: item.path }"
            v-for="(item, index) in computedItems"
            :key="index"
            :index="item.index"
            class="text-white py-1 px-4"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 搜索区域 -->
      <div class="search-container flex-1 ml-4">
        <SearchBox
          :show="showSearch"
          :type="searchType"
          @search="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import SearchBox from "./SearchBox.vue";

// 默认标题
const defaultTitle = "陆泰-重庆市万科蓝岸三期";

// 订单进度表标题
const orderProgressTitle = "订单进度表";
// 订单进度表菜单数据
const orderProgressItems = [
  // 待预约
  {
    title: "待预约",
    index: "pending-orders",
    active: true,
    path: "/pending-orders",
  },
  {
    title: "待定单",
    index: "pending-reservation",
    path: "/pending-reservation",
  },
  {
    title: "待测量",
    index: "pending-measurement",
    path: "/pending-measurement",
  },
  { title: "待合同", index: "pending-contracts", path: "/pending-contracts" },
  { title: "待下单", index: "pending-orders", path: "/pending-orders" },
  {
    title: "待安装",
    index: "pending-installation",
    path: "/pending-installation",
  },
  {
    title: "待收尾",
    index: "pending-finalization",
    path: "/pending-finalization",
  },
  { title: "待归档", index: "pending-archiving", path: "/pending-archiving" },
];
// 出货header导航
const shippingItems = [
  {
    title: "出货总览",
    index: "ShippingOverview",
    active: true,
    path: "/shipping-overview",
  },
  {
    title: "出货明细",
    index: "ShippingDetails",
    path: "/shipping-details",
  },
  {
    title: "问题明细",
    index: "IssueDetails",
    path: "/issue-details",
  },
];

// 默认菜单数据（当没有传入items且preset为default或custom时使用）
const defaultItems = [
  { title: "首页", index: "home", active: true, path: "/" },
  { title: "全部档案", index: "custom-doc", path: "/custom-doc" },
  { title: "定单详情", index: "custom-dts", path: "/custom-dts" },
  { title: "合同详情", index: "contract-details", path: "/pending-contracts" },
  { title: "产品详情", index: "custom-p", path: "/custom-progress" },
  { title: "出货", index: "shipping", path: "/shipping-overview" },
];

// 定义组件的属性
const props = defineProps({
  // 菜单项数组
  items: {
    type: Array as () => Array<{
      title: string;
      index: string;
      active?: boolean;
      path?: string;
    }>,
    default: () => [],
  },
  // 预设类型
  preset: {
    type: String as () => "default" | "order-progress" | "custom" | "shipping",
    default: "default",
    validator: (value: string) =>
      ["default", "order-progress", "custom"].includes(value),
  },
  // 默认激活的菜单项索引
  defaultActive: {
    type: String,
    default: "出货总览",
  },
  // 标题
  title: {
    type: String,
    default: "",
  },
  // 标题样式
  titleStyle: {
    type: String,
    default: "text-5xl text-center  min-w-[80%] font-bold text-gray-800",
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: false,
  },
  // 搜索类型
  searchType: {
    type: String,
    default: "id",
  },
});

// 定义组件的事件
const emit = defineEmits(["select", "profile-click", "search"]);

// 计算属性：根据预设类型自动填充数据
const computedItems = computed(() => {
  if (props.items.length > 0) {
    return props.items; // 如果传入了自定义数据，则使用自定义数据
  }

  // 如果没有传入items，则使用默认值
  if (props.preset === "custom") return defaultItems;
  // 出货header导航
  if (props.preset === "shipping") {
    return shippingItems;
  }
  if (props.preset === "order-progress") {
    return orderProgressItems;
  }

  // 根据预设类型返回默认数据
  return defaultItems;
});

// 计算属性：根据预设类型自动填充标题
const computedTitle = computed(() => {
  return (
    props.title ||
    (props.preset === "order-progress" ? orderProgressTitle : defaultTitle)
  );
});

// 计算属性：根据预设类型自动填充默认激活项
const computedDefaultActive = computed(() => {
  return props.defaultActive;
});

// 处理搜索事件
const handleSearch = (params: { type: string; value: string }) => {
  emit("search", params);
};

// 处理菜单选择事件
const handleSelect = (key: string) => {
  emit("select", key);
  console.log("key:", key);
};

// 处理客户档案按钮点击
const handleProfileClick = () => {
  emit("profile-click");
};
</script>

<style scoped>
.nav-search-container {
  width: 100%;
}

.nav-container {
  min-width: 200px;
}

.search-container {
  min-width: 300px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-search-container {
    flex-direction: column;
  }

  .nav-container {
    margin-right: 0;
    margin-bottom: 15px;
    width: 100%;
  }

  .search-container {
    margin-left: 0;
    width: 100%;
  }
}
.titleBox {
  margin-bottom: 15px;
}
.custom-header {
  width: 100%;
  background-color: #f3f4f6; /* 灰色背景，与原来一致 */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-sm */
  margin-top: 2.5rem; /* mt-10 */
  margin-bottom: 2.5rem; /* mb-10 */
}

.el-menu-demo {
  border-bottom: none;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 40px; /* 与原来按钮高度一致 */
  line-height: 40px; /* 与原来按钮高度一致 */
  font-size: 14px; /* 与原来按钮文字大小一致 */
  /* color: #374151;  */
  border-bottom: 2px solid transparent;

  margin-right: 0.5rem; /* space-x-6 大约对应 mr-1.5 */
  padding: 0 0.75rem; /* px-3 */
  border-radius: 0.375rem; /* rounded */
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms; /* transition-colors */
}

:deep(.el-menu--horizontal > .el-menu-item:hover) {
  background-color: #e5e7eb; /* hover:bg-gray-300 */
  color: #374151;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  color: white; /* text-white */
  background-color: #3b82f6;
}
</style>
