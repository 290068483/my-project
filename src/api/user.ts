/**
 * 用户相关API
 * 基于RuoYi-Vue标准实现
 */

import { request } from "@/utils/request";
import type { UserInfoResponse, LogoutResponse, UserInfo } from "@/types/auth";

/**
 * 获取用户详细信息
 * RuoYi标准接口：/getInfo
 * @returns Promise<UserInfoResponse>
 */
export function getInfo(): Promise<UserInfoResponse> {
  return request.get("/getInfo", undefined, {
    timeout: 15000,
    silentError: true, // 用户信息获取失败时静默处理
  });
}

/**
 * 退出登录
 * RuoYi标准接口：/logout
 * @returns Promise<LogoutResponse>
 */
export function logout(): Promise<LogoutResponse> {
  return request.post(
    "/logout",
    {},
    {
      timeout: 10000,
      silentError: true, // 退出登录失败时静默处理
    },
  );
}

// ==================== 个人信息管理 ====================

/**
 * 更新用户信息
 * RuoYi标准接口：/system/user/profile
 * @param userInfo 用户信息
 * @returns Promise<{ code: number; msg: string; data?: unknown }>
 */
export function updateUserInfo(userInfo: Partial<UserInfo>): Promise<{
  code: number;
  msg: string;
  data?: unknown;
}> {
  return request.put("/system/user/profile", userInfo, {
    showLoading: true,
    loadingText: "更新中...",
    timeout: 15000,
  });
}

/**
 * 修改密码
 * RuoYi标准接口：/system/user/profile/updatePwd
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns Promise<{ code: number; msg: string }>
 */
export function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{
  code: number;
  msg: string;
}> {
  return request.put(
    "/system/user/profile/updatePwd",
    {
      oldPassword,
      newPassword,
    },
    {
      showLoading: true,
      loadingText: "修改中...",
      timeout: 15000,
    },
  );
}

/**
 * 上传用户头像
 * RuoYi标准接口：/system/user/profile/avatar
 * @param file 头像文件
 * @returns Promise<{ code: number; msg: string; data: { url: string } }>
 */
export function uploadAvatar(file: File): Promise<{
  code: number;
  msg: string;
  data: { url: string };
}> {
  return request.upload("/system/user/profile/avatar", file, {
    showLoading: true,
    loadingText: "上传中...",
    timeout: 60000,
  });
}

// ==================== 用户管理（管理员功能） ====================

/**
 * 分页查询用户列表
 * RuoYi标准接口：/system/user/list
 * @param params 查询参数
 * @returns Promise<{ code: number; msg: string; rows: UserInfo[]; total: number }>
 */
export function listUser(params: {
  pageNum?: number;
  pageSize?: number;
  userName?: string;
  phonenumber?: string;
  status?: string;
  deptId?: number;
  beginTime?: string;
  endTime?: string;
}): Promise<{
  code: number;
  msg: string;
  rows: UserInfo[];
  total: number;
}> {
  return request.get(
    "/system/user/list",
    { params },
    {
      timeout: 15000,
      silentError: true,
    },
  );
}

/**
 * 获取用户详细信息
 * RuoYi标准接口：/system/user/{userId}
 * @param userId 用户ID
 * @returns Promise<{ code: number; msg: string; data: UserInfo }>
 */
export function getUser(userId: number): Promise<{
  code: number;
  msg: string;
  data: UserInfo;
}> {
  return request.get(`/system/user/${userId}`, undefined, {
    timeout: 10000,
  });
}

/**
 * 新增用户
 * RuoYi标准接口：/system/user
 * @param userData 用户数据
 * @returns Promise<{ code: number; msg: string }>
 */
export function addUser(userData: Partial<UserInfo>): Promise<{
  code: number;
  msg: string;
}> {
  return request.post("/system/user", userData, {
    showLoading: true,
    loadingText: "新增中...",
    timeout: 15000,
  });
}

/**
 * 修改用户
 * RuoYi标准接口：/system/user
 * @param userData 用户数据
 * @returns Promise<{ code: number; msg: string }>
 */
export function updateUser(userData: Partial<UserInfo>): Promise<{
  code: number;
  msg: string;
}> {
  return request.put("/system/user", userData, {
    showLoading: true,
    loadingText: "修改中...",
    timeout: 15000,
  });
}

/**
 * 删除用户
 * RuoYi标准接口：/system/user/{userIds}
 * @param userIds 用户ID数组
 * @returns Promise<{ code: number; msg: string }>
 */
export function delUser(userIds: number[]): Promise<{
  code: number;
  msg: string;
}> {
  return request.delete(`/system/user/${userIds.join(",")}`, undefined, {
    showLoading: true,
    loadingText: "删除中...",
    timeout: 15000,
  });
}

/**
 * 重置用户密码
 * RuoYi标准接口：/system/user/resetPwd
 * @param userId 用户ID
 * @param password 新密码
 * @returns Promise<{ code: number; msg: string }>
 */
export function resetUserPwd(
  userId: number,
  password: string,
): Promise<{
  code: number;
  msg: string;
}> {
  return request.put(
    "/system/user/resetPwd",
    {
      userId,
      password,
    },
    {
      showLoading: true,
      loadingText: "重置中...",
      timeout: 15000,
    },
  );
}

/**
 * 修改用户状态
 * RuoYi标准接口：/system/user/changeStatus
 * @param userId 用户ID
 * @param status 状态
 * @returns Promise<{ code: number; msg: string }>
 */
export function changeUserStatus(
  userId: number,
  status: string,
): Promise<{
  code: number;
  msg: string;
}> {
  return request.put(
    "/system/user/changeStatus",
    {
      userId,
      status,
    },
    {
      showLoading: true,
      loadingText: "修改中...",
      timeout: 10000,
    },
  );
}

// ==================== 用户授权 ====================

/**
 * 查询用户授权角色
 * RuoYi标准接口：/system/user/authRole/{userId}
 * @param userId 用户ID
 * @returns Promise<{ code: number; msg: string; data: unknown }>
 */
export function getAuthRole(userId: number): Promise<{
  code: number;
  msg: string;
  data: unknown;
}> {
  return request.get(`/system/user/authRole/${userId}`, undefined, {
    timeout: 10000,
  });
}

/**
 * 用户授权角色
 * RuoYi标准接口：/system/user/authRole
 * @param data 授权数据
 * @returns Promise<{ code: number; msg: string }>
 */
export function updateAuthRole(data: { userId: number; roleIds: string }): Promise<{
  code: number;
  msg: string;
}> {
  return request.put("/system/user/authRole", data, {
    showLoading: true,
    loadingText: "授权中...",
    timeout: 15000,
  });
}

// 导出类型定义
export type { UserInfoResponse, LogoutResponse, UserInfo } from "@/types/auth";
