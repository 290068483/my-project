<template>
  <div class="container p-6 max-w-7xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">项目流程管理</h1>
      <p class="text-gray-500 mt-2">跟踪项目进度并管理相关任务</p>
    </div>

    <!-- 项目信息卡片 -->
    <el-card class="mb-6 shadow-lg rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        <div class="text-center md:text-left p-4 bg-blue-50 rounded-lg">
          <div class="text-sm text-gray-500">项目名称</div>
          <div class="font-medium text-lg">企业官网改版项目</div>
        </div>
        <div class="text-center md:text-left p-4 bg-green-50 rounded-lg">
          <div class="text-sm text-gray-500">当前状态</div>
          <el-tag type="primary" class="mt-1 text-base px-3 py-1">开发中</el-tag>
        </div>
        <div class="text-center md:text-left p-4 bg-purple-50 rounded-lg">
          <div class="text-sm text-gray-500">预计完成时间</div>
          <div class="font-medium text-lg">2023-10-30</div>
        </div>
      </div>
    </el-card>

    <!-- 水平流程进度 -->
    <el-card class="mb-8 shadow-lg rounded-lg">
      <template #header>
        <div class="font-semibold text-lg">项目流程进度</div>
      </template>
      <div class="overflow-x-auto pb-6">
        <div class="flex min-w-max space-x-6">
          <div v-for="(step, index) in processSteps" :key="index" class="flex flex-col items-center flex-shrink-0 w-32">
            <div class="relative mb-3">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
                :class="{
                  'bg-green-500': step.status === 'completed',
                  'bg-blue-500': step.status === 'processing',
                  'bg-gray-300': step.status === 'pending',
                }">
                <el-icon :size="14">
                  <component :is="getStepIconComponent(step.status)" />
                </el-icon>
              </div>
              <div
                v-if="index < processSteps.length - 1"
                class="absolute top-1/2 right-0 transform translate-x-full h-0.5 w-6"
                :class="{
                  'bg-green-500': step.status === 'completed',
                  'bg-blue-500': step.status === 'processing',
                  'bg-gray-300': step.status === 'pending',
                }"></div>
            </div>
            <div class="text-center">
              <h3 class="font-medium text-gray-800 text-sm">{{ step.name }}</h3>
              <p class="text-xs text-gray-500 mt-1 min-h-8">{{ step.description }}</p>
              <div class="mt-1 text-xs">
                <div v-if="step.timestamp" class="text-gray-600">
                  {{ formatDate(step.timestamp) }}
                </div>
                <div v-else class="text-gray-400">待处理</div>
                <div v-if="step.operator" class="mt-1">
                  <el-tag size="small" type="info">{{ step.operator }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 主要内容区 -->
    <div class="grid grid-cols-1 gap-6">
      <!-- 任务列表 -->
      <div>
        <el-card class="shadow-lg rounded-lg">
          <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span class="font-semibold text-lg">待处理任务</span>
              <el-button type="primary" @click="addTask">
                <el-icon class="mr-1"><Plus /></el-icon> 新增任务
              </el-button>
            </div>
          </template>

          <el-table :data="tasks" border style="width: 100%" :row-class-name="taskRowClass" class="rounded-lg">
            <el-table-column prop="name" label="任务名称" min-width="150"></el-table-column>
            <el-table-column prop="step" label="所属阶段" min-width="120"></el-table-column>
            <el-table-column prop="deadline" label="截止日期" min-width="120"></el-table-column>
            <el-table-column prop="assignee" label="负责人" min-width="100"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" round>
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" fixed="right">
              <template #default="scope">
                <div class="flex space-x-2">
                  <el-button
                    type="success"
                    size="small"
                    @click="handleComplete(scope.row)"
                    :disabled="scope.row.status === '已完成'"
                    round>
                    标记完成
                  </el-button>
                  <el-button type="primary" size="small" @click="handleEdit(scope.row)" round> 编辑 </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Check, Clock, Close, Plus, Help } from "@element-plus/icons-vue";
