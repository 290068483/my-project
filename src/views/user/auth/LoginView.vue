<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录卡片 -->
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon">
            <Lock />
          </el-icon>
          <span class="header-text">蓝岸管理系统</span>
        </div>
      </template>

      <!-- 账号登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        @submit.prevent="handleLogin"
        :rules="loginRules"
        label-width="80px"
        class="login-form">
        <el-form-item label="用户名" prop="username" class="password-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名（字母或数字）"
            :disabled="isLoginDisabled"
            size="small"
            @blur="validateUsername" />
        </el-form-item>

        <el-form-item label="密码" prop="password" class="password-form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="isLoginDisabled"
            size="small"
            @keyup.enter="handleLogin" />
        </el-form-item>

        <!-- 二维码验证码区域 -->
        <el-form-item label="验证码" prop="code" class="password-form-item">
          <div class="qrcode-captcha-wrapper">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              :disabled="isLoginDisabled"
              size="small"
              class="captcha-input"
              @keyup.enter="handleLogin" />

            <!-- 二维码图片，带点击刷新功能 -->
            <div
              class="qrcode-container"
              @click="refreshQrcode"
              :class="{ 'qrcode-hover': isHovered, 'qrcode-error': !userStore?.captchaImage }"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false">
              <!-- 显示验证码图片或错误提示 -->
              <template v-if="userStore?.captchaImage">
                <img
                  :src="userStore.captchaImage"
                  alt="二维码验证码"
                  class="qrcode-image"
                  :class="{ 'qrcode-refreshing': isRefreshing }"
                  @error="handleImageError" />
                <div class="refresh-indicator">
                  <el-icon :size="16" :class="{ 'rotate-icon': isRefreshing }">
                    <Refresh />
                  </el-icon>
                </div>
                <!-- 调试信息 -->
                <div v-if="false" style="position: absolute; bottom: 0; left: 0; background: rgba(0,0,0,0.7); color: white; font-size: 10px; padding: 2px;">
                  UUID: {{ userStore.captchaUuid?.substring(0, 8) }}
                </div>
              </template>
              <template v-else>
                <div class="qrcode-error-message">点击刷新</div>
              </template>
            </div>
          </div>
        </el-form-item>
        
        <!-- 记住密码 -->
        <el-form-item style="margin-top: -10px;">
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0;">记住密码</el-checkbox>
        </el-form-item>
        
        <div class="form-footer">
          <el-button type="primary" size="large" class="login-btn" :loading="loading" native-type="submit">
            {{ loading ? "登录中..." : "登录" }}
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
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

// 导入图标
import { Lock, Refresh } from "@element-plus/icons-vue";

// 导入路由相关
import { useRouter } from "vue-router";

// 导入用户状态管理
import { useUserStore } from "@/stores/user";

// 导入加密工具
import { encrypt, decrypt } from "@/utils/jsencrypt";

// 导入Cookies库
import Cookies from "js-cookie";


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
const loginFormRef = ref<FormInstance>();
// 登录表单数据
const loginForm = reactive({
  username: "admin",
  password: "admin123",
  code: "",
  rememberMe: false,
});

// 状态管理
const isRefreshing = ref(false);
const isHovered = ref(false);
const loading = ref(false);
const isLoginDisabled = ref(false);

// 计算表单是否有效
/* const isFormValid = computed(() => {
  return (
    loginForm.username &&
    loginForm.password &&
    loginForm.code &&
    loginForm.username.length >= 5 &&
    loginForm.code.length >= 1
  );
}); */

/**
 * 刷新二维码
 */
const refreshQrcode = async () => {
  try {
    isRefreshing.value = true;
    // 先清空现有验证码，避免显示旧数据
    userStore.captchaImage = null;
    await userStore.getCaptcha();
    // 验证码获取成功
    console.log("验证码获取成功:", {
      uuid: userStore.captchaUuid,
    } /* satisfies { uuid: string | null; image: string; imageLength: number } */);
  } catch (error: unknown) {
    console.error("验证码刷新失败:", error);
    let errorMessage = "验证码刷新失败，请重试";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    ElMessage.error(errorMessage);
  } finally {
    // 延迟重置刷新状态，让用户能看到旋转动画
    setTimeout(() => {
      isRefreshing.value = false;
    }, 500);
  }
};

/**
 * 处理验证码图片加载错误
 */
const handleImageError = () => {
  userStore.captchaImage = null;
};

/**
 * 验证用户名格式
 */
const validateUsername = (): boolean => {
  // 检查用户名是否为空
  if (!loginForm.username || typeof loginForm.username !== 'string' || loginForm.username.trim() === "") {
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

// 页面加载时获取验证码和Cookie中的用户名密码
onMounted(async () => {
  try {
    getCookie();
    await refreshQrcode();
  } catch (error) {
    console.error("初始化验证码失败:", error);
    ElMessage.error("初始化验证码失败，请手动刷新");
  }
});

/**
 * 获取Cookie中保存的用户名和密码
 */
const getCookie = () => {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.username = username === undefined ? loginForm.username : username;
  loginForm.password = password === undefined ? loginForm.password : decrypt(password);
  loginForm.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe === "true");
};

/**
 * 设置Cookie保存用户名和密码
 */
const setCookie = () => {
  if (loginForm.rememberMe) {
    Cookies.set("username", loginForm.username, { expires: 30 });
    Cookies.set("password", encrypt(loginForm.password), { expires: 30 });
    Cookies.set("rememberMe", loginForm.rememberMe.toString(), { expires: 30 });
  } else {
    Cookies.remove("username");
    Cookies.remove("password");
    Cookies.remove("rememberMe");
  }
};

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
      min: 1,
      message: "验证码至少为1个字符",
      trigger: ["blur", "change"],
    },
  ],
};

/**
 * 处理登录请求（带防抖）
 */
const handleLogin = async () => {
  // 如果正在加载，则不执行登录
  if (loading.value) return;
  try {
    // 表单验证
    await loginFormRef.value?.validate();
    loading.value = true;
    isLoginDisabled.value = true;
    console.log("登录请求", loginForm);

    // 确保验证码UUID存在
    const uuid = userStore.captchaUuid;
    if (!uuid) {
      ElMessage.error("验证码信息丢失，请刷新验证码");
      return;
    }

    // 设置Cookie保存用户名和密码
    setCookie();

    // 调用用户store的登录方法
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
      code: loginForm.code,
      uuid: uuid,
    });
  } catch (error) {
    // 捕获登录错误
    console.error("登录错误:", error);
    ElMessage.error((error as Error)?.message || "登录失败，请重试");
  } finally {
    loading.value = false;
    isLoginDisabled.value = false;
  }
};

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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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

.qrcode-error-tip {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 5px;
}

.qrcode-error {
  border-color: #f56c6c !important;
}

.qrcode-error-message {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 12px;
  border-radius: 4px;
}

.debug-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 10px;
  font-family: monospace;
  z-index: 1000;
  display: none;
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
