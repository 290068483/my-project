/**
 * 字典管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 字典类型定义 ====================

/**
 * 字典类型接口
 */
export interface DictType {
  /** 字典主键 */
  dictId?: number;
  /** 字典名称 */
  dictName: string;
  /** 字典类型 */
  dictType: string;
  /** 状态 */
  status: string;
  /** 备注 */
  remark?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
}

/**
 * 字典数据接口
 */
export interface DictData {
  /** 字典编码 */
  dictCode?: number;
  /** 字典排序 */
  dictSort: number;
  /** 字典标签 */
  dictLabel: string;
  /** 字典键值 */
  dictValue: string;
  /** 字典类型 */
  dictType: string;
  /** 样式属性（其他样式扩展） */
  cssClass?: string;
  /** 表格回显样式 */
  listClass?: string;
  /** 是否默认 */
  isDefault: string;
  /** 状态 */
  status: string;
  /** 备注 */
  remark?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
}

// ==================== 查询参数类型 ====================

/**
 * 字典类型查询参数
 */
export interface DictTypeQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 字典名称 */
  dictName?: string;
  /** 字典类型 */
  dictType?: string;
  /** 状态 */
  status?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 字典数据查询参数
 */
export interface DictDataQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 字典标签 */
  dictLabel?: string;
  /** 字典类型 */
  dictType?: string;
  /** 状态 */
  status?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

// ==================== 表单数据类型 ====================

/**
 * 字典类型表单数据
 */
export interface DictTypeForm {
  /** 字典主键 */
  dictId?: number;
  /** 字典名称 */
  dictName: string;
  /** 字典类型 */
  dictType: string;
  /** 状态 */
  status: string;
  /** 备注 */
  remark?: string;
}

/**
 * 字典数据表单数据
 */
export interface DictDataForm {
  /** 字典编码 */
  dictCode?: number;
  /** 字典排序 */
  dictSort: number;
  /** 字典标签 */
  dictLabel: string;
  /** 字典键值 */
  dictValue: string;
  /** 字典类型 */
  dictType: string;
  /** 样式属性 */
  cssClass?: string;
  /** 表格回显样式 */
  listClass?: string;
  /** 是否默认 */
  isDefault: string;
  /** 状态 */
  status: string;
  /** 备注 */
  remark?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 字典类型列表响应
 */
export interface DictTypeListResponse extends ApiResponse<PageResponse<DictType[]>> {
  code: number;
  msg: string;
}

/**
 * 字典类型详情响应
 */
export interface DictTypeDetailResponse extends ApiResponse<DictType> {
  code: number;
  msg: string;
}

/**
 * 字典类型选择框响应
 */
export interface DictTypeOptionResponse extends ApiResponse<DictType[]> {
  code: number;
  msg: string;
}

/**
 * 字典数据列表响应
 */
export interface DictDataListResponse extends ApiResponse<PageResponse<DictData[]>> {
  code: number;
  msg: string;
}

/**
 * 字典数据详情响应
 */
export interface DictDataDetailResponse extends ApiResponse<DictData> {
  code: number;
  msg: string;
}

/**
 * 字典数据选择框响应
 */
export interface DictDataOptionResponse extends ApiResponse<DictData[]> {
  code: number;
  msg: string;
}
