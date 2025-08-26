<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>用户注册</span>
        </div>
      </template>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        label-width="80px"
        class="register-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名（字母或数字）" @blur="validateUsername" />
          <div v-if="usernameCheckStatus" class="username-status">
            <span v-if="usernameCheckStatus === 'checking'" class="checking">
              <el-icon class="is-loading"><Loading /></el-icon>
              检查中...
            </span>
            <span v-else-if="usernameCheckStatus === 'available'" class="available">
              <el-icon><SuccessFilled /></el-icon>
              用户名可用
            </span>
            <span v-else-if="usernameCheckStatus === 'taken'" class="taken">
              <el-icon><CircleCloseFilled /></el-icon>
              用户名已被注册
            </span>
          </div>
        </el-form-item>

        <el-form-item v-if="showCaptcha" label="安全验证" prop="code" class="captcha-form-item">
          <DragCaptcha
            ref="dragCaptchaRef"
            :width="300"
            :height="150"
            :disabled="!captchaEnabled"
            @verified="onCaptchaVerified"
            @refresh="onCaptchaRefresh" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" @blur="handlePhoneBlur" />
          <div v-if="phoneCheckStatus" class="phone-status">
            <span v-if="phoneCheckStatus === 'checking'" class="checking">
              <el-icon class="is-loading"><Loading /></el-icon>
              检查中...
            </span>
            <span v-else-if="phoneCheckStatus === 'available'" class="available">
              <el-icon><SuccessFilled /></el-icon>
              手机号可用
            </span>
            <span v-else-if="phoneCheckStatus === 'taken'" class="taken">
              <el-icon><CircleCloseFilled /></el-icon>
              手机号已被注册
            </span>
          </div>
        </el-form-item>

        <!-- 注释掉手机号验证码功能 -->
        <!-- <el-form-item label="验证码" prop="code">
          <el-row :gutter="8">
            <el-col :span="16">
              <el-input v-model="registerForm.code" placeholder="请输入手机验证码" />
            </el-col>
            <el-col :span="8">
              <el-button
                type="primary"
                :disabled="!canSendCode || sendingCode"
                :loading="sendingCode"
                @click="sendVerificationCode"
                class="send-code-btn">
                {{ codeButtonText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item> -->

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>

        <el-form-item>
          <!-- 注册按钮居中 -->
          <div class="button-container">
            <el-button type="primary" size="large" class="register-btn" @click="handleRegister" :loading="loading">
              注册
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <!-- 返回登录链接，右对齐 -->
          <div class="register-link-container">
            <el-button type="info" link @click="goToLogin">返回登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Loading, SuccessFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
// 导入用户store和类型定义
import { useUserStore } from "@/stores/user";
import type { RegisterRequest } from "@/types/auth";
import { debounce } from "@/utils/debounce";
// 导入拖动验证码组件
import DragCaptcha from "@/components/DragCaptcha.vue";

// 注册表单接口
interface RegisterForm extends RegisterRequest {
  confirmPassword: string;
}

const router = useRouter();
const userStore = useUserStore();
const registerFormRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const registerForm = reactive<RegisterForm>({
  username: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  email: "",
  phone: "",
  code: "",
  uuid: "",
});

// 用户名检查状态
const usernameCheckStatus = ref<"checking" | "available" | "taken" | null>(null);
// 手机号检查状态
const phoneCheckStatus = ref<"checking" | "available" | "taken" | null>(null);
// 注释掉验证码相关功能
// const sendingCode = ref(false);
// const codeCountdown = ref(0);
// const countdownTimer = ref<number | null>(null);
// 是否显示验证码
const showCaptcha = ref(false);
// 验证码是否启用
const captchaEnabled = ref(false);
// 拖动验证码组件引用
const dragCaptchaRef = ref<InstanceType<typeof DragCaptcha>>();
// 验证码验证token
const captchaToken = ref<string>("");
// 验证码错误次数
const captchaCount = ref(0);

// 注释掉验证码相关的计算属性
// 计算属性：是否可以发送验证码
// const canSendCode = computed(() => {
//   const phonePattern = /^1[3-9]\d{9}$/;
//   return (
//     registerForm.phone &&
//     phonePattern.test(registerForm.phone) &&
//     phoneCheckStatus.value === "available" &&
//     codeCountdown.value === 0
//   );
// });

// 计算属性：验证码按钮文本
// const codeButtonText = computed(() => {
//   if (sendingCode.value) return "发送中...";
//   if (codeCountdown.value > 0) return `${codeCountdown.value}秒后重发`;
//   return "获取验证码";
// });

// 监听用户名变化，验证格式并控制验证码显示
watch(
  () => registerForm.username,
  () => {
    validateUsername();
  },
);

// 防抖的用户名检查函数
const debouncedUsernameCheck = debounce(async (username: string) => {
  const usernamePattern = /^[a-zA-Z\d]{6,20}$/;
  if (usernamePattern.test(username)) {
    usernameCheckStatus.value = "checking";
    try {
      const available = await userStore.checkUsernameAvailability(username);
      usernameCheckStatus.value = available ? "available" : "taken";
    } catch {
      usernameCheckStatus.value = null;
    }
  } else {
    usernameCheckStatus.value = null;
  }
}, 500);

// 防抖的手机号检查函数
const debouncedPhoneCheck = debounce(async (phone: string) => {
  const phonePattern = /^1[3-9]\d{9}$/;
  if (phonePattern.test(phone)) {
    phoneCheckStatus.value = "checking";
    try {
      // 注意：这里需要确保userStore有checkPhoneAvailability方法
      // 如果没有，可以复用checkUsernameAvailability方法
      const available = await userStore.checkUsernameAvailability(phone);
      phoneCheckStatus.value = available ? "available" : "taken";
    } catch {
      phoneCheckStatus.value = null;
    }
  } else {
    phoneCheckStatus.value = null;
  }
}, 500);

/**
 * 验证用户名格式
 * 根据用户名格式决定是否启用验证码
 */
const validateUsername = () => {
  // 用户名格式：6-20位，可以是纯字母、纯数字或字母+数字组合
  const usernamePattern = /^[a-zA-Z\d]{6,20}$/;
  const isValidUsername = usernamePattern.test(registerForm.username);

  if (isValidUsername) {
    captchaEnabled.value = true;
    showCaptcha.value = true;
    debouncedUsernameCheck(registerForm.username);
  } else {
    captchaEnabled.value = false;
    showCaptcha.value = false;
    usernameCheckStatus.value = null;
    // 清空验证码相关状态
    captchaToken.value = "";
  }
};

// 处理手机号失焦事件
const handlePhoneBlur = () => {
  const phonePattern = /^1[3-9]\d{9}$/;
  if (registerForm.phone && phonePattern.test(registerForm.phone)) {
    debouncedPhoneCheck(registerForm.phone);
  } else {
    phoneCheckStatus.value = null;
  }
};

/**
 * 处理拖动验证码验证结果
 */
const onCaptchaVerified = (success: boolean, token?: string) => {
  if (success && token) {
    captchaToken.value = token;
    registerForm.uuid = token;
  } else {
    captchaToken.value = "";
    registerForm.uuid = "";
    captchaCount.value++;

    // 验证失败3次后禁用验证码功能
    if (captchaCount.value >= 3) {
      captchaEnabled.value = false;
      showCaptcha.value = false;
      ElMessage.error("验证失败次数过多，请重新输入用户名");
      registerForm.username = "";
    }
  }
};

/**
 * 处理验证码刷新
 */
const onCaptchaRefresh = () => {
  captchaToken.value = "";
  registerForm.uuid = "";
};

// 注释掉发送验证码功能
// 发送验证码
// const sendVerificationCode = async () => {
//   if (!canSendCode.value || !registerForm.phone) return;

//   try {
//     sendingCode.value = true;
//     await userStore.sendRegisterVerificationCode(registerForm.phone);

//     // 启动倒计时
//     codeCountdown.value = 60;
//     countdownTimer.value = window.setInterval(() => {
//       codeCountdown.value--;
//       if (codeCountdown.value <= 0) {
//         if (countdownTimer.value) {
//           clearInterval(countdownTimer.value);
//           countdownTimer.value = null;
//         }
//       }
//     }, 1000);
//   } catch {
//     // 错误已在store中处理
//   } finally {
//     sendingCode.value = false;
//   }
// };

// 密码验证函数
const validatePass = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (value.length < 8) {
      callback(new Error("密码长度不能少于8位"));
    } else {
      // 验证密码格式：可以是纯字母、纯数字或字母+数字组合
      const isAlphabetic = /^[a-zA-Z]+$/.test(value);
      const isNumeric = /^\d+$/.test(value);
      const isAlphanumeric = /^[a-zA-Z\d]+$/.test(value);

      if (!isAlphabetic && !isNumeric && !isAlphanumeric) {
        callback(new Error("密码只能包含字母和数字"));
      } else {
        if (registerForm.confirmPassword !== "") {
          registerFormRef.value?.validateField("confirmPassword");
        }
        callback();
      }
    }
  }
};

