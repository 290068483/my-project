/**
 * 系统菜单管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse } from "@/types/api";

// ==================== 菜单数据类型定义 ====================

/**
 * 系统菜单接口
 */
export interface SystemMenu {
  /** 菜单ID */
  menuId?: number;
  /** 菜单名称 */
  menuName: string;
  /** 父菜单ID */
  parentId?: number;
  /** 显示顺序 */
  orderNum: number;
  /** 路由地址 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 路由参数 */
  query?: string;
  /** 是否为外链 */
  isFrame?: string;
  /** 是否缓存 */
  isCache?: string;
  /** 菜单类型 */
  menuType: string;
  /** 菜单状态 */
  visible?: string;
  /** 菜单状态 */
  status?: string;
  /** 权限标识 */
  perms?: string;
  /** 菜单图标 */
  icon?: string;
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
  /** 子菜单 */
  children?: SystemMenu[];
}

/**
 * 菜单查询参数
 */
export interface MenuQueryParams {
  /** 菜单名称 */
  menuName?: string;
  /** 菜单状态 */
  visible?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 菜单表单数据
 */
export interface MenuForm {
  /** 菜单ID */
  menuId?: number;
  /** 父菜单ID */
  parentId?: number;
  /** 菜单名称 */
  menuName: string;
  /** 显示顺序 */
  orderNum: number;
  /** 路由地址 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 路由参数 */
  query?: string;
  /** 是否为外链 */
  isFrame?: string;
  /** 是否缓存 */
  isCache?: string;
  /** 菜单类型 */
  menuType: string;
  /** 显示状态 */
  visible?: string;
  /** 菜单状态 */
  status?: string;
  /** 权限标识 */
  perms?: string;
  /** 菜单图标 */
  icon?: string;
  /** 备注 */
  remark?: string;
  /** 子菜单 */
  children?: SystemMenu[];
}

// ==================== 响应类型定义 ====================

/**
 * 菜单列表响应
 */
export interface MenuListResponse extends ApiResponse<SystemMenu[]> {
  // RuoYi标准列表响应格式
  code: number;
  msg: string;
}

/**
 * 菜单详情响应
 */
export interface MenuDetailResponse extends ApiResponse<SystemMenu> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

/**
 * 菜单树选择响应
 */
export interface MenuTreeSelectResponse extends ApiResponse<SystemMenu[]> {
  // RuoYi标准树选择响应格式
  code: number;
  msg: string;
}

/**
 * 角色菜单树选择响应
 */
export interface RoleMenuTreeSelectResponse
  extends ApiResponse<{
    checkedKeys: number[];
    menus: SystemMenu[];
  }> {
  // RuoYi标准角色菜单树选择响应格式
  code: number;
  msg: string;
}

// ==================== 权限相关类型定义 ====================

/**
 * 菜单权限接口
 */
export interface MenuAuthResponse
  extends ApiResponse<{
    menu: SystemMenu;
    permissions: string[];
  }> {
  // 权限相关响应格式
  code: number;
  msg: string;
}

// ==================== 导出类型定义 ====================

// 重新导出菜单接口
export type {
  SystemMenu,
  MenuQueryParams,
  MenuForm,
  MenuListResponse,
  MenuDetailResponse,
  MenuTreeSelectResponse,
  RoleMenuTreeSelectResponse,
  MenuAuthResponse,
} from "./menu";
