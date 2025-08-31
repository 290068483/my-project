import { defineStore } from "pinia";
import router from "@/router";
// 导入API接口
import { login, getCaptchaImage, getInfo, getRouters, logout } from "@/api/login";
import { register } from "@/api/register";
import { getToken, setToken, removeToken } from "@/utils/auth";

import type {
  UserInfo,
  LoginRequest,
  LoginResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

// 定义用户状态接口
interface UserState {
  token: string | null;
  name: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: getToken() || "",
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
  }),

  getters: {
    getIsLoggedIn: (state) => {
      return !!state.token;
    },
    getUserInfo: (state) => {
      return {
        name: state.name,
        avatar: state.avatar,
        roles: state.roles,
        permissions: state.permissions,
      };
    },
    getUserRole: (state) => {
      return state.roles && state.roles.length > 0 ? state.roles[0] : null;
    },
  },

  actions: {
    // 登录
    login(userInfo: LoginRequest) {
      const username = userInfo.username?.trim() || "";
      const password = userInfo.password || "";
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise<void>((resolve, reject) => {
        login({ username, password, code, uuid })
          .then((res: any) => {
            // 修改类型为any，因为响应拦截器返回的是完整响应
            console.log("登录接口响应:", res); // 添加调试日志

            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            // 特别处理登录接口的响应格式
            // 登录接口返回的token在响应外层
            let token = null;

            // 首先检查responseData.token（外层）
            if (responseData.token) {
              token = responseData.token;
            }
            // 然后检查responseData.data.token（内层）
            else if (responseData.data && responseData.data.token) {
              token = responseData.data.token;
            }

            console.log("提取到的token:", token); // 添加调试日志

            // 检查响应是否成功
            if (responseData.code === 200 && token) {
              setToken(token);
              this.token = token;
              resolve();
            } else if (responseData.code === 200 && !token) {
              // 如果code是200但没有token，检查是否有错误消息
              const errorMsg = responseData.msg || "登录响应中未找到token";
              console.error("登录失败:", errorMsg, "响应数据:", responseData);
              reject(new Error(errorMsg));
            } else {
              const errorMsg = responseData.msg || "登录失败";
              console.error("登录失败:", errorMsg, "响应数据:", responseData);
              reject(new Error(errorMsg));
            }
          })
          .catch((error) => {
            console.error("登录请求失败:", error);
            reject(error);
          });
      });
    },

    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            // 修改类型为any
            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            console.log("获取用户信息响应:", responseData); // 添加调试日志

            // RuoYi-Vue3标准：直接从res中获取user、roles和permissions
            if (responseData.code === 200) {
              // 检查是否有data字段
              const userData = responseData.data || responseData;

              // 添加额外的安全检查
              if (!userData.user) {
                reject(new Error("用户数据格式不正确：缺少user字段"));
                return;
              }

              const user = userData.user;
              // 安全检查avatar字段
              const avatar = user.avatar
                ? user.avatar == "" || user.avatar == null
                  ? ""
                  : import.meta.env.VITE_APP_BASE_API + user.avatar
                : "";

              // 安全检查roles和permissions字段
              if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
                this.roles = [...userData.roles]; // 创建副本避免引用问题
              } else {
                this.roles = ["ROLE_DEFAULT"];
              }

              this.permissions =
                userData.permissions && Array.isArray(userData.permissions) ? [...userData.permissions] : [];

              this.name = user.userName || user.nickName || "";
              this.avatar = avatar;
              resolve(responseData);
            } else {
              const errorMsg = responseData.msg || "获取用户信息失败";
              reject(new Error(errorMsg));
            }
          })
          .catch((error) => {
            console.error("获取用户信息异常:", error);
            reject(error);
          });
      });
    },

    // 退出系统
    logout() {
      return new Promise<void>((resolve, reject) => {
        logout()
          .then((res: any) => {
            // 修改类型为any
            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            // RuoYi-Vue3标准：检查响应状态码
            if (responseData.code === 200) {
              this.token = "";
              this.roles = [];
              this.permissions = [];
              removeToken();
              resolve();
            } else {
              const errorMsg = responseData.msg || "退出登录失败";
              reject(new Error(errorMsg));
            }
          })
          .catch((error) => {
            // 即使后端退出失败，前端状态也需要清理
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            reject(error);
          });
      });
    },

    // 获取验证码
    getCaptcha(): Promise<CaptchaResponse> {
      return new Promise((resolve, reject) => {
        getCaptchaImage()
          .then((res: any) => {
            // 修改类型为any
            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            // 成功获取验证码数据，直接返回响应
            // 根据实际返回的数据结构调整处理逻辑
            if (
              responseData &&
              typeof responseData === "object" &&
              responseData.code === 200 &&
              responseData.data &&
              responseData.data.uuid &&
              responseData.data.img
            ) {
              // 后端直接返回扁平结构，需要适配我们的类型定义
              const captchaData = responseData.data;
              const captchaResponse: CaptchaResponse = {
                code: responseData.code,
                msg: responseData.msg,
                uuid: captchaData.uuid,
                img: captchaData.img,
                captchaEnabled: captchaData.captchaEnabled,
                data: {
                  uuid: captchaData.uuid,
                  img: captchaData.img,
                  captchaEnabled: captchaData.captchaEnabled,
                },
              };
              resolve(captchaResponse);
            } else if (
              responseData &&
              typeof responseData === "object" &&
              responseData.code === 200 &&
              responseData.uuid &&
              responseData.img
            ) {
              // 处理另一种可能的数据格式（后端直接返回扁平结构）
              const captchaResponse: CaptchaResponse = {
                code: responseData.code,
                msg: responseData.msg,
                uuid: responseData.uuid,
                img: responseData.img,
                captchaEnabled: responseData.captchaEnabled,
                data: {
                  uuid: responseData.uuid,
                  img: responseData.img,
                  captchaEnabled: responseData.captchaEnabled,
                },
              };
              resolve(captchaResponse);
            } else {
              // 数据无效时的处理
              console.error("验证码接口返回数据格式不正确:", responseData);
              reject(new Error("验证码接口返回数据格式不正确"));
            }
          })
          .catch((error) => {
            console.error("获取验证码失败:", error);
            reject(new Error("获取验证码失败: " + (error.message || "网络错误")));
          });
      });
    },

    // 注册
    register(registerInfo: RegisterRequest) {
      return new Promise((resolve, reject) => {
        register(registerInfo)
          .then((res: any) => {
            // 修改类型为any
            // 由于响应拦截器返回的是完整响应对象，我们需要获取res.data
            const responseData = res.data || res; // 兼容两种格式

            // RuoYi-Vue3标准：检查响应状态码
            if (responseData.code === 200) {
              resolve(responseData);
            } else {
              const errorMsg = responseData.msg || "注册失败";
              reject(new Error(errorMsg));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

// 导出类型定义
export type { UserState };

// 添加默认导出以解决导入错误
export default useUserStore;
