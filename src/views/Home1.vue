<template>
  <div class="home">
    <main class="p-4 sm:p-6 md:p-8">
      <div class="welcome-section text-right mb-6">
        <h1 class="text-lg sm:text-xl font-bold text-primary">欢迎进入九素工作台</h1>
        <div class="p-box flex item-center justify-center gap-5 pr-20">
          <p class="text-sm text-gray-500 mt-1">
            {{ getDate }}<text class="text-red-500">{{ getTime }}</text>
          </p>
          <p class="text-xs text-gray-400">{{ getLunarDate }} {{ getWeekday }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- 通知卡片 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">通知</h2>
            <el-button type="primary" text @click="handleViewAllNotifications"> 查看全部 </el-button>
          </div>
          <div class="space-y-4">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="flex-shrink-0 mr-3">
                <svg
                  class="w-5 h-5"
                  :class="notification.iconColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    :d="notification.iconPath"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ notification.title }}
                  </h3>
                  <span class="text-xs text-gray-500 ml-2">{{ notification.time }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ notification.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷操作卡片 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">快捷操作</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <el-button
              v-for="action in quickActions"
              :key="action.name"
              type="primary"
              plain
              class="flex flex-col items-center justify-center py-4"
              @click="handleQuickAction(action)">
              <el-icon :size="24" class="mb-2">
                <component :is="action.icon" />
              </el-icon>
              <span class="text-sm">{{ action.name }}</span>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- 销售图表 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">销售数据</h2>
          <div ref="salesChartRef" class="w-full h-64"></div>
        </div>

        <!-- 客户图表 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">客户分布</h2>
          <div ref="customerChartRef" class="w-full h-64"></div>
        </div>
      </div>

      <!-- 项目进度表 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">项目进度</h2>
        <el-table :data="projectProgress" style="width: 100%">
          <el-table-column prop="project" label="项目名称" min-width="120" />
          <el-table-column prop="manager" label="负责人" width="100" />
          <el-table-column prop="progress" label="进度" width="150">
            <template #default="scope">
              <el-progress :percentage="scope.row.progress" :status="getProgressStatus(scope.row.progress)" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止日期" width="120" />
        </el-table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import * as echarts from "echarts";
import moment from "moment";
import "moment/locale/zh-cn";
import { useHomeStore } from "@stores/home";
import { useRouter } from "vue-router";
import { Promotion, Document, User, Setting, Bell, DataLine } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 设置moment.js为中文
moment.locale("zh-cn");

// 使用store和router
const homeStore = useHomeStore();
const router = useRouter();

// 图表引用
const salesChartRef = ref<HTMLElement | null>(null);
const customerChartRef = ref<HTMLElement | null>(null);

// 图表实例
let salesChart: echarts.ECharts | null = null;
let customerChart: echarts.ECharts | null = null;

// 计算属性获取通知
const notifications = computed(() => homeStore.notifications);

// 计算属性获取日期
const getDate = computed(() => {
  return homeStore.getDate;
});

// 计算属性获取时间
const getTime = computed(() => {
  return homeStore.getTime;
});

// 计算属性获取农历日期
const getLunarDate = computed(() => {
  return homeStore.getLunarDate;
});

// 计算属性获取星期
const getWeekday = computed(() => {
  return homeStore.getWeekdays;
});

// 快捷操作
const quickActions = [
  { name: "新增客户", icon: "User" },
  { name: "创建订单", icon: "Document" },
  { name: "发送通知", icon: "Bell" },
  { name: "数据分析", icon: "DataLine" },
  { name: "系统设置", icon: "Setting" },
  { name: "推广营销", icon: "Promotion" },
];

// 项目进度数据
const projectProgress = [
  {
    project: "网站重构项目",
    manager: "张三",
    progress: 75,
    status: "进行中",
    deadline: "2023-06-30",
  },
  {
    project: "移动端开发",
    manager: "李四",
    progress: 40,
    status: "进行中",
    deadline: "2023-07-15",
  },
  {
    project: "数据分析系统",
    manager: "王五",
    progress: 90,
    status: "即将完成",
    deadline: "2023-06-10",
  },
  {
    project: "客户管理系统",
    manager: "赵六",
    progress: 20,
    status: "初始阶段",
    deadline: "2023-08-20",
  },
];

// 处理查看全部通知
const handleViewAllNotifications = () => {
  ElMessage.info("查看全部通知");
};

// 处理快捷操作
const handleQuickAction = (action: { name: string; icon: string }) => {
  ElMessage.success(`执行快捷操作: ${action.name}`);
};

// 获取进度状态
const getProgressStatus = (progress: number) => {
  if (progress === 100) return "success";
  if (progress < 30) return "exception";
  return "";
};

// 获取标签类型
const getTagType = (status: string) => {
  switch (status) {
    case "已完成":
      return "success";
    case "进行中":
      return "";
    case "即将完成":
      return "warning";
    case "初始阶段":
      return "info";
    default:
      return "danger";
  }
};

// 初始化图表
const initCharts = () => {
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value);
    salesChart.setOption({
      title: {
        text: "月度销售数据",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          type: "bar",
        },
      ],
    });
  }

  if (customerChartRef.value) {
    customerChart = echarts.init(customerChartRef.value);
    customerChart.setOption({
      title: {
        text: "客户分布",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "潜在客户" },
            { value: 735, name: "意向客户" },
            { value: 580, name: "成交客户" },
            { value: 484, name: "流失客户" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (salesChart) {
    salesChart.resize();
  }
  if (customerChart) {
    customerChart.resize();
  }
};

// 组件挂载时初始化
onMounted(() => {
  initCharts();
  window.addEventListener("resize", handleResize);
});

// 组件卸载前清理
onBeforeUnmount(() => {
  if (salesChart) {
    salesChart.dispose();
  }
  if (customerChart) {
    customerChart.dispose();
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
