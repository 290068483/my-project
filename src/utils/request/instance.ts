import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse,
  type AxiosError 
} from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import type { ElLoadingService } from 'element-plus/es/components/loading/src/service';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import type { CreateRequestConfig, RequestError } from './types';
import { repeatSubmitChecker, delay } from './utils';

/**
 * 创建axios实例
 * @param config 配置对象
 * @returns axios实例
 */
export function createAxiosInstance(config: CreateRequestConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 全局Loading实例
  let loadingInstance: ElLoadingService | null = null;
  let loadingCount = 0;

  // 显示Loading
  const showLoading = (text: string = '加载中...') => {
    if (loadingCount === 0) {
      loadingInstance = ElLoading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }
    loadingCount++;
  };

  // 隐藏Loading
  const hideLoading = () => {
    loadingCount--;
    if (loadingCount <= 0) {
      loadingCount = 0;
      if (loadingInstance) {
        loadingInstance.close();
        loadingInstance = null;
      }
    }
  };

  // 请求拦截器
  instance.interceptors.request.use(
    (requestConfig) => {
      // 添加认证Token
      if (config.withToken) {
        const userStore = useUserStore();
        if (userStore.token) {
          requestConfig.headers = requestConfig.headers || {};
          requestConfig.headers['Authorization'] = `${config.tokenPrefix} ${userStore.token}`;
        }
      }

      // 重复提交检查
      if (config.preventRepeatSubmit && requestConfig.method?.toLowerCase() !== 'get') {
        if (repeatSubmitChecker.isRepeating(requestConfig)) {
          const error = new Error('请勿重复提交') as RequestError;
          error.code = -1;
          return Promise.reject(error);
        }
        repeatSubmitChecker.add(requestConfig);
      }

      // 显示Loading
      if (config.showLoading) {
        showLoading(config.loadingText);
      }

      // 请求日志
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Request:', {
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          data: requestConfig.data,
          params: requestConfig.params,
        });
      }

      return requestConfig;
    },
    (error) => {
      hideLoading();
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 移除重复提交检查
      if (config.preventRepeatSubmit) {
        repeatSubmitChecker.remove(response.config);
      }

      // 隐藏Loading
      if (config.showLoading) {
        hideLoading();
      }

      // 响应日志
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Response:', {
          status: response.status,
          data: response.data,
          config: {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
          },
        });
      }

      const { data } = response;

      // 统一响应格式处理
      if (config.transformResponse) {
        // 根据项目的API响应格式进行处理
        if (data && typeof data === 'object') {
          if (data.code === 200 || data.code === 0) {
            // 成功响应
            if (config.showSuccessMessage && data.message) {
              ElMessage.success(data.message);
            }
            return config.returnFullResponse ? response : data.data;
          } else {
            // 业务错误
            const errorMessage = data.message || '请求失败';
            if (config.showErrorMessage) {
              ElMessage.error(errorMessage);
            }
            const error = new Error(errorMessage) as RequestError;
            error.code = data.code;
            error.response = response;
            return Promise.reject(error);
          }
        }
      }

      // 返回原始响应或处理后的数据
      return config.returnFullResponse ? response : data;
    },
    async (error: AxiosError) => {
      // 移除重复提交检查
      if (config.preventRepeatSubmit && error.config) {
        repeatSubmitChecker.remove(error.config);
      }

      // 隐藏Loading
      if (config.showLoading) {
        hideLoading();
      }

      // 错误日志
      console.error('❌ Response Error:', {
        status: error.response?.status,
        message: error.message,
        config: {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
        },
      });

      // 处理网络错误
      if (!error.response) {
        const networkError = new Error('网络错误，请检查网络连接') as RequestError;
        networkError.isAxiosError = true;
        networkError.config = error.config;
        
        if (config.showErrorMessage) {
          ElMessage.error('网络错误，请检查网络连接');
        }
        
        return Promise.reject(networkError);
      }

      // 处理HTTP状态码错误
      const { status, data } = error.response;
      const userStore = useUserStore();

      let errorMessage = '请求失败';
      let shouldShowMessage = config.showErrorMessage;

      switch (status) {
        case 401:
          errorMessage = data?.message || '登录已过期，请重新登录';
          userStore.logout();
          router.push('/login');
          break;
        case 403:
          errorMessage = data?.message || '权限不足，无法访问该资源';
          break;
        case 404:
          errorMessage = data?.message || '请求的资源不存在';
          break;
        case 422:
          errorMessage = data?.message || '参数验证失败';
          break;
        case 429:
          errorMessage = data?.message || '请求过于频繁，请稍后再试';
          break;
        case 500:
          errorMessage = data?.message || '服务器内部错误，请联系管理员';
          break;
        case 502:
          errorMessage = '网关错误，请稍后再试';
          break;
        case 503:
          errorMessage = '服务暂时不可用，请稍后再试';
          break;
        case 504:
          errorMessage = '网关超时，请稍后再试';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }

      if (shouldShowMessage) {
        ElMessage.error(errorMessage);
      }

      // 创建标准化错误对象
      const requestError = new Error(errorMessage) as RequestError;
      requestError.code = data?.code || status;
      requestError.status = status;
      requestError.response = error.response;
      requestError.request = error.request;
      requestError.config = error.config;
      requestError.isAxiosError = true;

      // 重试逻辑
      const retryCount = (error.config as any).__retryCount || 0;
      if (config.retry && retryCount < config.retry) {
        (error.config as any).__retryCount = retryCount + 1;
        
        // 只对特定错误进行重试
        const retryableStatuses = [408, 429, 500, 502, 503, 504];
        if (retryableStatuses.includes(status)) {
          console.log(`🔄 Retrying request (${retryCount + 1}/${config.retry}):`, error.config?.url);
          await delay(config.retryDelay || 1000);
          return instance.request(error.config!);
        }
      }

      return Promise.reject(requestError);
    }
  );

  return instance;
}

/**
 * 获取错误信息
 * @param error 错误对象
 * @returns 错误信息
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '未知错误';
}