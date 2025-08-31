import request from "@/utils/request";
import type { SystemDictData, SystemDictDataQueryParams } from "@/types/system/dict";

/**
 * 查询字典数据列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listData(params?: SystemDictDataQueryParams) {
  return request({
    url: "/system/dict/data/list",
    method: "get",
    params,
  });
}

/**
 * 查询字典数据详细
 * @param dictCode 字典数据ID
 * @returns Promise<any>
 */
export function getData(dictCode: number) {
  return request({
    url: `/system/dict/data/${dictCode}`,
    method: "get",
  });
}

/**
 * 新增字典数据
 * @param data 字典数据
 * @returns Promise<any>
 */
export function addData(data: SystemDictData) {
  return request({
    url: "/system/dict/data",
    method: "post",
    data,
  });
}

/**
 * 修改字典数据
 * @param data 字典数据
 * @returns Promise<any>
 */
export function updateData(data: SystemDictData) {
  return request({
    url: "/system/dict/data",
    method: "put",
    data,
  });
}

/**
 * 删除字典数据
 * @param dictCodes 字典数据ID或IDs数组
 * @returns Promise<any>
 */
export function delData(dictCodes: number | number[]) {
  const idsStr = Array.isArray(dictCodes) ? dictCodes.join(",") : dictCodes;
  return request({
    url: `/system/dict/data/${idsStr}`,
    method: "delete",
  });
}

/**
 * 导出字典数据
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportData(params?: SystemDictDataQueryParams) {
  return request({
    url: "/system/dict/data/export",
    method: "get",
    params,
  });
}
