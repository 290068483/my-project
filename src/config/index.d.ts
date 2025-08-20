// 配置文件类型声明

export interface AppConfig {
  // API基础路径
  baseUrl: string;

  // WebSocket基础地址
  wsBaseUrl: string;

  // 静态资源基础路径
  staticBaseUrl: string;

  // 端口号
  port: number;

  // 是否启用Mock
  useMock: boolean;

  // 是否开启调试模式
  debug: boolean;

  // 请求超时时间（毫秒）
  timeout: number;

  // 路由模式
  routerMode: string;

  // 本地存储键名前缀（避免与其他项目冲突）
  storagePrefix: string;

  // 环境标识
  env: string;

  // 应用名称
  appName: string;

  // 应用版本
  appVersion: string;

  // 热更新间隔（毫秒）
  hmrInterval?: number;

  // 是否显示性能分析
  showPerformance?: boolean;

  // 开发环境日志级别
  logLevel?: string;

  // 是否启用Vue DevTools
  enableDevTools?: boolean;

  // 是否启用错误监控
  enableErrorTracking?: boolean;

  // 生产环境日志级别
  logLevel?: string;

  // 是否启用性能监控
  enablePerformanceTracking?: boolean;
}

declare const config: AppConfig;

export default config;
export { config };
