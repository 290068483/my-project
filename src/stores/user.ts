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
  // 验证码状态
  smsCodeCooldown: number; // 短信验证码倒计时
  emailCodeCooldown: number; // 邮箱验证码倒计时
  // 刷新令牌
  refreshToken: string | null;
  // 用户权限和路由
  permissions: string[];
  roles: string[];
  routers: RouterInfo[];
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
    permissions: [],
    roles: [],
    routers: [],
  }),

  getters: {
    // 获取用户信息
    getUserInfo: (state: UserState) => state.userInfo,

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
  },

  actions: {
    // 获取验证码
    async getCaptcha(): Promise<void> {
      try {
        const response: CaptchaResponse = await getCaptchaImage();

        if (response.code === 200) {
          this.captchaUuid = response.data.uuid;
          this.captchaImage = `data:image/gif;base64,${response.data.img}`;
          this.captchaTimestamp = Date.now();
        } else {
          throw new Error(response.msg || "获取验证码失败");
        }
      } catch (error: unknown) {
        console.error("获取验证码失败:", error);
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

        if (response.code === 200) {
          // 保存认证信息
          this.token = response.data.token;
          this.userInfo = response.data.userInfo;
          this.isLoggedIn = true;
          this.loginStatus = "success";

          // 保存刷新令牌（如果有）
          if (response.data.refreshToken) {
            this.refreshToken = response.data.refreshToken;
            setStoredRefreshToken(this.refreshToken);
          }

          // 持久化存储
          setStoredToken(this.token);
          setStoredUserInfo(this.userInfo);

          // 清空验证码状态
          this.captchaUuid = null;
          this.captchaImage = null;
          this.captchaTimestamp = null;

          // 初始化用户数据（获取权限和路由）
          try {
            await this.initializeUserData();
          } catch (error) {
            console.warn("初始化用户数据失败:", error);
            // 不阻断登录流程，可以在后续才获取
          }

          ElMessage.success("登录成功");
          router.push("/home");
        } else {
          this.loginStatus = "error";
          // 登录失败，可能需要刷新验证码
          if (response.code === 460 || response.code === 461) {
            await this.refreshCaptcha();
          }
          throw new Error(response.msg || "登录失败");
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
          this.userInfo = response.data.user;
          this.permissions = response.data.permissions;
          this.roles = response.data.roles;

          // 持久化存储
          setStoredUserInfo(this.userInfo);
          console.log("✅ 用户信息获取成功");
        } else {
          throw new Error(response.msg || "获取用户信息失败");
        }
      } catch (error: unknown) {
        console.warn("🔍 获取用户信息失败:", error);

        // 检查是否是网络错误
        if (error instanceof Error && error.message.includes("网络")) {
          console.log("🔍 网络连接问题，使用本地数据");
          // 不清除本地数据，继续使用缓存的用户信息
          return;
        }

        // 如果Token无效，可能需要重新登录
        if (this.isUnauthorizedError(error)) {
          console.log("🔑 Token已过期，需要重新登录");
          // 不立即跳转，给用户一个提示
          this.logout();
          // router.push("/login");
        }

        // 不在这里抛出错误，避免阻止页面加载
      }
    },

    // 获取用户可访问的路由菜单
    async fetchRouters(): Promise<void> {
      try {
        const response: RoutersResponse = await getRouters();

        if (response.code === 200) {
          this.routers = response.data;
        } else {
          throw new Error(response.msg || "获取路由信息失败");
        }
      } catch (error) {
        console.error("获取路由信息失败:", error);
        throw error;
      }
    },

    // 初始化用户信息（登录后调用）
    async initializeUserData(): Promise<void> {
      try {
        await Promise.all([this.fetchUserInfo(), this.fetchRouters()]);
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

          ElMessage.success("登录成功");
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

    // 发送登录短信验证码（功能已简化）
    async sendLoginSmsCode(phone: string): Promise<void> {
      try {
        if (this.smsCodeCooldown > 0) {
          ElMessage.warning(`请等待 ${this.smsCodeCooldown} 秒后再试`);
          return;
        }

        // 简单的手机号格式验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
          ElMessage.error("请输入正确的手机号码");
          throw new Error("手机号格式不正确");
        }

        console.log(`🧪 [短信验证码] 短信发送功能已简化，模拟发送到: ${phone}`);
        console.log("💡 [提示] 短信验证码发送现在集成在登录流程中统一处理");

        ElMessage.success("验证码发送功能已集成到登录流程中");
        this.startSmsCodeCooldown();
      } catch (error: unknown) {
        console.error("发送登录短信失败:", error);
        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);
        throw error;
      }
    },

    // 倒计时相关方法
    startSmsCodeCooldown(duration: number = 60): void {
      this.smsCodeCooldown = duration;
      const timer = setInterval(() => {
        this.smsCodeCooldown--;
        if (this.smsCodeCooldown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },

    startEmailCodeCooldown(duration: number = 60): void {
      this.emailCodeCooldown = duration;
      const timer = setInterval(() => {
        this.emailCodeCooldown--;
        if (this.emailCodeCooldown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
  },
});

// 导出类型定义
export type { UserState };
