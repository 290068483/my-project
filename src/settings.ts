/**
 * 全局设置配置文件
 * 基于 RuoYi 架构设计，统一管理系统配置
 */

import config from "@/config/index";

// ==================== 系统基础配置 ====================
export const APP_SETTINGS = {
  // 应用基本信息
  APP_NAME: "Lanan Management",
  APP_VERSION: "1.0.0",
  APP_DESCRIPTION: "基于 Vue 3 + TypeScript 的管理系统",

  // 开发者信息
  DEVELOPER: "Lanan Team",
  COPYRIGHT: "© 2024 Lanan Management",

  // 系统标识
  SYSTEM_ID: "lanan-management",
  BUILD_TIME: new Date().toISOString(),
} as const;

// ==================== 主题配置 ====================
export const THEME_SETTINGS = {
  // 默认主题
  DEFAULT_THEME: "light",

  // 可用主题列表
  AVAILABLE_THEMES: ["light", "dark", "auto"] as const,

  // 主题颜色配置
  THEME_COLORS: {
    primary: "#409EFF",
    success: "#67C23A",
    warning: "#E6A23C",
    danger: "#F56C6C",
    info: "#909399",
  },

  // 布局配置
  LAYOUT: {
    SIDEBAR_WIDTH: "200px",
    SIDEBAR_COLLAPSED_WIDTH: "64px",
    HEADER_HEIGHT: "60px",
    FOOTER_HEIGHT: "40px",
    CONTENT_PADDING: "20px",
  },

  // 组件尺寸
  DEFAULT_SIZE: "default" as "large" | "default" | "small",
} as const;

// ==================== 路由配置 ====================
export const ROUTER_SETTINGS = {
  // 默认路由
  DEFAULT_ROUTE: "/dashboard",

  // 登录页路由
  LOGIN_ROUTE: "/login",

  // 404页面路由
  NOT_FOUND_ROUTE: "/404",

  // 路由模式
  ROUTER_MODE: config.routerMode || "hash",

  // 路由切换时是否显示进度条
  SHOW_PROGRESS_BAR: true,

  // 路由切换动画
  ROUTE_TRANSITION: "fade-transform",

  // 面包屑配置
  BREADCRUMB: {
    SHOW: true,
    SHOW_ICON: true,
    SEPARATOR: "/",
  },
} as const;

// ==================== 请求配置 ====================
export const REQUEST_SETTINGS = {
  // API基础配置
  BASE_URL: config.baseUrl,
  TIMEOUT: config.timeout,

  // 请求重试配置
  RETRY: {
    ENABLE: true,
    MAX_COUNT: 3,
    DELAY: 1000, // 重试延迟（毫秒）
  },

  // 请求缓存配置
  CACHE: {
    ENABLE: false,
    MAX_AGE: 5 * 60 * 1000, // 5分钟
  },

  // 请求头配置
  HEADERS: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },

  // 错误处理配置
  ERROR_HANDLING: {
    SHOW_MESSAGE: true,
    MESSAGE_DURATION: 3000,
    IGNORE_CODES: [401, 403], // 忽略的错误码
  },
} as const;

// ==================== 表格配置 ====================
export const TABLE_SETTINGS = {
  // 默认分页配置
  PAGINATION: {
    PAGE_SIZE: 20,
    PAGE_SIZES: [10, 20, 50, 100],
    LAYOUT: "total, sizes, prev, pager, next, jumper",
    SHOW_QUICK_JUMPER: true,
    SHOW_SIZE_CHANGER: true,
    SHOW_TOTAL: true,
  },

  // 表格默认配置
  DEFAULT_PROPS: {
    stripe: true, // 斑马纹
    border: true, // 边框
    size: "default", // 尺寸
    fit: true, // 列宽自适应
    highlight_current_row: true, // 高亮当前行
    empty_text: "暂无数据",
  },

  // 操作列配置
  ACTION_COLUMN: {
    WIDTH: "160px",
    FIXED: "right",
    LABEL: "操作",
  },
} as const;

// ==================== 表单配置 ====================
export const FORM_SETTINGS = {
  // 默认表单配置
  DEFAULT_PROPS: {
    label_position: "right",
    label_width: "100px",
    size: "default",
    validate_on_rule_change: false,
  },

  // 表单验证配置
  VALIDATION: {
    trigger: "blur",
    show_message: true,
    inline_message: false,
  },

  // 日期格式配置
  DATE_FORMAT: {
    DATE: "YYYY-MM-DD",
    DATETIME: "YYYY-MM-DD HH:mm:ss",
    TIME: "HH:mm:ss",
    MONTH: "YYYY-MM",
    YEAR: "YYYY",
  },
} as const;

