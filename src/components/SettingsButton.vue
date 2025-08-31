<template>
  <div class="settings-button">
    <el-button type="primary" :icon="Setting" circle @click="toggleTopNav" title="切换顶部导航" />
  </div>
</template>

<script setup lang="ts">
import { Setting } from "@element-plus/icons-vue";
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const toggleTopNav = () => {
  settingsStore.toggleTopNav();
};
</script>

<style scoped>
.settings-button {
  position: fixed;
  top: 70px;
  right: 20px;
  z-index: 1000;
}
</style>
