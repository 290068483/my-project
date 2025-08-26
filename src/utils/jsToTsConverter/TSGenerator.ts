/**
 * TypeScript代码生成器 - 将转换后的AST生成TypeScript代码
 */

import {
  ASTNode,
  NodeType,
  VariableNode,
  FunctionNode,
  ClassNode,
  ObjectNode,
  ArrayNode,
  ParameterNode,
  PropertyNode,
  TypeInfo,
  ConversionConfig,
  PRIMITIVE_TYPES
} from './types';

export class TSGenerator {
  private config: ConversionConfig;
  private indentLevel: number = 0;
  private indentSize: number = 2;
  private output: string[] = [];

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  /**
   * 生成TypeScript代码
   */
  generate(node: ASTNode): string {
    this.output = [];
    this.indentLevel = 0;

    this.generateNode(node);

    return this.output.join('');
  }

  /**
   * 生成节点代码
   */
  private generateNode(node: ASTNode): void {
    switch (node.type) {
      case NodeType.Program:
        this.generateProgram(node);
        break;
      case NodeType.VariableDeclaration:
        this.generateVariableDeclaration(node as VariableNode);
        break;
      case NodeType.FunctionDeclaration:
        this.generateFunctionDeclaration(node as FunctionNode);
        break;
      case NodeType.ClassDeclaration:
        this.generateClassDeclaration(node as ClassNode);
        break;
      case NodeType.ObjectExpression:
        this.generateObjectExpression(node as ObjectNode);
        break;
      case NodeType.ArrayExpression:
        this.generateArrayExpression(node as ArrayNode);
        break;
      case NodeType.BlockStatement:
        this.generateBlockStatement(node);
        break;
      case NodeType.ReturnStatement:
        this.generateReturnStatement(node);
        break;
      case NodeType.ExpressionStatement:
        this.generateExpressionStatement(node);
        break;
      case NodeType.Identifier:
        this.generateIdentifier(node);
        break;
      case NodeType.Literal:
        this.generateLiteral(node);
        break;
      default:
        this.generateGenericNode(node);
    }
  }

