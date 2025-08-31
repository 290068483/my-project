<template>
  <div class="register">
    <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">蓝岸管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
          <template #prefix
            ><el-icon class="el-input__icon"><User /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister">
          <template #prefix
            ><el-icon class="el-input__icon"><Lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter="handleRegister">
          <template #prefix
            ><el-icon class="el-input__icon"><Lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          size="large"
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleRegister">
          <template #prefix
            ><el-icon class="el-input__icon"><Key /></el-icon
          ></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right">
          <el-button type="text" @click="goToLogin">使用已有账户登录</el-button>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2025 蓝岸管理系统 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { User, Lock, Key } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
// 导入用户store和类型定义
import { useUserStore } from "@/stores/user";
import type { RegisterRequest } from "@/types/auth";

const router = useRouter();
const userStore = useUserStore();
const registerFormRef = ref<FormInstance>();

const registerForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: "",
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, trigger: "blur", message: "请输入您的账号" },
    { min: 2, max: 20, message: "用户账号长度必须介于 2 和 20 之间", trigger: "blur" },
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入您的密码" },
    { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
};

const codeUrl = ref("");
const loading = ref(false);

function handleRegister() {
  registerFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true;
      userStore
        .register(registerForm.value)
        .then((res) => {
          const username = registerForm.value.username;
          ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
            dangerouslyUseHTMLString: true,
            type: "success",
          })
            .then(() => {
              router.push("/login");
            })
            .catch(() => {});
        })
        .catch(() => {
          loading.value = false;
          getCode();
        });
    }
  });
}

function getCode() {
  userStore.getCaptcha().then((res) => {
    codeUrl.value = "data:image/gif;base64," + res.img;
    registerForm.value.uuid = res.uuid;
  });
}

function goToLogin() {
  router.push("/login");
}

getCode();

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
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("@/assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .el-input__icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
