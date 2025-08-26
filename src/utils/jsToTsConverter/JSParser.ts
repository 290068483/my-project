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
  ConversionError,
  Token
} from './types';

export class JSParser {
  private code: string = '';
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  /**
   * 解析JavaScript代码
   */
  parse(code: string): ASTNode {
    this.code = code.trim();
    this.position = 0;
    this.line = 1;
    this.column = 1;

    return this.parseProgram();
  }

  /**
   * 解析程序
   */
  private parseProgram(): ASTNode {
    const children: ASTNode[] = [];

    while (this.position < this.code.length) {
      this.skipWhitespace();

      if (this.position >= this.code.length) {
        break;
      }

      const statement = this.parseStatement();
      if (statement) {
        children.push(statement);
      }
    }

    return {
      type: NodeType.Program,
      start: 0,
      end: this.code.length,
      children
    };
  }

  /**
   * 解析语句
   */
  private parseStatement(): ASTNode | null {
    this.skipWhitespace();

    if (this.position >= this.code.length) {
      return null;
    }

    const remaining = this.code.slice(this.position);

    // 变量声明
    if (remaining.match(/^(var|let|const)\s+/)) {
      return this.parseVariableDeclaration();
    }

    // 函数声明
    if (remaining.match(/^function\s+/)) {
      return this.parseFunctionDeclaration();
    }

    // 类声明
    if (remaining.match(/^class\s+/)) {
      return this.parseClassDeclaration();
    }

    // 表达式语句
    return this.parseExpressionStatement();
  }

  /**
   * 解析变量声明
   */
  private parseVariableDeclaration(): VariableNode {
    const start = this.position;

    // 解析关键字 (var, let, const)
    const kindMatch = this.code.slice(this.position).match(/^(var|let|const)/);
    if (!kindMatch) {
      throw new Error('Expected variable declaration keyword');
    }

    const kind = kindMatch[1] as 'var' | 'let' | 'const';
    this.position += kind.length;
    this.skipWhitespace();

    // 解析变量名
    const identifierMatch = this.code.slice(this.position).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (!identifierMatch) {
      throw new Error('Expected identifier');
    }

    const identifier = identifierMatch[0];
    this.position += identifier.length;
    this.skipWhitespace();

    // 解析初始化器
    let initializer: ASTNode | undefined;
    if (this.code[this.position] === '=') {
      this.position++; // 跳过 '='
      this.skipWhitespace();
      initializer = this.parseExpression();
    }

    // 跳过分号
    this.skipOptional(';');

    return {
      type: NodeType.VariableDeclaration,
      kind,
      identifier,
      valueType: { name: 'any', isOptional: false, isArray: false },
      initializer,
      start,
      end: this.position,
      raw: identifier
    };
  }

