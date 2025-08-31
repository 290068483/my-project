import request from "@/utils/request";
import type { SystemPost, SystemPostQueryParams } from "@/types/system/post";

/**
 * 查询岗位列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listPost(params?: SystemPostQueryParams) {
  return request({
    url: "/system/post/list",
    method: "get",
    params,
  });
}

/**
 * 查询岗位详细
 * @param postId 岗位ID
 * @returns Promise<any>
 */
export function getPost(postId: number) {
  return request({
    url: `/system/post/${postId}`,
    method: "get",
  });
}

/**
 * 新增岗位
 * @param data 岗位数据
 * @returns Promise<any>
 */
export function addPost(data: SystemPost) {
  return request({
    url: "/system/post",
    method: "post",
    data,
  });
}

/**
 * 修改岗位
 * @param data 岗位数据
 * @returns Promise<any>
 */
export function updatePost(data: SystemPost) {
  return request({
    url: "/system/post",
    method: "put",
    data,
  });
}

/**
 * 删除岗位
 * @param postIds 岗位ID或IDs数组
 * @returns Promise<any>
 */
export function delPost(postIds: number | number[]) {
  const idsStr = Array.isArray(postIds) ? postIds.join(",") : postIds;
  return request({
    url: `/system/post/${idsStr}`,
    method: "delete",
  });
}

/**
 * 导出岗位
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportPost(params?: SystemPostQueryParams) {
  return request({
    url: "/system/post/export",
    method: "get",
    params,
  });
}

/**
 * 校验岗位名称唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkPostNameUnique(params: { postName: string; postId?: number }) {
  return request({
    url: "/system/post/checkPostNameUnique",
    method: "get",
    params,
  });
}

/**
 * 校验岗位编码唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkPostCodeUnique(params: { postCode: string; postId?: number }) {
  return request({
    url: "/system/post/checkPostCodeUnique",
    method: "get",
    params,
  });
}
