/**
 * 测试主要的 jsToTsConverter 导出功能
 */

import { describe, it, expect } from "vitest";
import { convertJSToTS, quickConvert } from "../jsToTsConverter.js";

describe("JS到TS转换器主要功能测试", () => {
  it("convertJSToTS 应该能转换简单的变量声明", async () => {
    const jsCode = 'let name = "John";';

    try {
      const result = await convertJSToTS(jsCode);
      console.log("convertJSToTS 转换结果:", result);

      expect(result.success).toBe(true);
      expect(result.tsCode).toContain("name");
    } catch (error) {
      console.error("convertJSToTS 转换失败:", error);
      throw error;
    }
  });

  it("quickConvert 应该能快速转换变量声明", async () => {
    const jsCode = "const age = 25;";

    try {
      const tsCode = await quickConvert(jsCode);
      console.log("quickConvert 转换结果:", tsCode);

      expect(tsCode).toContain("age");
      expect(typeof tsCode).toBe("string");
    } catch (error) {
      console.error("quickConvert 转换失败:", error);
      throw error;
    }
  });

  it("quickConvert 应该能处理布尔变量", async () => {
    const jsCode = "var isActive = false;";

    try {
      const tsCode = await quickConvert(jsCode);
      console.log("quickConvert 布尔转换结果:", tsCode);

      expect(tsCode).toContain("isActive");
      expect(tsCode).toContain("boolean");
    } catch (error) {
      console.error("quickConvert 布尔转换失败:", error);
      throw error;
    }
  });
});
