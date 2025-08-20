<template name="AppHeader">
  <div class="header-container bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
    <!-- 顶部导航栏 -->
    <div
      class="nav-bar flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-2 bg-gradient-to-r shadow-md"
    >
      <!-- 头部导航菜单 -->
      <div
        class="nav-menu flex space-x-1 gap-1 justify-start overflow-x-auto hide-scrollbar sm:space-x-4 lg:overflow-visible w-full sm:w-auto"
      >
        <button
          class="nav-item min-w-[10px] font-semibold mb-2 lg:px-4 sm:px-4 sm:py-2 text-xs sm:text-sm text-white border-b-2 transition-colors border-white bg-blue-500 rounded-t-sm whitespace-nowrap w-full text-center sm:text-left"
          @click="(event) => handleNavClick('首页', event)"
        >
          首页
        </button>

        <button
          class="nav-item lg:px-4 sm:px-4 text-xs sm:text-sm font-medium text-blue-100 bg-blue-500 transition-colors whitespace-nowrap w-full text-center sm:text-left"
          @click="(event) => handleNavClick('任务进度', event)"
        >
          任务进度
        </button>
        <button
          class="nav-item lg:px-2 text-sm font-medium text-blue-100 bg-blue-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('客户进度', event)"
        >
          客户进度
        </button>
        <button
          class="nav-item lg:px-4 text-sm font-medium text-blue-100 bg-blue-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('出货', event)"
        >
          出货
        </button>
        <button
          class="nav-item lg:px-4 text-[12px] text-sm font-medium text-blue-100 bg-blue-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('数据库', event)"
        >
          数据库
        </button>
        <button
          class="nav-item lg:px-4 text-sm font-medium text-blue-100 bg-purple-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('财务表', event)"
        >
          财务表
        </button>
        <button
          class="nav-item lg:px-4 text-sm font-medium text-blue-100 bg-purple-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('出勤管理', event)"
        >
          出勤管理
        </button>
        <button
          class="nav-item lg:px-4 text-sm font-medium text-blue-100 bg-purple-500 transition-colors whitespace-nowrap"
          @click="(event) => handleNavClick('其它项目', event)"
        >
          其它项目
        </button>
      </div>

      <!-- 右侧搜索和用户区域 -->
      <div
        class="right-section gap-1 flex flex-col sm:flex-row items-center flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
      >
        <div class="search-box relative w-full sm:w-64 sm:mr-2">
          <el-input placeholder="请输入内容" class="w-64 h-10" v-model="inputSearch">
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </div>

        <div
          class="user-menu flex flex-wrap text-center items-center gap-1 sm:space-x-3 cursor-pointer group text-xs sm:text-sm text-white w-full justify-center sm:justify-start h-10"
        >
          <span
            class="flex-1 text-[12px] transition-colors px-1 rounded-[2px] bg-brown h-full flex items-center justify-center"
            >产品库</span
          >
          <span
            class="flex-1 transition-colors px-1 rounded-[2px] bg-brown h-full flex items-center justify-center"
            >图库</span
          >
          <span
            class="flex-1 transition-colors px-1 rounded-[2px] bg-brown h-full flex items-center justify-center"
            >知识库</span
          >
          <span
            class="flex-1 transition-colors px-1 rounded-[2px] bg-brown h-full flex items-center justify-center"
            >制度</span
          >
          <span
            class="flex-1 transition-colors px-2 rounded-[2px] bg-brown h-full flex items-center justify-center"
            >通讯录</span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="clearfix"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useUserStore } from "@/stores/user";

export interface UserInfo {
  name?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

const userStore = useUserStore();
const currentDate = ref("");

// 计算属性获取用户信息
const inputSearch = ref("");
console.log("搜索");

// 当前激活的导航项
const activeNav = ref("首页");

// 处理导航项点击
const handleNavClick = (navItem: string, event: MouseEvent) => {
  // 移除所有导航项的active类
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    (item as HTMLElement).classList.remove("active");
  });

  // 为当前点击的导航项添加active类
  if (event?.currentTarget) {
    (event.currentTarget as HTMLElement).classList.add("active");
  }

  // 更新激活的导航项
  activeNav.value = navItem;
};
// 初始化导航项激活状态
const initActiveNav = () => {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    if (item.textContent?.trim() === activeNav.value) {
      item.classList.add("active");
    }
  });
};

// 设置当前日期
onMounted(() => {
  // 初始化用户信息
  userStore.initUserInfo();

  // 初始化导航项激活状态
  nextTick(() => {
    initActiveNav();
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  // 星期几
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[now.getDay()];

  // 农历日期（简化版）
  const lunarDate = "五月初一"; // 实际应用中需要农历库

  currentDate.value = `${year}年${month}月${day}日 ${hour}:${minute} （农历${lunarDate}） ${weekday}`;
});
</script>

<style scoped>
/* 自定义样式 */

/* 导航项激活状态样式 */
.nav-item {
  position: relative;
  transition: all 0.2s ease;
}

/* 导航项激活状态 - 白色背景，红色文字 */
.nav-item.active {
  background-color: white;
  color: #ef4444; /* 红色 */
}

/* 导航项激活状态的悬停效果 */
.nav-item.active:hover {
  background-color: #fef2f2;
}

/* 导航项悬停效果 */
.nav-item:hover {
  transform: translateY(-1px);
}
</style>
