/**
 * 简化版本的请求配置
 * 去除复杂依赖，专注核心功能
 */

import type { AxiosRequestConfig } from "axios";

/**
 * 基础配置接口
 */
export interface SimpleRequestConfig {
  baseURL?: string;
  timeout?: number;
  withToken?: boolean;
  tokenKey?: string;
  showLoading?: boolean;
  showError?: boolean;
  transformData?: boolean;
}

/**
 * 请求方法配置
 */
export interface SimpleRequestMethodConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  transformData?: boolean;
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

/**
 * 默认配置
 */
export const defaultSimpleConfig: SimpleRequestConfig = {
  baseURL: "/api",
  timeout: 10000,
  withToken: true,
  tokenKey: "Authorization",
  showLoading: false,
  showError: true,
  transformData: true,
};

/**
 * 合并配置
 */
export function mergeSimpleConfig(
  base: SimpleRequestConfig,
  custom?: Partial<SimpleRequestConfig>,
): SimpleRequestConfig {
  return {
    ...base,
    ...custom,
  };
}
