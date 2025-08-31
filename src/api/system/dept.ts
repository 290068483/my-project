import request from "@/utils/request";
import type { SystemDept, SystemDeptQueryParams } from "@/types/system/dept";

/**
 * 查询部门列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listDept(params?: SystemDeptQueryParams) {
  return request({
    url: "/system/dept/list",
    method: "get",
    params,
  });
}

/**
 * 查询部门详细
 * @param deptId 部门ID
 * @returns Promise<any>
 */
export function getDept(deptId: number) {
  return request({
    url: `/system/dept/${deptId}`,
    method: "get",
  });
}

/**
 * 新增部门
 * @param data 部门数据
 * @returns Promise<any>
 */
export function addDept(data: SystemDept) {
  return request({
    url: "/system/dept",
    method: "post",
    data,
  });
}

/**
 * 修改部门
 * @param data 部门数据
 * @returns Promise<any>
 */
export function updateDept(data: SystemDept) {
  return request({
    url: "/system/dept",
    method: "put",
    data,
  });
}

/**
 * 删除部门
 * @param deptId 部门ID
 * @returns Promise<any>
 */
export function delDept(deptId: number) {
  return request({
    url: `/system/dept/${deptId}`,
    method: "delete",
  });
}

/**
 * 查询部门下拉树结构
 * @returns Promise<any>
 */
export function treeselect() {
  return request({
    url: "/system/dept/treeselect",
    method: "get",
  });
}

/**
 * 根据角色ID查询部门树结构
 * @param roleId 角色ID
 * @returns Promise<any>
 */
export function roleDeptTreeselect(roleId: number) {
  return request({
    url: `/system/dept/roleDeptTreeselect/${roleId}`,
    method: "get",
  });
}

/**
 * 校验部门名称唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkDeptNameUnique(params: { deptName: string; parentId?: number; deptId?: number }) {
  return request({
    url: "/system/dept/checkDeptNameUnique",
    method: "get",
    params,
  });
}
