/**
 * 应用配置统一出口
 * 从环境变量中读取配置，提供类型转换、默认值和验证
 */

// 基础配置（所有环境共享）
const baseConfig = {
  // API基础路径
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  // WebSocket基础地址
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000',

  // 静态资源基础路径
  staticBaseUrl: import.meta.env.VITE_STATIC_BASE_URL || '/static',

  // 端口号
  port: Number(import.meta.env.VITE_PORT) || 5173,

  // 是否启用Mock
  useMock: import.meta.env.VITE_USE_MOCK === 'true',

  // 是否开启调试模式
  debug: import.meta.env.VITE_DEBUG === 'true',

  // 请求超时时间（毫秒）
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 30000,

  // 路由模式
  routerMode: import.meta.env.VITE_ROUTER_MODE || 'hash',

  // 本地存储键名前缀（避免与其他项目冲突）
  storagePrefix: 'lanan_managerment_',
}

// 开发环境特有配置
const devConfig = {
  // 热更新间隔（毫秒）
  hmrInterval: 300,
  // 是否显示性能分析
  showPerformance: false,
  // 开发环境日志级别
  logLevel: 'debug',
  // 是否启用Vue DevTools
  enableDevTools: true,
}

// 生产环境特有配置
const prodConfig = {
  // 是否启用错误监控
  enableErrorTracking: true,
  // 生产环境日志级别
  logLevel: 'error',
  // 是否启用性能监控
  enablePerformanceTracking: true,
}

// 环境特定配置
const envConfig = import.meta.env.MODE === 'production' ? prodConfig : devConfig

// 合并基础配置和环境特定配置
const config = {
  ...baseConfig,
  ...envConfig,
  // 环境标识
  env: import.meta.env.MODE || 'development',
  // 应用名称
  appName: 'Lanan Managerment',
  // 应用版本
  appVersion: '1.0.0',
}

// 配置验证
function validateConfig(config) {
  const errors = []

  // 验证API地址
  if (!config.baseUrl) {
    errors.push('API基础路径未配置')
  }

  // 验证端口号
  if (isNaN(config.port) || config.port <= 0 || config.port > 65535) {
    errors.push('端口号无效')
  }

  // 输出验证错误
  if (errors.length > 0 && config.debug) {
    console.error('配置验证失败:', errors)
  }

  return errors.length === 0
}

// 执行配置验证
validateConfig(config)

export default config

export { config }