  /**
   * 生成程序代码
   */
  private generateProgram(node: ASTNode): void {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        this.generateNode(node.children[i]);

        // 在语句之间添加空行
        if (i < node.children.length - 1) {
          this.addNewLine();
        }
      }
    }
  }

  /**
   * 生成变量声明代码
   */
  private generateVariableDeclaration(node: VariableNode): void {
    this.addIndent();
    this.output.push(node.kind);
    this.output.push(' ');
    this.output.push(node.identifier);

    // 添加类型注解
    if (this.shouldAddTypeAnnotation(node.valueType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(node.valueType));
    }

    // 添加初始化器
    if (node.initializer) {
      this.output.push(' = ');
      this.generateNode(node.initializer);
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成函数声明代码
   */
  private generateFunctionDeclaration(node: FunctionNode): void {
    this.addIndent();

    // 异步函数
    if (node.isAsync) {
      this.output.push('async ');
    }

    this.output.push('function ');

    // 生成器函数
    if (node.isGenerator) {
      this.output.push('*');
    }

    this.output.push(node.name);
    this.output.push('(');

    // 生成参数列表
    this.generateParameterList(node.parameters);

    this.output.push(')');

    // 添加返回类型注解
    if (this.shouldAddReturnTypeAnnotation(node.returnType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(node.returnType));
    }

    this.output.push(' ');

    // 生成函数体
    this.generateNode(node.body);

    this.addNewLine();
  }

  /**
   * 生成参数列表代码
   */
  private generateParameterList(parameters: ParameterNode[]): void {
    for (let i = 0; i < parameters.length; i++) {
      const param = parameters[i];

      // 剩余参数
      if (param.isRest) {
        this.output.push('...');
      }

      this.output.push(param.name);

      // 可选参数
      if (param.paramType.isOptional) {
        this.output.push('?');
      }

      // 参数类型注解
      if (this.shouldAddTypeAnnotation(param.paramType)) {
        this.output.push(': ');
        this.output.push(this.generateTypeAnnotation(param.paramType));
      }

      // 默认值
      if (param.defaultValue) {
        this.output.push(' = ');
        if (typeof param.defaultValue === 'object' && param.defaultValue.type) {
          this.generateNode(param.defaultValue);
        } else {
          this.output.push(String(param.defaultValue));
        }
      }

      // 参数分隔符
      if (i < parameters.length - 1) {
        this.output.push(', ');
      }
    }
  }

  /**
   * 生成类声明代码
   */
  private generateClassDeclaration(node: ClassNode): void {
    this.addIndent();
    this.output.push('class ');
    this.output.push(node.name);

    // 继承
    if (node.superClass) {
      this.output.push(' extends ');
      this.output.push(node.superClass);
    }

    this.output.push(' {');
    this.addNewLine();
    this.increaseIndent();

    // 生成属性
    for (const prop of node.properties) {
      this.generatePropertyDeclaration(prop);
    }

    // 生成构造函数
    if (node.constructor) {
      this.generateConstructor(node.constructor);
    }

    // 生成方法
    for (const method of node.methods) {
      this.generateMethodDeclaration(method);
    }

    this.decreaseIndent();
    this.addIndent();
    this.output.push('}');
    this.addNewLine();
  }

  /**
   * 生成属性声明代码
   */
  private generatePropertyDeclaration(prop: PropertyNode): void {
    this.addIndent();

    // 访问修饰符
    if (prop.isPrivate) {
      this.output.push('private ');
    }

    if (prop.isStatic) {
      this.output.push('static ');
    }

    if (prop.isReadonly) {
      this.output.push('readonly ');
    }

    this.output.push(prop.name);

    // 可选属性
    if (prop.propertyType.isOptional) {
      this.output.push('?');
    }

    // 类型注解
    if (this.shouldAddTypeAnnotation(prop.propertyType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(prop.propertyType));
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成构造函数代码
   */
  private generateConstructor(constructor: FunctionNode): void {
    this.addIndent();
    this.output.push('constructor(');
    this.generateParameterList(constructor.parameters);
    this.output.push(') ');
    this.generateNode(constructor.body);
    this.addNewLine();
  }

  /**
   * 生成方法声明代码
   */
  private generateMethodDeclaration(method: FunctionNode): void {
    this.addIndent();

    if (method.isAsync) {
      this.output.push('async ');
    }

    this.output.push(method.name);

    if (method.isGenerator) {
      this.output.push('*');
    }

    this.output.push('(');
    this.generateParameterList(method.parameters);
    this.output.push(')');

    // 返回类型注解
    if (this.shouldAddReturnTypeAnnotation(method.returnType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(method.returnType));
    }

    this.output.push(' ');
    this.generateNode(method.body);
    this.addNewLine();
  }

  /**
   * 生成对象表达式代码
   */
  private generateObjectExpression(node: ObjectNode): void {
    this.output.push('{');

    if (node.properties.length > 0) {
      this.addNewLine();
      this.increaseIndent();

      for (let i = 0; i < node.properties.length; i++) {
        const prop = node.properties[i];
        this.addIndent();
        this.output.push(prop.key);
        this.output.push(': ');
        this.generateNode(prop.value);

        if (i < node.properties.length - 1) {
          this.output.push(',');
        }

        this.addNewLine();
      }

      this.decreaseIndent();
      this.addIndent();
    }

    this.output.push('}');
  }

  /**
   * 生成数组表达式代码
   */
  private generateArrayExpression(node: ArrayNode): void {
    this.output.push('[');

    for (let i = 0; i < node.elements.length; i++) {
      this.generateNode(node.elements[i]);

      if (i < node.elements.length - 1) {
        this.output.push(', ');
      }
    }

    this.output.push(']');
  }

  /**
   * 生成块语句代码
   */
  private generateBlockStatement(node: ASTNode): void {
    this.output.push('{');

    if (node.children && node.children.length > 0) {
      this.addNewLine();
      this.increaseIndent();

      for (const child of node.children) {
        this.generateNode(child);
      }

      this.decreaseIndent();
      this.addIndent();
    }

    this.output.push('}');
  }

  /**
   * 生成返回语句代码
   */
  private generateReturnStatement(node: ASTNode): void {
    this.addIndent();
    this.output.push('return');

    if (node.children && node.children.length > 0) {
      this.output.push(' ');
      this.generateNode(node.children[0]);
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成表达式语句代码
   */
  private generateExpressionStatement(node: ASTNode): void {
    this.addIndent();

    if (node.children && node.children.length > 0) {
      this.generateNode(node.children[0]);
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成标识符代码
   */
  private generateIdentifier(node: ASTNode): void {
    this.output.push(node.raw || '');
  }

  /**
   * 生成字面量代码
   */
  private generateLiteral(node: ASTNode): void {
    this.output.push(node.raw || '');
  }

  /**
   * 生成通用节点代码
   */
  private generateGenericNode(node: ASTNode): void {
    if (node.raw) {
      this.output.push(node.raw);
    } else if (node.children) {
      for (const child of node.children) {
        this.generateNode(child);
      }
    }
  }

  /**
   * 生成类型注解
   */
  private generateTypeAnnotation(type: TypeInfo): string {
    if (type.unionTypes && type.unionTypes.length > 0) {
      return type.unionTypes.map(t => this.generateTypeAnnotation(t)).join(' | ');
    }

    if (type.isArray) {
      const baseType = type.name.replace('[]', '');
      return `${baseType}[]`;
    }

    return type.name;
  }

  /**
   * 判断是否应该添加类型注解
   */
  private shouldAddTypeAnnotation(type: TypeInfo): boolean {
    if (!this.config.strict && type.name === 'any') {
      return false;
    }

    // 在严格模式下，总是添加类型注解
    return this.config.strict || type.name !== 'any';
  }

  /**
   * 判断是否应该添加返回类型注解
   */
  private shouldAddReturnTypeAnnotation(type: TypeInfo): boolean {
    if (!this.config.inferReturnTypes) {
      return false;
    }

    return this.shouldAddTypeAnnotation(type);
  }

  /**
   * 添加缩进
   */
  private addIndent(): void {
    this.output.push(' '.repeat(this.indentLevel * this.indentSize));
  }

  /**
   * 添加换行
   */
  private addNewLine(): void {
    this.output.push('\n');
  }

  /**
   * 增加缩进级别
   */
  private increaseIndent(): void {
    this.indentLevel++;
  }

  /**
   * 减少缩进级别
   */
  private decreaseIndent(): void {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
  }

  /**
   * 格式化代码
   */
  format(code: string): string {
    if (!this.config.optimize) {
      return code;
    }

    // 简化的格式化实现
    return code
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 移除多余的空行
      .replace(/;\s*\n\s*\n/g, ';\n') // 统一语句间距
      .trim();
  }

  /**
   * 生成类型声明文件
   */
  generateTypeDeclarations(interfaces: string[]): string {
    if (!this.config.generateInterfaces || interfaces.length === 0) {
      return '';
    }

    return interfaces.join('\n\n') + '\n';
  }

  /**
   * 重置生成器状态
   */
  reset(): void {
    this.output = [];
    this.indentLevel = 0;
  }
}

  /**
   * 生成类声明代码
   */
  private generateClassDeclaration(node: ClassNode): void {
    this.addIndent();
    this.output.push('class ');
    this.output.push(node.name);

    // 继承
    if (node.superClass) {
      this.output.push(' extends ');
      this.output.push(node.superClass);
    }

    this.output.push(' {');
    this.addNewLine();
    this.increaseIndent();

    // 生成属性
    for (const prop of node.properties) {
      this.generateProperty(prop);
    }

    // 生成构造函数
    if (node.constructor) {
      if (node.properties.length > 0) {
        this.addNewLine();
      }
      this.generateConstructor(node.constructor);
    }

    // 生成方法
    for (const method of node.methods) {
      if (node.properties.length > 0 || node.constructor) {
        this.addNewLine();
      }
      this.generateMethod(method);
    }

    this.decreaseIndent();
    this.addIndent();
    this.output.push('}');
    this.addNewLine();
  }

  /**
   * 生成属性代码
   */
  private generateProperty(prop: PropertyNode): void {
    this.addIndent();

    // 访问修饰符
    if (prop.isPrivate) {
      this.output.push('private ');
    }

    if (prop.isStatic) {
      this.output.push('static ');
    }

    if (prop.isReadonly) {
      this.output.push('readonly ');
    }

    this.output.push(prop.name);

    // 可选属性
    if (prop.propertyType.isOptional) {
      this.output.push('?');
    }

    // 类型注解
    if (this.shouldAddTypeAnnotation(prop.propertyType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(prop.propertyType));
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成构造函数代码
   */
  private generateConstructor(constructor: FunctionNode): void {
    this.addIndent();
    this.output.push('constructor(');
    this.generateParameterList(constructor.parameters);
    this.output.push(') ');
    this.generateNode(constructor.body);
    this.addNewLine();
  }

  /**
   * 生成方法代码
   */
  private generateMethod(method: FunctionNode): void {
    this.addIndent();

    if (method.isAsync) {
      this.output.push('async ');
    }

    this.output.push(method.name);
    this.output.push('(');
    this.generateParameterList(method.parameters);
    this.output.push(')');

    if (this.shouldAddReturnTypeAnnotation(method.returnType)) {
      this.output.push(': ');
      this.output.push(this.generateTypeAnnotation(method.returnType));
    }

    this.output.push(' ');
    this.generateNode(method.body);
    this.addNewLine();
  }

  /**
   * 生成对象表达式代码
   */
  private generateObjectExpression(node: ObjectNode): void {
    if (node.properties.length === 0) {
      this.output.push('{}');
      return;
    }

    this.output.push('{');

    if (this.config.preserveComments) {
      this.addNewLine();
      this.increaseIndent();

      for (let i = 0; i < node.properties.length; i++) {
        const prop = node.properties[i];
        this.addIndent();
        this.output.push(prop.key);
        this.output.push(': ');
        this.generateNode(prop.value);

        if (i < node.properties.length - 1) {
          this.output.push(',');
        }

        this.addNewLine();
      }

      this.decreaseIndent();
      this.addIndent();
      this.output.push('}');
    } else {
      // 单行格式
      this.output.push(' ');
      for (let i = 0; i < node.properties.length; i++) {
        const prop = node.properties[i];
        this.output.push(prop.key);
        this.output.push(': ');
        this.generateNode(prop.value);

        if (i < node.properties.length - 1) {
          this.output.push(', ');
        }
      }
      this.output.push(' }');
    }
  }

  /**
   * 生成数组表达式代码
   */
  private generateArrayExpression(node: ArrayNode): void {
    this.output.push('[');

    for (let i = 0; i < node.elements.length; i++) {
      this.generateNode(node.elements[i]);

      if (i < node.elements.length - 1) {
        this.output.push(', ');
      }
    }

    this.output.push(']');
  }

  /**
   * 生成块语句代码
   */
  private generateBlockStatement(node: ASTNode): void {
    this.output.push('{');

    if (node.children && node.children.length > 0) {
      this.addNewLine();
      this.increaseIndent();

      for (const child of node.children) {
        this.generateNode(child);
      }

      this.decreaseIndent();
      this.addIndent();
    }

    this.output.push('}');
  }

  /**
   * 生成返回语句代码
   */
  private generateReturnStatement(node: ASTNode): void {
    this.addIndent();
    this.output.push('return');

    if (node.children && node.children.length > 0) {
      this.output.push(' ');
      this.generateNode(node.children[0]);
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成表达式语句代码
   */
  private generateExpressionStatement(node: ASTNode): void {
    this.addIndent();

    if (node.children && node.children.length > 0) {
      this.generateNode(node.children[0]);
    }

    this.output.push(';');
    this.addNewLine();
  }

  /**
   * 生成标识符代码
   */
  private generateIdentifier(node: ASTNode): void {
    this.output.push(node.raw || '');
  }

  /**
   * 生成字面量代码
   */
  private generateLiteral(node: ASTNode): void {
    this.output.push(node.raw || '');
  }

  /**
   * 生成通用节点代码
   */
  private generateGenericNode(node: ASTNode): void {
    if (node.raw) {
      this.output.push(node.raw);
    }

    if (node.children) {
      for (const child of node.children) {
        this.generateNode(child);
      }
    }
  }

  /**
   * 生成类型注解
   */
  private generateTypeAnnotation(type: TypeInfo): string {
    let result = '';

    if (type.unionTypes && type.unionTypes.length > 0) {
      // 联合类型
      result = type.unionTypes.map(t => this.generateTypeAnnotation(t)).join(' | ');
      if (type.unionTypes.length > 1) {
        result = `(${result})`;
      }
    } else if (type.properties && Object.keys(type.properties).length > 0) {
      // 对象类型
      result = this.generateObjectType(type);
    } else {
      // 基础类型
      result = type.name;
    }

    // 数组类型
    if (type.isArray) {
      if (type.unionTypes && type.unionTypes.length > 1) {
        result += '[]';
      } else {
        result += '[]';
      }
    }

    return result;
  }

  /**
   * 生成对象类型注解
   */
  private generateObjectType(type: TypeInfo): string {
    if (!type.properties) {
      return 'object';
    }

    const properties = Object.entries(type.properties);
    if (properties.length === 0) {
      return '{}';
    }

    if (properties.length === 1) {
      const [key, propType] = properties[0];
      const optional = propType.isOptional ? '?' : '';
      return `{ ${key}${optional}: ${this.generateTypeAnnotation(propType)} }`;
    }

    // 多属性对象类型，使用多行格式
    let result = '{\n';
    for (const [key, propType] of properties) {
      const optional = propType.isOptional ? '?' : '';
      result += `  ${key}${optional}: ${this.generateTypeAnnotation(propType)};\n`;
    }
    result += '}';

    return result;
  }

  /**
   * 判断是否需要添加类型注解
   */
  private shouldAddTypeAnnotation(type: TypeInfo): boolean {
    // 在严格模式下，总是添���类型注解
    if (this.config.strict) {
      return true;
    }

    // 如果不是any类型，添加注解
    if (type.name !== PRIMITIVE_TYPES.ANY) {
      return true;
    }

    // 如果有联合类型或属性，添加注解
    if (type.unionTypes || type.properties) {
      return true;
    }

    return false;
  }

  /**
   * 判断是否需要添加返回类型注解
   */
  private shouldAddReturnTypeAnnotation(type: TypeInfo): boolean {
    if (!this.config.inferReturnTypes) {
      return false;
    }

    // void类型不需要显式注解
    if (type.name === PRIMITIVE_TYPES.VOID) {
      return false;
    }

    return this.shouldAddTypeAnnotation(type);
  }

  /**
   * 添加缩进
   */
  private addIndent(): void {
    this.output.push(' '.repeat(this.indentLevel * this.indentSize));
  }

  /**
   * 增加缩进级别
   */
  private increaseIndent(): void {
    this.indentLevel++;
  }

  /**
   * 减少缩进级别
   */
  private decreaseIndent(): void {
    this.indentLevel = Math.max(0, this.indentLevel - 1);
  }

  /**
   * 添加新行
   */
  private addNewLine(): void {
    this.output.push('\n');
  }

  /**
   * 生成类型声明文件内容
   */
  generateTypeDeclarations(interfaces: string[]): string {
    if (interfaces.length === 0) {
      return '';
    }

    let result = '// 自动生成的类型声明\n\n';

    for (const interfaceDef of interfaces) {
      result += interfaceDef + '\n\n';
    }

    return result.trim();
  }

  /**
   * 格式化生成的代码
   */
  format(code: string): string {
    if (!this.config.optimize) {
      return code;
    }

    // 简单的代码格式化
    return code
      .replace(/\n\s*\n\s*\n/g, '\n\n') // 移除多余空行
      .replace(/\s+$/gm, '') // 移除行尾空白
      .replace(/\n$/g, '') + '\n'; // 确保文件以换行结束
  }

  /**
   * 重置生成器状态
   */
  reset(): void {
    this.output = [];
    this.indentLevel = 0;
  }
}
