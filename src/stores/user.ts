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
  // 数据初始化状态
  isDataInitialized: boolean;
  // 数据初始化进行中的Promise
  dataInitializationPromise: Promise<void> | null;
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
      // 同时存储到sessionStorage作为备份
      sessionStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
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

// 新增：权限相关工具函数
const getStoredPermissions = (): string[] => {
  try {
    const permissionsStr = localStorage.getItem("user-permissions");
    return permissionsStr ? JSON.parse(permissionsStr) : [];
  } catch (error) {
    console.warn("Failed to get permissions from localStorage:", error);
    return [];
  }
};

const setStoredPermissions = (permissions: string[]): void => {
  try {
    localStorage.setItem("user-permissions", JSON.stringify(permissions));
  } catch (error) {
    console.warn("Failed to set permissions in localStorage:", error);
  }
};

// 新增：角色相关工具函数
const getStoredRoles = (): string[] => {
  try {
    const rolesStr = localStorage.getItem("user-roles");
    return rolesStr ? JSON.parse(rolesStr) : [];
  } catch (error) {
    console.warn("Failed to get roles from localStorage:", error);
    return [];
  }
};

const setStoredRoles = (roles: string[]): void => {
  try {
    localStorage.setItem("user-roles", JSON.stringify(roles));
  } catch (error) {
    console.warn("Failed to set roles in localStorage:", error);
  }
};

// 新增：路由相关工具函数
const getStoredRouters = (): RouterInfo[] => {
  try {
    const routersStr = localStorage.getItem("user-routers");
    return routersStr ? JSON.parse(routersStr) : [];
  } catch (error) {
    console.warn("Failed to get routers from localStorage:", error);
    return [];
  }
};

