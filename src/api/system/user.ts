import request from "@/utils/request";
import type { SystemUser, SystemUserQueryParams } from "@/types/system/user";

/**
 * 查询用户列表
 * @param params 查询参数
 * @returns Promise<any>
 */
export function listUser(params?: SystemUserQueryParams) {
  return request({
    url: "/system/user/list",
    method: "get",
    params,
  });
}

/**
 * 查询用户详细
 * @param userId 用户ID
 * @returns Promise<any>
 */
export function getUser(userId: number) {
  return request({
    url: `/system/user/${userId}`,
    method: "get",
  });
}

/**
 * 新增用户
 * @param data 用户数据
 * @returns Promise<any>
 */
export function addUser(data: any) {
  return request({
    url: "/system/user",
    method: "post",
    data,
  });
}

/**
 * 修改用户
 * @param data 用户数据
 * @returns Promise<any>
 */
export function updateUser(data: any) {
  return request({
    url: "/system/user",
    method: "put",
    data,
  });
}

/**
 * 删除用户
 * @param userIds 用户ID或IDs数组
 * @returns Promise<any>
 */
export function delUser(userIds: number | number[]) {
  const idsStr = Array.isArray(userIds) ? userIds.join(",") : userIds;
  return request({
    url: `/system/user/${idsStr}`,
    method: "delete",
  });
}

/**
 * 导出用户
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportUser(params?: SystemUserQueryParams) {
  return request({
    url: "/system/user/export",
    method: "get",
    params,
  });
}

/**
 * 用户密码重置
 * @param data 用户ID和新密码
 * @returns Promise<any>
 */
export function resetUserPwd(data: { userId: number; password: string }) {
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data,
  });
}

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 状态
 * @returns Promise<any>
 */
export function changeUserStatus(userId: number, status: string) {
  const data = { userId, status };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data,
  });
}

/**
 * 查询用户个人信息
 * @returns Promise<any>
 */
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get",
  });
}

/**
 * 修改用户个人信息
 * @param data 用户数据
 * @returns Promise<any>
 */
export function updateUserProfile(data: any) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data,
  });
}

/**
 * 用户密码重置
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns Promise<any>
 */
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = { oldPassword, newPassword };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    data,
  });
}

/**
 * 用户头像上传
 * @param data 头像文件
 * @returns Promise<any>
 */
export function uploadAvatar(data: any) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data,
  });
}

/**
 * 下载用户导入模板
 * @returns Promise<any>
 */
export function importTemplate() {
  return request({
    url: "/system/user/importTemplate",
    method: "get",
  });
}

/**
 * 校验用户名称唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkUserNameUnique(params: { userName: string; userId?: number }) {
  return request({
    url: "/system/user/checkUserNameUnique",
    method: "get",
    params,
  });
}

/**
 * 校验手机号唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkPhoneUnique(params: { phonenumber: string; userId?: number }) {
  return request({
    url: "/system/user/checkPhoneUnique",
    method: "get",
    params,
  });
}

/**
 * 校验邮箱唯一性
 * @param params 查询参数
 * @returns Promise<any>
 */
export function checkEmailUnique(params: { email: string; userId?: number }) {
  return request({
    url: "/system/user/checkEmailUnique",
    method: "get",
    params,
  });
}

/**
 * 批量修改用户状态
 * @param userIds 用户ID数组
 * @param status 状态
 * @returns Promise<any>
 */
export function batchChangeUserStatus(userIds: number[], status: string) {
  const data = { userIds, status };
  return request({
    url: "/system/user/batchChangeStatus",
    method: "put",
    data,
  });
}

/**
 * 查询用户角色权限
 * @param userId 用户ID
 * @returns Promise<any>
 */
export function getAuthRole(userId: number) {
  return request({
    url: `/system/user/authRole/${userId}`,
    method: "get",
  });
}

/**
 * 更新用户角色权限
 * @param data 用户ID和角色ID列表
 * @returns Promise<any>
 */
export function updateAuthRole(data: { userId: number | undefined; roleIds: number[] }) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    data,
  });
}
