# 认证功能使用指南

## 概述

经过完善后，Lanan-managerment 项目现在提供了完整的认证功能，包括多种登录方式、注册功能、密码重置等。所有功能已经统一使用新的 request 模块，并提供了类型安全的接口。

## 🎉 新增功能

### 登录功能增强

- ✅ 传统用户名/密码登录
- ✅ 手机号短信验证码登录 (新增)
- ✅ 邮箱登录 (新增)
- ✅ 密码重置功能 (新增)
- ✅ 刷新令牌支持 (新增)

### 注册功能增强

- ✅ 传统注册
- ✅ 手机号注册 (新增)
- ✅ 邮箱注册 (新增)
- ✅ 实时验证用户名/手机/邮箱可用性 (新增)
- ✅ 自动登录选项 (新增)

### 工具类增强

- ✅ 统一的认证工具类 AuthUtils (新增)
- ✅ 密码强度验证 (新增)
- ✅ 权限检查助手 (新增)
- ✅ 类型安全的验证函数 (新增)

## 🚀 快速开始

### 1. 基础登录

```typescript
import { useUserStore } from "@/stores/user";
import { AuthUtils } from "@/utils/auth";

const userStore = useUserStore();

// 方式1：使用用户store
await userStore.login({
  username: "user@example.com",
  password: "password123",
  code: "1234",
  uuid: "captcha-uuid",
});

// 方式2：使用工具类快速登录
const success = await AuthUtils.quickLogin("username", "password", "code", "uuid");
if (success) {
  console.log("登录成功");
}
```

### 2. 手机号登录 (新增)

```typescript
// 发送登录短信验证码
await userStore.sendLoginSmsCode("13800138000");

// 手机号登录
await userStore.loginWithPhoneNumber({
  phone: "13800138000",
  code: "123456",
});

// 或使用工具类
const success = await AuthUtils.loginWithPhone("13800138000", "123456");
```

### 3. 邮箱登录 (新增)

```typescript
// 邮箱登录
await userStore.loginWithEmailAddress({
  email: "user@example.com",
  password: "password123",
  code: "1234", // 可选的图形验证码
  uuid: "captcha-uuid",
});

// 或使用工具类
const success = await AuthUtils.loginWithEmail("user@example.com", "password123");
```

### 4. 用户注册

```typescript
// 传统注册
await userStore.register({
  username: "newuser",
  password: "password123",
  nickname: "新用户",
  email: "user@example.com",
});

// 手机号注册 (新增)
await userStore.registerWithPhoneNumber({
  phone: "13800138000",
  password: "password123",
  code: "123456",
  nickname: "新用户",
});

// 邮箱注册 (新增)
await userStore.registerWithEmailAddress({
  email: "user@example.com",
  password: "password123",
  code: "123456",
  nickname: "新用户",
});
```

### 5. 验证功能 (新增)

```typescript
// 检查用户名可用性
const available = await userStore.checkUsernameAvailability("newuser");

// 检查手机号可用性
const phoneAvailable = await userStore.checkPhoneAvailability("13800138000");

// 检查邮箱可用性
const emailAvailable = await userStore.checkEmailAvailability("user@example.com");

// 验证密码强度
const validation = AuthUtils.validatePasswordStrength("MyPassword123!");
console.log(validation); // { valid: true, score: 5, message: '密码强度合格' }

// 验证手机号格式
const isValidPhone = AuthUtils.validatePhoneNumber("13800138000");

// 验证邮箱格式
const isValidEmail = AuthUtils.validateEmail("user@example.com");
```

### 6. 密码重置 (新增)

```typescript
// 发送重置验证码
await userStore.sendPasswordResetCode("user@example.com", "email");
// 或
await userStore.sendPasswordResetCode("13800138000", "phone");

// 验证重置验证码
const token = await userStore.verifyPasswordResetCode("user@example.com", "123456", "email");

// 设置新密码
await userStore.setNewPassword(token, "newPassword123");
```

### 7. 权限管理

```typescript
// 检查是否已登录
const isLoggedIn = AuthUtils.isLoggedIn();

// 获取当前用户信息
const currentUser = AuthUtils.getCurrentUser();

// 检查用户权限
const hasPermission = AuthUtils.hasPermission("user:create");

// 检查用户角色
const isAdmin = AuthUtils.hasRole("admin");

// 格式化用户显示名称
const displayName = AuthUtils.formatUserDisplayName(currentUser);
```

### 8. 状态管理

