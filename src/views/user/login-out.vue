<template>
  <div class="component-login-out">
    <el-button type="primary" @click="handleLoginOut">退出登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { AuthUtils } from "@/utils/auth";

const handleLoginOut = () => {
  AuthUtils.logout();
};
</script>

<style scoped>
/* 组件样式 */
</style>
