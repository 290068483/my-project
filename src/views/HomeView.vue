<template>
  <div class="home-container bg-[#d3ceca] min-h-screen min-w-full bg-neutral flex flex-col font-sans">
    <!-- 网络错误提示 -->
    <div v-if="hasNetworkError" class="network-warning bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <p class="text-yellow-700 text-sm">🔍 网络连接不稳定，部分数据可能不是最新的，但页面功能正常</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="!isComponentReady" class="loading-container flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600">正在加载页面...</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-show="isComponentReady" class="w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex-grow">
      <!-- 用户信息和欢迎区域 -->
      <div
        class="user-info-area border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-gray-50 flex flex-col sm:flex-row flex-wrap items-center shadow-sm">
        <div class="user-details min-w-[300px] flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0 w-full sm:w-auto">
          <div
            class="user-avatar w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md border border-primary/20">
            {{ userInfo.avatar }}
          </div>
          <div class="user-text">
            <div class="user-info-grid">
              <div class="info-label">姓名：</div>
              <div class="info-value">{{ userInfo.name }}</div>
              <div class="info-label">所属部门：</div>
              <div class="info-value">{{ userInfo.department }}</div>
              <div class="info-label">职位：</div>
              <div class="info-value">{{ userInfo.position }}</div>
            </div>
          </div>
        </div>

        <div class="welcome-section text-right">
          <h1 class="text-lg sm:text-xl font-bold text-primary">欢迎进入九素工作台</h1>
          <div class="p-box flex item-center justify-center gap-5 pr-20">
            <p class="text-sm text-gray-500 mt-1">
              {{ getDate }}<text class="text-red-500">{{ getTime }}</text>
            </p>
            <p class="text-xs text-gray-400">{{ getLunarDate }} {{ getWeekday }}</p>
          </div>
        </div>
        <div
          class="todo-reminder text-sm text-red-500 font-medium flex items-center cursor-pointer hover:underline bg-red-50 px-3 py-1 rounded-full">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          请及时录入工作进度
        </div>
      </div>

      <!-- 通知和待办区域 -->
      <div class="notification-area px-4 sm:px-6 py-2 sm:py-3 bg-white border-t border-gray-100">
        <el-carousel :interval="4000" type="card" height="130px" class="notification-carousel">
          <el-carousel-item
            v-for="notification in homeStore.getNotifications"
            :key="notification.id"
            class="notification-item-container">
            <div
              class="notification-item border rounded-md px-5 py-3 flex items-start space-x-3 h-full hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 w-full"
              :class="notification.type">
              <svg
                class="w-5 h-5 flex-shrink-0 mt-0.5"
                :class="notification.iconColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="notification.iconPath"></path>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-700">
                  <span class="font-semibold">{{ notification.title }}：</span>
                  <span class="notification-content">{{ notification.content }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ notification.time }}
                </p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 快捷信息区域 -->
      <div class="quick-info gap-5 rounded-lg shadow-card">
        <div
          v-for="(card, index) in quickInfoCards"
          :key="index"
          class="info-card bg-[#3b3838] rounded-sm shadow-card p-4 border border-gray-100 hover:shadow-card-hover transition-all duration-300 flex item-center transform hover:-translate-y-1"
          :class="card.bgColor">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <h3 class="text-sm font-semibold text-white">今日待处理事件<text class="text-red-500 pl-2">条</text></h3>
        </div>
        <div>
          <el-button type="primary" size="medium" @click="handleButtonClick">录入新进度</el-button>
        </div>
      </div>
      <!-- 数据表格区域 -->
      <div class="data-tables grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 待处理事件表格 -->

        <div
          class="table-container bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div
            class="table-header table-title bg-blue-50 px-4 py-2 border-b border-primary-dark flex justify-between items-center">
            <h3 class="text-sm text-center mx-auto font-semibold">本人待处理的所有事项</h3>
            <!-- <button class="text-xs text-white hover:text-blue-200 flex items-center">
            <span>详情</span>
            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button> -->
          </div>
          <!-- 表格 -->
          <el-table
            :data="data1.data"
            style="width: 100%"
            stripe
            border
            :default-sort="{ prop: 'id', order: 'descending' }"
            @sort-change="sortBy">
            <el-table-column prop="id" label="id:" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名：" width="80" align="center"></el-table-column>
            <el-table-column prop="count" label="数量：" width="80" align="center"></el-table-column>
            <el-table-column prop="details" label="详情："></el-table-column>
          </el-table>
        </div>

        <!-- 与本人关联事项表格 -->
        <div
          class="table-container rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div
            class="table-header table-title bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
            <h3 class="text-sm font-semibold">与本人关联的所有事项</h3>
          </div>
          <!-- 表格 -->
          <el-table
            :data="data2.data"
            style="width: 100%"
            stripe
            border
            :default-sort="{ prop: 'id', order: 'descending' }"
            @sort-change="sortBy">
            <el-table-column prop="id" label="id:" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名：" width="180" align="center"></el-table-column>
            <el-table-column prop="count" label="数量：" width="180" align="center"></el-table-column>
            <el-table-column prop="details" label="详情："></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onErrorCaptured } from "vue";
