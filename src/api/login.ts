import { request } from "@/utils/request";
import type { LoginRequest, LoginResponse } from "@/types/auth";

/**
 * 登录方法
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param uuid 验证码唯一标识
 * @returns Promise<LoginResponse>
 */
export function login(username: string, password: string, code: string, uuid: string): Promise<LoginResponse> {
  const data: LoginRequest = {
    username,
    password,
    code,
    uuid,
  };

  return request.post("/login", data, {
    withToken: false,
    showErrorMessage: true,
    showLoading: true,
    loadingText: "登录中...",
  });
}

/**
 * 登录方法（使用对象参数）
 * @param loginData 登录数据对象
 * @returns Promise<LoginResponse>
 */
export function loginWithData(loginData: LoginRequest): Promise<LoginResponse> {
  return request.post("/login", loginData, {
    withToken: false,
    showErrorMessage: true,
    showLoading: true,
    loadingText: "登录中...",
  });
}

/**
 * 手机号登录（新增）
 * @param phone 手机号
 * @param code 验证码
 * @returns Promise<LoginResponse>
 */
export function loginWithPhone(phone: string, code: string): Promise<LoginResponse> {
  return request.post(
    "/login/phone",
    { phone, code },
    {
      withToken: false,
      showErrorMessage: true,
      showLoading: true,
      loadingText: "登录中...",
    },
  );
}

/**
 * 邮箱登录（新增）
 * @param email 邮箱
 * @param password 密码
 * @param code 验证码（可选）
 * @param uuid 验证码唯一标识（可选）
 * @returns Promise<LoginResponse>
 */
export function loginWithEmail(email: string, password: string, code?: string, uuid?: string): Promise<LoginResponse> {
  return request.post(
    "/login/email",
    { email, password, code, uuid },
    {
      withToken: false,
      showErrorMessage: true,
      showLoading: true,
      loadingText: "登录中...",
    },
  );
}

/**
 * 发送登录手机验证码（新增）
 * @param phone 手机号
 * @returns Promise<{ code: number; msg: string }>
 */
export function sendLoginSms(phone: string): Promise<{ code: number; msg: string }> {
  return request.post(
    "/login/send-sms",
    { phone },
    {
      withToken: false,
      showErrorMessage: true,
    },
  );
}

/**
 * 密码重置 - 发送验证码（新增）
 * @param account 账号（手机号或邮箱）
 * @param type 类型：'phone' | 'email'
 * @returns Promise<{ code: number; msg: string }>
 */
export function sendResetCode(account: string, type: "phone" | "email"): Promise<{ code: number; msg: string }> {
  return request.post(
    "/reset-password/send-code",
    { account, type },
    {
      withToken: false,
      showErrorMessage: true,
    },
  );
}

/**
 * 密码重置 - 验证验证码（新增）
 * @param account 账号
 * @param code 验证码
 * @param type 类型
 * @returns Promise<{ code: number; msg: string; data: { token: string } }>
 */
export function verifyResetCode(
  account: string,
  code: string,
  type: "phone" | "email",
): Promise<{
  code: number;
  msg: string;
  data: { token: string };
}> {
  return request.post(
    "/reset-password/verify-code",
    { account, code, type },
    {
      withToken: false,
      showErrorMessage: true,
    },
  );
}

/**
 * 密码重置 - 设置新密码（新增）
 * @param token 验证令牌
 * @param newPassword 新密码
 * @returns Promise<{ code: number; msg: string }>
 */
export function resetPassword(token: string, newPassword: string): Promise<{ code: number; msg: string }> {
  return request.post(
    "/reset-password/set-new",
    { token, newPassword },
    {
      withToken: false,
      showErrorMessage: true,
      showLoading: true,
      loadingText: "设置新密码中...",
    },
  );
}

// 导出类型定义
export type { LoginRequest, LoginResponse } from "@/types/auth";
