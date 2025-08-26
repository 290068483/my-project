/**
 * 语法转换器 - 将JavaScript AST转换为TypeScript AST
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
  TransformContext,
  ConversionConfig,
  PRIMITIVE_TYPES
} from './types';
import { TypeInferrer } from './TypeInferrer';

export class SyntaxTransformer {
  private typeInferrer: TypeInferrer;
  private context: TransformContext;

  constructor(config: ConversionConfig) {
    this.typeInferrer = new TypeInferrer(config);
    this.context = {
      config,
      currentScope: new Map(),
      typeRegistry: new Map(),
      imports: new Set(),
      exports: new Set()
    };
  }

  /**
   * 转换AST节点
   */
  transform(node: ASTNode): ASTNode {
    switch (node.type) {
      case NodeType.Program:
        return this.transformProgram(node);
      case NodeType.VariableDeclaration:
        return this.transformVariableDeclaration(node as VariableNode);
      case NodeType.FunctionDeclaration:
        return this.transformFunctionDeclaration(node as FunctionNode);
      case NodeType.ClassDeclaration:
        return this.transformClassDeclaration(node as ClassNode);
      case NodeType.ObjectExpression:
        return this.transformObjectExpression(node as ObjectNode);
      case NodeType.ArrayExpression:
        return this.transformArrayExpression(node as ArrayNode);
      case NodeType.BlockStatement:
        return this.transformBlockStatement(node);
      case NodeType.ReturnStatement:
        return this.transformReturnStatement(node);
      case NodeType.ExpressionStatement:
        return this.transformExpressionStatement(node);
      default:
        return this.transformGenericNode(node);
    }
  }

  /**
   * 转换程序节点
   */
  private transformProgram(node: ASTNode): ASTNode {
    const transformedChildren: ASTNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换变量声明
   */
  private transformVariableDeclaration(node: VariableNode): VariableNode {
    let valueType = node.valueType;

    // 如果有初始值，推断类型
    if (node.initializer) {
      const inferenceContext = {
        node: node.initializer,
        parent: node,
        scope: this.context.currentScope,
        config: this.context.config
      };

      valueType = this.typeInferrer.inferType(node.initializer, inferenceContext);
    }

    // 更新作用域
    this.context.currentScope.set(node.identifier, valueType);

    // 转换初始化器
    let transformedInitializer: ASTNode | undefined;
    if (node.initializer) {
      transformedInitializer = this.transform(node.initializer);
    }

    return {
      ...node,
      valueType,
      initializer: transformedInitializer
    };
  }

  /**
   * 转换函数声明
   */
  private transformFunctionDeclaration(node: FunctionNode): FunctionNode {
    // 保存当前上下文
    const previousFunction = this.context.currentFunction;
    const previousScope = new Map(this.context.currentScope);

    this.context.currentFunction = node;

    // 转换参数
    const transformedParameters: ParameterNode[] = [];
    for (const param of node.parameters) {
      const transformedParam = this.transformParameter(param);
      transformedParameters.push(transformedParam);

      // 将参数添加到作用域
      this.context.currentScope.set(param.name, transformedParam.paramType);
    }

    // 转换函数体
    const transformedBody = this.transform(node.body);

    // 推断返回类型
    let returnType = node.returnType;
    if (this.context.config.inferReturnTypes) {
      const inferenceContext = {
        node: node.body,
        parent: node,
        scope: this.context.currentScope,
        config: this.context.config
      };

      returnType = this.typeInferrer.inferReturnType(node, inferenceContext);
    }

    // 恢复上下文
    this.context.currentFunction = previousFunction;
    this.context.currentScope = previousScope;

    return {
      ...node,
      parameters: transformedParameters,
      returnType,
      body: transformedBody
    };
  }

  /**
   * 转换参数
   */
  private transformParameter(param: ParameterNode): ParameterNode {
    let paramType = param.paramType;

    // 如果有默认值，根据默认值推断类型
    if (param.defaultValue) {
      const inferenceContext = {
        node: param,
        scope: this.context.currentScope,
        config: this.context.config
      };

      paramType = this.typeInferrer.inferParameterType(param, inferenceContext);
    }

    return {
      ...param,
      paramType
    };
  }

  /**
   * 转换类声明
   */
  private transformClassDeclaration(node: ClassNode): ClassNode {
    // 保存当前上下文
    const previousClass = this.context.currentClass;
    const previousScope = new Map(this.context.currentScope);

    this.context.currentClass = node;

    // 转换属性
    const transformedProperties: PropertyNode[] = [];
    for (const prop of node.properties) {
      const transformedProp = this.transformProperty(prop);
      transformedProperties.push(transformedProp);
    }

    // 转换方法
    const transformedMethods: FunctionNode[] = [];
    for (const method of node.methods) {
      const transformedMethod = this.transform(method) as FunctionNode;
      transformedMethods.push(transformedMethod);
    }

    // 转换构造函数
    let transformedConstructor: FunctionNode | undefined;
    if (node.constructor) {
      transformedConstructor = this.transform(node.constructor) as FunctionNode;
    }

    // 恢复上下文
    this.context.currentClass = previousClass;
    this.context.currentScope = previousScope;

    return {
      ...node,
      properties: transformedProperties,
      methods: transformedMethods,
      constructor: transformedConstructor
    };
  }

  /**
   * 转换属性
   */
  private transformProperty(prop: PropertyNode): PropertyNode {
    // 简化实现：直接返回属性
    return prop;
  }

  /**
   * 转换对象表达式
   */
  private transformObjectExpression(node: ObjectNode): ObjectNode {
    const transformedProperties = node.properties.map(prop => ({
      ...prop,
      value: this.transform(prop.value)
    }));

    return {
      ...node,
      properties: transformedProperties
    };
  }

  /**
   * 转换数组表达式
   */
  private transformArrayExpression(node: ArrayNode): ArrayNode {
    const transformedElements = node.elements.map(element =>
      this.transform(element)
    );

    return {
      ...node,
      elements: transformedElements
    };
  }

  /**
   * 转换块语句
   */
  private transformBlockStatement(node: ASTNode): ASTNode {
    const transformedChildren: ASTNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换返回语句
   */
  private transformReturnStatement(node: ASTNode): ASTNode {
    let transformedChildren: ASTNode[] | undefined;

    if (node.children) {
      transformedChildren = node.children.map(child => this.transform(child));
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换表达式语句
   */
  private transformExpressionStatement(node: ASTNode): ASTNode {
    let transformedChildren: ASTNode[] | undefined;

    if (node.children) {
      transformedChildren = node.children.map(child => this.transform(child));
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换通用节点
   */
  private transformGenericNode(node: ASTNode): ASTNode {
    let transformedChildren: ASTNode[] | undefined;

    if (node.children) {
      transformedChildren = node.children.map(child => this.transform(child));
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 生成接口定义
   */
  generateInterfaces(): string[] {
    const interfaces: string[] = [];

    // 遍历类型注册表，生成接口
    for (const [name, type] of this.context.typeRegistry) {
      if (type.properties) {
        const interfaceDefinition = this.generateInterfaceDefinition(name, type);
        interfaces.push(interfaceDefinition);
      }
    }

    return interfaces;
  }

  /**
   * 生成接口定义
   */
  private generateInterfaceDefinition(name: string, type: TypeInfo): string {
    if (!type.properties) {
      return '';
    }

    const properties = Object.entries(type.properties)
      .map(([key, propType]) => {
        const optional = propType.isOptional ? '?' : '';
        return `  ${key}${optional}: ${this.getTypeString(propType)};`;
      })
      .join('\n');

    return `interface ${this.capitalize(name)} {\n${properties}\n}`;
  }

  /**
   * 获取类型字符串
   */
  private getTypeString(type: TypeInfo): string {
    if (type.isArray) {
      const baseType = type.name.replace('[]', '');
      return `${baseType}[]`;
    }

    if (type.unionTypes && type.unionTypes.length > 0) {
      return type.unionTypes.map(t => t.name).join(' | ');
    }

    return type.name;
  }

  /**
   * 首字母大写
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 重置转换器状态
   */
  reset(): void {
    this.context.currentScope.clear();
    this.context.typeRegistry.clear();
    this.context.imports.clear();
    this.context.exports.clear();
    this.context.currentFunction = undefined;
    this.context.currentClass = undefined;
    this.typeInferrer.clearCache();
  }

  /**
   * 获取转换上下文
   */
  getContext(): TransformContext {
    return this.context;
  }
}
    for (const prop of node.properties) {
      const transformedProp = this.transformProperty(prop);
      transformedProperties.push(transformedProp);

      // 将属性添加到作用域
      this.context.currentScope.set(prop.name, transformedProp.propertyType);
    }

    // 转换方法
    const transformedMethods: FunctionNode[] = [];
    for (const method of node.methods) {
      const transformedMethod = this.transformFunctionDeclaration(method);
      transformedMethods.push(transformedMethod);
    }

    // 转换构造函数
    let transformedConstructor: FunctionNode | undefined;
    if (node.constructor) {
      transformedConstructor = this.transformConstructor(node.constructor);
    }

    // 恢复上下文
    this.context.currentClass = previousClass;
    this.context.currentScope = previousScope;

    return {
      ...node,
      properties: transformedProperties,
      methods: transformedMethods,
      constructor: transformedConstructor
    };
  }

  /**
   * 转换属性
   */
  private transformProperty(prop: PropertyNode): PropertyNode {
    // 基础实现，可以根据使用情况推断属性类型
    return prop;
  }

  /**
   * 转换构造函数
   */
  private transformConstructor(constructor: FunctionNode): FunctionNode {
    return this.transformFunctionDeclaration(constructor);
  }

  /**
   * 转换对象表达式
   */
  private transformObjectExpression(node: ObjectNode): ObjectNode {
    const transformedProperties: Array<{key: string, value: ASTNode, valueType: TypeInfo}> = [];

    for (const prop of node.properties) {
      const transformedValue = this.transform(prop.value);

      // 推断属性值类型
      const inferenceContext = {
        node: prop.value,
        parent: node,
        scope: this.context.currentScope,
        config: this.context.config
      };

      const valueType = this.typeInferrer.inferType(prop.value, inferenceContext);

      transformedProperties.push({
        key: prop.key,
        value: transformedValue,
        valueType
      });
    }

    return {
      ...node,
      properties: transformedProperties
    };
  }

  /**
   * 转换数组表达式
   */
  private transformArrayExpression(node: ArrayNode): ArrayNode {
    const transformedElements: ASTNode[] = [];
    const elementTypes: TypeInfo[] = [];

    for (const element of node.elements) {
      const transformedElement = this.transform(element);
      transformedElements.push(transformedElement);

      // 推断元素类型
      const inferenceContext = {
        node: element,
        parent: node,
        scope: this.context.currentScope,
        config: this.context.config
      };

      const elementType = this.typeInferrer.inferType(element, inferenceContext);
      elementTypes.push(elementType);
    }

    return {
      ...node,
      elements: transformedElements,
      elementTypes
    };
  }

  /**
   * 转换块语句
   */
  private transformBlockStatement(node: ASTNode): ASTNode {
    // 创建新的作用域
    const previousScope = new Map(this.context.currentScope);

    const transformedChildren: ASTNode[] = [];
    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    // 恢复作用域
    this.context.currentScope = previousScope;

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换返回语句
   */
  private transformReturnStatement(node: ASTNode): ASTNode {
    const transformedChildren: ASTNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换表达式语句
   */
  private transformExpressionStatement(node: ASTNode): ASTNode {
    const transformedChildren: ASTNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 转换通用节点
   */
  private transformGenericNode(node: ASTNode): ASTNode {
    const transformedChildren: ASTNode[] = [];

    if (node.children) {
      for (const child of node.children) {
        const transformed = this.transform(child);
        transformedChildren.push(transformed);
      }
    }

    return {
      ...node,
      children: transformedChildren
    };
  }

  /**
   * 应用转换规则
   */
  applyTransformRules(node: ASTNode): ASTNode {
    switch (node.type) {
      case NodeType.VariableDeclaration:
        return this.applyVariableTransformRules(node as VariableNode);
      case NodeType.FunctionDeclaration:
        return this.applyFunctionTransformRules(node as FunctionNode);
      default:
        return node;
    }
  }

  /**
   * 应用变量转换规则
   */
  private applyVariableTransformRules(node: VariableNode): VariableNode {
    // 严格模式下，避免使用any类型
    if (this.context.config.strict && node.valueType.name === PRIMITIVE_TYPES.ANY) {
      node.valueType.name = PRIMITIVE_TYPES.UNKNOWN;
    }

    return node;
  }

  /**
   * 应用函数转换规则
   */
  private applyFunctionTransformRules(node: FunctionNode): FunctionNode {
    // 严格模式下，确保所有参数都有类型注解
    if (this.context.config.strict) {
      for (const param of node.parameters) {
        if (param.paramType.name === PRIMITIVE_TYPES.ANY) {
          param.paramType.name = PRIMITIVE_TYPES.UNKNOWN;
        }
      }
    }

    return node;
  }

  /**
   * 优化转换结果
   */
  optimize(node: ASTNode): ASTNode {
    if (!this.context.config.optimize) {
      return node;
    }

    return this.applyOptimizations(node);
  }

  /**
   * 应用优化
   */
  private applyOptimizations(node: ASTNode): ASTNode {
    // 移除重复的类型定义
    // 合并相似的接口
    // 简化联合类型
    return node;
  }

  /**
   * 获取转换上下文
   */
  getContext(): TransformContext {
    return this.context;
  }

  /**
   * 重置转换器状态
   */
  reset(): void {
    this.context.currentScope.clear();
    this.context.typeRegistry.clear();
    this.context.imports.clear();
    this.context.exports.clear();
    this.context.currentFunction = undefined;
    this.context.currentClass = undefined;
    this.typeInferrer.clearCache();
  }

  /**
   * 添加类型到注册表
   */
  registerType(name: string, type: TypeInfo): void {
    this.context.typeRegistry.set(name, type);
  }

  /**
   * 获取注册的类型
   */
  getRegisteredType(name: string): TypeInfo | undefined {
    return this.context.typeRegistry.get(name);
  }

  /**
   * 生成接口定义
   */
  generateInterfaces(): string[] {
    const interfaces: string[] = [];

    if (!this.context.config.generateInterfaces) {
      return interfaces;
    }

    for (const [name, type] of this.context.typeRegistry) {
      if (type.properties && Object.keys(type.properties).length > 0) {
        const interfaceDef = this.generateInterface(name, type);
        interfaces.push(interfaceDef);
      }
    }

    return interfaces;
  }

  /**
   * 生成单个接口定义
   */
  private generateInterface(name: string, type: TypeInfo): string {
    let result = `interface ${this.capitalize(name)} {\n`;

    if (type.properties) {
      for (const [propName, propType] of Object.entries(type.properties)) {
        const optional = propType.isOptional ? '?' : '';
        const typeStr = this.typeToString(propType);
        result += `  ${propName}${optional}: ${typeStr};\n`;
      }
    }

    result += '}';
    return result;
  }

  /**
   * 将类型转换为字符串
   */
  private typeToString(type: TypeInfo): string {
    let result = type.name;

    if (type.unionTypes && type.unionTypes.length > 0) {
      result = type.unionTypes.map(t => this.typeToString(t)).join(' | ');
    }

    if (type.isArray) {
      result += '[]';
    }

    return result;
  }

  /**
   * 首字母大写
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
