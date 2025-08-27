/**
 * 登录认证相关API
 * 基于RuoYi架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
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
  });
}

/**
 * 获取验证码
 * @returns Promise<CaptchaResponse>
 */
export function getCaptchaImage(): Promise<CaptchaResponse> {
  return request.get("/captchaImage", {
    withToken: false,
  });
}

/**
 * 获取当前登录用户信息
 * @returns Promise<UserInfoResponse>
 */
export function getUserInfo(): Promise<UserInfoResponse> {
  return request.get("/getInfo");
}

/**
 * 获取用户可访问的路由菜单
 * @returns Promise<RoutersResponse>
 */
export function getRouters(): Promise<RoutersResponse> {
  return request.get("/getRouters");
}

/**
 * 用户退出登录
 * @returns Promise<LogoutResponse>
 */
export function logout(): Promise<LogoutResponse> {
  return request.post("/logout");
}

// ==================== 兼容性支持 ====================

/**
 * 兼容原有的验证码接口名称
 * @returns Promise<CaptchaResponse>
 */
export function getCodeImg(): Promise<CaptchaResponse> {
  return getCaptchaImage();
}

/**
 * 刷新验证码（重新获取）
 * @returns Promise<CaptchaResponse>
 */
export function refreshCaptcha(): Promise<CaptchaResponse> {
  return getCaptchaImage();
}

// 导出类型定义
export type {
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LogoutResponse,
} from "@/types/auth";
