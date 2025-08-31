import request from "@/utils/request";
import type { SystemMenu, SystemMenuQueryParams } from "@/types/system/menu";

/**
 * 查询菜单列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listMenu(params?: SystemMenuQueryParams) {
  return request({
    url: "/system/menu/list",
    method: "get",
    params,
  });
}

/**
 * 查询菜单详细
 * @param menuId 菜单ID
 * @returns Promise<any>
 */
export function getMenu(menuId: number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: "get",
  });
}

/**
 * 新增菜单
 * @param data 菜单数据
 * @returns Promise<any>
 */
export function addMenu(data: SystemMenu) {
  return request({
    url: "/system/menu",
    method: "post",
    data,
  });
}

/**
 * 修改菜单
 * @param data 菜单数据
 * @returns Promise<any>
 */
export function updateMenu(data: SystemMenu) {
  return request({
    url: "/system/menu",
    method: "put",
    data,
  });
}

/**
 * 删除菜单
 * @param menuId 菜单ID
 * @returns Promise<any>
 */
export function delMenu(menuId: number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: "delete",
  });
}

/**
 * 查询菜单下拉树结构
 * @returns Promise<any>
 */
export function treeselect() {
  return request({
    url: "/system/menu/treeselect",
    method: "get",
  });
}

/**
 * 根据角色ID查询菜单下拉树结构
 * @param roleId 角色ID
 * @returns Promise<any>
 */
export function roleMenuTreeselect(roleId: number) {
  return request({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: "get",
  });
}

/**
 * 获取路由
 * @returns Promise<any>
 */
export function getRouters() {
  return request({
    url: "/system/menu/getRouters",
    method: "get",
  });
}
