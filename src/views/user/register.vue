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
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="registerForm.address" placeholder="请输入地址" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
          />
        </el-form-item>

        <el-form-item>
          <!-- 注册按钮居中 -->
          <div class="button-container">
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              @click="handleRegister"
              :loading="loading"
            >
              注册
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <!-- 返回登录链接，右对齐 -->
          <div class="register-link-container">
            <a href="/login" class="login-link">返回登录</a>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";

interface RegisterForm {
  nickname: string;
  email: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const router = useRouter();
const registerFormRef = ref<FormInstance>();
const loading = ref(false);

const registerForm = reactive<RegisterForm>({
  nickname: "",
  email: "",
  address: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const validatePass = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (registerForm.confirmPassword !== "") {
      registerFormRef.value?.validateField("confirmPassword");
    }
    callback();
  }
};

const validatePass2 = (
  rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const registerRules = reactive<FormRules>({
  nickname: [{ message: "请输入昵称", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  address: [{ message: "请输入地址", trigger: "blur" }],
  username: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  password: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: "blur" },
  ],
});

const handleRegister = async () => {
  if (!registerFormRef.value) return;

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 模拟注册请求
      setTimeout(() => {
        loading.value = false;
        router.push("/login");
      }, 1000);
    }
  });
};
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

.login-link {
  color: #409eff;
  text-decoration: underline;
  font-size: 14px;
}

.login-link:hover {
  opacity: 0.8;
}

.register-link-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
