/**
 * 系统权限常量定义
 * 按模块组织权限代码，方便管理和维护
 * 遵循RuoYi标准权限命名规范
 */

// ==================== 系统管理权限 ====================
export const SYSTEM_PERMISSIONS = {
  // 用户管理
  USER_LIST: "system:user:list",
  USER_ADD: "system:user:add",
  USER_EDIT: "system:user:edit",
  USER_REMOVE: "system:user:remove",
  USER_EXPORT: "system:user:export",
  USER_IMPORT: "system:user:import",
  USER_RESET_PWD: "system:user:resetPwd",

  // 角色管理
  ROLE_LIST: "system:role:list",
  ROLE_ADD: "system:role:add",
  ROLE_EDIT: "system:role:edit",
  ROLE_REMOVE: "system:role:remove",

  // 菜单管理
  MENU_LIST: "system:menu:list",
  MENU_ADD: "system:menu:add",
  MENU_EDIT: "system:menu:edit",
  MENU_REMOVE: "system:menu:remove",

  // 部门管理
  DEPT_LIST: "system:dept:list",
  DEPT_ADD: "system:dept:add",
  DEPT_EDIT: "system:dept:edit",
  DEPT_REMOVE: "system:dept:remove",

  // 岗位管理
  POST_LIST: "system:post:list",
  POST_ADD: "system:post:add",
  POST_EDIT: "system:post:edit",
  POST_REMOVE: "system:post:remove",

  // 系统配置
  CONFIG_LIST: "system:config:list",
  CONFIG_ADD: "system:config:add",
  CONFIG_EDIT: "system:config:edit",
  CONFIG_REMOVE: "system:config:remove",

  // 系统监控
  MONITOR_ONLINE: "monitor:online:list",
  MONITOR_JOB: "monitor:job:list",
  MONITOR_DRUID: "monitor:druid:list",
  MONITOR_SERVER: "monitor:server:list",
  MONITOR_CACHE: "monitor:cache:list",

  // 日志管理
  LOG_OPERATION: "monitor:operlog:list",
  LOG_LOGIN: "monitor:logininfor:list",
} as const;

// ==================== 业务模块权限 ====================
export const BUSINESS_PERMISSIONS = {
  // 订单管理
  ORDER_VIEW: "order:view",
  ORDER_ADD: "order:add",
  ORDER_EDIT: "order:edit",
  ORDER_DELETE: "order:delete",
  ORDER_EXPORT: "order:export",

  // 合同管理
  CONTRACT_VIEW: "contract:view",
  CONTRACT_ADD: "contract:add",
  CONTRACT_EDIT: "contract:edit",
  CONTRACT_DELETE: "contract:delete",

  // 安装管理
  INSTALL_VIEW: "install:view",
  INSTALL_ADD: "install:add",
  INSTALL_EDIT: "install:edit",
  INSTALL_DELETE: "install:delete",
} as const;

// ==================== 系统角色常量 ====================
export const SYSTEM_ROLES = {
  SUPER_ADMIN: "super-admin", // 超级管理员
  ADMIN: "admin", // 系统管理员
  MANAGER: "manager", // 业务管理员
  USER: "user", // 普通用户
  GUEST: "guest", // 访客
} as const;

// ==================== 权限组合常量 ====================
export const PERMISSION_GROUPS = {
  // 用户管理完整权限
  USER_FULL: [
    SYSTEM_PERMISSIONS.USER_LIST,
    SYSTEM_PERMISSIONS.USER_ADD,
    SYSTEM_PERMISSIONS.USER_EDIT,
    SYSTEM_PERMISSIONS.USER_REMOVE,
    SYSTEM_PERMISSIONS.USER_EXPORT,
    SYSTEM_PERMISSIONS.USER_IMPORT,
    SYSTEM_PERMISSIONS.USER_RESET_PWD,
  ],

  // 用户管理只读权限
  USER_READ_ONLY: [SYSTEM_PERMISSIONS.USER_LIST, SYSTEM_PERMISSIONS.USER_EXPORT],

  // 角色管理完整权限
  ROLE_FULL: [
    SYSTEM_PERMISSIONS.ROLE_LIST,
    SYSTEM_PERMISSIONS.ROLE_ADD,
    SYSTEM_PERMISSIONS.ROLE_EDIT,
    SYSTEM_PERMISSIONS.ROLE_REMOVE,
  ],

  // 菜单管理完整权限
  MENU_FULL: [
    SYSTEM_PERMISSIONS.MENU_LIST,
    SYSTEM_PERMISSIONS.MENU_ADD,
    SYSTEM_PERMISSIONS.MENU_EDIT,
    SYSTEM_PERMISSIONS.MENU_REMOVE,
  ],

  // 部门管理完整权限
  DEPT_FULL: [
    SYSTEM_PERMISSIONS.DEPT_LIST,
    SYSTEM_PERMISSIONS.DEPT_ADD,
    SYSTEM_PERMISSIONS.DEPT_EDIT,
    SYSTEM_PERMISSIONS.DEPT_REMOVE,
  ],

  // 岗位管理完整权限
  POST_FULL: [
    SYSTEM_PERMISSIONS.POST_LIST,
    SYSTEM_PERMISSIONS.POST_ADD,
    SYSTEM_PERMISSIONS.POST_EDIT,
    SYSTEM_PERMISSIONS.POST_REMOVE,
  ],

  // 系统管理完整权限
  SYSTEM_FULL: [
    SYSTEM_PERMISSIONS.CONFIG_LIST,
    SYSTEM_PERMISSIONS.CONFIG_ADD,
    SYSTEM_PERMISSIONS.CONFIG_EDIT,
    SYSTEM_PERMISSIONS.CONFIG_REMOVE,
    SYSTEM_PERMISSIONS.MONITOR_ONLINE,
    SYSTEM_PERMISSIONS.MONITOR_JOB,
    SYSTEM_PERMISSIONS.MONITOR_SERVER,
    SYSTEM_PERMISSIONS.LOG_OPERATION,
    SYSTEM_PERMISSIONS.LOG_LOGIN,
  ],
} as const;

