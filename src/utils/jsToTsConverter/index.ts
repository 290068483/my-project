/**
 * JavaScript到TypeScript转换工具 - 主入口文件
 * 提供简洁易用的公共API接口
 */

// 导出主要类型
export type {
  ConversionResult,
  ConversionConfig,
  ConversionStatistics,
  ConversionWarning,
  ConversionError,
  TypeInfo,
  JSToTSConverterOptions,
  ASTNode,
  NodeType,
} from "./types";

// 导出默认配置
export { DEFAULT_CONFIG, PRIMITIVE_TYPES } from "./types";

// 导出主转换器类
export { JSToTSConverter } from "./JSToTSConverter";

// 导出各个模块（供高级用户使用）
export { JSParser } from "./JSParser";
export { TypeInferrer } from "./TypeInferrer";
export { SyntaxTransformer } from "./SyntaxTransformer";
export { TSGenerator } from "./TSGenerator";

import { JSToTSConverter } from "./JSToTSConverter";
import { ConversionResult, JSToTSConverterOptions, ConversionConfig, DEFAULT_CONFIG } from "./types";

// 导入简化版本作为后备
import { simpleConvertJSToTS, convertJSToTS as simpleConvert } from "./simple";

// 全局转换器实例缓存
let globalConverter: JSToTSConverter | null = null;

/**
 * 转换JavaScript代码为TypeScript代码
 * 这是最常用的API，提供简单易用的接口
 *
 * @param jsCode - JavaScript代码字符串
 * @param options - 转换选项（可选）
 * @returns Promise<ConversionResult> - 转换结果
 *
 * @example
 * ```typescript
 * import { convertJSToTS } from '@/utils/jsToTsConverter';
 *
 * const jsCode = `
 *   function greet(name) {
 *     return "Hello, " + name;
 *   }
 * `;
 *
 * const result = await convertJSToTS(jsCode);
 * console.log(result.tsCode);
 * // 输出: function greet(name: string): string { return "Hello, " + name; }
 * ```
 */
export async function convertJSToTS(jsCode: string, options?: JSToTSConverterOptions): Promise<ConversionResult> {
  try {
    // 尝试使用完整版本
    const converter = createConverter(options?.config);
    return await converter.convert(jsCode);
  } catch (error) {
    // 如果完整版本失败，使用简化版本
    console.warn("使用简化版本转换器:", error);
    return await simpleConvert(jsCode);
  }
}

/**
 * 转换JavaScript文件为TypeScript文件
 *
 * @param inputPath - 输入JavaScript文件路径
 * @param outputPath - 输出TypeScript文件路径（可选）
 * @param options - 转换选项（可选）
 * @returns Promise<ConversionResult> - 转换结果
 *
 * @example
 * ```typescript
 * import { convertJSFileToTS } from '@/utils/jsToTsConverter';
 *
 * // 转换文件
 * const result = await convertJSFileToTS(
 *   './src/legacy/utils.js',
 *   './src/utils/utils.ts'
 * );
 *
 * if (result.success) {
 *   console.log('转换成功!');
 * }
 * ```
 */
export async function convertJSFileToTS(
  inputPath: string,
  outputPath?: string,
  options?: JSToTSConverterOptions,
): Promise<ConversionResult> {
  const converter = createConverter(options?.config);
  return converter.convertFile(inputPath, outputPath);
}

/**
 * 批量转换多个JavaScript文件
 *
 * @param files - JavaScript文件路径数组
 * @param options - 转换选项（可选）
 * @returns Promise<Map<string, ConversionResult>> - 转换结果映射
 *
 * @example
 * ```typescript
 * import { convertJSFilesInBatch } from '@/utils/jsToTsConverter';
 *
 * const files = ['./utils.js', './helpers.js', './config.js'];
 * const results = await convertJSFilesInBatch(files);
 *
 * results.forEach((result, file) => {
 *   console.log(`${file}: ${result.success ? '成功' : '失败'}`);
 * });
 * ```
 */
export async function convertJSFilesInBatch(
  files: string[],
  options?: JSToTSConverterOptions,
): Promise<Map<string, ConversionResult>> {
  const converter = createConverter(options?.config);
  return converter.convertBatch(files);
}

/**
 * 创建转换器实例
 *
 * @param config - 转换配置（可选）
 * @returns JSToTSConverter - 转换器实例
 *
 * @example
 * ```typescript
 * import { createConverter } from '@/utils/jsToTsConverter';
 *
 * const converter = createConverter({
 *   strict: true,
 *   inferReturnTypes: true,
 *   generateInterfaces: true
 * });
 *
 * const result = await converter.convert(jsCode);
 * ```
 */
export function createConverter(config?: Partial<ConversionConfig>): JSToTSConverter {
  return new JSToTSConverter({ config });
}

/**
 * 获取全局转换器实例（单例模式）
 *
 * @param config - 转换配置（可选，只在首次创建时生效）
 * @returns JSToTSConverter - 全局转换器实例
 *
 * @example
 * ```typescript
 * import { getGlobalConverter } from '@/utils/jsToTsConverter';
 *
 * // 首次调用，创建实例
 * const converter = getGlobalConverter({ strict: true });
 *
 * // 后续调用，返回同一实例
 * const sameConverter = getGlobalConverter();
 * ```
 */
export function getGlobalConverter(config?: Partial<ConversionConfig>): JSToTSConverter {
  if (!globalConverter) {
    globalConverter = createConverter(config);
  }
  return globalConverter;
}

