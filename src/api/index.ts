/**
 * API统一导出文件
 * 用于统一管理和导出所有API接口
 */

// 登录相关API
export * from "./login";

// 注册相关API
export * from "./register";

// 验证码相关API
export * from "./captcha";

// 用户信息相关API
export * from "./user";

// 重新导出常用的API函数（为了更好的IDE支持）
export {
  login,
  loginWithData,
  loginWithPhone,
  loginWithEmail,
  sendLoginSms,
  sendResetCode,
  verifyResetCode,
  resetPassword,
} from "./login";
export {
  register,
  registerWithPhone,
  registerWithEmail,
  checkUsername,
  checkPhone,
  checkEmail,
  sendRegisterCode,
  sendRegisterEmailCode,
  verifyPhoneCode,
  verifyEmailCode,
  getRegisterConfig,
} from "./register";
export { getCodeImg, refreshCaptcha, validateCaptcha } from "./captcha";
export { getInfo, logout, updateUserInfo, changePassword, uploadAvatar } from "./user";

// 重新导出类型定义
export type {
  // 认证相关类型
  UserInfo,
  LoginRequest,
  LoginResponse,
  PhoneLoginRequest,
  EmailLoginRequest,
  RegisterRequest,
  RegisterResponse,
  PhoneRegisterRequest,
  EmailRegisterRequest,
  CaptchaResponse,
  UserInfoResponse,
  LogoutResponse,
  PasswordResetRequest,
  RegisterConfig,
  LoginStatus,
  RegisterStatus,
  CodeType,
} from "@/types/auth";

export type {
  // 通用API类型
  ApiResponse,
  PageResponse,
  RequestConfig,
  ErrorResponse,
} from "@/types/api";
