<script setup lang="ts">
// 确保App组件正确导入和使用
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100 w-full">
    <RouterView />
  </div>
</template>

<style scoped>
/* 确保App组件样式不会影响内容显示 */
#app {
  min-height: 100vh;
  width: 100%;
  background-color: #f3f4f6; /* 确保背景色 */
  overflow-x: hidden; /* 防止水平滚动 */
}
</style>
