import { request } from "@/utils/request";
import type { UserInfoResponse, LogoutResponse, UserInfo } from "@/types/auth";

/**
 * 获取用户详细信息
 * @returns Promise<UserInfoResponse>
 */
export function getInfo(): Promise<UserInfoResponse> {
  return request.get("/getInfo");
}

/**
 * 退出登录
 * @returns Promise<LogoutResponse>
 */
export function logout(): Promise<LogoutResponse> {
  return request.post("/logout");
}

/**
 * 更新用户信息
 * @param userInfo 用户信息
 * @returns Promise<{ code: number; msg: string; data?: unknown }>
 */
export function updateUserInfo(userInfo: Partial<UserInfo>): Promise<{
  code: number;
  msg: string;
  data?: unknown;
}> {
  return request.put("/updateUserInfo", userInfo);
}

/**
 * 修改密码
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
  return request.post("/changePassword", {
    oldPassword,
    newPassword,
  });
}

/**
 * 上传用户头像
 * @param file 头像文件
 * @returns Promise<{ code: number; msg: string; data: { url: string } }>
 */
export function uploadAvatar(file: File): Promise<{
  code: number;
  msg: string;
  data: { url: string };
}> {
  return request.upload("/uploadAvatar", file, {
    showLoading: true,
    loadingText: "上传中...",
  });
}

// 导出类型定义
export type { UserInfoResponse, LogoutResponse, UserInfo } from "@/types/auth";
