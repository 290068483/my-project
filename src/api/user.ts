import request from "@/utils/request";

/**
 * 获取用户个人信息
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
 * @param userInfo 用户信息
 * @returns Promise<any>
 */
export function updateUserInfo(userInfo: any) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: userInfo,
  });
}

/**
 * 修改用户密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns Promise<any>
 */
export function updateUserPwd(oldPassword: string, newPassword: string) {
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    data: {
      oldPassword,
      newPassword,
    },
  });
}

/**
 * 上传用户头像
 * @param avatar 头像文件
 * @returns Promise<any>
 */
export function uploadAvatar(avatar: any) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    data: avatar,
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
 * @param userData 用户数据
 * @returns Promise<any>
 */
export function addUser(userData: any) {
  return request({
    url: "/system/user",
    method: "post",
    data: userData,
  });
}

/**
 * 修改用户
 * @param userData 用户数据
 * @returns Promise<any>
 */
export function updateUser(userData: any) {
  return request({
    url: "/system/user",
    method: "put",
    data: userData,
  });
}

/**
 * 删除用户
 * @param userIds 用户ID数组
 * @returns Promise<any>
 */
export function delUser(userIds: number[]) {
  return request({
    url: `/system/user/${userIds.join(",")}`,
    method: "delete",
  });
}

/**
 * 导出用户
 * @param params 查询参数
 * @returns Promise<any>
 */
export function exportUser(params: any) {
  return request({
    url: "/system/user/export",
    method: "get",
    params,
  });
}

/**
 * 查询用户角色
 * @param userId 用户ID
 * @returns Promise<any>
 */
export function getUserRoles(userId: number) {
  return request({
    url: `/system/user/authRole/${userId}`,
    method: "get",
  });
}

/**
 * 授权用户角色
 * @param data 角色数据
 * @returns Promise<any>
 */
export function authUserRoles(data: any) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    data,
  });
}

/**
 * 查询用户登录日志
 * @param params 查询参数
 * @returns Promise<any>
 */
export function getLoginLogs(params: any) {
  return request({
    url: "/user/loginLogs",
    method: "get",
    params,
  });
}

/**
 * 导出用户数据
 * @param type 导出类型
 * @returns Promise<any>
 */
export function exportUserData(type: string) {
  return request({
    url: "/user/export-data",
    method: "post",
    data: { type },
  });
}

/**
 * 申请删除账户
 * @param reason 删除原因
 * @param password 密码
 * @returns Promise<any>
 */
export function requestAccountDeletion(reason: string, password: string) {
  return request({
    url: "/user/request-deletion",
    method: "post",
    data: { reason, password },
  });
}

/**
 * 取消删除账户申请
 * @param requestId 申请ID
 * @returns Promise<any>
 */
export function cancelAccountDeletion(requestId: string) {
  return request({
    url: "/user/cancel-deletion",
    method: "post",
    data: { requestId },
  });
}

/**
 * 验证密码
 * @param password 密码
 * @returns Promise<any>
 */
export function verifyPassword(password: string) {
  return request({
    url: "/user/verify-password",
    method: "post",
    data: { password },
  });
}

/**
 * 设置两步验证
 * @param method 验证方法
 * @param enable 是否启用
 * @returns Promise<any>
 */
export function setTwoFactorAuth(method: string, enable: boolean) {
  return request({
    url: "/user/two-factor-auth",
    method: "post",
    data: { method, enable },
  });
}

/**
 * 验证两步验证码
 * @param code 验证码
 * @param method 验证方法
 * @returns Promise<any>
 */
export function verifyTwoFactorCode(code: string, method: string) {
  return request({
    url: "/user/verify-two-factor",
    method: "post",
    data: { code, method },
  });
}
