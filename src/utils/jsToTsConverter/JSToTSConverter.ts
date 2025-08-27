/**
 * JavaScript到TypeScript转换器 - 主转换器类
 * 协调各个子模块完成完整的转换流程
 */

import {
  ConversionResult,
  ConversionConfig,
  ConversionStatistics,
  ConversionWarning,
  ConversionError,
  ASTNode,
  DEFAULT_CONFIG,
  JSToTSConverterOptions,
} from "./types";
import { JSParser } from "./JSParser";
import { TypeInferrer } from "./TypeInferrer";
import { SyntaxTransformer } from "./SyntaxTransformer";
import { TSGenerator } from "./TSGenerator";

export class JSToTSConverter {
  private config: ConversionConfig;
  private parser: JSParser;
  private typeInferrer: TypeInferrer;
  private transformer: SyntaxTransformer;
  private generator: TSGenerator;
  private statistics: ConversionStatistics;
  private warnings: ConversionWarning[];
  private errors: ConversionError[];

  constructor(options: JSToTSConverterOptions = {}) {
    // 合并配置
    this.config = { ...DEFAULT_CONFIG, ...options.config };

    // 初始化各个模块
    this.parser = new JSParser();
    this.typeInferrer = new TypeInferrer(this.config);
    this.transformer = new SyntaxTransformer(this.config);
    this.generator = new TSGenerator(this.config);

    // 初始化统计和错误信息
    this.resetStatistics();
    this.warnings = [];
    this.errors = [];
  }

