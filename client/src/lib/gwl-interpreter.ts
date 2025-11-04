
export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
}

interface GWLValue {
  type: 'string' | 'number' | 'boolean' | 'function' | 'object' | 'array' | 'element';
  value: any;
}

interface GWLScope {
  variables: Map<string, GWLValue>;
  functions: Map<string, GWLFunction>;
  parent?: GWLScope;
}

interface GWLFunction {
  params: string[];
  body: string[];
  scope: GWLScope;
}

class GWLRuntime {
  private globalScope: GWLScope;
  private currentScope: GWLScope;
  private elements: any[] = [];
  
  constructor() {
    this.globalScope = {
      variables: new Map(),
      functions: new Map(),
    };
    this.currentScope = this.globalScope;
    this.initBuiltins();
  }

  private initBuiltins() {
    // Funciones nativas del lenguaje
    this.globalScope.functions.set('print', {
      params: ['value'],
      body: [],
      scope: this.globalScope,
    });
    
    this.globalScope.functions.set('len', {
      params: ['collection'],
      body: [],
      scope: this.globalScope,
    });
  }

  execute(ast: any[]): any {
    for (const node of ast) {
      this.executeNode(node);
    }
    return this.elements;
  }

  private executeNode(node: any): GWLValue | null {
    switch (node.type) {
      case 'variable_declaration':
        return this.executeVarDeclaration(node);
      case 'function_declaration':
        return this.executeFunctionDeclaration(node);
      case 'function_call':
        return this.executeFunctionCall(node);
      case 'if_statement':
        return this.executeIfStatement(node);
      case 'for_loop':
        return this.executeForLoop(node);
      case 'while_loop':
        return this.executeWhileLoop(node);
      case 'element_creation':
        return this.executeElementCreation(node);
      case 'binary_operation':
        return this.executeBinaryOp(node);
      case 'literal':
        return node.value;
      default:
        return null;
    }
  }

  private executeVarDeclaration(node: any): GWLValue | null {
    const value = this.executeNode(node.value);
    this.currentScope.variables.set(node.name, value!);
    return null;
  }

  private executeFunctionDeclaration(node: any): GWLValue | null {
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
      throw new Error(`Función '${node.name}' no definida`);
    }

    // Crear nuevo scope para la función
    const funcScope: GWLScope = {
      variables: new Map(),
      functions: new Map(),
      parent: func.scope,
    };

    // Evaluar argumentos y asignar parámetros
    for (let i = 0; i < func.params.length; i++) {
      const argValue = this.executeNode(node.args[i]);
      funcScope.variables.set(func.params[i], argValue!);
    }

    const prevScope = this.currentScope;
    this.currentScope = funcScope;

    let result: GWLValue | null = null;
    for (const stmt of func.body) {
      result = this.executeNode(stmt);
    }

