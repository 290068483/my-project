<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录卡片 -->
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Lock /></el-icon>
          <span class="header-text">蓝岸管理系统</span>
        </div>
      </template>

      <!-- 账号登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
        <el-form-item label="用户名" prop="username" class="password-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名（字母或数字）"
            :disabled="isLoginDisabled"
            size="small"
            @blur="validateUsername" />
        </el-form-item>

        <!-- 二维码验证码区域 -->
        <el-form-item label="验证码" prop="code" class="password-form-item">
          <div class="qrcode-captcha-wrapper">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              :disabled="isLoginDisabled"
              size="small"
              class="captcha-input" />

            <!-- 二维码图片，带点击刷新功能 -->
            <div
              class="qrcode-container"
              @click="refreshQrcode"
              :class="{ 'qrcode-hover': isHovered }"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false">
              <img
                :src="qrcodeImg"
                alt="二维码验证码"
                class="qrcode-image"
                :class="{ 'qrcode-refreshing': isRefreshing }" />
              <div class="refresh-indicator">
                <el-icon :size="16" :class="{ 'rotate-icon': isRefreshing }">
                  <Refresh />
                </el-icon>
              </div>
            </div>
          </div>
          <div v-if="qrcodeUuid" class="qrcode-uuid-tip">二维码ID: {{ qrcodeUuid.substring(0, 8) }}...</div>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="password-form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="isLoginDisabled"
            size="small" />
        </el-form-item>
        <div class="form-footer">
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
            native-type="submit">
            登录
          </el-button>

          <div class="additional-links">
            <el-button type="info" link @click="goToRegister"> 前往注册 </el-button>
            <el-button type="info" link @click="goToForgotPassword"> 忘记密码? </el-button>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关API
import { ref, reactive, onMounted, watch } from "vue";
// 导入Element Plus组件和消息提示
import { ElMessage, ElForm } from "element-plus";
// 导入图标
import { Lock, Refresh, Loading } from "@element-plus/icons-vue";
// 导入路由相关API
import { useRouter } from "vue-router";
// 导入用户Store
import { useUserStore } from "@/stores/user";
// 导入防抖函数
import { debounce } from "@/utils/debounce";
// 导入类型定义
import type { LoginRequest } from "@/types/auth";
// 导入二维码登录API
import { setupTwoFactorAuth } from "@/api/userSettings";

// 定义组件Props
defineProps<{
  // 登录成功后的重定向路径
  redirect?: string;
}>();

// 路由实例
const router = useRouter();
// 用户Store实例
const userStore = useUserStore();
// 登录表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>();
// 登录表单数据
const loginForm = reactive<LoginRequest>({
  username: "",
  password: "",
  code: "",
  uuid: "",
});

// 二维码相关数据
const qrcodeImg = ref("");
const qrcodeUuid = ref("");

// 状态管理
const isRefreshing = ref(false);
const isHovered = ref(false);
const loading = ref(false);
const isLoginDisabled = ref(false);
const isFormValid = ref(false);
const loginCount = ref(0);

/**
 * 刷新二维码
 */
const refreshQrcode = () => {
  isRefreshing.value = true;
  userStore
    .getCaptcha()
    .then(() => {
      qrcodeImg.value = userStore.captchaImage || "";
      qrcodeUuid.value = userStore.captchaUuid || "";
    })
    .finally(() => {
      isRefreshing.value = false;
    });
};

/**
 * 验证用户名格式
 */
const validateUsername = () => {
  // 检查用户名是否为空
  if (!loginForm.username || loginForm.username.trim() === "") {
    return false;
  }

  // 用户名格式：5-20位，可以是纯字母、纯数字或字母+数字组合
  const usernamePattern = /^[a-zA-Z\d]{5,20}$/;
  return usernamePattern.test(loginForm.username);
};

/**
 * 监听用户名变化，实时验证格式
 */
watch(
  () => loginForm.username,
  () => {
    validateUsername();
  },
);

/**
 * 登录表单验证规则
 */
const loginRules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[a-zA-Z\d]{5,20}$/,
      message: "用户名必须为5-20位字母或数字",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: ["blur", "change"],
    },
    {
      min: 8,
      max: 32,
      message: "密码长度必须在8-32个字符之间",
      trigger: ["blur", "change"],
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: ["blur", "change"],
    },
    {
      len: 6,
      message: "验证码长度为6个字符",
      trigger: ["blur", "change"],
    },
  ],
};

/**
 * 处理登录请求（带防抖）
 */
const handleLogin = debounce(async () => {
  try {
    // 表单验证
    await loginFormRef.value?.validate();

    loading.value = true;
    isLoginDisabled.value = true;

    // 调用用户store的登录方法
    await userStore.login({
      ...loginForm,
      uuid: qrcodeUuid.value,
    });

    // 登录成功，重置计数和状态
    loginCount.value = 0;

    // 跳转到首页或重定向页面
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect as string);
    } else {
      router.push("/");
    }
  } catch (error: unknown) {
    // 登录失败处理
    loginCount.value++;

    // 超过3次失败，清空表单
    if (loginCount.value >= 3) {
      loginForm.username = "";
      loginForm.password = "";
      loginForm.code = "";
      ElMessage.warning("登录失败次数过多，请重新输入");
    }
  } finally {
    loading.value = false;
    isLoginDisabled.value = false;
  }
});

/**
 * 组件挂载时执行
 */
onMounted(async () => {
  // 初始化加载二维码
  refreshQrcode();
});

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push("/register");
};

/**
 * 跳转到忘记密码页面
 */
const goToForgotPassword = () => {
  router.push("/forgot-password");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: clamp(300px, 50vw, 500px);
  max-width: 500px;
  min-height: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0 20px;
  color: #333;
}

.header-icon {
  margin-right: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form {
  padding: 10px 0 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #555;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.additional-links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

/* 二维码验证码区域样式 */
.qrcode-captcha-wrapper {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.qrcode-container {
  width: 120px;
  height: 32px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  transition: all 0.2s ease;
}

.qrcode-hover {
  border-color: #409eff;
}

.qrcode-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.qrcode-refreshing {
  filter: blur(2px);
}

.refresh-indicator {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #606266;
  transition: all 0.2s ease;
}

.qrcode-container:hover .refresh-indicator {
  background-color: rgba(64, 158, 255, 0.9);
  color: white;
}

.rotate-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.qrcode-uuid-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    padding: 30px 20px;
  }

  .card-header span.header-text {
    font-size: 20px;
  }

  .password-form-item {
    width: 100%;
  }

  .qrcode-container {
    width: 100px;
    height: 30px;
  }
}
</style>
