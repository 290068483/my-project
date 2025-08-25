import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { AppConfig } from "@/config/index";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import config from "@/config/index";

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: config.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 获取用户store
    const userStore = useUserStore();
    // 添加token到请求头
    if (userStore.token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理成功响应
    const { data } = response;
    // 根据后端接口规范处理响应
    if (data.code === 200) {
      return data.data;
    } else {
      ElMessage.error(data.message || "请求失败");
      return Promise.reject(data);
    }
  },
  (error) => {
    // 处理响应错误
    if (!error.response) {
      // 网络错误
      ElMessage.error("网络错误，请检查网络连接");
    } else {
      const { status, data } = error.response;
      // 获取用户store
      const userStore = useUserStore();

      switch (status) {
        case 401:
          // token失效
          ElMessage.error(data.message || "登录过期，请重新登录");
          // 清除用户信息
          userStore.logout();
          // 跳转到登录页
          router.push("/login");
          break;
        case 403:
          // 权限不足
          ElMessage.error(data.message || "权限不足，无法访问");
          break;
        case 404:
          // 资源不存在
          ElMessage.error(data.message || "请求的资源不存在");
          break;
        case 500:
          // 服务器错误
          ElMessage.error(data.message || "服务器错误，请稍后再试");
          break;
        default:
          ElMessage.error(data.message || "请求失败");
      }
    }
    return Promise.reject(error);
  },
);

// 封装请求方法
const request = {
  get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.get(url, { params, ...config });
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.post(url, data, config);
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.put(url, data, config);
  },
  delete<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return http.delete(url, { params, ...config });
  },
};

export default request;
