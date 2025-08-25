// src/types/env.d.ts

// 扩展ImportMetaEnv接口以提供环境变量的类型提示
interface ImportMetaEnv {
  // 应用运行环境
  readonly NODE_ENV: "development" | "production" | "test";

  // 应用运行端口
  readonly VITE_PORT: string;

  // API基础路径
  readonly VITE_API_BASE_URL: string;

  // WebSocket基础地址
  readonly VITE_WS_BASE_URL: string;

  // 静态资源基础路径
  readonly VITE_STATIC_BASE_URL: string;

  // 是否启用Mock
  readonly VITE_USE_MOCK: "true" | "false";

  // 是否开启调试模式
  readonly VITE_DEBUG: "true" | "false";

  // 接口请求超时时间（毫秒）
  readonly VITE_TIMEOUT: string;

  // 路由模式
  readonly VITE_ROUTER_MODE: "hash" | "history";

  // 可选：CDN地址
  readonly VITE_CDN_URL?: string;

  // 可选：是否启用性能监控
  readonly VITE_ENABLE_PERF_MONITORING?: "true" | "false";

  // 可选：日志级别
  readonly VITE_LOG_LEVEL?: "error" | "warn" | "info" | "debug";
}

// 提供ImportMeta类型声明
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
