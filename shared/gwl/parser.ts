import { Token } from './types';

export class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): any[] {
    const statements: any[] = [];
    while (!this.isAtEnd()) {
      this.skipNewlines();
      if (this.isAtEnd()) break;
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }
    return statements;
  }

  private parseStatement(): any {
    const token = this.peek();

    if (token.type === 'EOF') {
      return null;
    }

    if (token.type === 'KEYWORD') {
      switch (token.value) {
        case 'definir': return this.parseFunctionDef();
        case 'si': return this.parseIf();
        case 'para': return this.parseFor();
        case 'mientras': return this.parseWhile();
        case 'retornar': return this.parseReturn();
        case 'fin':
          return null;
        default:
          throw new Error(`Línea ${token.line}: Palabra clave desconocida '${token.value}'`);
      }
    }

    if (this.peek().type === 'IDENTIFIER' && this.peekAhead(1)?.value === '=') {
      return this.parseAssignment();
    }

    return this.parseExpressionStatement();
  }

  private parseAssignment(): any {
    const name = this.advance().value;
    this.expect('OPERATOR', '=');
    const value = this.parseExpression();
    this.skipNewlines();
    return { type: 'variable_assignment', name, value };
  }

  private parseFunctionDef(): any {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    this.expect('PUNCTUATION', '(');

    const params: string[] = [];
    while (this.peek().value !== ')') {
      params.push(this.expect('IDENTIFIER').value);
      if (this.peek().value === ',') this.advance();
    }

    this.expect('PUNCTUATION', ')');
    this.expect('PUNCTUATION', ':');
    this.skipNewlines();

    const body: any[] = [];
    while (!this.isAtEnd() && this.peek().value !== 'fin') {
      this.skipNewlines();
      if (this.peek().value === 'fin') break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (this.peek().value === 'fin') this.advance();
    this.skipNewlines();

    return { type: 'function_definition', name, params, body };
  }

  private parseIf(): any {
    this.advance();
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', ':');
    this.skipNewlines();

    const thenBranch: any[] = [];
    while (!this.isAtEnd() && this.peek().value !== 'sino' && this.peek().value !== 'fin') {
      this.skipNewlines();
      if (this.peek().value === 'sino' || this.peek().value === 'fin') break;
      const stmt = this.parseStatement();
      if (stmt) thenBranch.push(stmt);
    }

    let elseBranch = null;
    if (this.peek().value === 'sino') {
      this.advance();
      this.expect('PUNCTUATION', ':');
      this.skipNewlines();

      elseBranch = [];
      while (!this.isAtEnd() && this.peek().value !== 'fin') {
        this.skipNewlines();
        if (this.peek().value === 'fin') break;
        const stmt = this.parseStatement();
        if (stmt) elseBranch.push(stmt);
      }
    }

    if (this.peek().value === 'fin') this.advance();
    this.skipNewlines();

    return {
      type: 'if_statement',
      condition,
      thenBranch: { type: 'block', statements: thenBranch },
      elseBranch: elseBranch ? { type: 'block', statements: elseBranch } : null,
    };
  }

  private parseFor(): any {
    this.advance();
    const variable = this.expect('IDENTIFIER').value;
    this.expect('KEYWORD', 'en');
    const collection = this.parseExpression();
    this.expect('PUNCTUATION', ':');
    this.skipNewlines();

    const body: any[] = [];
    while (!this.isAtEnd() && this.peek().value !== 'fin') {
      this.skipNewlines();
      if (this.peek().value === 'fin') break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (this.peek().value === 'fin') this.advance();
    this.skipNewlines();

    return { type: 'for_loop', variable, collection, body: { type: 'block', statements: body } };
  }

  private parseWhile(): any {
    this.advance();
    const condition = this.parseExpression();
    this.expect('PUNCTUATION', ':');
    this.skipNewlines();

    const body: any[] = [];
    while (!this.isAtEnd() && this.peek().value !== 'fin') {
      this.skipNewlines();
      if (this.peek().value === 'fin') break;
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    if (this.peek().value === 'fin') this.advance();
    this.skipNewlines();

    return { type: 'while_loop', condition, body: { type: 'block', statements: body } };
  }

  private parseReturn(): any {
    this.advance();
    const value = this.parseExpression();
    this.skipNewlines();
    return { type: 'return_statement', value };
  }

  private parseExpressionStatement(): any {
    const expr = this.parseExpression();
    this.skipNewlines();
    return expr;
  }

  private parseExpression(): any {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): any {
    let left = this.parseLogicalAnd();

    while (this.peek().value === 'o' || this.peek().value === 'or') {
      const op = this.advance().value;
      const right = this.parseLogicalAnd();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parseLogicalAnd(): any {
    let left = this.parseEquality();

    while (this.peek().value === 'y' || this.peek().value === 'and') {
      const op = this.advance().value;
      const right = this.parseEquality();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parseEquality(): any {
    let left = this.parseComparison();

    while (['==', '!='].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.parseComparison();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parseComparison(): any {
    let left = this.parseAddition();

    while (['<', '>', '<=', '>='].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.parseAddition();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parseAddition(): any {
    let left = this.parseMultiplication();

    while (['+', '-'].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.parseMultiplication();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parseMultiplication(): any {
    let left = this.parsePrimary();

    while (['*', '/'].includes(this.peek().value)) {
      const op = this.advance().value;
      const right = this.parsePrimary();
      left = { type: 'binary_operation', operator: op, left, right };
    }

    return left;
  }

  private parsePrimary(): any {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'literal', value: { type: 'number', value: parseFloat(token.value) } };
    }

    if (token.type === 'STRING') {
      this.advance();
      return { type: 'literal', value: { type: 'string', value: token.value } };
    }

    if (token.value === 'verdadero' || token.value === 'falso') {
      this.advance();
      return { type: 'literal', value: { type: 'boolean', value: token.value === 'verdadero' } };
    }

    if (token.value === 'nulo') {
      this.advance();
      return { type: 'literal', value: { type: 'null', value: null } };
    }

    if (token.value === '[') {
      return this.parseArray();
    }

    if (token.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', ')');
      return expr;
    }

    if (token.type === 'IDENTIFIER') {
      const name = this.advance().value;

      if (this.peek().value === '(') {
        return this.parseFunctionCall(name);
      }

      return { type: 'variable_reference', name };
    }

    throw new Error(`Línea ${token.line}: Token inesperado '${token.value || token.type}'. Se esperaba un número, string, variable o expresión.`);
  }

  private parseArray(): any {
    this.expect('PUNCTUATION', '[');
    const items: any[] = [];

    while (this.peek().value !== ']') {
      items.push(this.parseExpression());
      if (this.peek().value === ',') this.advance();
    }

    this.expect('PUNCTUATION', ']');

    const values = items.map(item => {
      if (item.type === 'literal') return item.value;
      return item;
    });

    return { type: 'literal', value: { type: 'array', value: values } };
  }

  private parseFunctionCall(name: string): any {
    this.expect('PUNCTUATION', '(');
    const args: any[] = [];

    while (this.peek().value !== ')') {
      args.push(this.parseExpression());
      if (this.peek().value === ',') this.advance();
    }

    this.expect('PUNCTUATION', ')');

    return { type: 'function_call', name, args };
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: 'EOF', value: '', line: 0 };
  }

  private peekAhead(offset: number): Token | null {
    return this.tokens[this.pos + offset] || null;
  }

  private advance(): Token {
    return this.tokens[this.pos++] || { type: 'EOF', value: '', line: 0 };
  }

  private expect(type: string, value?: string): Token {
    const token = this.peek();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      const expected = value ? `'${value}'` : type;
      const found = token.value || token.type;
      throw new Error(`Línea ${token.line}: Se esperaba ${expected}, pero se encontró '${found}'`);
    }
    return this.advance();
  }

  private skipNewlines(): void {
    while (this.peek().type === 'NEWLINE') {
      this.advance();
    }
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }
}
