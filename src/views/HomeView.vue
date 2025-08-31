<template>
  <div class="home-container bg-gray-200 min-h-screen w-full flex flex-col font-sans">
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

    <!-- 主要内容 (确保内容始终显示) -->
    <div class="w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex-grow">
      <!-- 用户信息和欢迎区域 -->
      <div
        class="user-info-area border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-gray-50 flex flex-col sm:flex-row flex-wrap items-center shadow-sm">
        <div class="user-details min-w-[300px] flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0 w-full sm:w-auto">
          <div
            class="user-avatar w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md border border-blue-200">
            {{ userInfo.avatar ? "" : userInfo.name ? userInfo.name.charAt(0) : "U" }}
          </div>
          <div class="user-text">
            <div class="user-info-grid grid grid-cols-2 gap-1">
              <div class="info-label font-medium">姓名：</div>
              <div class="info-value">{{ userInfo.name }}</div>
              <div class="info-label font-medium">所属部门：</div>
              <div class="info-value">{{ userInfo.department }}</div>
              <div class="info-label font-medium">职位：</div>
              <div class="info-value">{{ userInfo.position }}</div>
            </div>
          </div>
        </div>

        <div class="welcome-section text-right flex-grow">
          <h1 class="text-lg sm:text-xl font-bold text-blue-600">欢迎进入九素工作台</h1>
          <div class="p-box flex items-center justify-center gap-5 pr-20">
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
            v-for="notification in homeStore.getNotifications || []"
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
      <div class="quick-info gap-5 rounded-lg shadow-card flex flex-wrap py-4">
        <div
          v-for="(card, index) in quickInfoCards || []"
          :key="index"
          class="info-card bg-gray-800 rounded-sm shadow-card p-4 border border-gray-100 hover:shadow-card-hover transition-all duration-300 flex items-center transform hover:-translate-y-1"
          :class="card.bgColor">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <h3 class="text-sm font-semibold text-white ml-2">今日待处理事件<text class="text-red-500 pl-2">条</text></h3>
        </div>
        <div class="flex items-center">
          <el-button type="primary" size="medium" @click="handleButtonClick">录入新进度</el-button>
        </div>
      </div>

      <!-- 数据表格区域 -->
      <div class="data-tables grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <!-- 待处理事件表格 -->
        <div
          class="table-container bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div
            class="table-header table-title bg-blue-50 px-4 py-2 border-b border-blue-200 flex justify-between items-center">
            <h3 class="text-sm text-center mx-auto font-semibold">{{ data1.title || "本人待处理的所有事项" }}</h3>
          </div>
          <!-- 表格 -->
          <div class="table-wrapper w-full overflow-x-auto">
            <el-table
              :data="data1.data || []"
              style="width: 100%"
              stripe
              border
              :default-sort="{ prop: 'id', order: 'descending' }"
              @sort-change="sortBy"
              class="w-full">
              <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
              <el-table-column prop="details" label="详情"></el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 与本人关联事项表格 -->
        <div
          class="table-container rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div
            class="table-header table-title bg-blue-50 px-4 py-2 border-b border-blue-200 flex justify-between items-center">
            <h3 class="text-sm font-semibold">{{ data2.title || "与本人关联的所有事项" }}</h3>
          </div>
          <!-- 表格 -->
          <div class="table-wrapper w-full overflow-x-auto">
            <el-table
              :data="data2.data || []"
              style="width: 100%"
              stripe
              border
              :default-sort="{ prop: 'id', order: 'descending' }"
              @sort-change="sortBy"
              class="w-full">
              <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
              <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
              <el-table-column prop="details" label="详情"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onErrorCaptured, nextTick } from "vue";
import { useUserStore } from "@/stores/user";
import { useHomeStore } from "@/stores/home";
import { getFullDateWithWeekday } from "@/utils/dateUtils";
import moment from "moment";
import "moment/locale/zh-cn";
import { ElMessage } from "element-plus";

// 设置moment.js为中文
moment.locale("zh-cn");

// 定义常量
const DEFAULT_AVATAR = "";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

