<template>
  <div class="print-button">
    <el-button size="small" @click="handlePrint" :loading="loading">
      <el-icon><Printer /></el-icon>
      打印本页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Printer } from "@element-plus/icons-vue";

// 定义组件属性
const props = defineProps({
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 打印样式内容
  printStyle: {
    type: String,
    default: "",
  },
});

// 定义事件
const emit = defineEmits(["print"]);

// 打印页面
const handlePrint = () => {
  emit("print");
};
</script>

<style scoped>
.print-button {
  display: inline-block;
}
</style>