    this.currentScope = prevScope;
    return result;
  }

  private executeIfStatement(node: any): GWLValue | null {
    const condition = this.executeNode(node.condition);
    if (this.isTruthy(condition)) {
      for (const stmt of node.thenBranch) {
        this.executeNode(stmt);
      }
    } else if (node.elseBranch) {
      for (const stmt of node.elseBranch) {
        this.executeNode(stmt);
      }
    }
    return null;
  }

  private executeForLoop(node: any): GWLValue | null {
    const collection = this.executeNode(node.collection);
    if (collection?.type !== 'array') {
      throw new Error('for loop requiere un array');
    }

    for (const item of collection.value) {
      this.currentScope.variables.set(node.variable, item);
      for (const stmt of node.body) {
        this.executeNode(stmt);
      }
    }
    return null;
  }

  private executeWhileLoop(node: any): GWLValue | null {
    while (this.isTruthy(this.executeNode(node.condition))) {
      for (const stmt of node.body) {
        this.executeNode(stmt);
      }
    }
    return null;
  }

  private executeElementCreation(node: any): GWLValue {
    const element = {
      tag: node.tag,
      props: {},
      children: [],
    };

    for (const [key, value] of Object.entries(node.props || {})) {
      element.props[key] = this.executeNode(value as any);
    }

    for (const child of node.children || []) {
      element.children.push(this.executeNode(child));
    }

    this.elements.push(element);
    return { type: 'element', value: element };
  }

  private executeBinaryOp(node: any): GWLValue {
    const left = this.executeNode(node.left);
    const right = this.executeNode(node.right);

    switch (node.operator) {
      case '+':
        return this.add(left!, right!);
      case '-':
        return this.subtract(left!, right!);
      case '*':
        return this.multiply(left!, right!);
      case '/':
        return this.divide(left!, right!);
      case '==':
        return { type: 'boolean', value: this.equals(left!, right!) };
      case '!=':
        return { type: 'boolean', value: !this.equals(left!, right!) };
      case '<':
        return { type: 'boolean', value: this.lessThan(left!, right!) };
      case '>':
        return { type: 'boolean', value: this.greaterThan(left!, right!) };
      default:
        throw new Error(`Operador desconocido: ${node.operator}`);
    }
  }

  private add(left: GWLValue, right: GWLValue): GWLValue {
    if (left.type === 'number' && right.type === 'number') {
      return { type: 'number', value: left.value + right.value };
    }
    if (left.type === 'string' || right.type === 'string') {
      return { type: 'string', value: String(left.value) + String(right.value) };
    }
    throw new Error('Operación + no válida');
  }

  private subtract(left: GWLValue, right: GWLValue): GWLValue {
    if (left.type === 'number' && right.type === 'number') {
      return { type: 'number', value: left.value - right.value };
    }
    throw new Error('Operación - requiere números');
  }

  private multiply(left: GWLValue, right: GWLValue): GWLValue {
    if (left.type === 'number' && right.type === 'number') {
      return { type: 'number', value: left.value * right.value };
    }
    throw new Error('Operación * requiere números');
  }

  private divide(left: GWLValue, right: GWLValue): GWLValue {
    if (left.type === 'number' && right.type === 'number') {
      if (right.value === 0) throw new Error('División por cero');
      return { type: 'number', value: left.value / right.value };
    }
    throw new Error('Operación / requiere números');
  }

  private equals(left: GWLValue, right: GWLValue): boolean {
    return left.type === right.type && left.value === right.value;
  }

  private lessThan(left: GWLValue, right: GWLValue): boolean {
    if (left.type === 'number' && right.type === 'number') {
      return left.value < right.value;
    }
    throw new Error('Comparación < requiere números');
  }

  private greaterThan(left: GWLValue, right: GWLValue): boolean {
    if (left.type === 'number' && right.type === 'number') {
      return left.value > right.value;
    }
    throw new Error('Comparación > requiere números');
  }

  private isTruthy(value: GWLValue | null): boolean {
    if (!value) return false;
    if (value.type === 'boolean') return value.value;
    if (value.type === 'number') return value.value !== 0;
    if (value.type === 'string') return value.value !== '';
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
}

class GWLParser {
  private tokens: string[];
  private current = 0;

  constructor(code: string) {
    this.tokens = this.tokenize(code);
  }

  private tokenize(code: string): string[] {
    // Tokenizador simple
    const tokens: string[] = [];
    let current = '';
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (char === ' ' || char === '\n' || char === '\t') {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }
      
      if ('(){}[],:=+-*/<>!'.includes(char)) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
        continue;
      }
      
