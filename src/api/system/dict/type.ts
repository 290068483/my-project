import request from "@/utils/request";
import type { SystemDictType, SystemDictTypeQueryParams } from "@/types/system/dict";

/**
 * 查询字典类型列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listType(params?: SystemDictTypeQueryParams) {
  return request({
    url: "/system/dict/type/list",
    method: "get",
    params,
  });
}

/**
 * 查询字典类型详细
 * @param dictId 字典类型ID
 * @returns Promise<any>
 */
export function getType(dictId: number) {
  return request({
    url: `/system/dict/type/${dictId}`,
    method: "get",
  });
}

/**
 * 新增字典类型
 * @param data 字典类型数据
 * @returns Promise<any>
 */
export function addType(data: SystemDictType) {
  return request({
    url: "/system/dict/type",
    method: "post",
    data,
  });
}

/**
 * 修改字典类型
 * @param data 字典类型数据
 * @returns Promise<any>
 */
export function updateType(data: SystemDictType) {
  return request({
    url: "/system/dict/type",
    method: "put",
    data,
  });
}

/**
 * 删除字典类型
 * @param dictIds 字典类型ID或IDs数组
 * @returns Promise<any>
 */
export function delType(dictIds: number | number[]) {
  const idsStr = Array.isArray(dictIds) ? dictIds.join(",") : dictIds;
  return request({
    url: `/system/dict/type/${idsStr}`,
    method: "delete",
  });
}

/**
 * 导出字典类型
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportType(params?: SystemDictTypeQueryParams) {
  return request({
    url: "/system/dict/type/export",
    method: "get",
    params,
  });
}

/**
 * 刷新字典缓存
 * @returns Promise<any>
 */
export function refreshCache() {
  return request({
    url: "/system/dict/type/refreshCache",
    method: "delete",
  });
}

/**
 * 获取字典选择框列表
 * @returns Promise<any>
 */
export function optionselect() {
  return request({
    url: "/system/dict/type/optionselect",
    method: "get",
  });
}
