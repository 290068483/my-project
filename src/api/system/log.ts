/**
 * 系统日志管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
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

// ==================== 操作日志管理接口 ====================

/**
 * 分页查询操作日志列表
 * @param params 查询参数
 */
export function listOperLog(params?: OperLogQueryParams): Promise<OperLogListResponse> {
  return request.get("/monitor/operlog/list", { params });
}

/**
 * 查询操作日志详细信息
 * @param operId 操作日志ID
 */
export function getOperLog(operId: number): Promise<ApiResponse<OperLog>> {
  return request.get(`/monitor/operlog/${operId}`);
}

/**
 * 删除操作日志
 * @param operIds 操作日志ID列表
 */
export function delOperLog(operIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(operIds) ? operIds.join(",") : operIds;
  return request.delete(`/monitor/operlog/${ids}`);
}

/**
 * 清空操作日志
 */
export function cleanOperLog(): Promise<ApiResponse> {
  return request.delete("/monitor/operlog/clean");
}

/**
 * 导出操作日志数据
 * @param params 查询参数
 */
export function exportOperLog(params?: OperLogQueryParams): Promise<void> {
  const filename = `操作日志_${new Date().getTime()}.xlsx`;
  return request.download("/monitor/operlog/export", filename, { params });
}

// ==================== 登录日志管理接口 ====================

/**
 * 分页查询登录日志列表
 * @param params 查询参数
 */
export function listLoginInfo(params?: LoginInfoQueryParams): Promise<LoginInfoListResponse> {
  return request.get("/monitor/logininfor/list", { params });
}

/**
 * 查询登录日志详细信息
 * @param infoId 登录日志ID
 */
export function getLoginInfo(infoId: number): Promise<ApiResponse<LoginInfo>> {
  return request.get(`/monitor/logininfor/${infoId}`);
}

/**
 * 删除登录日志
 * @param infoIds 登录日志ID列表
 */
export function delLoginInfo(infoIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(infoIds) ? infoIds.join(",") : infoIds;
  return request.delete(`/monitor/logininfor/${ids}`);
}

/**
 * 清空登录日志
 */
export function cleanLoginInfo(): Promise<ApiResponse> {
  return request.delete("/monitor/logininfor/clean");
}

/**
 * 解锁用户登录状态
 * @param userName 用户名
 */
export function unlockLoginInfo(userName: string): Promise<ApiResponse> {
  return request.get(`/monitor/logininfor/unlock/${userName}`);
}

/**
 * 导出登录日志数据
 * @param params 查询参数
 */
export function exportLoginInfo(params?: LoginInfoQueryParams): Promise<void> {
  const filename = `登录日志_${new Date().getTime()}.xlsx`;
  return request.download("/monitor/logininfor/export", filename, { params });
}
