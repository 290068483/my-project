import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosProgressEvent } from "axios";

// ============================ 类型定义 ============================
/**
 * API响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp?: number;
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
 * 基础请求配置
 */
export interface BaseRequestConfig {
  // 基础设置
  baseURL?: string;
  timeout?: number;

  // 认证配置
  withToken?: boolean;
  tokenPrefix?: string;
  tokenKey?: string;

  // 状态提示
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
  showLoading?: boolean;
  loadingText?: string;

  // 请求控制
  preventRepeatSubmit?: boolean;
  repeatSubmitDelay?: number;
  cache?: boolean | "memory" | "session" | "local";
  cacheTime?: number;

  // 响应处理
  transformResponse?: boolean;
  returnFullResponse?: boolean;

  // 错误重试
  retry?: number;
  retryDelay?: number;
}

/**
 * 请求方法配置
 */
export interface RequestMethodConfig extends BaseRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
  responseType?: "json" | "blob" | "text" | "arraybuffer";
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

/**
 * 文件上传配置
 */
export interface UploadConfig extends Partial<RequestMethodConfig> {
  maxSize?: number;
  accept?: string;
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
}

/**
 * 文件下载配置
 */
export interface DownloadConfig extends Partial<RequestMethodConfig> {
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  filename?: string;
}

// ============================ 工具类 ============================
/**
 * 重复提交检查器
 */
class RepeatSubmitChecker {
  private pendingRequests = new Set<string>();

  generateKey(config: AxiosRequestConfig): string {
    const { method = "GET", url, data } = config;
    let key = `${method}:${url}`;

    if (data && typeof data === "object") {
      key += `:${JSON.stringify(data)}`;
    }

    return key;
  }

  isRepeating(config: AxiosRequestConfig): boolean {
    const key = this.generateKey(config);
    return this.pendingRequests.has(key);
  }

  add(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.pendingRequests.add(key);
  }

  remove(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.pendingRequests.delete(key);
  }

  clear(): void {
    this.pendingRequests.clear();
  }
}

// 缓存工具
const memoryCache = {
  data: new Map<string, { value: unknown; expire: number }>(),

  get(key: string): unknown | null {
    const item = this.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expire) {
      this.data.delete(key);
      return null;
    }
    return item.value;
  },

  set(key: string, value: unknown, ttl: number = 5 * 60 * 1000): void {
    this.data.set(key, {
      value,
      expire: Date.now() + ttl,
    });
  },

  delete(key: string): void {
    this.data.delete(key);
  },
};

// ============================ 核心请求类 ============================
/**
 * 请求管理器
 */
export class RequestManager {
  private instance: AxiosInstance;
  private config: BaseRequestConfig;
  private repeatChecker = new RepeatSubmitChecker();

  constructor(config: BaseRequestConfig = {}) {
    // 获取环境变量中的API基础路径
    const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

    this.config = {
      baseURL: baseURL,
      timeout: 10000,
      withToken: true,
      tokenPrefix: "Bearer",
      tokenKey: "Authorization",
      showErrorMessage: true,
      showSuccessMessage: false,
      showLoading: true,
      loadingText: "加载中...",
      preventRepeatSubmit: false,
      transformResponse: true,
      ...config,
    };

    this.instance = this.createInstance();
    this.setupInterceptors();
  }

