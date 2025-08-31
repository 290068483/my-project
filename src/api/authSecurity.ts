/**
 * 认证安全管理 API
 * 提供密码策略、账户锁定、安全检查等功能
 */

import request from "@/utils/request";
import type { ApiResponse } from "@/types/api";
import type {
  PasswordPolicy,
  PasswordValidation,
  SecurityStatus,
  SecurityQuestion,
  SecurityEvent,
  LoginRiskAssessment,
} from "@/types/authSecurity";

// ==================== 密码安全相关 ====================

/**
 * 获取密码策略
 * @returns Promise<ApiResponse<PasswordPolicy>>
 */
export function getPasswordPolicy(): Promise<ApiResponse<PasswordPolicy>> {
  return request({
    url: "/auth/password-policy",
    method: "get",
  });
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns Promise<ApiResponse<PasswordValidation>>
 */
export function validatePassword(password: string): Promise<ApiResponse<PasswordValidation>> {
  return request({
    url: "/auth/validate-password",
    method: "post",
    data: { password },
  });
}

/**
 * 检查密码历史
 * @param password 密码
 * @returns Promise<ApiResponse<PasswordValidation>>
 */
export function checkPasswordHistory(password: string): Promise<ApiResponse<PasswordValidation>> {
  return request({
    url: "/auth/check-password-history",
    method: "post",
    data: { password },
  });
}

// ==================== 账户安全相关 ====================

/**
 * 获取账户安全状态
 * @returns Promise<ApiResponse<SecurityStatus>>
 */
export function getSecurityStatus(): Promise<ApiResponse<SecurityStatus>> {
  return request({
    url: "/auth/security-status",
    method: "get",
  });
}

/**
 * 解锁账户
 * @param reason 解锁原因
 * @param verificationCode 验证码
 * @returns Promise<ApiResponse<unknown>>
 */
export function unlockAccount(reason: string, verificationCode: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/unlock-account",
    method: "post",
    data: { reason, verificationCode },
  });
}

/**
 * 评估登录风险
 * @param loginData 登录数据
 * @returns Promise<ApiResponse<LoginRiskAssessment>>
 */
export function assessLoginRisk(loginData: {
  username: string;
  password: string;
  ip?: string;
  userAgent?: string;
}): Promise<ApiResponse<LoginRiskAssessment>> {
  return request({
    url: "/auth/assess-login-risk",
    method: "post",
    data: loginData,
  });
}

// ==================== 安全验证相关 ====================

/**
 * 发送安全验证码
 * @param type 验证类型
 * @param purpose 用途
 * @returns Promise<ApiResponse<{ token: string }>>
 */
export function sendSecurityCode(
  type: "email" | "sms",
  purpose: "login" | "reset" | "change" | "verify",
): Promise<ApiResponse<{ token: string }>> {
  return request({
    url: "/auth/send-security-code",
    method: "post",
    data: { type, purpose },
  });
}

/**
 * 验证安全验证码
 * @param code 验证码
 * @param token 令牌
 * @returns Promise<ApiResponse<unknown>>
 */
export function verifySecurityCode(code: string, token: string): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/verify-security-code",
    method: "post",
    data: { code, token },
  });
}

/**
 * 设置安全问题
 * @param questions 安全问题数组
 * @returns Promise<ApiResponse<unknown>>
 */
export function setSecurityQuestions(questions: SecurityQuestion[]): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/set-security-questions",
    method: "post",
    data: { questions },
  });
}

/**
 * 获取安全问题
 * @param userId 用户ID
 * @returns Promise<ApiResponse<SecurityQuestion[]>>
 */
export function getSecurityQuestions(userId: number): Promise<ApiResponse<SecurityQuestion[]>> {
  return request({
    url: "/auth/security-questions",
    method: "get",
    params: { userId },
  });
}

/**
 * 验证安全问题
 * @param answers 答案数组
 * @returns Promise<ApiResponse<{ token: string }>>
 */
export function verifySecurityQuestions(
  answers: { questionId: number; answer: string }[],
): Promise<ApiResponse<{ token: string }>> {
  return request({
    url: "/auth/verify-security-questions",
    method: "post",
    data: { answers },
  });
}

// ==================== 安全日志相关 ====================

/**
 * 记录安全事件
 * @param event 安全事件
 * @returns Promise<ApiResponse<unknown>>
 */
export function logSecurityEvent(event: SecurityEvent): Promise<ApiResponse<unknown>> {
  return request({
    url: "/auth/log-security-event",
    method: "post",
    data: event,
  });
}
