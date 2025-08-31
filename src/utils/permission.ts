import { useUserStore } from "@/stores/user";

/**
 * 字符权限校验
 * @param value 权限值数组
 * @returns boolean 是否有权限
 */
export function checkPermi(value: string[]): boolean {
  if (value && Array.isArray(value) && value.length > 0) {
    const userStore = useUserStore();
    const permissions = userStore.permissions;
    const permissionDatas = value;
    const allPermission = "*:*:*";

    const hasPermission = permissions.some((permission) => {
      return allPermission === permission || permissionDatas.includes(permission);
    });

    return hasPermission;
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`);
    return false;
  }
}

/**
 * 角色权限校验
 * @param value 角色值数组
 * @returns boolean 是否有角色权限
 */
export function checkRole(value: string[]): boolean {
  if (value && Array.isArray(value) && value.length > 0) {
    const userStore = useUserStore();
    const roles = userStore.roles;
    const permissionRoles = value;
    const superAdmin = "admin";

    const hasRole = roles.some((role) => {
      return superAdmin === role || permissionRoles.includes(role);
    });

    return hasRole;
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`);
    return false;
  }
}
