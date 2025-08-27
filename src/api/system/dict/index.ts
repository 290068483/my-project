/**
 * 字典管理 API 统一导出
 * 基于 RuoYi 架构设计
 */

// 字典类型管理
export {
  listDictType,
  getDictType,
  addDictType,
  updateDictType,
  delDictType,
  checkDictTypeUnique,
  getDictTypeOptionSelect,
  exportDictType,
  refreshDictCache,
} from "./type";

// 字典数据管理
export {
  listDictData,
  getDictDataByType,
  getDictData,
  addDictData,
  updateDictData,
  delDictData,
  checkDictValueUnique,
  exportDictData,
} from "./data";
