/**
 * 系统部门管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 部门数据类型定义 ====================

/**
 * 系统部门接口
 */
export interface SystemDept {
  /** 部门id */
  deptId?: number;
  /** 父部门id */
  parentId?: number;
  /** 祖级列表 */
  ancestors?: string;
  /** 部门名称 */
  deptName: string;
  /** 显示顺序 */
  orderNum?: number;
  /** 负责人 */
  leader?: string;
  /** 联系电话 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 部门状态 */
  status: string;
  /** 删除标志 */
  delFlag?: string;
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
  /** 父部门名称 */
  parentName?: string;
  /** 子部门 */
  children?: SystemDept[];
  /** 是否有子部门 */
  hasChildren?: boolean;
}

/**
 * 部门查询参数
 */
export interface DeptQueryParams {
  /** 部门名称 */
  deptName?: string;
  /** 部门状态 */
  status?: string;
  /** 父部门ID */
  parentId?: number;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 部门新增/编辑表单
 */
export interface DeptForm {
  /** 部门ID */
  deptId?: number;
  /** 父部门ID */
  parentId?: number;
  /** 部门名称 */
  deptName: string;
  /** 显示顺序 */
  orderNum?: number;
  /** 负责人 */
  leader?: string;
  /** 联系电话 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 部门状态 */
  status: string;
  /** 备注 */
  remark?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 部门列表响应
 */
export interface DeptListResponse extends ApiResponse<PageResponse<SystemDept[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 部门详情响应
 */
export interface DeptDetailResponse extends ApiResponse<SystemDept> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

/**
 * 部门树响应
 */
export interface DeptTreeResponse extends ApiResponse<SystemDept[]> {
  // RuoYi标准树选择响应格式
  code: number;
  msg: string;
}

// ==================== 权限相关类型定义 ====================

/**
 * 部门权限接口
 */
export interface DeptAuthResponse
  extends ApiResponse<{
    dept: SystemDept;
    permissions: string[];
  }> {
  // 权限相关响应格式
  code: number;
  msg: string;
}

// ==================== 导出类型定义 ====================

// 重新导出部门接口
export type {
  SystemDept,
  DeptQueryParams,
  DeptForm,
  DeptListResponse,
  DeptDetailResponse,
  DeptTreeResponse,
  DeptAuthResponse,
} from "./dept";
