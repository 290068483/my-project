/**
 * 用户设置管理相关类型定义
 */

// ==================== 用户个人资料更新接口 ====================

/**
 * 用户个人资料更新请求接口
 */
export interface UserProfileUpdateRequest {
  name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  sex?: string;
  birthday?: string;
  address?: string;
  personalSignature?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  joinDate?: string;
  employeeId?: string;
}

// ==================== 用户登录日志接口 ====================

/**
 * 用户登录日志接口
 */
export interface LoginLog {
  id: number;
  loginTime: string;
  loginIp: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: "success" | "failure";
  msg?: string;
}

// ==================== 通知设置接口 ====================

/**
 * 通知设置接口
 */
export interface NotificationSettings {
  emailNotification: boolean;
  smsNotification: boolean;
  systemNotification: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

// ==================== 隐私设置接口 ====================

/**
 * 隐私设置接口
 */
export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  showEmail: boolean;
  showPhone: boolean;
  showBirthday: boolean;
  showAddress: boolean;
  allowSearch: boolean;
  dataCollection: boolean;
}
