/**
 * 系统角色管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 角色数据类型定义 ====================

/**
 * 系统角色接口
 */
export interface SystemRole {
  /** 角色ID */
  roleId?: number;
  /** 角色名称 */
  roleName: string;
  /** 角色权限字符 */
  roleKey: string;
  /** 显示顺序 */
  roleSort: number;
  /** 数据权限范围 */
  dataScope?: string;
  /** 菜单树选择项是否关联显示 */
  menuCheckStrictly?: boolean;
  /** 部门树选择项是否关联显示 */
  deptCheckStrictly?: boolean;
  /** 角色状态 */
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
  /** 菜单组 */
  menuIds?: number[];
  /** 部门组 */
  deptIds?: number[];
}

/**
 * 角色查询参数
 */
export interface RoleQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 角色名称 */
  roleName?: string;
  /** 权限字符 */
  roleKey?: string;
  /** 角色状态 */
  status?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 角色表单数据
 */
export interface RoleForm {
  /** 角色ID */
  roleId?: number;
  /** 角色名称 */
  roleName: string;
  /** 角色权限字符 */
  roleKey: string;
  /** 显示顺序 */
  roleSort: number;
  /** 数据权限范围 */
  dataScope?: string;
  /** 角色状态 */
  status: string;
  /** 备注 */
  remark?: string;
  /** 菜单权限 */
  menuIds?: number[];
  /** 部门权限 */
  deptIds?: number[];
}

// ==================== 响应类型定义 ====================

/**
 * 角色列表响应
 */
export interface RoleListResponse extends ApiResponse<PageResponse<SystemRole[]>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 角色详情响应
 */
export interface RoleDetailResponse extends ApiResponse<SystemRole> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

/**
 * 角色选择框响应
 */
export interface RoleOptionResponse extends ApiResponse<SystemRole[]> {
  // RuoYi标准选择框响应格式
  code: number;
  msg: string;
}

// ==================== 权限相关类型定义 ====================

/**
 * 角色权限接口
 */
export interface RoleAuthResponse
  extends ApiResponse<{
    role: SystemRole;
    permissions: string[];
  }> {
  // 权限相关响应格式
  code: number;
  msg: string;
}

/**
 * 角色菜单树选择响应
 */
export interface RoleMenuTreeSelectResponse
  extends ApiResponse<{
    checkedKeys: number[];
    menus: Array<{
      id: number;
      label: string;
      children?: Array<Record<string, unknown>>;
    }>;
  }> {
  code: number;
  msg: string;
}

/**
 * 角色部门树选择响应
 */
export interface RoleDeptTreeSelectResponse
  extends ApiResponse<{
    checkedKeys: number[];
    depts: Array<{
      id: number;
      label: string;
      children?: Array<Record<string, unknown>>;
    }>;
  }> {
  code: number;
  msg: string;
}
