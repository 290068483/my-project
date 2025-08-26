/**
 * 简化版本的 axios 实例
 * 提供基础的请求和响应拦截器
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import type { SimpleRequestConfig, ApiResponse } from "./simple-config";

/**
 * 创建简化的 axios 实例
 */
export function createSimpleAxiosInstance(config: SimpleRequestConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 全局加载状态管理
  let loadingCount = 0;

  const showLoading = () => {
    if (config.showLoading && loadingCount === 0) {
      console.log("🔄 Loading started...");
      // 这里可以集成你的 loading 组件
    }
    loadingCount++;
  };

  const hideLoading = () => {
    loadingCount--;
    if (loadingCount <= 0) {
      loadingCount = 0;
      if (config.showLoading) {
        console.log("✅ Loading finished");
        // 这里可以隐藏 loading 组件
      }
    }
  };

  // 请求拦截器
  instance.interceptors.request.use(
    (requestConfig) => {
      // 添加认证Token
      if (config.withToken && config.tokenKey) {
        const token = getToken();
        if (token) {
          requestConfig.headers = requestConfig.headers || {};
          requestConfig.headers[config.tokenKey] = `Bearer ${token}`;
        }
      }

      // 显示Loading
      if (config.showLoading) {
        showLoading();
      }

      // 开发环境请求日志
      if (process.env.NODE_ENV === "development") {
        console.log("🚀 Request:", {
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          data: requestConfig.data,
          params: requestConfig.params,
        });
      }

      return requestConfig;
    },
    (error) => {
      hideLoading();
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 隐藏Loading
      if (config.showLoading) {
        hideLoading();
      }

      // 开发环境响应日志
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Response:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      const { data } = response;

      // 数据转换
      if (config.transformData && data && typeof data === "object") {
        // 假设 API 响应格式为 { code, message, data }
        if ("code" in data && "message" in data && "data" in data) {
          const apiResponse = data as ApiResponse;

          if (apiResponse.code === 200 || apiResponse.code === 0) {
            return apiResponse.data;
          } else {
            const error = new Error(apiResponse.message || "请求失败");
            if (config.showError) {
              console.error("❌ API Error:", apiResponse.message);
            }
            return Promise.reject(error);
          }
        }
      }

      return data;
    },
    (error: AxiosError) => {
      // 隐藏Loading
      if (config.showLoading) {
        hideLoading();
      }

      // 错误日志
      console.error("❌ Response Error:", {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
      });

      // 处理不同类型的错误
      let errorMessage = "请求失败";

      if (!error.response) {
        errorMessage = "网络错误，请检查网络连接";
      } else {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            errorMessage = "未授权，请重新登录";
            // 这里可以触发登出逻辑
            break;
          case 403:
            errorMessage = "权限不足";
            break;
          case 404:
            errorMessage = "请求的资源不存在";
            break;
          case 422:
            errorMessage = data?.message || "参数验证失败";
            break;
          case 500:
            errorMessage = "服务器内部错误";
            break;
          default:
            errorMessage = data?.message || error.message || "请求失败";
        }
      }

      if (config.showError) {
        console.error("❌ Error Message:", errorMessage);
      }

      const customError = new Error(errorMessage);
      (customError as any).status = error.response?.status;
      (customError as any).response = error.response;

      return Promise.reject(customError);
    },
  );

  return instance;
}

/**
 * 获取存储的 token
 * 这里可以根据项目需求自定义 token 获取逻辑
 */
function getToken(): string | null {
  try {
    // 从 localStorage 或其他地方获取 token
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch {
    return null;
  }
}
