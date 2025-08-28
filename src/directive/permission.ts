import type { App, Directive, DirectiveBinding } from "vue";
import { AuthUtils } from "@/utils/auth";
import type { PermissionOptions } from "@/types/auth";

/**
 * 权限指令类型定义
 */
interface PermissionBinding extends DirectiveBinding {
  value: string | string[] | PermissionOptions;
}

/**
 * 权限检查函数
 * @param value 指令值
 * @returns boolean
 */
function checkPermission(value: string | string[] | PermissionOptions): boolean {
  // 如果用户未登录，直接返回 false
  if (!AuthUtils.isLoggedIn()) {
    return false;
  }

  // 处理字符串类型（单个权限）
  if (typeof value === "string") {
    return AuthUtils.hasPermission(value);
  }

  // 处理字符串数组类型（多个权限，默认或关系）
  if (Array.isArray(value)) {
    return AuthUtils.hasPermission(value);
  }

  // 处理对象类型（复杂权限配置）
  if (typeof value === "object" && value !== null) {
    const { roles, permissions, mode = "or" } = value;

    let hasRoleAccess = true;
    let hasPermissionAccess = true;

    // 检查角色权限
    if (roles && roles.length > 0) {
      hasRoleAccess = mode === "and" ? AuthUtils.hasAllRoles(roles) : AuthUtils.hasRole(roles);
    }

    // 检查功能权限
    if (permissions && permissions.length > 0) {
      hasPermissionAccess =
        mode === "and" ? AuthUtils.hasAllPermissions(permissions) : AuthUtils.hasPermission(permissions);
    }

    // 根据模式返回结果
    if (mode === "or") {
      return hasRoleAccess || hasPermissionAccess;
    } else {
      return hasRoleAccess && hasPermissionAccess;
    }
  }

  return false;
}

/**
 * 权限指令实现
 */
const permission: Directive = {
  // Vue 3 的 mounted 钩子
  mounted(el: HTMLElement, binding: PermissionBinding) {
    const hasPermission = checkPermission(binding.value);

    if (!hasPermission) {
      // 移除元素
      el.remove();
    }
  },

  // Vue 3 的 updated 钩子
  updated(el: HTMLElement, binding: PermissionBinding) {
    const hasPermission = checkPermission(binding.value);

    if (!hasPermission) {
      // 移除元素
      el.remove();
    }
  },
};

/**
 * 权限显示/隐藏指令（不移除DOM，只控制显示）
 */
const permissionShow: Directive = {
  mounted(el: HTMLElement, binding: PermissionBinding) {
    const hasPermission = checkPermission(binding.value);

    if (!hasPermission) {
      el.style.display = "none";
    }
  },

  updated(el: HTMLElement, binding: PermissionBinding) {
    const hasPermission = checkPermission(binding.value);

    if (!hasPermission) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  },
};

/**
 * 角色指令（专门用于角色检查）
 */
const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const value = binding.value;
    let hasRole = false;

    if (typeof value === "string") {
      hasRole = AuthUtils.hasRole(value);
    } else if (Array.isArray(value)) {
      hasRole = AuthUtils.hasRole(value);
    }

    if (!hasRole) {
      el.remove();
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const value = binding.value;
    let hasRole = false;

    if (typeof value === "string") {
      hasRole = AuthUtils.hasRole(value);
    } else if (Array.isArray(value)) {
      hasRole = AuthUtils.hasRole(value);
    }

    if (!hasRole) {
      el.remove();
    }
  },
};

/**
 * 权限指令安装函数
 * @param app Vue应用实例
 */
export function setupPermissionDirective(app: App): void {
  // 注册权限指令
  app.directive("permission", permission);

  // 注册权限显示指令
  app.directive("permission-show", permissionShow);

  // 注册角色指令
  app.directive("role", role);
}

/**
 * 导出指令和工具函数
 */
export { permission, permissionShow, role, checkPermission };

/**
 * 权限指令使用说明：
 *
 * 1. 基础用法（单个权限）：
 *    <el-button v-permission="'user:add'">新增用户</el-button>
 *
 * 2. 多个权限（或关系）：
 *    <el-button v-permission="['user:add', 'user:edit']">操作按钮</el-button>
 *
 * 3. 复杂权限配置：
 *    <el-button v-permission="{ permissions: ['user:add'], roles: ['admin'], mode: 'and' }">
 *      管理员新增
 *    </el-button>
 *
 * 4. 角色检查：
 *    <div v-role="'admin'">管理员专用内容</div>
 *    <div v-role="['admin', 'manager']">管理员或经理可见</div>
 *
 * 5. 显示/隐藏（不移除DOM）：
 *    <div v-permission-show="'user:view'">用户信息</div>
 */
