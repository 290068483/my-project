import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import router from "@/router";
// 导入API接口
import { login, getCaptchaImage, getInfo, getRouters, logout } from "@/api/login";
import { register } from "@/api";
import type {
  UserInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LoginStatus,
  RegisterStatus,
  RouterInfo,
} from "@/types/auth";

// 定义用户状态接口
interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  // 验证码状态
  captchaUuid: string | null;
  captchaImage: string | null;
  captchaTimestamp: number | null;
  // 登录状态
  loginStatus: LoginStatus;
  loginError: string | null;
  // 注册状态
  registerStatus: RegisterStatus;
  registerError: string | null;
  // 用户权限和路由
  permissions: string[];
  roles: string[];
  routers: RouterInfo[];
  // 刷新令牌
  refreshToken: string | null;
  // 验证码冷却时间
  smsCodeCooldown: number;
  emailCodeCooldown: number;
}

// 定义登录参数接口（保持向后兼容）
export interface LoginParams {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
}

// 工具函数：安全获取localStorage数据
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.warn("Failed to get token from localStorage:", error);
    return null;
  }
};

const getStoredUserInfo = (): UserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem("user-info");
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.warn("Failed to get user info from localStorage:", error);
    return null;
  }
};

const setStoredToken = (token: string | null): void => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.warn("Failed to set token in localStorage:", error);
  }
};

const setStoredUserInfo = (userInfo: UserInfo | null): void => {
  try {
    if (userInfo) {
      localStorage.setItem("user-info", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("user-info");
    }
  } catch (error) {
    console.warn("Failed to set user info in localStorage:", error);
  }
};

// 新增：刷新令牌相关工具函数
const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refresh-token");
  } catch (error) {
    console.warn("Failed to get refresh token from localStorage:", error);
    return null;
  }
};

