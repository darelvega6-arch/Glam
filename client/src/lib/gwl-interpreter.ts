
export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
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
  body: string[];
  scope: GWLScope;
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
    // Funciones nativas de UI
    this.registerNativeFunction('crear_contenedor', ['id'], (args) => {
      return { type: 'ui_container', id: args[0].value, children: [] };
    });
    
    this.registerNativeFunction('agregar_titulo', ['texto', 'nivel'], (args) => {
      const nivel = args[1] ? args[1].value : 1;
      return { type: 'ui_heading', text: args[0].value, level: nivel };
    });
    
    this.registerNativeFunction('agregar_texto', ['contenido'], (args) => {
      return { type: 'ui_text', content: args[0].value };
    });
    
    this.registerNativeFunction('agregar_boton', ['etiqueta'], (args) => {
      return { type: 'ui_button', label: args[0].value };
    });
    
    this.registerNativeFunction('agregar_entrada', ['placeholder'], (args) => {
      return { type: 'ui_input', placeholder: args[0].value };
    });
    
    this.registerNativeFunction('mostrar', ['vista'], (args) => {
      this.uiCommands.push(args[0]);
      return { type: 'null', value: null };
    });
    
    this.registerNativeFunction('imprimir', ['valor'], (args) => {
      console.log(args[0].value);
      return { type: 'null', value: null };
    });
    
    this.registerNativeFunction('str', ['valor'], (args) => {
      return { type: 'string', value: String(args[0].value) };
    });
  }

  private registerNativeFunction(name: string, params: string[], handler: (args: GWLValue[]) => any) {
    this.globalScope.functions.set(name, {
      params,
      body: [],
      scope: this.globalScope,
      native: handler,
    } as any);
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
      throw new Error(`Función '${node.name}' no definida`);
    }

    // Evaluar argumentos
    const args: GWLValue[] = [];
    for (const arg of node.args) {
      args.push(this.executeNode(arg)!);
    }

    // Si es función nativa
    if ((func as any).native) {
      return (func as any).native(args);
    }

    // Crear nuevo scope para la función
    const funcScope: GWLScope = {
      variables: new Map(),
      functions: new Map(),
      parent: func.scope,
    };

    // Asignar parámetros
    for (let i = 0; i < func.params.length; i++) {
      funcScope.variables.set(func.params[i], args[i] || { type: 'null', value: null });
    }

    const prevScope = this.currentScope;
    this.currentScope = funcScope;

    let result: GWLValue | null = null;
    for (const stmt of func.body) {
      result = this.executeNode(stmt);
      if (stmt.type === 'return_statement') {
        break;
      }
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
      throw new Error('para loop requiere un array');
    }

    for (const item of collection.value) {
      this.currentScope.variables.set(node.variable, item);
      this.executeBlock(node.body);
    }
    return null;
  }

  private executeWhileLoop(node: any): GWLValue | null {
    while (this.isTruthy(this.executeNode(node.condition))) {
      this.executeBlock(node.body);
    }
    return null;
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

class GWLParser {
  private lines: string[];
  private current = 0;

  constructor(code: string) {
    this.lines = code.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
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
    const line = this.peek();
    
    if (line.startsWith('definir ')) {
      return this.parseFunctionDefinition();
    }
    if (line.startsWith('si ')) {
      return this.parseIfStatement();
    }
    if (line.startsWith('para ')) {
      return this.parseForLoop();
    }
    if (line.startsWith('mientras ')) {
      return this.parseWhileLoop();
    }
    if (line.includes('=') && !line.includes('==')) {
      return this.parseVarAssignment();
    }
    
    return this.parseExpression();
  }

  private parseVarAssignment(): any {
    const line = this.advance();
    const [name, ...valueParts] = line.split('=');
    const valueStr = valueParts.join('=').trim();
    
    return {
      type: 'variable_assignment',
      name: name.trim(),
      value: this.parseExpressionFromString(valueStr),
    };
  }

  private parseFunctionDefinition(): any {
    const line = this.advance();
    const match = line.match(/definir\s+(\w+)\s*\((.*?)\):/);
    
    if (!match) {
      throw new Error(`Sintaxis de función inválida: ${line}`);
    }
    
    const name = match[1];
    const paramsStr = match[2].trim();
    const params = paramsStr ? paramsStr.split(',').map(p => p.trim()) : [];
    
    const body: any[] = [];
    let indent = this.getIndent(this.peek());
    
    while (!this.isAtEnd() && this.peek() !== 'fin' && this.getIndent(this.peek()) >= indent) {
      body.push(this.parseStatement());
    }
    
    if (this.peek() === 'fin') {
      this.advance();
    }
    
    return {
      type: 'function_definition',
      name,
      params,
      body,
    };
  }

  private parseIfStatement(): any {
    const line = this.advance();
    const conditionStr = line.substring(3, line.length - 1).trim();
    const condition = this.parseExpressionFromString(conditionStr);
    
    const thenStatements: any[] = [];
    let indent = this.getIndent(this.peek());
    
    while (!this.isAtEnd() && !this.peek().startsWith('sino') && this.peek() !== 'fin' && this.getIndent(this.peek()) >= indent) {
      thenStatements.push(this.parseStatement());
    }
    
    let elseStatements = null;
    if (this.peek()?.startsWith('sino')) {
      this.advance();
      elseStatements = [];
      while (!this.isAtEnd() && this.peek() !== 'fin' && this.getIndent(this.peek()) >= indent) {
        elseStatements.push(this.parseStatement());
      }
    }
    
    if (this.peek() === 'fin') {
      this.advance();
    }
    
    return {
      type: 'if_statement',
      condition,
      thenBranch: { type: 'block', statements: thenStatements },
      elseBranch: elseStatements ? { type: 'block', statements: elseStatements } : null,
    };
  }

  private parseForLoop(): any {
    const line = this.advance();
    const match = line.match(/para\s+(\w+)\s+en\s+(.+):/);
    
    if (!match) {
      throw new Error(`Sintaxis de para inválida: ${line}`);
    }
    
    const variable = match[1];
    const collection = this.parseExpressionFromString(match[2]);
    
    const bodyStatements: any[] = [];
    let indent = this.getIndent(this.peek());
    
    while (!this.isAtEnd() && this.peek() !== 'fin' && this.getIndent(this.peek()) >= indent) {
      bodyStatements.push(this.parseStatement());
    }
    
    if (this.peek() === 'fin') {
      this.advance();
    }
    
    return {
      type: 'for_loop',
      variable,
      collection,
      body: { type: 'block', statements: bodyStatements },
    };
  }

  private parseWhileLoop(): any {
    const line = this.advance();
    const conditionStr = line.substring(9, line.length - 1).trim();
    const condition = this.parseExpressionFromString(conditionStr);
    
    const bodyStatements: any[] = [];
    let indent = this.getIndent(this.peek());
    
    while (!this.isAtEnd() && this.peek() !== 'fin' && this.getIndent(this.peek()) >= indent) {
      bodyStatements.push(this.parseStatement());
    }
    
    if (this.peek() === 'fin') {
      this.advance();
    }
    
    return {
      type: 'while_loop',
      condition,
      body: { type: 'block', statements: bodyStatements },
    };
  }

  private parseExpression(): any {
    const line = this.advance();
    return this.parseExpressionFromString(line);
  }

  private parseExpressionFromString(str: string): any {
    str = str.trim();
    
    // Llamadas a función
    if (str.includes('(') && str.includes(')')) {
      const parenIndex = str.indexOf('(');
      const name = str.substring(0, parenIndex).trim();
      const argsStr = str.substring(parenIndex + 1, str.lastIndexOf(')')).trim();
      
      const args: any[] = [];
      if (argsStr) {
        const argParts = this.splitArgs(argsStr);
        for (const arg of argParts) {
          args.push(this.parseExpressionFromString(arg.trim()));
        }
      }
      
      return {
        type: 'function_call',
        name,
        args,
      };
    }
    
    // Operaciones binarias
    for (const op of ['==', '!=', '<=', '>=', '<', '>', '+', '-', '*', '/', 'y', 'o', 'and', 'or']) {
      if (str.includes(op)) {
        const parts = str.split(op);
        if (parts.length === 2) {
          return {
            type: 'binary_operation',
            operator: op,
            left: this.parseExpressionFromString(parts[0].trim()),
            right: this.parseExpressionFromString(parts[1].trim()),
          };
        }
      }
    }
    
    // Números
    if (!isNaN(Number(str))) {
      return { type: 'literal', value: { type: 'number', value: Number(str) } };
    }
    
    // Strings
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
      return { type: 'literal', value: { type: 'string', value: str.slice(1, -1) } };
    }
    
    // Booleanos
    if (str === 'verdadero' || str === 'falso') {
      return { type: 'literal', value: { type: 'boolean', value: str === 'verdadero' } };
    }
    
    // Arrays
    if (str.startsWith('[') && str.endsWith(']')) {
      const itemsStr = str.slice(1, -1).trim();
      const items = itemsStr ? this.splitArgs(itemsStr).map(item => this.parseExpressionFromString(item.trim())) : [];
      const values = items.map(item => item.value || item);
      return { type: 'literal', value: { type: 'array', value: values } };
    }
    
    // Variables
    return {
      type: 'variable_reference',
      name: str,
    };
  }

  private splitArgs(str: string): string[] {
    const args: string[] = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '(' || char === '[') depth++;
      if (char === ')' || char === ']') depth--;
      
      if (char === ',' && depth === 0) {
        args.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) args.push(current);
    return args;
  }

  private getIndent(line: string): number {
    if (!line) return 0;
    let count = 0;
    for (const char of line) {
      if (char === ' ') count++;
      else break;
    }
    return count;
  }

  private peek(): string {
    return this.lines[this.current] || '';
  }

  private advance(): string {
    return this.lines[this.current++] || '';
  }

  private isAtEnd(): boolean {
    return this.current >= this.lines.length;
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
    const uiCommands = runtime.execute(ast);
    
    html = uiCommandsToHTML(uiCommands);
    
    if (!html) {
      html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>Escribe tu código para comenzar...</p></div>';
    }
    
  } catch (error) {
    errors.push(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    html = `<div class="gwl-error"><h3>Error en el código</h3><p>${error instanceof Error ? error.message : 'Error desconocido'}</p></div>`;
  }

  return { html, css, js, errors };
}

