/**
 * 通用API响应格式
 */
export interface ApiResponse<T = unknown> {
  code: number; // 状态码
  message: string; // 响应消息
  msg: string; // 响应消息（RuoYi兼容格式）
  data?: T; // 响应数据
  success: boolean; // 是否成功
  timestamp?: number; // 时间戳
}

/**
 * 分页响应数据格式
 */
export interface PageResponse<T = unknown> {
  list: T[]; // 数据列表
  rows: T[]; // 数据列表（RuoYi兼容格式）
  total: number; // 总数
  page: number; // 当前页码
  pageSize: number; // 每页大小
}

/**
 * 请求配置接口
 */
export interface RequestConfig {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  data?: unknown;
  params?: unknown;
  headers?: {
    isToken?: boolean;
    repeatSubmit?: boolean;
    [key: string]: unknown;
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
