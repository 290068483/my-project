/**
 * Request 模块使用示例
 *
 * 本文件展示了新request模块的各种使用方法和最佳实践
 */

import { request, createRequest, createAPI, batch } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

// ============================
// 1. 基础使用方法
// ============================

/**
 * 基础GET请求
 */
export async function getUser(id: number) {
  try {
    const user = await request.get(`/users/${id}`);
    return user;
  } catch (error) {
    console.error("获取用户失败:", error);
    throw error;
  }
}

/**
 * 带参数的GET请求
 */
export async function getUserList(params: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get("/users", params);
}

/**
 * POST请求创建用户
 */
export async function createUser(userData: { name: string; email: string; role: string }) {
  return request.post("/users", userData, {
    showSuccessMessage: true, // 显示成功消息
    showLoading: true, // 显示加载状态
  });
}

/**
 * PUT请求更新用户
 */
export async function updateUser(
  id: number,
  userData: Partial<{
    name: string;
    email: string;
    role: string;
  }>,
) {
  return request.put(`/users/${id}`, userData, {
    showSuccessMessage: true,
    preventRepeatSubmit: true, // 防止重复提交
  });
}

/**
 * DELETE请求删除用户
 */
export async function deleteUser(id: number) {
  return request.delete(`/users/${id}`, undefined, {
    showSuccessMessage: true,
  });
}

// ============================
// 2. 文件操作
// ============================

/**
 * 文件上传
 */
export async function uploadAvatar(file: File) {
  return request.upload("/upload/avatar", file, {
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: ".jpg,.png,.jpeg",
    onProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      console.log(`上传进度: ${progress}%`);
    },
    showLoading: true,
    loadingText: "上传中...",
  });
}

/**
 * 多文件上传
 */
export async function uploadMultipleFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  return request.upload("/upload/multiple", formData, {
    onProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      console.log(`批量上传进度: ${progress}%`);
    },
  });
}

/**
 * 文件下载
 */
export async function downloadFile(fileId: string, filename: string) {
  return request.download(`/files/${fileId}/download`, filename, {
    onProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      console.log(`下载进度: ${progress}%`);
    },
  });
}

/**
 * 导出Excel
 */
export async function exportUsers(params: any) {
  return request.download("/users/export", "users.xlsx", {
    params,
    showLoading: true,
    loadingText: "导出中...",
  });
}

// ============================
// 3. 批量请求
// ============================

/**
 * 并发获取多个用户信息
 */
export async function getUsersBatch(userIds: number[]) {
  const requests = userIds.map((id) => ({
    method: "GET" as const,
    url: `/users/${id}`,
  }));

  return request.concurrent(requests);
}

/**
 * 使用batch工具进行并发请求
 */
export async function loadDashboardData() {
  const [users, roles, permissions] = await batch.concurrent([
    { method: "GET", url: "/users" },
    { method: "GET", url: "/roles" },
    { method: "GET", url: "/permissions" },
  ]);

  return { users, roles, permissions };
}

/**
 * 串行批量创建用户
 */
export async function createUsersSequence(usersData: any[]) {
  const requests = usersData.map((userData) => ({
    method: "POST" as const,
    url: "/users",
    data: userData,
  }));

  return batch.sequence(requests);
}

/**
 * 限制并发数的批量请求
 */
export async function batchUpdateUsers(updates: Array<{ id: number; data: any }>) {
  const requests = updates.map(({ id, data }) => ({
    method: "PUT" as const,
    url: `/users/${id}`,
    data,
  }));

  // 限制并发数为3
  return batch.limited(requests, 3);
}

// ============================
// 4. 自定义配置和实例
// ============================

/**
 * 创建特定API的请求实例
 */
const userAPI = createAPI("/api/v1/users", {
  timeout: 15000,
  showLoading: true,
  cache: "session", // 使用session缓存
});

export async function getUserWithCache(id: number) {
  // 这个请求会使用session缓存
  return userAPI.get(`/${id}`);
}

/**
 * 创建不显示错误消息的请求实例
 */
const silentRequest = createRequest({
  showErrorMessage: false,
  showSuccessMessage: false,
});

