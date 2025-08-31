/**
 * 用户信息接口
 */
export interface UserInfo {
  userId: number;
  userName: string;
  nickName: string;
  avatar: string;
  deptId: number;
  phonenumber: string;
  email: string;
  sex: string;
  status: string;
  roles: string[];
  permissions: string[];
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
 * 统一登录请求参数
 */
export interface LoginRequest {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  code: number;
  msg: string;
  token?: string;
  data?: {
    token: string;
  };
}

/**
 * 验证码响应数据
 */
export interface CaptchaResponse {
  code: number;
  msg: string;
  uuid: string;
  img: string;
  captchaEnabled?: boolean;
  data?: {
    uuid: string;
    img: string;
    captchaEnabled?: boolean;
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
}

/**
 * 统一注册请求参数
 */
export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
  code?: string;
  uuid?: string;
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  code: number;
  msg: string;
  data?: null;
}

/**
 * 状态类型
 */
export type LoginStatus = "idle" | "loading" | "success" | "error";
