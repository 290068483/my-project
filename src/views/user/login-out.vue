<template>
  <div class="component-login-out">
    <el-button type="primary" @click="handleLoginOut">退出登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handleLoginOut = () => {
  userStore.logout();
  ElMessage.success("退出登录成功");
  router.push({ name: "login" });
};
</script>

<style scoped>
/* 组件样式 */
</style>
