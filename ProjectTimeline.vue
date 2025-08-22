<template>
  <div class="project-timeline">
    <!-- 页面标题 -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">项目流程管理</h1>
      <p class="text-gray-500 mt-2">跟踪项目进度并管理相关任务</p>
    </div>

    <!-- 水平流程进度 -->
    <div class="timeline-container">
      <div class="timeline-bar"></div>
      <div 
        v-for="(step, index) in processSteps" 
        :key="index" 
        :class="['timeline-step', `status-${step.status}`]"
        :style="{ left: `${(index / (processSteps.length - 1)) * 100}%` }"
      >
        <div class="step-icon">
          <i :class="getStepIconClass(step.status)"></i>
        </div>
        <div class="step-content">
          <h3>{{ step.name }}</h3>
          <p>{{ step.description }}</p>
          <div v-if="step.timestamp">{{ formatDate(step.timestamp) }}</div>
          <div v-else>待处理</div>
          <div v-if="step.operator"><span class="operator">{{ step.operator }}</span></div>
        </div>
      </div>
      <div class="current-time" :style="{ left: `${(currentTimeIndex / (processSteps.length - 1)) * 100}%` }">
        当前时间
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 流程步骤数据
const processSteps = ref([
  {
    name: "到店",
    description: "",
    status: "completed",
    timestamp: "2019-04-26",
    operator: "电润",
  },
  // ... 其他步骤 ...
  {
    name: "合同",
    description: "",
    status: "processing",
    timestamp: "2020-01-12",
    operator: "谭敬江",
  },
]);

// 计算当前时间标记的位置
const currentTimeIndex = computed(() => {
  const currentDate = new Date();
  for (let i = 0; i < processSteps.value.length; i++) {
    if (new Date(processSteps.value[i].timestamp) > currentDate) {
      return i;
    }
  }
  return processSteps.value.length - 1;
});

// 根据步骤状态获取图标类名
const getStepIconClass = (status: string) => {
  switch (status) {
    case "completed":
      return "fas fa-check";
    case "processing":
      return "fas fa-clock";
    case "pending":
      return "fas fa-question";
    default:
      return "fas fa-question";
  }
};

// 格式化日期
const formatDate = (date: string | null) => {
  if (!date) return "待处理";
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};
</script>

<style scoped>
.project-timeline {
  padding: 6px;
  max-width: 700px;
  margin: auto;
}

.timeline-container {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: #f0f0f0;
}

.timeline-bar {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #000;
}

.timeline-step {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  text-align: center;
}

.step-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}

.status-completed .step-icon {
  background-color: green;
}

.status-processing .step-icon {
  background-color: blue;
}

.status-pending .step-icon {
  background-color: gray;
}

.step-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.current-time {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  text-align: center;
  color: purple;
  font-weight: bold;
}
</style>