import type { App } from "vue";
import { permission } from "./permission";
import hasPermi from "./permission/hasPermi";

// 注册全局指令
export function setupDirectives(app: App) {
  // 注册权限指令
  app.directive("permission", permission);
  app.directive("hasPermi", hasPermi);
}

/**
 * 导出所有指令相关的内容
 */
export * from "./permission";