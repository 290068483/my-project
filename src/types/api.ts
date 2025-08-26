/**
 * 通用API响应格式
 */
export interface ApiResponse<T = any> {
  code: number; // 状态码
  message: string; // 响应消息
  data?: T; // 响应数据
  success: boolean; // 是否成功
  timestamp?: number; // 时间戳
}

/**
 * 分页响应数据格式
 */
export interface PageResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 请求配置接口
 */
export interface RequestConfig {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  headers?: {
    isToken?: boolean;
    repeatSubmit?: boolean;
    [key: string]: any;
  };
  timeout?: number;
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  code: number;
  message: string;
  details?: string;
}