const setStoredRouters = (routers: RouterInfo[]): void => {
  try {
    localStorage.setItem("user-routers", JSON.stringify(routers));
  } catch (error) {
    console.warn("Failed to set routers in localStorage:", error);
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
    permissions: getStoredPermissions(),
    roles: getStoredRoles(),
    routers: getStoredRouters(),
    // 数据初始化状态
    isDataInitialized: false,
    // 数据初始化进行中的Promise
    dataInitializationPromise: null,
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
        console.log("开始获取验证码...");
        // 获取验证码数据
        const captchaData: unknown = await getCaptchaImage();
        console.log("获取到的验证码数据类型:", typeof captchaData);
        console.log("获取到的验证码数据是否为undefined:", captchaData === undefined);
        console.log("获取到的验证码数据是否为null:", captchaData === null);
        console.log("获取到的验证码数据:", captchaData);

        // 检查响应是否为undefined或null
        if (captchaData === undefined || captchaData === null) {
          console.error("验证码接口返回空数据");
          throw new Error("验证码接口返回空数据");
        }

        // 检查响应是否是AxiosResponse对象（当returnFullResponse为true时）
        let responseData: unknown;
        if (typeof captchaData === "object" && captchaData !== null && "data" in captchaData) {
          // 如果是完整的响应对象，提取data部分
          responseData = (captchaData as { data: unknown }).data;
        } else {
          // 如果是直接的数据对象
          responseData = captchaData;
        }

        // 确保responseData是对象且不为null
        if (typeof responseData !== "object" || responseData === null) {
          console.error("验证码数据格式错误:", responseData);
          throw new Error("验证码数据格式错误");
        }

        // 检查响应数据是否包含必需的字段
        if (!("img" in responseData) || !("uuid" in responseData)) {
          console.error("验证码数据缺少必需字段:", responseData);
          throw new Error("验证码数据格式错误：缺少必需字段");
        }

        // 类型断言为验证码数据对象
        const captchaResponseData = responseData as { img: string; uuid: string };

        // 确保响应数据有效
        if (!captchaResponseData.uuid || !captchaResponseData.img) {
          console.error("验证码数据无效:", responseData);
          throw new Error("验证码数据无效");
        }

        // 设置验证码数据
        this.captchaUuid = captchaResponseData.uuid;
        this.captchaImage = captchaResponseData.img;
        this.captchaTimestamp = Date.now();
        console.log("验证码获取成功");
      } catch (error: unknown) {
        console.error("获取验证码失败:", error);
        // 提供更具体的错误信息
        let errorMessage = "获取验证码失败，请重试";
        if (error instanceof Error) {
          // 如果是网络错误，提供更友好的提示
          if (error.message.includes("网络") || error.message.includes("Network")) {
            errorMessage = "网络连接失败，请检查网络设置";
          } else if (error.message.includes("配置")) {
            errorMessage = "请求配置错误，请联系技术支持";
          } else if (error.message.includes("空数据")) {
            errorMessage = "验证码服务暂时不可用，请稍后重试";
          } else if (error.message.includes("数据无效")) {
            errorMessage = "验证码数据格式错误，请联系技术支持";
          } else if (error.message.includes("缺少必需字段")) {
            errorMessage = "验证码数据格式错误，请联系技术支持";
          } else {
            errorMessage = error.message;
          }
        }
        ElMessage.error(errorMessage);
        throw error;
      }
    },

    // 刷新验证码
    async refreshCaptcha(): Promise<void> {
      await this.getCaptcha();
    },

    // 用户登录
    async login(loginData: LoginRequest): Promise<LoginResponse> {
      try {
        this.loginStatus = "loading";
        this.loginError = null;

        const response: LoginResponse = await login(loginData);
        console.log("登录响应:", response);

        // 检查响应是否包含token
        const token = this.extractTokenFromResponse(response);
        if (token) {
          // 存储token
          this.token = token;
          setStoredToken(token);
          this.isLoggedIn = true;

          // 登录成功后立即跳转到首页
          ElMessage.success("登录成功");
          setTimeout(() => {
            router.push("/home");
          }, 300);

          // 在后台初始化用户数据（权限、角色、路由等）
          this.initializeUserData()
            .then(() => {
              console.log("✅ 用户权限和路由信息初始化完成");
            })
            .catch((error) => {
              console.error("初始化用户数据失败:", error);
              ElMessage.warning("用户信息加载失败，部分功能可能受限");
            });
        } else {
          throw new Error("登录响应中未找到token");
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
      } finally {
        this.smsCodeCooldown = 1;
        this.emailCodeCooldown = 1;
      }
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
        console.log("开始获取用户信息...");
        const response: UserInfoResponse = await getInfo();
        console.log("获取用户信息响应:", response);

        if (response.code === 200) {
          // 确保响应数据结构正确
          const userData = response.data || {};
          console.log("用户数据结构:", userData);

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
          setStoredPermissions(this.permissions);
          setStoredRoles(this.roles);

          console.log("✅ 用户信息获取成功");
          console.log("🔑 用户信息:", this.userInfo);
          console.log("🔑 权限:", this.permissions);
          console.log("👥 角色:", this.roles);
        } else {
          // 处理非200响应
          const errorMsg = response.msg || response.message || `获取用户信息失败 (状态码: ${response.code})`;
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

        // 检查是否是401未授权错误
        if (this.isUnauthorizedError(error)) {
          console.log("🔑 Token已过期，需要重新登录");
          // 只在token确实过期时才登出
          if (this.token) {
            ElMessage.error("登录已过期，请重新登录");
            await this.logout();
          }
          throw new Error("登录已过期，请重新登录");
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
            // 持久化存储路由信息
            this.setStoredRouters(this.routers);
            console.log("✅ 路由信息解析成功:", {
              totalRoutes: response.data.length,
              routes: response.data,
            });
          } else {
            // 处理数据结构异常的情况
            console.warn("⚠️ 路由数据结构异常，使用空数组作为默认值");
            this.routers = [];
            this.setStoredRouters(this.routers);
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
        this.setStoredRouters(this.routers);

        // 可以选择不抛出错误，只记录错误信息
        // 如果需要保持原有行为，可以抛出错误
        // throw error;

        // 添加用户友好的提示
        ElMessage.error("部分功能可能受限，路由信息加载失败");
      }
    },

    // 初始化用户信息（登录后调用）
    async initializeUserData(): Promise<void> {
      // 如果已经有一个初始化正在进行，则返回该Promise
      if (this.dataInitializationPromise) {
        console.log("✅ 已有数据初始化正在进行，等待其完成");
        return this.dataInitializationPromise;
      }

      // 如果数据已经初始化，则直接返回
      if (this.isDataInitialized) {
        console.log("✅ 用户数据已初始化，跳过重复初始化");
        return Promise.resolve();
      }

      // 创建新的初始化Promise
      this.dataInitializationPromise = this._performDataInitialization();
      try {
        await this.dataInitializationPromise;
      } finally {
        // 初始化完成后清除Promise引用
        this.dataInitializationPromise = null;
      }
    },

    // 实际执行数据初始化的方法
    async _performDataInitialization(): Promise<void> {
      try {
        console.log("开始并行获取用户权限和路由信息...");
        console.log("当前数据初始化状态:", this.isDataInitialized);
        console.log("当前用户信息:", this.userInfo);
        console.log("当前权限:", this.permissions);
        console.log("当前角色:", this.roles);

        // 并行获取用户信息和路由信息，提高性能
        console.log("开始并行请求用户信息和路由信息...");
        const [userInfoResult, routersResult] = await Promise.allSettled([this.fetchUserInfo(), this.fetchRouters()]);

        // 处理用户信息获取结果
        if (userInfoResult.status === "fulfilled") {
          console.log("✅ 用户信息获取成功");
        } else {
          console.error("❌ 用户信息获取失败:", userInfoResult.reason);
          throw userInfoResult.reason;
        }

        // 处理路由信息获取结果
        if (routersResult.status === "fulfilled") {
          console.log("✅ 路由信息获取成功");
        } else {
          console.warn("⚠️ 路由信息获取失败:", routersResult.reason);
          // 路由信息获取失败不中断登录流程，但需要记录错误
          ElMessage.warning("路由信息加载失败，部分功能可能受限");
        }

        // 标记数据已初始化
        this.isDataInitialized = true;
        console.log("数据初始化完成，标记为已初始化");

        console.log("✅ 用户权限和路由信息初始化完成");
        console.log("🔑 用户权限:", this.permissions);
        console.log("👥 用户角色:", this.roles);
        console.log("🧭 路由菜单:", this.routers);
      } catch (error) {
        console.error("初始化用户数据失败:", error);
        // 即使初始化失败，也不标记为已初始化，以便下次重试
        this.isDataInitialized = false;
        throw error;
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
      // 检查是否是Error对象且有响应
      if (error instanceof Error) {
        // 检查Axios错误
        if ("response" in error && error.response) {
          const response = error.response as { status?: number };
          return response?.status === 401;
        }

        // 检查是否有状态码属性
        if ("status" in error && typeof error.status === "number") {
          return (error as { status: number }).status === 401;
        }
      }

      // 检查是否是对象且有状态码
      if (typeof error === "object" && error !== null) {
        if ("status" in error && (error as { status?: number }).status === 401) {
          return true;
        }

        // 检查响应中的状态码
        if ("response" in error && typeof (error as { response?: object }).response === "object") {
          const response = (error as { response?: { status?: number } }).response;
          if (response && response.status === 401) {
            return true;
          }
        }
      }

      return false;
    },

    // ==== 新增方法 ====

    // 提取登录响应中的token
    extractTokenFromResponse(response: LoginResponse): string | null {
      // 检查响应是否包含token
      if (response?.data?.token) {
        return response.data.token;
      }

      // 兼容旧版本响应格式
      if ((response as any)?.token) {
        return (response as any).token;
      }

      // 兼容嵌套data格式
      if (response?.data?.data?.token) {
        return response.data.data.token;
      }

      return null;
    },

    // 设置登录成功状态
    setLoginSuccess(token: string): void {
      // 存储token
      this.token = token;
      setStoredToken(token);
      this.isLoggedIn = true;

      // 初始化用户数据（权限、角色、路由等）
      this.initializeUserData();
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

    // 新增：设置存储的权限
    setStoredPermissions(permissions: string[]): void {
      this.permissions = permissions;
      setStoredPermissions(permissions);
    },

    // 新增：设置存储的角色
    setStoredRoles(roles: string[]): void {
      this.roles = roles;
      setStoredRoles(roles);
    },

    // 新增：设置存储的路由
    setStoredRouters(routers: RouterInfo[]): void {
      this.routers = routers;
      setStoredRouters(routers);
    },

    // 新增：清除所有存储的数据
    clearAllStoredData(): void {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user-permissions");
        localStorage.removeItem("user-roles");
        localStorage.removeItem("user-routers");
      } catch (error) {
        console.warn("Failed to clear stored data:", error);
      }
    },
  },
});

// 导出类型定义
export type { UserState };
