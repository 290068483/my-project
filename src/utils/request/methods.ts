import type { AxiosInstance, AxiosProgressEvent, AxiosResponse } from 'axios';
import type { 
  RequestMethodConfig, 
  UploadConfig, 
  DownloadConfig, 
  CreateRequestConfig 
} from './types';
import { 
  memoryCache, 
  sessionCache, 
  localCache, 
  generateCacheKey,
  formatFileSize 
} from './utils';
import { mergeConfig } from './config';

/**
 * 请求方法管理器
 */
export class RequestManager {
  private instance: AxiosInstance;
  private config: CreateRequestConfig;

  constructor(instance: AxiosInstance, config: CreateRequestConfig) {
    this.instance = instance;
    this.config = config;
  }

  /**
   * 通用请求方法
   * @param config 请求配置
   * @returns Promise
   */
  async request<T = any>(config: RequestMethodConfig): Promise<T> {
    const finalConfig = mergeConfig(this.config, config);
    
    // 缓存处理
    if (finalConfig.cache && finalConfig.method?.toUpperCase() === 'GET') {
      const cacheKey = generateCacheKey(finalConfig);
      const cached = this.getFromCache(cacheKey, finalConfig.cache);
      
      if (cached !== null) {
        console.log('📦 Cache hit:', cacheKey);
        return cached;
      }
    }

    try {
      const response = await this.instance.request({
        method: finalConfig.method || 'GET',
        url: finalConfig.url,
        data: finalConfig.data,
        params: finalConfig.params,
        headers: finalConfig.headers,
        timeout: finalConfig.timeout,
        responseType: finalConfig.responseType,
        onUploadProgress: finalConfig.onUploadProgress,
        onDownloadProgress: finalConfig.onDownloadProgress,
      });

      // 缓存成功响应
      if (finalConfig.cache && finalConfig.method?.toUpperCase() === 'GET') {
        const cacheKey = generateCacheKey(finalConfig);
        this.setToCache(cacheKey, response, finalConfig.cache, finalConfig.cacheTime);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置选项
   * @returns Promise
   */
  async get<T = any>(
    url: string, 
    params?: any, 
    config?: Partial<RequestMethodConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns Promise
   */
  async post<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestMethodConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns Promise
   */
  async put<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestMethodConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置选项
   * @returns Promise
   */
  async delete<T = any>(
    url: string, 
    params?: any, 
    config?: Partial<RequestMethodConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params,
      ...config,
    });
  }

  /**
   * PATCH请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns Promise
   */
  async patch<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestMethodConfig>
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param file 文件或FormData
   * @param config 上传配置
   * @returns Promise
   */
  async upload<T = any>(
    url: string, 
    file: File | FormData, 
    config?: UploadConfig
  ): Promise<T> {
    let formData: FormData;

    if (file instanceof FormData) {
      formData = file;
    } else {
      // 文件大小检查
      if (config?.maxSize && file.size > config.maxSize) {
        throw new Error(`文件大小超过限制 (${formatFileSize(config.maxSize)})`);
      }

      // 文件类型检查
      if (config?.accept) {
        const acceptTypes = config.accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileName = file.name;
        const fileExt = fileName.substring(fileName.lastIndexOf('.'));

        const isValidType = acceptTypes.some(accept => {
          if (accept.startsWith('.')) {
            return fileExt.toLowerCase() === accept.toLowerCase();
          } else {
            return fileType.match(accept.replace('*', '.*'));
          }
        });

        if (!isValidType) {
          throw new Error(`不支持的文件类型。支持的类型: ${config.accept}`);
        }
      }

      formData = new FormData();
      formData.append('file', file);
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: config?.onProgress,
      ...config,
    });
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param filename 文件名
   * @param config 下载配置
   * @returns Promise
   */
  async download(
    url: string, 
    filename?: string, 
    config?: DownloadConfig
  ): Promise<void> {
    const response = await this.request<Blob>({
      method: 'GET',
      url,
      responseType: 'blob',
      onDownloadProgress: config?.onProgress,
      ...config,
    });

    // 创建下载链接
    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = downloadUrl;
    link.download = filename || this.getFilenameFromUrl(url) || 'download';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * 并发请求
   * @param requests 请求配置数组
   * @returns Promise
   */
  async concurrent<T = any>(requests: RequestMethodConfig[]): Promise<T[]> {
    const promises = requests.map(config => this.request<T>(config));
    return Promise.all(promises);
  }

  /**
   * 串行队列请求
   * @param requests 请求配置数组
   * @param concurrency 并发数
   * @returns Promise
   */
  async queue<T = any>(
    requests: RequestMethodConfig[], 
    concurrency: number = 1
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const [index, config] of requests.entries()) {
      const promise = this.request<T>(config).then(result => {
        results[index] = result;
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        const completedIndex = executing.findIndex(p => 
          p === promise || (p as any).resolved
        );
        if (completedIndex !== -1) {
          executing.splice(completedIndex, 1);
        }
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * 从缓存获取数据
   * @param key 缓存键
   * @param cacheType 缓存类型
   * @returns 缓存数据或null
   */
  private getFromCache(key: string, cacheType: boolean | string): any | null {
    switch (cacheType) {
      case 'memory':
        return memoryCache.get(key);
      case 'session':
        return sessionCache.get(key);
      case 'local':
        return localCache.get(key);
      default:
        return memoryCache.get(key);
    }
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 缓存数据
   * @param cacheType 缓存类型
   * @param ttl 过期时间
   */
  private setToCache(
    key: string, 
    data: any, 
    cacheType: boolean | string, 
    ttl: number = 5 * 60 * 1000
  ): void {
    switch (cacheType) {
      case 'memory':
        memoryCache.set(key, data, ttl);
        break;
      case 'session':
        sessionCache.set(key, data, ttl);
        break;
      case 'local':
        localCache.set(key, data, ttl);
        break;
      default:
        memoryCache.set(key, data, ttl);
    }
  }

  /**
   * 从URL提取文件名
   * @param url URL地址
   * @returns 文件名
   */
  private getFilenameFromUrl(url: string): string | null {
    try {
      const pathname = new URL(url).pathname;
      return pathname.substring(pathname.lastIndexOf('/') + 1);
    } catch {
      return null;
    }
  }
}