import { ElCard, ElTag, ElButton, ElIcon, ElTable, ElTableColumn, ElMessage } from "element-plus";

// 定义组件名称
defineOptions({
  name: "ProjectProcess",
});

// 流程步骤数据
const processSteps = ref([
  {
    name: "需求分析",
    description: "收集并确认客户需求",
    status: "completed",
    timestamp: "2023-09-01",
    operator: "张三",
  },
  {
    name: "UI设计",
    description: "完成页面设计和原型制作",
    status: "completed",
    timestamp: "2023-09-10",
    operator: "李四",
  },
  {
    name: "前端开发",
    description: "实现页面布局和交互效果",
    status: "processing",
    timestamp: "2023-09-15",
    operator: "王五",
  },
  {
    name: "后端开发",
    description: "开发API接口和数据处理",
    status: "processing",
    timestamp: "2023-09-15",
    operator: "赵六",
  },
  {
    name: "测试验收",
    description: "进行功能测试和性能优化",
    status: "pending",
    timestamp: null,
    operator: null,
  },
  {
    name: "上线部署",
    description: "发布到生产环境",
    status: "pending",
    timestamp: null,
    operator: null,
  },
]);

// 任务数据
const tasks = ref([
  {
    id: 1,
    name: "首页布局实现",
    step: "前端开发",
    deadline: "2023-09-20",
    assignee: "王五",
    status: "进行中",
  },
  {
    id: 2,
    name: "用户登录接口",
    step: "后端开发",
    deadline: "2023-09-22",
    assignee: "赵六",
    status: "进行中",
  },
  {
    id: 3,
    name: "需求文档确认",
    step: "需求分析",
    deadline: "2023-09-01",
    assignee: "张三",
    status: "已完成",
  },
  {
    id: 4,
    name: "测试用例编写",
    step: "测试验收",
    deadline: "2023-10-05",
    assignee: "孙七",
    status: "未开始",
  },
]);

// 根据步骤状态获取图标组件
const getStepIconComponent = (status: string) => {
  switch (status) {
    case "completed":
      return Check;
    case "processing":
      return Clock;
    case "pending":
      return Help;
    case "rejected":
      return Close;
    default:
      return Help;
  }
};

// 格式化日期
const formatDate = (date: string | null) => {
  if (!date) return "待处理";
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

// 根据任务状态获取标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case "已完成":
      return "success";
    case "进行中":
      return "primary";
    case "未开始":
      return "info";
    case "已逾期":
      return "danger";
    default:
      return "info";
  }
};

// 任务行样式
const taskRowClass = ({ row }: { row: { status: string } }) => {
  if (row.status === "已逾期") {
    return "text-danger";
  }
  return "";
};

// 标记任务完成
const handleComplete = (row: { status: string; name: string }) => {
  row.status = "已完成";
  ElMessage.success(`任务 "${row.name}" 已标记为完成`);
};

// 编辑任务
const handleEdit = (row: { name: string }) => {
  ElMessage.info(`编辑任务: ${row.name}`);
  // 实际应用中可打开编辑弹窗
};

// 新增任务
const addTask = () => {
  ElMessage.info("打开新增任务弹窗");
  // 实际应用中可打开新增弹窗
};
</script>

<style scoped>
.step-content {
  padding: 5px 0;
}

/* 时间轴样式优化 */
:deep(.el-timeline-item__timestamp) {
  margin-top: 0 !important;
}

/* 表格行高调整 */
:deep(.el-table__row) {
  height: 60px;
}

.text-danger {
  color: #f56c6c;
}

/* 卡片悬停效果 */
:deep(.el-card) {
  transition: all 0.3s ease;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

/* 按钮样式优化 */
:deep(.el-button) {
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 标签样式优化 */
:deep(.el-tag) {
  transition: all 0.2s ease;
}

:deep(.el-tag:hover) {
  transform: translateY(-1px);
}
</style>
