import { useUserStore } from "@/stores/user";
import type { Directive, DirectiveBinding } from "vue";

/**
 * 角色权限处理
 */
const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const userStore = useUserStore();
    const superAdmin = "admin";
    const roles = userStore.roles;

    if (value && Array.isArray(value) && value.length > 0) {
      const roleFlag = value;

      const hasRole = roles.some((role) => {
        return superAdmin === role || roleFlag.includes(role);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置角色权限标签值`);
    }
  },
};

export default hasRole;
