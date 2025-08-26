/**
 * 类型推断器 - 分析JavaScript代码并推断TypeScript类型
 */

import {
  TypeInfo,
  ASTNode,
  NodeType,
  PRIMITIVE_TYPES,
  InferenceContext,
  ConversionConfig,
  ObjectNode,
  ArrayNode,
  FunctionNode,
  VariableNode
} from './types';

export class TypeInferrer {
  private config: ConversionConfig;
  private typeCache: Map<string, TypeInfo> = new Map();

  constructor(config: ConversionConfig) {
    this.config = config;
  }

  /**
   * 推断节点的类型
   */
  inferType(node: ASTNode, context: InferenceContext): TypeInfo {
    const cacheKey = this.generateCacheKey(node);

    if (this.typeCache.has(cacheKey)) {
      return this.typeCache.get(cacheKey)!;
    }

    let type: TypeInfo;

    switch (node.type) {
      case NodeType.Literal:
        type = this.inferLiteralType(node);
        break;
      case NodeType.Identifier:
        type = this.inferIdentifierType(node, context);
        break;
      case NodeType.ObjectExpression:
        type = this.inferObjectType(node as ObjectNode, context);
        break;
      case NodeType.ArrayExpression:
        type = this.inferArrayType(node as ArrayNode, context);
        break;
      case NodeType.FunctionDeclaration:
        type = this.inferFunctionType(node as FunctionNode, context);
        break;
      case NodeType.CallExpression:
        type = this.inferCallExpressionType(node, context);
        break;
      case NodeType.MemberExpression:
        type = this.inferMemberExpressionType(node, context);
        break;
      default:
        type = this.createAnyType();
    }

    this.typeCache.set(cacheKey, type);
    return type;
  }

  /**
   * 推断字面量类型
   */
  private inferLiteralType(node: ASTNode): TypeInfo {
    if (!node.raw) {
      return this.createAnyType();
    }

    const value = this.parseValue(node.raw);
    return this.inferPrimitiveType(value);
  }

  /**
   * 推断基础类型
   */
  inferPrimitiveType(value: any): TypeInfo {
    if (value === null) {
      return { name: PRIMITIVE_TYPES.NULL, isOptional: false, isArray: false };
    }

    if (value === undefined) {
      return { name: PRIMITIVE_TYPES.UNDEFINED, isOptional: false, isArray: false };
    }

    const type = typeof value;

    switch (type) {
      case 'string':
        return { name: PRIMITIVE_TYPES.STRING, isOptional: false, isArray: false };
      case 'number':
        return { name: PRIMITIVE_TYPES.NUMBER, isOptional: false, isArray: false };
      case 'boolean':
        return { name: PRIMITIVE_TYPES.BOOLEAN, isOptional: false, isArray: false };
      case 'object':
        if (Array.isArray(value)) {
          return this.inferArrayTypeFromValue(value);
        }
        return this.inferObjectTypeFromValue(value);
      default:
        return this.createAnyType();
    }
  }

  /**
   * 推断标识符类型
   */
  private inferIdentifierType(node: ASTNode, context: InferenceContext): TypeInfo {
    const name = node.raw || '';

    // 从作用域中查找类型
    if (context.scope.has(name)) {
      return context.scope.get(name)!;
    }

    // 检查是否是内置类型或全局变量
    if (this.isBuiltinType(name)) {
      return this.getBuiltinType(name);
    }

    return this.createAnyType();
  }

  /**
   * 推断对象类型
   */
  private inferObjectType(node: ObjectNode, context: InferenceContext): TypeInfo {
    const properties: Record<string, TypeInfo> = {};

    for (const prop of node.properties) {
      const propType = this.inferType(prop.value, context);
      properties[prop.key] = propType;
    }

    return {
      name: 'object',
      isOptional: false,
      isArray: false,
      properties
    };
  }

  /**
   * 推断数组类型
   */
  private inferArrayType(node: ArrayNode, context: InferenceContext): TypeInfo {
    if (node.elements.length === 0) {
      return {
        name: PRIMITIVE_TYPES.ANY,
        isOptional: false,
        isArray: true
      };
    }

    // 推断所有元素的类型
    const elementTypes = node.elements.map(element =>
      this.inferType(element, context)
    );

    // 创建联合类型或统一类型
    const unifiedType = this.unifyTypes(elementTypes);

    return {
      ...unifiedType,
      isArray: true
    };
  }