  /**
   * 解析表达式
   */
  private parseExpression(): ASTNode {
    this.skipWhitespace();

    const remaining = this.code.slice(this.position);

    // 字符串字面量
    if (remaining.match(/^["\']/)) {
      return this.parseStringLiteral();
    }

    // 数字字面量
    if (remaining.match(/^\d/)) {
      return this.parseNumberLiteral();
    }

    // 布尔字面量
    if (remaining.match(/^(true|false)\b/)) {
      return this.parseBooleanLiteral();
    }

    // null
    if (remaining.match(/^null\b/)) {
      return this.parseNullLiteral();
    }

    // undefined
    if (remaining.match(/^undefined\b/)) {
      return this.parseUndefinedLiteral();
    }

    // 对象字面量
    if (remaining.match(/^\{/)) {
      return this.parseObjectExpression();
    }

    // 数组字面量
    if (remaining.match(/^\[/)) {
      return this.parseArrayExpression();
    }

    // 标识符
    if (remaining.match(/^[a-zA-Z_$]/)) {
      return this.parseIdentifier();
    }

    throw new Error(`Unexpected character: ${remaining[0]}`);
  }

  /**
   * 解析字符串字面量
   */
  private parseStringLiteral(): ASTNode {
    const start = this.position;
    const quote = this.code[this.position];
    this.position++; // 跳过开始引号

    let value = '';
    while (this.position < this.code.length && this.code[this.position] !== quote) {
      if (this.code[this.position] === '\\') {
        this.position++; // 跳过转义字符
        if (this.position < this.code.length) {
          value += this.code[this.position];
          this.position++;
        }
      } else {
        value += this.code[this.position];
        this.position++;
      }
    }

    if (this.position >= this.code.length) {
      throw new Error('Unterminated string literal');
    }

    this.position++; // 跳过结束引号

    return {
      type: NodeType.Literal,
      start,
      end: this.position,
      raw: quote + value + quote
    };
  }

  /**
   * 解析数字字面量
   */
  private parseNumberLiteral(): ASTNode {
    const start = this.position;
    const match = this.code.slice(this.position).match(/^\d+(\.\d+)?/);

    if (!match) {
      throw new Error('Invalid number literal');
    }

    const value = match[0];
    this.position += value.length;

    return {
      type: NodeType.Literal,
      start,
      end: this.position,
      raw: value
    };
  }

  /**
   * 解析布尔字面量
   */
  private parseBooleanLiteral(): ASTNode {
    const start = this.position;
    const match = this.code.slice(this.position).match(/^(true|false)/);

    if (!match) {
      throw new Error('Invalid boolean literal');
    }

    const value = match[0];
    this.position += value.length;

    return {
      type: NodeType.Literal,
      start,
      end: this.position,
      raw: value
    };
  }

  /**
   * 解析null字面量
   */
  private parseNullLiteral(): ASTNode {
    const start = this.position;
    this.position += 4; // 'null'.length

    return {
      type: NodeType.Literal,
      start,
      end: this.position,
      raw: 'null'
    };
  }

  /**
   * 解析undefined字面量
   */
  private parseUndefinedLiteral(): ASTNode {
    const start = this.position;
    this.position += 9; // 'undefined'.length

    return {
      type: NodeType.Literal,
      start,
      end: this.position,
      raw: 'undefined'
    };
  }

  /**
   * 解析标识符
   */
  private parseIdentifier(): ASTNode {
    const start = this.position;
    const match = this.code.slice(this.position).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);

    if (!match) {
      throw new Error('Invalid identifier');
    }

    const value = match[0];
    this.position += value.length;

    return {
      type: NodeType.Identifier,
      start,
      end: this.position,
      raw: value
    };
  }

  /**
   * 解析对象表达式（简化版）
   */
  private parseObjectExpression(): ObjectNode {
    const start = this.position;
    this.position++; // 跳过 '{'
    this.skipWhitespace();

    const properties: Array<{ key: string; value: ASTNode; valueType: any }> = [];

    while (this.position < this.code.length && this.code[this.position] !== '}') {
      // 解析属性键
      const key = this.parsePropertyKey();
      this.skipWhitespace();

      // 跳过 ':'
      if (this.code[this.position] !== ':') {
        throw new Error('Expected ":" in object property');
      }
      this.position++;
      this.skipWhitespace();

      // 解析属性值
      const value = this.parseExpression();

      properties.push({
        key,
        value,
        valueType: { name: 'any', isOptional: false, isArray: false }
      });

      this.skipWhitespace();

      // 跳过可选的逗号
      if (this.code[this.position] === ',') {
        this.position++;
        this.skipWhitespace();
      }
    }

    if (this.position >= this.code.length) {
      throw new Error('Unterminated object literal');
    }

    this.position++; // 跳过 '}'

    return {
      type: NodeType.ObjectExpression,
      start,
      end: this.position,
      properties
    };
  }

  /**
   * 解析属性键
   */
  private parsePropertyKey(): string {
    this.skipWhitespace();

    // 字符串键
    if (this.code[this.position] === '"' || this.code[this.position] === "'") {
      const stringNode = this.parseStringLiteral();
      return stringNode.raw!.slice(1, -1); // 去掉引号
    }

    // 标识符键
    const identifierNode = this.parseIdentifier();
    return identifierNode.raw!;
  }

  /**
   * 解析数组表达式（简化版）
   */
  private parseArrayExpression(): ArrayNode {
    const start = this.position;
    this.position++; // 跳过 '['
    this.skipWhitespace();

    const elements: ASTNode[] = [];

    while (this.position < this.code.length && this.code[this.position] !== ']') {
      const element = this.parseExpression();
      elements.push(element);

      this.skipWhitespace();

      // 跳过可选的逗号
      if (this.code[this.position] === ',') {
        this.position++;
        this.skipWhitespace();
      }
    }

    if (this.position >= this.code.length) {
      throw new Error('Unterminated array literal');
    }

    this.position++; // 跳过 ']'

    return {
      type: NodeType.ArrayExpression,
      start,
      end: this.position,
      elements,
      elementTypes: []
    };
  }

  /**
   * 解析函数声明（简化版）
   */
  private parseFunctionDeclaration(): FunctionNode {
    const start = this.position;
    this.position += 8; // 'function'.length
    this.skipWhitespace();

    // 函数名
    const nameNode = this.parseIdentifier();
    const name = nameNode.raw!;

    this.skipWhitespace();

    // 参数列表
    if (this.code[this.position] !== '(') {
      throw new Error('Expected "(" in function declaration');
    }
    this.position++;

    const parameters: ParameterNode[] = [];
    // 简化：暂时不解析参数

    // 跳到 ')'
    while (this.position < this.code.length && this.code[this.position] !== ')') {
      this.position++;
    }
    this.position++; // 跳过 ')'

    this.skipWhitespace();

    // 函数体
    const body = this.parseBlockStatement();

    return {
      type: NodeType.FunctionDeclaration,
      name,
      parameters,
      returnType: { name: 'any', isOptional: false, isArray: false },
      body,
      start,
      end: this.position
    };
  }

  /**
   * 解析类声明（简化版）
   */
  private parseClassDeclaration(): ClassNode {
    const start = this.position;
    this.position += 5; // 'class'.length
    this.skipWhitespace();

    // 类名
    const nameNode = this.parseIdentifier();
    const name = nameNode.raw!;

    this.skipWhitespace();

    // 跳过类体
    if (this.code[this.position] === '{') {
      this.skipBlock();
    }

    return {
      type: NodeType.ClassDeclaration,
      name,
      properties: [],
      methods: [],
      start,
      end: this.position
    };
  }

  /**
   * 解析块语句
   */
  private parseBlockStatement(): ASTNode {
    const start = this.position;

    if (this.code[this.position] !== '{') {
      throw new Error('Expected "{" at start of block statement');
    }

    this.skipBlock();

    return {
      type: NodeType.BlockStatement,
      start,
      end: this.position,
      children: []
    };
  }

  /**
   * 解析表达式语句
   */
  private parseExpressionStatement(): ASTNode {
    const start = this.position;
    const expr = this.parseExpression();
    this.skipOptional(';');

    return {
      type: NodeType.ExpressionStatement,
      start,
      end: this.position,
      children: [expr]
    };
  }

  /**
   * 跳过空白字符
   */
  private skipWhitespace(): void {
    while (this.position < this.code.length && /\s/.test(this.code[this.position])) {
      if (this.code[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  /**
   * 跳过可选字符
   */
  private skipOptional(char: string): void {
    this.skipWhitespace();
    if (this.position < this.code.length && this.code[this.position] === char) {
      this.position++;
    }
  }

  /**
   * 跳过代码块
   */
  private skipBlock(): void {
    if (this.code[this.position] !== '{') {
      return;
    }

    this.position++; // 跳过 '{'
    let braceCount = 1;

    while (this.position < this.code.length && braceCount > 0) {
      if (this.code[this.position] === '{') {
        braceCount++;
      } else if (this.code[this.position] === '}') {
        braceCount--;
      }
      this.position++;
    }
  }
}
    const parameters = this.parseParameterList();
    this.consume(')', '期望 ")"');

    const body = this.parseBlockStatement();

    return {
      type: NodeType.FunctionDeclaration,
      name,
      parameters,
      returnType: { name: 'void', isOptional: false, isArray: false }, // 将由类型推断器确定
      body,
      start,
      end: this.getCurrentPosition(),
      raw: name
    };
  }

  /**
   * 解析类声明
   */
  private parseClassDeclaration(): ClassNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'class'

    const name = this.consume('Identifier', '期望类名').value;

    let superClass: string | undefined;
    if (this.match('extends')) {
      this.advance(); // 消费 'extends'
      superClass = this.consume('Identifier', '期望父类名').value;
    }

    this.consume('{', '期望 "{"');

    const properties: PropertyNode[] = [];
    const methods: FunctionNode[] = [];
    let constructor: FunctionNode | undefined;

    while (!this.check('}') && !this.isAtEnd()) {
      const member = this.parseClassMember();
      if (member.type === NodeType.FunctionDeclaration) {
        if ((member as FunctionNode).name === 'constructor') {
          constructor = member as FunctionNode;
        } else {
          methods.push(member as FunctionNode);
        }
      }
    }

    this.consume('}', '期望 "}"');

    return {
      type: NodeType.ClassDeclaration,
      name,
      superClass,
      properties,
      methods,
      constructor,
      start,
      end: this.getCurrentPosition(),
      raw: name
    };
  }

  /**
   * 解析类成员
   */
  private parseClassMember(): ASTNode {
    const current = this.peek();

    if (current?.value === 'constructor' || current?.value === 'function') {
      return this.parseMethod();
    }

    // 简化版：假设是方法
    return this.parseMethod();
  }

  /**
   * 解析方法
   */
  private parseMethod(): FunctionNode {
    const start = this.getCurrentPosition();

    let name: string;
    if (this.check('constructor')) {
      name = this.advance().value;
    } else {
      name = this.consume('Identifier', '期望方法名').value;
    }

    this.consume('(', '期望 "("');
    const parameters = this.parseParameterList();
    this.consume(')', '期望 ")"');

    const body = this.parseBlockStatement();

    return {
      type: NodeType.FunctionDeclaration,
      name,
      parameters,
      returnType: { name: 'void', isOptional: false, isArray: false },
      body,
      start,
      end: this.getCurrentPosition(),
      raw: name
    };
  }

  /**
   * 解析参数列表
   */
  private parseParameterList(): ParameterNode[] {
    const parameters: ParameterNode[] = [];

    if (this.check(')')) {
      return parameters;
    }

    do {
      const start = this.getCurrentPosition();
      const name = this.consume('Identifier', '期望参数名').value;

      let defaultValue: any;
      if (this.match('=')) {
        this.advance(); // 消费 '='
        defaultValue = this.parseExpression();
      }

      parameters.push({
        type: NodeType.Identifier,
        name,
        paramType: { name: 'any', isOptional: false, isArray: false }, // 将由类型推断器确定
        defaultValue,
        start,
        end: this.getCurrentPosition(),
        raw: name
      });

    } while (this.match(',') && this.advance());

    return parameters;
  }

  /**
   * 解析表达式
   */
  private parseExpression(): ASTNode {
    return this.parseAssignmentExpression();
  }

  /**
   * 解析赋值表达式
   */
  private parseAssignmentExpression(): ASTNode {
    return this.parseOrExpression();
  }

  /**
   * 解析或表达式
   */
  private parseOrExpression(): ASTNode {
    return this.parsePrimaryExpression();
  }

  /**
   * 解析主表达式
   */
  private parsePrimaryExpression(): ASTNode {
    const current = this.peek();

    if (!current) {
      throw new Error('意外的表达式结束');
    }

    const start = this.getCurrentPosition();

    switch (current.type) {
      case 'String':
      case 'Number':
      case 'Boolean':
        return this.parseLiteral();
      case 'Identifier':
        return this.parseIdentifier();
      case '{':
        return this.parseObjectExpression();
      case '[':
        return this.parseArrayExpression();
      case '(':
        this.advance(); // 消费 '('
        const expr = this.parseExpression();
        this.consume(')', '期望 ")"');
        return expr;
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
      raw: token.value
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
      raw: token.value
    };
  }

  /**
   * 解析对象表达式
   */
  private parseObjectExpression(): ObjectNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '{'

    const properties: Array<{ key: string; value: ASTNode; valueType: any }> = [];

    while (!this.check('}') && !this.isAtEnd()) {
      const keyToken = this.advance();
      const key = keyToken.value;

      this.consume(':', '期望 ":"');
      const value = this.parseExpression();

      properties.push({
        key,
        value,
        valueType: { name: 'any', isOptional: false, isArray: false }
      });

      if (this.match(',')) {
        this.advance();
      }
    }

    this.consume('}', '期望 "}"');

    return {
      type: NodeType.ObjectExpression,
      start,
      end: this.getCurrentPosition(),
      properties
    };
  }

  /**
   * 解析数组表达式
   */
  private parseArrayExpression(): ArrayNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '['

    const elements: ASTNode[] = [];

    while (!this.check(']') && !this.isAtEnd()) {
      elements.push(this.parseExpression());

      if (this.match(',')) {
        this.advance();
      }
    }

    this.consume(']', '期望 "]"');

    return {
      type: NodeType.ArrayExpression,
      start,
      end: this.getCurrentPosition(),
      elements,
      elementTypes: []
    };
  }

  /**
   * 解析if语句
   */
  private parseIfStatement(): ASTNode {
    // 简化实现，跳过整个if语句
    this.advance(); // 消费 'if'
    return {
      type: NodeType.IfStatement,
      start: this.getCurrentPosition(),
      end: this.getCurrentPosition(),
      children: []
    };
  }

  /**
   * 解析for语句
   */
  private parseForStatement(): ASTNode {
    // 简化实现，跳过整个for语句
    this.advance(); // 消费 'for'
    return {
      type: NodeType.ForStatement,
      start: this.getCurrentPosition(),
      end: this.getCurrentPosition(),
      children: []
    };
  }

  /**
   * 解析while语句
   */
  private parseWhileStatement(): ASTNode {
    // 简化实现，跳过整个while语句
    this.advance(); // 消费 'while'
    return {
      type: NodeType.WhileStatement,
      start: this.getCurrentPosition(),
      end: this.getCurrentPosition(),
      children: []
    };
  }

  /**
   * 解析return语句
   */
  private parseReturnStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'return'

    let value: ASTNode | undefined;
    if (!this.check(';') && !this.isAtEnd()) {
      value = this.parseExpression();
    }

    this.consumeOptional(';');

    return {
      type: NodeType.ReturnStatement,
      start,
      end: this.getCurrentPosition(),
      children: value ? [value] : []
    };
  }

  /**
   * 解析块语句
   */
  private parseBlockStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '{'

    const children: ASTNode[] = [];

    while (!this.check('}') && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        children.push(stmt);
      }
    }

