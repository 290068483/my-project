import { defineStore } from "pinia";
import { config } from "../config/index";

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  permissions: string[];
  name?: string;
  department?: string;
  position?: string;
  email?: string;
}

export interface LoginParams {
  token: string;
  userInfo: UserInfo;
  expiresIn: number;
}

export const useUserStore = defineStore("user", {
  // ========== State ==========
  state: () => {
    const token = localStorage.getItem(`${config.storagePrefix}token`);
    const storedUserInfo = localStorage.getItem(`${config.storagePrefix}userInfo`);
    const storedExpiresAt = localStorage.getItem(`${config.storagePrefix}expiresAt`);

    let userInfo: UserInfo | null = null;
    if (storedUserInfo) {
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
      }
    }

    return {
      token,
      userInfo,
      expiresAt: storedExpiresAt ? parseInt(storedExpiresAt, 10) : null,
    };
  },

  // ========== Getters ==========
  getters: {
    isLoggedIn: (state) => {
      // 检查token是否存在且未过期
      if (!state.token || !state.expiresAt) {
        return false;
      }
      return Date.now() < state.expiresAt;
    },

    userRole: (state) => {
      return state.userInfo?.role || "";
    },

    userPermissions: (state) => {
      return state.userInfo?.permissions || [];
    },
  },

  // ========== Actions ==========
  actions: {
    login(params: LoginParams) {
      const { token: newToken, userInfo: newUserInfo, expiresIn } = params;

      // 设置token和用户信息
      this.token = newToken;
      this.userInfo = newUserInfo;
      this.expiresAt = Date.now() + expiresIn * 1000;

      // 保存到localStorage
      localStorage.setItem(`${config.storagePrefix}token`, newToken || "");
      localStorage.setItem(`${config.storagePrefix}userInfo`, JSON.stringify(newUserInfo));
      localStorage.setItem(`${config.storagePrefix}expiresAt`, this.expiresAt?.toString() || "");
    },

    logout() {
      // 清空状态
      this.token = null;
      this.userInfo = null;
      this.expiresAt = null;

      // 清除localStorage
      localStorage.removeItem(`${config.storagePrefix}token`);
      localStorage.removeItem(`${config.storagePrefix}userInfo`);
      localStorage.removeItem(`${config.storagePrefix}expiresAt`);
    },

    initUserInfo() {
      const storedUserInfo = localStorage.getItem(`${config.storagePrefix}userInfo`);
      if (storedUserInfo) {
        try {
          this.userInfo = JSON.parse(storedUserInfo);
        } catch (e) {
          console.error("Failed to parse user info from localStorage", e);
        }
      }
    },

    // 更新用户信息
    updateUserInfo(newUserInfo: UserInfo) {
      this.userInfo = { ...this.userInfo, ...newUserInfo } as UserInfo;

      // 更新localStorage
      localStorage.setItem(`${config.storagePrefix}userInfo`, JSON.stringify(this.userInfo));
    },

    // 检查权限
    hasPermission(permission: string) {
      // 管理员拥有所有权限
      if (this.userRole === "admin") {
        return true;
      }
      // 检查用户是否有指定权限
      return this.userPermissions.includes(permission);
    },
  },
});
