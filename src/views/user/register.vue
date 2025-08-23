<template>
  <div class="register-container">
    <!-- 注册卡片 -->
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <span>用户注册</span>
        </div>
      </template>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="register-form"
      >
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            type="email"
          />
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="地址" prop="address">
          <el-input v-model="registerForm.address" placeholder="请输入地址" />
        </el-form-item>

        <!-- 账号 -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入账号" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            type="password"
            show-password
          />
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="register-btn"
            @click="handleRegister"
            :loading="isRegistering"
          >
            {{ isRegistering ? "注册中..." : "注册" }}
          </el-button>
          <el-button @click="goToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/user";

// 路由实例
const router = useRouter();

// 用户存储
const userStore = useUserStore();

// 表单引用
const registerFormRef = ref<FormInstance>();

// 注册状态
const isRegistering = ref(false);

// 注册表单数据
const registerForm = reactive({
  nickname: "", // 昵称
  email: "", // 邮箱
  address: "", // 地址
  username: "", // 账号
  password: "", // 密码
  confirmPassword: "", // 确认密码
});

// 默认头像
const defaultAvatar =
  "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

// 注册表单验证规则
const registerRules = computed<FormRules>(() => ({
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度应在2-20个字符之间", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
  address: [
    { required: true, message: "请输入地址", trigger: "blur" },
    {
      min: 5,
      max: 100,
      message: "地址长度应在5-100个字符之间",
      trigger: "blur",
    },
  ],
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 4, max: 20, message: "账号长度应在4-20个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在6-20个字符之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
}));

// 处理头像上传
const handleAvatarChange = (uploadFile: UploadFile) => {
  // 检查文件类型
  const isImage = uploadFile.raw?.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return;
  }

  // 检查文件大小 (2MB)
  const isLt2M = uploadFile.raw && uploadFile.raw.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
    return;
  }

  // 读取文件并显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    registerForm.avatar = e.target?.result as string;
  };
  reader.readAsDataURL(uploadFile.raw!);
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      isRegistering.value = true;
      try {
        // 模拟注册请求
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 注册成功后模拟登录
        ElMessage.success("注册成功!");

        // 模拟登录操作
        userStore.login({
          token: "mock-token-" + Date.now(),
          userInfo: {
            id: Date.now(), // 使用时间戳作为唯一ID
            username: registerForm.username,
            nickname: registerForm.nickname,
            avatar: defaultAvatar, // 使用默认头像
            role: "user", // 默认为普通用户
            permissions: ["read"], // 默认权限
            name: registerForm.nickname,
            email: registerForm.email, // 添加邮箱字段
            createdAt: new Date().toISOString(), // 添加创建时间
          },
          expiresIn: 3600, // 1小时过期
        });

        // 跳转到首页
        router.push("/");
      } catch (error) {
        ElMessage.error("注册失败，请稍后重试");
        console.error("注册失败:", error);
      } finally {
        isRegistering.value = false;
      }
    } else {
      ElMessage.error("请填写正确的注册信息");
    }
  });
};

// 返回登录页面
const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 500px;
}

.card-header {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 100%;
  margin-bottom: 20px;
}
</style>
