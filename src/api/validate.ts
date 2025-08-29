/**
 * 用户验证相关API
 * 基于API测试指南中提到的接口规范
 */

import request from "@/utils/request/index";
import type { ApiResponse } from "@/types/api";

// ==================== 验证请求参数类型定义 ====================

/**
 * 用户名检查请求参数
 */
export interface CheckUsernameRequest {
  username: string;
}

/**
 * 手机号检查请求参数
 */
export interface CheckPhoneRequest {
  phone: string;
}

/**
 * 邮箱检查请求参数
 */
export interface CheckEmailRequest {
  email: string;
}

/**
 * 发送手机验证码请求参数
 */
export interface SendPhoneCodeRequest {
  phone: string;
}

/**
 * 发送邮箱验证码请求参数
 */
export interface SendEmailCodeRequest {
  email: string;
}

// ==================== 验证响应类型定义 ====================

/**
 * 检查响应
 */
export interface CheckResponse extends ApiResponse<boolean> {
  // RuoYi标准检查响应格式
  code: number;
  msg: string;
}

/**
 * 发送验证码响应
 */
export interface SendCodeResponse extends ApiResponse<null> {
  // RuoYi标准发送验证码响应格式
  code: number;
  msg: string;
}

// ==================== 验证接口 ====================

/**
 * 检查用户名是否可用
 * @param data 用户名检查参数
 */
export function checkUsername(data: CheckUsernameRequest): Promise<CheckResponse> {
  return request.post("/check-username", data, {
    withToken: false,
  });
}

/**
 * 检查手机号是否可用
 * @param data 手机号检查参数
 */
export function checkPhone(data: CheckPhoneRequest): Promise<CheckResponse> {
  return request.post("/check-phone", data, {
    withToken: false,
  });
}

/**
 * 检查邮箱是否可用
 * @param data 邮箱检查参数
 */
export function checkEmail(data: CheckEmailRequest): Promise<CheckResponse> {
  return request.post("/check-email", data, {
    withToken: false,
  });
}

/**
 * 发送注册手机验证码
 * @param data 手机号参数
 */
export function sendRegisterCode(data: SendPhoneCodeRequest): Promise<SendCodeResponse> {
  return request.post("/send-register-code", data, {
    withToken: false,
  });
}

/**
 * 发送注册邮箱验证码
 * @param data 邮箱参数
 */
export function sendRegisterEmailCode(data: SendEmailCodeRequest): Promise<SendCodeResponse> {
  return request.post("/send-register-email-code", data, {
    withToken: false,
  });
}
