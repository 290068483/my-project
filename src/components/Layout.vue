<template>
  <div class="layout home-container min-h-screen min-w-full flex flex-col font-sans">
    <Header ref="headerRef" />
    <SettingsButton />
    <div v-if="skeletonScreen" class="skeleton-screen fixed inset-0 z-50 flex flex-col bg-white">
      <div class="skeleton-header h-16 sm:h-32 bg-gray-100 animate-pulse"></div>
      <div class="skeleton-content flex-1 p-6 space-y-4">
        <div class="h-6 w-1/4 bg-gray-100 rounded animate-pulse"></div>
        <div class="h-6 w-1/2 bg-gray-100 rounded animate-pulse"></div>
        <div class="h-6 w-3/4 bg-gray-100 rounded animate-pulse"></div>
        <div class="h-40 w-full bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
    <main ref="mainRef" class="flex-1 p-4 sm:p-6 transition-all duration-300" :style="{ marginTop: mainMarginTop }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
import Header from "@/components/header/Header.vue";
import SettingsButton from "@/components/SettingsButton.vue";
import { RouterView } from "vue-router";
import { ref, onMounted, nextTick, onUnmounted, watch } from "vue";

const loading = ref(false); // 默认设置为false，避免骨架屏影响
const mainRef = ref<HTMLDivElement | null>(null);
const headerRef = ref<InstanceType<typeof Header>>();
const mainMarginTop = ref("0");

// 骨架屏 loading 逻辑
const skeletonScreen = ref(false); // 默认设置为false，避免骨架屏影响

// 监听loading状态变化
watch(
  () => loading.value,
  (newVal) => {
    if (!newVal) {
      // 移除骨架屏
      skeletonScreen.value = false;
    }
  },
);

// 组件挂载时和窗口大小变化时更新main区域的margin-top
onMounted(() => {
  updateMainMarginTop();

  // 监听窗口大小变化，重新计算margin-top
  window.addEventListener("resize", updateMainMarginTop);

  // 监听headerRef的变化
  watch(headerRef, () => {
    nextTick(updateMainMarginTop);
  });
});

// 更新main区域的margin-top
const updateMainMarginTop = () => {
  if (headerRef.value && mainRef.value) {
    // 获取header组件的根DOM元素
    const headerElement = headerRef.value.$el;

    // 确保header元素存在
    if (!headerElement) return;

    // 获取header的实际高度
    const headerHeight = headerElement.offsetHeight;

    // 设置main区域的margin-top
    mainMarginTop.value = `${headerHeight + 1}px`;

    // 设置CSS变量，供子组件使用
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);

    // 确保mainRef的样式被正确应用
    nextTick(() => {
      if (mainRef.value) {
        mainRef.value.style.marginTop = mainMarginTop.value;
      }
    });
  }
};

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener("resize", updateMainMarginTop);
});
</script>

<style scoped>
/* 骨架屏动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
