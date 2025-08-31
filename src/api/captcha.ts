import request from "@/utils/request";
import type { ApiResponse } from "@/types/api";
import type { CaptchaConfig, SlideCaptchaData } from "@/types/captcha";

// ==================== 图形验证码相关 ====================

/**
 * 获取图形验证码
 * @returns Promise<ApiResponse<{ uuid: string; img: string }>>
 */
export function getCaptchaImage(): Promise<ApiResponse<{ uuid: string; img: string }>> {
  return request({
    url: "/captchaImage",
    method: "get",
    headers: {
      isToken: false,
    },
    timeout: 20000,
  });
}

/**
 * 验证图形验证码
 * @param uuid 验证码UUID
 * @param code 用户输入的验证码
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifyCaptcha(uuid: string, code: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/captcha/verify",
    method: "post",
    data: { uuid, code },
  });
}

/**
 * 刷新图形验证码
 * @returns Promise<ApiResponse<{ uuid: string; img: string }>>
 */
export function refreshCaptcha(): Promise<ApiResponse<{ uuid: string; img: string }>> {
  return request({
    url: "/auth/captcha/refresh",
    method: "post",
  });
}

// ==================== 短信验证码相关 ====================

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param type 验证码类型
 * @returns Promise<ApiResponse<unknown>>
 */
export function sendSmsCode(phone: string, type: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/sms/send",
    method: "post",
    data: { phone, type },
  });
}

/**
 * 验证短信验证码
 * @param phone 手机号
 * @param code 验证码
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifySmsCode(phone: string, code: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/sms/verify",
    method: "post",
    data: { phone, code },
  });
}

// ==================== 邮箱验证码相关 ====================

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * @param type 验证码类型
 * @returns Promise<ApiResponse<unknown>>
 */
export function sendEmailCode(email: string, type: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/email/send",
    method: "post",
    data: { email, type },
  });
}

/**
 * 验证邮箱验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifyEmailCode(email: string, code: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/email/verify",
    method: "post",
    data: { email, code },
  });
}

// ==================== 滑动验证码相关 ====================

/**
 * 获取滑动验证码配置
 * @returns Promise<ApiResponse<CaptchaConfig>>
 */
export function getCaptchaConfig(): Promise<ApiResponse<CaptchaConfig>> {
  return request({
    url: "/auth/captcha/config",
    method: "get",
  });
}

/**
 * 获取滑动验证码数据
 * @returns Promise<ApiResponse<SlideCaptchaData>>
 */
export function getSlideCaptcha(): Promise<ApiResponse<SlideCaptchaData>> {
  return request({
    url: "/auth/captcha/slide",
    method: "get",
  });
}

/**
 * 验证滑动验证码
 * @param data 验证数据
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifySlideCaptcha(data: {
  captchaId: string;
  track: number[];
  distance: number;
}): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/captcha/slide/verify",
    method: "post",
    data,
  });
}

// ==================== 通用验证码相关 ====================

/**
 * 发送通用验证码
 * @param target 目标（手机号或邮箱）
 * @param type 目标类型
 * @param purpose 用途
 * @returns Promise<ApiResponse<unknown>>
 */
export function sendCode(
  target: string,
  type: "phone" | "email",
  purpose: "register" | "login" | "reset" | "change",
): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/code/send",
    method: "post",
    data: { target, type, purpose },
  });
}

/**
 * 验证通用验证码
 * @param target 目标（手机号或邮箱）
 * @param type 目标类型
 * @param code 验证码
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifyCode(target: string, type: "phone" | "email", code: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/code/verify",
    method: "post",
    data: { target, type, code },
  });
}
