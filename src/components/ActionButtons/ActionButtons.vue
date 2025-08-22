<template>
  <div class="action-buttons">
    <div class="button-group" v-if="showRefresh">
      <el-button-group>
        <el-button size="small" @click="handleRefresh" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </el-button-group>
    </div>

    <div class="button-group" v-if="showExport">
      <el-dropdown @command="handleExport" trigger="click">
        <el-button size="small">
          <el-icon><Download /></el-icon>
          导出数据
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

    <div class="button-group" v-if="showPrint">
      <el-button size="small" @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印本页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown, Download, Printer, Refresh } from '@element-plus/icons-vue';

// 定义组件属性
const props = defineProps({
  // 是否显示刷新按钮
  showRefresh: {
    type: Boolean,
    default: true
  },
  // 是否显示导出按钮
  showExport: {
    type: Boolean,
    default: true
  },
  // 是否显示打印按钮
  showPrint: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 打印样式内容
  printStyle: {
    type: String,
    default: ''
  }
});

// 定义事件
const emit = defineEmits(['refresh', 'export', 'print']);

// 刷新数据
const handleRefresh = () => {
  emit('refresh');
};

// 导出数据
const handleExport = (type: string) => {
  emit('export', type);
};

// 打印页面
const handlePrint = () => {
  emit('print');
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.button-group {
  display: flex;
  align-items: center;
}
</style>