// ==================== 文件上传配置 ====================
export const UPLOAD_SETTINGS = {
  // 文件大小限制（字节）
  MAX_SIZE: {
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 100 * 1024 * 1024, // 100MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    EXCEL: 5 * 1024 * 1024, // 5MB
  },

  // 允许的文件类型
  ALLOWED_TYPES: {
    IMAGE: ["jpg", "jpeg", "png", "gif", "webp"],
    VIDEO: ["mp4", "avi", "mov", "wmv"],
    DOCUMENT: ["pdf", "doc", "docx", "txt"],
    EXCEL: ["xls", "xlsx", "csv"],
  },

  // 上传配置
  UPLOAD_URL: "/api/upload",
  CHUNK_SIZE: 1024 * 1024, // 1MB 分片大小
  CONCURRENT_UPLOADS: 3, // 并发上传数量
} as const;

// ==================== 权限配置 ====================
export const PERMISSION_SETTINGS = {
  // 权限模式
  MODE: "RBAC", // Role-Based Access Control

  // 权限检查模式
  CHECK_MODE: {
    STRICT: true, // 严格模式
    CACHE_PERMISSIONS: true, // 缓存权限
    AUTO_REFRESH: false, // 自动刷新权限
  },

  // 权限失效处理
  PERMISSION_DENIED: {
    REDIRECT_TO_LOGIN: true,
    SHOW_ERROR_PAGE: false,
    ERROR_MESSAGE: "您没有权限访问此功能",
  },

  // 超级管理员配置
  SUPER_ADMIN: {
    ROLES: ["super-admin"],
    BYPASS_PERMISSION_CHECK: true,
  },
} as const;

// ==================== 缓存配置 ====================
export const CACHE_SETTINGS = {
  // 本地存储配置
  STORAGE: {
    PREFIX: config.storagePrefix,
    EXPIRE_TIME: 7 * 24 * 60 * 60 * 1000, // 7天
    AUTO_CLEAR: true,
  },

  // 用户信息缓存
  USER_INFO: {
    KEY: "user-info",
    EXPIRE_TIME: 24 * 60 * 60 * 1000, // 24小时
  },

  // Token缓存
  TOKEN: {
    KEY: "token",
    REFRESH_KEY: "refresh-token",
    AUTO_REFRESH: true,
    REFRESH_THRESHOLD: 30 * 60 * 1000, // 30分钟内自动刷新
  },

  // 路由缓存
  ROUTE_CACHE: {
    ENABLE: true,
    MAX_CACHE_PAGES: 10,
    EXCLUDE_ROUTES: ["/login", "/404"],
  },
} as const;

// ==================== 日志配置 ====================
export const LOG_SETTINGS = {
  // 日志级别
  LEVEL: config.debug ? "debug" : "error",

  // 日志输出
  OUTPUT: {
    CONSOLE: config.debug,
    LOCAL_STORAGE: false,
    REMOTE: false,
  },

  // 日志格式
  FORMAT: {
    TIMESTAMP: true,
    LEVEL: true,
    MODULE: true,
    STACK_TRACE: config.debug,
  },

  // 日志保留
  RETENTION: {
    MAX_LOGS: 1000,
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7天
  },
} as const;

// ==================== 通知配置 ====================
export const NOTIFICATION_SETTINGS = {
  // 默认配置
  DEFAULT: {
    position: "top-right",
    duration: 3000,
    show_close: true,
    type: "info",
  },

  // 消息类型配置
  MESSAGE_TYPES: {
    success: { duration: 2000, type: "success" },
    warning: { duration: 3000, type: "warning" },
    error: { duration: 5000, type: "error" },
    info: { duration: 3000, type: "info" },
  },

  // 系统通知
  SYSTEM_NOTIFICATION: {
    enable: true,
    max_count: 99,
    auto_clear: true,
    clear_interval: 30 * 60 * 1000, // 30分钟
  },
} as const;