function uiCommandsToHTML(commands: any[]): string {
  let html = '';
  for (const cmd of commands) {
    html += renderUICommand(cmd);
  }
  return html;
}

function renderUICommand(cmd: any): string {
  if (!cmd || !cmd.type) return '';
  
  switch (cmd.type) {
    case 'ui_container':
      return `<div class="gwl-container" id="${cmd.id}">${cmd.children.map(renderUICommand).join('')}</div>`;
    case 'ui_heading':
      return `<h${cmd.level} class="gwl-heading">${cmd.text}</h${cmd.level}>`;
    case 'ui_text':
      return `<p class="gwl-text">${cmd.content}</p>`;
    case 'ui_button':
      return `<button class="gwl-button">${cmd.label}</button>`;
    case 'ui_input':
      return `<input class="gwl-input" placeholder="${cmd.placeholder}" />`;
    default:
      return '';
  }
}

export const exampleGWLCode = `# Lenguaje GWL+ - Sintaxis Única
# Variables
titulo = "Calculadora GWL+"
contador = 0
numeros = [1, 2, 3, 4, 5]

# Función para sumar array
definir sumar_lista(lista):
    total = 0
    para num en lista:
        total = total + num
    fin
    retornar total
fin

# Función para factorial
definir factorial(n):
    si n == 0:
        retornar 1
    sino:
        retornar n * factorial(n - 1)
    fin
fin

# Calcular valores
suma_total = sumar_lista(numeros)
fact_5 = factorial(5)

# Crear interfaz de usuario
definir crear_app():
    crear_contenedor("app"):
        agregar_titulo(titulo, nivel=1)
        agregar_texto("Suma del array: " + str(suma_total))
        agregar_texto("Factorial de 5: " + str(fact_5))
        agregar_boton("Click aquí")
    fin
fin

# Mostrar la aplicación
mostrar(crear_app())
`;

