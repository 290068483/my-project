import type { BaseRequestConfig, CreateRequestConfig } from "./types";
import config from "@/config/index";

/**
 * 默认请求配置
 */
export const defaultConfig: BaseRequestConfig = {
  // 基础配置
  baseURL: config.baseUrl,
  timeout: config.timeout,

  // 认证配置
  withToken: true,
  tokenPrefix: "Bearer",

  // 错误处理
  showErrorMessage: true,
  showSuccessMessage: false,
  silentError: false, // 新增：是否静默处理错误

  // 加载状态
  showLoading: false,
  loadingText: "加载中...",

  // 重复提交控制
  preventRepeatSubmit: true,
  repeatSubmitDelay: 1000,

  // 响应数据处理
  transformResponse: true,
  returnFullResponse: false,

  // 缓存配置
  cache: false,
  cacheTime: 5 * 60 * 1000, // 5分钟

  // 重试配置
  retry: 0,
  retryDelay: 1000,
};

/**
 * 合并配置
 * @param baseConfig 基础配置
 * @param customConfig 自定义配置
 * @returns 合并后的配置
 */
export function mergeConfig<T extends BaseRequestConfig>(baseConfig: T, customConfig?: Partial<T>): T {
  if (!customConfig) {
    return { ...baseConfig };
  }

  return {
    ...baseConfig,
    ...customConfig,
    // 深度合并headers
    headers: {
      ...baseConfig.headers,
      ...customConfig.headers,
    },
  };
}

/**
 * 验证配置
 * @param config 配置对象
 * @returns 验证结果
 */
export function validateConfig(config: BaseRequestConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 验证baseURL
  if (!config.baseURL) {
    errors.push("baseURL is required");
  }

  // 验证timeout
  if (config.timeout && (config.timeout <= 0 || config.timeout > 300000)) {
    errors.push("timeout must be between 1 and 300000ms");
  }

  // 验证retryDelay
  if (config.retryDelay && config.retryDelay < 0) {
    errors.push("retryDelay must be greater than or equal to 0");
  }

  // 验证repeatSubmitDelay
  if (config.repeatSubmitDelay && config.repeatSubmitDelay < 0) {
    errors.push("repeatSubmitDelay must be greater than or equal to 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 创建请求配置
 * @param customConfig 自定义配置
 * @returns 完整的请求配置
 */
export function createConfig(customConfig?: Partial<CreateRequestConfig>): CreateRequestConfig {
  const config = mergeConfig(defaultConfig, customConfig);

  const validation = validateConfig(config);
  if (!validation.valid) {
    console.warn("Request config validation failed:", validation.errors);
  }

  return config;
}
