/**
 * 系统监控 API
 * 基于 RuoYi 架构设计，符合API接口文档规范
 */

import { request } from "@/utils/request/index";
import type { ApiResponse } from "@/types/api";

// ==================== 监控数据类型定义 ====================

/**
 * 服务器信息接口
 */
export interface ServerInfo {
  /** CPU相关信息 */
  cpu: {
    /** CPU核心数 */
    cpuNum: number;
    /** CPU总的使用率 */
    total: number;
    /** CPU系统使用率 */
    sys: number;
    /** CPU用户使用率 */
    used: number;
    /** CPU当前等待率 */
    wait: number;
    /** CPU当前空闲率 */
    free: number;
  };
  /** 内存相关信息 */
  mem: {
    /** 内存总量 */
    total: string;
    /** 已用内存 */
    used: string;
    /** 剩余内存 */
    free: string;
    /** 使用率 */
    usage: number;
  };
  /** JVM信息 */
  jvm: {
    /** JVM名称 */
    name: string;
    /** JVM版本 */
    version: string;
    /** JVM启动时间 */
    startTime: string;
    /** JVM运行时长 */
    runTime: string;
    /** JVM安装路径 */
    home: string;
    /** JVM最大可用内存 */
    max: string;
    /** JVM已分配内存 */
    total: string;
    /** JVM已使用内存 */
    used: string;
    /** JVM剩余内存 */
    free: string;
    /** JVM使用率 */
    usage: number;
  };
  /** 服务器信息 */
  sys: {
    /** 服务器名称 */
    computerName: string;
    /** 服务器IP */
    computerIp: string;
    /** 项目路径 */
    userDir: string;
    /** 操作系统 */
    osName: string;
    /** 系统架构 */
    osArch: string;
  };
  /** 磁盘相关信息 */
  sysFiles: Array<{
    /** 盘符路径 */
    dirName: string;
    /** 盘符类型 */
    sysTypeName: string;
    /** 文件类型 */
    typeName: string;
    /** 总大小 */
    total: string;
    /** 剩余大小 */
    free: string;
    /** 已使用大小 */
    used: string;
    /** 资源使用率 */
    usage: number;
  }>;
}

/**
 * 数据源监控信息接口
 */
export interface DruidInfo {
  /** 数据源URL */
  url: string;
  /** 数据库驱动 */
  driverClassName: string;
  /** 数据库用户名 */
  username: string;
  /** 连接池初始大小 */
  initialSize: number;
  /** 连接池最小空闲 */
  minIdle: number;
  /** 连接池最大活跃数 */
  maxActive: number;
  /** 获取连接超时时间 */
  maxWait: number;
  /** 连接池活跃数 */
  activeCount: number;
  /** 连接池空闲数 */
  poolingCount: number;
}

// ==================== 响应类型定义 ====================

/**
 * 服务器信息响应
 */
export interface ServerInfoResponse extends ApiResponse<ServerInfo> {
  // RuoYi标准服务器信息响应格式
  code: number;
  msg: string;
}

/**
 * 数据源监控响应
 */
export interface DruidInfoResponse extends ApiResponse<DruidInfo> {
  // RuoYi标准数据源监控响应格式
  code: number;
  msg: string;
}

// ==================== 监控接口 ====================

/**
 * 获取服务器信息
 */
export function getServerInfo(): Promise<ServerInfoResponse> {
  return request.get("/monitor/server");
}

/**
 * 获取数据源监控信息
 */
export function getDruidInfo(): Promise<DruidInfoResponse> {
  return request.get("/monitor/druid");
}