  /**
   * 创建axios实例
   */
  private createInstance(): AxiosInstance {
    // 从配置中排除transformResponse和returnFullResponse，因为它们不是axios的配置项
    const { transformResponse, returnFullResponse, ...axiosConfig } = this.config;

    // 获取环境变量中的API基础路径
    const baseURL = import.meta.env.VITE_API_BASE_URL || this.config.baseURL || "/api";

    console.log("创建axios实例，baseURL:", baseURL);

    return axios.create({
      baseURL: baseURL,
      timeout: axiosConfig.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    let loadingCount = 0;
    let loadingInstance: { close: () => void } | null = null;

    // 显示加载状态
    const showLoading = () => {
      if (this.config.showLoading && loadingCount === 0) {
        // 这里可以替换为实际的loading组件
        loadingInstance = { close: () => {} };
        console.log(this.config.loadingText);
      }
      loadingCount++;
    };

    // 隐藏加载状态
    const hideLoading = () => {
      loadingCount--;
      if (loadingCount <= 0 && this.config.showLoading) {
        loadingInstance?.close();
        loadingInstance = null;
        loadingCount = 0;
      }
    };

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加Token
        if (this.config.withToken) {
          const token = this.getToken(); // 需要实现获取token的逻辑
          if (token) {
            config.headers = config.headers || {};
            config.headers[this.config.tokenKey!] = `${this.config.tokenPrefix} ${token}`;
          }
        }

        // 重复提交检查
        if (this.config.preventRepeatSubmit && config.method?.toLowerCase() !== "get") {
          if (this.repeatChecker.isRepeating(config)) {
            const error = new Error("请勿重复提交") as RequestError;
            error.code = -1;
            error.isAxiosError = true;
            return Promise.reject(error);
          }
          this.repeatChecker.add(config);
        }

        // 显示加载
        showLoading();
        return config;
      },
      (error) => {
        hideLoading();
        const formattedError = this.formatError(error);
        return Promise.reject(formattedError);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        // 清理重复提交检查
        if (this.config.preventRepeatSubmit) {
          this.repeatChecker.remove(response.config);
        }

        // 隐藏加载
        hideLoading();

        // 打印响应信息用于调试
        console.log("响应数据:", response);

        // 处理响应
        if (this.config.transformResponse && !this.config.returnFullResponse) {
          const data = response.data as ApiResponse;
          console.log("处理响应数据:", data);

          if (data.code === 200 || data.code === 0) {
            return data.data;
          } else {
            const error = new Error(
              data.message || (data as unknown as { msg: string }).msg || "请求失败",
            ) as RequestError;
            error.code = data.code;
            error.isAxiosError = false;
            console.error("响应拦截器中抛出错误:", error);
            return Promise.reject(error);
          }
        }

        return this.config.returnFullResponse ? response : response.data;
      },
      (error) => {
        // 清理重复提交检查
        if (this.config.preventRepeatSubmit && error.config) {
          this.repeatChecker.remove(error.config);
        }

        // 隐藏加载
        hideLoading();
        const formattedError = this.formatError(error);
        return Promise.reject(formattedError);
      },
    );
  }

