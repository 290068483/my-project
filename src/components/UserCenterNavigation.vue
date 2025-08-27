<template>
  <div class="user-center-navigation">
    <div class="nav-header">
      <div class="user-avatar-section">
        <el-avatar :size="80" :src="userInfo?.avatar" class="user-avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <div class="user-basic-info">
          <h3 class="user-name">{{ userInfo?.name || "未设置姓名" }}</h3>
          <p class="user-role">{{ userInfo?.role || "普通用户" }}</p>
          <div class="user-status">
            <el-tag :type="userStatusType" size="small">
              {{ userStatusText }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-menu">
      <el-menu :default-active="activeMenu" mode="vertical" :router="true" class="user-menu">
        <!-- 基本信息分组 -->
        <div class="menu-group">
          <div class="group-title">个人信息</div>
          <el-menu-item index="/userinfo" :class="{ 'is-active': activeMenu === '/userinfo' }">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
        </div>

        <!-- 安全设置分组 -->
        <div class="menu-group">
          <div class="group-title">安全设置</div>
          <el-menu-item index="/security-settings" :class="{ 'is-active': activeMenu === '/security-settings' }">
            <el-icon><Lock /></el-icon>
            <span>安全设置</span>
            <el-badge v-if="securityWarnings > 0" :value="securityWarnings" class="security-badge" />
          </el-menu-item>

          <el-menu-item
            index="/permission-management"
            :class="{ 'is-active': activeMenu === '/permission-management' }">
            <el-icon><Key /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </div>

        <!-- 通知和隐私分组 -->
        <div class="menu-group">
          <div class="group-title">系统设置</div>
          <el-menu-item
            index="/notification-settings"
            :class="{ 'is-active': activeMenu === '/notification-settings' }">
            <el-icon><Bell /></el-icon>
            <span>通知设置</span>
            <el-badge v-if="unreadNotifications > 0" :value="unreadNotifications" class="notification-badge" />
          </el-menu-item>

          <el-menu-item index="/data-management" :class="{ 'is-active': activeMenu === '/data-management' }">
            <el-icon><Document /></el-icon>
            <span>数据管理</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <el-button-group>
        <el-button type="primary" size="small" @click="editProfile">
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <el-button type="default" size="small" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </el-button-group>
    </div>

    <!-- 安全提示 -->
    <div v-if="showSecurityTips" class="security-tips">
      <el-alert
        v-for="tip in securityTips"
        :key="tip.id"
        :title="tip.title"
        :type="tip.type"
        :description="tip.description"
        :closable="true"
        @close="dismissTip(tip.id)"
        class="security-tip">
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { User, Lock, Key, Bell, Document, Edit, Refresh } from "@element-plus/icons-vue";

// Props
const props = defineProps<{
  showSecurityTips?: boolean;
}>();

// Emits
const emit = defineEmits<{
  menuChange: [path: string];
  editProfile: [];
  refresh: [];
}>();

// 路由和Store
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 响应式数据
const unreadNotifications = ref(3);
const securityWarnings = ref(1);

// 安全提示
const securityTips = ref([
  {
    id: 1,
    title: "密码安全提醒",
    description: "您的密码即将到期，建议及时修改",
    type: "warning" as const,
    dismissed: false,
  },
  {
    id: 2,
    title: "未设置密保问题",
    description: "为了账户安全，建议设置密保问题",
    type: "info" as const,
    dismissed: false,
  },
]);

// 计算属性
const userInfo = computed(() => userStore.getUserInfo);

const activeMenu = computed(() => route.path);

const userStatusType = computed(() => {
  const status = userInfo.value?.status;
  return status === "active" ? "success" : status === "inactive" ? "warning" : "info";
});

const userStatusText = computed(() => {
  const status = userInfo.value?.status;
  return status === "active" ? "正常" : status === "inactive" ? "已禁用" : "未知";
});

const showSecurityTips = computed(() => {
  return props.showSecurityTips && securityTips.value.some((tip) => !tip.dismissed);
});

// const visibleSecurityTips = computed(() => {
//   return securityTips.value.filter(tip => !tip.dismissed);
// });

// 方法
const editProfile = () => {
  emit("editProfile");
  router.push("/userinfo");
};

const refreshData = async () => {
  emit("refresh");

  try {
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 这里可以调用实际的数据刷新方法
    await userStore.fetchUserInfo();

    ElMessage.success("数据已刷新");
  } catch (error) {
    console.error("刷新数据失败:", error);
    ElMessage.error("刷新失败");
  }
};

const dismissTip = (tipId: number) => {
  const tip = securityTips.value.find((t) => t.id === tipId);
  if (tip) {
    tip.dismissed = true;
  }
};

// 路由监听
// const handleMenuChange = (path: string) => {
//   emit('menuChange', path);
// };

// 页面挂载时的初始化
onMounted(() => {
  // 模拟加载通知数量
  unreadNotifications.value = 3;
  securityWarnings.value = 1;

  // 检查安全状态
  checkSecurityStatus();
});

// 检查安全状态
const checkSecurityStatus = () => {
  // 这里可以调用实际的安全检查API
  console.log("检查用户安全状态...");

  // 模拟安全检查结果
  setTimeout(() => {
    // 根据检查结果更新安全警告数量
    securityWarnings.value = securityTips.value.filter((tip) => !tip.dismissed).length;
  }, 1000);
};
</script>

<style scoped>
.user-center-navigation {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.nav-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.user-basic-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.user-role {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.9;
}

.user-status {
  display: flex;
  align-items: center;
}

.nav-menu {
  padding: 8px 0;
}

.menu-group {
  margin-bottom: 16px;
}

.group-title {
  padding: 8px 24px 4px 24px;
  font-size: 12px;
  color: #909399;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-menu {
  border: none;
}

.user-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 0 12px;
  border-radius: 6px;
  position: relative;
}

.user-menu .el-menu-item:hover {
  background-color: #f0f9ff;
  color: #409eff;
}

.user-menu .el-menu-item.is-active {
  background-color: #e6f7ff;
  color: #409eff;
  font-weight: 600;
}

.user-menu .el-menu-item.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background-color: #409eff;
  border-radius: 0 2px 2px 0;
}

.security-badge,
.notification-badge {
  margin-left: auto;
}

.quick-actions {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.quick-actions .el-button-group {
  width: 100%;
}

.quick-actions .el-button {
  flex: 1;
}

.security-tips {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.security-tip {
  margin-bottom: 12px;
}

.security-tip:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-center-navigation {
    width: 100%;
  }

  .user-avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .user-basic-info {
    text-align: center;
  }
}
</style>
