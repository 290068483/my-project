# Axios 请求封装 - 使用指南

## 概述

这是一个超级简化的 axios 请求封装，提供了基础的 HTTP 请求功能，包括请求和响应拦截器、错误处理等。

## 特性

- ✅ 支持 GET、POST、PUT、DELETE 请求
- ✅ 文件上传功能
- ✅ 请求和响应拦截器
- ✅ 自动错误处理
- ✅ 类型安全的 TypeScript 支持
- ✅ 无复杂依赖

## 快速开始

### 基础用法

```typescript
import { basicRequest } from "@/utils/request/basic";

// GET 请求
const user = await basicRequest.get("/api/users/1");

// POST 请求
const result = await basicRequest.post("/api/users", {
  name: "John",
  email: "john@example.com",
});

// PUT 请求
const updated = await basicRequest.put("/api/users/1", {
  name: "John Updated",
});

// DELETE 请求
const deleted = await basicRequest.delete("/api/users/1");
```

### 带参数的请求

```typescript
// GET 请求带查询参数
const users = await basicRequest.get("/api/users", {
  page: 1,
  size: 10,
  status: "active",
});

// DELETE 请求带参数
await basicRequest.delete("/api/users/1", {
  force: true,
});
```

### 文件上传

```typescript
// 上传单个文件
const file = document.getElementById("fileInput").files[0];
const uploadResult = await basicRequest.upload("/api/upload", file);

// 上传 FormData
const formData = new FormData();
formData.append("file", file);
formData.append("category", "avatar");
const result = await basicRequest.upload("/api/upload", formData);
```

### 自定义配置

```typescript
import { createBasicRequest } from "@/utils/request/basic";

// 创建自定义配置的请求实例
const apiRequest = createBasicRequest({
  baseURL: "/api/v1",
  timeout: 15000,
  token: "your-auth-token",
});

// 使用自定义实例
const data = await apiRequest.get("/users");
```

### 类型安全

```typescript
// 使用泛型指定响应类型
interface User {
  id: number;
  name: string;
  email: string;
}

const user = await basicRequest.get<User>("/api/users/1");
console.log(user.name); // TypeScript 提供完整的类型提示

// API 响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

const response = await basicRequest.get<ApiResponse<User[]>>("/api/users");
```

## 配置选项

### BasicConfig

```typescript
interface BasicConfig {
  baseURL?: string; // API 基础地址，默认 '/api'
  timeout?: number; // 请求超时时间，默认 10000ms
  token?: string; // 认证令牌
}
```

## 错误处理

请求封装内置了错误处理机制：

```typescript
try {
  const data = await basicRequest.get("/api/users");
} catch (error) {
  // 错误已经被自动处理和转换
  console.error("请求失败:", error.message);
}
```

### 错误类型对应

| HTTP状态码 | 错误信息   |
| ---------- | ---------- |
| 401        | 未授权     |
| 403        | 权限不足   |
| 404        | 资源不存在 |
| 500        | 服务器错误 |
| 网络错误   | 网络错误   |

## 拦截器

### 请求拦截器

自动添加：

- 认证令牌（如果配置了 token）
- 请求日志

### 响应拦截器

自动处理：

- 响应数据提取（从 `data.data` 字段）
- 错误状态码转换
- 响应日志

## API 接口

### BasicRequest 类

```typescript
class BasicRequest {
  constructor(config?: BasicConfig);

  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  upload<T>(url: string, file: File | FormData): Promise<T>;
}
```

### 默认导出

```typescript
export const basicRequest: {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, data?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown): Promise<T>;
  delete<T>(url: string, params?: Record<string, unknown>): Promise<T>;
  upload<T>(url: string, file: File | FormData): Promise<T>;
};
```

### 工厂函数

```typescript
export function createBasicRequest(config?: BasicConfig): BasicRequest;
```

## 与旧版本兼容

为了保持向后兼容，还提供了这些别名：

```typescript
export { basicRequest as default };
export { basicRequest as request };
export { basicRequest as http };
```

## 示例用法

### 用户管理

```typescript
// 获取用户列表
const users = await basicRequest.get("/users", { page: 1 });

// 创建用户
const newUser = await basicRequest.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// 更新用户
const updatedUser = await basicRequest.put(`/users/${newUser.id}`, {
  name: "John Updated",
});

// 删除用户
await basicRequest.delete(`/users/${newUser.id}`);
```

### 文件管理

```typescript
// 头像上传
const avatarInput = document.getElementById("avatar") as HTMLInputElement;
const file = avatarInput.files[0];

const uploadResult = await basicRequest.upload("/upload/avatar", file);
console.log("头像上传成功:", uploadResult.url);
```

### 错误处理示例

```typescript
async function fetchUserData(userId: string) {
  try {
    const user = await basicRequest.get(`/users/${userId}`);
    return user;
  } catch (error) {
    // 根据不同错误类型处理
    if (error.message === "未授权") {
      // 跳转到登录页
      router.push("/login");
    } else if (error.message === "资源不存在") {
      // 显示 404 页面
      router.push("/404");
    } else {
      // 显示通用错误提示
      ElMessage.error(error.message);
    }
    throw error;
  }
}
```

## 注意事项

1. **类型安全**: 建议使用 TypeScript 泛型指定响应数据类型
2. **错误处理**: 所有请求都应该包含适当的错误处理
3. **配置复用**: 对于同一个项目，建议创建统一的请求实例配置
4. **测试友好**: 该封装对单元测试友好，可以轻松 mock axios

## 测试

运行测试：

```bash
npm test src/utils/request/__tests__/basic.test.ts
```

测试覆盖了所有主要功能：

- HTTP 方法（GET, POST, PUT, DELETE）
- 文件上传
- 错误处理
- 自定义配置
- 参数传递
