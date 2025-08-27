/**
 * 系统配置管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
import type {
  SystemConfig,
  ConfigQueryParams,
  ConfigForm,
  ConfigListResponse,
  ConfigDetailResponse,
} from "@/types/system/config";
import type { ApiResponse } from "@/types/api";

// ==================== 基本配置管理接口 ====================

/**
 * 分页查询参数配置列表
 * @param params 查询参数
 */
export function listConfig(params?: ConfigQueryParams): Promise<ConfigListResponse> {
  return request.get("/system/config/list", { params });
}

/**
 * 查询参数配置详细信息
 * @param configId 参数ID
 */
export function getConfig(configId: number): Promise<ConfigDetailResponse> {
  return request.get(`/system/config/${configId}`);
}

/**
 * 新增参数配置
 * @param data 配置信息
 */
export function addConfig(data: ConfigForm): Promise<ApiResponse> {
  return request.post("/system/config", data);
}

/**
 * 修改参数配置
 * @param data 配置信息
 */
export function updateConfig(data: ConfigForm): Promise<ApiResponse> {
  return request.put("/system/config", data);
}

/**
 * 删除参数配置
 * @param configIds 配置ID列表
 */
export function delConfig(configIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(configIds) ? configIds.join(",") : configIds;
  return request.delete(`/system/config/${ids}`);
}

/**
 * 导出参数配置数据
 * @param params 查询参数
 */
export function exportConfig(params?: ConfigQueryParams): Promise<void> {
  const filename = `参数配置_${new Date().getTime()}.xlsx`;
  return request.download("/system/config/export", filename, { params });
}

/**
 * 刷新参数缓存
 */
export function refreshConfigCache(): Promise<ApiResponse> {
  return request.delete("/system/config/refreshCache");
}

/**
 * 清空参数缓存
 */
export function clearConfigCache(): Promise<ApiResponse> {
  return request.delete("/system/config/clearCache");
}

// ==================== 配置获取接口 ====================

/**
 * 根据参数键名查询参数值
 * @param configKey 参数键名
 */
export function getConfigKey(configKey: string): Promise<ApiResponse<string>> {
  return request.get(`/system/config/configKey/${configKey}`);
}

/**
 * 根据参数键名查询参数信息
 * @param configKey 参数键名
 */
export function getConfigByKey(configKey: string): Promise<ConfigDetailResponse> {
  return request.get(`/system/config/getByKey/${configKey}`);
}

/**
 * 批量获取配置值
 * @param configKeys 参数键名列表
 */
export function getBatchConfigKeys(configKeys: string[]): Promise<ApiResponse<Record<string, string>>> {
  return request.post("/system/config/getBatchKeys", { configKeys });
}
