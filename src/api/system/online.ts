/**
 * 在线用户管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request";
import type { OnlineUser, OnlineUserQueryParams } from "@/types/system/online";

/**
 * 查询在线用户列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listOnlineUser(params?: OnlineUserQueryParams) {
  return request({
    url: "/system/online/list",
    method: "get",
    params,
  });
}

/**
 * 强退用户
 * @param tokenId 会话ID
 * @returns Promise<any>
 */
export function forceLogout(tokenId: string) {
  return request({
    url: `/system/online/${tokenId}`,
    method: "delete",
  });
}
