/**
 * 系统部门管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
import type {
  SystemDept,
  DeptQueryParams,
  DeptForm,
  DeptListResponse,
  DeptDetailResponse,
  DeptTreeResponse,
  DeptAuthResponse,
} from "@/types/system/dept";
import type { ApiResponse } from "@/types/api";

// ==================== 部门管理接口 ====================

/**
 * 查询部门列表
 * @param params 查询参数
 */
export function listDept(params?: DeptQueryParams): Promise<DeptListResponse> {
  return request.get("/system/dept/list", { params });
}

/**
 * 查询部门详细信息
 * @param deptId 部门ID
 */
export function getDept(deptId: number): Promise<DeptDetailResponse> {
  return request.get(`/system/dept/${deptId}`);
}

/**
 * 新增部门
 * @param data 部门信息
 */
export function addDept(data: DeptForm): Promise<ApiResponse> {
  return request.post("/system/dept", data);
}

/**
 * 修改部门
 * @param data 部门信息
 */
export function updateDept(data: DeptForm): Promise<ApiResponse> {
  return request.put("/system/dept", data);
}

/**
 * 删除部门
 * @param deptId 部门ID
 */
export function delDept(deptId: number): Promise<ApiResponse> {
  return request.delete(`/system/dept/${deptId}`);
}

/**
 * 查询部门下拉树结构
 */
export function deptTreeSelect(): Promise<DeptTreeResponse> {
  return request.get("/system/dept/treeselect");
}

/**
 * 根据角色ID查询部门树结构
 * @param roleId 角色ID
 */
export function roleDeptTreeSelect(roleId: number): Promise<DeptTreeResponse> {
  return request.get(`/system/dept/roleDeptTreeselect/${roleId}`);
}

/**
 * 校验部门名称
 * @param params 校验参数
 */
export function checkDeptNameUnique(params: {
  deptName: string;
  deptId?: number;
  parentId?: number;
}): Promise<ApiResponse<boolean>> {
  return request.get("/system/dept/checkDeptNameUnique", { params });
}

/**
 * 查询部门列表（排除节点）
 * @param deptId 要排除的部门ID
 */
export function listDeptExcludeChild(deptId: number): Promise<DeptTreeResponse> {
  return request.get(`/system/dept/list/exclude/${deptId}`);
}

// ==================== 权限相关接口 ====================

/**
 * 获取部门权限信息
 * @param deptId 部门ID
 */
export function getDeptAuth(deptId: number): Promise<DeptAuthResponse> {
  return request.get(`/system/dept/auth/${deptId}`);
}

/**
 * 更新部门权限
 * @param data 权限数据
 */
export function updateDeptAuth(data: { deptId: number; roleIds: number[] }): Promise<ApiResponse> {
  return request.put("/system/dept/auth", data);
}

// ==================== 新增接口（符合API文档） ====================

/**
 * 获取部门树选择（标准接口名）
 */
export function getDeptTreeSelect(): Promise<DeptTreeResponse> {
  return deptTreeSelect();
}

/**
 * 获取角色部门树选择（标准接口名）
 * @param roleId 角色ID
 */
export function getRoleDeptTreeSelect(roleId: number): Promise<DeptTreeResponse> {
  return roleDeptTreeSelect(roleId);
}

/**
 * 批量修改部门状态
 * @param deptIds 部门ID列表
 * @param status 状态
 */
export function batchChangeDeptStatus(deptIds: number[], status: string): Promise<ApiResponse> {
  return request.put("/system/dept/changeStatus/batch", {
    deptIds,
    status,
  });
}

/**
 * 导出部门数据
 * @param params 查询参数
 */
export function exportDept(params?: DeptQueryParams): Promise<void> {
  const filename = `部门列表_${new Date().getTime()}.xlsx`;
  return request.download("/system/dept/export", filename, { params });
}
