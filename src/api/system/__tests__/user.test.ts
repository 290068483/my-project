/**
 * 系统用户管理 API 单元测试
 * 使用 Vitest 测试框架
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  listUser,
  getUser,
  addUser,
  updateUser,
  delUser,
  resetUserPwd,
  changeUserStatus,
  checkUserNameUnique,
  checkPhoneUnique,
  checkEmailUnique,
} from "@/api/system/user";
import type { UserQueryParams, UserForm, UserPasswordForm, SystemUser } from "@/types/system/user";

// Mock request module
vi.mock("@/utils/request", () => ({
  request: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    upload: vi.fn(),
    download: vi.fn(),
  },
}));

import { request } from "@/utils/request";

describe("系统用户管理 API 测试", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("用户查询相关 API", () => {
    it("应该能够查询用户列表", async () => {
      const mockParams: UserQueryParams = {
        pageNum: 1,
        pageSize: 10,
        userName: "admin",
        status: "0",
      };

      const mockResponse = {
        code: 200,
        msg: "操作成功",
        data: {
          rows: [
            {
              userId: 1,
              userName: "admin",
              nickName: "管理员",
              status: "0",
            },
          ],
          total: 1,
        },
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      const result = await listUser(mockParams);

      expect(request.get).toHaveBeenCalledWith("/system/user/list", { params: mockParams });
      expect(result).toEqual(mockResponse);
      expect(result.data.rows).toHaveLength(1);
      expect(result.data.rows[0].userName).toBe("admin");
    });

    it("应该能够获取单个用户详情", async () => {
      const userId = 1;
      const mockResponse = {
        code: 200,
        msg: "操作成功",
        data: {
          user: {
            userId: 1,
            userName: "admin",
            nickName: "管理员",
            status: "0",
          },
          roles: [],
          posts: [],
          roleIds: [],
          postIds: [],
        },
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      const result = await getUser(userId);

      expect(request.get).toHaveBeenCalledWith(`/system/user/${userId}`);
      expect(result).toEqual(mockResponse);
      expect(result.data.user.userId).toBe(userId);
    });
  });

  describe("用户新增相关 API", () => {
    it("应该能够新增用户", async () => {
      const mockUserData: UserForm = {
        userName: "testuser",
        nickName: "测试用户",
        deptId: 100,
        status: "0",
        roleIds: [1],
        postIds: [1],
      };

      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.post).mockResolvedValue(mockResponse);

      const result = await addUser(mockUserData);

      expect(request.post).toHaveBeenCalledWith("/system/user", mockUserData);
      expect(result.code).toBe(200);
    });
  });

  describe("用户修改相关 API", () => {
    it("应该能够修改用户信息", async () => {
      const mockUserData: UserForm = {
        userId: 1,
        userName: "admin",
        nickName: "系统管理员",
        deptId: 100,
        status: "0",
        roleIds: [1],
        postIds: [1],
      };

      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.put).mockResolvedValue(mockResponse);

      const result = await updateUser(mockUserData);

      expect(request.put).toHaveBeenCalledWith("/system/user", mockUserData);
      expect(result.code).toBe(200);
    });

    it("应该能够修改用户状态", async () => {
      const userId = 1;
      const status = "1";
      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.put).mockResolvedValue(mockResponse);

      const result = await changeUserStatus(userId, status);

      expect(request.put).toHaveBeenCalledWith("/system/user/changeStatus", {
        userId,
        status,
      });
      expect(result.code).toBe(200);
    });

    it("应该能够重置用户密码", async () => {
      const mockPasswordData: UserPasswordForm = {
        userId: 1,
        password: "newpassword123",
      };

      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.put).mockResolvedValue(mockResponse);

      const result = await resetUserPwd(mockPasswordData);

      expect(request.put).toHaveBeenCalledWith("/system/user/resetPwd", mockPasswordData);
      expect(result.code).toBe(200);
    });
  });

  describe("用户删除相关 API", () => {
    it("应该能够删除单个用户", async () => {
      const userId = 1;
      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.delete).mockResolvedValue(mockResponse);

      const result = await delUser(userId);

      expect(request.delete).toHaveBeenCalledWith(`/system/user/${userId}`);
      expect(result.code).toBe(200);
    });

    it("应该能够批量删除用户", async () => {
      const userIds = [1, 2, 3];
      const mockResponse = {
        code: 200,
        msg: "操作成功",
      };

      vi.mocked(request.delete).mockResolvedValue(mockResponse);

      const result = await delUser(userIds);

      expect(request.delete).toHaveBeenCalledWith(`/system/user/${userIds.join(",")}`);
      expect(result.code).toBe(200);
    });
  });

  describe("用户唯一性校验 API", () => {
    it("应该能够校验用户名唯一性", async () => {
      const userName = "testuser";
      const mockResponse = {
        code: 200,
        msg: "操作成功",
        data: true,
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      const result = await checkUserNameUnique(userName);

      expect(request.get).toHaveBeenCalledWith("/system/user/checkUserNameUnique", {
        params: { userName },
      });
      expect(result.data).toBe(true);
    });

    it("应该能够校验手机号唯一性", async () => {
      const phonenumber = "13800138000";
      const mockResponse = {
        code: 200,
        msg: "操作成功",
        data: false,
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      const result = await checkPhoneUnique(phonenumber);

      expect(request.get).toHaveBeenCalledWith("/system/user/checkPhoneUnique", {
        params: { phonenumber },
      });
      expect(result.data).toBe(false);
    });

    it("应该能够校验邮箱唯一性", async () => {
      const email = "test@example.com";
      const mockResponse = {
        code: 200,
        msg: "操作成功",
        data: true,
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      const result = await checkEmailUnique(email);

      expect(request.get).toHaveBeenCalledWith("/system/user/checkEmailUnique", {
        params: { email },
      });
      expect(result.data).toBe(true);
    });
  });

  describe("API 错误处理", () => {
    it("应该正确处理网络错误", async () => {
      const networkError = new Error("网络连接失败");
      vi.mocked(request.get).mockRejectedValue(networkError);

      await expect(listUser()).rejects.toThrow("网络连接失败");
    });

    it("应该正确处理服务器错误响应", async () => {
      const errorResponse = {
        code: 500,
        msg: "服务器内部错误",
      };
      vi.mocked(request.post).mockResolvedValue(errorResponse);

      const mockUserData: UserForm = {
        userName: "testuser",
        nickName: "测试用户",
        status: "0",
        roleIds: [],
        postIds: [],
      };

      const result = await addUser(mockUserData);
      expect(result.code).toBe(500);
      expect(result.msg).toBe("服务器内部错误");
    });
  });

  describe("参数验证", () => {
    it("查询用户列表时应该正确传递查询参数", async () => {
      const params: UserQueryParams = {
        pageNum: 2,
        pageSize: 20,
        userName: "admin",
        phonenumber: "13800138000",
        status: "0",
        deptId: 100,
        beginTime: "2024-01-01",
        endTime: "2024-12-31",
      };

      const mockResponse = {
        code: 200,
        data: { rows: [], total: 0 },
      };

      vi.mocked(request.get).mockResolvedValue(mockResponse);

      await listUser(params);

      expect(request.get).toHaveBeenCalledWith("/system/user/list", { params });
    });

    it("新增用户时应该包含所有必要字段", async () => {
      const userData: UserForm = {
        userName: "newuser",
        nickName: "新用户",
        email: "newuser@example.com",
        phonenumber: "13900139000",
        sex: "1",
        deptId: 100,
        status: "0",
        roleIds: [2, 3],
        postIds: [1],
        remark: "测试用户备注",
      };

      const mockResponse = { code: 200, msg: "操作成功" };
      vi.mocked(request.post).mockResolvedValue(mockResponse);

      await addUser(userData);

      expect(request.post).toHaveBeenCalledWith("/system/user", userData);

      // 验证传递的数据包含所有字段
      const calledWith = vi.mocked(request.post).mock.calls[0][1] as UserForm;
      expect(calledWith.userName).toBe("newuser");
      expect(calledWith.nickName).toBe("新用户");
      expect(calledWith.email).toBe("newuser@example.com");
      expect(calledWith.roleIds).toEqual([2, 3]);
    });
  });
});

describe("Store 集成测试", () => {
  // 这里可以添加对 userManageStore 的测试
  // 由于 store 依赖于 API，我们可以测试 store 的方法是否正确调用了 API

  it("应该测试 Store 与 API 的集成", () => {
    // TODO: 添加 store 集成测试
    expect(true).toBe(true);
  });
});
