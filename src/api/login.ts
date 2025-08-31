import request from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

// 登录方法
export function login(data: LoginRequest): Promise<LoginResponse> {
  return request({
    url: "/login",
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo(): Promise<UserInfoResponse> {
  return request({
    url: "/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout(): Promise<LogoutResponse> {
  return request({
    url: "/logout",
    method: "post",
  });
}

// 获取验证码
export function getCaptchaImage(): Promise<CaptchaResponse> {
  return request({
    url: "/captchaImage",
    method: "get",
    headers: {
      isToken: false,
    },
    timeout: 20000,
  });
}

// 获取路由
export function getRouters(): Promise<RoutersResponse> {
  return request({
    url: "/getRouters",
    method: "get",
  });
}

/**
 * 忘记密码 - 发送重置验证码
 * @param identifier 邮箱或手机号
 * @param type 类型：email 或 phone
 * @returns Promise<any>
 */
export function sendResetCode(identifier: string, type: "email" | "phone") {
  return request({
    url: "/auth/reset/sendCode",
    method: "post",
    data: { identifier, type },
    headers: {
      isToken: false,
    },
  });
}

/**
 * 验证重置验证码
 * @param identifier 邮箱或手机号
 * @param code 验证码
 * @param type 类型：email 或 phone
 * @returns Promise<any>
 */
export function verifyResetCode(identifier: string, code: string, type: "email" | "phone") {
  return request({
    url: "/auth/reset/verifyCode",
    method: "post",
    data: { identifier, code, type },
    headers: {
      isToken: false,
    },
  });
}

/**
 * 重置密码
 * @param resetToken 重置令牌
 * @param newPassword 新密码
 * @returns Promise<any>
 */
export function resetPassword(resetToken: string, newPassword: string) {
  return request({
    url: "/auth/reset/password",
    method: "post",
    data: { resetToken, newPassword },
    headers: {
      isToken: false,
    },
  });
}

/**
 * 检查用户名是否可用
 * @param username 用户名
 * @returns Promise<any>
 */
export function checkUsername(username: string) {
  return request({
    url: `/auth/checkUsername/${username}`,
    method: "get",
  });
}