// 组件正常加载状态
const isComponentReady = ref(true); // 默认设置为true，确保内容始终显示
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
    // 直接设置组件为准备就绪状态，确保内容可见
    isComponentReady.value = true;

    // 尝试获取用户信息（如果有Token的话）
    if (userStore.token) {
      try {
        await userStore.getInfo(); // 使用正确的用户store方法
        console.log("用户信息获取成功:", userStore.$state);
      } catch (error) {
        console.warn("🔍 获取用户信息失败，使用本地数据:", error);
        hasNetworkError.value = true;
      }
    }

    // 确保homeStore有数据
    if (!homeStore.getDate) {
      // 初始化日期数据
      homeStore.updateDate(moment().format("YYYY-MM-DD"));
      homeStore.updateTime(moment().format("HH:mm:ss"));
      homeStore.updateLunarDate("农历日期");
      homeStore.updateWeekdays(moment().format("dddd"));
    }

    // 确保表格数据存在
    if (!homeStore.getData1 || !homeStore.getData1.data || homeStore.getData1.data.length === 0) {
      homeStore.data1 = {
        title: "本人待处理的所有事项",
        data: [
          {
            id: 1,
            name: "示例任务1",
            count: "任务描述1",
            details: "2023-03-24",
          },
          {
            id: 2,
            name: "示例任务2",
            count: "任务描述2",
            details: "详细信息",
          },
        ],
      };
    }

    if (!homeStore.getData2 || !homeStore.getData2.data || homeStore.getData2.data.length === 0) {
      homeStore.data2 = {
        title: "与本人关联的所有事项",
        data: [
          {
            id: 1,
            name: "关联任务1",
            count: "关联描述1",
            details: "2023-03-24",
          },
          {
            id: 2,
            name: "关联任务2",
            count: "关联描述2",
            details: "详细信息",
          },
        ],
      };
    }

    console.log("HomeStore数据:", homeStore.$state);

    // 强制更新组件
    await nextTick();
  } catch (error) {
    console.error("🚨 初始化失败:", error);
    hasNetworkError.value = true;
    // 即使出错也要确保组件可见
    isComponentReady.value = true;
  }
});

// 在组件创建时也初始化数据
(() => {
  // 确保homeStore有数据
  if (!homeStore.getDate) {
    // 初始化日期数据
    homeStore.updateDate(moment().format("YYYY-MM-DD"));
    homeStore.updateTime(moment().format("HH:mm:ss"));
    homeStore.updateLunarDate("农历日期");
    homeStore.updateWeekdays(moment().format("dddd"));
  }

  // 确保表格数据存在
  if (!homeStore.getData1 || !homeStore.getData1.data || homeStore.getData1.data.length === 0) {
    homeStore.data1 = {
      title: "本人待处理的所有事项",
      data: [
        {
          id: 1,
          name: "示例任务1",
          count: "任务描述1",
          details: "2023-03-24",
        },
        {
          id: 2,
          name: "示例任务2",
          count: "任务描述2",
          details: "详细信息",
        },
      ],
    };
  }

  if (!homeStore.getData2 || !homeStore.getData2.data || homeStore.getData2.data.length === 0) {
    homeStore.data2 = {
      title: "与本人关联的所有事项",
      data: [
        {
          id: 1,
          name: "关联任务1",
          count: "关联描述1",
          details: "2023-03-24",
        },
        {
          id: 2,
          name: "关联任务2",
          count: "关联描述2",
          details: "详细信息",
        },
      ],
    };
  }
})();

// 计算属性获取用户信息
const userInfo = computed(() => {
  // 直接从userStore中获取用户信息
  const userDetail = userStore.$state;

  return {
    name: userDetail.name || "未设置",
    position: userDetail.position || "未设置",
    department: userDetail.department || "未设置",
    avatar: userDetail.avatar || DEFAULT_AVATAR,
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
const data1 = computed(() => {
  const d1 = homeStore.getData1 || { title: "本人待处理的所有事项", data: [] };
  console.log("data1 computed:", d1);
  return d1;
});
const data2 = computed(() => {
  const d2 = homeStore.getData2 || { title: "与本人关联的所有事项", data: [] };
  console.log("data2 computed:", d2);
  return d2;
});

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
