/**
 * 系统配置管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 配置数据类型定义 ====================

/**
 * 系统配置参数接口
 */
export interface SystemConfig {
  /** 参数主键 */
  configId?: number;
  /** 参数名称 */
  configName: string;
  /** 参数键名 */
  configKey: string;
  /** 参数键值 */
  configValue: string;
  /** 系统内置 */
  configType: string;
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
 * 配置查询参数
 */
export interface ConfigQueryParams {
  /** 页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 参数名称 */
  configName?: string;
  /** 参数键名 */
  configKey?: string;
  /** 系统内置 */
  configType?: string;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 配置表单数据
 */
export interface ConfigForm {
  /** 参数主键 */
  configId?: number;
  /** 参数名称 */
  configName: string;
  /** 参数键名 */
  configKey: string;
  /** 参数键值 */
  configValue: string;
  /** 系统内置 */
  configType: string;
  /** 备注 */
  remark?: string;
}

// ==================== 响应类型定义 ====================

/**
 * 配置列表响应
 */
export interface ConfigListResponse extends ApiResponse {
  // RuoYi标准分页响应格式
  data: PageResponse & {
    list: SystemConfig[];
    rows: SystemConfig[];
  };
  code: number;
  msg: string;
}

/**
 * 配置详情响应
 */
export interface ConfigDetailResponse extends ApiResponse {
  // RuoYi标准详情响应格式
  data: SystemConfig;
  code: number;
  msg: string;
}

/**
 * 配置选择框响应
 */
export interface ConfigOptionResponse extends ApiResponse {
  // RuoYi标准选择框响应格式
  data: SystemConfig[];
  code: number;
  msg: string;
}