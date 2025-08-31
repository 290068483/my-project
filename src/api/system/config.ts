import request from "@/utils/request";
import type { SystemConfig, SystemConfigQueryParams } from "@/types/system/config";

/**
 * 查询参数配置列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listConfig(params?: SystemConfigQueryParams) {
  return request({
    url: "/system/config/list",
    method: "get",
    params,
  });
}

/**
 * 查询参数配置详细
 * @param configId 参数配置ID
 * @returns Promise<any>
 */
export function getConfig(configId: number) {
  return request({
    url: `/system/config/${configId}`,
    method: "get",
  });
}

/**
 * 新增参数配置
 * @param data 参数配置数据
 * @returns Promise<any>
 */
export function addConfig(data: SystemConfig) {
  return request({
    url: "/system/config",
    method: "post",
    data,
  });
}

/**
 * 修改参数配置
 * @param data 参数配置数据
 * @returns Promise<any>
 */
export function updateConfig(data: SystemConfig) {
  return request({
    url: "/system/config",
    method: "put",
    data,
  });
}

/**
 * 删除参数配置
 * @param ids 参数配置ID或IDs数组
 * @returns Promise<any>
 */
export function delConfig(ids: number | number[]) {
  const idsStr = Array.isArray(ids) ? ids.join(",") : ids;
  return request({
    url: `/system/config/${idsStr}`,
    method: "delete",
  });
}

/**
 * 刷新参数缓存
 * @returns Promise<any>
 */
export function refreshCache() {
  return request({
    url: "/system/config/refreshCache",
    method: "delete",
  });
}

/**
 * 清空参数缓存
 * @returns Promise<any>
 */
export function clearCache() {
  return request({
    url: "/system/config/clearCache",
    method: "delete",
  });
}

/**
 * 根据参数键名查询参数值
 * @param configKey 参数键名
 * @returns Promise<any>
 */
export function getConfigKey(configKey: string) {
  return request({
    url: `/system/config/configKey/${configKey}`,
    method: "get",
  });
}

/**
 * 根据参数键名查询参数值
 * @param configKey 参数键名
 * @returns Promise<any>
 */
export function getByKey(configKey: string) {
  return request({
    url: `/system/config/getByKey/${configKey}`,
    method: "get",
  });
}

/**
 * 批量查询参数值
 * @param configKeys 参数键名数组
 * @returns Promise<any>
 */
export function getBatchKeys(configKeys: string[]) {
  return request({
    url: "/system/config/getBatchKeys",
    method: "post",
    data: { configKeys },
  });
}