export const tutorialExamples = {
  basic: `# Tutorial 1: Variables y Tipos
nombre = "Juan"
edad = 25
activo = verdadero

imprimir(nombre)
imprimir(edad)`,

  functions: `# Tutorial 2: Funciones
definir saludar(nombre):
    retornar "Hola, " + nombre + "!"
fin

definir sumar(a, b):
    retornar a + b
fin

mensaje = saludar("Mundo")
resultado = sumar(10, 20)

imprimir(mensaje)
imprimir(resultado)`,

  control: `# Tutorial 3: Control de Flujo
edad = 18

si edad >= 18:
    imprimir("Mayor de edad")
sino:
    imprimir("Menor de edad")
fin

contador = 0
mientras contador < 5:
    imprimir(contador)
    contador = contador + 1
fin`,

  complete: `# Tutorial 4: Aplicación Completa
items = ["Manzana", "Banana", "Naranja"]
total = 0

definir contar_items(lista):
    cuenta = 0
    para item en lista:
        cuenta = cuenta + 1
    fin
    retornar cuenta
fin

cantidad = contar_items(items)

definir mi_app():
    crear_contenedor("app"):
        agregar_titulo("Mi Aplicación", nivel=1)
        agregar_texto("Total: " + str(cantidad))
        agregar_boton("Actualizar")
    fin
fin

mostrar(mi_app())`,
};
