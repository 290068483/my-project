/**
 * JavaScript到TypeScript转换工具函数
 * 集成到Lanan-managerment项目的utils工具库中
 *
 * 使用示例:
 * ```typescript
 * import { convertJSToTS, quickConvert } from '@/utils/jsToTsConverter';
 *
 * // 基础转换
 * const result = await convertJSToTS(`
 *   function greet(name) {
 *     return "Hello, " + name;
 *   }
 * `);
 *
 * // 快速转换
 * const tsCode = await quickConvert('let age = 25');
 * ```
 */

// 重新导出简化版本的功能
export { simpleConvertJSToTS, convertJSToTS, type SimpleConversionResult } from "./jsToTsConverter/simple";

// 导入简化版本作为主要功能
import { simpleConvertJSToTS, convertJSToTS as baseConvert } from "./jsToTsConverter/simple";

/**
 * 便捷函数：快速转换模式（注重速度）
 *
 * @param jsCode - JavaScript代码字符串
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { quickConvert } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await quickConvert('let user = { name: "John", age: 30 }');
 * ```
 */
export async function quickConvert(jsCode: string): Promise<string> {
  const result = await simpleConvertJSToTS(jsCode);
  if (!result.success) {
    throw new Error(`快速转换失败: ${result.errors?.join(", ") || "未知错误"}`);
  }
  return result.tsCode;
}

/**
 * 便捷函数：使用严格模式转换JavaScript代码
 *
 * @param jsCode - JavaScript代码字符串
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { convertWithStrictMode } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await convertWithStrictMode(`
 *   function add(a, b) {
 *     return a + b;
 *   }
 * `);
 * ```
 */
export async function convertWithStrictMode(jsCode: string): Promise<string> {
  const result = await baseConvert(jsCode);
  if (!result.success) {
    throw new Error(`严格模式转换失败: ${result.errors?.map((e: any) => e.message || e).join(", ") || "未知错误"}`);
  }
  return result.tsCode;
}

/**
 * 便捷函数：快速转换模式（注重速度）
 *
 * @param jsCode - JavaScript代码字符串
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { convertWithFastMode } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await convertWithFastMode('let user = { name: "John", age: 30 }');
 * ```
 */
export async function convertWithFastMode(jsCode: string): Promise<string> {
  // 快速模式就使用简化版本
  return await quickConvert(jsCode);
}

/**
 * 便捷函数：转换JavaScript对象定义
 * 专门用于转换对象字面量和相关代码
 *
 * @param jsCode - 包含对象定义的JavaScript代码
 * @returns Promise<{ tsCode: string; interfaces: string }> - 转换结果和生成的接口
 *
 * @example
 * ```typescript
 * import { convertObjectDefinition } from '@/utils/jsToTsConverter';
 *
 * const result = await convertObjectDefinition(`
 *   const user = {
 *     id: 1,
 *     name: "John",
 *     email: "john@example.com",
 *     isActive: true
 *   };
 * `);
 *
 * console.log(result.tsCode);      // TypeScript代码
 * console.log(result.interfaces);  // 生成的接口定义
 * ```
 */
export async function convertObjectDefinition(jsCode: string): Promise<{ tsCode: string; interfaces: string }> {
  const result = await baseConvert(jsCode);

  if (!result.success) {
    throw new Error(`对象定义转换失败: ${result.errors?.map((e: any) => e.message || e).join(", ") || "未知错误"}`);
  }

  return {
    tsCode: result.tsCode,
    interfaces: result.typeDeclarations || "",
  };
}

/**
 * 便捷函数：转换函数定义
 * 专门用于转换函数声明和表达式
 *
 * @param jsCode - 包含函数定义的JavaScript代码
 * @param inferReturnType - 是否推断返回类型（默认为true）
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { convertFunctionDefinition } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await convertFunctionDefinition(`
 *   function calculateArea(width, height) {
 *     return width * height;
 *   }
 * `);
 * ```
 */
export async function convertFunctionDefinition(jsCode: string, inferReturnType: boolean = true): Promise<string> {
  const result = await baseConvert(jsCode);

  if (!result.success) {
    throw new Error(`函数定义转换失败: ${result.errors?.map((e: any) => e.message || e).join(", ") || "未知错误"}`);
  }

  return result.tsCode;
}

// 导出默认对象（向后兼容）
export default {
  convertJSToTS: baseConvert,
  quickConvert,
  convertWithStrictMode,
  convertWithFastMode,
  convertObjectDefinition,
  convertFunctionDefinition,
  simpleConvertJSToTS,
};

/**
 * 便捷函数：转换类定义
 * 专门用于转换类声明
 *
 * @param jsCode - 包含类定义的JavaScript代码
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { convertClassDefinition } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await convertClassDefinition(`
 *   class User {
 *     constructor(name, email) {
 *       this.name = name;
 *       this.email = email;
 *     }
 *
 *     getName() {
 *       return this.name;
 *     }
 *   }
 * `);
 * ```
 */
export async function convertClassDefinition(jsCode: string): Promise<string> {
  const converter = createConverterWithPreset("strict", {
    generateInterfaces: false, // 类通常不需要额外的接口
    inferenceLevel: "advanced",
  });

  const result = await converter.convert(jsCode);

  if (!result.success) {
    throw new Error(`类定义转换失败: ${result.errors?.map((e) => e.message).join(", ") || "未知错误"}`);
  }

  return result.tsCode;
}
