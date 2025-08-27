/**
 * 系统日志管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 日志数据类型定义 ====================

/**
 * 操作日志接口
 */
export interface OperLog {
  /** 日志主键 */
  operId?: number;
  /** 模块标题 */
  title?: string;
  /** 业务类型 */
  businessType?: number;
  /** 方法名称 */
  method?: string;
  /** 请求方式 */
  requestMethod?: string;
  /** 操作类别 */
  operatorType?: number;
  /** 操作人员 */
  operName?: string;
  /** 部门名称 */
  deptName?: string;
  /** 请求URL */
  operUrl?: string;
  /** 主机地址 */
  operIp?: string;
  /** 操作地点 */
  operLocation?: string;
  /** 请求参数 */
  operParam?: string;
  /** 返回参数 */
  jsonResult?: string;
  /** 操作状态 */
  status?: number;
  /** 错误消息 */
  errorMsg?: string;
  /** 操作时间 */
  operTime?: string;
  /** 消耗时间 */
  costTime?: number;
}

/**
 * 登录日志接口
 */
export interface LoginInfo {
  /** 访问ID */
  infoId?: number;
  /** 用户账号 */
  userName?: string;
  /** 登录IP地址 */
  ipaddr?: string;
  /** 登录地点 */
  loginLocation?: string;
  /** 浏览器类型 */
  browser?: string;
  /** 操作系统 */
  os?: string;
  /** 登录状态 */
  status?: string;
  /** 提示消息 */
  msg?: string;
  /** 访问时间 */
  loginTime?: string;
}

/**
 * 操作日志查询参数
 */
export interface OperLogQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 系统模块 */
  title?: string;
  /** 操作人员 */
  operName?: string;
  /** 业务类型 */
  businessType?: number;
  /** 操作状态 */
  status?: number;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 登录日志查询参数
 */
export interface LoginInfoQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 用户账号 */
  userName?: string;
  /** 登录IP地址 */
  ipaddr?: string;
  /** 登录状态 */
  status?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 操作日志列表响应
 */
export interface OperLogListResponse extends ApiResponse<PageResponse<OperLog[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 登录日志列表响应
 */
export interface LoginInfoListResponse extends ApiResponse<PageResponse<LoginInfo[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}
