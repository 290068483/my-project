<template>
  <div
    class="sidebar bg-white border-r border-gray-200 h-screen w-16 sm:w-64 fixed left-0 top-0 overflow-y-auto transition-all duration-300 ease-in-out z-10 transform lg:translate-x-0 -translate-x-full lg:static lg:h-auto lg:overflow-visible lg:border-r-0 lg:border-b"
    :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }">
    <div class="sidebar-header p-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-bold text-gray-800 hidden sm:block">九素工作台</h2>
      <button class="text-gray-400 hover:text-gray-600 lg:hidden p-2 rounded-md hover:bg-gray-100" @click="toggleSidebar">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <nav class="sidebar-nav p-4 sm:p-6">
      <ul class="space-y-1">
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            <span class="nav-text">首页</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              </path>
            </svg>
            <span class="nav-text">任务进度</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
            <span class="nav-text">客户进度</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span class="nav-text">出货管理</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
              </path>
            </svg>
            <span class="nav-text">数据库</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            <span class="nav-text">财务表</span>
          </a>
        </li>
        <li>
          <a href="#"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors group"
            @click="toggleSidebar">
            <svg class="w-5 h-5 mr-2 flex-shrink-0 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
              </path>
            </svg>
            <span class="nav-text">出勤管理</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <!-- 移动端遮罩层 -->
  <div 
    v-if="sidebarOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
    @click="toggleSidebar">
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// 点击页面其他区域关闭侧边栏
const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
};

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true;
  } else {
    sidebarOpen.value = false;
  }
});

// 添加点击页面其他区域关闭侧边栏的事件监听
onMounted(() => {
  document.addEventListener('click', closeSidebar);
  // 初始化时根据窗口大小设置侧边栏状态
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = true;
  }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', closeSidebar);
});
</script>

<style scoped>
.sidebar {
  @apply bg-white border-r border-gray-200 h-screen w-16 sm:w-64 fixed left-0 top-0 overflow-y-auto transition-all duration-300 ease-in-out z-10;
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.translate-x-0 {
    transform: translateX(0);
  }
}

/* 导航项图标样式 */
.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}

/* 导航项文本样式 */
.nav-text {
  @apply hidden sm:block overflow-hidden text-ellipsis whitespace-nowrap;
}
</style>
