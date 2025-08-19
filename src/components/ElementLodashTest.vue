<template>
  <div class="element-lodash-test">
    <h2>Element Plus & Lodash 测试组件</h2>

    <!-- Element Plus 组件测试 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>Element Plus 按钮测试</span>
        </div>
      </template>
      <div class="button-group">
        <el-button type="primary" @click="handleClick">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </div>
    </el-card>

    <!-- Lodash 函数测试 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Lodash 函数测试</span>
        </div>
      </template>
      <div class="lodash-tests">
        <div class="test-item">
          <p><strong>原数组:</strong> {{ originalArray }}</p>
          <el-button @click="testDebounce">测试 debounce</el-button>
          <el-button @click="testThrottle">测试 throttle</el-button>
          <el-button @click="testSortBy">测试 sortBy</el-button>
          <el-button @click="testFilter">测试 filter</el-button>
        </div>
        <div v-if="processedArray" class="test-result">
          <p><strong>处理结果:</strong> {{ processedArray }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// 导入Lodash函数
import { debounce, throttle, sortBy, filter } from '@/utils/lodash';
// Element Plus组件会被自动导入，无需手动import

// 测试数据
const originalArray = ref([5, 2, 8, 1, 9, 3]);
const processedArray = ref<number[] | null>(null);

// 测试函数
const handleClick = () => {
  ElMessage({ message: '按钮被点击了!', type: 'success' });
};

// 测试debounce
const testDebounce = debounce(() => {
  processedArray.value = [...originalArray.value].reverse();
  ElMessage({ message: 'debounce函数执行了', type: 'info' });
}, 1000);

// 测试throttle
const testThrottle = throttle(() => {
  processedArray.value = [...originalArray.value].sort();
  ElMessage({ message: 'throttle函数执行了', type: 'info' });
}, 1000);

// 测试sortBy
const testSortBy = () => {
  processedArray.value = sortBy(originalArray.value);
  ElMessage({ message: 'sortBy函数执行了', type: 'info' });
};

// 测试filter
const testFilter = () => {
  processedArray.value = filter(originalArray.value, num => num > 3);
  ElMessage({ message: 'filter函数执行了', type: 'info' });
};
</script>

<style scoped>
.element-lodash-test {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.lodash-tests {
  margin-top: 10px;
}

.test-item {
  margin-bottom: 15px;
}

.test-result {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>