export async function checkUserExistence(email: string) {
  try {
    await silentRequest.get("/users/check", { email });
    return true;
  } catch {
    return false;
  }
}

/**
 * 创建带重试功能的请求实例
 */
const reliableRequest = createRequest({
  retry: 3,
  retryDelay: 2000,
  showErrorMessage: true,
});

export async function getImportantData() {
  return reliableRequest.get("/important-data");
}

// ============================
// 5. 高级用法
// ============================

/**
 * 使用缓存的用户列表获取
 */
export async function getCachedUserList() {
  return request.get("/users", undefined, {
    cache: "memory",
    cacheTime: 10 * 60 * 1000, // 缓存10分钟
  });
}

/**
 * 需要特殊头部的请求
 */
export async function getSecureData(token: string) {
  return request.get("/secure-data", undefined, {
    headers: {
      "X-Custom-Token": token,
    },
    withToken: false, // 不使用默认token
  });
}

/**
 * 返回完整响应的请求
 */
export async function getUserWithFullResponse(id: number) {
  return request.get(`/users/${id}`, undefined, {
    returnFullResponse: true, // 返回完整的axios响应
  });
}

/**
 * 类型安全的API请求
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export async function getTypedUser(id: number): Promise<User> {
  return request.get<User>(`/users/${id}`);
}

export async function getTypedUserList(): Promise<ApiResponse<User[]>> {
  return request.get<ApiResponse<User[]>>("/users", undefined, {
    returnFullResponse: true,
  });
}

// ============================
// 6. 错误处理示例
// ============================

/**
 * 带错误处理的用户创建
 */
export async function createUserWithErrorHandling(userData: any) {
  try {
    const user = await request.post("/users", userData);
    return { success: true, data: user };
  } catch (error: any) {
    // 根据错误类型进行不同处理
    if (error.status === 422) {
      return { success: false, message: "数据验证失败", errors: error.response?.data?.errors };
    } else if (error.status === 409) {
      return { success: false, message: "用户已存在" };
    } else {
      return { success: false, message: "创建用户失败" };
    }
  }
}

/**
 * 自定义错误处理的请求
 */
export async function getUserWithCustomErrorHandling(id: number) {
  return request
    .get(`/users/${id}`, undefined, {
      showErrorMessage: false, // 不显示默认错误消息
    })
    .catch((error) => {
      // 自定义错误处理逻辑
      if (error.status === 404) {
        console.warn(`用户 ${id} 不存在`);
        return null;
      }
      throw error; // 重新抛出其他错误
    });
}

// ============================
// 7. 实际业务场景示例
// ============================

/**
 * 用户登录
 */
export async function login(credentials: { username: string; password: string; code?: string }) {
  return request.post("/auth/login", credentials, {
    withToken: false, // 登录时不需要token
    showLoading: true,
    loadingText: "登录中...",
    showErrorMessage: true,
  });
}

/**
 * 分页获取用户列表
 */
export async function getPaginatedUsers(page: number = 1, pageSize: number = 10, filters?: any) {
  return request.get(
    "/users",
    {
      page,
      pageSize,
      ...filters,
    },
    {
      cache: "session",
      cacheTime: 5 * 60 * 1000, // 缓存5分钟
    },
  );
}

/**
 * 搜索用户（防抖处理）
 */
let searchTimeout: NodeJS.Timeout;
export async function searchUsers(keyword: string) {
  // 清除之前的搜索请求
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  return new Promise((resolve) => {
    searchTimeout = setTimeout(async () => {
      try {
        const results = await request.get(
          "/users/search",
          {
            keyword,
          },
          {
            showLoading: false, // 搜索时不显示loading
          },
        );
        resolve(results);
      } catch {
        resolve([]);
      }
    }, 300); // 300ms防抖
  });
}

/**
 * 批量删除用户
 */
export async function deleteUsersInBatch(userIds: number[]) {
  return request.post(
    "/users/batch-delete",
    {
      userIds,
    },
    {
      showLoading: true,
      loadingText: "删除中...",
      showSuccessMessage: true,
      preventRepeatSubmit: true,
    },
  );
}
