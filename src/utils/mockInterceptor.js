/**
 * Mock 请求拦截器
 * 在开发环境下拦截API请求并返回模拟数据
 */

import { mockHandlers } from "./mockService.js";
import config from "@/config/index.js";

// 延迟函数，模拟网络延迟
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock响应拦截器
 * @param {AxiosRequestConfig} requestConfig 请求配置
 * @returns {Promise} 模拟响应
 */
export async function mockInterceptor(requestConfig) {
  if (!config.useMock) {
    return null; // 不使用Mock，继续正常请求
  }

  const { method = "GET", url = "", data } = requestConfig;
  const key = `${method.toUpperCase()} ${url}`;

  console.log("🎭 Mock Intercepting:", key);

  // 查找对应的Mock处理器
  const handler = mockHandlers[key];

  if (!handler) {
    console.warn("⚠️ No mock handler found for:", key);
    return null; // 没有对应的Mock处理器，继续正常请求
  }

  try {
    // 模拟网络延迟
    await delay(100 + Math.random() * 200);

    // 执行Mock处理器
    const mockResponse = handler({
      body: data,
      query: requestConfig.params,
      headers: requestConfig.headers,
    });

    console.log("✅ Mock Response:", mockResponse);

    // 返回模拟的Axios响应格式
    return {
      data: mockResponse,
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
      },
      config: requestConfig,
    };
  } catch (error) {
    console.error("❌ Mock Error:", error);

    // 返回错误响应
    return {
      data: {
        code: 500,
        msg: "模拟数据处理失败",
        data: null,
      },
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        "content-type": "application/json",
      },
      config: requestConfig,
    };
  }
}

/**
 * 安装Mock拦截器到Axios实例
 * @param {AxiosInstance} axiosInstance Axios实例
 */
export function installMockInterceptor(axiosInstance) {
  if (!config.useMock) {
    return;
  }

  console.log("🎭 Installing Mock Interceptor...");

  // 添加请求拦截器
  axiosInstance.interceptors.request.use(
    async (requestConfig) => {
      // 尝试Mock拦截
      const mockResponse = await mockInterceptor(requestConfig);

      if (mockResponse) {
        // 如果有Mock响应，直接返回Promise.reject来跳过实际请求
        // 但是携带Mock响应数据
        const mockError = new Error("Mock Response");
        mockError.isMockResponse = true;
        mockError.mockResponse = mockResponse;
        return Promise.reject(mockError);
      }

      // 没有Mock响应，继续正常请求
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 修改响应拦截器来处理Mock响应
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 检查是否是Mock响应
      if (error.isMockResponse && error.mockResponse) {
        console.log("🎭 Returning Mock Response");
        return Promise.resolve(error.mockResponse);
      }

      return Promise.reject(error);
    },
  );
}

export default { mockInterceptor, installMockInterceptor };