  /**
   * 格式化错误信息
   */
  private formatError = (error: AxiosError): RequestError => {
    console.error("请求错误详情:", error);

    const requestError = new Error(error.message) as RequestError;
    requestError.isAxiosError = true;
    requestError.config = error.config;
    requestError.request = error.request;
    requestError.response = error.response;

    if (error.response) {
      requestError.status = error.response.status;
      requestError.code = (error.response.data as ApiResponse)?.code || error.response.status;

      // 打印详细的响应信息
      console.error("响应状态:", error.response.status);
      console.error("响应数据:", error.response.data);
      console.error("响应头:", error.response.headers);

      // 状态码处理
      switch (error.response.status) {
        case 401:
          requestError.message = "登录已过期，请重新登录";
          // 可以添加自动登出逻辑
          break;
        case 403:
          requestError.message = "没有权限访问该资源";
          break;
        case 404:
          requestError.message = "请求的资源不存在";
          break;
        case 500:
          requestError.message = "服务器内部错误";
          break;
        default:
          // 尝试从响应数据中获取错误信息
          const responseData = error.response.data as ApiResponse;
          if (responseData && responseData.message) {
            requestError.message = responseData.message;
          } else if (responseData && (responseData as unknown as { msg: string }).msg) {
            requestError.message = (responseData as unknown as { msg: string }).msg;
          } else {
            requestError.message = `请求失败 (${error.response.status})`;
          }
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      requestError.message = "网络连接失败，请检查网络";
      requestError.code = -100;
      console.error("请求对象:", error.request);
    } else {
      // 请求配置出错
      requestError.message = "请求配置错误: " + (error.message || "未知配置错误");
      requestError.code = -101;
      console.error("错误配置:", error.config);
    }

    console.error("格式化后的错误:", requestError);
    return requestError;
  };

  /**
   * 获取Token（需要根据实际项目实现）
   */
  private getToken(): string | null {
    // 示例：从localStorage获取
    return localStorage.getItem("token") || null;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(config: RequestMethodConfig): string {
    const { method = "GET", url, params, data } = config;
    let key = `${method}:${url}`;

    if (params) key += `:params:${JSON.stringify(params)}`;
    if (data && method !== "GET") key += `:data:${JSON.stringify(data)}`;

    return key;
  }

  // ============================ 请求方法 ============================
  /**
   * 通用请求方法
   */
  async request<T = unknown>(config: RequestMethodConfig): Promise<T> {
    console.log("发起请求:", config);

    const finalConfig: RequestMethodConfig = { ...this.config, ...config };
    console.log("最终配置:", finalConfig);

    // 检查基本配置
    if (!finalConfig.url) {
      throw new Error("请求URL不能为空");
    }

    // 缓存处理
    if (finalConfig.cache && finalConfig.method?.toUpperCase() === "GET") {
      const cacheKey = this.generateCacheKey(finalConfig);
      const cachedData = memoryCache.get(cacheKey);

      if (cachedData !== null) {
        console.log("从缓存中获取数据:", cachedData);
        return cachedData as T;
      }
    }

    try {
      // 构建axios请求配置，排除自定义属性
      const axiosRequestConfig: AxiosRequestConfig = {
        method: finalConfig.method || "GET",
        url: finalConfig.url,
        data: finalConfig.data,
        params: finalConfig.params,
        headers: finalConfig.headers,
        timeout: finalConfig.timeout,
        responseType: finalConfig.responseType,
        onUploadProgress: finalConfig.onUploadProgress,
        onDownloadProgress: finalConfig.onDownloadProgress,
      };

      console.log("Axios请求配置:", axiosRequestConfig);

      const response = await this.instance.request(axiosRequestConfig);

      console.log("请求成功，响应:", response);

      // 缓存结果
      if (finalConfig.cache && finalConfig.method?.toUpperCase() === "GET") {
        const cacheKey = this.generateCacheKey(finalConfig);
        memoryCache.set(cacheKey, response.data, finalConfig.cacheTime);
      }

      // 根据配置决定返回什么数据
      if (finalConfig.transformResponse && !finalConfig.returnFullResponse) {
        // 如果需要转换响应且不返回完整响应，则返回response.data
        return response.data as T;
      } else if (finalConfig.returnFullResponse) {
        // 如果需要返回完整响应，则返回整个response对象
        return response as T;
      } else {
        // 默认情况返回response.data
        return response.data as T;
      }
    } catch (error) {
      console.error("请求失败:", error);
      // 检查是否是取消请求的错误
      if (axios.isCancel(error)) {
        console.log("请求被取消:", error.message);
        throw new Error("请求被取消");
      }

      const formattedError = this.formatError(error as AxiosError);
      throw formattedError;
    }
  }

  /**
   * GET请求
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: Partial<BaseRequestConfig> & AxiosRequestConfig,
  ): Promise<T> {
    console.log("发起GET请求:", { url, params, config });

    // 从配置中排除我们的自定义属性，因为它们不是axios的配置项
    const {
      withToken: _withToken,
      tokenPrefix: _tokenPrefix,
      tokenKey: _tokenKey,
      showErrorMessage: _showErrorMessage,
      showSuccessMessage: _showSuccessMessage,
      showLoading: _showLoading,
      loadingText: _loadingText,
      preventRepeatSubmit: _preventRepeatSubmit,
      repeatSubmitDelay: _repeatSubmitDelay,
      cache: _cache,
      cacheTime: _cacheTime,
      transformResponse: _transformResponse,
      returnFullResponse: _returnFullResponse,
      retry: _retry,
      retryDelay: _retryDelay,
      ...axiosConfig
    } = config || {};

    try {
      const response = await this.instance.get(url, { params, ...axiosConfig });
      console.log("GET请求成功，响应:", response);
      return response.data as T;
    } catch (error) {
      console.error("GET请求失败:", error);
      const formattedError = this.formatError(error as AxiosError);
      throw formattedError;
    }
  }
  /**
   * POST请求
   */
  post<T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  /**
   * PUT请求
   */
  put<T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  /**
   * DELETE请求
   */
  delete<T = unknown>(url: string, params?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url, params });
  }

