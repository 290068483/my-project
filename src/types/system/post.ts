/**
 * 系统岗位管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 岗位数据类型定义 ====================

/**
 * 系统岗位接口
 */
export interface SystemPost {
  /** 岗位ID */
  postId?: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 显示顺序 */
  postSort: number;
  /** 状态 */
  status: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 备注 */
  remark?: string;
}

/**
 * 岗位查询参数
 */
export interface PostQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 岗位编码 */
  postCode?: string;
  /** 岗位名称 */
  postName?: string;
  /** 岗位状态 */
  status?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 岗位表单数据
 */
export interface PostForm {
  /** 岗位ID */
  postId?: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 显示顺序 */
  postSort: number;
  /** 状态 */
  status: string;
  /** 备注 */
  remark?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 岗位列表响应
 */
export interface PostListResponse extends ApiResponse<PageResponse<SystemPost[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 岗位详情响应
 */
export interface PostDetailResponse extends ApiResponse<SystemPost> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

/**
 * 岗位选择框响应
 */
export interface PostOptionResponse extends ApiResponse<SystemPost[]> {
  // RuoYi标准选择框响应格式
  code: number;
  msg: string;
}

// ==================== 权限相关类型定义 ====================

/**
 * 岗位权限接口
 */
export interface PostAuthResponse extends ApiResponse<{
  post: SystemPost;
  permissions: string[];
}> {
  // 权限相关响应格式
  code: number;
  msg: string;
}

// ==================== 导出类型定义 ====================

// 重新导出岗位接口
export type {
  SystemPost,
  PostQueryParams,
  PostForm,
  PostListResponse,
  PostDetailResponse,
  PostOptionResponse,
  PostAuthResponse,
} from "./post";