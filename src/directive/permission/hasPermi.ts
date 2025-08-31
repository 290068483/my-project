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

    // 添加安全检查
    if (!value) {
      console.warn("权限指令未设置值");
      return;
    }

    if (!Array.isArray(value)) {
      console.error("权限指令值必须是数组");
      throw new Error(`权限指令值必须是数组`);
    }

    if (value.length === 0) {
      console.warn("权限指令值为空数组");
      return;
    }

    const permissionFlag = value;
    const hasPermissions = permissions.some((permission) => {
      return allPermission === permission || permissionFlag.includes(permission);
    });

    if (!hasPermissions) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  },

  // 添加updated钩子以支持动态更新
  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 可以在这里处理权限更新的情况
    this.mounted && this.mounted(el, binding);
  },
};

export default hasPermi;
