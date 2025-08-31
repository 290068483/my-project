import request from "@/utils/request";
import type { SystemRole, SystemRoleQueryParams } from "@/types/system/role";

/**
 * 查询角色列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listRole(params?: SystemRoleQueryParams) {
  return request({
    url: "/system/role/list",
    method: "get",
    params,
  });
}

/**
 * 查询角色详细
 * @param roleId 角色ID
 * @returns Promise<any>
 */
export function getRole(roleId: number) {
  return request({
    url: `/system/role/${roleId}`,
    method: "get",
  });
}

/**
 * 新增角色
 * @param data 角色数据
 * @returns Promise<any>
 */
export function addRole(data: SystemRole) {
  return request({
    url: "/system/role",
    method: "post",
    data,
  });
}

/**
 * 修改角色
 * @param data 角色数据
 * @returns Promise<any>
 */
export function updateRole(data: SystemRole) {
  return request({
    url: "/system/role",
    method: "put",
    data,
  });
}

/**
 * 删除角色
 * @param roleIds 角色ID或IDs数组
 * @returns Promise<any>
 */
export function delRole(roleIds: number | number[]) {
  const idsStr = Array.isArray(roleIds) ? roleIds.join(",") : roleIds;
  return request({
    url: `/system/role/${idsStr}`,
    method: "delete",
  });
}

/**
 * 导出角色
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportRole(params?: SystemRoleQueryParams) {
  return request({
    url: "/system/role/export",
    method: "get",
    params,
  });
}

/**
 * 查询角色已授权用户列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function allocatedUserList(params?: any) {
  return request({
    url: "/system/role/authUser/allocatedList",
    method: "get",
    params,
  });
}

/**
 * 查询角色未授权用户列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function unallocatedUserList(params?: any) {
  return request({
    url: "/system/role/authUser/unallocatedList",
    method: "get",
    params,
  });
}

/**
 * 取消用户授权角色
 * @param data 用户ID和角色ID
 * @returns Promise<any>
 */
export function authUserCancel(data: { userId: number; roleId: number }) {
  return request({
    url: "/system/role/authUser/cancel",
    method: "put",
    data,
  });
}

/**
 * 批量取消用户授权角色
 * @param data 用户ID数组和角色ID
 * @returns Promise<any>
 */
export function authUserCancelAll(data: { userIds: number[]; roleId: number }) {
  return request({
    url: "/system/role/authUser/cancelAll",
    method: "put",
    data,
  });
}

/**
 * 授权用户选择
 * @param data 用户ID数组和角色ID
 * @returns Promise<any>
 */
export function authUserSelectAll(data: { userIds: number[]; roleId: number }) {
  return request({
    url: "/system/role/authUser/selectAll",
    method: "put",
    data,
  });
}

/**
 * 修改角色状态
 * @param roleId 角色ID
 * @param status 状态
 * @returns Promise<any>
 */
export function changeRoleStatus(roleId: number, status: string) {
  const data = { roleId, status };
  return request({
    url: "/system/role/changeStatus",
    method: "put",
    data,
  });
}

/**
 * 校验角色名称唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkRoleNameUnique(params: { roleName: string; roleId?: number }) {
  return request({
    url: "/system/role/checkRoleNameUnique",
    method: "get",
    params,
  });
}

/**
 * 校验角色权限字符唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkRoleKeyUnique(params: { roleKey: string; roleId?: number }) {
  return request({
    url: "/system/role/checkRoleKeyUnique",
    method: "get",
    params,
  });
}
