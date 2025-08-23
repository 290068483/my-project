<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录卡片 -->
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>用户登录</span>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :disabled="isLoginDisabled"
            @blur="validateUsername"
          />
        </el-form-item>
        <el-form-item
          aria-disabled="!captchaEnabled"
          label="验证码"
          prop="captcha"
        >
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                :disabled="!captchaEnabled"
              />
            </el-col>
            <el-col :span="10">
              <!-- 验证码按钮禁用条件：登录禁用、验证码加载中或验证码未启用
               手机号验证为false 或
                手机号验证为true 且 验证码未加载未完成 isCaptchaLoading:true
                手机号验证为true 且 正在登录 isLoginDisabled:true-->
              <el-button
                type="default"
                class="captcha-btn"
                @click="getCaptcha"
                :disabled="
                  (!captchaEnabled && !isCaptchaLoading) ||
                  (captchaEnabled && isLoginDisabled) ||
                  (captchaEnabled && isCaptchaLoading)
                "
                :loading="isCaptchaLoading"
              >
                {{ captchaText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="isLoginDisabled"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="isLoading"
            :disabled="!isFormValid || isLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入Vue相关API
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
// 导入Element Plus组件和消息提示
import { ElMessage, ElForm } from "element-plus";
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
  }
};

/**
 * 获取验证码
 * 模拟发送验证码并启动倒计时
 */
const getCaptcha = async () => {
  if (!captchaEnabled.value) return;

  try {
    // 模拟获取验证码接口
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 启动倒计时
    let countdown = captchaTimeout.value;
    isCaptchaLoading.value = true;
    captchaText.value = `${countdown}秒后重新获取`;
    captchaInterval.value = window.setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(captchaInterval.value as number);
        captchaText.value = "获取验证码";
      } else {
        captchaText.value = `${countdown}秒后重新获取`;
      }
    }, 1000);

    ElMessage.success("验证码发送成功");
  } catch (e: any) {
    ElMessage.error("获取验证码失败，请重试");
  } finally {
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
      message: "请输入用户名",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "用户名必须是手机号",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur", "change"],
    },
    {
      min: 6,
      max: 20,
      message: "密码长度必须在6-20个字符之间",
      trigger: ["blur", "change"],
    },
  ],
  captcha: [
    {
      required: showCaptcha.value,
      message: "请输入验证码",
      trigger: ["blur", "change"],
    },
    {
      min: 4,
      max: 6,
      message: "验证码长度必须在4-6个字符之间",
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

    isLoading.value = true;
    isLoginDisabled.value = true;

    // 模拟验证码验证
    if (showCaptcha.value) {
      if (loginForm.captcha.toLowerCase() !== "8888") {
        captchaCount.value++;
        if (captchaCount.value >= 3) {
          ElMessage.error("验证码错误次数超过3次，请重新获取");
          loginForm.captcha = "";
          getCaptcha();
        } else {
          ElMessage.error("验证码错误");
        }
        return;
      }
    }

    // 调用登录接口
    const response: any = await request.post("/mock/login", {
      username: loginForm.username,
      password: loginForm.password,
    });

    if (response.data.success) {
      // 登录成功
      const { token, userInfo, expiresIn } = response.data.data;

      // 存储用户信息
      userStore.login({
        token,
        userInfo,
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
    } else {
      // 登录失败
      loginCount.value++;
      checkShowCaptcha();
      ElMessage.error(response.data.message || "登录失败");

      // 超过3次失败，清空表单
      if (loginCount.value >= 3) {
        loginForm.username = "";
        loginForm.password = "";
        loginForm.captcha = "";
      }
    }
  } catch (error: any) {
    // 表单验证失败或网络错误
    if (error.name === "ValidationError") {
      // 表单验证错误已经通过rules提示
    } else {
      ElMessage.error("登录失败，请重试");
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
});

/**
 * 清理函数
 * 清除验证码定时器
 */
const cleanup = () => {
  if (captchaInterval.value) {
    clearInterval(captchaInterval.value);
  }
};

/**
 * 组件卸载时执行
 * 注册清理函数
 */
onUnmounted(cleanup);
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(245, 247, 250, 0.8);
  /* 半透明背景 */
}

.login-card {
  width: clamp(400px, 66.67vw, 1200px);
  /* 默认占2/3屏幕 */
  max-width: 800px;
  min-height: 50vh;
  /* 默认占1/2屏幕 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  /* 半透明卡片 */
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.login-form {
  padding: 20px 0;
}

.login-btn {
  width: 100%;
}

.captcha-btn {
  width: 100%;
}
</style>
