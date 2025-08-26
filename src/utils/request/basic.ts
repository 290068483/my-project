/**
 * 超级简化的 axios 请求封装
 * 无复杂依赖，专注基础功能
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";

/**
 * 简单配置接口
 */
export interface BasicConfig {
  baseURL?: string;
  timeout?: number;
  token?: string;
}

/**
 * API 响应格式
 */
export interface BasicApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

/**
 * 创建简单的 axios 实例
 */
function createBasicInstance(config: BasicConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL || "/api",
    timeout: config.timeout || 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (requestConfig) => {
      // 添加认证Token
      if (config.token) {
        requestConfig.headers = requestConfig.headers || {};
        requestConfig.headers.Authorization = `Bearer ${config.token}`;
      }

      console.log("🚀 Request:", {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
      });

      return requestConfig;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
      });

      const { data } = response;

      // 数据转换
      if (data && typeof data === "object" && "code" in data) {
        const apiResponse = data as BasicApiResponse;

        if (apiResponse.code === 200 || apiResponse.code === 0) {
          return apiResponse.data;
        } else {
          const error = new Error(apiResponse.message || "请求失败");
          return Promise.reject(error);
        }
      }

      return data;
    },
    (error: AxiosError) => {
      console.error("❌ Response Error:", error.message);

      let errorMessage = "请求失败";

      if (!error.response) {
        errorMessage = "网络错误";
      } else {
        const { status } = error.response;

        switch (status) {
          case 401:
            errorMessage = "未授权";
            break;
          case 403:
            errorMessage = "权限不足";
            break;
          case 404:
            errorMessage = "资源不存在";
            break;
          case 500:
            errorMessage = "服务器错误";
            break;
          default:
            errorMessage = error.message || "请求失败";
        }
      }

      return Promise.reject(new Error(errorMessage));
    },
  );

  return instance;
}

/**
 * 简单请求类
 */
export class BasicRequest {
  private instance: AxiosInstance;

  constructor(config?: BasicConfig) {
    this.instance = createBasicInstance(config);
  }

  /**
   * GET 请求
   */
  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.get(url, { params });
    return response as T;
  }

  /**
   * POST 请求
   */
  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post(url, data);
    return response as T;
  }

  /**
   * PUT 请求
   */
  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put(url, data);
    return response as T;
  }

  /**
   * DELETE 请求
   */
  async delete<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.delete(url, { params });
    return response as T;
  }

  /**
   * 文件上传
   */
  async upload<T = unknown>(url: string, file: File | FormData): Promise<T> {
    let formData: FormData;

    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append("file", file);
    }

    const response = await this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response as T;
  }
}

// 延迟创建默认实例
let defaultRequest: BasicRequest | null = null;

function getDefaultRequest(): BasicRequest {
  if (!defaultRequest) {
    defaultRequest = new BasicRequest();
  }
  return defaultRequest;
}

/**
 * 默认导出的请求方法
 */
export const basicRequest = {
  get: <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> =>
    getDefaultRequest().get<T>(url, params),

  post: <T = unknown>(url: string, data?: unknown): Promise<T> => getDefaultRequest().post<T>(url, data),

  put: <T = unknown>(url: string, data?: unknown): Promise<T> => getDefaultRequest().put<T>(url, data),

  delete: <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> =>
    getDefaultRequest().delete<T>(url, params),

  upload: <T = unknown>(url: string, file: File | FormData): Promise<T> => getDefaultRequest().upload<T>(url, file),
};

// 向后兼容
export default basicRequest;
export const request = basicRequest;
export const http = basicRequest;

/**
 * 创建自定义请求实例
 */
export function createBasicRequest(config?: BasicConfig): BasicRequest {
  return new BasicRequest(config);
}