import { useUserStore } from "@/stores/user";
import { useHomeStore } from "@/stores/home";
import { getFullDateWithWeekday } from "@/utils/dateUtils";
import moment from "moment";
import "moment/locale/zh-cn";
import { ElMessage } from "element-plus";

// 设置moment.js为中文
moment.locale("zh-cn");

// 定义常量
const DEFAULT_AVATAR = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

// 组件正常加载状态
const isComponentReady = ref(false);
const hasNetworkError = ref(false);

// 使用stores
const userStore = useUserStore();
const homeStore = useHomeStore();

// 错误捕获器
onErrorCaptured((error) => {
  console.warn("🚨 组件错误捕获:", error);
  // 不阻止组件渲染
  return false;
});

onMounted(async () => {
  try {
    // 初始化用户信息（在localStorage中有数据的话）
    userStore.initUserInfo();

    // 尝试获取用户信息（如果有Token的话）
    if (userStore.token) {
      try {
        await userStore.fetchUserInfo();
      } catch (error) {
        console.warn("🔍 获取用户信息失败，使用本地数据:", error);
        hasNetworkError.value = true;
      }
    }
  } catch (error) {
    console.error("🚨 初始化失败:", error);
    hasNetworkError.value = true;
  } finally {
    // 无论是否成功，都设置组件为准备就绪状态
    isComponentReady.value = true;
  }
});

// 计算属性获取用户信息
const userInfo = computed(() => {
  const info = userStore.getUserInfo;
  return {
    name: info?.name || info?.nickname || "未设置",
    position: info?.position || "未设置",
    department: info?.department || "未设置",
    avatar: info?.avatar || DEFAULT_AVATAR,
  };
});

// 计算属性获取当前日期
const getDate = computed(() => {
  return homeStore.getDate || moment().format("YYYY-MM-DD");
});

// 计算属性获取农历日期
const getLunarDate = computed(() => {
  return homeStore.getLunarDate || "农历日期";
});

// 计算属性获取星期
const getWeekday = computed(() => {
  return homeStore.getWeekdays || moment().format("dddd");
});

// 计算属性获取当前时间
const getTime = computed(() => {
  return homeStore.getTime || moment().format("HH:mm:ss");
});

// 从 homeStore 获取数据
const quickStats = computed(() => homeStore.getQuickStats);
const pendingItems = computed(() => homeStore.getPendingItems);
const relatedItems = computed(() => homeStore.getRelatedItems);
const announcements = computed(() => homeStore.getAnnouncements);
const data1 = computed(() => homeStore.getData1);
const data2 = computed(() => homeStore.getData1);

const showItemDetails = (name: string) => {
  homeStore.showItemDetails(name);
};

const viewAnnouncement = (announcement: Announcement) => {
  homeStore.viewAnnouncement(announcement);
};

const quickInfoCards = [{ bgColor: "bg-[#3b3838]" }, { bgColor: "bg-[#3b3838]" }, { bgColor: "bg-[#002060]" }];

function handleButtonClick() {
  // TODO: 实现录入新进度功能
  console.log("录入新进度按钮被点击");
}

function sortBy(sortConfig: any) {
  console.log("排序配置:", sortConfig);
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-300 {
  scrollbar-color: rgba(209, 213, 219, 0.5) transparent;
}

.scrollbar-track-gray-100 {
  scrollbar-track-color: rgba(243, 244, 246, 0.5);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .data-tables {
    grid-template-columns: 1fr;
  }
}

/* 鼠标悬停效果增强 */
#pending-tasks-table tr:hover td:last-child span {
  text-decoration: underline;
  color: #2563eb;
}

.user-info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 10px;
}

.info-label {
  text-align: right;
  padding-left: 15px;
  color: #4b5563; /* text-gray-600 */
  font-size: 0.875rem; /* text-sm */
  white-space: nowrap;
}

.info-value {
  text-align: left;
  color: #1f2937; /* text-gray-800 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
}
.table-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info-area,
.user-info-area * {
  font-weight: 500;
}

/* 轮播通知样式 */
.notification-carousel :deep(.el-carousel__container) {
  height: 130px;
}

.notification-carousel :deep(.el-carousel__item) {
  width: calc(30% - 15px);
  margin: 0 7.5px;
}

.notification-item-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
}

.notification-item {
  width: 100%;
  max-width: none;
  height: 90px;
  margin: 0;
}

.notification-content {
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-right {
  flex: 1;
  text-align: center;
  /* 文本右边缩进100px */
  & > h1 {
    padding-right: 100px;
  }
}
/* 紧急程度背景色 */
.notification-item.critical {
  background: linear-gradient(to right, #fef2f2, #fff7ed);
  border-color: #fecaca;
}

.notification-item.warning {
  background: linear-gradient(to right, #fffbeb, #fef3c7);
  border-color: #fde68a;
}

.notification-item.success {
  background: linear-gradient(to right, #f0fdf4, #dcfce7);
  border-color: #bbf7d0;
}

.notification-item.info {
  background: linear-gradient(to right, #eff6ff, #dbeafe);
  border-color: #bfdbfe;
}
.info-card {
  padding: 2px 10px;
  align-items: center;
  padding-left: 10px;
}
.quick-info {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .text-right > h1 {
    padding-right: 0;
  }
}
</style>
