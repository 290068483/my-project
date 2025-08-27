import type { App } from "vue";
import { setupPermissionDirective } from "./permission";

/**
 * 安装所有指令
 * @param app Vue应用实例
 */
export function setupDirectives(app: App): void {
  // 安装权限指令
  setupPermissionDirective(app);

  // 可以在这里添加其他指令的安装
  // setupOtherDirective(app)
}

/**
 * 导出所有指令相关的内容
 */
export * from "./permission";