      current += char;
    }
    
    if (current) tokens.push(current);
    return tokens;
  }

  parse(): any[] {
    const ast: any[] = [];
    while (!this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) ast.push(stmt);
    }
    return ast;
  }

  private parseStatement(): any {
    const token = this.peek();
    
    if (token === 'let' || token === 'var') {
      return this.parseVarDeclaration();
    }
    if (token === 'func') {
      return this.parseFunctionDeclaration();
    }
    if (token === 'if') {
      return this.parseIfStatement();
    }
    if (token === 'for') {
      return this.parseForLoop();
    }
    if (token === 'while') {
      return this.parseWhileLoop();
    }
    if (token === 'render') {
      return this.parseRenderBlock();
    }
    
    // Intentar parsear como expresión
    return this.parseExpression();
  }

  private parseVarDeclaration(): any {
    this.advance(); // consume 'let' o 'var'
    const name = this.advance();
    this.expect('=');
    const value = this.parseExpression();
    
    return {
      type: 'variable_declaration',
      name,
      value,
    };
  }

  private parseFunctionDeclaration(): any {
    this.advance(); // consume 'func'
    const name = this.advance();
    this.expect('(');
    const params: string[] = [];
    
    while (this.peek() !== ')') {
      params.push(this.advance());
      if (this.peek() === ',') this.advance();
    }
    
    this.expect(')');
    this.expect('{');
    
    const body: any[] = [];
    while (this.peek() !== '}') {
      body.push(this.parseStatement());
    }
    
    this.expect('}');
    
    return {
      type: 'function_declaration',
      name,
      params,
      body,
    };
  }

  private parseIfStatement(): any {
    this.advance(); // consume 'if'
    this.expect('(');
    const condition = this.parseExpression();
    this.expect(')');
    this.expect('{');
    
    const thenBranch: any[] = [];
    while (this.peek() !== '}') {
      thenBranch.push(this.parseStatement());
    }
    this.expect('}');
    
    let elseBranch = null;
    if (this.peek() === 'else') {
      this.advance();
      this.expect('{');
      elseBranch = [];
      while (this.peek() !== '}') {
        elseBranch.push(this.parseStatement());
      }
      this.expect('}');
    }
    
    return {
      type: 'if_statement',
      condition,
      thenBranch,
      elseBranch,
    };
  }

  private parseForLoop(): any {
    this.advance(); // consume 'for'
    this.expect('(');
    const variable = this.advance();
    this.expect('in');
    const collection = this.parseExpression();
    this.expect(')');
    this.expect('{');
    
    const body: any[] = [];
    while (this.peek() !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('}');
    
    return {
      type: 'for_loop',
      variable,
      collection,
      body,
    };
  }

  private parseWhileLoop(): any {
    this.advance(); // consume 'while'
    this.expect('(');
    const condition = this.parseExpression();
    this.expect(')');
    this.expect('{');
    
    const body: any[] = [];
    while (this.peek() !== '}') {
      body.push(this.parseStatement());
    }
    this.expect('}');
    
    return {
      type: 'while_loop',
      condition,
      body,
    };
  }

  private parseRenderBlock(): any {
    this.advance(); // consume 'render'
    this.expect('{');
    
    const elements: any[] = [];
    while (this.peek() !== '}') {
      elements.push(this.parseElement());
    }
    this.expect('}');
    
    return {
      type: 'render_block',
      elements,
    };
  }

  private parseElement(): any {
    const tag = this.advance();
    const props: any = {};
    const children: any[] = [];
    
    if (this.peek() === '(') {
      this.advance();
      while (this.peek() !== ')') {
        const key = this.advance();
        this.expect('=');
        props[key] = this.parseExpression();
        if (this.peek() === ',') this.advance();
      }
      this.expect(')');
    }
    
    if (this.peek() === '{') {
      this.advance();
      while (this.peek() !== '}') {
        children.push(this.parseElement());
      }
      this.expect('}');
    }
    
    return {
      type: 'element_creation',
      tag,
      props,
      children,
    };
  }

  private parseExpression(): any {
    return this.parseComparison();
  }

  private parseComparison(): any {
    let left = this.parseAddition();
    
    while (['==', '!=', '<', '>'].includes(this.peek())) {
      const operator = this.advance();
      const right = this.parseAddition();
      left = {
        type: 'binary_operation',
        operator,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseAddition(): any {
    let left = this.parseMultiplication();
    
    while (['+', '-'].includes(this.peek())) {
      const operator = this.advance();
      const right = this.parseMultiplication();
      left = {
        type: 'binary_operation',
        operator,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseMultiplication(): any {
    let left = this.parsePrimary();
    
    while (['*', '/'].includes(this.peek())) {
      const operator = this.advance();
      const right = this.parsePrimary();
      left = {
        type: 'binary_operation',
        operator,
        left,
        right,
      };
    }
    
    return left;
  }

  private parsePrimary(): any {
    const token = this.peek();
    
    // Números
    if (!isNaN(Number(token))) {
      this.advance();
      return { type: 'literal', value: { type: 'number', value: Number(token) } };
    }
    
    // Strings
    if (token.startsWith('"') || token.startsWith("'")) {
      this.advance();
      const value = token.slice(1, -1);
      return { type: 'literal', value: { type: 'string', value } };
    }
    
    // Booleanos
    if (token === 'true' || token === 'false') {
      this.advance();
      return { type: 'literal', value: { type: 'boolean', value: token === 'true' } };
    }
    
    // Llamadas a función o variables
    const name = this.advance();
    if (this.peek() === '(') {
      this.advance();
      const args: any[] = [];
      while (this.peek() !== ')') {
        args.push(this.parseExpression());
        if (this.peek() === ',') this.advance();
      }
      this.expect(')');
      return {
        type: 'function_call',
        name,
        args,
      };
    }
    
    return {
      type: 'variable_reference',
      name,
    };
  }

  private peek(): string {
    return this.tokens[this.current] || '';
  }

  private advance(): string {
    return this.tokens[this.current++] || '';
  }

  private expect(token: string): void {
    if (this.peek() !== token) {
      throw new Error(`Se esperaba '${token}', se encontró '${this.peek()}'`);
    }
    this.advance();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }
}

export function interpretGWL(code: string): GWLParseResult {
  const errors: string[] = [];
  let html = '';
  let css = '';
  let js = '';

  try {
    const parser = new GWLParser(code);
    const ast = parser.parse();
    const runtime = new GWLRuntime();
    const elements = runtime.execute(ast);
    
    // Convertir elementos a HTML
    html = elementsToHTML(elements);
    
    if (!html) {
      html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>Escribe tu código para comenzar...</p></div>';
    }
    
  } catch (error) {
    errors.push(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    html = `<div class="gwl-error"><h3>Error en el código</h3><p>${error instanceof Error ? error.message : 'Error desconocido'}</p></div>`;
  }

  return { html, css, js, errors };
}

function elementsToHTML(elements: any[]): string {
  let html = '';
  for (const element of elements) {
    if (element.type === 'element') {
      html += renderElement(element.value);
    }
  }
  return html;
}

function renderElement(element: any): string {
  const { tag, props, children } = element;
  let html = `<${tag}`;
  
  for (const [key, value] of Object.entries(props)) {
    html += ` ${key}="${value}"`;
  }
  
  html += '>';
  
  for (const child of children) {
    if (child?.type === 'element') {
      html += renderElement(child.value);
    } else if (child?.type === 'string') {
      html += child.value;
    }
  }
  
  html += `</${tag}>`;
  return html;
}

export const exampleGWLCode = `// Lenguaje de Programación GWL+
// Variables y tipos
let nombre = "Usuario"
let contador = 0
let activo = true

// Función para calcular factorial
func factorial(n) {
  if (n == 0) {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}

// Arrays y loops
let numeros = [1, 2, 3, 4, 5]
let suma = 0

for (num in numeros) {
  suma = suma + num
}

// Condicionales
if (suma > 10) {
  print("Suma es mayor que 10")
}

// Renderizado de UI
render {
  div(class="container") {
    h1 { "Calculadora GWL+" }
    p { "Factorial de 5: " + factorial(5) }
    p { "Suma del array: " + suma }
  }
}
`;

export const tutorialExamples = {
  basic: `// Tutorial 1: Variables y Tipos
let mensaje = "Hola GWL+"
let numero = 42
let activo = true

print(mensaje)
print(numero)`,

  functions: `// Tutorial 2: Funciones
func saludar(nombre) {
  return "Hola, " + nombre + "!"
}

func suma(a, b) {
  return a + b
}

let resultado = suma(10, 20)
print(saludar("Mundo"))
print(resultado)`,

  control: `// Tutorial 3: Control de Flujo
let edad = 18

if (edad >= 18) {
  print("Eres mayor de edad")
} else {
  print("Eres menor de edad")
}

let i = 0
while (i < 5) {
  print(i)
  i = i + 1
}`,

  complete: `// Tutorial 4: Programa Completo
let items = ["Manzana", "Banana", "Naranja"]
let total = 0

func procesar(lista) {
  for (item in lista) {
    total = total + 1
  }
  return total
}

let cantidad = procesar(items)

render {
  div(class="app") {
    h1 { "Mi Aplicación GWL+" }
    p { "Total de items: " + cantidad }
  }
}`,
};
