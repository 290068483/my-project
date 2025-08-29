/**
 * 登录认证相关API
 * 基于RuoYi架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request/index";
import type {
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LogoutResponse,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

// ==================== 认证授权接口 ====================

/**
 * 用户登录
 * 支持多种登录方式：用户名+密码、手机号+验证码、邮箱+密码
 * @param loginData 登录数据对象
 * @returns Promise<LoginResponse>
 */
export function login(loginData: LoginRequest): Promise<LoginResponse> {
  return request.post("/login", loginData, {
    withToken: false,
    showErrorMessage: true,
    showLoading: true,
    loadingText: "登录中...",
    timeout: 30000, // 增加超时时间
  });
}

/**
 * 获取验证码图片
 * RuoYi标准接口：/captchaImage
 * @returns Promise<CaptchaResponse>
 */
export function getCaptchaImage(): Promise<CaptchaResponse> {
  return request.request<CaptchaResponse>({
    method: "GET",
    url: "/captchaImage",
    withToken: false,
    timeout: 10000,
    showErrorMessage: true,
    transformResponse: false, // 不转换响应，返回完整响应对象
    returnFullResponse: true, // 返回完整响应
  });
}

/**
 * 获取当前登录用户信息
 * RuoYi标准接口：/getInfo
 * @returns Promise<UserInfoResponse>
 */
export function getInfo(): Promise<UserInfoResponse> {
  return request.request<UserInfoResponse>({
    method: "GET",
    url: "/getInfo",
    timeout: 15000,
    withToken: true, // 明确指定需要携带token
  });
}

/**
 * 获取用户可访问的路由菜单
 * RuoYi标准接口：/getRouters
 * @returns Promise<RoutersResponse>
 */
export function getRouters(): Promise<RoutersResponse> {
  return request.request<RoutersResponse>({
    method: "GET",
    url: "/getRouters",
    timeout: 15000,
  });
}

/**
 * 用户退出登录
 * RuoYi标准接口：/logout
 * @returns Promise<LogoutResponse>
 */
export function logout(): Promise<LogoutResponse> {
  return request.post(
    "/logout",
    {},
    {
      timeout: 10000,
      showErrorMessage: false, // 退出登录失败时静默处理
    },
  );
}

// ==================== 密码重置相关接口 ====================

/**
 * 忘记密码 - 发送重置验证码
 * @param identifier 邮箱或手机号
 * @param type 类型：email 或 phone
 * @returns Promise<ApiResponse<unknown>>
 */
export function sendResetCode(identifier: string, type: "email" | "phone"): Promise<ApiResponse<unknown>> {
  return request.post(
    "/auth/reset/sendCode",
    { identifier, type },
    {
      withToken: false,
      showLoading: true,
      loadingText: "发送中...",
      timeout: 30000,
    },
  );
}

/**
 * 验证重置验证码
 * @param identifier 邮箱或手机号
 * @param code 验证码
 * @param type 类型：email 或 phone
 * @returns Promise<ApiResponse<{ resetToken: string }>>
 */
export function verifyResetCode(
  identifier: string,
  code: string,
  type: "email" | "phone",
): Promise<ApiResponse<{ resetToken: string }>> {
  return request.post(
    "/auth/reset/verifyCode",
    { identifier, code, type },
    {
      withToken: false,
      timeout: 15000,
    },
  );
}

/**
 * 重置密码
 * @param resetToken 重置令牌
 * @param newPassword 新密码
 * @returns Promise<ApiResponse<unknown>>
 */
export function resetPassword(resetToken: string, newPassword: string): Promise<ApiResponse<unknown>> {
  return request.post(
    "/auth/reset/password",
    { resetToken, newPassword },
    {
      withToken: false,
      timeout: 15000,
    },
  );
}

// ==================== 注册相关接口 ====================

/**
 * 用户注册
 * @param registerData 注册数据
 * @returns Promise<ApiResponse<unknown>>
 */
export function register(registerData: {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  code: string;
  uuid: string;
}): Promise<ApiResponse<unknown>> {
  return request.post("/register", registerData, {
    withToken: false,
    showLoading: true,
    loadingText: "注册中...",
    timeout: 30000,
  });
}

/**
 * 检查用户名是否可用
 * @param username 用户名
 * @returns Promise<ApiResponse<{ available: boolean }>>
 */
export function checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
  return request.get(`/auth/checkUsername/${username}`, undefined, {
    timeout: 10000,
  });
}

// ==================== 辅助函数 ====================

/**
 * 刷新验证码
 * @returns Promise<CaptchaResponse>
 */
export function refreshCaptcha(): Promise<CaptchaResponse> {
  return getCaptchaImage();
}

// ==================== 兼容性支持 ====================

/**
 * 兼容原有的验证码接口名称
 * @returns Promise<CaptchaResponse>
 */
export function getCodeImg(): Promise<CaptchaResponse> {
  return getCaptchaImage();
}
