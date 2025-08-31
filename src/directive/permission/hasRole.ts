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

    // 添加安全检查
    if (!value) {
      console.warn("角色指令未设置值");
      return;
    }

    if (!Array.isArray(value)) {
      console.error("角色指令值必须是数组");
      throw new Error(`角色指令值必须是数组`);
    }

    if (value.length === 0) {
      console.warn("角色指令值为空数组");
      return;
    }

    const roleFlag = value;
    const hasRole = roles.some((role) => {
      return superAdmin === role || roleFlag.includes(role);
    });

    if (!hasRole) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  },

  // 添加updated钩子以支持动态更新
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 可以在这里处理角色更新的情况
    this.mounted && this.mounted(el, binding);
  },
};

export default hasRole;
