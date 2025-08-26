/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  role: string;
  permissions: string[];
  department?: string;
  position?: string;
  email?: string;
  phone?: string; // 新增手机号字段
  isEmailVerified?: boolean; // 新增邮箱验证状态
  isPhoneVerified?: boolean; // 新增手机验证状态
  lastLoginTime?: string; // 新增最后登录时间
  createTime?: string; // 新增创建时间
  status: "active" | "inactive" | "banned"; // 新增用户状态
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string; // 用户名
  password: string; // 密码
  code: string; // 验证码
  uuid: string; // 验证码唯一标识
}

/**
 * 手机号登录请求参数（新增）
 */
export interface PhoneLoginRequest {
  phone: string; // 手机号
  code: string; // 短信验证码
}

/**
 * 邮箱登录请求参数（新增）
 */
export interface EmailLoginRequest {
  email: string; // 邮箱
  password: string; // 密码
  code?: string; // 验证码（可选）
  uuid?: string; // 验证码唯一标识（可选）
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  code: number; // 状态码
  msg: string; // 响应消息
  data: {
    token: string; // JWT令牌
    expiresIn: number; // 过期时间(秒)
    userInfo: UserInfo;
    refreshToken?: string; // 新增刷新令牌
  };
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
  username: string; // 用户名(手机号)
  password: string; // 密码
  confirmPassword?: string; // 确认密码(前端验证)
  nickname?: string; // 昵称
  email?: string; // 邮箱
  phone?: string; // 手机号
  code?: string; // 验证码
  uuid?: string; // 验证码标识
  [key: string]: any; // 允许其他业务字段
}

/**
 * 手机号注册请求参数（新增）
 */
export interface PhoneRegisterRequest {
  phone: string; // 手机号
  password: string; // 密码
  code: string; // 短信验证码
  nickname?: string; // 昵称
}

/**
 * 邮箱注册请求参数（新增）
 */
export interface EmailRegisterRequest {
  email: string; // 邮箱
  password: string; // 密码
  code: string; // 邮箱验证码
  nickname?: string; // 昵称
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  code: number; // 状态码
  msg: string; // 注册结果消息
  data?: {
    userId?: number; // 用户ID
    message?: string; // 成功消息
    autoLogin?: boolean; // 是否自动登录
    loginInfo?: {
      // 如果自动登录，返回登录信息
      token: string;
      expiresIn: number;
      userInfo: UserInfo;
    };
  };
}

/**
 * 验证码响应数据
 */
export interface CaptchaResponse {
  code: number; // 状态码
  msg: string; // 响应消息
  data: {
    uuid: string; // 验证码唯一标识
    img: string; // Base64图片数据
    expiresIn?: number; // 验证码过期时间（秒）
  };
}

/**
 * 用户信息响应数据
 */
export interface UserInfoResponse {
  code: number;
  msg: string;
  data: {
    user: UserInfo;
    roles: string[];
    permissions: string[];
  };
}

/**
 * 登出响应数据
 */
export interface LogoutResponse {
  code: number;
  msg: string;
  data?: any;
}

/**
 * 密码重置请求参数（新增）
 */
export interface PasswordResetRequest {
  account: string; // 账号（手机号或邮箱）
  type: "phone" | "email"; // 类型
  code?: string; // 验证码
  newPassword?: string; // 新密码
  token?: string; // 验证令牌
}

/**
 * 注册配置（新增）
 */
export interface RegisterConfig {
  passwordMinLength: number; // 密码最小长度
  passwordRequireUppercase: boolean; // 是否需要大写字母
  passwordRequireNumber: boolean; // 是否需要数字
  passwordRequireSpecialChar: boolean; // 是否需要特殊字符
  usernameMinLength: number; // 用户名最小长度
  usernameMaxLength: number; // 用户名最大长度
  phoneCodeExpiry: number; // 短信验证码过期时间（秒）
  emailCodeExpiry: number; // 邮箱验证码过期时间（秒）
  codeSendInterval: number; // 验证码发送间隔（秒）
}

/**
 * 登录状态类型（新增）
 */
export type LoginStatus = "idle" | "loading" | "success" | "error";

/**
 * 注册状态类型（新增）
 */
export type RegisterStatus = "idle" | "loading" | "success" | "error";

/**
 * 验证码类型（新增）
 */
export type CodeType = "login" | "register" | "reset" | "captcha";
