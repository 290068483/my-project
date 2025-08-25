<template>
  <div class="download-button">
    <el-dropdown @command="handleDownload" trigger="click">
      <el-button size="small">
        <el-icon><Download /></el-icon>
        下载本页
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="excel">Excel格式</el-dropdown-item>
          <el-dropdown-item command="csv">CSV格式</el-dropdown-item>
          <el-dropdown-item command="json">JSON格式</el-dropdown-item>
          <el-dropdown-item command="pdf">PDF格式</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ArrowDown, Download } from "@element-plus/icons-vue";

// 定义事件
const emit = defineEmits(["download"]);

// 下载功能
const handleDownload = (type: string) => {
  emit("download", type);
};
</script>

<style scoped>
.download-button {
  display: inline-block;
}
</style>
