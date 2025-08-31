import request from "@/utils/request";

/**
 * 获取用户设置
 * @returns Promise<any>
 */
export function getUserSettings() {
  return request({
    url: "/user/settings",
    method: "get",
  });
}

/**
 * 更新用户设置
 * @param settings 设置数据
 * @returns Promise<any>
 */
export function updateUserSettings(settings: any) {
  return request({
    url: "/user/settings",
    method: "put",
    data: settings,
  });
}

/**
 * 获取通知设置
 * @returns Promise<any>
 */
export function getNotificationSettings() {
  return request({
    url: "/user/settings/notifications",
    method: "get",
  });
}

/**
 * 更新通知设置
 * @param settings 通知设置数据
 * @returns Promise<any>
 */
export function updateNotificationSettings(settings: any) {
  return request({
    url: "/user/settings/notifications",
    method: "put",
    data: settings,
  });
}

/**
 * 获取隐私设置
 * @returns Promise<any>
 */
export function getPrivacySettings() {
  return request({
    url: "/user/settings/privacy",
    method: "get",
  });
}

/**
 * 更新隐私设置
 * @param settings 隐私设置数据
 * @returns Promise<any>
 */
export function updatePrivacySettings(settings: any) {
  return request({
    url: "/user/settings/privacy",
    method: "put",
    data: settings,
  });
}

/**
 * 更新个人资料
 * @param data 个人资料数据
 * @returns Promise<any>
 */
export function updateProfile(data: any) {
  return request({
    url: "/user/profile",
    method: "put",
    data,
  });
}

/**
 * 获取登录日志
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
 * 导出数据
 * @param type 导出类型
 * @returns Promise<any>
 */
export function exportData(type: string) {
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
export function requestDeletion(reason: string, password: string) {
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
export function cancelDeletion(requestId: string) {
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
export function verifyTwoFactor(code: string, method: string) {
  return request({
    url: "/user/verify-two-factor",
    method: "post",
    data: { code, method },
  });
}
