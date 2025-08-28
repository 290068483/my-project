/**
 * API统一导出文件
 * 用于统一管理和导出所有API接口
 */

// 登录相关API
export { login } from "./login";
export { register } from "./register";
export { getCodeImg, refreshCaptcha, validateCaptcha } from "./captcha";
export { getInfo, logout, updateUserInfo, changePassword } from "./user";

// 系统管理API
export {
  // 用户管理
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  getUserProfile,
  updateUserProfile,
  updateUserPwd,
  deptTreeSelect,
  listRole,
  listPost,
  importUser,
  exportUser,
  importTemplate,
  getAuthRole,
  updateAuthRole,
  checkUserNameUnique,
  checkPhoneUnique,
  checkEmailUnique,
  allocatedUserList,
  unallocatedUserList,
  // 用户权限相关
  getUserAuth,
  updateUserAuth,
} from "./system/user";

// 角色管理
export {
  listRole as listRoleList,
  getRole,
  addRole,
  updateRole,
  delRole,
  cancelAuthUser,
  cancelAuthUserAll,
  selectAuthUserAll,
  getRoleOptionSelect,
  exportRole,
  // 角色权限相关
  getRoleAuth,
  updateRoleAuth,
  getRoleMenuTreeSelect,
  getRoleDeptTreeSelect,
  // 角色状态和数据权限相关
  changeRoleStatus,
  updateRoleDataScope,
} from "./system/role";

// 菜单管理
export {
  listMenu,
  getMenu,
  addMenu,
  updateMenu,
  delMenu,
  // 菜单树形选择接口
  getMenuTreeSelect,
  // 路由接口
  getMenuRouters,
  // 菜单权限相关
  getMenuAuth,
  updateMenuAuth,
  // 注意：getRoleMenuTreeSelect 已在角色管理模块中导出，避免重复导出
} from "./system/menu";

// 部门管理
export {
  listDept,
  getDept,
  addDept,
  updateDept,
  delDept,
  deptTreeSelect as getDeptTreeSelect,
  roleDeptTreeSelect,
  checkDeptNameUnique,
  listDeptExcludeChild,
  exportDept,
  // 部门权限相关
  getDeptAuth,
  updateDeptAuth,
} from "./system/dept";

// 岗位管理
export {
  listPost as listPostList,
  getPost,
  addPost,
  updatePost,
  delPost,
  checkPostNameUnique,
  checkPostCodeUnique,
  // 岗位权限相关
  getPostAuth,
  updatePostAuth,
  // 辅助接口
  getPostOptionSelect,
  exportPost,
} from "./system/post";

// 系统监控API
export { getServerInfo, getDruidInfo } from "./monitor/server";

// 用户验证API
export { checkUsername, checkPhone, checkEmail, sendRegisterCode, sendRegisterEmailCode } from "./validate";

// 系统配置管理API
export {
  listConfig,
  getConfig,
  addConfig,
  updateConfig,
  delConfig,
  exportConfig,
  refreshConfigCache,
  clearConfigCache,
  // 配置获取接口
  getConfigKey,
  getConfigByKey,
  getBatchConfigKeys,
} from "./system/config";

// 字典管理API
export {
  // 字典类型管理
  listDictType,
  getDictType,
  addDictType,
  updateDictType,
  delDictType,
  checkDictTypeUnique,
  getDictTypeOptionSelect,
  exportDictType,
  refreshDictCache,
  // 字典数据管理
  listDictData,
  getDictDataByType,
  getDictData,
  addDictData,
  updateDictData,
  delDictData,
  checkDictValueUnique,
  exportDictData,
} from "./system/dict";

// 系统日志管理API
export {
  listOperLog,
  getOperLog,
  delOperLog,
  cleanOperLog,
  exportOperLog,
  listLoginInfo,
  getLoginInfo,
  delLoginInfo,
  cleanLoginInfo,
  unlockLoginInfo,
  exportLoginInfo,
} from "./system/log";

// 在线用户管理API
export { listOnlineUser, getOnlineUser, forceLogout } from "./system/online";

// 用户设置管理API
export {
  getUserLoginLogs,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
  exportUserData,
  requestAccountDeletion,
  cancelAccountDeletion,
  verifyCurrentPassword,
  setupTwoFactorAuth,
  verifyTwoFactorCode,
} from "./userSettings";

// 导出类型定义
export type {
  // 认证相关类型
  UserInfo,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CaptchaResponse,
  UserInfoResponse,
  RoutersResponse,
  LogoutResponse,
  LoginStatus,
  RegisterStatus,
  CodeType,
} from "@/types/auth";

// 系统管理相关类型
export type {
  // 用户管理类型
  SystemUser,
  SystemDept,
  SystemRole,
  SystemPost,
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
} from "@/types/system/user";

// 系统配置管理类型
export type {
  SystemConfig,
  ConfigQueryParams,
  ConfigForm,
  ConfigListResponse,
  ConfigDetailResponse,
  ConfigOptionResponse,
} from "@/types/system/config";

// 字典管理类型
export type {
  DictType,
  DictData,
  DictTypeQueryParams,
  DictDataQueryParams,
  DictTypeForm,
  DictDataForm,
  DictTypeListResponse,
  DictTypeDetailResponse,
  DictTypeOptionResponse,
  DictDataListResponse,
  DictDataDetailResponse,
  DictDataOptionResponse,
} from "@/types/system/dict";

// 系统日志管理类型
export type {
  OperLog,
  LoginInfo,
  OperLogQueryParams,
  LoginInfoQueryParams,
  OperLogListResponse,
  LoginInfoListResponse,
} from "@/types/system/log";

// 在线用户管理类型
export type {
  OnlineUser,
  OnlineUserQueryParams,
  OnlineUserListResponse,
  OnlineUserDetailResponse,
} from "@/types/system/online";

// 用户设置管理类型
export type { UserProfileUpdateRequest, LoginLog, NotificationSettings, PrivacySettings } from "./userSettings";

// 系统监控相关类型
export type { ServerInfo, DruidInfo, ServerInfoResponse, DruidInfoResponse } from "@/types/monitor/server";

// 用户验证相关类型
export type {
  CheckUsernameRequest,
  CheckPhoneRequest,
  CheckEmailRequest,
  SendPhoneCodeRequest,
  SendEmailCodeRequest,
  CheckResponse,
  SendCodeResponse,
} from "@/types/validate";

// 通用API类型
export type { ApiResponse, PageResponse, RequestConfig, ErrorResponse } from "@/types/api";
