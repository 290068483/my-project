/**
 * JavaScript到TypeScript转换工具的核心类型定义
 */

// 节点类型枚举
export enum NodeType {
  VariableDeclaration = "VariableDeclaration",
  FunctionDeclaration = "FunctionDeclaration",
  ClassDeclaration = "ClassDeclaration",
  ObjectExpression = "ObjectExpression",
  ArrayExpression = "ArrayExpression",
  Identifier = "Identifier",
  Literal = "Literal",
  CallExpression = "CallExpression",
  MemberExpression = "MemberExpression",
  ReturnStatement = "ReturnStatement",
  IfStatement = "IfStatement",
  ForStatement = "ForStatement",
  WhileStatement = "WhileStatement",
  BlockStatement = "BlockStatement",
  ExpressionStatement = "ExpressionStatement",
  Program = "Program",
}

// 类型信息接口
export interface TypeInfo {
  name: string;
  isOptional: boolean;
  isArray: boolean;
  unionTypes?: TypeInfo[];
  properties?: Record<string, TypeInfo>;
  genericTypes?: TypeInfo[];
}

// AST节点基础接口
export interface ASTNode {
  type: NodeType;
  start: number;
  end: number;
  children?: ASTNode[];
  raw?: string;
}

// 变量声明节点
export interface VariableNode extends ASTNode {
  type: NodeType.VariableDeclaration;
  kind: "var" | "let" | "const";
  identifier: string;
  valueType: TypeInfo;
  initializer?: ASTNode;
}

// 函数参数节点
export interface ParameterNode extends ASTNode {
  name: string;
  paramType: TypeInfo;
  defaultValue?: unknown;
  isRest?: boolean;
}

// 函数声明节点
export interface FunctionNode extends ASTNode {
  type: NodeType.FunctionDeclaration;
  name: string;
  parameters: ParameterNode[];
  returnType: TypeInfo;
  body: ASTNode;
  isAsync?: boolean;
  isGenerator?: boolean;
}

// 类声明节点
export interface ClassNode extends ASTNode {
  type: NodeType.ClassDeclaration;
  name: string;
  superClass?: string;
  properties: PropertyNode[];
  methods: FunctionNode[];
  constructor?: FunctionNode;
}

// 属性节点
export interface PropertyNode extends ASTNode {
  name: string;
  propertyType: TypeInfo;
  isStatic?: boolean;
  isPrivate?: boolean;
  isReadonly?: boolean;
}

// 对象表达式节点
export interface ObjectNode extends ASTNode {
  type: NodeType.ObjectExpression;
  properties: Array<{
    key: string;
    value: ASTNode;
    valueType: TypeInfo;
  }>;
}

// 数组表达式节点
export interface ArrayNode extends ASTNode {
  type: NodeType.ArrayExpression;
  elements: ASTNode[];
  elementTypes: TypeInfo[];
}

// 转换配置接口
export interface ConversionConfig {
  // 是否生成严格类型
  strict: boolean;
  // 是否推断函数返回类型
  inferReturnTypes: boolean;
  // 是否生成接口定义
  generateInterfaces: boolean;
  // 目标TypeScript版本
  target: "ES5" | "ES2015" | "ES2017" | "ES2018" | "ES2019" | "ES2020";
  // 是否保留注释
  preserveComments: boolean;
  // 类型推断精度
  inferenceLevel: "basic" | "advanced" | "strict";
  // 是否优化输出
  optimize: boolean;
  // 自定义类型映射
  typeMapping?: Record<string, string>;
}

// 转换统计信息
export interface ConversionStatistics {
  // 转换的变量数量
  variablesConverted: number;
  // 转换的函数数量
  functionsConverted: number;
  // 转换的类数量
  classesConverted: number;
  // 推断的类型数量
  typesInferred: number;
  // 转换耗时(毫秒)
  conversionTime: number;
  // 代码行数
  linesProcessed: number;
}

// 转换警告
export interface ConversionWarning {
  type: "type-inference" | "syntax" | "compatibility" | "optimization";
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

// 转换错误
export interface ConversionError {
  type: "syntax" | "parsing" | "transformation" | "generation";
  message: string;
  line?: number;
  column?: number;
  stack?: string;
}

// 转换结果接口
export interface ConversionResult {
  // 转换后的TypeScript代码
  tsCode: string;
  // 生成的类型声明
  typeDeclarations: string;
  // 转换统计信息
  statistics: ConversionStatistics;
  // 警告和建议
  warnings: ConversionWarning[];
  // 是否转换成功
  success: boolean;
  // 错误信息
  errors?: ConversionError[];
}

// 转换上下文
export interface TransformContext {
  config: ConversionConfig;
  currentScope: Map<string, TypeInfo>;
  typeRegistry: Map<string, TypeInfo>;
  imports: Set<string>;
  exports: Set<string>;
  currentFunction?: FunctionNode;
  currentClass?: ClassNode;
}

// 类型推断上下文
export interface InferenceContext {
  node: ASTNode;
  parent?: ASTNode;
  scope: Map<string, TypeInfo>;
  config: ConversionConfig;
}

// 转换插件接口
export interface TransformPlugin {
  name: string;
  version: string;
  transform(node: ASTNode, context: TransformContext): ASTNode;
  supports(nodeType: NodeType): boolean;
}

// 类型推断插件接口
export interface TypeInferencePlugin {
  name: string;
  inferType(node: ASTNode, context: InferenceContext): TypeInfo | null;
  priority: number;
}

// 工具选项接口
export interface JSToTSConverterOptions {
  config?: Partial<ConversionConfig>;
  plugins?: TransformPlugin[];
  typeInferencePlugins?: TypeInferencePlugin[];
}

// 默认配置
export const DEFAULT_CONFIG: ConversionConfig = {
  strict: true,
  inferReturnTypes: true,
  generateInterfaces: true,
  target: "ES2020",
  preserveComments: true,
  inferenceLevel: "advanced",
  optimize: true,
  typeMapping: {},
};

// 基础类型常量
export const PRIMITIVE_TYPES = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  NULL: "null",
  UNDEFINED: "undefined",
  ANY: "any",
  UNKNOWN: "unknown",
  VOID: "void",
  NEVER: "never",
} as const;

// Token 接口定义
export interface Token {
  type: string;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
}

// 工具类型
export type PrimitiveType = (typeof PRIMITIVE_TYPES)[keyof typeof PRIMITIVE_TYPES];