// 确认密码验证函数
const validatePass2 = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

// 表单验证规则
const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      pattern: /^[a-zA-Z\d]{6,20}$/,
      message: "用户名必须为6-20位字母或数字",
      trigger: "blur",
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
      trigger: "blur",
    },
  ],
  phone: [
    { message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  // 注释掉验证码验证规则
  // code: [
  //   { required: true, message: "请输入验证码", trigger: "blur" },
  //   {
  //     pattern: /^[0-9]{4,6}$/,
  //     message: "验证码为4-6位数字",
  //     trigger: "blur",
  //   },
  //   {
  //     validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
  //       if (showCaptcha.value && (!captchaToken.value || captchaToken.value.trim() === "")) {
  //         callback(new Error("请完成拖动验证"));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur",
  //   },
  // ],
  nickname: [
    { message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度在2-20个字符之间", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  password: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: "blur" }],
});

// 注册处理函数
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    // 表单验证
    await registerFormRef.value.validate();

    // 检查用户名是否可用
    if (usernameCheckStatus.value !== "available") {
      ElMessage.error("请先检查用户名是否可用");
      return;
    }

    // 检查手机号是否可用
    if (phoneCheckStatus.value !== "available") {
      ElMessage.error("请先检查手机号是否可用");
      return;
    }

    // 注释掉验证码验证
    // 验证拖动验证码
    // if (showCaptcha.value && (!captchaToken.value || captchaToken.value.trim() === "")) {
    //   ElMessage.error("请完成拖动验证");
    //   return;
    // }

    loading.value = true;

    // 准备注册数据
    const registerData: RegisterRequest = {
      username: registerForm.username,
      password: registerForm.password,
      nickname: registerForm.nickname,
      email: registerForm.email,
      phone: registerForm.phone,
      code: registerForm.code,
      uuid: registerForm.uuid,
    };

    // 调用注册 API
    await userStore.register(registerData);

    // 注册成功后的处理
    ElMessage.success("注册成功，请登录");

    // 跳转到登录页
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch {
    // 错误已在store中处理
  } finally {
    loading.value = false;
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push("/login");
};

/**
 * 组件挂载时执行
 * 初始化验证码相关状态
 */
onMounted(async () => {
  // 初始状态：验证码功能默认禁用
  captchaEnabled.value = false;
  showCaptcha.value = false;

  // 检查用户名是否已有值
  if (registerForm.username) {
    validateUsername();
  }
});

/**
 * 清理函数
 * 清除定时器等资源
 */
const cleanupResources = () => {
  // 注释掉验证码倒计时相关清理
  // 清理定时器
  // if (countdownTimer.value) {
  //   clearInterval(countdownTimer.value);
  //   countdownTimer.value = null;
  // }
  // 清理拖动验证码组件
  if (dragCaptchaRef.value) {
    dragCaptchaRef.value.reset();
  }
};

// 组件销毁时执行清理
onUnmounted(() => {
  cleanupResources();
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-card {
  width: 100%;
  max-width: 500px;
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.register-form {
  padding: 20px 0;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-link-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

/* 手机号检查状态样式 */
.phone-status {
  margin-top: 5px;
  font-size: 12px;
}

.phone-status .checking {
  color: #909399;
}

.phone-status .available {
  color: #67c23a;
}

.phone-status .taken {
  color: #f56c6c;
}

/* 用户名检查状态样式 */
.username-status {
  margin-top: 5px;
  font-size: 12px;
}

.username-status .checking {
  color: #909399;
}

.username-status .available {
  color: #67c23a;
}

.username-status .taken {
  color: #f56c6c;
}

/* 拖动验证码表单项样式 */
.captcha-form-item {
  margin-bottom: 22px;
}

.captcha-form-item :deep(.el-form-item__content) {
  line-height: normal;
}

/* 验证码按钮样式 */
.send-code-btn {
  width: 100%;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-card {
    width: 90%;
    margin: 20px;
  }
}
</style>
