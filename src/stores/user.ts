import { defineStore } from "pinia";
import { http } from "@/utils/request";
import type { UserInfo } from "@/types/user";

// 定义用户状态接口
interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
}

// 定义登录参数接口
export interface LoginParams {
  username: string;
  password: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: localStorage.getItem("token") || null,
    userInfo: JSON.parse(localStorage.getItem("user-info") || "null"),
    isLoggedIn: !!localStorage.getItem("token"),
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
    // 用户登录
    async login(loginParams: LoginParams) {
      try {
        // 发送登录请求
        const response: any = await http.post("/api/login", loginParams);
        
        // 保存token和用户信息
        this.token = response.data.token;
        this.userInfo = response.data.user;
        this.isLoggedIn = true;
        
        // 保存到localStorage
        if (this.token) {
          localStorage.setItem("token", this.token);
        }
        localStorage.setItem("user-info", JSON.stringify(this.userInfo));
        
        return response;
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },

    // 用户登出
    logout() {
      // 清除状态
      this.token = null;
      this.userInfo = null;
      this.isLoggedIn = false;
      
      // 清除localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user-info");
    },

    // 初始化用户信息
    initUserInfo() {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user-info");
      
      if (token && userInfo) {
        this.token = token;
        this.userInfo = JSON.parse(userInfo);
        this.isLoggedIn = true;
      }
    },

    // 更新用户信息
    updateUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("user-info", JSON.stringify(userInfo));
    },
  },
});