// ==================== 角色权限映射 ====================
export const ROLE_PERMISSION_MAP = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [
    ...PERMISSION_GROUPS.USER_FULL,
    ...PERMISSION_GROUPS.ROLE_FULL,
    ...PERMISSION_GROUPS.MENU_FULL,
    ...PERMISSION_GROUPS.DEPT_FULL,
    ...PERMISSION_GROUPS.POST_FULL,
    ...PERMISSION_GROUPS.SYSTEM_FULL,
    ...Object.values(BUSINESS_PERMISSIONS),
  ],

  [SYSTEM_ROLES.ADMIN]: [
    ...PERMISSION_GROUPS.USER_FULL,
    ...PERMISSION_GROUPS.ROLE_FULL,
    ...PERMISSION_GROUPS.DEPT_FULL,
    ...PERMISSION_GROUPS.POST_FULL,
    SYSTEM_PERMISSIONS.CONFIG_LIST,
    SYSTEM_PERMISSIONS.MONITOR_SERVER,
    SYSTEM_PERMISSIONS.LOG_OPERATION,
    SYSTEM_PERMISSIONS.LOG_LOGIN,
  ],

  [SYSTEM_ROLES.MANAGER]: [
    ...PERMISSION_GROUPS.USER_READ_ONLY,
    SYSTEM_PERMISSIONS.DEPT_LIST,
    SYSTEM_PERMISSIONS.POST_LIST,
    ...Object.values(BUSINESS_PERMISSIONS),
  ],

  [SYSTEM_ROLES.USER]: [
    SYSTEM_PERMISSIONS.USER_LIST,
    BUSINESS_PERMISSIONS.ORDER_VIEW,
    BUSINESS_PERMISSIONS.CONTRACT_VIEW,
    BUSINESS_PERMISSIONS.INSTALL_VIEW,
  ],

  [SYSTEM_ROLES.GUEST]: [SYSTEM_PERMISSIONS.USER_LIST],
} as const;

/**
 * 根据角色获取权限列表
 * @param role 角色代码
 * @returns 权限数组
 */
export function getPermissionsByRole(role: string): string[] {
  const permissions = ROLE_PERMISSION_MAP[role as keyof typeof ROLE_PERMISSION_MAP];
  return permissions ? [...permissions] : [];
}

/**
 * 检查权限是否属于指定模块
 * @param permission 权限代码
 * @param module 模块名称
 * @returns boolean
 */
export function isPermissionInModule(permission: string, module: string): boolean {
  return permission.startsWith(`${module}:`);
}

/**
 * 获取所有权限列表
 * @returns 所有权限的数组
 */
export function getAllPermissions(): string[] {
  return [...Object.values(SYSTEM_PERMISSIONS), ...Object.values(BUSINESS_PERMISSIONS)];
}

/**
 * 权限使用示例：
 *
 * 1. 在模板中使用：
 *    <el-button v-permission="USER_PERMISSIONS.ADD">新增用户</el-button>
 *    <el-button v-role="SYSTEM_ROLES.ADMIN">管理员专用</el-button>
 *
 * 2. 在代码中使用：
 *    import { USER_PERMISSIONS, SYSTEM_ROLES } from '@/config/permissions'
 *    import { AuthUtils } from '@/utils/auth'
 *
 *    if (AuthUtils.hasPermission(USER_PERMISSIONS.ADD)) {
 *      // 执行新增操作
 *    }
 *
 * 3. 复杂权限检查：
 *    <div v-permission="{
 *      permissions: [USER_PERMISSIONS.VIEW],
 *      roles: [SYSTEM_ROLES.ADMIN],
 *      mode: 'and'
 *    }">
 *      管理员查看用户
 *    </div>
 */
