/**
 * 字典数据管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request/index";
import type { ApiResponse } from "@/types/api";
import type {
  DictDataQueryParams,
  DictDataForm,
  DictDataListResponse,
  DictDataDetailResponse,
  DictDataOptionResponse,
} from "@/types/system/dict";

// ==================== 基本字典数据管理接口 ====================

/**
 * 分页查询字典数据列表
 * @param params 查询参数
 */
export function listDictData(params?: DictDataQueryParams): Promise<DictDataListResponse> {
  return request.get("/system/dict/data/list", { params });
}

/**
 * 根据字典类型查询字典数据
 * @param dictType 字典类型
 */
export function getDictDataByType(dictType: string): Promise<DictDataOptionResponse> {
  return request.get(`/system/dict/data/type/${dictType}`);
}

/**
 * 查询字典数据详细信息
 * @param dictCode 字典编码
 */
export function getDictData(dictCode: number): Promise<DictDataDetailResponse> {
  return request.get(`/system/dict/data/${dictCode}`);
}

/**
 * 新增字典数据
 * @param data 字典数据信息
 */
export function addDictData(data: DictDataForm): Promise<ApiResponse> {
  return request.post("/system/dict/data", data);
}

/**
 * 修改字典数据
 * @param data 字典数据信息
 */
export function updateDictData(data: DictDataForm): Promise<ApiResponse> {
  return request.put("/system/dict/data", data);
}

/**
 * 删除字典数据
 * @param dictCodes 字典编码列表
 */
export function delDictData(dictCodes: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(dictCodes) ? dictCodes.join(",") : dictCodes;
  return request.delete(`/system/dict/data/${ids}`);
}

// ==================== 辅助接口 ====================

/**
 * 校验字典键值是否唯一
 * @param dictType 字典类型
 * @param dictValue 字典键值
 * @param dictCode 字典编码（编辑时排除自身）
 */
export function checkDictValueUnique(
  dictType: string,
  dictValue: string,
  dictCode?: number,
): Promise<ApiResponse<boolean>> {
  return request.get("/system/dict/data/checkDictValueUnique", {
    params: { dictType, dictValue, dictCode },
  });
}

/**
 * 导出字典数据
 * @param params 查询参数
 */
export function exportDictData(params?: DictDataQueryParams): Promise<void> {
  const filename = `字典数据_${new Date().getTime()}.xlsx`;
  return request.download("/system/dict/data/export", filename, { params });
}
