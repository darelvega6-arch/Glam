
export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
}

interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'PUNCTUATION' | 'NEWLINE' | 'EOF';
  value: string;
  line: number;
}

interface GWLValue {
  type: 'string' | 'number' | 'boolean' | 'function' | 'object' | 'array' | 'null';
  value: any;
}

interface GWLScope {
  variables: Map<string, GWLValue>;
  functions: Map<string, GWLFunction>;
  parent?: GWLScope;
}

interface GWLFunction {
  params: string[];
  body: any[];
  scope: GWLScope;
  native?: (args: GWLValue[]) => any;
}

class Lexer {
  private code: string;
  private pos: number = 0;
  private line: number = 1;
  private tokens: Token[] = [];

  private keywords = new Set([
    'definir', 'fin', 'si', 'sino', 'para', 'en', 'mientras',
    'retornar', 'verdadero', 'falso', 'nulo', 'y', 'o'
  ]);

  constructor(code: string) {
    this.code = code;
  }

  tokenize(): Token[] {
    this.tokens = [];
    while (this.pos < this.code.length) {
      this.skipWhitespace();
      if (this.pos >= this.code.length) break;

      const char = this.code[this.pos];

      // Comentarios
      if (char === '#') {
        this.skipComment();
        continue;
      }

      // Newline
      if (char === '\n') {
        this.tokens.push({ type: 'NEWLINE', value: '\n', line: this.line });
        this.line++;
        this.pos++;
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        this.tokens.push(this.readString(char));
        continue;
      }

      // Numbers
      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Operators
      if (this.isOperatorStart(char)) {
        this.tokens.push(this.readOperator());
        continue;
      }

      // Punctuation
      if ('()[]{},:'.includes(char)) {
        this.tokens.push({ type: 'PUNCTUATION', value: char, line: this.line });
        this.pos++;
        continue;
      }

      // Identifiers and Keywords
      if (this.isAlpha(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      this.pos++;
    }

    this.tokens.push({ type: 'EOF', value: '', line: this.line });
    return this.tokens;
  }

  private skipWhitespace(): void {
    while (this.pos < this.code.length) {
      const char = this.code[this.pos];
      if (char === ' ' || char === '\t' || char === '\r') {
        this.pos++;
      } else {
        break;
      }
    }
  }

  private skipComment(): void {
    while (this.pos < this.code.length && this.code[this.pos] !== '\n') {
      this.pos++;
    }
  }

  private readString(quote: string): Token {
    const start = this.pos;
    this.pos++; // skip opening quote
    let value = '';

    while (this.pos < this.code.length && this.code[this.pos] !== quote) {
      if (this.code[this.pos] === '\\') {
        this.pos++;
        if (this.pos < this.code.length) {
          const escapeChar = this.code[this.pos];
          if (escapeChar === 'n') value += '\n';
          else if (escapeChar === 't') value += '\t';
          else value += escapeChar;
        }
      } else {
        value += this.code[this.pos];
      }
      this.pos++;
    }

    if (this.pos < this.code.length) this.pos++; // skip closing quote

    return { type: 'STRING', value, line: this.line };
  }

  private readNumber(): Token {
    let value = '';
    while (this.pos < this.code.length && (this.isDigit(this.code[this.pos]) || this.code[this.pos] === '.')) {
      value += this.code[this.pos];
      this.pos++;
    }
    return { type: 'NUMBER', value, line: this.line };
  }

  private readOperator(): Token {
    const twoCharOps = ['==', '!=', '<=', '>='];
    const twoChar = this.code.slice(this.pos, this.pos + 2);

    if (twoCharOps.includes(twoChar)) {
      this.pos += 2;
      return { type: 'OPERATOR', value: twoChar, line: this.line };
    }

    const char = this.code[this.pos];
    this.pos++;
    return { type: 'OPERATOR', value: char, line: this.line };
  }

  private readIdentifier(): Token {
    let value = '';
    while (this.pos < this.code.length && (this.isAlpha(this.code[this.pos]) || this.isDigit(this.code[this.pos]) || this.code[this.pos] === '_')) {
      value += this.code[this.pos];
      this.pos++;
    }

    const type = this.keywords.has(value) ? 'KEYWORD' : 'IDENTIFIER';
    return { type, value, line: this.line };
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  private isOperatorStart(char: string): boolean {
    return '+-*/<>=!'.includes(char);
  }
}

class Parser {
  private tokens: Token[];
  private pos: number = 0;

  constructor(tokens: Token[]) {
    // Mantener todos los tokens, el skipNewlines manejará los saltos de línea
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

    // EOF check
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
          // 'fin' encontrado fuera de contexto, saltarlo
          return null;
        default:
          throw new Error(`Línea ${token.line}: Palabra clave desconocida '${token.value}'`);
      }
    }

    // Assignment or expression
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
    this.advance(); // 'definir'
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
    this.advance(); // 'si'
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
    this.advance(); // 'para'
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
    this.advance(); // 'mientras'
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
    this.advance(); // 'retornar'
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

    // Numbers
    if (token.type === 'NUMBER') {
      this.advance();
      return { type: 'literal', value: { type: 'number', value: parseFloat(token.value) } };
    }

    // Strings
    if (token.type === 'STRING') {
      this.advance();
      return { type: 'literal', value: { type: 'string', value: token.value } };
    }

    // Booleans
    if (token.value === 'verdadero' || token.value === 'falso') {
      this.advance();
      return { type: 'literal', value: { type: 'boolean', value: token.value === 'verdadero' } };
    }

    // Null
    if (token.value === 'nulo') {
      this.advance();
      return { type: 'literal', value: { type: 'null', value: null } };
    }

    // Arrays
    if (token.value === '[') {
      return this.parseArray();
    }

    // Parentheses
    if (token.value === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.expect('PUNCTUATION', ')');
      return expr;
    }

    // Function calls or variables
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

class GWLRuntime {
  private globalScope: GWLScope;
  private currentScope: GWLScope;
  private uiCommands: any[] = [];

  constructor() {
    this.globalScope = {
      variables: new Map(),
      functions: new Map(),
    };
    this.currentScope = this.globalScope;
    this.initBuiltins();
  }

  private initBuiltins() {
    this.registerNativeFunction('mostrar', ['elemento'], (args) => {
      const elemento = args[0];
      
      // Verificar si es un GWLValue con un objeto UI dentro
      if (elemento && elemento.type === 'object' && elemento.value) {
        const uiObj = elemento.value;
        // Verificar que sea un comando UI válido
        if (uiObj.type && uiObj.type.startsWith('ui_')) {
          this.uiCommands.push(uiObj);
          console.log('UI Command agregado:', uiObj);
        }
      }
      
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('imprimir', ['valor'], (args) => {
      console.log(args[0].value);
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('str', ['valor'], (args) => {
      return { type: 'string', value: String(args[0].value) };
    });

    this.registerNativeFunction('crear_ventana', ['titulo'], (args) => {
      return { type: 'ui_window', title: args[0].value, children: [] };
    });

    this.registerNativeFunction('titulo', ['texto', 'tamano'], (args) => {
      const size = args[1] ? args[1].value : 1;
      const uiObj = { type: 'ui_heading', text: args[0].value, size };
      // Retornar como GWLValue para que mostrar() pueda procesarlo
      return { type: 'object', value: uiObj };
    });

    this.registerNativeFunction('texto', ['contenido'], (args) => {
      const uiObj = { type: 'ui_text', content: args[0].value };
      return { type: 'object', value: uiObj };
    });

    this.registerNativeFunction('boton', ['etiqueta'], (args) => {
      const uiObj = { type: 'ui_button', label: args[0].value };
      return { type: 'object', value: uiObj };
    });

    this.registerNativeFunction('entrada', ['placeholder'], (args) => {
      const uiObj = { type: 'ui_input', placeholder: args[0].value || '' };
      return { type: 'object', value: uiObj };
    });
  }

  private registerNativeFunction(name: string, params: string[], handler: (args: GWLValue[]) => any) {
    this.globalScope.functions.set(name, {
      params,
      body: [],
      scope: this.globalScope,
      native: handler,
    });
  }

  execute(ast: any[]): any {
    this.uiCommands = [];
    for (const node of ast) {
      this.executeNode(node);
    }
    return this.uiCommands;
  }

  private executeNode(node: any): GWLValue | null {
    if (!node) return null;

    switch (node.type) {
      case 'variable_assignment':
        return this.executeVarAssignment(node);
      case 'function_definition':
        return this.executeFunctionDefinition(node);
      case 'function_call':
        return this.executeFunctionCall(node);
      case 'if_statement':
        return this.executeIfStatement(node);
      case 'for_loop':
        return this.executeForLoop(node);
      case 'while_loop':
        return this.executeWhileLoop(node);
      case 'return_statement':
        return this.executeNode(node.value);
      case 'binary_operation':
        return this.executeBinaryOp(node);
      case 'literal':
        return node.value;
      case 'variable_reference':
        return this.getVariable(node.name);
      case 'block':
        return this.executeBlock(node);
      default:
        return null;
    }
  }

  private executeBlock(node: any): GWLValue | null {
    let result: GWLValue | null = null;
    for (const stmt of node.statements) {
      result = this.executeNode(stmt);
    }
    return result;
  }

  private executeVarAssignment(node: any): GWLValue | null {
    const value = this.executeNode(node.value);
    this.currentScope.variables.set(node.name, value!);
    return null;
  }

  private executeFunctionDefinition(node: any): GWLValue | null {
    this.currentScope.functions.set(node.name, {
      params: node.params,
      body: node.body,
      scope: this.currentScope,
    });
    return null;
  }

  private executeFunctionCall(node: any): GWLValue | null {
    const func = this.findFunction(node.name);
    if (!func) {
      throw new Error(`Función '${node.name}' no existe`);
    }

    const args: GWLValue[] = [];
    for (const arg of node.args) {
      args.push(this.executeNode(arg)!);
    }

    if (func.native) {
      return func.native(args);
    }

    const funcScope: GWLScope = {
      variables: new Map(),
      functions: new Map(),
      parent: func.scope,
    };

    for (let i = 0; i < func.params.length; i++) {
      funcScope.variables.set(func.params[i], args[i] || { type: 'null', value: null });
    }

    const prevScope = this.currentScope;
    this.currentScope = funcScope;

    let result: GWLValue | null = null;
    for (const stmt of func.body) {
      result = this.executeNode(stmt);
      if (stmt.type === 'return_statement') break;
    }

    this.currentScope = prevScope;
    return result;
  }

  private executeIfStatement(node: any): GWLValue | null {
    const condition = this.executeNode(node.condition);
    if (this.isTruthy(condition)) {
      return this.executeBlock(node.thenBranch);
    } else if (node.elseBranch) {
      return this.executeBlock(node.elseBranch);
    }
    return null;
  }

  private executeForLoop(node: any): GWLValue | null {
    const collection = this.executeNode(node.collection);
    if (collection?.type !== 'array') {
      throw new Error('El bucle "para" requiere un array');
    }

    for (const item of collection.value) {
      this.currentScope.variables.set(node.variable, item);
      this.executeBlock(node.body);
    }
    return null;
  }

  private executeWhileLoop(node: any): GWLValue | null {
    let iterations = 0;
    const maxIterations = 10000;

    while (this.isTruthy(this.executeNode(node.condition))) {
      if (iterations++ > maxIterations) {
        throw new Error('Bucle infinito detectado');
      }
      this.executeBlock(node.body);
    }
    return null;
  }

  private executeBinaryOp(node: any): GWLValue {
    const left = this.executeNode(node.left);
    const right = this.executeNode(node.right);

    if (!left || !right) {
      throw new Error('Operación con valores nulos');
    }

    switch (node.operator) {
      case '+':
        if (left.type === 'number' && right.type === 'number') {
          return { type: 'number', value: left.value + right.value };
        }
        return { type: 'string', value: String(left.value) + String(right.value) };
      case '-':
        return { type: 'number', value: Number(left.value) - Number(right.value) };
      case '*':
        return { type: 'number', value: Number(left.value) * Number(right.value) };
      case '/':
        if (Number(right.value) === 0) throw new Error('División por cero');
        return { type: 'number', value: Number(left.value) / Number(right.value) };
      case '==':
        return { type: 'boolean', value: left.value === right.value };
      case '!=':
        return { type: 'boolean', value: left.value !== right.value };
      case '<':
        return { type: 'boolean', value: Number(left.value) < Number(right.value) };
      case '>':
        return { type: 'boolean', value: Number(left.value) > Number(right.value) };
      case '<=':
        return { type: 'boolean', value: Number(left.value) <= Number(right.value) };
      case '>=':
        return { type: 'boolean', value: Number(left.value) >= Number(right.value) };
      case 'y':
      case 'and':
        return { type: 'boolean', value: this.isTruthy(left) && this.isTruthy(right) };
      case 'o':
      case 'or':
        return { type: 'boolean', value: this.isTruthy(left) || this.isTruthy(right) };
      default:
        throw new Error(`Operador desconocido: ${node.operator}`);
    }
  }

  private isTruthy(value: GWLValue | null): boolean {
    if (!value) return false;
    if (value.type === 'boolean') return value.value;
    if (value.type === 'number') return value.value !== 0;
    if (value.type === 'string') return value.value !== '';
    if (value.type === 'null') return false;
    return true;
  }

  private findFunction(name: string): GWLFunction | null {
    let scope: GWLScope | undefined = this.currentScope;
    while (scope) {
      if (scope.functions.has(name)) {
        return scope.functions.get(name)!;
      }
      scope = scope.parent;
    }
    return null;
  }

  private getVariable(name: string): GWLValue {
    let scope: GWLScope | undefined = this.currentScope;
    while (scope) {
      if (scope.variables.has(name)) {
        return scope.variables.get(name)!;
      }
      scope = scope.parent;
    }
    throw new Error(`Variable '${name}' no definida`);
  }
}

export function interpretGWL(code: string): GWLParseResult {
  const errors: string[] = [];
  let html = '';
  let css = '';
  let js = '';

  // Si el código está vacío, mostrar mensaje de bienvenida
  if (!code || code.trim() === '') {
    html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>Escribe tu código para comenzar...</p></div>';
    return { html, css, js, errors };
  }

  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const runtime = new GWLRuntime();
    const uiCommands = runtime.execute(ast);

    html = uiCommandsToHTML(uiCommands);

    if (!html) {
      html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>El código se ejecutó correctamente, pero no se generó ninguna interfaz. Usa funciones como mostrar() para crear elementos visuales.</p></div>';
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    errors.push(errorMsg);
    
    // Mejorar el mensaje de error visual
    html = `<div class="gwl-error">
      <h3>❌ Error de Sintaxis</h3>
      <p><strong>${errorMsg}</strong></p>
      <p style="margin-top: 10px; font-size: 14px; color: #666;">
        💡 Revisa que todas las estructuras (si, para, mientras, definir) terminen con ':' y tengan su correspondiente 'fin'
      </p>
    </div>`;
  }

  return { html, css, js, errors };
}

function uiCommandsToHTML(commands: any[]): string {
  if (!commands || commands.length === 0) {
    return '';
  }
  
  let html = '';
  for (const cmd of commands) {
    html += renderUICommand(cmd);
  }
  return html;
}

function renderUICommand(cmd: any): string {
  if (!cmd || !cmd.type) {
    console.warn('Comando UI inválido:', cmd);
    return '';
  }

  switch (cmd.type) {
    case 'ui_window':
      return `<div class="gwl-window"><h1 class="gwl-title">${cmd.title}</h1>${cmd.children.map(renderUICommand).join('')}</div>`;
    case 'ui_heading':
      return `<h${cmd.size} class="gwl-heading">${cmd.text}</h${cmd.size}>`;
    case 'ui_text':
      return `<p class="gwl-text">${cmd.content}</p>`;
    case 'ui_button':
      return `<button class="gwl-button">${cmd.label}</button>`;
    case 'ui_input':
      return `<input class="gwl-input" placeholder="${cmd.placeholder}" />`;
    default:
      console.warn('Tipo de comando UI desconocido:', cmd.type);
      return '';
  }
}

export const exampleGWLCode = `# GWL+ - Lenguaje Único de Programación
# Variables y tipos
nombre = "Calculadora GWL+"
numeros = [1, 2, 3, 4, 5]
total = 0

# Función recursiva para factorial
definir factorial(n):
    si n == 0:
        retornar 1
    sino:
        retornar n * factorial(n - 1)
    fin
fin

# Función para sumar array
definir sumar_array(lista):
    suma = 0
    para numero en lista:
        suma = suma + numero
    fin
    retornar suma
fin

# Calcular valores
total = sumar_array(numeros)
fact5 = factorial(5)

# Crear interfaz
ventana = crear_ventana(nombre)
mostrar(titulo(nombre, 1))
mostrar(texto("Suma total: " + str(total)))
mostrar(texto("Factorial de 5: " + str(fact5)))
mostrar(boton("Calcular"))
`;

export const tutorialExamples = {
  basic: `# Tutorial 1: Variables
nombre = "Juan"
edad = 25
activo = verdadero

imprimir(nombre)
imprimir(edad)`,

  functions: `# Tutorial 2: Funciones
definir saludar(nombre):
    retornar "Hola, " + nombre
fin

mensaje = saludar("Mundo")
imprimir(mensaje)`,

  control: `# Tutorial 3: Control de Flujo
edad = 18

si edad >= 18:
    imprimir("Mayor de edad")
sino:
    imprimir("Menor de edad")
fin

# Bucle
contador = 0
mientras contador < 5:
    imprimir(contador)
    contador = contador + 1
fin`,

  complete: `# Tutorial 4: App Completa
items = ["Item 1", "Item 2", "Item 3"]

definir contar(lista):
    cuenta = 0
    para item en lista:
        cuenta = cuenta + 1
    fin
    retornar cuenta
fin

cantidad = contar(items)

mostrar(titulo("Mi Aplicación", 1))
mostrar(texto("Total items: " + str(cantidad)))
mostrar(boton("Actualizar"))`,
};
