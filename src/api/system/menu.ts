/**
 * 系统菜单管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
import type {
  MenuQueryParams,
  MenuForm,
  MenuListResponse,
  MenuDetailResponse,
  MenuTreeSelectResponse,
  RoleMenuTreeSelectResponse,
  MenuAuthResponse,
} from "@/types/system/menu";
import type { ApiResponse } from "@/types/api";

// ==================== 基本菜单管理接口 ====================

/**
 * 查询菜单列表
 * @param params 查询参数
 */
export function listMenu(params?: MenuQueryParams): Promise<MenuListResponse> {
  return request.get("/system/menu/list", { params });
}

/**
 * 查询菜单详细信息
 * @param menuId 菜单ID
 */
export function getMenu(menuId: number): Promise<MenuDetailResponse> {
  return request.get(`/system/menu/${menuId}`);
}

/**
 * 新增菜单
 * @param data 菜单信息
 */
export function addMenu(data: MenuForm): Promise<ApiResponse> {
  return request.post("/system/menu", data);
}

/**
 * 修改菜单
 * @param data 菜单信息
 */
export function updateMenu(data: MenuForm): Promise<ApiResponse> {
  return request.put("/system/menu", data);
}

/**
 * 删除菜单
 * @param menuId 菜单ID
 */
export function delMenu(menuId: number): Promise<ApiResponse> {
  return request.delete(`/system/menu/${menuId}`);
}

// ==================== 权限相关接口 ====================

/**
 * 获取菜单权限信息
 * @param menuId 菜单ID
 */
export function getMenuAuth(menuId: number): Promise<MenuAuthResponse> {
  return request.get(`/system/menu/auth/${menuId}`);
}

/**
 * 更新菜单权限
 * @param data 权限数据
 */
export function updateMenuAuth(data: { menuId: number; roleIds: number[] }): Promise<ApiResponse> {
  return request.put("/system/menu/auth", data);
}

// ==================== 菜单树形选择接口 ====================

/**
 * 查询菜单下拉树列表
 */
export function getMenuTreeSelect(): Promise<MenuTreeSelectResponse> {
  return request.get("/system/menu/treeselect");
}

/**
 * 加载对应角色菜单列表树
 * @param roleId 角色ID
 */
export function getRoleMenuTreeSelect(roleId: number): Promise<RoleMenuTreeSelectResponse> {
  return request.get(`/system/menu/roleMenuTreeselect/${roleId}`);
}

// ==================== 路由接口 ====================

/**
 * 获取路由信息（用于动态路由生成）
 */
export function getMenuRouters(): Promise<ApiResponse> {
  return request.get("/system/menu/getRouters");
}
