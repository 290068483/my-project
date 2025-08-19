<template>
  <div class="home-container min-h-screen min-w-full bg-neutral flex flex-col font-sans">
    <main class="w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex-grow">
      <!-- 用户信息和欢迎区域 -->
      <div
        class="user-info-area border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-gray-50 flex flex-col sm:flex-row flex-wrap justify-between items-center shadow-sm">
        <div class="user-details flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0 w-full sm:w-auto">
          <div
            class="user-avatar w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md border border-primary/20">
            {{ userInfo?.avatar || '未' }}</div>
          <div class="user-text">
            <div class="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-1">
              <span>姓名：</span><span class="font-medium text-gray-800">{{ userInfo?.name || '未设置' }}</span>
              <span>|</span>
              <span>所属部门：</span><span class="font-medium text-gray-800">{{ userInfo?.department || '未设置' }}</span>
            </div>
            <div class="text-sm text-gray-600 mt-1">
              <span>职位：</span><span class="font-medium text-gray-800">{{ userInfo?.position || '未设置' }}</span>
            </div>
          </div>
        </div>

        <div class="welcome-section text-right">
          <h1 class="text-lg sm:text-xl font-bold text-primary">欢迎进入九素工作台</h1>
          <p class="text-sm text-gray-500 mt-1">{{ currentDate }}</p>
        </div>
      </div>

      <!-- 通知和待办区域 -->
      <div
        class="notification-area px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-100 flex flex-wrap justify-between items-center gap-3 sm:gap-4">
        <div class="notifications flex flex-wrap gap-3">
          <div
            class="notification-item bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 flex items-start space-x-2 max-w-xs sm:max-w-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5">
            <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
              </path>
            </svg>
            <p class="text-xs text-gray-700">
              <span class="font-semibold">活动通知：</span> 6月12日项目评审会议，请准时参加。
            </p>
          </div>
          <div
            class="notification-item bg-blue-50 border border-blue-200 rounded-md px-3 py-2 flex items-start space-x-2 max-w-xs hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-xs text-gray-700">
              <span class="font-semibold">系统消息：</span> 请及时录入工作进度。
            </p>
          </div>
        </div>

        <div
          class="todo-reminder text-sm text-red-500 font-medium flex items-center cursor-pointer hover:underline bg-red-50 px-3 py-1 rounded-full">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          请及时录入工作进度
        </div>
      </div>
      <!-- 快捷信息区域 -->
      <div class="quick-info mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-card">
        <div
          class="info-card bg-white rounded-lg shadow-card p-4 border border-gray-100 hover:shadow-card-hover transition-all duration-300 flex flex-col transform hover:-translate-y-1">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-sm font-semibold text-gray-700">今日待处理事件</h3>
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
              </path>
            </svg>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-2xl font-bold text-blue-600">{{ quickStats.pendingTasks }}</span>
            <span class="text-xs text-gray-500 self-end pb-1">项</span>
          </div>
        </div>
        <div
          class="info-card bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-sm font-semibold text-gray-700">未读信息</h3>
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
              </path>
            </svg>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-2xl font-bold text-red-500">{{ quickStats.unreadMessages }}</span>
            <span class="text-xs text-gray-500 self-end pb-1">条</span>
          </div>
        </div>
        <div
          class="info-card bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-sm font-semibold text-gray-700">未完工客户</h3>
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-2xl font-bold text-yellow-500">{{ quickStats.ongoingClients }}</span>
            <span class="text-xs text-gray-500 self-end pb-1">个</span>
          </div>
        </div>
      </div>



      <!-- 数据表格区域 -->
      <div class="data-tables grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 待处理事件表格 -->
        <div
          class="table-container bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div
            class="table-header bg-primary text-white px-4 py-2 border-b border-primary-dark flex justify-between items-center">
            <h3 class="text-sm font-semibold text-white">本人待处理的所有事项</h3>
            <button class="text-xs text-white hover:text-blue-200 flex items-center">
              <span>详情</span>
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </button>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  详情</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" id="pending-tasks-table">
              <template v-for="item in pendingItems" :key="item.name">
                <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  @click="showItemDetails(item.name)">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ item.count }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-blue-500">
                    <span class="underline">查看详情</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- 与本人关联事项表格 -->
        <div
          class="table-container bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 lg:col-span-6">
          <div class="table-header bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
            <h3 class="text-sm font-semibold text-white">与本人关联的所有事项</h3>
            <button
              class="text-xs bg-secondary text-white px-3 py-1 rounded hover:bg-primary transition-colors flex items-center">
              <span>录入新进度</span>
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="item in relatedItems" :key="item.name">
                <tr class="hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ item.count }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 通知公告区域 -->
      <div
        class="announcements mt-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div
          class="announcement-header bg-primary text-white px-4 py-2 border-b border-primary-dark flex justify-between items-center">
          <h3 class="text-sm font-semibold text-white flex items-center">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
              </path>
            </svg>
            当前发布信息
          </h3>
          <div class="flex space-x-2">
            <button
              class="px-2 py-1 bg-secondary text-white text-xs rounded hover:bg-primary transition-colors flex items-center">
              <span>{{ announcements.length }}条</span>
            </button>
            <button
              class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors">后续发布信息92条</button>
          </div>
        </div>
        <div
          class="announcement-content p-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <template v-for="(announcement, index) in announcements" :key="index">
            <div
              class="announcement-item mb-3 pb-3 border-b border-gray-100 hover:bg-gray-50 p-2 rounded transition-colors duration-150 cursor-pointer"
              @click="viewAnnouncement(announcement)">
              <p class="text-sm text-gray-700 mb-1 relative">
                <span
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span class="ml-4 font-medium">{{ announcement.title }}</span>{{ announcement.content }}
              </p>
              <div class="flex justify-between items-center mt-1 ml-4">
                <span class="text-xs text-gray-400">{{ formatDate(new Date()) }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';

export interface Announcement {
  title: string;
  content: string;
}

export interface Item {
  name: string;
  count: number;
}

// 可以在这里添加组件逻辑
const quickStats = ref({
  pendingTasks: 4,
  unreadMessages: 3,
  ongoingClients: 28
});

const pendingItems = ref<Item[]>([
  { name: '待合同', count: 2 },
  { name: '待回复', count: 1 },
  { name: '待处理', count: 4 },
  { name: '待跟踪', count: 3 }
]);

const relatedItems = ref<Item[]>([
  { name: '待合同', count: 3 },
  { name: '待回复', count: 2 },
  { name: '待处理', count: 5 },
  { name: '待跟踪', count: 3 }
]);

export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

const userStore = useUserStore();
const currentDate = ref('');

// 计算属性获取用户信息
const userInfo = computed<UserInfo>(() => userStore.userInfo || {});
console.log('搜索');
// 设置当前日期
onMounted(() => {
  // 初始化用户信息
  userStore.initUserInfo();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');

  // 星期几
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];

  // 农历日期（简化版）
  const lunarDate = '五月初一'; // 实际应用中需要农历库

  currentDate.value = `${year}年${month}月${day}日 ${hour}:${minute} （农历${lunarDate}） ${weekday}`;
});

const announcements = ref<Announcement[]>([
  {
    title: '3月24日会议通知：',
    content: '3月24日合同，谢永辉合同，合同款32465元，有2000元尾款，请送货时切记收取。'
  },
  {
    title: '3月24日合同：',
    content: '谢永辉合同，合同款32465元，有2000元尾款，请及时下单。'
  },
  {
    title: '3月24日通知：',
    content: '潘道国已完成客户测量，明天上午上门测量，请及时与客户联系，约定具体时间。'
  }
]);

const showItemDetails = (name: string) => {
  // 这里可以添加查看详情的逻辑
  console.log('查看详情:', name);
};

const viewAnnouncement = (announcement: Announcement) => {
  // 这里可以添加查看公告的逻辑
  console.log('查看公告:', announcement);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};
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
</style>
