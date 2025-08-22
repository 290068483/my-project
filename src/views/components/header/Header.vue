<template>
  <div class="custom-header">
    <!-- 渐变背景装饰 -->
    <div class="header-bg-gradient"></div>

    <!-- 内容区域 -->
    <div class="header-content">
      <!-- 标题和按钮区域 -->
      <div class="title-section">
        <div class="title-wrapper">
          <div class="title-icon">
            <el-icon><House /></el-icon>
          </div>
          <h1 :class="titleStyle">
            {{ computedTitle }}
          </h1>
        </div>
        <el-button
          type="primary"
          class="profile-btn"
          @click="handleProfileClick"
          :icon="User"
        >
          <span>进入客户档案</span>
        </el-button>
      </div>

      <!-- 导航和搜索区域 -->
      <div class="nav-search-section">
        <!-- 标签页导航区域 -->
        <div class="nav-wrapper">
          <el-tabs
            v-model="activeTab"
            class="nav-tabs"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              v-for="(item, index) in computedItems"
              :key="index"
              :name="item.index"
              :label="item.title"
            />
          </el-tabs>
        </div>

        <!-- 搜索区域 -->
        <div class="search-wrapper">
          <SearchBox
            :show="showSearch"
            :type="searchType"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AppHeader",
});

import { defineProps, defineEmits, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SearchBox from "./SearchBox.vue";
import { House, User } from "@element-plus/icons-vue";

// 默认标题
const defaultTitle = "陆泰-重庆市万科蓝岸三期";

// 订单进度表标题
const orderProgressTitle = "客户进度表";
// 客户进度表菜单数据
const orderProgressItems = [
  // 待预约
  {
    title: "待预约",
    index: "pending-reservation",
    active: true,
    path: "/pending-reservation",
  },
  {
    title: "待定单",
    index: "pending-orders",
    path: "/pending-orders",
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
    index: "shipping-overview",
    active: true,
    path: "/shipping-overview",
  },
  {
    title: "出货明细",
    index: "shipping-details",
    path: "/shipping-details",
  },
  {
    title: "问题明细",
    index: "shipping-issues",  // 修改索引为shipping-issues保持一致性
    path: "/shipping-issues",  // 修改路径为/shipping-issues保持一致性
  },
];

// 客户详情header导航
const defaultItems = [
  { title: "客户首页", index: "home", active: true, path: "/home" },
  { title: "全部档案", index: "custom-doc", path: "/custom-doc" },
  { title: "定单详情", index: "order-details", path: "/order-details" },
  { title: "合同详情", index: "contract-details", path: "/contract-details" },
  { title: "产品详情", index: "product-details", path: "/product-details" },
  { title: "出货", index: "shipping", path: "/shipping" },
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
      ["default", "order-progress", "custom", "shipping"].includes(value),
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
const emit = defineEmits(["select", "profile-click", "search", "tab-click"]);

// 当前激活的标签页
const activeTab = ref("");

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

// 初始化激活标签页
onMounted(() => {
  // 找到当前激活的菜单项
  const activeItem = computedItems.value.find((item) => item.active);
  
  // 如果有激活项，设置activeTab
  if (activeItem) {
    activeTab.value = activeItem.index;
  } else {
    // 否则使用默认激活项
    const defaultItem = computedItems.value.find(
      (item) => item.title === computedDefaultActive.value
    );
    activeTab.value = defaultItem ? defaultItem.index : computedItems.value[0]?.index;
  }
});

// 处理搜索事件
const handleSearch = (params: { type: string; value: string }) => {
  emit("search", params);
};

// 处理标签页点击事件
const handleTabClick = (tab: { props: { name: string } }) => {
  const clickedItem = computedItems.value.find(
    (item) => item.index === tab.props.name
  );
  
  if (clickedItem) {
    // 更新激活的标签页
    activeTab.value = clickedItem.index;
    
    // 发出select事件
    emit("select", clickedItem.index);
    emit("tab-click", clickedItem);

    console.log(
      "当前点击的标签:",
      clickedItem.title,
      "路径:",
      clickedItem.path || "无路由路径"
    );

    // 如果有路由路径，进行路由跳转
    if (clickedItem.path) {
      const router = useRouter();
      if (router) {
        router.push(clickedItem.path).catch((err) => {
          // 处理路由跳转错误（如路由不存在）
          console.warn("路由跳转失败:", err);
        });
      }
    }
  }
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
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  margin-top: 1.5rem;
}

.header-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #ede9fe 100%);
  opacity: 0.95;
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 1;
  padding: 1.5rem;
  color: white;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.title-wrapper {
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.profile-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #1e40af; /* 使用深蓝色文字，提高对比度 */
  font-weight: 600; /* 增加字体粗细 */
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.7); /* 添加文字阴影增强可读性 */
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  color: #1e3a8a; /* hover时使用更深的蓝色 */
}

.nav-search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.nav-wrapper {
  flex: 1;
  min-width: 250px;
  margin-right: 1.5rem;
}

.search-wrapper {
  flex: 1;
  min-width: 300px;
}

/* 标签页导航样式 */
.nav-tabs {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(226, 232, 240, 0.7);
}

:deep(.el-tabs__item) {
  color: #1e40af;
  font-weight: 500;
  padding: 0 1rem;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item:hover) {
  color: #1d4ed8;
}

:deep(.el-tabs__item.is-active) {
  color: #1e3a8a;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background-color: #3b82f6;
  height: 3px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-header {
    border-radius: 0;
  }

  .nav-search-section {
    flex-direction: column;
  }

  .nav-wrapper {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }

  .search-wrapper {
    width: 100%;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
