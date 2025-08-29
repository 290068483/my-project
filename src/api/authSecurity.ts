/**
 * 认证安全管理 API
 * 提供密码策略、账户锁定、安全检查等功能
 */

import { request } from "@/utils/request/index";

/**
 * 密码策略接口
 */
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbidCommonPasswords: boolean;
  historyCount: number; // 历史密码检查数量
  expiryDays: number; // 密码过期天数
}

/**
 * 账户安全状态接口
 */
export interface AccountSecurityStatus {
  isLocked: boolean;
  lockReason?: string;
  lockTime?: string;
  unlockTime?: string;
  failedAttempts: number;
  maxFailedAttempts: number;
  lastLoginTime?: string;
  lastLoginIp?: string;
  passwordExpired: boolean;
  passwordExpiryDate?: string;
  requirePasswordChange: boolean;
}

/**
 * 登录风险评估结果
 */
export interface LoginRiskAssessment {
  riskLevel: "low" | "medium" | "high";
  riskFactors: string[];
  requireAdditionalVerification: boolean;
  recommendedActions: string[];
}

/**
 * 安全令牌接口
 */
export interface SecurityToken {
  token: string;
  type: "email" | "sms" | "app";
  expiresIn: number;
  maxAttempts: number;
}

/**
 * 获取密码策略
 */
export function getPasswordPolicy(): Promise<{
  code: number;
  msg: string;
  data: PasswordPolicy;
}> {
  return request.get("/auth/password-policy");
}

/**
 * 验证密码强度
 * @param password 密码
 */
export function validatePasswordStrength(password: string): Promise<{
  code: number;
  msg: string;
  data: {
    score: number; // 0-100 分数
    level: "weak" | "medium" | "strong" | "very_strong";
    suggestions: string[];
    isValid: boolean;
  };
}> {
  return request.post("/auth/validate-password", { password });
}

/**
 * 检查密码是否在历史记录中
 * @param password 密码
 */
export function checkPasswordHistory(password: string): Promise<{
  code: number;
  msg: string;
  data: {
    inHistory: boolean;
    message: string;
  };
}> {
  return request.post("/auth/check-password-history", { password });
}

/**
 * 获取账户安全状态
 */
export function getAccountSecurityStatus(): Promise<{
  code: number;
  msg: string;
  data: AccountSecurityStatus;
}> {
  return request.get("/auth/security-status");
}

/**
 * 解锁账户
 * @param reason 解锁原因
 * @param verificationCode 验证码
 */
export function unlockAccount(
  reason: string,
  verificationCode: string,
): Promise<{
  code: number;
  msg: string;
}> {
  return request.post("/auth/unlock-account", { reason, verificationCode });
}

/**
 * 登录风险评估
 * @param loginData 登录数据
 */
export function assessLoginRisk(loginData: {
  username: string;
  ip: string;
  userAgent: string;
  location?: string;
}): Promise<{
  code: number;
  msg: string;
  data: LoginRiskAssessment;
}> {
  return request.post("/auth/assess-login-risk", loginData);
}

/**
 * 发送安全验证码
 * @param type 验证类型
 * @param purpose 验证目的
 */
export function sendSecurityCode(
  type: "email" | "sms",
  purpose: "login" | "unlock" | "reset_password" | "change_security",
): Promise<{
  code: number;
  msg: string;
  data: SecurityToken;
}> {
  return request.post("/auth/send-security-code", { type, purpose });
}

/**
 * 验证安全验证码
 * @param code 验证码
 * @param token 安全令牌
 */
export function verifySecurityCode(
  code: string,
  token: string,
): Promise<{
  code: number;
  msg: string;
  data: {
    verified: boolean;
    remainingAttempts: number;
  };
}> {
  return request.post("/auth/verify-security-code", { code, token });
}

/**
 * 设置密保问题
 * @param questions 密保问题和答案
 */
export function setSecurityQuestions(
  questions: Array<{
    question: string;
    answer: string;
  }>,
): Promise<{
  code: number;
  msg: string;
}> {
  return request.post("/auth/set-security-questions", { questions });
}

/**
 * 获取密保问题
 * @param username 用户名（用于找回密码时）
 */
export function getSecurityQuestions(username?: string): Promise<{
  code: number;
  msg: string;
  data: Array<{
    id: number;
    question: string;
  }>;
}> {
  return request.get("/auth/security-questions", {
    params: username ? { username } : {},
  });
}

/**
 * 验证密保问题答案
 * @param answers 答案列表
 */
export function verifySecurityQuestions(
  answers: Array<{
    questionId: number;
    answer: string;
  }>,
): Promise<{
  code: number;
  msg: string;
  data: {
    verified: boolean;
    correctCount: number;
    totalCount: number;
  };
}> {
  return request.post("/auth/verify-security-questions", { answers });
}

/**
 * 获取设备信息
 */
export function getDeviceInfo(): {
  userAgent: string;
  platform: string;
  browser: string;
  version: string;
  isMobile: boolean;
  fingerprint: string;
} {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  // 简单的浏览器检测
  let browser = "Unknown";
  let version = "";

  if (ua.indexOf("Chrome") > -1) {
    browser = "Chrome";
    version = ua.match(/Chrome\/(\d+)/)?.[1] || "";
  } else if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox";
    version = ua.match(/Firefox\/(\d+)/)?.[1] || "";
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari";
    version = ua.match(/Version\/(\d+)/)?.[1] || "";
  } else if (ua.indexOf("Edge") > -1) {
    browser = "Edge";
    version = ua.match(/Edge\/(\d+)/)?.[1] || "";
  }

  // 移动设备检测
  const isMobile =
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua);

  // 生成设备指纹（简化版）
  const fingerprint = btoa(`${ua}${platform}${screen.width}${screen.height}${new Date().getTimezoneOffset()}`);

  return {
    userAgent: ua,
    platform,
    browser,
    version,
    isMobile,
    fingerprint,
  };
}

/**
 * 获取地理位置（如果用户允许）
 */
export function getCurrentLocation(): Promise<{
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        resolve({ error: error.message });
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      },
    );
  });
}

/**
 * 记录安全事件
 * @param event 安全事件
 */
export function logSecurityEvent(event: {
  type: "login_attempt" | "password_change" | "account_unlock" | "suspicious_activity";
  details: Record<string, unknown>;
  riskLevel?: "low" | "medium" | "high";
}): Promise<{
  code: number;
  msg: string;
}> {
  return request.post("/auth/log-security-event", {
    ...event,
    timestamp: new Date().toISOString(),
    deviceInfo: getDeviceInfo(),
  });
}
