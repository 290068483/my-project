import { useUserStore } from "@/stores/user";
import type { App, Directive, DirectiveBinding } from "vue";

/**
 * 权限检查函数
 * @param el 元素
 * @param binding 指令绑定信息
 */
const checkPermission = (el: HTMLElement, binding: DirectiveBinding) => {
  const { value } = binding;
  const userStore = useUserStore();
  const allPermission = "*:*:*";
  const permissions = userStore.permissions;

  if (value && Array.isArray(value) && value.length > 0) {
    const permissionFlag = value;

    const hasPermissions = permissions.some((permission) => {
      return allPermission === permission || permissionFlag.includes(permission);
    });

    if (!hasPermissions) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  } else {
    throw new Error("请设置操作权限标签值");
  }
};

/**
 * 权限指令
 */
const hasPermi: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};

export default hasPermi;