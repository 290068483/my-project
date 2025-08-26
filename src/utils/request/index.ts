import { createAxiosInstance } from "./instance";
import { RequestManager } from "./methods";
import { createConfig, defaultConfig } from "./config";
import type { CreateRequestConfig, RequestMethodConfig, UploadConfig, DownloadConfig, ApiResponse } from "./types";

/**
 * 创建请求实例
 * @param customConfig 自定义配置
 * @returns 请求管理器实例
 */
export function createRequest(customConfig?: Partial<CreateRequestConfig>): RequestManager {
  const config = createConfig(customConfig);
  const axiosInstance = createAxiosInstance(config);
  return new RequestManager(axiosInstance, config);
}

// 创建默认请求实例
const defaultRequest = createRequest();

/**
 * 默认请求方法
 */
export const request = {
  /**
   * 通用请求方法
   */
  request: <T = unknown>(config: RequestMethodConfig): Promise<T> => defaultRequest.request<T>(config),

  /**
   * GET请求
   */
  get: <T = unknown>(url: string, params?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> =>
    defaultRequest.get<T>(url, params, config),

  /**
   * POST请求
   */
  post: <T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> =>
    defaultRequest.post<T>(url, data, config),

  /**
   * PUT请求
   */
  put: <T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> =>
    defaultRequest.put<T>(url, data, config),

  /**
   * DELETE请求
   */
  delete: <T = unknown>(url: string, params?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> =>
    defaultRequest.delete<T>(url, params, config),

  /**
   * PATCH请求
   */
  patch: <T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> =>
    defaultRequest.patch<T>(url, data, config),

  /**
   * 文件上传
   */
  upload: <T = unknown>(url: string, file: File | FormData, config?: UploadConfig): Promise<T> =>
    defaultRequest.upload<T>(url, file, config),

  /**
   * 文件下载
   */
  download: (url: string, filename?: string, config?: DownloadConfig): Promise<void> =>
    defaultRequest.download(url, filename, config),

  /**
   * 并发请求
   */
  concurrent: <T = unknown>(requests: RequestMethodConfig[]): Promise<T[]> => defaultRequest.concurrent<T>(requests),

  /**
   * 串行队列请求
   */
  queue: <T = unknown>(requests: RequestMethodConfig[], concurrency?: number): Promise<T[]> =>
    defaultRequest.queue<T>(requests, concurrency),
};

// 默认导出（向后兼容）
export default request;

// 兼容旧版本API (保持与原Http.ts的兼容)
export const legacyRequest = {
  get: request.get,
  post: request.post,
  put: request.put,
  delete: request.delete,
};

// 类型导出
export type { ApiResponse, CreateRequestConfig, RequestMethodConfig, UploadConfig, DownloadConfig };

// 工具导出
export { RequestManager };
export { defaultConfig } from "./config";

/**
 * 快捷方法
 */

/**
 * 创建API请求方法（带类型支持）
 * @param baseURL API基础路径
 * @param config 额外配置
 * @returns 请求实例
 */
export function createAPI(baseURL: string, config?: Partial<CreateRequestConfig>) {
  return createRequest({
    baseURL,
    ...config,
  });
}

/**
 * 创建文件上传方法
 * @param uploadURL 上传地址
 * @param config 上传配置
 * @returns 上传方法
 */
export function createUploader(uploadURL: string, config?: UploadConfig) {
  return (file: File | FormData, customConfig?: UploadConfig) => {
    return request.upload(uploadURL, file, { ...config, ...customConfig });
  };
}

/**
 * 创建文件下载方法
 * @param downloadURL 下载地址
 * @param config 下载配置
 * @returns 下载方法
 */
export function createDownloader(downloadURL: string, config?: DownloadConfig) {
  return (filename?: string, customConfig?: DownloadConfig) => {
    return request.download(downloadURL, filename, { ...config, ...customConfig });
  };
}

/**
 * 批量请求方法
 */
export const batch = {
  /**
   * 并发执行多个请求
   */
  concurrent: request.concurrent,

  /**
   * 串行执行多个请求
   */
  sequence: (requests: RequestMethodConfig[]) => request.queue(requests, 1),

  /**
   * 限制并发数的批量请求
   */
  limited: request.queue,
};
