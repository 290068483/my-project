/**
 * 系统角色管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request/index";
import type {
  RoleQueryParams,
  RoleForm,
  RoleListResponse,
  RoleDetailResponse,
  RoleOptionResponse,
  RoleAuthResponse,
  RoleMenuTreeSelectResponse,
  RoleDeptTreeSelectResponse,
} from "@/types/system/role";
import type { ApiResponse } from "@/types/api";

// ==================== 角色管理接口 ====================

/**
 * 分页查询角色列表
 * @param params 查询参数
 */
export function listRole(params?: RoleQueryParams): Promise<RoleListResponse> {
  return request.get("/system/role/list", { params });
}

/**
 * 查询角色详细信息
 * @param roleId 角色ID
 */
export function getRole(roleId: number): Promise<RoleDetailResponse> {
  return request.get(`/system/role/${roleId}`);
}

/**
 * 新增角色
 * @param data 角色信息
 */
export function addRole(data: RoleForm): Promise<ApiResponse> {
  return request.post("/system/role", data);
}

/**
 * 修改角色
 * @param data 角色信息
 */
export function updateRole(data: RoleForm): Promise<ApiResponse> {
  return request.put("/system/role", data);
}

/**
 * 删除角色
 * @param roleIds 角色ID列表
 */
export function delRole(roleIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(roleIds) ? roleIds.join(",") : roleIds;
  return request.delete(`/system/role/${ids}`);
}

// ==================== 权限管理接口 ====================

/**
 * 获取角色权限信息
 * @param roleId 角色ID
 */
export function getRoleAuth(roleId: number): Promise<RoleAuthResponse> {
  return request.get(`/system/role/auth/${roleId}`);
}

/**
 * 更新角色权限
 * @param data 权限数据
 */
export function updateRoleAuth(data: { roleId: number; menuIds: number[] }): Promise<ApiResponse> {
  return request.put("/system/role/auth", data);
}

/**
 * 修改角色状态
 * @param data 状态数据
 */
export function changeRoleStatus(data: { roleId: number; status: string }): Promise<ApiResponse> {
  return request.put("/system/role/changeStatus", data);
}

/**
 * 修改角色数据权限
 * @param data 数据权限数据
 */
export function updateRoleDataScope(data: {
  roleId: number;
  dataScope: string;
  deptIds?: number[];
}): Promise<ApiResponse> {
  return request.put("/system/role/dataScope", data);
}

/**
 * 获取角色菜单树选择
 * @param roleId 角色ID
 */
export function getRoleMenuTreeSelect(roleId: number): Promise<RoleMenuTreeSelectResponse> {
  return request.get(`/system/role/menuTreeselect/${roleId}`);
}

/**
 * 获取角色部门树选择
 * @param roleId 角色ID
 */
export function getRoleDeptTreeSelect(roleId: number): Promise<RoleDeptTreeSelectResponse> {
  return request.get(`/system/role/deptTreeselect/${roleId}`);
}

// ==================== 用户角色授权接口 ====================

/**
 * 取消用户授权角色
 * @param data 取消授权数据
 */
export function cancelAuthUser(data: { userId: number; roleId: number }): Promise<ApiResponse> {
  return request.put("/system/role/authUser/cancel", data);
}

/**
 * 批量取消用户授权角色
 * @param data 批量取消数据
 */
export function cancelAuthUserAll(data: { roleId: number; userIds: string }): Promise<ApiResponse> {
  return request.put("/system/role/authUser/cancelAll", data);
}

/**
 * 批量选择用户授权
 * @param data 批量授权数据
 */
export function selectAuthUserAll(data: { roleId: number; userIds: string }): Promise<ApiResponse> {
  return request.put("/system/role/authUser/selectAll", data);
}

// ==================== 辅助接口 ====================

/**
 * 查询角色选择框列表
 */
export function getRoleOptionSelect(): Promise<RoleOptionResponse> {
  return request.get("/system/role/optionselect");
}

/**
 * 导出角色数据
 * @param params 查询参数
 */
export function exportRole(params?: RoleQueryParams): Promise<void> {
  const filename = `角色列表_${new Date().getTime()}.xlsx`;
  return request.download("/system/role/export", filename, { params });
}
