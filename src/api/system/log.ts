/**
 * 系统日志管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request";
import type { SystemLog, SystemLogQueryParams } from "@/types/system/log";

/**
 * 查询操作日志列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listOperLog(params?: SystemLogQueryParams) {
  return request({
    url: "/system/operLog/list",
    method: "get",
    params,
  });
}

/**
 * 查询操作日志详细
 * @param operId 操作日志ID
 * @returns Promise<any>
 */
export function getOperLog(operId: number) {
  return request({
    url: `/system/operLog/${operId}`,
    method: "get",
  });
}

/**
 * 删除操作日志
 * @param operIds 操作日志ID或IDs数组
 * @returns Promise<any>
 */
export function delOperLog(operIds: number | number[]) {
  const idsStr = Array.isArray(operIds) ? operIds.join(",") : operIds;
  return request({
    url: `/system/operLog/${idsStr}`,
    method: "delete",
  });
}

/**
 * 清空操作日志
 * @returns Promise<any>
 */
export function cleanOperLog() {
  return request({
    url: "/system/operLog/clean",
    method: "delete",
  });
}

/**
 * 导出操作日志
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportOperLog(params?: SystemLogQueryParams) {
  return request({
    url: "/system/operLog/export",
    method: "get",
    params,
  });
}

/**
 * 查询登录日志列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listLoginLog(params?: any) {
  return request({
    url: "/system/loginLog/list",
    method: "get",
    params,
  });
}

/**
 * 查询登录日志详细
 * @param infoId 登录日志ID
 * @returns Promise<any>
 */
export function getLoginLog(infoId: number) {
  return request({
    url: `/system/loginLog/${infoId}`,
    method: "get",
  });
}

/**
 * 删除登录日志
 * @param infoIds 登录日志ID或IDs数组
 * @returns Promise<any>
 */
export function delLoginLog(infoIds: number | number[]) {
  const idsStr = Array.isArray(infoIds) ? infoIds.join(",") : infoIds;
  return request({
    url: `/system/loginLog/${idsStr}`,
    method: "delete",
  });
}

/**
 * 清空登录日志
 * @returns Promise<any>
 */
export function cleanLoginLog() {
  return request({
    url: "/system/loginLog/clean",
    method: "delete",
  });
}

/**
 * 导出登录日志
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportLoginLog(params?: any) {
  return request({
    url: "/system/loginLog/export",
    method: "get",
    params,
  });
}
