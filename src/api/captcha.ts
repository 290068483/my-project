/**
 * 验证码相关API
 * 基于RuoYi-Vue标准实现，支持多种验证码类型
 */

import request from "@/utils/request/index";
import type { CaptchaResponse } from "@/types/auth";

// ==================== 图形验证码 ====================

/**
 * 获取图形验证码
 * RuoYi标准接口：/captchaImage
 * @returns Promise<CaptchaResponse>
 */
export function getCodeImg(): Promise<CaptchaResponse> {
  return request.get("/captchaImage", undefined, {
    withToken: false,
    timeout: 20000,
    silentError: false, // 验证码获取失败需要显示错误
  });
}

/**
 * 获取图形验证码（兼容命名）
 * @returns Promise<CaptchaResponse>
 */
export function getCaptchaImage(): Promise<CaptchaResponse> {
  return getCodeImg();
}

/**
 * 刷新验证码
 * @returns Promise<CaptchaResponse>
 */
export function refreshCaptcha(): Promise<CaptchaResponse> {
  return getCodeImg();
}

/**
 * 验证图形验证码
 * @param code 验证码
 * @param uuid 验证码唯一标识
 * @returns Promise<{ code: number; msg: string; data: { valid: boolean } }>
 */
export function validateCaptcha(
  code: string,
  uuid: string,
): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post(
    "/validate-captcha",
    { code, uuid },
    {
      withToken: false,
      timeout: 10000,
    },
  );
}

// ==================== 短信验证码 ====================

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param type 验证码类型：login(登录) | register(注册) | reset(密码重置)
 * @returns Promise<{ code: number; msg: string; data: { success: boolean } }>
 */
export function sendSmsCode(
  phone: string,
  type: "login" | "register" | "reset" = "login",
): Promise<{
  code: number;
  msg: string;
  data: { success: boolean };
}> {
  return request.post(
    "/auth/sms/send",
    { phone, type },
    {
      withToken: false,
      showLoading: true,
      loadingText: "发送中...",
      timeout: 30000,
    },
  );
}

/**
 * 验证短信验证码
 * @param phone 手机号
 * @param code 验证码
 * @param type 验证码类型
 * @returns Promise<{ code: number; msg: string; data: { valid: boolean } }>
 */
export function verifySmsCode(
  phone: string,
  code: string,
  type: "login" | "register" | "reset" = "login",
): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post(
    "/auth/sms/verify",
    { phone, code, type },
    {
      withToken: false,
      timeout: 15000,
    },
  );
}

// ==================== 邮箱验证码 ====================

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * @param type 验证码类型：login(登录) | register(注册) | reset(密码重置)
 * @returns Promise<{ code: number; msg: string; data: { success: boolean } }>
 */
export function sendEmailCode(
  email: string,
  type: "login" | "register" | "reset" = "login",
): Promise<{
  code: number;
  msg: string;
  data: { success: boolean };
}> {
  return request.post(
    "/auth/email/send",
    { email, type },
    {
      withToken: false,
      showLoading: true,
      loadingText: "发送中...",
      timeout: 30000,
    },
  );
}

/**
 * 验证邮箱验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @param type 验证码类型
 * @returns Promise<{ code: number; msg: string; data: { valid: boolean } }>
 */
export function verifyEmailCode(
  email: string,
  code: string,
  type: "login" | "register" | "reset" = "login",
): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post(
    "/auth/email/verify",
    { email, code, type },
    {
      withToken: false,
      timeout: 15000,
    },
  );
}

// ==================== 验证码配置 ====================

/**
 * 获取验证码配置
 * @returns Promise<{ code: number; msg: string; data: CaptchaConfig }>
 */
export function getCaptchaConfig(): Promise<{
  code: number;
  msg: string;
  data: {
    enabled: boolean;
    type: "image" | "slide" | "click";
    length: number;
    expireTime: number;
  };
}> {
  return request.get("/auth/captcha/config", undefined, {
    withToken: false,
    timeout: 10000,
    silentError: true,
  });
}

// ==================== 滚动验证码 (可选) ====================

/**
 * 获取滚动验证码
 * @returns Promise<{ code: number; msg: string; data: unknown }>
 */
export function getSlideCaptcha(): Promise<{
  code: number;
  msg: string;
  data: {
    originalImageBase64: string;
    jigsawImageBase64: string;
    token: string;
    secretKey: string;
  };
}> {
  return request.get("/auth/captcha/slide", undefined, {
    withToken: false,
    timeout: 15000,
  });
}

/**
 * 验证滚动验证码
 * @param token 验证码token
 * @param pointJson 滚动轨迹数据
 * @returns Promise<{ code: number; msg: string; data: { success: boolean } }>
 */
export function verifySlideCaptcha(
  token: string,
  pointJson: string,
): Promise<{
  code: number;
  msg: string;
  data: { success: boolean };
}> {
  return request.post(
    "/auth/captcha/slide/verify",
    { token, pointJson },
    {
      withToken: false,
      timeout: 10000,
    },
  );
}

// 导出类型定义
export type { CaptchaResponse } from "@/types/auth";
