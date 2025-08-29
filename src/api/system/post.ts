/**
 * 系统岗位管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request/index";
import type { ApiResponse } from "@/types/api";
import type {
  PostQueryParams,
  PostForm,
  PostListResponse,
  PostDetailResponse,
  PostOptionResponse,
  PostAuthResponse,
} from "@/types/system/post";

// ==================== 岗位数据类型定义 ====================

/**
 * 分页查询岗位列表
 * @param params 查询参数
 */
export function listPost(params?: PostQueryParams): Promise<PostListResponse> {
  return request.get("/system/post/list", { params });
}

/**
 * 查询岗位详细信息
 * @param postId 岗位ID
 */
export function getPost(postId: number): Promise<PostDetailResponse> {
  return request.get(`/system/post/${postId}`);
}

/**
 * 新增岗位
 * @param data 岗位信息
 */
export function addPost(data: PostForm): Promise<ApiResponse> {
  return request.post("/system/post", data);
}
/**
 * 修改岗位
 * @param data 岗位信息
 */
export function updatePost(data: PostForm): Promise<ApiResponse> {
  return request.put("/system/post", data);
}

/**
 * 删除岗位
 * @param postIds 岗位ID列表
 */
export function delPost(postIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(postIds) ? postIds.join(",") : postIds;
  return request.delete(`/system/post/${ids}`);
}

// ==================== 辅助接口 ====================

/**
 * 校验岗位名称唯一性
 * @param postName 岗位名称
 * @param postId 岗位ID（编辑时排除自身）
 */
export function checkPostNameUnique(postName: string, postId?: number): Promise<ApiResponse<boolean>> {
  return request.get("/system/post/checkPostNameUnique", {
    params: { postName, postId },
  });
}

/**
 * 校验岗位编码唯一性
 * @param postCode 岗位编码
 * @param postId 岗位ID（编辑时排除自身）
 */
export function checkPostCodeUnique(postCode: string, postId?: number): Promise<ApiResponse<boolean>> {
  return request.get("/system/post/checkPostCodeUnique", {
    params: { postCode, postId },
  });
}

// ==================== 权限相关接口 ====================

/**
 * 获取岗位权限信息
 * @param postId 岗位ID
 */
export function getPostAuth(postId: number): Promise<PostAuthResponse> {
  return request.get(`/system/post/auth/${postId}`);
}

/**
 * 更新岗位权限
 * @param data 权限数据
 */
export function updatePostAuth(data: { postId: number; permissionIds: number[] }): Promise<ApiResponse> {
  return request.put("/system/post/auth", data);
}

// ==================== 辅助接口 ====================

/**
 * 查询岗位选择框列表
 */
export function getPostOptionSelect(): Promise<PostOptionResponse> {
  return request.get("/system/post/optionselect");
}

/**
 * 导出岗位数据
 * @param params 查询参数
 */
export function exportPost(params?: PostQueryParams): Promise<void> {
  const filename = `岗位列表_${new Date().getTime()}.xlsx`;
  return request.download("/system/post/export", filename, { params });
}