  /**
   * 推断函数类型
   */
  private inferFunctionType(node: FunctionNode, context: InferenceContext): TypeInfo {
    // 函数类型通常表示为函数签名
    const paramTypes = node.parameters.map(param => param.paramType);
    const returnType = node.returnType;

    return {
      name: 'Function',
      isOptional: false,
      isArray: false,
      properties: {
        parameters: {
          name: 'array',
          isOptional: false,
          isArray: true,
          unionTypes: paramTypes
        },
        returnType: returnType
      }
    };
  }

  /**
   * 推断函数调用表达式类型
   */
  private inferCallExpressionType(node: ASTNode, context: InferenceContext): TypeInfo {
    // 简化实现：根据调用上下文推断返回类型
    return this.createAnyType();
  }

  /**
   * 推断成员表达式类型
   */
  private inferMemberExpressionType(node: ASTNode, context: InferenceContext): TypeInfo {
    // 简化实现：根据对象和属性推断类型
    return this.createAnyType();
  }

  /**
   * 统一多个类型为一个类型
   */
  private unifyTypes(types: TypeInfo[]): TypeInfo {
    if (types.length === 0) {
      return this.createAnyType();
    }

    if (types.length === 1) {
      return types[0];
    }

    // 检查是否所有类型都相同
    const firstType = types[0];
    const allSame = types.every(type => type.name === firstType.name);

    if (allSame) {
      return firstType;
    }

    // 创建联合类型
    const uniqueTypes = Array.from(
      new Map(types.map(type => [type.name, type])).values()
    );

    if (uniqueTypes.length <= 3) {
      const unionName = uniqueTypes.map(t => t.name).join(' | ');
      return {
        name: unionName,
        isOptional: false,
        isArray: false,
        unionTypes: uniqueTypes
      };
    }

    // 如果类型太多，使用any
    return this.createAnyType();
  }

  /**
   * 从值推断数组类型
   */
  private inferArrayTypeFromValue(arr: any[]): TypeInfo {
    if (arr.length === 0) {
      return {
        name: PRIMITIVE_TYPES.ANY,
        isOptional: false,
        isArray: true
      };
    }

    const elementTypes = arr.map(item => this.inferPrimitiveType(item));
    const unifiedType = this.unifyTypes(elementTypes);

    return {
      ...unifiedType,
      isArray: true
    };
  }

  /**
   * 从值推断对象类型
   */
  private inferObjectTypeFromValue(obj: Record<string, any>): TypeInfo {
    if (!obj || typeof obj !== 'object') {
      return this.createAnyType();
    }

    const properties: Record<string, TypeInfo> = {};

    for (const [key, value] of Object.entries(obj)) {
      properties[key] = this.inferPrimitiveType(value);
    }

    return {
      name: 'object',
      isOptional: false,
      isArray: false,
      properties
    };
  }

  /**
   * 解析值
   */
  private parseValue(raw: string): any {
    try {
      // 尝试解析JSON
      return JSON.parse(raw);
    } catch {
      // 如果不是JSON，检查特殊值
      if (raw === 'null') return null;
      if (raw === 'undefined') return undefined;
      if (raw === 'true') return true;
      if (raw === 'false') return false;

      // 检查是否是数字
      const num = Number(raw);
      if (!isNaN(num)) return num;

      // 默认为字符串（去掉引号）
      if ((raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith("'") && raw.endsWith("'"))) {
        return raw.slice(1, -1);
      }

      return raw;
    }
  }

  /**
   * 检查是否是内置类型
   */
  private isBuiltinType(name: string): boolean {
    const builtins = ['console', 'window', 'document', 'process', 'global'];
    return builtins.includes(name);
  }

  /**
   * 获取内置类型
   */
  private getBuiltinType(name: string): TypeInfo {
    const builtinTypes: Record<string, TypeInfo> = {
      'console': { name: 'Console', isOptional: false, isArray: false },
      'window': { name: 'Window', isOptional: false, isArray: false },
      'document': { name: 'Document', isOptional: false, isArray: false },
      'process': { name: 'Process', isOptional: false, isArray: false },
      'global': { name: 'Global', isOptional: false, isArray: false }
    };

    return builtinTypes[name] || this.createAnyType();
  }

