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
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px" class="login-form">
        <el-form-item label="用户名" prop="username" class="password-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名（字母或数字）"
            :disabled="isLoginDisabled"
            size="small"
            @blur="validateUsername" />
        </el-form-item>
        <el-form-item v-if="showCaptcha" label="安全验证" prop="code" class="captcha-form-item">
          <DragCaptcha
            ref="dragCaptchaRef"
            :width="300"
            :height="150"
            :disabled="!captchaEnabled || isLoginDisabled"
            @verified="onCaptchaVerified"
            @refresh="onCaptchaRefresh" />
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
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
// 导入Element Plus组件和消息提示
import { ElMessage, ElForm } from "element-plus";
// 导入图标
import { Lock } from "@element-plus/icons-vue";
// 导入路由相关API
import { useRouter } from "vue-router";
// 导入用户Store
import { useUserStore } from "@/stores/user";
// 导入防抖函数
import { debounce } from "@/utils/debounce";
// 导入类型定义
import type { LoginRequest } from "@/types/auth";
// 导入拖动验证码组件
import DragCaptcha from "@/components/DragCaptcha.vue";

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

// 加载状态
const loading = ref(false);
// 是否禁用登录按钮
const isLoginDisabled = ref(false);
// 表单是否有效
const isFormValid = ref(false);
// 登录尝试次数
const loginCount = ref(0);
// 验证码错误次数
const captchaCount = ref(0);
// 是否显示验证码
const showCaptcha = ref(false);
// 验证码是否启用
const captchaEnabled = ref(false);
// 拖动验证码组件引用
const dragCaptchaRef = ref<InstanceType<typeof DragCaptcha>>();
// 验证码验证token
const captchaToken = ref<string>("");

/**
 * 处理拖动验证码验证结果
 */
const onCaptchaVerified = (success: boolean, token?: string) => {
  console.log("🎯 [验证码调试] 验证码验证结果:", { success, token: token ? token.substring(0, 10) + "..." : "无" });

  if (success && token) {
    console.log("✅ [验证码调试] 验证成功，保存token");
    captchaToken.value = token;
    loginForm.code = "verified";
    loginForm.uuid = token;
  } else {
    console.log("❌ [验证码调试] 验证失败，清空状态");
    captchaToken.value = "";
    loginForm.code = "";
    loginForm.uuid = "";
    captchaCount.value++;
    console.log("📊 [验证码调试] 验证失败次数:", captchaCount.value);

    // 验证失败3次后禁用验证码功能
    if (captchaCount.value >= 3) {
      console.log("⚠️ [验证码调试] 验证失败次数过多，禁用验证码功能");
      captchaEnabled.value = false;
      showCaptcha.value = false;
      ElMessage.error("验证失败次数过多，请重新输入用户名");
      loginForm.username = "";
    }
  }
};

/**
 * 处理验证码刷新
 */
const onCaptchaRefresh = () => {
  console.log("🔄 [验证码调试] 验证码刷新，清空状态");
  captchaToken.value = "";
  loginForm.code = "";
  loginForm.uuid = "";
};

/**
 * 验证用户名格式
 * 根据用户名格式决定是否启用验证码
 */
