import { createAxiosInstance } from "./instance";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import router from "@/router";

// 创建 axios 实例
const requestInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
requestInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    // 如果有token，添加到请求头
    if (userStore.token) {
      config.headers.set("Authorization", `Bearer ${userStore.token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    ElMessage.error("请求参数错误");
    return Promise.reject(error);
  },
);

// 响应拦截器
requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回data给调用者
    const { data } = response;

    // 这里可以根据后端实际状态码处理
    // 示例：假设后端约定 200 为成功，其他为错误
    if (data.code !== 200 && data.code !== undefined) {
      ElMessage.error(data.msg || "操作失败");
      return Promise.reject(data);
    }

    return data;
  },
  (error: AxiosError) => {
    // 响应错误处理
    const status = error.response?.status;
    const userStore = useUserStore();

    // 避免重复弹出错误消息
    if (error.message !== "Canceled") {
      switch (status) {
        case 401:
          // 未授权，需要重新登录
          ElMessage.error("登录已过期，请重新登录");
          userStore.logout();
          router.push("/login");
          break;
        case 403:
          ElMessage.error("没有操作权限");
          break;
        case 404:
          ElMessage.error("请求地址不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error("请求失败，请稍后重试");
      }
    }

    return Promise.reject(error);
  },
);

// 封装常用请求方法
export const http = {
  get<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return requestInstance.get(url, config);
  },

  post<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    return requestInstance.post(url, data, config);
  },

  put<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    return requestInstance.put(url, data, config);
  },

  delete<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return requestInstance.delete(url, config);
  },

  // 上传文件
  upload<T = unknown>(url: string, data: FormData, config?: InternalAxiosRequestConfig): Promise<T> {
    return requestInstance.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};

// 默认导出request实例
export default requestInstance;
