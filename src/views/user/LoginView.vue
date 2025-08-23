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
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username" class="password-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :disabled="isLoginDisabled"
            size="small"
            @blur="validateUsername"
          />
        </el-form-item>
        <el-form-item
          aria-disabled="!captchaEnabled"
          label="验证码"
          prop="captcha"
          class="password-form-item"
        >
          <el-row :gutter="8" class="captcha-container">
            <el-col :span="14">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                :disabled="!captchaEnabled || !showCaptcha"
                size="small"
              />
            </el-col>
            <el-col :span="10">
              <!-- 验证码按钮禁用条件：登录禁用、验证码加载中或验证码未启用 -->
              <el-button
                type="default"
                class="captcha-btn"
                size="small"
                @click="getCaptcha"
                :disabled="isCaptchaButtonDisabled"
                :loading="isCaptchaLoading"
              >
                {{ captchaText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="password-form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="isLoginDisabled"
            size="small"
          />
        </el-form-item>
        <div class="form-footer">
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
            native-type="submit"
          >
            登录
          </el-button>

          <div class="additional-links">
            <el-button type="info" link @click="goToRegister">
              前往注册
            </el-button>
            <el-button type="info" link @click="goToForgotPassword">
              忘记密码?
            </el-button>
          </div>
        </div>
      </el-form>
      <!-- 验证码日志显示区域 -->
      <div v-if="captchaLogs.length > 0" class="captcha-logs">
        <h4>验证码获取日志:</h4>
        <ul class="logs-list">
          <li v-for="(log, index) in captchaLogs" :key="index" class="log-item">
            {{ log }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关API
import { ref, reactive, onMounted, watch, onUnmounted, computed } from "vue";
// 导入Element Plus组件和消息提示
import { ElMessage, ElForm } from "element-plus";
// 导入图标
import { Lock } from "@element-plus/icons-vue";
// 导入路由相关API
import { useRouter } from "vue-router";
// 导入用户Store
import { useUserStore } from "@/stores/user";
// 导入HTTP请求工具
import request from "@/utils/Http";
// 导入防抖函数
import { debounce } from "@/utils/debounce";

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
const loginForm = reactive<{
  username: string;
  password: string;
  captcha: string;
}>({
  username: "",
  password: "",
  captcha: "",
});

// 加载状态
const isLoading = ref(false);
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
// 验证码获取中状态
const isCaptchaLoading = ref(false);
// 验证码按钮文本
const captchaText = ref("获取验证码");
// 验证码倒计时定时器
const captchaInterval = ref<number | null>(null);
// 验证码倒计时时长(秒)
const captchaTimeout = ref<number>(60);
// 验证码日志
const captchaLogs = ref<string[]>([]);

/**
 * 计算验证码按钮是否应该禁用
 */
const isCaptchaButtonDisabled = computed(() => {
  // 如果未启用验证码，且不在加载状态，则禁用
  if (!captchaEnabled.value && !isCaptchaLoading.value) return true;

  // 如果正在加载验证码，则禁用
  if (isCaptchaLoading.value) return true;

  // 如果登录被禁用，则禁用
  if (isLoginDisabled.value) return true;

  // 其他情况不禁用
  return false;
});

/**
 * 检查是否需要显示验证码
 * 登录失败2次后显示验证码
 */
const checkShowCaptcha = () => {
  showCaptcha.value = loginCount.value >= 2;
};

/**
 * 验证用户名是否为手机号
 * 根据手机号格式决定是否启用验证码
 */
const validateUsername = () => {
  const phonePattern = /^1[3-9]\d{9}$/;
  if (phonePattern.test(loginForm.username)) {
    captchaEnabled.value = true;
  } else {
    captchaEnabled.value = false;
    // 清空验证码相关状态
    loginForm.captcha = "";
  }
};

/**
 * 监听用户名变化，实时验证格式
 */
watch(
  () => loginForm.username,
  () => {
    validateUsername();
  }
);

/**
 * 添加日志到验证码日志数组
 */
const addCaptchaLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  captchaLogs.value.push(`[${timestamp}] ${message}`);
  // 限制日志数量，只保留最近的10条
  if (captchaLogs.value.length > 10) {
    captchaLogs.value.shift();
  }
};

/**
 * 获取验证码
 * 模拟发送验证码并启动倒计时
 */
const getCaptcha = async () => {
  if (!captchaEnabled.value) {
    addCaptchaLog("验证码未启用，无法获取验证码");
    return;
  }

  try {
    addCaptchaLog("开始获取验证码...");

    // 模拟获取验证码接口
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟生成验证码
    const mockCaptcha = Math.floor(1000 + Math.random() * 9000); // 4位数字验证码
    addCaptchaLog(`验证码获取成功: ${mockCaptcha}`);

    // 启动倒计时
    let countdown = captchaTimeout.value;
    isCaptchaLoading.value = true;
    captchaText.value = `${countdown}秒后重新获取`;
    addCaptchaLog(`启动倒计时: ${countdown}秒`);

    if (captchaInterval.value) {
      clearInterval(captchaInterval.value);
    }

    captchaInterval.value = window.setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        if (captchaInterval.value) {
          clearInterval(captchaInterval.value);
          captchaInterval.value = null;
        }
        captchaText.value = "获取验证码";
        isCaptchaLoading.value = false;
        addCaptchaLog("倒计时结束，可以重新获取验证码");
      } else {
        captchaText.value = `${countdown}秒后重新获取`;
      }
    }, 1000);

    ElMessage.success("验证码已发送，请注意查收");
  } catch (error) {
    addCaptchaLog(`获取验证码失败: ${error}`);
    ElMessage.error("获取验证码失败，请重试");
    isCaptchaLoading.value = false;
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
      min: 6,
      max: 20,
      message: "用户名长度必须在6-20个字符之间",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,19}$/,
      message: "用户名必须以字母开头，只能包含字母、数字和下划线",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入11位手机号码，以13/14/15/17/18/19开头",
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
      validator: (rule: any, value: string, callback: any) => {
        // 验证密码复杂度：必须包含大小写字母和数字
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);

        if (!hasUpper || !hasLower || !hasNumber) {
          callback(new Error("密码必须包含大小写字母和数字"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  captcha: [
    {
      required: true,
      message: "验证码不能为空",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[0-9]{4,6}$/,
      message: "验证码必须为4-6位数字",
      trigger: ["blur", "change"],
    },
    {
      validator: (rule: any, value: string, callback: any) => {
        // 模拟验证码验证（实际应由后端验证）
        if (showCaptcha.value && value.length >= 4 && value.length <= 6) {
          // 模拟验证码验证通过
          callback();
        } else {
          callback(new Error("请输入正确的验证码"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
};

/**
 * 监听表单变化，验证表单是否有效
 */
watch(
  [() => loginForm.username, () => loginForm.password, () => loginForm.captcha],
  () => {
    validateForm();
  }
);

/**
 * 验证表单是否有效
 * @returns {Promise<void>} 无返回值
 */
const validateForm = async () => {
  try {
    await loginFormRef.value?.validateField("username");
    await loginFormRef.value?.validateField("password");
    if (showCaptcha.value) {
      await loginFormRef.value?.validateField("captcha");
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
  try {
    // 表单验证
    await loginFormRef.value?.validate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    isLoading.value = true;
    isLoginDisabled.value = true;

    // 模拟验证码验证
    if (showCaptcha.value) {
      // 在实际应用中，应该由后端验证验证码
      if (loginForm.captcha.trim() === "") {
        ElMessage.error("请输入验证码");
        return;
      }
    }

    // 调用登录接口
    const response: unknown = await request.post("/mock/login", {
      username: loginForm.username,
      password: loginForm.password,
      captcha: loginForm.captcha, // 将验证码一并发送
    });

    // 类型检查
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data &&
      typeof response.data === "object"
    ) {
      const responseData = response.data;
      if ("success" in responseData && responseData.success) {
        if (
          "data" in responseData &&
          responseData.data &&
          typeof responseData.data === "object"
        ) {
          const { token, userInfo, expiresIn } = responseData.data as {
            token: string;
            userInfo: unknown;
            expiresIn: number;
          };

          // 存储用户信息
          userStore.login({
            token,
            userInfo: userInfo as never, // 保持类型安全
            expiresIn,
          });

          ElMessage.success("登录成功");

          // 重置计数
          loginCount.value = 0;
          captchaCount.value = 0;
          showCaptcha.value = false;

          // 跳转到首页或重定向页面
          const redirect = router.currentRoute.value.query.redirect;
          if (redirect) {
            router.push(redirect as string);
          } else {
            router.push("/");
          }
        }
      } else {
        // 登录失败
        loginCount.value++;
        checkShowCaptcha();
        const message =
          "message" in responseData && typeof responseData.message === "string"
            ? responseData.message
            : "登录失败";
        ElMessage.error(message);

        // 超过3次失败，清空表单
        if (loginCount.value >= 3) {
          loginForm.username = "";
          loginForm.password = "";
          loginForm.captcha = "";
          ElMessage.warning("登录失败次数过多，请重新输入");
        }
      }
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    // 表单验证失败或网络错误
    if (error instanceof Error && error.name === "ValidationError") {
      // 表单验证错误已经通过rules提示
    } else {
      ElMessage.error("登录失败，请检查网络连接或稍后重试");
    }
  } finally {
    isLoading.value = false;
    isLoginDisabled.value = false;
  }
});

/**
 * 组件挂载时执行
 * 检查是否需要显示验证码
 */
onMounted(() => {
  checkShowCaptcha();
  addCaptchaLog("组件初始化完成");
});

/**
 * 清理函数
 * 清除验证码定时器
 */
const cleanup = () => {
  if (captchaInterval.value) {
    clearInterval(captchaInterval.value);
    captchaInterval.value = null;
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

.captcha-btn {
  width: 100%;
  max-width: 250px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.captcha-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.register-link-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.return-login-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 2px 0;
}

.return-login-link:hover {
  color: #764ba2;
}

.return-login-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 1px;
  bottom: 0;
  left: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.return-login-link:hover::after {
  width: 100%;
}

.password-form-item {
  /* width: 250px; */
}

.captcha-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
  gap: 8px; /* 添加元素间距 */
}

.captcha-container .el-col {
  flex: 1 1 auto;
  min-width: 45%; /* 在小屏幕上每个元素占据约45%宽度 */
}

.captcha-btn {
  width: 100%;
  max-width: 100%;
  white-space: nowrap; /* 防止文本换行 */
}

.additional-links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

/* 验证码日志样式 */
.captcha-logs {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.captcha-logs h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.logs-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.log-item {
  padding: 4px 0;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #eee;
}

.log-item:last-child {
  border-bottom: none;
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
  .captcha-container {
    width: 100%;
  }

  .captcha-container .el-col {
    min-width: 100%;
  }
}
</style>
