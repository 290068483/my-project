import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
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
