/**
 * 字典类型管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request";
import type { ApiResponse } from "@/types/api";
import type {
  DictType,
  DictTypeQueryParams,
  DictTypeForm,
  DictTypeListResponse,
  DictTypeDetailResponse,
  DictTypeOptionResponse,
} from "@/types/system/dict";

// ==================== 基本字典类型管理接口 ====================

/**
 * 分页查询字典类型列表
 * @param params 查询参数
 */
export function listDictType(params?: DictTypeQueryParams): Promise<DictTypeListResponse> {
  return request.get("/system/dict/type/list", { params });
}

/**
 * 查询字典类型详细信息
 * @param dictId 字典ID
 */
export function getDictType(dictId: number): Promise<DictTypeDetailResponse> {
  return request.get(`/system/dict/type/${dictId}`);
}

/**
 * 新增字典类型
 * @param data 字典类型信息
 */
export function addDictType(data: DictTypeForm): Promise<ApiResponse> {
  return request.post("/system/dict/type", data);
}

/**
 * 修改字典类型
 * @param data 字典类型信息
 */
export function updateDictType(data: DictTypeForm): Promise<ApiResponse> {
  return request.put("/system/dict/type", data);
}

/**
 * 删除字典类型
 * @param dictIds 字典ID列表
 */
export function delDictType(dictIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(dictIds) ? dictIds.join(",") : dictIds;
  return request.delete(`/system/dict/type/${ids}`);
}

// ==================== 辅助接口 ====================

/**
 * 校验字典类型是否唯一
 * @param dictType 字典类型
 * @param dictId 字典ID（编辑时排除自身）
 */
export function checkDictTypeUnique(dictType: string, dictId?: number): Promise<ApiResponse<boolean>> {
  return request.get("/system/dict/type/checkDictTypeUnique", {
    params: { dictType, dictId },
  });
}

/**
 * 查询字典类型选择框列表
 */
export function getDictTypeOptionSelect(): Promise<DictTypeOptionResponse> {
  return request.get("/system/dict/type/optionselect");
}

/**
 * 导出字典类型数据
 * @param params 查询参数
 */
export function exportDictType(params?: DictTypeQueryParams): Promise<void> {
  const filename = `字典类型_${new Date().getTime()}.xlsx`;
  return request.download("/system/dict/type/export", filename, { params });
}

/**
 * 刷新字典缓存
 */
export function refreshDictCache(): Promise<ApiResponse> {
  return request.delete("/system/dict/type/refreshCache");
}