/**
 * 重置全局转换器实例
 * 清除缓存的全局转换器，下次调用getGlobalConverter时将创建新实例
 *
 * @example
 * ```typescript
 * import { resetGlobalConverter } from '@/utils/jsToTsConverter';
 *
 * // 重置全局转换器
 * resetGlobalConverter();
 * ```
 */
export function resetGlobalConverter(): void {
  if (globalConverter) {
    globalConverter.reset();
    globalConverter = null;
  }
}

/**
 * 验证JavaScript代码语法
 *
 * @param jsCode - JavaScript代码字符串
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * import { validateJavaScript } from '@/utils/jsToTsConverter';
 *
 * const validation = validateJavaScript('function test() { return 42 }');
 * if (!validation.isValid) {
 *   console.log('语法错误:', validation.errors);
 * }
 * ```
 */
export function validateJavaScript(jsCode: string): { isValid: boolean; errors: any[] } {
  const converter = getGlobalConverter();
  return converter.validateJS(jsCode);
}

/**
 * 验证TypeScript代码语法
 *
 * @param tsCode - TypeScript代码字符串
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * import { validateTypeScript } from '@/utils/jsToTsConverter';
 *
 * const validation = validateTypeScript('function test(): number { return 42; }');
 * if (!validation.isValid) {
 *   console.log('语法错误:', validation.errors);
 * }
 * ```
 */
export function validateTypeScript(tsCode: string): { isValid: boolean; errors: any[] } {
  const converter = getGlobalConverter();
  return converter.validateTS(tsCode);
}

/**
 * 获取预设配置
 * 提供一些常用的配置预设
 */
export const presetConfigs = {
  /**
   * 基础配置 - 适合简单项目
   */
  basic: {
    strict: false,
    inferReturnTypes: true,
    generateInterfaces: false,
    target: "ES2020" as const,
    preserveComments: true,
    inferenceLevel: "basic" as const,
    optimize: false,
  },

  /**
   * 严格配置 - 适合大型项目
   */
  strict: {
    strict: true,
    inferReturnTypes: true,
    generateInterfaces: true,
    target: "ES2020" as const,
    preserveComments: true,
    inferenceLevel: "strict" as const,
    optimize: true,
  },

  /**
   * 快速配置 - 注重转换速度
   */
  fast: {
    strict: false,
    inferReturnTypes: false,
    generateInterfaces: false,
    target: "ES2020" as const,
    preserveComments: false,
    inferenceLevel: "basic" as const,
    optimize: false,
  },

  /**
   * 完整配置 - 最大化功能
   */
  full: {
    strict: true,
    inferReturnTypes: true,
    generateInterfaces: true,
    target: "ES2020" as const,
    preserveComments: true,
    inferenceLevel: "advanced" as const,
    optimize: true,
  },
} as const;

/**
 * 使用预设配置创建转换器
 *
 * @param preset - 预设名称
 * @param overrides - 覆盖配置（可选）
 * @returns JSToTSConverter - 转换器实例
 *
 * @example
 * ```typescript
 * import { createConverterWithPreset } from '@/utils/jsToTsConverter';
 *
 * // 使用严格预设
 * const converter = createConverterWithPreset('strict');
 *
 * // 使用预设并覆盖部分配置
 * const customConverter = createConverterWithPreset('basic', {
 *   generateInterfaces: true
 * });
 * ```
 */
export function createConverterWithPreset(
  preset: keyof typeof presetConfigs,
  overrides?: Partial<ConversionConfig>,
): JSToTSConverter {
  const config = { ...presetConfigs[preset], ...overrides };
  return createConverter(config);
}

/**
 * 工具函数 - 快速转换简单的代码片段
 * 适用于转换简单的JavaScript表达式或语句
 *
 * @param jsCode - JavaScript代码片段
 * @param options - 转换选项（可选）
 * @returns Promise<string> - 转换后的TypeScript代码
 *
 * @example
 * ```typescript
 * import { quickConvert } from '@/utils/jsToTsConverter';
 *
 * const tsCode = await quickConvert('let name = "John"');
 * console.log(tsCode); // 'let name: string = "John";'
 * ```
 */
export async function quickConvert(jsCode: string, options?: JSToTSConverterOptions): Promise<string> {
  try {
    // 先尝试简化版本，更快速可靠
    const simpleResult = await simpleConvertJSToTS(jsCode);
    if (simpleResult.success) {
      return simpleResult.tsCode;
    }

    // 如果简化版本失败，尝试完整版本
    const result = await convertJSToTS(jsCode, options);
    if (!result.success) {
      throw new Error(`转换失败: ${result.errors?.map((e) => e.message).join(", ") || "未知错误"}`);
    }
    return result.tsCode;
  } catch (error) {
    // 最后的后备方案：返回原代码
    console.warn("转换失败，返回原代码:", error);
    return jsCode;
  }
}

/**
 * 获取转换器支持的特性列表
 *
 * @returns string[] - 支持的特性列表
 */
export function getSupportedFeatures(): string[] {
  const converter = getGlobalConverter();
  return converter.getSupportedFeatures();
}

/**
 * 获取转换器版本信息
 *
 * @returns 版本信息对象
 */
export function getVersion(): { version: string; features: string[] } {
  const converter = getGlobalConverter();
  return converter.getVersion();
}

// 导出默认实例（向后兼容）
export default {
  convertJSToTS,
  convertJSFileToTS,
  convertJSFilesInBatch,
  createConverter,
  getGlobalConverter,
  resetGlobalConverter,
  validateJavaScript,
  validateTypeScript,
  presetConfigs,
  createConverterWithPreset,
  quickConvert,
  getSupportedFeatures,
  getVersion,
  DEFAULT_CONFIG,
};