    this.consume('}', '期望 "}"');

    return {
      type: NodeType.BlockStatement,
      start,
      end: this.getCurrentPosition(),
      children
    };
  }

  /**
   * 解析表达式语句
   */
  private parseExpressionStatement(): ASTNode {
    const start = this.getCurrentPosition();
    const expr = this.parseExpression();
    this.consumeOptional(';');

    return {
      type: NodeType.ExpressionStatement,
      start,
      end: this.getCurrentPosition(),
      children: [expr]
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
    const token = this.peek();
    if (token) {
      this.currentTokenIndex++;
    }
    return token || { type: 'EOF', value: '', start: this.code.length, end: this.code.length, line: this.line, column: this.column };
  }

  /**
   * 检查当前token类型
   */
  private check(expected: string): boolean {
    const token = this.peek();
    return token ? token.value === expected : false;
  }

  /**
   * 匹配并返回是否匹配
   */
  private match(expected: string): boolean {
    return this.check(expected);
  }

  /**
   * 必须消费指定token
   */
  private consume(expected: string, message: string): Token {
    const token = this.peek();
    if (!token || token.value !== expected) {
      throw new Error(`${message}，但得到: ${token?.value || 'EOF'}`);
    }
    return this.advance();
  }

  /**
   * 可选消费指定token
   */
  private consumeOptional(expected: string): boolean {
    if (this.check(expected)) {
      this.advance();
      return true;
    }
    return false;
  }

  /**
   * 检查是否到达文件末尾
   */
  private isAtEnd(): boolean {
    return this.currentTokenIndex >= this.tokens.length;
  }

  /**
   * 获取当前位置
   */
  private getCurrentPosition(): number {
    const token = this.peek();
    return token ? token.start : this.code.length;
  }

  /**
   * 错误恢复
   */
  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token && ['var', 'let', 'const', 'function', 'class', 'if', 'for', 'while', 'return'].includes(token.value)) {
        return;
      }
      this.advance();
    }
  }

  // Token化方法（简化版）

  private tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.code.length) {
      this.skipWhitespace();

      if (this.position >= this.code.length) break;

      const char = this.code[this.position];

      // 跳过注释
      if (this.isCommentStart()) {
        this.skipComment();
        continue;
      }

      // 字符串
      if (char === '"' || char === "'" || char === '`') {
        tokens.push(this.readString());
        continue;
      }

      // 数字
      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // 标识符和关键字
      if (this.isLetter(char) || char === '_' || char === '$') {
        tokens.push(this.readIdentifier());
        continue;
      }

      // 操作符和符号
      const operator = this.readOperator();
      if (operator) {
        tokens.push(operator);
        continue;
      }

      // 其他字符
      tokens.push({
        type: 'Unknown',
        value: char,
        start: this.position,
        end: this.position + 1,
        line: this.line,
        column: this.column
      });

      this.advance2();
    }

    return tokens;
  }

  private advance2(): void {
    if (this.code[this.position] === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  private skipWhitespace(): void {
    while (this.position < this.code.length && /\s/.test(this.code[this.position])) {
      this.advance2();
    }
  }

  private isCommentStart(): boolean {
    return (this.code[this.position] === '/' &&
            this.position + 1 < this.code.length &&
            (this.code[this.position + 1] === '/' || this.code[this.position + 1] === '*'));
  }

  private skipComment(): void {
    if (this.code[this.position + 1] === '/') {
      // 单行注释
      while (this.position < this.code.length && this.code[this.position] !== '\n') {
        this.advance2();
      }
    } else if (this.code[this.position + 1] === '*') {
      // 多行注释
      this.position += 2;
      while (this.position < this.code.length - 1) {
        if (this.code[this.position] === '*' && this.code[this.position + 1] === '/') {
          this.position += 2;
          break;
        }
        this.advance2();
      }
    }
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  private readString(): Token {
    const start = this.position;
    const quote = this.code[this.position];
    this.advance2(); // 跳过开始引号

    let value = quote;
    while (this.position < this.code.length && this.code[this.position] !== quote) {
      if (this.code[this.position] === '\\') {
        value += this.code[this.position];
        this.advance2();
        if (this.position < this.code.length) {
          value += this.code[this.position];
          this.advance2();
        }
      } else {
        value += this.code[this.position];
        this.advance2();
      }
    }

    if (this.position < this.code.length) {
      value += this.code[this.position]; // 结束引号
      this.advance2();
    }

    return {
      type: 'String',
      value,
      start,
      end: this.position,
      line: this.line,
      column: this.column
    };
  }

  private readNumber(): Token {
    const start = this.position;
    let value = '';

    while (this.position < this.code.length && /[\d.]/.test(this.code[this.position])) {
      value += this.code[this.position];
      this.advance2();
    }

    return {
      type: 'Number',
      value,
      start,
      end: this.position,
      line: this.line,
      column: this.column
    };
  }

  private readIdentifier(): Token {
    const start = this.position;
    let value = '';

    while (this.position < this.code.length && /[a-zA-Z0-9_$]/.test(this.code[this.position])) {
      value += this.code[this.position];
      this.advance2();
    }

    const type = this.isKeyword(value) ? 'Keyword' : 'Identifier';

    return {
      type,
      value,
      start,
      end: this.position,
      line: this.line,
      column: this.column
    };
  }

  private isKeyword(value: string): boolean {
    const keywords = ['var', 'let', 'const', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'null', 'undefined'];
    return keywords.includes(value);
  }

  private readOperator(): Token | null {
    const start = this.position;
    const char = this.code[this.position];

    const operators = ['{', '}', '(', ')', '[', ']', ';', ':', ',', '='];

    if (operators.includes(char)) {
      this.advance2();
      return {
        type: 'Operator',
        value: char,
        start,
        end: this.position,
        line: this.line,
        column: this.column
      };
    }

    return null;
  }
}
      raw: token.value
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
      raw: token.value
    };
  }

  /**
   * 解析对象表达式
   */
  private parseObjectExpression(): ObjectNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '{'

    const properties: Array<{key: string, value: ASTNode, valueType: any}> = [];

    while (!this.check('}') && !this.isAtEnd()) {
      const key = this.consume('Identifier', '期望属性名').value;
      this.consume(':', '期望 ":"');
      const value = this.parseExpression();

      properties.push({
        key,
        value,
        valueType: { name: 'any', isOptional: false, isArray: false }
      });

      if (!this.match(',')) break;
      this.advance(); // 消费 ','
    }

    this.consume('}', '期望 "}"');

    return {
      type: NodeType.ObjectExpression,
      properties,
      start,
      end: this.getCurrentPosition()
    };
  }

  /**
   * 解析数组表达式
   */
  private parseArrayExpression(): ArrayNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 '['

    const elements: ASTNode[] = [];

    while (!this.check(']') && !this.isAtEnd()) {
      elements.push(this.parseExpression());

      if (!this.match(',')) break;
      this.advance(); // 消费 ','
    }

    this.consume(']', '期望 "]"');

    return {
      type: NodeType.ArrayExpression,
      elements,
      elementTypes: [], // 将由类型推断器确定
      start,
      end: this.getCurrentPosition()
    };
  }

  /**
   * 解析其他语句类型（简化实现）
   */
  private parseIfStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'if'
    // 简化实现
    return {
      type: NodeType.IfStatement,
      start,
      end: this.getCurrentPosition()
    };
  }

  private parseForStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'for'
    // 简化实现
    return {
      type: NodeType.ForStatement,
      start,
      end: this.getCurrentPosition()
    };
  }

  private parseWhileStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'while'
    // 简化实现
    return {
      type: NodeType.WhileStatement,
      start,
      end: this.getCurrentPosition()
    };
  }

  private parseReturnStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.advance(); // 消费 'return'

    const children: ASTNode[] = [];
    if (!this.check(';') && !this.isAtEnd()) {
      children.push(this.parseExpression());
    }

    this.consumeOptional(';');

    return {
      type: NodeType.ReturnStatement,
      start,
      end: this.getCurrentPosition(),
      children
    };
  }

  private parseBlockStatement(): ASTNode {
    const start = this.getCurrentPosition();
    this.consume('{', '期望 "{"');

    const children: ASTNode[] = [];
    while (!this.check('}') && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) children.push(stmt);
    }

    this.consume('}', '期望 "}"');

    return {
      type: NodeType.BlockStatement,
      start,
      end: this.getCurrentPosition(),
      children
    };
  }

  private parseExpressionStatement(): ASTNode {
    const start = this.getCurrentPosition();
    const expression = this.parseExpression();
    this.consumeOptional(';');

    return {
      type: NodeType.ExpressionStatement,
      start,
      end: this.getCurrentPosition(),
      children: [expression]
    };
  }

  // 辅助方法
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.currentTokenIndex++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.currentTokenIndex >= this.tokens.length;
  }

  private peek(): Token | null {
    return this.tokens[this.currentTokenIndex] || null;
  }

  private previous(): Token {
    return this.tokens[this.currentTokenIndex - 1];
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek()?.value === type || this.peek()?.type === type;
  }

  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        return true;
      }
    }
    return false;
  }

  private consume(type: string, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    const current = this.peek();
    throw new Error(`${message}。得到: ${current?.value || 'EOF'}`);
  }

  private consumeOptional(type: string): Token | null {
    if (this.check(type)) {
      return this.advance();
    }
    return null;
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().value === ';') return;

      const current = this.peek();
      if (current && ['class', 'function', 'var', 'let', 'const', 'for', 'if', 'while', 'return'].includes(current.value)) {
        return;
      }

      this.advance();
    }
  }

  // 词法分析辅助方法
  private skipWhitespace(): void {
    while (this.position < this.code.length && /\s/.test(this.code[this.position])) {
      if (this.code[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  private isCommentStart(): boolean {
    return this.code.slice(this.position, this.position + 2) === '//' ||
           this.code.slice(this.position, this.position + 2) === '/*';
  }

  private skipComment(): void {
    if (this.code.slice(this.position, this.position + 2) === '//') {
      while (this.position < this.code.length && this.code[this.position] !== '\n') {
        this.position++;
        this.column++;
      }
    } else if (this.code.slice(this.position, this.position + 2) === '/*') {
      this.position += 2;
      this.column += 2;
      while (this.position < this.code.length - 1) {
        if (this.code.slice(this.position, this.position + 2) === '*/') {
          this.position += 2;
          this.column += 2;
          break;
        }
        if (this.code[this.position] === '\n') {
          this.line++;
          this.column = 1;
        } else {
          this.column++;
        }
        this.position++;
      }
    }
  }

  private readString(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    const quote = this.code[this.position];

    this.advance();

    let value = '';
    while (this.position < this.code.length && this.code[this.position] !== quote) {
      if (this.code[this.position] === '\\' && this.position + 1 < this.code.length) {
        this.advance();
        value += this.code[this.position];
      } else {
        value += this.code[this.position];
      }
      this.advance();
    }

    if (this.position < this.code.length) {
      this.advance(); // 消费结束引号
    }

    return {
      type: 'String',
      value: quote + value + quote,
      start,
      end: this.position,
      line: startLine,
      column: startColumn
    };
  }

  private readNumber(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    let value = '';
    while (this.position < this.code.length && (this.isDigit(this.code[this.position]) || this.code[this.position] === '.')) {
      value += this.code[this.position];
      this.advance();
    }

    return {
      type: 'Number',
      value,
      start,
      end: this.position,
      line: startLine,
      column: startColumn
    };
  }

  private readIdentifier(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    let value = '';
    while (this.position < this.code.length &&
           (this.isLetter(this.code[this.position]) ||
            this.isDigit(this.code[this.position]) ||
            this.code[this.position] === '_' ||
            this.code[this.position] === '$')) {
      value += this.code[this.position];
      this.advance();
    }

    // 检查是否是关键字或布尔值
    const type = this.getTokenType(value);

    return {
      type,
      value,
      start,
      end: this.position,
      line: startLine,
      column: startColumn
    };
  }

  private readOperator(): Token | null {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    const operators = [
      '===', '!==', '==', '!=', '<=', '>=', '&&', '||',
      '++', '--', '+=', '-=', '*=', '/=', '=>',
      '<', '>', '!', '&', '|', '+', '-', '*', '/', '%',
      '=', '(', ')', '{', '}', '[', ']', ';', ',', '.', ':', '?'
    ];

    // 按长度排序，优先匹配长操作符
    operators.sort((a, b) => b.length - a.length);

    for (const op of operators) {
      if (this.code.slice(this.position, this.position + op.length) === op) {
        this.position += op.length;
        this.column += op.length;

        return {
          type: 'Operator',
          value: op,
          start,
          end: this.position,
          line: startLine,
          column: startColumn
        };
      }
    }

    return null;
  }

  private getTokenType(value: string): string {
    const keywords = [
      'var', 'let', 'const', 'function', 'class', 'if', 'else', 'for',
      'while', 'do', 'break', 'continue', 'return', 'try', 'catch',
      'finally', 'throw', 'new', 'this', 'super', 'extends', 'import',
      'export', 'default', 'async', 'await', 'static', 'constructor'
    ];

    if (keywords.includes(value)) {
      return 'Keyword';
    }

    if (value === 'true' || value === 'false') {
      return 'Boolean';
    }

    if (value === 'null' || value === 'undefined') {
      return 'Null';
    }

    return 'Identifier';
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  private getCurrentPosition(): number {
    return this.position;
  }
}

// Token接口
interface Token {
  type: string;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
}
