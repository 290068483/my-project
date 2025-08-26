/**
 * JavaScript到TypeScript转换工具 - 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  convertJSToTS,
  quickConvert,
  createConverter,
  createConverterWithPreset,
  validateJavaScript,
  validateTypeScript,
  convertWithStrictMode,
  convertWithFastMode,
  convertObjectDefinition,
  convertFunctionDefinition,
  convertClassDefinition,
  presetConfigs,
  DEFAULT_CONFIG,
  JSToTSConverter,
  TypeInferrer,
  JSParser,
  SyntaxTransformer,
  TSGenerator
} from '../jsToTsConverter';

describe('JavaScript到TypeScript转换工具测试', () => {
  
  describe('基础转换功能测试', () => {
    it('应该能够转换简单的变量声明', async () => {
      const jsCode = 'let name = "John";';
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('let name: string = "John";');
    });

    it('应该能够转换数字变量', async () => {
      const jsCode = 'const age = 25;';
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('const age: number = 25;');
    });

    it('应该能够转换布尔变量', async () => {
      const jsCode = 'var isActive = true;';
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('var isActive: boolean = true;');
    });

    it('应该能够转换函数声明', async () => {
      const jsCode = `
        function greet(name) {
          return "Hello, " + name;
        }
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('function greet(name: string): string');
    });

    it('应该能够转换带参数默认值的函数', async () => {
      const jsCode = `
        function greet(name, greeting = "Hello") {
          return greeting + ", " + name;
        }
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('greeting: string = "Hello"');
    });
  });

  describe('对象和数组转换测试', () => {
    it('应该能够转换对象字面量', async () => {
      const jsCode = `
        const user = {
          name: "John",
          age: 30,
          isActive: true
        };
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('name: string');
      expect(result.tsCode).toContain('age: number');
      expect(result.tsCode).toContain('isActive: boolean');
    });

    it('应该能够转换数组', async () => {
      const jsCode = 'const numbers = [1, 2, 3, 4, 5];';
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('number[]');
    });

    it('应该能够转换混合类型数组', async () => {
      const jsCode = 'const mixed = [1, "hello", true];';
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      // 应该生成联合类型
      expect(result.tsCode).toMatch(/(number|string|boolean)/);
    });
  });

  describe('类转换测试', () => {
    it('应该能够转换简单的类', async () => {
      const jsCode = `
        class User {
          constructor(name, email) {
            this.name = name;
            this.email = email;
          }
          
          getName() {
            return this.name;
          }
        }
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('class User');
      expect(result.tsCode).toContain('constructor(name: string, email: string)');
      expect(result.tsCode).toContain('getName(): string');
    });

    it('应该能够转换带继承的类', async () => {
      const jsCode = `
        class Admin extends User {
          constructor(name, email, role) {
            super(name, email);
            this.role = role;
          }
        }
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('class Admin extends User');
    });
  });

  describe('快速转换功能测试', () => {
    it('quickConvert应该返回转换后的代码字符串', async () => {
      const jsCode = 'let count = 42;';
      const tsCode = await quickConvert(jsCode);
      
      expect(typeof tsCode).toBe('string');
      expect(tsCode).toContain('let count: number = 42;');
    });

    it('quickConvert遇到错误时应该抛出异常', async () => {
      const invalidCode = 'function test( {'; // 语法错误
      
      await expect(quickConvert(invalidCode)).rejects.toThrow();
    });
  });

  describe('便捷转换函数测试', () => {
    it('convertWithStrictMode应该使用严格模式', async () => {
      const jsCode = 'function test(param) { return param; }';
      const result = await convertWithStrictMode(jsCode);
      
      expect(result).toContain('function test(param: unknown): unknown');
    });

    it('convertObjectDefinition应该生成接口', async () => {
      const jsCode = `
        const config = {
          apiUrl: "https://api.example.com",
          timeout: 5000,
          retries: 3
        };
      `;
      const result = await convertObjectDefinition(jsCode);
      
      expect(result.tsCode).toBeTruthy();
      expect(result.interfaces).toBeTruthy();
    });

    it('convertFunctionDefinition应该正确转换函数', async () => {
      const jsCode = `
        function calculateTotal(price, tax) {
          return price * (1 + tax);
        }
      `;
      const result = await convertFunctionDefinition(jsCode);
      
      expect(result).toContain('function calculateTotal(price: number, tax: number): number');
    });

    it('convertClassDefinition应该正确转换类', async () => {
      const jsCode = `
        class Calculator {
          constructor() {
            this.result = 0;
          }
          
          add(value) {
            this.result += value;
            return this;
          }
        }
      `;
      const result = await convertClassDefinition(jsCode);
      
      expect(result).toContain('class Calculator');
      expect(result).toContain('result: number');
    });
  });

  describe('预设配置测试', () => {
    it('应该有正确的预设配置', () => {
      expect(presetConfigs.basic).toBeDefined();
      expect(presetConfigs.strict).toBeDefined();
      expect(presetConfigs.fast).toBeDefined();
      expect(presetConfigs.full).toBeDefined();
    });

    it('严格预设应该启用strict模式', () => {
      expect(presetConfigs.strict.strict).toBe(true);
    });

    it('快速预设应该禁用返回类型推断', () => {
      expect(presetConfigs.fast.inferReturnTypes).toBe(false);
    });

    it('完整预设应该启用所有功能', () => {
      const fullConfig = presetConfigs.full;
      expect(fullConfig.strict).toBe(true);
      expect(fullConfig.inferReturnTypes).toBe(true);
      expect(fullConfig.generateInterfaces).toBe(true);
      expect(fullConfig.optimize).toBe(true);
    });
  });

  describe('转换器创建测试', () => {
    it('createConverter应该创建有效的转换器实例', () => {
      const converter = createConverter();
      expect(converter).toBeInstanceOf(JSToTSConverter);
    });

    it('createConverterWithPreset应该使用指定的预设', () => {
      const converter = createConverterWithPreset('strict');
      expect(converter).toBeInstanceOf(JSToTSConverter);
      
      const config = converter.getConfig();
      expect(config.strict).toBe(true);
    });

    it('createConverterWithPreset应该允许覆盖预设配置', () => {
      const converter = createConverterWithPreset('basic', { strict: true });
      const config = converter.getConfig();
      expect(config.strict).toBe(true); // 覆盖了basic预设的值
    });
  });

  describe('验证功能测试', () => {
    it('validateJavaScript应该验证有效的JS代码', () => {
      const validCode = 'function test() { return 42; }';
      const validation = validateJavaScript(validCode);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('validateJavaScript应该检测无效的JS代码', () => {
      const invalidCode = 'function test( { return 42; }'; // 缺少右括号
      const validation = validateJavaScript(invalidCode);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('validateTypeScript应该验证有效的TS代码', () => {
      const validCode = 'function test(): number { return 42; }';
      const validation = validateTypeScript(validCode);
      
      expect(validation.isValid).toBe(true);
    });
  });

  describe('错误处理测试', () => {
    it('应该处理空输入', async () => {
      const result = await convertJSToTS('');
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('应该处理语法错误', async () => {
      const invalidCode = 'function test( {';
      const result = await convertJSToTS(invalidCode);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('应该提供有用的错误信息', async () => {
      const invalidCode = 'function test( {';
      const result = await convertJSToTS(invalidCode);
      
      expect(result.errors![0].message).toContain('解析错误');
    });
  });

  describe('统计信息测试', () => {
    it('应该提供转换统计信息', async () => {
      const jsCode = `
        let name = "John";
        function greet() { return "Hello"; }
        class User {}
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.statistics).toBeDefined();
      expect(result.statistics.variablesConverted).toBeGreaterThan(0);
      expect(result.statistics.functionsConverted).toBeGreaterThan(0);
      expect(result.statistics.classesConverted).toBeGreaterThan(0);
      expect(result.statistics.conversionTime).toBeGreaterThan(0);
    });
  });

  describe('高级功能测试', () => {
    it('应该能够生成接口定义', async () => {
      const jsCode = `
        const config = {
          name: "app",
          version: 1,
          features: ["auth", "api"]
        };
      `;
      const result = await convertJSToTS(jsCode, {
        config: { generateInterfaces: true }
      });
      
      expect(result.success).toBe(true);
      // 根据配置，可能会生成接口定义
      if (result.typeDeclarations) {
        expect(result.typeDeclarations).toContain('interface');
      }
    });

    it('应该能够处理复杂的嵌套对象', async () => {
      const jsCode = `
        const user = {
          profile: {
            name: "John",
            settings: {
              theme: "dark",
              notifications: true
            }
          },
          data: [1, 2, 3]
        };
      `;
      const result = await convertJSToTS(jsCode);
      
      expect(result.success).toBe(true);
      expect(result.tsCode).toContain('profile: {');
      expect(result.tsCode).toContain('settings: {');
    });
  });

  describe('模块化测试', () => {
    let parser: JSParser;
    let inferrer: TypeInferrer;
    let transformer: SyntaxTransformer;
    let generator: TSGenerator;

    beforeEach(() => {
      parser = new JSParser();
      inferrer = new TypeInferrer(DEFAULT_CONFIG);
      transformer = new SyntaxTransformer(DEFAULT_CONFIG);
      generator = new TSGenerator(DEFAULT_CONFIG);
    });

    it('JSParser应该能够解析简单代码', () => {
      const code = 'let x = 42;';
      const ast = parser.parse(code);
      
      expect(ast).toBeDefined();
      expect(ast.type).toBe('Program');
    });

    it('TypeInferrer应该能够推断基础类型', () => {
      const numberType = inferrer.inferPrimitiveType(42);
      expect(numberType.name).toBe('number');
      
      const stringType = inferrer.inferPrimitiveType("hello");
      expect(stringType.name).toBe('string');
      
      const booleanType = inferrer.inferPrimitiveType(true);
      expect(booleanType.name).toBe('boolean');
    });

    it('TSGenerator应该能够生成基础代码', () => {
      const ast = {
        type: 'Program' as const,
        start: 0,
        end: 10,
        children: []
      };
      
      const code = generator.generate(ast);
      expect(typeof code).toBe('string');
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成转换', async () => {
      const largeCode = Array(100).fill('let x = 42;').join('\n');
      
      const startTime = Date.now();
      const result = await convertJSToTS(largeCode);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // 应该在5秒内完成
    });
  });

  describe('边界情况测试', () => {
    it('应该处理只有空白字符的代码', async () => {
      const result = await convertJSToTS('   \n  \t  \n  ');
      // 根据实现，可能成功也可能失败，但不应该崩溃
      expect(typeof result.success).toBe('boolean');
    });

    it('应该处理只有注释的代码', async () => {
      const code = `
        // 这是注释
        /* 多行注释 */
      `;
      const result = await convertJSToTS(code);
      expect(typeof result.success).toBe('boolean');
    });

    it('应该处理非常长的标识符', async () => {
      const longName = 'a'.repeat(1000);
      const code = `let ${longName} = 42;`;
      const result = await convertJSToTS(code);
      expect(typeof result.success).toBe('boolean');
    });
  });
});