<template>
  <div class="user-center-layout">
    <!-- 移动端头部 -->
    <div v-if="isMobile" class="mobile-header">
      <div class="mobile-header-content">
        <el-button type="primary" text @click="toggleNavigation">
          <el-icon><Menu /></el-icon>
        </el-button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <el-button type="primary" text @click="showUserMenu = !showUserMenu">
          <el-icon><User /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 导航侧边栏 -->
    <div
      class="navigation-sidebar"
      :class="{ 'sidebar-hidden': isMobile && !showNavigation, 'sidebar-visible': !isMobile || showNavigation }">
      <UserCenterNavigation
        :show-security-tips="showSecurityTips"
        @menu-change="handleMenuChange"
        @edit-profile="handleEditProfile"
        @refresh="handleRefresh" />
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 桌面端页面头部 -->
      <div v-if="!isMobile" class="desktop-header">
        <div class="header-content">
          <div class="page-info">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <p v-if="pageDescription" class="page-description">{{ pageDescription }}</p>
          </div>
          <div class="header-actions">
            <el-button v-if="showBackButton" @click="goBack" size="default">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <slot name="header-actions"></slot>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 面包屑导航 -->
        <el-breadcrumb v-if="breadcrumbs.length > 0" class="breadcrumb-nav" separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path || undefined">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 主要内容插槽 -->
        <div class="main-content-body">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- 移动端导航遮罩 -->
    <div v-if="isMobile && showNavigation" class="navigation-overlay" @click="toggleNavigation"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { Menu, User, ArrowLeft } from "@element-plus/icons-vue";
import UserCenterNavigation from "./UserCenterNavigation.vue";

// Props
const props = defineProps<{
  pageTitle?: string;
  pageDescription?: string;
  showBackButton?: boolean;
  showSecurityTips?: boolean;
  breadcrumbs?: Array<{ title: string; path?: string }>;
}>();

// Emits
const emit = defineEmits<{
  menuChange: [path: string];
  editProfile: [];
  refresh: [];
  back: [];
}>();

const router = useRouter();
const route = useRoute();

// 响应式数据
const showNavigation = ref(false);
const showUserMenu = ref(false);
const screenWidth = ref(window.innerWidth);

// 计算属性
const isMobile = computed(() => screenWidth.value < 768);

const pageTitle = computed(() => {
  if (props.pageTitle) return props.pageTitle;

  const titleMap: Record<string, string> = {
    "/userinfo": "基本资料",
    "/security-settings": "安全设置",
    "/notification-settings": "通知设置",
    "/data-management": "数据管理",
    "/permission-management": "权限管理",
  };

  return titleMap[route.path] || "用户中心";
});

const breadcrumbs = computed(() => {
  if (props.breadcrumbs) return props.breadcrumbs;

  const pathSegments = route.path.split("/").filter(Boolean);
  const breadcrumbMap: Record<string, string> = {
    userinfo: "基本资料",
    "security-settings": "安全设置",
    "notification-settings": "通知设置",
    "data-management": "数据管理",
    "permission-management": "权限管理",
  };

  const breadcrumbs = [{ title: "用户中心", path: "/userinfo" }];

  if (pathSegments.length > 0 && pathSegments[0] !== "userinfo") {
    const segment = pathSegments[pathSegments.length - 1];
    const title = breadcrumbMap[segment];
    if (title) {
      breadcrumbs.push({ title, path: "" });
    }
  }

  return breadcrumbs;
});

// 方法
const toggleNavigation = () => {
  showNavigation.value = !showNavigation.value;
};

const handleMenuChange = (path: string) => {
  emit("menuChange", path);
  if (isMobile.value) {
    showNavigation.value = false;
  }
};

const handleEditProfile = () => {
  emit("editProfile");
  router.push("/userinfo");
  showUserMenu.value = false;
};

const handleRefresh = () => {
  emit("refresh");
  showUserMenu.value = false;
};

const goBack = () => {
  emit("back");
  router.go(-1);
};

// 窗口大小监听
const handleResize = () => {
  screenWidth.value = window.innerWidth;

  // 桌面端自动显示导航
  if (screenWidth.value >= 768) {
    showNavigation.value = false;
  }
};

// 生命周期
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.user-center-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 移动端头部 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  z-index: 1000;
}

.mobile-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
}

.mobile-header .page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* 导航侧边栏 */
.navigation-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  z-index: 999;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}

.navigation-sidebar.sidebar-visible {
  transform: translateX(0);
}

/* 桌面端导航 */
@media (min-width: 768px) {
  .navigation-sidebar {
    position: static;
    transform: none;
    flex-shrink: 0;
  }
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 移动端主内容上边距 */
@media (max-width: 767px) {
  .main-content {
    margin-top: 60px;
  }
}

/* 桌面端头部 */
.desktop-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 32px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-info .page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #303133;
}

.page-info .page-description {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;
}

@media (max-width: 767px) {
  .content-area {
    padding: 16px;
  }
}

.breadcrumb-nav {
  margin-bottom: 24px;
}

.main-content-body {
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 200px);
}

/* 导航遮罩 */
.navigation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>