```typescript
const userStore = useUserStore();

// 获取登录状态
console.log("登录状态:", userStore.loginStatus); // 'idle' | 'loading' | 'success' | 'error'
console.log("登录错误:", userStore.loginError);

// 获取注册状态
console.log("注册状态:", userStore.registerStatus);
console.log("注册错误:", userStore.registerError);

// 获取验证码倒计时
console.log("短信倒计时:", userStore.smsCodeCooldown);
console.log("邮箱倒计时:", userStore.emailCodeCooldown);

// 重置状态
userStore.resetLoginStatus();
userStore.resetRegisterStatus();
```

## 📋 API 接口

### 登录相关 API

```typescript
// 基础登录
import { login, loginWithData } from "@/api/login";

// 新增登录方式
import { loginWithPhone, loginWithEmail, sendLoginSms } from "@/api/login";

// 密码重置
import { sendResetCode, verifyResetCode, resetPassword } from "@/api/login";
```

### 注册相关 API

```typescript
// 基础注册
import { register, checkUsername, sendRegisterCode } from "@/api/register";

// 新增注册功能
import {
  registerWithPhone,
  registerWithEmail,
  checkPhone,
  checkEmail,
  sendRegisterEmailCode,
  verifyPhoneCode,
  verifyEmailCode,
  getRegisterConfig,
} from "@/api/register";
```

### 验证码相关 API

```typescript
import { getCodeImg, refreshCaptcha, validateCaptcha } from "@/api/captcha";
```

## 🔒 类型安全

所有的认证功能都提供了完整的 TypeScript 类型支持：

```typescript
import type {
  // 基础类型
  UserInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,

  // 新增类型
  PhoneLoginRequest,
  EmailLoginRequest,
  PhoneRegisterRequest,
  EmailRegisterRequest,
  PasswordResetRequest,
  RegisterConfig,
  LoginStatus,
  RegisterStatus,
  CodeType,
} from "@/types/auth";
```

## 🛡️ 安全特性

### 1. 类型安全

- 所有 API 都使用 `unknown` 而不是 `any` 类型
- 完整的 TypeScript 类型定义
- 严格的参数验证

### 2. 错误处理

- 统一的错误消息映射
- 自动错误提示
- 详细的错误日志

### 3. 验证码保护

- 图形验证码支持
- 短信验证码倒计时
- 验证码过期检查

### 4. 权限控制

- 基于角色的访问控制
- 权限检查助手
- 路由守卫支持

## 📝 使用注意事项

### 1. 验证码倒计时

系统会自动管理验证码发送的倒计时，避免频繁发送：

```typescript
// 检查倒计时状态
if (userStore.smsCodeCooldown > 0) {
  console.log(`请等待 ${userStore.smsCodeCooldown} 秒后再发送`);
}
```

### 2. 错误处理

建议在组件中使用 try-catch 来处理认证错误：

```typescript
try {
  await userStore.login(loginData);
  // 登录成功，跳转页面
  router.push("/dashboard");
} catch (error) {
  // 错误已经通过 ElMessage 显示，这里可以做其他处理
  console.error("登录失败:", error);
}
```

### 3. 状态重置

在组件卸载时，建议重置认证状态：

```typescript
import { onUnmounted } from "vue";

onUnmounted(() => {
  userStore.resetLoginStatus();
  userStore.resetRegisterStatus();
});
```

### 4. 配置获取

注册时可以获取服务器配置来验证输入：

```typescript
await userStore.loadRegisterConfig();
const config = userStore.registerConfig;

if (config) {
  // 使用配置验证密码强度
  console.log("密码最小长度:", config.passwordMinLength);
}
```

## 🧪 测试

项目中包含了完整的单元测试：

```bash
# 运行认证相关测试
npm test -- src/api/__tests__/
npm test -- src/stores/__tests__/
npm test -- src/utils/__tests__/auth.test.ts
```

## 🔄 迁移指南

如果你正在从旧版本升级，请注意：

1. **导入路径变更**：所有 API 现在统一从 `@/api` 导入
2. **类型变更**：部分接口参数类型有所调整
3. **新功能**：可以逐步使用新的登录和注册方式
4. **向后兼容**：旧的 API 接口仍然可用

## 🎯 最佳实践

1. **使用工具类**：对于简单的认证操作，优先使用 `AuthUtils`
2. **状态管理**：复杂的状态管理使用 `useUserStore`
3. **错误处理**：总是处理认证操作的错误
4. **类型安全**：使用 TypeScript 类型来确保代码正确性
5. **用户体验**：利用倒计时和状态指示提升用户体验

现在你可以在项目中使用这些强大的认证功能了！🎉
