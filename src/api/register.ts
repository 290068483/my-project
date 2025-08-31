import request from "@/utils/request";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

/**
 * 统一注册方法
 * 支持多种注册方式：用户名+密码、手机号+验证码、邮箱+验证码
 * @param data 注册数据
 * @returns Promise<RegisterResponse>
 */
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return request({
    url: "/register",
    method: "post",
    data: data,
    headers: {
      isToken: false,
    },
  });
}

// 导出类型定义
export type { RegisterRequest, RegisterResponse } from "@/types/auth";
