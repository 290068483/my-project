/**
 * 用户验证相关类型定义
 * 基于API测试指南中提到的接口规范
 */

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
