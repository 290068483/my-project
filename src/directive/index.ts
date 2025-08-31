import type { App } from "vue";
import { setupPermissionDirective } from "./permission";

// 注册全局指令
export function setupDirectives(app: App) {
  // 注册权限指令
  setupPermissionDirective(app);
}

/**
 * 导出所有指令相关的内容
 */
export * from "./permission";