const setStoredRefreshToken = (refreshToken: string | null): void => {
  try {
    if (refreshToken) {
      localStorage.setItem("refresh-token", refreshToken);
    } else {
      localStorage.removeItem("refresh-token");
    }
  } catch (error) {
    console.warn("Failed to set refresh token in localStorage:", error);
  }
};

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: getStoredToken(),
    userInfo: getStoredUserInfo(),
    isLoggedIn: !!getStoredToken(),
    // 验证码状态
    captchaUuid: null,
    captchaImage: null,
    captchaTimestamp: null,
    // 登录状态
    loginStatus: "idle",
    loginError: null,
    // 注册状态
    registerStatus: "idle",
    registerError: null,
    // 验证码状态
    smsCodeCooldown: 0,
    emailCodeCooldown: 0,
    // 刷新令牌
    refreshToken: getStoredRefreshToken(),
    // 权限和路由
    permissions: [] as string[],
    roles: [] as string[],
    routers: [] as RouterInfo[],
  }),

  getters: {
    // 获取用户角色
    getUserRole: (state: UserState) => state.userInfo?.role || null,

    // 检查是否已登录
    getIsLoggedIn: (state: UserState) => state.isLoggedIn,

    // 获取用户权限
    getUserPermissions: (state: UserState) => state.permissions,

    // 获取用户角色列表
    getUserRoles: (state: UserState) => state.roles,

    // 获取用户路由
    getUserRouters: (state: UserState) => state.routers,

    // 检查权限
    hasPermission: (state: UserState) => (permission: string) => {
      return state.permissions.includes(permission);
    },

    // 检查角色
    hasRole: (state: UserState) => (role: string) => {
      return state.roles.includes(role);
    },

    // 检查用户是否具有特定权限
    isHasPermission:
      (state: UserState) =>
      (permission: string): boolean => {
        // 如果没有设置权限，则默认允许访问
        if (!state.permissions || state.permissions.length === 0) {
          return true;
        }

        // 检查是否具有指定权限
        return state.permissions.includes(permission);
      },

    // 检查用户是否具有任意一个权限
    hasAnyPermission:
      (state: UserState) =>
      (permissions: string[]): boolean => {
        // 如果没有设置权限，则默认允许访问
        if (!state.permissions || state.permissions.length === 0) {
          return true;
        }

        // 检查是否具有任意一个权限
        return permissions.some((permission) => state.permissions.includes(permission));
      },

    // 检查用户是否具有特定角色
    hasRoleCheck:
      (state: UserState) =>
      (role: string): boolean => {
        // 如果没有设置角色，则默认允许访问
        if (!state.roles || state.roles.length === 0) {
          return true;
        }

        // 检查是否具有指定角色
        return state.roles.includes(role);
      },

    // 检查用户是否具有任意一个角色
    hasAnyRole:
      (state: UserState) =>
      (roles: string[]): boolean => {
        // 如果没有设置角色，则默认允许访问
        if (!state.roles || state.roles.length === 0) {
          return true;
        }

        // 检查是否具有任意一个角色
        return roles.some((role) => state.roles.includes(role));
      },
  },

  actions: {
    // 获取验证码
    async getCaptcha(): Promise<void> {
      try {
        // 获取验证码数据
        const captchaData: CaptchaResponse = await getCaptchaImage();

        // 确保响应数据有效
        if (!captchaData || !captchaData.data.uuid || !captchaData.data.img) {
          console.error("验证码数据无效:", captchaData);
          throw new Error("验证码数据无效");
        }

        // 设置验证码数据
        this.captchaUuid = captchaData.data.uuid;
        this.captchaImage = captchaData.data.img;
        this.captchaTimestamp = Date.now();
      } catch (error: unknown) {
        ElMessage.error("获取验证码失败，请重试");
        throw error;
      }
    },

    // 刷新验证码
    async refreshCaptcha(): Promise<void> {
      await this.getCaptcha();
    },

    // 用户登录（新版本，支持验证码）
    async login(loginData: LoginRequest): Promise<LoginResponse> {
      try {
        this.loginStatus = "loading";
        this.loginError = null;

        const response: LoginResponse = await login(loginData);
        // 检查响应是否包含code字段，如果没有可能是直接返回了数据
        // 如果响应对象有token字段且没有code字段，则认为是成功响应
        const hasCode = response.hasOwnProperty("code");
        const hasToken = response.hasOwnProperty("token") || (response.data && response.data.hasOwnProperty("token"));
        const code = hasCode ? response.code : hasToken ? 200 : 500;

        if (code === 200 || (!hasCode && hasToken)) {
          // 确保正确获取token和用户信息
          let token: string | undefined, userInfo: UserInfo | undefined;

          // 从不同可能的位置获取token
          if (response.data && response.data.token) {
            token = response.data.token;
            userInfo = response.data.userInfo;
          }

          if (!token) {
            throw new Error("登录响应中未找到token");
          }

          // 保存认证信息
          this.token = token;
          this.userInfo = userInfo || null;
          this.isLoggedIn = true;
          this.loginStatus = "success";

          // 持久化存储
          setStoredToken(this.token);
          setStoredUserInfo(this.userInfo);

          // 清空验证码状态
          this.captchaUuid = null;
          this.captchaImage = null;
          this.captchaTimestamp = null;

          // 重置验证码冷却时间
          this.smsCodeCooldown = 0;
          this.emailCodeCooldown = 0;

          // 初始化用户数据（获取权限和路由）
          try {
            await this.initializeUserData();
            console.log("✅ 用户权限和路由初始化成功");
          } catch (error) {
            console.warn("🔍 用户权限和路由初始化失败:", error);
            // 不阻断登录流程，可以在后续才获取
            // 可以考虑在用户访问需要权限的页面时再次尝试获取
          }

          ElMessage.success("登录成功");
          router.push("/home");
        } else {
          this.loginStatus = "error";
          // 登录失败，可能需要刷新验证码
          if (code === 460 || code === 461) {
            await this.refreshCaptcha();
          }
          throw new Error(
            (response as unknown as { msg?: string; message?: string }).msg ||
              (response as unknown as { msg?: string; message?: string }).message ||
              "登录失败",
          );
        }

        return response;
      } catch (error: unknown) {
        this.loginStatus = "error";
        this.loginError = this.getErrorMessage(error);
        console.error("登录失败:", error);

        // 处理特定错误码
        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);

        throw error;
      }
    },

    // 兼容旧版本登录方法
    async loginLegacy(loginParams: LoginParams): Promise<LoginResponse> {
      const loginData: LoginRequest = {
        username: loginParams.username,
        password: loginParams.password,
        code: loginParams.code || "",
        uuid: loginParams.uuid || this.captchaUuid || "",
      };

      return await this.login(loginData);
    },

    // 用户登出
    async logout(): Promise<void> {
      try {
        // 调用后端API退出接口
        await logout();
      } catch (error) {
        console.warn("退出接口调用失败:", error);
        // 即使后端接口失败，也要清理本地状态
      } finally {
        // 清除状态
        this.token = null;
        this.userInfo = null;
        this.isLoggedIn = false;
        this.permissions = [];
        this.roles = [];
        this.routers = [];

        // 清除验证码状态
        this.captchaUuid = null;
        this.captchaImage = null;
        this.captchaTimestamp = null;

        // 清除localStorage
        setStoredToken(null);
        setStoredUserInfo(null);
        setStoredRefreshToken(null);

        ElMessage.success("已安全退出");
      }
    },

    // 获取用户详细信息（含权限和角色）
    async fetchUserInfo(): Promise<void> {
      try {
        const response: UserInfoResponse = await getInfo();

        if (response.code === 200) {
          // 确保响应数据结构正确
          const userData = response.data || {};

          // 提取用户信息
          this.userInfo = userData.user || null;

          // 提取权限和角色，确保是数组类型
          this.permissions = Array.isArray(userData.permissions)
            ? userData.permissions
            : userData.permissions
              ? [userData.permissions]
              : [];

          this.roles = Array.isArray(userData.roles) ? userData.roles : userData.roles ? [userData.roles] : [];

          // 持久化存储
          setStoredUserInfo(this.userInfo);

          console.log("✅ 用户信息获取成功");

          // 记录获取到的权限和角色
          console.log("🔑 权限:", this.permissions);
          console.log("👥 角色:", this.roles);
        } else {
          // 处理非200响应
          const errorMsg = response.msg || `获取用户信息失败 (状态码: ${response.code})`;
          console.error("❌ 获取用户信息失败:", errorMsg);
          throw new Error(errorMsg);
        }
      } catch (error: unknown) {
        console.warn("🔍 获取用户信息失败:", error);

        // 检查是否是网络错误
        if (error instanceof Error && error.message.includes("网络")) {
          console.log("🔍 网络连接问题，使用本地数据");
          // 不清除本地数据，继续使用缓存的用户信息
          return;
        }

        // 处理认证错误
        if (this.isUnauthorizedError(error)) {
          console.log("🔑 Token已过期，需要重新登录");
          await this.logout();
        }

        // 处理其他错误
        const errorMsg = error instanceof Error ? error.message : "未知错误";
        console.error("🚨 获取用户信息时发生错误:", errorMsg);

        // 重新抛出错误，让调用方能够处理
        throw error;
      }
    },

    // 获取用户可访问的路由菜单
    async fetchRouters(): Promise<void> {
      try {
        const response: RoutersResponse = await getRouters();

        // 记录完整的路由响应数据，用于调试
        console.log("📡 收到路由响应:", response);

        if (response.code === 200) {
          // 确保响应数据结构正确
          if (response.data && Array.isArray(response.data)) {
            this.routers = response.data;
            console.log("✅ 路由信息解析成功:", {
              totalRoutes: response.data.length,
              routes: response.data,
            });
          } else {
            // 处理数据结构异常的情况
            console.warn("⚠️ 路由数据结构异常，使用空数组作为默认值");
            this.routers = [];
            throw new Error("路由数据结构异常");
          }
        } else {
          // 处理非200响应
          const errorMsg = response.msg || `获取路由信息失败 (状态码: ${response.code})`;
          console.error("❌ 获取路由信息失败:", errorMsg);
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error("🚨 获取路由信息失败:", error);
        // 即使获取路由失败，也不应该阻止登录流程
        this.routers = [];

        // 可以选择不抛出错误，只记录错误信息
        // 如果需要保持原有行为，可以抛出错误
        // throw error;

        // 添加用户友好的提示
        ElMessage.error("部分功能可能受限，路由信息加载失败");
      }
    },

    // 初始化用户信息（登录后调用）
    async initializeUserData(): Promise<void> {
      try {
        // 获取用户信息（包括权限和角色）
        await this.fetchUserInfo();

        // 获取用户可访问的路由菜单
        await this.fetchRouters();

        console.log("✅ 用户权限和路由信息初始化完成");
        console.log("🔑 用户权限:", this.permissions);
        console.log("👥 用户角色:", this.roles);
        console.log("🧭 路由菜单:", this.routers);
      } catch (error) {
        console.error("初始化用户数据失败:", error);
        throw error;
      }
    },

    // 初始化用户信息
    initUserInfo(): void {
      try {
        const token = getStoredToken();
        const userInfo = getStoredUserInfo();

        if (token && userInfo) {
          this.token = token;
          this.userInfo = userInfo;
          this.isLoggedIn = true;
          console.log("👤 初始化用户信息成功:", userInfo);
        } else {
          console.log("👤 未找到本地用户信息");
        }
      } catch (error) {
        console.warn("🚨 初始化用户信息失败:", error);
        // 即使初始化失败，也不阻止页面加载
      }
    },

    // 更新用户信息
    updateUserInfo(userInfo: UserInfo): void {
      this.userInfo = userInfo;
      setStoredUserInfo(userInfo);
    },

    // 用户注册
    async register(registerData: RegisterRequest): Promise<RegisterResponse> {
      try {
        const response: RegisterResponse = await register(registerData);

        if (response.code === 200) {
          ElMessage.success(response.msg || "注册成功");
        } else {
          throw new Error(response.msg || "注册失败");
        }

        return response;
      } catch (error: unknown) {
        console.error("注册失败:", error);

        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);

        throw error;
      }
    },

    // 检查用户名可用性（功能已简化）
    async checkUsernameAvailability(username: string): Promise<boolean> {
      console.log(`🧪 [用户名检查] 用户名检查功能已简化，默认返回可用状态: ${username}`);
      console.log("💡 [提示] 用户名重复检查现在由后端在注册时统一处理");

      // 简单的前端验证：用户名不能为空且长度在3-20之间
      if (!username || username.length < 3 || username.length > 20) {
        ElMessage.warning("用户名长度应在3-20个字符之间");
        return false;
      }

      return true; // 默认返回可用，实际检查在后端进行
    },

    // 发送注册验证码（功能已简化）
    async sendRegisterVerificationCode(phone: string): Promise<void> {
      console.log(`🧪 [验证码发送] 验证码发送功能已简化，模拟发送到: ${phone}`);
      console.log("💡 [提示] 验证码发送现在集成在登录/注册流程中统一处理");

      // 简单的手机号格式验证
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        ElMessage.error("请输入正确的手机号码");
        throw new Error("手机号格式不正确");
      }

      ElMessage.success("验证码发送功能已集成到注册流程中");
    },

    // 错误消息处理
    getErrorMessage(error: unknown): string {
      // API错误码映射
      const ERROR_MESSAGES: Record<number, string> = {
        // 登录错误
        401: "用户名或密码错误",
        423: "账户已被锁定，请联系管理员",
        429: "登录尝试过于频繁，请稍后重试",

        // 注册错误
        409: "用户名已存在",
        422: "输入信息格式不正确",

        // 验证码错误
        460: "验证码错误",
        461: "验证码已过期，请重新获取",

        // 网络错误
        500: "服务器内部错误，请稍后重试",
        503: "服务暂时不可用，请稍后重试",
      };

      // 检查是否是Error对象
      if (error instanceof Error) {
        // 检查是否有响应状态码
        if ("response" in error && error.response && typeof error.response === "object" && "status" in error.response) {
          const status = (error.response as { status: number }).status;
          return ERROR_MESSAGES[status] || error.message || "网络连接异常，请检查网络后重试";
        }
        return error.message || "未知错误";
      }

      // 检查是否是字符串
      if (typeof error === "string") {
        return error;
      }

      // 其他情况返回默认错误消息
      return "网络连接异常，请检查网络后重试";
    },

    // 检查是否是未授权错误
    isUnauthorizedError(error: unknown): boolean {
      if (error instanceof Error && "response" in error) {
        const response = error.response as { status?: number };
        return response?.status === 401;
      }
      return false;
    },

    // ==== 新增方法 ====

    // 手机号登录（功能已简化，使用统一登录方法）
    async loginWithPhoneNumber(phoneData: { phone: string; code: string }): Promise<LoginResponse> {
      try {
        this.loginStatus = "loading";
        this.loginError = null;

        // 使用统一登录方法，传入手机号登录数据
        const loginData: LoginRequest = {
          phone: phoneData.phone,
          code: phoneData.code,
          loginType: "phone",
        };

        const response: LoginResponse = await login(loginData);

        if (response.code === 200) {
          this.token = response.data.token;
          this.userInfo = response.data.userInfo;
          this.isLoggedIn = true;
          this.loginStatus = "success";

          if (response.data.refreshToken) {
            this.refreshToken = response.data.refreshToken;
            setStoredRefreshToken(this.refreshToken);
          }

          setStoredToken(this.token);
          setStoredUserInfo(this.userInfo);
          this.smsCodeCooldown = 0;
          this.emailCodeCooldown = 0;

          ElMessage.success("登录成功");
          router.push("/home");
        } else {
          this.loginStatus = "error";
          this.loginError = response.msg || "登录失败";
          throw new Error(response.msg || "登录失败");
        }

        return response;
      } catch (error: unknown) {
        this.loginStatus = "error";
        this.loginError = this.getErrorMessage(error);
        console.error("手机号登录失败:", error);
        ElMessage.error(this.loginError);
        throw error;
      }
    },

    // 检查用户是否具有特定权限
    hasPermissionCheck(permission: string): boolean {
      // 如果没有设置权限，则默认允许访问
      if (!this.permissions || this.permissions.length === 0) {
        return true;
      }

      // 检查是否具有指定权限
      return this.permissions.includes(permission);
    },

    // 检查用户是否具有任意一个权限
    hasAnyPermissionCheck(permissions: string[]): boolean {
      // 如果没有设置权限，则默认允许访问
      if (!this.permissions || this.permissions.length === 0) {
        return true;
      }

      // 检查是否具有任意一个权限
      return permissions.some((permission) => this.permissions.includes(permission));
    },

    // 检查用户是否具有任意一个角色
    hasAnyRoleCheck(roles: string[]): boolean {
      // 如果没有设置角色，则默认允许访问
      if (!this.roles || this.roles.length === 0) {
        return true;
      }

      // 检查是否具有任意一个角色
      return roles.some((role) => this.roles.includes(role));
    },
  },
});

// 导出类型定义
export type { UserState };
