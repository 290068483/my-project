/**
 * JavaScript代码解析器 - 将JavaScript代码解析为抽象语法树(AST)
 * 简化实现，专注于基本语法的解析
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
  Token,
} from "./types";

export class JSParser {
  private code: string = "";
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  private currentTokenIndex: number = 0;

  /**
   * 解析JavaScript代码
   */
  parse(code: string): ASTNode {
    this.code = code.trim();
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = this.tokenize(code);
    this.currentTokenIndex = 0;

    return this.parseProgram();
  }

  /**
   * 简化的词法分析器
   */
  private tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    let position = 0;

    while (position < code.length) {
      const char = code[position];

      // 跳过空白字符
      if (/\s/.test(char)) {
        position++;
        continue;
      }

      // 简化的token识别
      if (/[a-zA-Z_$]/.test(char)) {
        const start = position;
        while (position < code.length && /[a-zA-Z0-9_$]/.test(code[position])) {
          position++;
        }
        tokens.push({
          type: "Identifier",
          value: code.slice(start, position),
          start,
          end: position,
          line: 1,
          column: start,
        });
      } else if (/\d/.test(char)) {
        const start = position;
        while (position < code.length && /[\d.]/.test(code[position])) {
          position++;
        }
        tokens.push({
          type: "Number",
          value: code.slice(start, position),
          start,
          end: position,
          line: 1,
          column: start,
        });
      } else if (char === '"' || char === "'") {
        const start = position;
        const quote = char;
        position++; // 跳过开始引号
        while (position < code.length && code[position] !== quote) {
          position++;
        }
        position++; // 跳过结束引号
        tokens.push({
          type: "String",
          value: code.slice(start, position),
          start,
          end: position,
          line: 1,
          column: start,
        });
      } else {
        // 其他字符作为单字符token
        tokens.push({
          type: char,
          value: char,
          start: position,
          end: position + 1,
          line: 1,
          column: position,
        });
        position++;
      }
    }

    return tokens;
  }

  /**
   * 解析程序
   */
  private parseProgram(): ASTNode {
    const children: ASTNode[] = [];

    while (!this.isAtEnd()) {
      try {
        const statement = this.parseStatement();
        if (statement) {
          children.push(statement);
        }
      } catch {
        // 简单的错误恢复
        this.advance();
      }
    }

    return {
      type: NodeType.Program,
      start: 0,
      end: this.code.length,
      children,
    };
  }

  /**
   * 解析语句
   */
  private parseStatement(): ASTNode | null {
    if (this.isAtEnd()) {
      return null;
    }

    const current = this.peek();
    if (!current) return null;

    // 变量声明
    if (["var", "let", "const"].includes(current.value)) {
      return this.parseVariableDeclaration();
    }

    // 函数声明
    if (current.value === "function") {
      return this.parseFunctionDeclaration();
    }

    // 类声明
    if (current.value === "class") {
      return this.parseClassDeclaration();
    }

    // 表达式语句
    return this.parseExpressionStatement();
  }

  /**
   * 解析变量声明
   */
  private parseVariableDeclaration(): VariableNode {
    const start = this.getCurrentPosition();
    const kindToken = this.advance();
    const kind = kindToken.value as "var" | "let" | "const";

    const identifier = this.consume("Identifier", "期望变量名").value;

    let initializer: ASTNode | undefined;
    if (this.match("=")) {
      this.advance();
      initializer = this.parseExpression();
    }

    this.consumeOptional(";");

    return {
      type: NodeType.VariableDeclaration,
      kind,
      identifier,
      valueType: { name: "any", isOptional: false, isArray: false },
      initializer,
      start,
      end: this.getCurrentPosition(),
      raw: identifier,
    };
  }

  /**
   * 解析函数声明
   */
  private parseFunctionDeclaration(): FunctionNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'function'

    const name = this.consume("Identifier", "期望函数名").value;
    this.consume("(", '期望 "("');
    const parameters = this.parseParameterList();
    this.consume(")", '期望 ")"');

    const body = this.parseBlockStatement();

    return {
      type: NodeType.FunctionDeclaration,
      name,
      parameters,
      returnType: { name: "void", isOptional: false, isArray: false },
      body,
      start,
      end: this.getCurrentPosition(),
      raw: name,
    };
  }

  /**
   * 解析类声明
   */
  private parseClassDeclaration(): ClassNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'class'

    const name = this.consume("Identifier", "期望类名").value;

    let superClass: string | undefined;
    if (this.match("extends")) {
      this.advance();
      superClass = this.consume("Identifier", "期望父类名").value;
    }

    this.consume("{", '期望 "{"');

    const properties: PropertyNode[] = [];
    const methods: FunctionNode[] = [];
    let constructor: FunctionNode | undefined;

    while (!this.check("}") && !this.isAtEnd()) {
      // 简化：跳过类成员解析
      this.advance();
    }

    this.consume("}", '期望 "}"');

    return {
      type: NodeType.ClassDeclaration,
      name,
      superClass,
      properties,
      methods,
      constructor,
      start,
      end: this.getCurrentPosition(),
      raw: name,
    };
  }

  /**
   * 解析参数列表
   */
  private parseParameterList(): ParameterNode[] {
    const parameters: ParameterNode[] = [];

    if (this.check(")")) {
      return parameters;
    }

    do {
      const start = this.getCurrentPosition();
      const name = this.consume("Identifier", "期望参数名").value;

      let defaultValue: any;
      if (this.match("=")) {
        this.advance();
        defaultValue = this.parseExpression();
      }

      parameters.push({
        type: NodeType.Identifier,
        name,
        paramType: { name: "any", isOptional: false, isArray: false },
        defaultValue,
        start,
        end: this.getCurrentPosition(),
        raw: name,
      });
    } while (this.match(",") && this.advance());

    return parameters;
  }

  /**
   * 解析表达式
   */
  private parseExpression(): ASTNode {
    return this.parsePrimaryExpression();
  }

  /**
   * 解析主表达式
   */
  private parsePrimaryExpression(): ASTNode {
    const current = this.peek();

    if (!current) {
      throw new Error("意外的表达式结束");
    }

    switch (current.type) {
      case "String":
      case "Number":
        return this.parseLiteral();
      case "Identifier":
        return this.parseIdentifier();
      case "{":
        return this.parseObjectExpression();
      case "[":
        return this.parseArrayExpression();
      default:
        throw new Error(`意外的token: ${current.value}`);
    }
  }

  /**
   * 解析字面量
   */
  private parseLiteral(): ASTNode {
    const token = this.advance();

    return {
      type: NodeType.Literal,
      start: token.start,
      end: token.end,
      raw: token.value,
    };
  }

  /**
   * 解析标识符
   */
  private parseIdentifier(): ASTNode {
    const token = this.advance();

    return {
      type: NodeType.Identifier,
      start: token.start,
      end: token.end,
      raw: token.value,
    };
  }

  /**
   * 解析对象表达式
   */
  private parseObjectExpression(): ObjectNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '{'

    const properties: Array<{ key: string; value: ASTNode; valueType: any }> = [];

    while (!this.check("}") && !this.isAtEnd()) {
      const keyToken = this.advance();
      const key = keyToken.value;

      this.consume(":", '期望 ":"');
      const value = this.parseExpression();

      properties.push({
        key,
        value,
        valueType: { name: "any", isOptional: false, isArray: false },
      });

      if (this.match(",")) {
        this.advance();
      }
    }

    this.consume("}", '期望 "}"');

    return {
      type: NodeType.ObjectExpression,
      start,
      end: this.getCurrentPosition(),
      properties,
    };
  }

  /**
   * 解析数组表达式
   */
  private parseArrayExpression(): ArrayNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '['

    const elements: ASTNode[] = [];

    while (!this.check("]") && !this.isAtEnd()) {
      elements.push(this.parseExpression());

      if (this.match(",")) {
        this.advance();
      }
    }

    this.consume("]", '期望 "]"');

    return {
      type: NodeType.ArrayExpression,
      start,
      end: this.getCurrentPosition(),
      elements,
      elementTypes: [],
    };
  }

  /**
   * 解析块语句
   */
  private parseBlockStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '{'

    const children: ASTNode[] = [];

    while (!this.check("}") && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        children.push(stmt);
      }
    }

    this.consume("}", '期望 "}"');

    return {
      type: NodeType.BlockStatement,
      start,
      end: this.getCurrentPosition(),
      children,
    };
  }

  /**
   * 解析表达式语句
   */
  private parseExpressionStatement(): ASTNode {
    const start = this.getCurrentPosition();
    const expr = this.parseExpression();
    this.consumeOptional(";");

    return {
      type: NodeType.ExpressionStatement,
      start,
      end: this.getCurrentPosition(),
      children: [expr],
    };
  }

  // 工具方法

  /**
   * 查看当前token
   */
  private peek(): Token | null {
    return this.currentTokenIndex < this.tokens.length ? this.tokens[this.currentTokenIndex] : null;
  }

  /**
   * 消费当前token并返回
   */
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.currentTokenIndex++;
    }
    return this.previous();
  }

  /**
   * 检查是否到达末尾
   */
  private isAtEnd(): boolean {
    return this.currentTokenIndex >= this.tokens.length;
  }

  /**
   * 获取上一个token
   */
  private previous(): Token {
    return this.tokens[this.currentTokenIndex - 1];
  }

  /**
   * 检查当前token类型
   */
  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    const current = this.peek();
    return current ? current.type === type || current.value === type : false;
  }

  /**
   * 匹配token类型
   */
  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 消费指定token
   */
  private consume(type: string, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    const current = this.peek();
    throw new Error(`${message}. 得到: ${current ? current.value : "EOF"}`);
  }

  /**
   * 可选消费token
   */
  private consumeOptional(type: string): Token | null {
    if (this.check(type)) {
      return this.advance();
    }
    return null;
  }

  /**
   * 获取当前位置
   */
  private getCurrentPosition(): number {
    const current = this.peek();
    return current ? current.start : this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].end : 0;
  }
}