  /**
   * PATCH请求
   */
  patch<T = unknown>(url: string, data?: unknown, config?: Partial<RequestMethodConfig>): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  /**
   * 文件上传
   */
  upload<T = unknown>(url: string, file: File | FormData, config?: UploadConfig): Promise<T> {
    let formData: FormData;

    if (file instanceof FormData) {
      formData = file;
    } else {
      // 文件大小检查
      if (config?.maxSize && file.size > config.maxSize) {
        throw new Error(`文件大小超过限制: ${(config.maxSize / 1024 / 1024).toFixed(2)}MB`);
      }

      // 文件类型检查
      if (config?.accept) {
        const acceptTypes = config.accept.split(",").map((t) => t.trim());
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const fileType = file.type;

        const isValid = acceptTypes.some((accept) => {
          if (accept.startsWith(".")) return accept.toLowerCase() === `.${fileExt}`;
          return fileType.includes(accept.replace("*", ""));
        });

        if (!isValid) {
          throw new Error(`不支持的文件类型，支持: ${config.accept}`);
        }
      }

      formData = new FormData();
      formData.append("file", file);
    }

    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: config?.onProgress,
    });
  }

  /**
   * 文件下载
   */
  async download(url: string, filename?: string, config?: DownloadConfig): Promise<void> {
    const response = await this.request<Blob>({
      ...config,
      method: "GET",
      url,
      responseType: "blob",
      onDownloadProgress: config?.onProgress,
    });

    // 创建下载链接
    const blobUrl = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename || this.getFilenameFromUrl(url);
    document.body.appendChild(link);
    link.click();

    // 清理资源
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  }

  /**
   * 从URL提取文件名
   */
  private getFilenameFromUrl(url: string): string {
    try {
      // 使用环境变量中的baseURL或者配置中的baseURL
      const baseURL = import.meta.env.VITE_API_BASE_URL || this.config.baseURL || "";
      const fullURL = baseURL ? new URL(url, baseURL).pathname : url;
      return fullURL.split("/").pop() || "download";
    } catch {
      return "download";
    }
  }

  /**
   * 并发请求
   */
  concurrent<T = unknown>(requests: RequestMethodConfig[]): Promise<T[]> {
    return Promise.all(requests.map((config) => this.request<T>(config)));
  }

  /**
   * 串行队列请求
   */
  async queue<T = unknown>(requests: RequestMethodConfig[], concurrency: number = 3): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const [index, config] of requests.entries()) {
      const promise = this.request<T>(config).then((result) => {
        results[index] = result;
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        const completedIndex = executing.findIndex((p) => p === promise);
        if (completedIndex !== -1) executing.splice(completedIndex, 1);
      }
    }

    await Promise.all(executing);
    return results;
  }
}

// ============================ 实例创建 ============================
/**
 * 创建请求实例
 */
export function createRequest(config?: Partial<BaseRequestConfig>): RequestManager {
  return new RequestManager(config);
}

// 默认请求实例
export const request = createRequest();
// 添加默认导出
