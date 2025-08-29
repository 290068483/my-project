/**
 * 系统用户管理 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import request from "@/utils/request/index";
import type {
  UserQueryParams,
  UserForm,
  UserPasswordForm,
  UserProfileForm,
  UserPasswordUpdateForm,
  UserListResponse,
  UserDetailResponse,
  UserAuthResponse,
  DeptTreeResponse,
  RoleListResponse,
  PostListResponse,
  UserImportResponse,
  UserAuthDetailResponse,
} from "@/types/system/user";
import type { ApiResponse } from "@/types/api";

// ==================== 基本用户管理接口 ====================

/**
 * 分页查询用户列表
 * @param params 查询参数
 */
export function listUser(params?: UserQueryParams): Promise<UserListResponse> {
  return request.get("/system/user/list", { params });
}

/**
 * 查询用户详细信息
 * @param userId 用户ID
 */
export function getUser(userId?: number): Promise<UserDetailResponse> {
  return request.get(`/system/user/${userId || ""}`);
}

/**
 * 新增用户
 * @param data 用户信息
 */
export function addUser(data: UserForm): Promise<ApiResponse> {
  return request.post("/system/user", data);
}

/**
 * 修改用户
 * @param data 用户信息
 */
export function updateUser(data: UserForm): Promise<ApiResponse> {
  return request.put("/system/user", data);
}

/**
 * 删除用户
 * @param userIds 用户ID列表
 */
export function delUser(userIds: number | number[]): Promise<ApiResponse> {
  const ids = Array.isArray(userIds) ? userIds.join(",") : userIds;
  return request.delete(`/system/user/${ids}`);
}

// ==================== 权限相关接口 ====================

/**
 * 获取用户权限信息
 * @param userId 用户ID
 */
export function getUserAuth(userId: number): Promise<UserAuthDetailResponse> {
  return request.get(`/system/user/auth/${userId}`);
}

/**
 * 更新用户权限
 * @param data 权限数据
 */
export function updateUserAuth(data: { userId: number; roleIds: number[] }): Promise<ApiResponse> {
  return request.put("/system/user/auth", data);
}

/**
 * 重置用户密码
 * @param data 密码重置数据
 */
export function resetUserPwd(data: UserPasswordForm): Promise<ApiResponse> {
  return request.put("/system/user/resetPwd", data);
}

/**
 * 修改用户状态
 * @param data 状态数据
 */
export function changeUserStatus(data: { userId: number; status: string }): Promise<ApiResponse> {
  return request.put("/system/user/changeStatus", data);
}

// ==================== 个人信息管理接口 ====================

/**
 * 获取个人信息
 */
export function getUserProfile(): Promise<UserDetailResponse> {
  return request.get("/system/user/profile");
}

/**
 * 修改个人信息
 * @param data 个人信息
 */
export function updateUserProfile(data: UserProfileForm): Promise<ApiResponse> {
  return request.put("/system/user/profile", data);
}

/**
 * 修改个人密码
 * @param data 密码数据
 */
export function updateUserPwd(data: UserPasswordUpdateForm): Promise<ApiResponse> {
  return request.put("/system/user/profile/updatePwd", data);
}

/**
 * 更新用户头像
 * @param file 头像文件
 */
export function uploadAvatar(file: File): Promise<ApiResponse<{ imgUrl: string }>> {
  const formData = new FormData();
  formData.append("avatarfile", file);
  return request.upload("/system/user/profile/avatar", formData);
}

// ==================== 辅助数据接口 ====================

/**
 * 查询部门树选择
 */
export function deptTreeSelect(): Promise<DeptTreeResponse> {
  return request.get("/system/user/deptTree");
}

/**
 * 查询角色列表
 */
export function listRole(): Promise<RoleListResponse> {
  return request.get("/system/role/list");
}

/**
 * 查询岗位列表
 */
export function listPost(): Promise<PostListResponse> {
  return request.get("/system/post/list");
}

/**
 * 查询部门列表（树形结构）
 */
export function listDept(): Promise<DeptTreeResponse> {
  return request.get("/system/dept/list");
}

// ==================== 数据导入导出接口 ====================

/**
 * 导入用户数据
 * @param file 文件数据
 * @param updateSupport 是否更新支持
 */
export function importUser(file: File, updateSupport: boolean = false): Promise<UserImportResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("updateSupport", updateSupport.toString());

  return request.upload("/system/user/importData", formData);
}

/**
 * 导出用户数据
 * @param params 查询参数
 */
export function exportUser(params?: UserQueryParams): Promise<void> {
  const filename = `用户列表_${new Date().getTime()}.xlsx`;
  return request.download("/system/user/export", filename, { params });
}

/**
 * 下载用户导入模板
 */
export function importTemplate(): Promise<void> {
  return request.download("/system/user/importTemplate", "用户导入模板.xlsx");
}

/**
 * 查询用户授权角色
 * @param userId 用户ID
 */
export function getAuthRole(userId: number): Promise<UserAuthResponse> {
  return request.get(`/system/user/authRole/${userId}`);
}

/**
 * 用户授权角色
 * @param data 授权数据
 */
export function updateAuthRole(data: { userId: number; roleIds: string }): Promise<ApiResponse> {
  return request.put("/system/user/authRole", data);
}

/**
 * 校验用户名唯一性
 * @param userName 用户名
 */
export function checkUserNameUnique(userName: string): Promise<ApiResponse<boolean>> {
  return request.get("/system/user/checkUserNameUnique", {
    params: { userName },
  });
}

/**
 * 校验手机号唯一性
 * @param phonenumber 手机号
 */
export function checkPhoneUnique(phonenumber: string): Promise<ApiResponse<boolean>> {
  return request.get("/system/user/checkPhoneUnique", {
    params: { phonenumber },
  });
}

/**
 * 校验邮箱唯一性
 * @param email 邮箱
 */
export function checkEmailUnique(email: string): Promise<ApiResponse<boolean>> {
  return request.get("/system/user/checkEmailUnique", {
    params: { email },
  });
}

/**
 * 查询已分配用户角色列表
 * @param params 查询参数
 */
export function allocatedUserList(params?: UserQueryParams): Promise<UserListResponse> {
  return request.get("/system/user/list/allocated", { params });
}

/**
 * 查询未分配用户角色列表
 * @param params 查询参数
 */
export function unallocatedUserList(params?: UserQueryParams): Promise<UserListResponse> {
  return request.get("/system/user/list/unallocated", { params });
}
