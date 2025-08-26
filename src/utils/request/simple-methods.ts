/**
 * 简化版本的请求方法管理器
 * 提供基础的 HTTP 请求方法
 */

import type { AxiosInstance } from "axios";
import type { SimpleRequestConfig, SimpleRequestMethodConfig, ApiResponse } from "./simple-config";

/**
 * 简化版请求管理器
 */
export class SimpleRequestManager {
  private instance: AxiosInstance;
  private config: SimpleRequestConfig;

  constructor(instance: AxiosInstance, config: SimpleRequestConfig) {
    this.instance = instance;
    this.config = config;
  }

  /**
   * 通用请求方法
   */
  async request<T = unknown>(config: SimpleRequestMethodConfig): Promise<T> {
    try {
      const response = await this.instance.request({
        ...config,
        // 这里可以添加特定的配置覆盖
      });
      return response as T;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<SimpleRequestMethodConfig>,
  ): Promise<T> {
    return this.request<T>({
      method: "GET",
      url,
      params,
      ...config,
    });
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> {
    return this.request<T>({
      method: "POST",
      url,
      data,
      ...config,
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
      ...config,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: Partial<SimpleRequestMethodConfig>,
  ): Promise<T> {
    return this.request<T>({
      method: "DELETE",
      url,
      params,
      ...config,
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: Partial<SimpleRequestMethodConfig>): Promise<T> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
      ...config,
    });
  }

  /**
   * 文件上传
   */
  async upload<T = any>(url: string, file: File | FormData, config?: Partial<SimpleRequestMethodConfig>): Promise<T> {
    let formData: FormData;

    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append("file", file);
    }

    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
  }

  /**
   * 文件下载
   */
  async download(url: string, filename?: string, config?: Partial<SimpleRequestMethodConfig>): Promise<void> {
    try {
      const response = await this.request<Blob>({
        method: "GET",
        url,
        responseType: "blob",
        ...config,
      });

      // 创建下载链接
      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = filename || this.getFilenameFromUrl(url);
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下载失败:", error);
      throw error;
    }
  }

  /**
   * 并发请求
   */
  async concurrent<T = any>(requests: SimpleRequestMethodConfig[]): Promise<T[]> {
    try {
      const promises = requests.map((config) => this.request<T>(config));
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 串行请求（队列）
   */
  async queue<T = any>(requests: SimpleRequestMethodConfig[], concurrency: number = 3): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const config of requests) {
      const promise = this.request<T>(config).then(
        (result) => {
          results.push(result);
        },
        (error) => {
          console.error("Queue request failed:", error);
          throw error;
        },
      );

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(
          executing.findIndex((p) => p === promise),
          1,
        );
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * 从 URL 中提取文件名
   */
  private getFilenameFromUrl(url: string): string {
    const pathname = new URL(url, window.location.origin).pathname;
    return pathname.split("/").pop() || "download";
  }
}

/**
 * 工具函数：创建简化的请求实例
 */
export function createSimpleRequest(config?: Partial<SimpleRequestConfig>): SimpleRequestManager {
  const { createSimpleAxiosInstance } = require("./simple-instance");
  const { defaultSimpleConfig, mergeSimpleConfig } = require("./simple-config");

  const finalConfig = mergeSimpleConfig(defaultSimpleConfig, config);
  const instance = createSimpleAxiosInstance(finalConfig);

  return new SimpleRequestManager(instance, finalConfig);
}

/**
 * 批量请求工具
 */
export const batch = {
  /**
   * 并发执行多个请求
   */
  concurrent: async <T = any>(manager: SimpleRequestManager, requests: SimpleRequestMethodConfig[]): Promise<T[]> => {
    return manager.concurrent<T>(requests);
  },

  /**
   * 串行执行多个请求
   */
  sequence: async <T = any>(manager: SimpleRequestManager, requests: SimpleRequestMethodConfig[]): Promise<T[]> => {
    return manager.queue<T>(requests, 1);
  },

  /**
   * 限制并发数的批量请求
   */
  limited: async <T = any>(
    manager: SimpleRequestManager,
    requests: SimpleRequestMethodConfig[],
    concurrency: number = 3,
  ): Promise<T[]> => {
    return manager.queue<T>(requests, concurrency);
  },
};
