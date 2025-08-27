<template>
  <div class="notification-settings p-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">通知设置</h2>

      <!-- 通知方式设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">通知方式</span>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">邮箱通知</p>
              <p class="text-sm text-gray-500">通过邮箱接收系统通知</p>
            </div>
            <el-switch v-model="notificationSettings.emailNotification" @change="updateSettings" :loading="updating" />
          </div>

          <el-divider />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">短信通知</p>
              <p class="text-sm text-gray-500">通过短信接收重要通知</p>
            </div>
            <el-switch v-model="notificationSettings.smsNotification" @change="updateSettings" :loading="updating" />
          </div>

          <el-divider />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">系统内通知</p>
              <p class="text-sm text-gray-500">在系统内显示通知消息</p>
            </div>
            <el-switch v-model="notificationSettings.systemNotification" @change="updateSettings" :loading="updating" />
          </div>
        </div>
      </el-card>

      <!-- 通知类型设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">通知类型</span>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">安全提醒</p>
              <p class="text-sm text-gray-500">登录异常、密码修改等安全相关通知</p>
            </div>
            <el-switch v-model="notificationSettings.securityAlerts" @change="updateSettings" :loading="updating" />
          </div>

          <el-divider />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">营销邮件</p>
              <p class="text-sm text-gray-500">产品更新、活动推广等营销信息</p>
            </div>
            <el-switch v-model="notificationSettings.marketingEmails" @change="updateSettings" :loading="updating" />
          </div>
        </div>
      </el-card>

      <!-- 通知时段设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">免打扰时段</span>
        </template>
        <div class="space-y-4">
          <div class="flex items-center">
            <el-checkbox v-model="doNotDisturbEnabled" @change="updateSettings"> 启用免打扰模式 </el-checkbox>
          </div>

          <div v-if="doNotDisturbEnabled" class="ml-6">
            <div class="flex items-center space-x-4 mb-4">
              <span class="text-sm">免打扰时段：</span>
              <el-time-picker
                v-model="doNotDisturbStart"
                placeholder="开始时间"
                format="HH:mm"
                value-format="HH:mm"
                @change="updateSettings" />
              <span>至</span>
              <el-time-picker
                v-model="doNotDisturbEnd"
                placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                @change="updateSettings" />
            </div>

            <div class="text-sm text-gray-500">在此时段内将不会收到非紧急通知</div>
          </div>
        </div>
      </el-card>

      <!-- 通知频率设置 -->
      <el-card class="mb-6" shadow="hover">
        <template #header>
          <span class="font-semibold">通知频率</span>
        </template>
        <div class="space-y-4">
          <div>
            <p class="font-medium mb-2">邮件摘要频率</p>
            <el-radio-group v-model="emailDigestFrequency" @change="updateSettings">
              <el-radio value="immediately">立即发送</el-radio>
              <el-radio value="daily">每日摘要</el-radio>
              <el-radio value="weekly">每周摘要</el-radio>
              <el-radio value="never">从不发送</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-card>

      <!-- 通知历史 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">通知历史</span>
            <div class="space-x-2">
              <el-button size="small" @click="markAllAsRead" :loading="markingRead"> 全部标记为已读 </el-button>
              <el-button size="small" @click="clearAllNotifications" :loading="clearing"> 清空历史 </el-button>
            </div>
          </div>
        </template>

        <div class="max-h-64 overflow-y-auto">
          <div v-if="notifications.length === 0" class="text-center text-gray-500 py-8">暂无通知记录</div>
          <div v-else class="space-y-3">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              :class="{ 'bg-blue-50': !notification.read }">
              <div class="flex-shrink-0 mt-1">
                <div class="w-2 h-2 rounded-full" :class="notification.read ? 'bg-gray-300' : 'bg-blue-500'"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-sm text-gray-600">{{ notification.content }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
              </div>
              <div class="flex-shrink-0">
                <el-button v-if="!notification.read" size="small" text @click="markAsRead(notification.id)">
                  标记已读
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getNotificationSettings, updateNotificationSettings, type NotificationSettings } from "@/api/userSettings";

// 通知设置
const notificationSettings = reactive<NotificationSettings>({
  emailNotification: true,
  smsNotification: false,
  systemNotification: true,
  marketingEmails: false,
  securityAlerts: true,
});

// 免打扰设置
const doNotDisturbEnabled = ref(false);
const doNotDisturbStart = ref("22:00");
const doNotDisturbEnd = ref("08:00");

// 邮件摘要频率
const emailDigestFrequency = ref("daily");

// 状态
const updating = ref(false);
const markingRead = ref(false);
const clearing = ref(false);

// 通知历史数据
const notifications = ref([
  {
    id: 1,
    title: "安全提醒",
    content: "您的账户在新设备上登录",
    time: "2024-01-20 14:30",
    read: false,
    type: "security",
  },
  {
    id: 2,
    title: "系统通知",
    content: "您的个人资料已更新",
    time: "2024-01-20 10:15",
    read: true,
    type: "system",
  },
  {
    id: 3,
    title: "产品更新",
    content: "系统新增了数据导出功能",
    time: "2024-01-19 16:45",
    read: false,
    type: "product",
  },
  {
    id: 4,
    title: "安全提醒",
    content: "您的密码已成功修改",
    time: "2024-01-18 09:20",
    read: true,
    type: "security",
  },
]);

// 加载通知设置
const loadSettings = async () => {
  try {
    const response = await getNotificationSettings();
    if (response.code === 200) {
      Object.assign(notificationSettings, response.data);
    }
  } catch (error) {
    console.error("加载通知设置失败:", error);
    // 使用默认设置
  }
};

// 更新设置
const updateSettings = async () => {
  try {
    updating.value = true;

    const settings = {
      ...notificationSettings,
      doNotDisturbEnabled: doNotDisturbEnabled.value,
      doNotDisturbStart: doNotDisturbStart.value,
      doNotDisturbEnd: doNotDisturbEnd.value,
      emailDigestFrequency: emailDigestFrequency.value,
    };

    const response = await updateNotificationSettings(settings as any);

    if (response.code === 200) {
      ElMessage.success("设置保存成功");
    } else {
      ElMessage.error(response.msg || "保存失败");
    }
  } catch (error) {
    console.error("更新设置失败:", error);
    ElMessage.error("保存失败");
  } finally {
    updating.value = false;
  }
};

// 标记单个通知为已读
const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
    ElMessage.success("已标记为已读");
  }
};

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    markingRead.value = true;

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    notifications.value.forEach((notification) => {
      notification.read = true;
    });

    ElMessage.success("已全部标记为已读");
  } catch (error) {
    ElMessage.error("操作失败");
  } finally {
    markingRead.value = false;
  }
};

// 清空通知历史
const clearAllNotifications = async () => {
  try {
    await ElMessageBox.confirm("确定要清空所有通知历史吗？此操作不可恢复。", "确认清空", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    clearing.value = true;

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    notifications.value = [];
    ElMessage.success("通知历史已清空");
  } catch {
    // 用户取消操作
  } finally {
    clearing.value = false;
  }
};

// 页面挂载时加载设置
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.notification-settings {
  min-height: 100vh;
}

.el-card {
  border-radius: 8px;
}

.el-card :deep(.el-card__header) {
  background-color: #f8f9fa;
  padding: 16px 20px;
}
</style>
