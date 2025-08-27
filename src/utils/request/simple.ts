/**
 * 简化版本的 axios 请求封装 - 主入口
 * 提供开箱即用的请求功能，无复杂依赖
 */

// import { createSimpleAxiosInstance } from "./simple-instance";
import { SimpleRequestManager, createSimpleRequest, batch } from "./simple-methods";
import {
  defaultSimpleConfig,
  type SimpleRequestConfig,
  type SimpleRequestMethodConfig,
  type ApiResponse,
} from "./simple-config";

// 创建默认请求实例
const defaultSimpleRequest = createSimpleRequest();

/**
 * 默认请求方法（简化版本）
 */
export const simpleRequest = {
  /**
   * 通用请求方法
   */
  request: <T = any>(config: SimpleRequestMethodConfig): Promise<T> => defaultSimpleRequest.request<T>(config),

  /**
   * GET请求
   */
  get: <T = any>(url: string, params?: Record<string, any>, config?: Partial<SimpleRequestMethodConfig>): Promise<T> =>
    defaultSimpleRequest.get<T>(url, params, config),

  /**
   * POST请求
   */
  post: <T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> =>
    defaultSimpleRequest.post<T>(url, data, config),

  /**
   * PUT请求
   */
  put: <T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> =>
    defaultSimpleRequest.put<T>(url, data, config),

  /**
   * DELETE请求
   */
  delete: <T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<SimpleRequestMethodConfig>,
  ): Promise<T> => defaultSimpleRequest.delete<T>(url, params, config),

  /**
   * PATCH请求
   */
  patch: <T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> =>
    defaultSimpleRequest.patch<T>(url, data, config),

  /**
   * 文件上传
   */
  upload: <T = any>(url: string, file: File | FormData, config?: Partial<SimpleRequestMethodConfig>): Promise<T> =>
    defaultSimpleRequest.upload<T>(url, file, config),

  /**
   * 文件下载
   */
  download: (url: string, filename?: string, config?: Partial<SimpleRequestMethodConfig>): Promise<void> =>
    defaultSimpleRequest.download(url, filename, config),

  /**
   * 并发请求
   */
  concurrent: <T = any>(requests: SimpleRequestMethodConfig[]): Promise<T[]> =>
    defaultSimpleRequest.concurrent<T>(requests),

  /**
   * 串行队列请求
   */
  queue: <T = any>(requests: SimpleRequestMethodConfig[], concurrency?: number): Promise<T[]> =>
    defaultSimpleRequest.queue<T>(requests, concurrency),
};

// 默认导出（向后兼容）
export default simpleRequest;

// 类型导出
export type { ApiResponse, SimpleRequestConfig, SimpleRequestMethodConfig };

// 工具导出
export { createSimpleRequest, SimpleRequestManager, batch, defaultSimpleConfig };

/**
 * 快捷方法
 */

/**
 * 创建API请求方法（带类型支持）
 * @param baseURL API基础路径
 * @param config 额外配置
 * @returns 请求实例
 */
export function createSimpleAPI(baseURL: string, config?: Partial<SimpleRequestConfig>) {
  return createSimpleRequest({
    baseURL,
    ...config,
  });
}

/**
 * 创建文件上传方法
 * @param uploadURL 上传地址
 * @returns 上传方法
 */
export function createSimpleUploader(uploadURL: string) {
  return (file: File | FormData, config?: Partial<SimpleRequestMethodConfig>) => {
    return simpleRequest.upload(uploadURL, file, config);
  };
}

/**
 * 创建文件下载方法
 * @param downloadURL 下载地址
 * @returns 下载方法
 */
export function createSimpleDownloader(downloadURL: string) {
  return (filename?: string, config?: Partial<SimpleRequestMethodConfig>) => {
    return simpleRequest.download(downloadURL, filename, config);
  };
}

/**
 * 便捷的请求方法（向后兼容原有API）
 */
export const http = simpleRequest;
export const request = simpleRequest;
