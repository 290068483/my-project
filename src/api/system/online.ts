/**
 * 在线用户管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request/index";
import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 在线用户数据类型定义 ====================

/**
 * 在线用户接口
 */
export interface OnlineUser {
  /** 会话编号 */
  tokenId?: string;
  /** 用户名称 */
  userName?: string;
  /** 用户昵称 */
  nickName?: string;
  /** 部门名称 */
  deptName?: string;
  /** 主机 */
  ipaddr?: string;
  /** 登录地点 */
  loginLocation?: string;
  /** 浏览器类型 */
  browser?: string;
  /** 操作系统 */
  os?: string;
  /** 登录时间 */
  loginTime?: string;
  /** 过期时间 */
  expireTime?: string;
  /** 最后访问时间 */
  lastAccessTime?: string;
}

/**
 * 在线用户查询参数
 */
export interface OnlineUserQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 用户名称 */
  userName?: string;
  /** 登录IP地址 */
  ipaddr?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 在线用户列表响应
 */
export interface OnlineUserListResponse extends ApiResponse<PageResponse<OnlineUser[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 在线用户详情响应
 */
export interface OnlineUserDetailResponse extends ApiResponse<OnlineUser> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

// ==================== 在线用户管理接口 ====================

/**
 * 分页查询在线用户列表
 * @param params 查询参数
 */
export function listOnlineUser(params?: OnlineUserQueryParams): Promise<OnlineUserListResponse> {
  return request.get("/monitor/online/list", { params });
}

/**
 * 查询在线用户详细信息
 * @param tokenId 会话编号
 */
export function getOnlineUser(tokenId: string): Promise<OnlineUserDetailResponse> {
  return request.get(`/monitor/online/${tokenId}`);
}

/**
 * 强退用户
 * @param tokenId 会话编号
 */
export function forceLogout(tokenId: string): Promise<ApiResponse> {
  return request.delete(`/monitor/online/${tokenId}`);
}
