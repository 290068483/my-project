<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">蓝岸管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
          <template #prefix
            ><el-icon class="el-input__icon"><User /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin">
          <template #prefix
            ><el-icon class="el-input__icon"><Lock /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin">
          <template #prefix
            ><el-icon class="el-input__icon"><Key /></el-icon
          ></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="refreshQrcode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2025 蓝岸管理系统 All Rights Reserved.</span>
    </div>
  </div>
</template>

<style scoped>
.login {
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

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
}
.login-form .el-input {
  height: 40px;
}
.login-form .el-input input {
  height: 40px;
}
.login-form .el-input__icon {
  height: 39px;
  width: 14px;
  margin-left: 0px;
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
}
.login-code img {
  cursor: pointer;
  vertical-align: middle;
}
.el-login-footer {
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
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
.link-type {
  text-decoration: none;
  color: #337ab7;
}
</style>

<script setup lang="ts">
// 导入Vue相关API
import { ref, reactive, onMounted, watch } from "vue";

// 导入Element Plus组件和消息提示
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";

// 导入图标
import { Lock, User, Key } from "@element-plus/icons-vue";

// 导入路由相关
import { useRouter, useRoute } from "vue-router";

// 导入用户状态管理
import { useUserStore } from "@/stores/user";

// 导入加密工具
import { encrypt, decrypt } from "@/utils/jsencrypt";

// 导入Cookies库
import Cookies from "js-cookie";

// 导入类型定义
import type { CaptchaResponse } from "@/types/auth";

// 路由实例
const router = useRouter();
const route = useRoute();
// 用户Store实例
const userStore = useUserStore();
// 登录表单引用
const loginFormRef = ref<FormInstance>();
// 登录表单数据
const loginForm = reactive({
  username: "admin",
  password: "admin123",
  code: "",
  uuid: "",
  rememberMe: false,
});

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(true);
const redirect = ref<string | undefined>(undefined);

watch(
  route,
  (newRoute) => {
    redirect.value = (newRoute.query && newRoute.query.redirect) as string | undefined;
  },
  { immediate: true },
);

function refreshQrcode() {
  userStore
    .getCaptcha()
    .then((res: any) => {
      // 修改类型为any
      // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
      const responseData = res.data || res; // 兼容两种格式

      console.log("获取验证码响应:", responseData); // 添加调试日志

      // 检查验证码数据是否有效
      if (responseData && responseData.data && responseData.data.img && responseData.data.uuid) {
        // 根据后端返回的 captchaEnabled 状态控制验证码显示/隐藏
        captchaEnabled.value = responseData.data.captchaEnabled !== false; // 默认启用，除非明确禁用
        codeUrl.value = "data:image/gif;base64," + responseData.data.img;
        loginForm.uuid = responseData.data.uuid;
      } else if (responseData && responseData.img && responseData.uuid) {
        // 处理另一种可能的数据格式（后端直接返回扁平结构）
        captchaEnabled.value = responseData.captchaEnabled !== false;
        codeUrl.value = "data:image/gif;base64," + responseData.img;
        loginForm.uuid = responseData.uuid;
      } else {
        // 数据无效时的处理
        captchaEnabled.value = false;
        ElMessage.error("验证码加载失败：返回数据格式不正确");
        console.error("验证码返回数据格式:", responseData);
      }
    })
    .catch((error) => {
      // 处理获取验证码失败的情况
      console.error("获取验证码失败:", error);
      let errorMessage = "验证码加载失败";
      if (error.message) {
        errorMessage += "：" + error.message;
      }
      ElMessage.error(errorMessage);
      // 默认启用验证码
      captchaEnabled.value = true;
    });
}

// 页面加载时获取验证码和Cookie中的用户名密码
onMounted(() => {
  refreshQrcode();
  getCookie();
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
 * 登录表单验证规则
 */
const loginRules = {
  username: [
    {
      required: true,
      message: "请输入您的账号",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入您的密码",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "change",
    },
  ],
};

function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.rememberMe) {
        Cookies.set("username", loginForm.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.rememberMe.toString(), { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore
        .login(loginForm)
        .then(() => {
          // 登录成功后显示提示信息
          ElMessage.success("登录成功");
          console.log("登录成功，用户token:", userStore.token);

          // 检查token是否正确设置
          if (!userStore.token) {
            console.error("警告：登录成功但token未正确设置");
          }

          // 登录成功后跳转到首页，让路由守卫处理用户信息获取和动态路由生成
          const query = route.query;
          const otherQueryParams: Record<string, string> = {};
          Object.keys(query).forEach((cur) => {
            if (cur !== "redirect" && typeof query[cur] === "string") {
              otherQueryParams[cur] = query[cur] as string;
            }
          });

          // 确保跳转路径正确
          const redirectPath = redirect.value || "/home";
          console.log("准备跳转到:", redirectPath, "参数:", otherQueryParams);
          router.push({ path: redirectPath, query: otherQueryParams }).catch((err) => {
            console.error("路由跳转失败:", err);
            // 如果跳转失败，尝试直接跳转到首页
            router.push("/home");
          });
        })
        .catch((error) => {
          console.error("登录流程出错:", error);
          ElMessage.error(error.message || "登录失败，请检查用户名、密码和验证码");
          loading.value = false;
          // 重新获取验证码
          if (captchaEnabled.value) {
            refreshQrcode();
          }
        });
    }
  });
}
</script>
