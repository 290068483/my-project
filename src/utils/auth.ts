import { useUserStore } from "@/stores/user";
import MessageUtils from "./message";
import router from "@/router";
import type { UserInfo, LoginRequest } from "@/types/auth";
import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 权限检查工具类
export class AuthUtils {
  /**
   * 退出登录
   * @param showMessage 是否显示退出成功消息
   * @param redirectPath 退出后重定向路径，默认为登录页
   */
  static logout(showMessage = true, redirectPath = "/login"): void {
    const userStore = useUserStore();
    userStore.logout();

    if (showMessage) {
      MessageUtils.success("退出登录成功");
    }

    router.push(redirectPath);
  }

  /**
   * 检查用户是否已登录
   * @returns boolean
   */
  static isLoggedIn(): boolean {
    const userStore = useUserStore();
    return userStore.getIsLoggedIn;
  }

  /**
   * 获取当前用户信息
   * @returns UserInfo | null
   */
  static getCurrentUser(): UserInfo | null {
    const userStore = useUserStore();
    return userStore.getUserInfo;
  }

  /**
   * 获取用户角色
   * @returns string | null
   */
  static getUserRole(): string | null {
    const userStore = useUserStore();
    return userStore.getUserRole;
  }

  /**
   * 验证用户是否具备某权限
   * @param permission 权限字符串
   * @returns 用户是否具备该权限
   */
  static hasPermission(permission: string): boolean {
    const allPermissions = localStorage.getItem("permissions");
    if (!allPermissions) return false;

    try {
      const permissions = JSON.parse(allPermissions);
      return permissions.includes(permission);
    } catch (e) {
      console.error("权限解析失败", e);
      return false;
    }
  }

  /**
   * 验证用户是否具备某角色
   * @param role 角色字符串
   * @returns 用户是否具备该角色
   */
  static hasRole(role: string): boolean {
    const allRoles = localStorage.getItem("roles");
    if (!allRoles) return false;

    try {
      const roles = JSON.parse(allRoles);
      return roles.includes(role);
    } catch (e) {
      console.error("角色解析失败", e);
      return false;
    }
  }

  /**
   * 验证用户是否具备任意一个权限
   * @param permissions 权限字符串数组
   * @returns 用户是否具备任意一个权限
   */
  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * 验证用户是否具备任意一个角色
   * @param roles 角色字符串数组
   * @returns 用户是否具备任意一个角色
   */
  static hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * 综合权限检查（支持角色和权限的组合检查）
   * @param options 权限检查选项
   * @returns boolean
   */
  static checkPermission(options: { roles?: string[]; permissions?: string[]; mode?: "and" | "or" }): boolean {
    const { roles, permissions, mode = "and" } = options;

    const hasRoleAccess = roles ? this.hasRole(roles) : true;
    const hasPermissionAccess = permissions ? this.hasPermission(permissions) : true;

    if (mode === "or") {
      return hasRoleAccess || hasPermissionAccess;
    } else {
      return hasRoleAccess && hasPermissionAccess;
    }
  }

  /**
   * 获取用户Token
   * @returns string | null
   */
  static getToken(): string | null {
    const userStore = useUserStore();
    return userStore.token;
  }

  /**
   * 验证Token是否有效（简单验证）
   * @returns boolean
   */
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // 简单的JWT解析（仅用于检查过期时间）
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * 快速登录（用户名密码）
   * @param username 用户名
   * @param password 密码
   * @param code 验证码
   * @param uuid 验证码UUID
   * @returns Promise<boolean>
   */
  static async quickLogin(username: string, password: string, code: string, uuid: string): Promise<boolean> {
    try {
      const userStore = useUserStore();
      const loginData: LoginRequest = { username, password, code, uuid };
      await userStore.login(loginData);
      return true;
    } catch (error) {
      console.error("快速登录失败:", error);
      return false;
    }
  }

  /**
   * 手机号登录（使用统一登录方法）
   * @param phone 手机号
   * @param code 验证码
   * @returns Promise<boolean>
   */
  static async loginWithPhone(phone: string, code: string): Promise<boolean> {
    try {
      const userStore = useUserStore();
      const phoneData = { phone, code };
      await userStore.loginWithPhoneNumber(phoneData);
      return true;
    } catch (error) {
      console.error("手机号登录失败:", error);
      return false;
    }
  }

  /**
   * 邮箱登录（使用统一登录方法）
   * @param email 邮箱
   * @param password 密码
   * @param code 验证码（可选）
   * @param uuid 验证码UUID（可选）
   * @returns Promise<boolean>
   */
  static async loginWithEmail(email: string, password: string, code?: string, uuid?: string): Promise<boolean> {
    try {
      const userStore = useUserStore();
      const loginData: LoginRequest = {
        email,
        password,
        code,
        uuid,
        loginType: "email",
      };
      await userStore.login(loginData);
      return true;
    } catch (error) {
      console.error("邮箱登录失败:", error);
      return false;
    }
  }

  /**
   * 验证密码强度
   * @param password 密码
   * @returns { valid: boolean; score: number; message: string }
   */
  static validatePasswordStrength(password: string): { valid: boolean; score: number; message: string } {
    let score = 0;
    const messages: string[] = [];

    // 长度检查
    if (password.length >= 8) {
      score += 1;
    } else {
      messages.push("密码长度至少8位");
    }

    // 包含大写字母
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      messages.push("包含至少一个大写字母");
    }

    // 包含小写字母
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      messages.push("包含至少一个小写字母");
    }

    // 包含数字
    if (/\d/.test(password)) {
      score += 1;
    } else {
      messages.push("包含至少一个数字");
    }

    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      messages.push("包含至少一个特殊字符");
    }

    const valid = score >= 3;
    const message = valid ? "密码强度合格" : `密码需要：${messages.join("、")}`;

    return { valid, score, message };
  }

  /**
   * 验证手机号格式
   * @param phone 手机号
   * @returns boolean
   */
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 验证邮箱格式
   * @param email 邮箱
   * @returns boolean
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 格式化用户显示名称
   * @param user 用户信息
   * @returns string
   */
  static formatUserDisplayName(user: UserInfo): string {
    return user.nickname || user.username || "未知用户";
  }

  /**
   * 检查登录状态并重定向
   * @param requireAuth 是否需要认证
   * @param redirectPath 重定向路径
   * @returns boolean 是否允许访问
   */
  static checkAuthAndRedirect(requireAuth: boolean = true, redirectPath: string = "/login"): boolean {
    const isLoggedIn = this.isLoggedIn();

    if (requireAuth && !isLoggedIn) {
      router.push(redirectPath);
      return false;
    }

    if (!requireAuth && isLoggedIn) {
      router.push("/dashboard");
      return false;
    }

    return true;
  }

  /**
   * 创建权限检查指令参数
   * @param permissions 权限数组
   * @returns object
   */
  static createPermissionDirective(permissions: string[]) {
    return {
      mounted(el: HTMLElement) {
        const hasPermission = permissions.some((permission) => AuthUtils.hasPermission(permission));

        if (!hasPermission) {
          el.style.display = "none";
        }
      },
    };
  }
}