  /**
   * 创建any类型
   */
  private createAnyType(): TypeInfo {
    return {
      name: PRIMITIVE_TYPES.ANY,
      isOptional: false,
      isArray: false
    };
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(node: ASTNode): string {
    return `${node.type}:${node.start}:${node.end}:${node.raw || ''}`;
  }

  /**
   * 清除类型缓存
   */
  clearCache(): void {
    this.typeCache.clear();
  }

  /**
   * 推断函数返回类型
   */
  inferReturnType(functionNode: FunctionNode, context: InferenceContext): TypeInfo {
    // 如果已经有返回类型，直接返回
    if (functionNode.returnType && functionNode.returnType.name !== 'any') {
      return functionNode.returnType;
    }

    // 分析函数体中的return语句
    const returnTypes = this.findReturnTypes(functionNode.body, context);

    if (returnTypes.length === 0) {
      return { name: 'void', isOptional: false, isArray: false };
    }

    if (returnTypes.length === 1) {
      return returnTypes[0];
    }

    // 多个返回类型，创建联合类型
    return this.unifyTypes(returnTypes);
  }

  /**
   * 推断参数类型
   */
  inferParameterType(paramNode: ParameterNode, context: InferenceContext): TypeInfo {
    // 如果有默认值，根据默认值推断类型
    if (paramNode.defaultValue !== undefined) {
      return this.inferPrimitiveType(paramNode.defaultValue);
    }

    // 如果已经有类型注解，直接返回
    if (paramNode.paramType && paramNode.paramType.name !== 'any') {
      return paramNode.paramType;
    }

    // 默认使用any类型
    return this.createAnyType();
  }

  /**
   * 查找函数体中的返回类型
   */
  private findReturnTypes(bodyNode: ASTNode, context: InferenceContext): TypeInfo[] {
    const returnTypes: TypeInfo[] = [];

    const findReturns = (node: ASTNode) => {
      if (node.type === NodeType.ReturnStatement && node.children && node.children.length > 0) {
        const returnExpr = node.children[0];
        const returnType = this.inferType(returnExpr, context);
        returnTypes.push(returnType);
      }

      if (node.children) {
        for (const child of node.children) {
          findReturns(child);
        }
      }
    };

    findReturns(bodyNode);
    return returnTypes;
  }

  /**
   * 获取类型缓存统计
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.typeCache.size,
      hitRate: 0 // 简化实现
    };
  }
}
   */
  private inferCallExpressionType(node: ASTNode, context: InferenceContext): TypeInfo {
    // 基础实现，可以根据已知函数返回类型进行推断
    return this.createAnyType();
  }

  /**
   * 推断成员表达式类型
   */
  private inferMemberExpressionType(node: ASTNode, context: InferenceContext): TypeInfo {
    // 基础实现，可以根据对象属性类型进行推断
    return this.createAnyType();
  }

  /**
   * 从值推断数组类型
   */
  private inferArrayTypeFromValue(value: any[]): TypeInfo {
    if (value.length === 0) {
      return {
        name: PRIMITIVE_TYPES.ANY,
        isOptional: false,
        isArray: true
      };
    }

    const elementTypes = value.map(item => this.inferPrimitiveType(item));
    const unifiedType = this.unifyTypes(elementTypes);

    return {
      ...unifiedType,
      isArray: true
    };
  }

  /**
   * 从值推断对象类型
   */
  private inferObjectTypeFromValue(value: Record<string, any>): TypeInfo {
    const properties: Record<string, TypeInfo> = {};

    for (const [key, val] of Object.entries(value)) {
      properties[key] = this.inferPrimitiveType(val);
    }

    return {
      name: 'object',
      isOptional: false,
      isArray: false,
      properties
    };
  }

  /**
   * 统一多个类型为单一类型或联合类型
   */
  private unifyTypes(types: TypeInfo[]): TypeInfo {
    if (types.length === 0) {
      return this.createAnyType();
    }

    if (types.length === 1) {
      return types[0];
    }

    // 检查是否所有类型都相同
    const firstType = types[0];
    const allSame = types.every(type =>
      type.name === firstType.name &&
      type.isArray === firstType.isArray
    );

    if (allSame) {
      return firstType;
    }

    // 创建联合类型
    return {
      name: 'union',
      isOptional: false,
      isArray: false,
      unionTypes: this.deduplicateTypes(types)
    };
  }

  /**
   * 去重类型数组
   */
  private deduplicateTypes(types: TypeInfo[]): TypeInfo[] {
    const seen = new Set<string>();
    const result: TypeInfo[] = [];

    for (const type of types) {
      const key = this.typeToString(type);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(type);
      }
    }

    return result;
  }

