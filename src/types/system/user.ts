/**
 * 系统用户管理相关类型定义
 * 基于 RuoYi 架构设计
 */

import type { ApiResponse, PageResponse } from "@/types/api";

// ==================== 用户基础信息 ====================

/**
 * 用户状态枚举
 */
export type UserStatus = "0" | "1"; // 0-正常 1-停用

/**
 * 用户性别枚举
 */
export type UserGender = "0" | "1" | "2"; // 0-男 1-女 2-未知

/**
 * 系统用户信息接口
 */
export interface SystemUser {
  /** 用户ID */
  userId?: number;
  /** 部门ID */
  deptId?: number;
  /** 用户账号 */
  userName: string;
  /** 用户昵称 */
  nickName: string;
  /** 用户邮箱 */
  email?: string;
  /** 手机号码 */
  phonenumber?: string;
  /** 用户性别 */
  sex?: UserGender;
  /** 头像地址 */
  avatar?: string;
  /** 密码 */
  password?: string;
  /** 帐号状态 */
  status: UserStatus;
  /** 删除标志 */
  delFlag?: string;
  /** 最后登录IP */
  loginIp?: string;
  /** 最后登录时间 */
  loginDate?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 备注 */
  remark?: string;
  /** 部门对象 */
  dept?: SystemDept;
  /** 角色对象列表 */
  roles?: SystemRole[];
  /** 角色ID列表 */
  roleIds?: number[];
  /** 岗位ID列表 */
  postIds?: number[];
  /** 角色ID */
  roleId?: number;
  /** 岗位ID */
  postId?: number;
  /** 状态切换加载状态（用于前端显示） */
  statusLoading?: boolean;
}

/**
 * 部门信息接口
 */
export interface SystemDept {
  /** 部门id */
  deptId?: number;
  /** 父部门id */
  parentId?: number;
  /** 祖级列表 */
  ancestors?: string;
  /** 部门名称 */
  deptName: string;
  /** 显示顺序 */
  orderNum?: number;
  /** 负责人 */
  leader?: string;
  /** 联系电话 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 部门状态 */
  status: string;
  /** 删除标志 */
  delFlag?: string;
  /** 父部门名称 */
  parentName?: string;
  /** 子部门 */
  children?: SystemDept[];
}

/**
 * 角色信息接口
 */
export interface SystemRole {
  /** 角色ID */
  roleId?: number;
  /** 角色名称 */
  roleName: string;
  /** 角色权限字符串 */
  roleKey: string;
  /** 显示顺序 */
  roleSort?: number;
  /** 数据范围 */
  dataScope?: string;
  /** 菜单树选择项是否关联显示 */
  menuCheckStrictly?: boolean;
  /** 部门树选择项是否关联显示 */
  deptCheckStrictly?: boolean;
  /** 角色状态 */
  status: string;
  /** 删除标志 */
  delFlag?: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 备注 */
  remark?: string;
  /** 用户是否存在此角色标识 */
  flag?: boolean;
  /** 菜单组 */
  menuIds?: number[];
  /** 部门组（数据权限） */
  deptIds?: number[];
}

/**
 * 岗位信息接口
 */
export interface SystemPost {
  /** 岗位ID */
  postId?: number;
  /** 岗位编码 */
  postCode: string;
  /** 岗位名称 */
  postName: string;
  /** 显示顺序 */
  postSort?: number;
  /** 状态 */
  status: string;
  /** 创建者 */
  createBy?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新者 */
  updateBy?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 备注 */
  remark?: string;
  /** 用户是否存在此岗位标识 */
  flag?: boolean;
}

// ==================== 请求参数接口 ====================

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  /** 当前页数 */
  pageNum?: number;
  /** 每页显示记录数 */
  pageSize?: number;
  /** 用户账号 */
  userName?: string;
  /** 手机号码 */
  phonenumber?: string;
  /** 帐号状态 */
  status?: UserStatus;
  /** 部门ID */
  deptId?: number;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
}

