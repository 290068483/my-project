import { useUserStore } from "@/stores/user";
import type { Directive, DirectiveBinding } from "vue";

/**
 * 操作权限处理
 */
const hasPermi: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
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
      throw new Error(`请设置操作权限标签值`);
    }
  },
};

export default hasPermi;