  /**
   * 将类型转换为字符串表示
   */
  private typeToString(type: TypeInfo): string {
    let result = type.name;

    if (type.isArray) {
      result += '[]';
    }

    if (type.unionTypes && type.unionTypes.length > 0) {
      const unionStr = type.unionTypes.map(t => this.typeToString(t)).join(' | ');
      result = `(${unionStr})`;
    }

    return result;
  }

  /**
   * 检查是否是内置类型
   */
  private isBuiltinType(name: string): boolean {
    const builtinTypes = [
      'console', 'window', 'document', 'Array', 'Object', 'String',
      'Number', 'Boolean', 'Date', 'RegExp', 'Error', 'Promise'
    ];
    return builtinTypes.includes(name);
  }

  /**
   * 获取内置类型
   */
  private getBuiltinType(name: string): TypeInfo {
    const typeMapping: Record<string, TypeInfo> = {
      console: { name: 'Console', isOptional: false, isArray: false },
      window: { name: 'Window', isOptional: false, isArray: false },
      document: { name: 'Document', isOptional: false, isArray: false },
      Array: { name: 'ArrayConstructor', isOptional: false, isArray: false },
      Object: { name: 'ObjectConstructor', isOptional: false, isArray: false },
      String: { name: 'StringConstructor', isOptional: false, isArray: false },
      Number: { name: 'NumberConstructor', isOptional: false, isArray: false },
      Boolean: { name: 'BooleanConstructor', isOptional: false, isArray: false },
      Date: { name: 'DateConstructor', isOptional: false, isArray: false },
      RegExp: { name: 'RegExpConstructor', isOptional: false, isArray: false },
      Error: { name: 'ErrorConstructor', isOptional: false, isArray: false },
      Promise: { name: 'PromiseConstructor', isOptional: false, isArray: false }
    };

    return typeMapping[name] || this.createAnyType();
  }

  /**
   * 创建any类型
   */
  private createAnyType(): TypeInfo {
    return { name: PRIMITIVE_TYPES.ANY, isOptional: false, isArray: false };
  }

  /**
   * 解析字符串值
   */
  private parseValue(raw: string): any {
    try {
      // 去掉引号
      if ((raw.startsWith('"') && raw.endsWith('"')) ||
          (raw.startsWith("'") && raw.endsWith("'"))) {
        return raw.slice(1, -1);
      }

      // 解析数字
      if (!isNaN(Number(raw))) {
        return Number(raw);
      }

      // 解析布尔值
      if (raw === 'true') return true;
      if (raw === 'false') return false;

      // 解析null和undefined
      if (raw === 'null') return null;
      if (raw === 'undefined') return undefined;

      return raw;
    } catch {
      return raw;
    }
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(node: ASTNode): string {
    return `${node.type}_${node.start}_${node.end}_${node.raw || ''}`;
  }

  /**
   * 推断函数参数类型
   */
  inferParameterType(paramNode: ASTNode, context: InferenceContext): TypeInfo {
    // 如果参数有默认值，根据默认值推断类型
    if (paramNode.children && paramNode.children.length > 0) {
      return this.inferType(paramNode.children[0], context);
    }

    // 如果配置为严格模式，返回unknown类型，否则返回any类型
    return this.config.strict ?
      { name: PRIMITIVE_TYPES.UNKNOWN, isOptional: false, isArray: false } :
      this.createAnyType();
  }

  /**
   * 推断函数返回类型
   */
  inferReturnType(functionNode: FunctionNode, context: InferenceContext): TypeInfo {
    if (!this.config.inferReturnTypes) {
      return { name: PRIMITIVE_TYPES.VOID, isOptional: false, isArray: false };
    }

    // 分析函数体中的return语句
    const returnTypes = this.findReturnTypes(functionNode.body, context);

    if (returnTypes.length === 0) {
      return { name: PRIMITIVE_TYPES.VOID, isOptional: false, isArray: false };
    }

    return this.unifyTypes(returnTypes);
  }

  /**
   * 查找函数体中的返回类型
   */
  private findReturnTypes(bodyNode: ASTNode, context: InferenceContext): TypeInfo[] {
    const returnTypes: TypeInfo[] = [];

    const traverse = (node: ASTNode) => {
      if (node.type === NodeType.ReturnStatement && node.children && node.children.length > 0) {
        const returnValue = node.children[0];
        returnTypes.push(this.inferType(returnValue, context));
      }

      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    traverse(bodyNode);
    return returnTypes;
  }

  /**
   * 清除类型缓存
   */
  clearCache(): void {
    this.typeCache.clear();
  }
}