  /**
   * 转换JavaScript代码为TypeScript代码
   */
  async convert(jsCode: string): Promise<ConversionResult> {
    const startTime = Date.now();
    this.resetStatistics();
    this.warnings = [];
    this.errors = [];

    try {
      // 验证输入
      if (!jsCode || typeof jsCode !== "string") {
        throw new Error("输入的JavaScript代码无效");
      }

      // 更新统计信息
      this.statistics.linesProcessed = jsCode.split("\n").length;

      // 步骤1: 解析JavaScript代码为AST
      let ast: ASTNode;
      try {
        ast = this.parser.parse(jsCode);
        this.addWarningIfNeeded("parsing", "代码解析完成", 0, 0);
      } catch (error) {
        const parseError: ConversionError = {
          type: "parsing",
          message: `解析错误: ${error instanceof Error ? error.message : String(error)}`,
          line: 0,
          column: 0,
        };
        this.errors.push(parseError);
        throw parseError;
      }

      // 步骤2: 语法转换
      let transformedAst: ASTNode;
      try {
        transformedAst = this.transformer.transform(ast);
        this.updateTransformStatistics(transformedAst);
      } catch (error) {
        const transformError: ConversionError = {
          type: "transformation",
          message: `转换错误: ${error instanceof Error ? error.message : String(error)}`,
        };
        this.errors.push(transformError);
        throw transformError;
      }

      // 步骤3: 生成TypeScript代码
      let tsCode: string;
      try {
        tsCode = this.generator.generate(transformedAst);
        tsCode = this.generator.format(tsCode);
      } catch (error) {
        const generateError: ConversionError = {
          type: "generation",
          message: `代码生成错误: ${error instanceof Error ? error.message : String(error)}`,
        };
        this.errors.push(generateError);
        throw generateError;
      }

      // 步骤4: 生成类型声明
      let typeDeclarations = "";
      if (this.config.generateInterfaces) {
        try {
          const interfaces = this.transformer.generateInterfaces();
          typeDeclarations = this.generator.generateTypeDeclarations(interfaces);
        } catch (error) {
          this.addWarning(
            "type-inference",
            `类型声明生成警告: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      // 完成转换
      this.statistics.conversionTime = Date.now() - startTime;

      return {
        tsCode,
        typeDeclarations,
        statistics: this.statistics,
        warnings: this.warnings,
        success: true,
      };
    } catch {
      this.statistics.conversionTime = Date.now() - startTime;

      return {
        tsCode: "",
        typeDeclarations: "",
        statistics: this.statistics,
        warnings: this.warnings,
        success: false,
        errors: this.errors,
      };
    }
  }

  /**
   * 转换JavaScript文件为TypeScript文件
   */
  async convertFile(inputPath: string, outputPath?: string): Promise<ConversionResult> {
    try {
      // 读取文件内容（这里简化处理，实际应该使用fs模块）
      const jsCode = await this.readFile(inputPath);

      // 转换代码
      const result = await this.convert(jsCode);

      // 如果转换成功且提供了输出路径，写入文件
      if (result.success && outputPath) {
        await this.writeFile(outputPath, result.tsCode);

        // 如果有类型声明，也写入.d.ts文件
        if (result.typeDeclarations) {
          const declarationPath = outputPath.replace(/\.ts$/, ".d.ts");
          await this.writeFile(declarationPath, result.typeDeclarations);
        }
      }

      return result;
    } catch (error) {
      return {
        tsCode: "",
        typeDeclarations: "",
        statistics: this.statistics,
        warnings: this.warnings,
        success: false,
        errors: [
          {
            type: "syntax",
            message: `文件操作错误: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  /**
   * 批量转换多个文件
   */
  async convertBatch(files: string[]): Promise<Map<string, ConversionResult>> {
    const results = new Map<string, ConversionResult>();

    for (const file of files) {
      try {
        const result = await this.convertFile(file);
        results.set(file, result);
      } catch (error) {
        results.set(file, {
          tsCode: "",
          typeDeclarations: "",
          statistics: this.resetStatistics(),
          warnings: [],
          success: false,
          errors: [
            {
              type: "syntax",
              message: `批量转换错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        });
      }
    }

    return results;
  }

  /**
   * 设置转换配置
   */
  setConfig(config: Partial<ConversionConfig>): void {
    this.config = { ...this.config, ...config };

    // 重新初始化模块
    this.typeInferrer = new TypeInferrer(this.config);
    this.transformer = new SyntaxTransformer(this.config);
    this.generator = new TSGenerator(this.config);
  }

  /**
   * 获取当前配置
   */
  getConfig(): ConversionConfig {
    return { ...this.config };
  }

  /**
   * 验证JavaScript代码语法
   */
  validateJS(jsCode: string): { isValid: boolean; errors: ConversionError[] } {
    const errors: ConversionError[] = [];

    try {
      this.parser.parse(jsCode);
      return { isValid: true, errors: [] };
    } catch (error) {
      errors.push({
        type: "syntax",
        message: error instanceof Error ? error.message : String(error),
      });
      return { isValid: false, errors };
    }
  }

  /**
   * 验证生成的TypeScript代码
   */
  validateTS(tsCode: string): { isValid: boolean; errors: ConversionError[] } {
    // 简单的语法检查，实际项目中可以集成TypeScript编译器
    const errors: ConversionError[] = [];

    try {
      // 基础语法检查
      if (!tsCode.trim()) {
        errors.push({
          type: "syntax",
          message: "TypeScript代码为空",
        });
        return { isValid: false, errors };
      }

      // 检查基本语法错误
      const syntaxErrors = this.checkBasicTSSyntax(tsCode);
      errors.push(...syntaxErrors);

      return { isValid: errors.length === 0, errors };
    } catch (error) {
      errors.push({
        type: "syntax",
        message: error instanceof Error ? error.message : String(error),
      });
      return { isValid: false, errors };
    }
  }

  /**
   * 获取转换统计信息
   */
  getStatistics(): ConversionStatistics {
    return { ...this.statistics };
  }

  /**
   * 重置转换器状态
   */
  reset(): void {
    this.resetStatistics();
    this.warnings = [];
    this.errors = [];
    this.transformer.reset();
    this.generator.reset();
  }

  // 私有辅助方法

  /**
   * 重置统计信息
   */
  private resetStatistics(): ConversionStatistics {
    this.statistics = {
      variablesConverted: 0,
      functionsConverted: 0,
      classesConverted: 0,
      typesInferred: 0,
      conversionTime: 0,
      linesProcessed: 0,
    };
    return this.statistics;
  }

  /**
   * 更新转换统计信息
   */
  private updateTransformStatistics(ast: ASTNode): void {
    this.countNodes(ast);
  }

  /**
   * 统计AST节点数量
   */
  private countNodes(node: ASTNode): void {
    switch (node.type) {
      case "VariableDeclaration":
        this.statistics.variablesConverted++;
        break;
      case "FunctionDeclaration":
        this.statistics.functionsConverted++;
        break;
      case "ClassDeclaration":
        this.statistics.classesConverted++;
        break;
    }

    if (node.children) {
      for (const child of node.children) {
        this.countNodes(child);
      }
    }
  }

  /**
   * 添加警告
   */
  private addWarning(
    type: ConversionWarning["type"],
    message: string,
    line?: number,
    column?: number,
    suggestion?: string,
  ): void {
    this.warnings.push({
      type,
      message,
      line,
      column,
      suggestion,
    });
  }

  /**
   * 根据需要添加警告
   */
  private addWarningIfNeeded(type: ConversionWarning["type"], message: string, line?: number, column?: number): void {
    if (this.config.strict || this.config.inferenceLevel === "strict") {
      this.addWarning(type, message, line, column);
    }
  }

  /**
   * 检查基础TypeScript语法
   */
  private checkBasicTSSyntax(code: string): ConversionError[] {
    const errors: ConversionError[] = [];
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // 检查基本语法错误
      if (line.includes("function") && !line.includes("(")) {
        errors.push({
          type: "syntax",
          message: "函数声明缺少参数列表",
          line: lineNum,
        });
      }

      // 检查类型注解语法
      if (line.includes(":") && line.includes("=")) {
        const colonIndex = line.indexOf(":");
        const equalIndex = line.indexOf("=");
        if (colonIndex > equalIndex) {
          errors.push({
            type: "syntax",
            message: "类型注解位置错误",
            line: lineNum,
          });
        }
      }
    }

    return errors;
  }

  /**
   * 读取文件（简化实现）
   */
  private async readFile(_path: string): Promise<string> {
    // 在实际项目中应该使用fs.promises.readFile
    return new Promise((resolve, _reject) => {
      // 模拟文件读取
      setTimeout(() => {
        resolve("// 模拟的JavaScript代码内容");
      }, 10);
    });
  }

  /**
   * 写入文件（简化实现）
   */
  private async writeFile(path: string, _content: string): Promise<void> {
    // 在实际项目中应该使用fs.promises.writeFile
    return new Promise((resolve) => {
      // 模拟文件写入
      setTimeout(() => {
        console.log(`文件已写入: ${path}`);
        resolve();
      }, 10);
    });
  }

  /**
   * 获取支持的JavaScript特性
   */
  getSupportedFeatures(): string[] {
    return [
      "Variable declarations (var, let, const)",
      "Function declarations",
      "Class declarations",
      "Object expressions",
      "Array expressions",
      "Basic type inference",
      "Return type inference",
      "Parameter type inference",
      "Interface generation",
      "Union types",
      "Optional properties",
    ];
  }

  /**
   * 获取转换器版本信息
   */
  getVersion(): { version: string; features: string[] } {
    return {
      version: "1.0.0",
      features: this.getSupportedFeatures(),
    };
  }
}
