import { request } from '@/utils/request';
import type { CaptchaResponse } from '@/types/auth';

/**
 * 获取图形验证码
 * @returns Promise<CaptchaResponse>
 */
export function getCodeImg(): Promise<CaptchaResponse> {
  return request.get('/captchaImage', undefined, {
    withToken: false,
    timeout: 20000
  });
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
export function validateCaptcha(code: string, uuid: string): Promise<{
  code: number;
  msg: string;
  data: { valid: boolean };
}> {
  return request.post('/validate-captcha', { code, uuid }, {
    withToken: false
  });
}

// 导出类型定义
export type { CaptchaResponse } from '@/types/auth'