const validateUsername = () => {
  console.log("🔍 [用户名验证] 开始验证用户名:", loginForm.username);

  // 用户名格式：5-20位，可以是纯字母、纯数字或字母+数字组合
  const usernamePattern = /^[a-zA-Z\d]{5,20}$/;
  const isValidUsername = usernamePattern.test(loginForm.username);

  console.log("📝 [用户名验证] 验证结果:", {
    username: loginForm.username,
    length: loginForm.username.length,
    isValidFormat: isValidUsername,
    pattern: usernamePattern.toString(),
  });

  if (isValidUsername) {
    console.log("✅ [用户名验证] 用户名格式正确，启用验证码");
    captchaEnabled.value = true;
    showCaptcha.value = true;
  } else {
    console.log("❌ [用户名验证] 用户名格式不正确，禁用验证码");
    captchaEnabled.value = false;
    showCaptcha.value = false;
    // 清空验证码相关状态
    loginForm.code = "";
    loginForm.uuid = "";
    captchaToken.value = "";
  }

  console.log("🔄 [用户名验证] 验证码状态更新:", {
    captchaEnabled: captchaEnabled.value,
    showCaptcha: showCaptcha.value,
  });
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
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        // 验证用户名格式：可以是纯字母、纯数字或字母+数字组合
        const isAlphabetic = /^[a-zA-Z]+$/.test(value);
        const isNumeric = /^\d+$/.test(value);
        const isAlphanumeric = /^[a-zA-Z\d]+$/.test(value);

        if (!isAlphabetic && !isNumeric && !isAlphanumeric) {
          callback(new Error("用户名只能包含字母和数字"));
        } else {
          callback();
        }
      },
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
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        // 验证密码格式：可以是纯字母、纯数字或字母+数字组合
        const isAlphabetic = /^[a-zA-Z]+$/.test(value);
        const isNumeric = /^\d+$/.test(value);
        const isAlphanumeric = /^[a-zA-Z\d]+$/.test(value);

        if (!isAlphabetic && !isNumeric && !isAlphanumeric) {
          callback(new Error("密码只能包含字母和数字"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  code: [
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (showCaptcha.value && (!captchaToken.value || captchaToken.value.trim() === "")) {
          callback(new Error("请完成拖动验证"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
};

/**
 * 监听表单变化，验证表单是否有效
 */
watch([() => loginForm.username, () => loginForm.password, () => loginForm.code], () => {
  validateForm();
});

/**
 * 验证表单是否有效
 * @returns {Promise<void>} 无返回值
 */
const validateForm = async () => {
  try {
    await loginFormRef.value?.validateField("username");
    await loginFormRef.value?.validateField("password");
    if (showCaptcha.value) {
      await loginFormRef.value?.validateField("code");
    }
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }
};

/**
 * 处理登录请求（带防抖）
 * @returns {Promise<void>} 无返回值
 */
const handleLogin = debounce(async () => {
  console.log("🚀 [登录调试] 开始登录流程");
  console.log("📝 [登录调试] 登录表单数据:", {
    username: loginForm.username,
    password: loginForm.password ? "***已填写***" : "未填写",
    code: loginForm.code,
    uuid: loginForm.uuid,
  });

  try {
    console.log("✅ [登录调试] 开始表单验证...");
    // 表单验证
    await loginFormRef.value?.validate();
    console.log("✅ [登录调试] 表单验证通过");

    loading.value = true;
    isLoginDisabled.value = true;

    // 验证拖动验证码
    if (showCaptcha.value && (!captchaToken.value || captchaToken.value.trim() === "")) {
      console.log("❌ [登录调试] 验证码验证失败: 需要完成拖动验证");
      ElMessage.error("请完成拖动验证");
      return;
    }

    if (showCaptcha.value) {
      console.log("✅ [登录调试] 拖动验证码验证通过, token:", captchaToken.value.substring(0, 10) + "...");
    } else {
      console.log("ℹ️ [登录调试] 无需验证码验证");
    }

    console.log("🌐 [登录调试] 开始调用登录API...");
    // 调用用户store的登录方法
    await userStore.login(loginForm);
    console.log("🎉 [登录调试] 登录API调用成功");

    // 登录成功，重置计数和状态
    loginCount.value = 0;
    captchaCount.value = 0;
    console.log("🔄 [登录调试] 重置登录计数和验证码计数");
    // 保持验证码显示状态，不重置为false

    // 跳转到首页或重定向页面
    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      console.log("🔄 [登录调试] 跳转到重定向页面:", redirect);
      router.push(redirect as string);
    } else {
      console.log("🔄 [登录调试] 跳转到首页");
      router.push("/");
    }
  } catch (error: unknown) {
    console.error("❌ [登录调试] 登录失败:", error);
    // 登录失败处理
    loginCount.value++;
    console.log("📊 [登录调试] 登录失败次数:", loginCount.value);

    // 类型安全检查
    const errorObj = error as { code?: number; message?: string };
    console.log("🔍 [登录调试] 错误详情:", {
      code: errorObj.code,
      message: errorObj.message,
      type: typeof error,
    });

    // 如果是验证码相关错误，需要重置验证码
    if (errorObj.code === 460 || errorObj.code === 461) {
      console.log("🔄 [登录调试] 检测到验证码错误，重置验证码状态");
      loginForm.code = "";
      loginForm.uuid = "";
      captchaToken.value = "";
      captchaCount.value++;
      console.log("📊 [登录调试] 验证码错误次数:", captchaCount.value);

      // 验证码错误3次后禁用验证码功能
      if (captchaCount.value >= 3) {
        console.log("⚠️ [登录调试] 验证码错误次数过多，禁用验证码功能");
        captchaEnabled.value = false;
        showCaptcha.value = false;
        ElMessage.error("验证失败次数过多，请重新输入用户名");
        loginForm.username = "";
        return;
      }

      // 重置拖动验证码
      console.log("🔄 [登录调试] 重置拖动验证码组件");
      dragCaptchaRef.value?.reset();
    }

    // 超过3次失败，清空表单
    if (loginCount.value >= 3) {
      console.log("⚠️ [登录调试] 登录失败次数过多，清空表单");
      loginForm.username = "";
      loginForm.password = "";
      loginForm.code = "";
      ElMessage.warning("登录失败次数过多，请重新输入");
    }
  } finally {
    console.log("🏁 [登录调试] 登录流程结束，恢复UI状态");
    loading.value = false;
    isLoginDisabled.value = false;
  }
});

/**
 * 组件挂载时执行
 * 初始化验证码相关状态
 */
onMounted(async () => {
  console.log("🚀 [登录组件] 组件已挂载");
  console.log("📝 [登录组件] 初始状态:", {
    captchaEnabled: captchaEnabled.value,
    showCaptcha: showCaptcha.value,
    loginCount: loginCount.value,
    captchaCount: captchaCount.value,
  });

  // 初始状态：验证码功能默认禁用
  captchaEnabled.value = false;
  showCaptcha.value = false;

  console.log("🔧 [登录组件] 测试模式已启用，可以在控制台使用以下命令:");
  console.log("🧪 window.testLogin() - 快速填入 admin/admin123");
  console.log("📊 window.getLoginState() - 查看当前登录状态");
  console.log("🔄 window.simulateCaptcha() - 模拟验证码成功");

  // 在全局对象上添加测试函数
  (window as any).testLogin = () => {
    console.log("🧪 [测试模式] 开始快速登录测试 - admin/admin123");
    loginForm.username = "admin";
    loginForm.password = "admin123";
    console.log("✅ [测试模式] 已填入测试账号");
    validateUsername();
  };

  (window as any).getLoginState = () => {
    const state = {
      username: loginForm.username,
      password: loginForm.password ? "•".repeat(loginForm.password.length) : "未填写",
      captchaEnabled: captchaEnabled.value,
      showCaptcha: showCaptcha.value,
      captchaToken: captchaToken.value ? captchaToken.value.substring(0, 10) + "..." : "空",
      loginCount: loginCount.value,
      captchaCount: captchaCount.value,
      loading: loading.value,
      isLoginDisabled: isLoginDisabled.value,
    };
    console.log("📊 [状态查看] 当前登录状态:", state);
    return state;
  };

  (window as any).simulateCaptcha = () => {
    console.log("🔄 [测试模式] 模拟验证码成功");
    const mockToken = `test_captcha_token_${Date.now()}`;
    onCaptchaVerified(true, mockToken);
    console.log("✅ [测试模式] 验证码模拟完成，可以进行登录");
  };

  // 检查用户名是否已有值（例如从URL参数获取）
  if (loginForm.username) {
    console.log("🔄 [登录组件] 检测到预设用户名，开始验证:", loginForm.username);
    validateUsername();
  }
});

/**
 * 清理函数
 * 清除定时器等资源
 */
const cleanup = () => {
  // 清理拖动验证码组件
  if (dragCaptchaRef.value) {
    dragCaptchaRef.value.reset();
  }
};

/**
 * 组件卸载时执行
 * 注册清理函数
 */
onUnmounted(() => {
  cleanup();
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
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
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

/* 拖动验证码样式 */
.captcha-form-item {
  width: 100%;
}

.captcha-form-item :deep(.el-form-item__content) {
  width: 100%;
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

  .password-form-item,
  .captcha-form-item {
    width: 100%;
  }
}
</style>
