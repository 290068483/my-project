import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { AuthUtils } from "./auth";
import { checkPermi, checkRole } from "./permission";

// 模拟用户Store
vi.mock("@/stores/user", () => {
  return {
    useUserStore: vi.fn(() => ({
      token: "test-token",
      name: "test-user",
      avatar: "",
      roles: ["admin"],
      permissions: ["system:user:list", "system:user:add", "system:user:edit"],
    })),
  };
});

describe("权限工具类测试", () => {
  beforeEach(() => {
    // 创建Pinia实例
    setActivePinia(createPinia());
  });

  describe("AuthUtils.hasPermission", () => {
    it("应该正确检查单个权限", () => {
      expect(AuthUtils.hasPermission("system:user:list")).toBe(true);
      expect(AuthUtils.hasPermission("system:user:delete")).toBe(false);
    });

    it("应该正确检查权限数组", () => {
      expect(AuthUtils.hasPermission(["system:user:list", "system:user:add"])).toBe(true);
      expect(AuthUtils.hasPermission(["system:user:list", "system:user:delete"])).toBe(true);
      expect(AuthUtils.hasPermission(["system:user:delete", "system:user:import"])).toBe(false);
    });
  });

  describe("AuthUtils.hasRole", () => {
    it("应该正确检查单个角色", () => {
      expect(AuthUtils.hasRole("admin")).toBe(true);
      expect(AuthUtils.hasRole("user")).toBe(false);
    });

    it("应该正确检查角色数组", () => {
      expect(AuthUtils.hasRole(["admin", "user"])).toBe(true);
      expect(AuthUtils.hasRole(["user", "manager"])).toBe(false);
    });
  });

  describe("AuthUtils.hasAnyPermission", () => {
    it("应该正确检查任意权限", () => {
      expect(AuthUtils.hasAnyPermission(["system:user:list", "system:user:add"])).toBe(true);
      expect(AuthUtils.hasAnyPermission(["system:user:delete", "system:user:import"])).toBe(false);
    });
  });

  describe("AuthUtils.hasAllPermissions", () => {
    it("应该正确检查所有权限", () => {
      expect(AuthUtils.hasAllPermissions(["system:user:list", "system:user:add"])).toBe(true);
      expect(AuthUtils.hasAllPermissions(["system:user:list", "system:user:delete"])).toBe(false);
    });
  });

  describe("AuthUtils.hasAnyRole", () => {
    it("应该正确检查任意角色", () => {
      expect(AuthUtils.hasAnyRole(["admin", "user"])).toBe(true);
      expect(AuthUtils.hasAnyRole(["user", "manager"])).toBe(false);
    });
  });

  describe("AuthUtils.hasAllRoles", () => {
    it("应该正确检查所有角色", () => {
      expect(AuthUtils.hasAllRoles(["admin"])).toBe(true);
      expect(AuthUtils.hasAllRoles(["admin", "user"])).toBe(false);
    });
  });

  describe("AuthUtils.checkPermission", () => {
    it("应该正确处理角色和权限的组合检查", () => {
      expect(AuthUtils.checkPermission({ roles: ["admin"], permissions: ["system:user:list"] })).toBe(true);
      expect(AuthUtils.checkPermission({ roles: ["user"], permissions: ["system:user:list"] })).toBe(true);
      expect(AuthUtils.checkPermission({ roles: ["user"], permissions: ["system:user:delete"] })).toBe(false);
    });

    it("应该正确处理and模式", () => {
      expect(
        AuthUtils.checkPermission({
          roles: ["admin"],
          permissions: ["system:user:list"],
          mode: "and",
        }),
      ).toBe(true);
      expect(
        AuthUtils.checkPermission({
          roles: ["user"],
          permissions: ["system:user:list"],
          mode: "and",
        }),
      ).toBe(false);
    });
  });
});

describe("权限检查函数测试", () => {
  beforeEach(() => {
    // 创建Pinia实例
    setActivePinia(createPinia());
  });

  describe("checkPermi", () => {
    it("应该正确检查权限", () => {
      expect(checkPermi(["system:user:list"])).toBe(true);
      expect(checkPermi(["system:user:delete"])).toBe(false);
      expect(checkPermi(["system:user:list", "system:user:delete"])).toBe(true);
    });

    it("应该处理空数组和无效输入", () => {
      expect(checkPermi([])).toBe(false);
      // @ts-ignore
      expect(checkPermi(null)).toBe(false);
      // @ts-ignore
      expect(checkPermi(undefined)).toBe(false);
    });
  });

  describe("checkRole", () => {
    it("应该正确检查角色", () => {
      expect(checkRole(["admin"])).toBe(true);
      expect(checkRole(["user"])).toBe(false);
      expect(checkRole(["admin", "user"])).toBe(true);
    });

    it("应该处理空数组和无效输入", () => {
      expect(checkRole([])).toBe(false);
      // @ts-ignore
      expect(checkRole(null)).toBe(false);
      // @ts-ignore
      expect(checkRole(undefined)).toBe(false);
    });
  });
});