// ==================== 开发配置 ====================
export const DEV_SETTINGS = {
  // 开发工具
  ENABLE_DEVTOOLS: config.env === "development",

  // 性能监控
  PERFORMANCE_MONITOR: config.debug,

  // 错误边界
  ERROR_BOUNDARY: true,

  // 热更新
  HOT_RELOAD: config.env === "development",

  // API Mock
  ENABLE_MOCK: config.useMock,

  // 调试信息
  DEBUG_INFO: {
    show_version: config.debug,
    show_build_time: config.debug,
    show_router_info: config.debug,
    show_store_state: config.debug,
  },
} as const;

// ==================== 导出配置类型 ====================
export type AppSettings = typeof APP_SETTINGS;
export type ThemeSettings = typeof THEME_SETTINGS;
export type RouterSettings = typeof ROUTER_SETTINGS;
export type RequestSettings = typeof REQUEST_SETTINGS;
export type TableSettings = typeof TABLE_SETTINGS;
export type FormSettings = typeof FORM_SETTINGS;
export type UploadSettings = typeof UPLOAD_SETTINGS;
export type PermissionSettings = typeof PERMISSION_SETTINGS;
export type CacheSettings = typeof CACHE_SETTINGS;
export type LogSettings = typeof LOG_SETTINGS;
export type NotificationSettings = typeof NOTIFICATION_SETTINGS;
export type DevSettings = typeof DEV_SETTINGS;

// ==================== 配置获取工具函数 ====================

/**
 * 获取应用设置
 */
export function getAppSettings(): AppSettings {
  return APP_SETTINGS;
}

/**
 * 获取主题设置
 */
export function getThemeSettings(): ThemeSettings {
  return THEME_SETTINGS;
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): string {
  return localStorage.getItem(`${CACHE_SETTINGS.STORAGE.PREFIX}theme`) || THEME_SETTINGS.DEFAULT_THEME;
}

/**
 * 设置当前主题
 */
export function setCurrentTheme(theme: string): void {
  const availableThemes = THEME_SETTINGS.AVAILABLE_THEMES as readonly string[];
  if (availableThemes.includes(theme)) {
    localStorage.setItem(`${CACHE_SETTINGS.STORAGE.PREFIX}theme`, theme);
  }
}

/**
 * 获取表格默认分页设置
 */
export function getDefaultPagination() {
  return {
    currentPage: 1,
    pageSize: TABLE_SETTINGS.PAGINATION.PAGE_SIZE,
    total: 0,
    pageSizes: TABLE_SETTINGS.PAGINATION.PAGE_SIZES,
    layout: TABLE_SETTINGS.PAGINATION.LAYOUT,
  };
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 检查文件类型是否允许
 */
export function isFileTypeAllowed(fileName: string, category: keyof typeof UPLOAD_SETTINGS.ALLOWED_TYPES): boolean {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) return false;

  const allowedTypes = UPLOAD_SETTINGS.ALLOWED_TYPES[category] as readonly string[];
  return allowedTypes.includes(extension);
}

/**
 * 检查文件大小是否超限
 */
export function isFileSizeExceeded(fileSize: number, category: keyof typeof UPLOAD_SETTINGS.MAX_SIZE): boolean {
  return fileSize > UPLOAD_SETTINGS.MAX_SIZE[category];
}

/**
 * 获取环境信息
 */
export function getEnvironmentInfo() {
  return {
    app: APP_SETTINGS.APP_NAME,
    version: APP_SETTINGS.APP_VERSION,
    environment: config.env,
    buildTime: APP_SETTINGS.BUILD_TIME,
    debug: config.debug,
    baseUrl: config.baseUrl,
  };
}

/**
 * 是否为开发环境
 */
export function isDevelopment(): boolean {
  return config.env === "development";
}

/**
 * 是否为生产环境
 */
export function isProduction(): boolean {
  return config.env === "production";
}

/**
 * 使用示例：
 *
 * 1. 获取配置：
 *    import { TABLE_SETTINGS, getDefaultPagination } from '@/settings'
 *    const pagination = getDefaultPagination()
 *
 * 2. 主题设置：
 *    import { getCurrentTheme, setCurrentTheme } from '@/settings'
 *    setCurrentTheme('dark')
 *
 * 3. 文件上传检查：
 *    import { isFileTypeAllowed, isFileSizeExceeded } from '@/settings'
 *    if (isFileTypeAllowed(file.name, 'IMAGE')) {
 *      // 允许上传
 *    }
 *
 * 4. 环境判断：
 *    import { isDevelopment } from '@/settings'
 *    if (isDevelopment()) {
 *      console.log('开发环境')
 *    }
 */
