/**
 * 系统监控 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request";

/**
 * 获取服务器信息
 * @returns Promise<any>
 */
export function getServerInfo() {
  return request({
    url: "/monitor/server",
    method: "get",
  });
}

/**
 * 获取Druid监控信息
 * @returns Promise<any>
 */
export function getDruidInfo() {
  return request({
    url: "/monitor/druid",
    method: "get",
  });
}
