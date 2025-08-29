/**
 * 用户设置管理 API
 * 用于个人资料管理、安全设置、数据导出等功能
 */

import { request } from "@/utils/request/index";
import type { UserInfo } from "@/types/auth";

/**
 * 用户个人资料更新接口
 */
export interface UserProfileUpdateRequest {
  name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  sex?: string;
  birthday?: string;
  address?: string;
  personalSignature?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  joinDate?: string;
  employeeId?: string;
}

/**
 * 用户登录日志接口
 */
export interface LoginLog {
  id: number;
  loginTime: string;
  loginIp: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: "success" | "failure";
  msg?: string;
}

/**
 * 通知设置接口
 */
export interface NotificationSettings {
  emailNotification: boolean;
  smsNotification: boolean;
  systemNotification: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

/**
 * 隐私设置接口
 */
export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  showEmail: boolean;
  showPhone: boolean;
  showBirthday: boolean;
  showAddress: boolean;
  allowSearch: boolean;
  dataCollection: boolean;
}

/**
 * 更新用户个人资料
 * @param data 用户资料数据
 */
export function updateUserProfile(data: UserProfileUpdateRequest): Promise<{
  code: number;
  msg: string;
  data?: unknown;
}> {
  return request.put("/user/profile", data);
}

/**
 * 获取用户登录日志
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export function getUserLoginLogs(
  pageNum = 1,
  pageSize = 10,
): Promise<{
  code: number;
  msg: string;
  data: {
    total: number;
    list: LoginLog[];
  };
}> {
  return request.get("/user/loginLogs", {
    params: { pageNum, pageSize },
  });
}

/**
 * 获取通知设置
 */
export function getNotificationSettings(): Promise<{
  code: number;
  msg: string;
  data: NotificationSettings;
}> {
  return request.get("/user/notification-settings");
}

/**
 * 更新通知设置
 * @param settings 通知设置
 */
export function updateNotificationSettings(settings: NotificationSettings): Promise<{
  code: number;
  msg: string;
}> {
  return request.put("/user/notification-settings", settings);
}

/**
 * 获取隐私设置
 */
export function getPrivacySettings(): Promise<{
  code: number;
  msg: string;
  data: PrivacySettings;
}> {
  return request.get("/user/privacy-settings");
}

/**
 * 更新隐私设置
 * @param settings 隐私设置
 */
export function updatePrivacySettings(settings: PrivacySettings): Promise<{
  code: number;
  msg: string;
}> {
  return request.put("/user/privacy-settings", settings);
}

/**
 * 导出用户数据
 * @param type 导出类型：profile(个人资料) | activity(活动记录) | all(全部数据)
 */
export function exportUserData(type: "profile" | "activity" | "all" = "all"): Promise<{
  code: number;
  msg: string;
  data: {
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  };
}> {
  return request.post("/user/export-data", { type });
}

/**
 * 账户注销申请
 * @param reason 注销原因
 * @param password 确认密码
 */
export function requestAccountDeletion(
  reason: string,
  password: string,
): Promise<{
  code: number;
  msg: string;
  data?: {
    deletionRequestId: string;
    scheduledDeletionDate: string;
    cancelUrl: string;
  };
}> {
  return request.post("/user/request-deletion", { reason, password });
}

/**
 * 取消账户注销
 * @param requestId 注销请求ID
 */
export function cancelAccountDeletion(requestId: string): Promise<{
  code: number;
  msg: string;
}> {
  return request.post("/user/cancel-deletion", { requestId });
}

/**
 * 验证当前密码
 * @param password 当前密码
 */
export function verifyCurrentPassword(password: string): Promise<{
  code: number;
  msg: string;
  data: {
    verified: boolean;
  };
}> {
  return request.post("/user/verify-password", { password });
}

/**
 * 设置双重认证
 * @param method 认证方式：sms | email | app
 * @param enable 是否启用
 */
export function setupTwoFactorAuth(
  method: "sms" | "email" | "app",
  enable: boolean,
): Promise<{
  code: number;
  msg: string;
  data?: {
    qrCode?: string; // APP方式需要的二维码
    secret?: string; // APP方式需要的密钥
    backupCodes?: string[]; // 备用码
  };
}> {
  return request.post("/user/two-factor-auth", { method, enable });
}

/**
 * 验证双重认证代码
 * @param code 验证码
 * @param method 认证方式
 */
export function verifyTwoFactorCode(
  code: string,
  method: "sms" | "email" | "app",
): Promise<{
  code: number;
  msg: string;
  data: {
    verified: boolean;
  };
}> {
  return request.post("/user/verify-two-factor", { code, method });
}

// 导出类型定义
export type { UserProfileUpdateRequest, LoginLog, NotificationSettings, PrivacySettings };
