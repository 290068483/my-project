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
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLoginTime?: string;
  createTime?: string;
  status: "active" | "inactive" | "banned";
  name?: string; // 从 user.ts 中合并的字段
  roles?: string[]; // 用户角色列表

  // RuoYi标准字段
  userId?: number;
  userName?: string;
  nickName?: string;
  deptId?: number;
  sex?: string;
  phonenumber?: string;
}

/**
 * 路由菜单信息接口
 */
export interface RouterInfo {
  name: string;
  path: string;
  hidden?: boolean;
  redirect?: string;
  component?: string;
  alwaysShow?: boolean;
  meta: {
    title: string;
    icon?: string;
    noCache?: boolean;
    link?: string;
  };
  children?: RouterInfo[];
}

/**
 * 路由响应数据
 */
export interface RoutersResponse {
  code: number;
  msg: string;
  data: RouterInfo[];
}

/**
 * 权限相关类型定义
 */
export interface Permission {
  id: number;
  name: string;
  code: string;
  type: "menu" | "button" | "api";
  parentId?: number;
  sort?: number;
  status: "active" | "inactive";
}

/**
 * 角色信息接口
 */
export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  status: "active" | "inactive";
  createTime?: string;
}

/**
 * 权限检查选项
 */
export interface PermissionOptions {
  mode?: "and" | "or"; // 多个权限的检查模式：all(且) 或 any(或)
  roles?: string[]; // 角色检查
  permissions?: string[]; // 权限检查
}

/**
 * 统一登录请求参数
 * 支持多种登录方式：用户名+密码、手机号+验证码、邮箱+密码
 */
export interface LoginRequest {
  // 用户名登录
  username?: string;
  password?: string;
  code?: string;
  uuid?: string;

  // 手机号登录
  phone?: string;

  // 邮箱登录
  email?: string;

  // 登录类型标识（可选，用于后端区分登录方式）
  loginType?: "username" | "phone" | "email";
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  code: number;
  msg: string;
  data: {
    token: string;
    expiresIn: number;
    userInfo: UserInfo;
    refreshToken?: string;
  };
}

/**
 * 统一注册请求参数
 * 支持多种注册方式：用户名+密码、手机号+验证码、邮箱+验证码
 */
export interface RegisterRequest {
  // 用户名注册
  username?: string;
  password: string;
  confirmPassword?: string;

  // 手机号注册
  phone?: string;

  // 邮箱注册
  email?: string;

  // 验证码相关
  code?: string;
  uuid?: string;

  // 其他信息
  nickname?: string;

  // 注册类型标识（可选，用于后端区分注册方式）
  registerType?: "username" | "phone" | "email";

  [key: string]: unknown; // 允许其他业务字段
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  code: number;
  msg: string;
  data?: {
    userId?: number;
    message?: string;
    autoLogin?: boolean;
    loginInfo?: {
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
  code: number;
  msg: string;
  data: {
    uuid: string;
    img: string;
    expiresIn?: number;
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
  data?: unknown;
}

/**
 * 状态类型
 */
export type LoginStatus = "idle" | "loading" | "success" | "error";
export type RegisterStatus = "idle" | "loading" | "success" | "error";
export type CodeType = "login" | "register" | "reset" | "captcha";
