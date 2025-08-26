import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import router from "@/router";
// 导入API接口
import {
  loginWithData,
  loginWithPhone,
  loginWithEmail,
  sendLoginSms,
  sendResetCode,
  verifyResetCode,
  resetPassword,
} from "@/api/login";
import {
  getCodeImg,
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
} from "@/api";
import type {
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
  LoginStatus,
  RegisterStatus,
  RegisterConfig,
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
  // 新增：登录状态
  loginStatus: LoginStatus;
  loginError: string | null;
  // 新增：注册状态
  registerStatus: RegisterStatus;
  registerError: string | null;
  registerConfig: RegisterConfig | null;
  // 新增：验证码状态
  smsCodeCooldown: number; // 短信验证码倒计时
  emailCodeCooldown: number; // 邮箱验证码倒计时
  // 新增：刷新令牌
  refreshToken: string | null;
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
    registerConfig: null,
    // 验证码状态
    smsCodeCooldown: 0,
    emailCodeCooldown: 0,
    // 刷新令牌
    refreshToken: getStoredRefreshToken(),
  }),

  getters: {
    // 获取用户信息
    getUserInfo: (state: UserState) => state.userInfo,

    // 获取用户角色
    getUserRole: (state: UserState) => state.userInfo?.role || null,

    // 检查是否已登录
    getIsLoggedIn: (state: UserState) => state.isLoggedIn,
  },

  actions: {
    // 获取验证码
    async getCaptcha(): Promise<void> {
      try {
        const response: CaptchaResponse = await getCodeImg();

        if (response.code === 200) {
          this.captchaUuid = response.data.uuid;
          this.captchaImage = `data:image/gif;base64,${response.data.img}`;
          this.captchaTimestamp = Date.now();
        } else {
          throw new Error(response.msg || "获取验证码失败");
        }
      } catch (error) {
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
        const response: LoginResponse = await loginWithData(loginData);

        if (response.code === 200) {
          // 保存认证信息
          this.token = response.data.token;
          console.log(response.data);
          this.userInfo = response.data.userInfo;
          this.isLoggedIn = true;

          // 持久化存储
          setStoredToken(this.token);
          setStoredUserInfo(this.userInfo);

          // 清空验证码状态
          this.captchaUuid = null;
          this.captchaImage = null;
          this.captchaTimestamp = null;

          ElMessage.success("登录成功");
          router.push("/home");
        } else {
          // 登录失败，可能需要刷新验证码
          if (response.code === 460 || response.code === 461) {
            await this.refreshCaptcha();
          }
          throw new Error(response.msg || "登录失败");
        }

        return response;
      } catch (error: any) {
        console.error("登录失败:", error);

        // 处理特定错误码
        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);

        throw error;
      }
    },

    // 兼容旧版本登录方法
    async loginLegacy(loginParams: LoginParams): Promise<any> {
      const loginData: LoginRequest = {
        username: loginParams.username,
        password: loginParams.password,
        code: loginParams.code || "",
        uuid: loginParams.uuid || this.captchaUuid || "",
      };

      return await this.login(loginData);
    },

    // 用户登出
    logout(): void {
      // 清除状态
      this.token = null;
      this.userInfo = null;
      this.isLoggedIn = false;

      // 清除验证码状态
      this.captchaUuid = null;
      this.captchaImage = null;
      this.captchaTimestamp = null;

      // 清除localStorage
      setStoredToken(null);
      setStoredUserInfo(null);

      ElMessage.success("已安全退出");
    },

    // 初始化用户信息
    initUserInfo(): void {
      const token = getStoredToken();
      const userInfo = getStoredUserInfo();

      if (token && userInfo) {
        this.token = token;
        this.userInfo = userInfo;
        this.isLoggedIn = true;
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
      } catch (error: any) {
        console.error("注册失败:", error);

        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);

        throw error;
      }
    },

    // 检查用户名可用性
    async checkUsernameAvailability(username: string): Promise<boolean> {
      try {
        const response = await checkUsername(username);

        if (response.code === 200) {
          return response.data.available;
        } else {
          throw new Error(response.msg || "检查失败");
        }
      } catch (error: any) {
        console.error("检查用户名失败:", error);
        ElMessage.error("检查用户名失败，请重试");
        return false;
      }
    },

    // 发送注册验证码
    async sendRegisterVerificationCode(phone: string): Promise<void> {
      try {
        const response = await sendRegisterCode(phone);

        if (response.code === 200) {
          ElMessage.success("验证码已发送，请注意查收");
        } else {
          throw new Error(response.msg || "发送失败");
        }
      } catch (error: any) {
        console.error("发送验证码失败:", error);

        const errorMessage = this.getErrorMessage(error);
        ElMessage.error(errorMessage);

        throw error;
      }
    },

    // 错误消息处理
    getErrorMessage(error: any): string {
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

      const code = error.response?.status || error.code;
      return ERROR_MESSAGES[code] || error.message || "网络连接异常，请检查网络后重试";
    },

    // ==== 新增方法 ====

    // 手机号登录（新增）
    async loginWithPhoneNumber(phoneData: PhoneLoginRequest): Promise<LoginResponse> {
      try {
        this.loginStatus = "loading";
        this.loginError = null;

        const response: LoginResponse = await loginWithPhone(phoneData.phone, phoneData.code);

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
      } catch (error: any) {
        this.loginStatus = "error";
        this.loginError = this.getErrorMessage(error);
        console.error("手机号登录失败:", error);
        ElMessage.error(this.loginError);
        throw error;
      }
    },

    // 发送登录短信验证码（新增）
    async sendLoginSmsCode(phone: string): Promise<void> {
      try {
        if (this.smsCodeCooldown > 0) {
          ElMessage.warning(`请等待 ${this.smsCodeCooldown} 秒后再试`);
          return;
        }

        const response = await sendLoginSms(phone);

        if (response.code === 200) {
          ElMessage.success("验证码已发送，请注意查收");
          this.startSmsCodeCooldown();
        } else {
          throw new Error(response.msg || "发送失败");
        }
      } catch (error: any) {
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
export type { LoginParams, UserState };
