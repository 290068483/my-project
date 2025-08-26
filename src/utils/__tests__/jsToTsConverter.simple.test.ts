/**
 * 简单的 jsToTsConverter 测试
 */

import { describe, it, expect } from "vitest";
import { simpleConvertJSToTS } from "../jsToTsConverter/simple.js";

describe("JS到TS转换器基础测试", () => {
  it("应该能转换简单的变量声明", async () => {
    const jsCode = 'let name = "John";';

    try {
      const result = await simpleConvertJSToTS(jsCode);
      console.log("转换结果:", result);

      expect(result.success).toBe(true);
      expect(result.tsCode).toContain("name: string");
    } catch (error) {
      console.error("转换失败:", error);
      throw error;
    }
  });

  it("应该能转换数字变量", async () => {
    const jsCode = "const age = 25;";

    try {
      const result = await simpleConvertJSToTS(jsCode);
      console.log("转换结果:", result);

      expect(result.success).toBe(true);
      expect(result.tsCode).toContain("age: number");
    } catch (error) {
      console.error("转换失败:", error);
      throw error;
    }
  });

  it("应该能转换布尔变量", async () => {
    const jsCode = "var isActive = true;";

    try {
      const result = await simpleConvertJSToTS(jsCode);
      console.log("转换结果:", result);

      expect(result.success).toBe(true);
      expect(result.tsCode).toContain("isActive: boolean");
    } catch (error) {
      console.error("转换失败:", error);
      throw error;
    }
  });
});
