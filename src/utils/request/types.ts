import type { AxiosRequestConfig, AxiosResponse, AxiosProgressEvent } from "axios";

/**
 * 通用API响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp?: number;
}

/**
 * 基础请求配置接口
 */
export interface BaseRequestConfig {
  // 请求基础信息
  baseURL?: string;
  timeout?: number;

  // 认证配置
  withToken?: boolean;
  tokenPrefix?: string;

  // 错误处理
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
  silentError?: boolean; // 静默处理错误，不显示错误消息

  // 加载状态
  showLoading?: boolean;
  loadingText?: string;

  // 重复提交控制
  preventRepeatSubmit?: boolean;
  repeatSubmitDelay?: number;

  // 响应数据处理
  transformResponse?: boolean;
  returnFullResponse?: boolean;

  // 缓存配置
  cache?: boolean | "memory" | "session" | "local";
  cacheTime?: number;

  // 重试配置
  retry?: number;
  retryDelay?: number;
}

/**
 * 请求方法配置接口
 */
export interface RequestMethodConfig extends BaseRequestConfig {
  // HTTP 方法
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

  // 请求数据
  url: string;
  data?: unknown;
  params?: unknown;

  // 自定义头部
  headers?: Record<string, unknown>;

  // 文件上传/下载
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;

  // 响应类型
  responseType?: "json" | "blob" | "text" | "arraybuffer";
}

/**
 * 文件上传配置
 */
export interface UploadConfig extends Partial<RequestMethodConfig> {
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
}

/**
 * 文件下载配置
 */
export interface DownloadConfig extends Partial<RequestMethodConfig> {
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  saveAs?: boolean;
  filename?: string;
}

/**
 * 错误处理配置
 */
export interface ErrorHandlingConfig {
  // 全局错误处理器
  globalHandler?: (error: RequestError) => void;

  // 特定错误处理器
  handlers?: {
    [errorCode: number]: (error: RequestError) => void;
  };

  // 错误重试配置
  retry?: {
    times: number;
    delay: number;
    condition?: (error: unknown) => boolean;
  };
}

/**
 * 请求错误类型
 */
export interface RequestError extends Error {
  code?: number;
  status?: number;
  response?: AxiosResponse;
  request?: unknown;
  config?: AxiosRequestConfig;
  isAxiosError: boolean;
}

/**
 * 拦截器配置
 */
export interface InterceptorConfig {
  request?: {
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
    onRejected?: (error: unknown) => unknown;
  };
  response?: {
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
    onRejected?: (error: unknown) => unknown;
  };
}

/**
 * 创建请求实例的配置
 */
export interface CreateRequestConfig extends BaseRequestConfig {
  interceptors?: InterceptorConfig;
  errorHandling?: ErrorHandlingConfig;
}
