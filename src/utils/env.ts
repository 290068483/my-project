// src/utils/env.ts

// 环境变量类型定义
interface EnvVariables {
  VITE_APP_TITLE: string;
  VITE_API_BASE_URL: string;
  VITE_WS_BASE_URL: string;
  VITE_STATIC_BASE_URL: string;
  VITE_PORT: number;
  VITE_USE_MOCK: boolean;
  VITE_DEBUG: boolean;
  VITE_TIMEOUT: number;
  VITE_ROUTER_MODE: "hash" | "history";
}

// 从全局对象中获取环境变量
const env = import.meta.env as unknown as EnvVariables;

// 导出环境变量工具函数
export const getEnv = (): EnvVariables => {
  return {
    VITE_APP_TITLE: env.VITE_APP_TITLE || "蓝桉管理系统",
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || "http://localhost:3000",
    VITE_WS_BASE_URL: env.VITE_WS_BASE_URL || "ws://localhost:3000",
    VITE_STATIC_BASE_URL: env.VITE_STATIC_BASE_URL || "/static",
    VITE_PORT: Number(env.VITE_PORT) || 5173,
    VITE_USE_MOCK: env.VITE_USE_MOCK || false,
    VITE_DEBUG: env.VITE_DEBUG || false,
    VITE_TIMEOUT: Number(env.VITE_TIMEOUT) || 30000,
    VITE_ROUTER_MODE: (env.VITE_ROUTER_MODE as "hash" | "history") || "hash",
  };
};

// 导出日志函数，根据环境配置输出不同级别的日志
export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    const { VITE_DEBUG } = getEnv();
    if (VITE_DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
};

// 导出常用环境变量
export const API_BASE_URL = getEnv().VITE_API_BASE_URL;
export const WS_BASE_URL = getEnv().VITE_WS_BASE_URL;
export const STATIC_BASE_URL = getEnv().VITE_STATIC_BASE_URL;
export const PORT = getEnv().VITE_PORT;
export const USE_MOCK = getEnv().VITE_USE_MOCK;
export const DEBUG = getEnv().VITE_DEBUG;
export const TIMEOUT = getEnv().VITE_TIMEOUT;
export const ROUTER_MODE = getEnv().VITE_ROUTER_MODE;

export default getEnv;
