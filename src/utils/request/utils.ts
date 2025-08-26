import type { AxiosRequestConfig } from 'axios';
import type { RequestMethodConfig } from './types';

/**
 * 生成请求缓存键
 * @param config 请求配置
 * @returns 缓存键
 */
export function generateCacheKey(config: RequestMethodConfig): string {
  const { method = 'GET', url, params, data } = config;
  const key = `${method}:${url}`;
  
  if (method === 'GET' && params) {
    const searchParams = new URLSearchParams(params).toString();
    return `${key}?${searchParams}`;
  }
  
  if (data && typeof data === 'object') {
    const dataString = JSON.stringify(data);
    return `${key}:${btoa(dataString)}`;
  }
  
  return key;
}

/**
 * 内存缓存管理
 */
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    const expires = Date.now() + ttl;
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

/**
 * 存储缓存管理
 */
export class StorageCache {
  private storage: Storage;
  private prefix: string;

  constructor(type: 'session' | 'local' = 'session', prefix: string = 'request_cache_') {
    this.storage = type === 'session' ? sessionStorage : localStorage;
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    try {
      const expires = Date.now() + ttl;
      const item = { data, expires };
      this.storage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  get(key: string): any | null {
    try {
      const itemStr = this.storage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expires) {
        this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    try {
      this.storage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('Failed to delete cache:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(this.storage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

export const sessionCache = new StorageCache('session');
export const localCache = new StorageCache('local');

/**
 * 重复提交检查管理
 */
class RepeatSubmitChecker {
  private pendingRequests = new Set<string>();

  generateKey(config: AxiosRequestConfig): string {
    const { method = 'GET', url, data } = config;
    let key = `${method}:${url}`;
    
    if (data && typeof data === 'object') {
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

export const repeatSubmitChecker = new RepeatSubmitChecker();

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 检查是否为空值
 * @param value 要检查的值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}