/**
 * 用户新增/编辑表单
 */
export interface UserForm {
  /** 用户ID */
  userId?: number;
  /** 部门ID */
  deptId?: number;
  /** 用户账号 */
  userName: string;
  /** 用户昵称 */
  nickName: string;
  /** 用户邮箱 */
  email?: string;
  /** 手机号码 */
  phonenumber?: string;
  /** 用户性别 */
  sex?: UserGender;
  /** 帐号状态 */
  status: UserStatus;
  /** 角色ID列表 */
  roleIds?: number[];
  /** 岗位ID列表 */
  postIds?: number[];
  /** 备注 */
  remark?: string;
}

/**
 * 密码重置表单
 */
export interface UserPasswordForm {
  /** 用户ID */
  userId: number;
  /** 新密码 */
  password: string;
}

/**
 * 用户个人信息表单
 */
export interface UserProfileForm {
  /** 用户昵称 */
  nickName: string;
  /** 用户邮箱 */
  email?: string;
  /** 手机号码 */
  phonenumber?: string;
  /** 用户性别 */
  sex?: UserGender;
}

/**
 * 修改密码表单
 */
export interface UserPasswordUpdateForm {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
  /** 确认密码 */
  confirmPassword: string;
}

// ==================== 响应类型定义 ====================

/**
 * 用户列表响应
 */
export interface UserListResponse extends ApiResponse<PageResponse<SystemUser>> {
  // RuoYi标准分页响应格式
  code: number;
  msg: string;
}

/**
 * 用户详情响应
 */
export interface UserDetailResponse
  extends ApiResponse<{
    user: SystemUser;
    roles: SystemRole[];
    posts: SystemPost[];
    postIds: number[];
    roleIds: number[];
  }> {
  // RuoYi标准详情响应格式
  code: number;
  msg: string;
}

/**
 * 用户权限响应
 */
export interface UserAuthResponse
  extends ApiResponse<{
    user: SystemUser;
    roles: string[];
    permissions: string[];
  }> {
  // RuoYi标准权限响应格式
  code: number;
  msg: string;
}

/**
 * 用户权限详情响应
 */
export interface UserAuthDetailResponse
  extends ApiResponse<{
    user: SystemUser;
    roles: SystemRole[];
    permissions: string[];
  }> {
  // RuoYi标准权限详情响应格式
  code: number;
  msg: string;
}

/**
 * 部门树响应
 */
export interface DeptTreeResponse extends ApiResponse<SystemDept[]> {
  // RuoYi标准树形响应格式
  code: number;
  msg: string;
}

/**
 * 角色列表响应
 */
export interface RoleListResponse extends ApiResponse<SystemRole[]> {}

/**
 * 岗位列表响应
 */
export interface PostListResponse extends ApiResponse<SystemPost[]> {}

/**
 * 用户导入响应数据
 */
export interface UserImportResult {
  /** 成功导入数量 */
  successCount?: number;
  /** 失败数量 */
  failureCount?: number;
  /** 更新数量 */
  updateCount?: number;
  /** 错误信息列表 */
  errors?: string[];
}

/**
 * 用户导入响应
 */
export interface UserImportResponse extends ApiResponse<UserImportResult> {}

// ==================== 常量定义 ====================

/**
 * 用户状态选项
 */
export const USER_STATUS_OPTIONS = [
  { label: "正常", value: "0", type: "success" },
  { label: "停用", value: "1", type: "danger" },
] as const;

/**
 * 用户性别选项
 */
export const USER_GENDER_OPTIONS = [
  { label: "男", value: "0" },
  { label: "女", value: "1" },
  { label: "未知", value: "2" },
] as const;

/**
 * 用户默认头像
 */
export const DEFAULT_AVATAR = "/images/profile.jpg";

/**
 * 密码规则
 */
export const PASSWORD_RULES = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 20,
  PATTERN: /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
};
