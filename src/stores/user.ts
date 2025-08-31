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

  actions: {
    // 登录
    login(userInfo: LoginRequest) {
      const username = userInfo.username?.trim() || "";
      const password = userInfo.password || "";
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise<void>((resolve, reject) => {
        login({ username, password, code, uuid })
          .then((res: LoginResponse) => {
            // RuoYi-Vue3标准：直接从res.data中获取token
            // 但根据实际返回的数据格式，token直接在res中
            if (res.code === 200) {
              // 检查token是在res中还是在res.data中
              const token = res.token || (res.data && res.data.token);
              if (token) {
                setToken(token);
                this.token = token;
                resolve();
              } else {
                reject(new Error("登录响应中未找到token"));
              }
            } else {
              reject(new Error(res.msg || "登录失败"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: UserInfoResponse) => {
            console.log("获取用户信息响应:", res);
            // RuoYi-Vue3标准：直接从res中获取user、roles和permissions
            if (res.code === 200 && res.data) {
              const user = res.data.user;
              const avatar =
                user.avatar == "" || user.avatar == null ? "" : import.meta.env.VITE_APP_BASE_API + user.avatar;

              if (res.data.roles && res.data.roles.length > 0) {
                // 验证返回的roles是否是一个非空数组
                this.roles = res.data.roles;
                this.permissions = res.data.permissions;
              } else {
                this.roles = ["ROLE_DEFAULT"];
              }
              this.name = user.userName || user.nickName || "";
              this.avatar = avatar;
              console.log("设置用户信息完成 - roles:", this.roles, "permissions:", this.permissions);
              resolve(res);
            } else {
              reject(new Error(res.msg || "获取用户信息失败"));
            }
          })
          .catch((error) => {
            console.error("获取用户信息失败:", error);
            reject(error);
          });
      });
    },

    // 退出系统
    logout() {
      return new Promise<void>((resolve, reject) => {
        logout()
          .then((res: LogoutResponse) => {
            // RuoYi-Vue3标准：检查响应状态码
            if (res.code === 200) {
              this.token = "";
              this.roles = [];
              this.permissions = [];
              removeToken();
              resolve();
            } else {
              reject(new Error(res.msg || "退出登录失败"));
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
            // 成功获取验证码数据，直接返回响应
            // 根据实际返回的数据结构调整处理逻辑
            if (res && typeof res === "object" && res.code === 200 && res.uuid && res.img) {
              // 后端直接返回扁平结构，需要适配我们的类型定义
              const captchaResponse: CaptchaResponse = {
                code: res.code,
                msg: res.msg,
                uuid: res.uuid,
                img: res.img,
                captchaEnabled: res.captchaEnabled,
                data: {
                  uuid: res.uuid,
                  img: res.img,
                  captchaEnabled: res.captchaEnabled,
                },
              };
              resolve(captchaResponse);
            } else {
              console.error("验证码接口返回数据格式不正确:", res);
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
          .then((res: RegisterResponse) => {
            // RuoYi-Vue3标准：检查响应状态码
            if (res.code === 200) {
              resolve(res);
            } else {
              reject(new Error(res.msg || "注册失败"));
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
