import { request } from "@/utils/request";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

/**
 * 用户注册
 * @param data 注册数据
 * @returns Promise<RegisterResponse>
 */
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return request.post("/register", data, {
    withToken: false,
    showErrorMessage: true,
    showLoading: true,
    loadingText: "注册中...",
  });
}

/**
 * 手机号注册（新增）
 * @param phone 手机号
 * @param password 密码
 * @param code 短信验证码
 * @param nickname 昵称（可选）
 * @returns Promise<RegisterResponse>
 */
export function registerWithPhone(
  phone: string,
  password: string,
  code: string,
  nickname?: string,
): Promise<RegisterResponse> {
  return request.post(
    "/register/phone",
    { phone, password, code, nickname },
    {
      withToken: false,
      showErrorMessage: true,
      showLoading: true,
      loadingText: "注册中...",
    },
  );
}

/**
 * 邮箱注册（新增）
 * @param email 邮箱
 * @param password 密码
 * @param code 邮箱验证码
 * @param nickname 昵称（可选）
 * @returns Promise<RegisterResponse>
 */
export function registerWithEmail(
  email: string,
  password: string,
  code: string,
  nickname?: string,
): Promise<RegisterResponse> {
  return request.post(
    "/register/email",
    { email, password, code, nickname },
    {
      withToken: false,
      showErrorMessage: true,
      showLoading: true,
      loadingText: "注册中...",
    },
  );
}

/**
 * 检查用户名是否可用
 * @param username 用户名
 * @returns Promise<{ code: number; msg: string; data: { available: boolean } }>
 */
export function checkUsername(username: string): Promise<{
  code: number;
  msg: string;
  data: { available: boolean };
}> {
  return request.post(
    "/check-username",
    { username },
    {
      withToken: false,
      showErrorMessage: false, // 不显示错误消息，由组件自己处理
    },
  );
}

/**
 * 检查手机号是否可用（新增）
 * @param phone 手机号
 * @returns Promise<{ code: number; msg: string; data: { available: boolean } }>
 */
export function checkPhone(phone: string): Promise<{
  code: number;
  msg: string;
  data: { available: boolean };
}> {
  return request.post(
    "/check-phone",
    { phone },
    {
      withToken: false,
      showErrorMessage: false,
    },
  );
}

/**
 * 检查邮箱是否可用（新增）
 * @param email 邮箱
 * @returns Promise<{ code: number; msg: string; data: { available: boolean } }>
 */
export function checkEmail(email: string): Promise<{
  code: number;
  msg: string;
  data: { available: boolean };
}> {
  return request.post(
    "/check-email",
    { email },
    {
      withToken: false,
      showErrorMessage: false,
    },
  );
}

/**
 * 发送注册手机验证码
 * @param phone 手机号
 * @returns Promise<{ code: number; msg: string }>
 */
export function sendRegisterCode(phone: string): Promise<{
  code: number;
  msg: string;
}> {
  return request.post(
    "/send-register-code",
    { phone },
    {
      withToken: false,
      showErrorMessage: true,
    },
  );
}

/**
 * 发送注册邮箱验证码（新增）
 * @param email 邮箱
 * @returns Promise<{ code: number; msg: string }>
 */
export function sendRegisterEmailCode(email: string): Promise<{
  code: number;
  msg: string;
}> {
  return request.post(
    "/send-register-email-code",
    { email },
    {
      withToken: false,
      showErrorMessage: true,
    },
  );
}

/**
 * 验证手机验证码（新增）
 * @param phone 手机号
 * @param code 验证码
 * @returns Promise<{ code: number; msg: string; data: { valid: boolean } }>
 */
export function verifyPhoneCode(
  phone: string,
  code: string,
): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post(
    "/verify-phone-code",
    { phone, code },
    {
      withToken: false,
      showErrorMessage: false,
    },
  );
}

/**
 * 验证邮箱验证码（新增）
 * @param email 邮箱
 * @param code 验证码
 * @returns Promise<{ code: number; msg: string; data: { valid: boolean } }>
 */
export function verifyEmailCode(
  email: string,
  code: string,
): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post(
    "/verify-email-code",
    { email, code },
    {
      withToken: false,
      showErrorMessage: false,
    },
  );
}

/**
 * 获取注册配置（新增）
 * 返回注册相关的配置信息，如密码复杂度要求等
 * @returns Promise<{ code: number; msg: string; data: RegisterConfig }>
 */
export function getRegisterConfig(): Promise<{
  code: number;
  msg: string;
  data: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumber: boolean;
    passwordRequireSpecialChar: boolean;
    usernameMinLength: number;
    usernameMaxLength: number;
    phoneCodeExpiry: number; // 短信验证码过期时间（秒）
    emailCodeExpiry: number; // 邮箱验证码过期时间（秒）
    codeSendInterval: number; // 验证码发送间隔（秒）
  };
}> {
  return request.get("/register/config", undefined, {
    withToken: false,
    showErrorMessage: false,
  });
}

// 导出类型定义
export type { RegisterRequest, RegisterResponse } from "@/types/auth";
