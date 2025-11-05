import { GWLValue, GWLScope, GWLFunction, IOAdapter } from './types';

export class GWLRuntime {
  private globalScope: GWLScope;
  private currentScope: GWLScope;
  private uiCommands: any[] = [];
  private ioAdapter: IOAdapter | null = null;
  private recursionDepth: number = 0;
  private maxRecursionDepth: number = 100;
  private totalIterations: number = 0;
  private maxTotalIterations: number = 100000;
  private outputSize: number = 0;
  private maxOutputSize: number = 1000000;

  constructor(ioAdapter?: IOAdapter) {
    this.globalScope = {
      variables: new Map(),
      functions: new Map(),
    };
    this.currentScope = this.globalScope;
    this.ioAdapter = ioAdapter || null;
    this.initBuiltins();
  }

  private initBuiltins() {
    // UI básicas
    this.registerNativeFunction('mostrar', ['elemento'], (args) => {
      const elemento = args[0];
      if (elemento && elemento.type === 'object' && elemento.value) {
        const uiObj = elemento.value;
        if (uiObj.type && (uiObj.type.startsWith('ui_') || uiObj.type.startsWith('3d_'))) {
          this.uiCommands.push(uiObj);
        }
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('imprimir', ['valor'], (args) => {
      const value = String(args[0].value);
      this.outputSize += value.length;
      if (this.outputSize > this.maxOutputSize) {
        throw new Error('Límite de salida excedido (máximo 1MB)');
      }
      if (this.ioAdapter) {
        this.ioAdapter.print(value);
      } else {
        console.log(value);
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('str', ['valor'], (args) => {
      return { type: 'string', value: String(args[0].value) };
    });

    // UI 2D
    this.registerNativeFunction('crear_ventana', ['titulo'], (args) => {
      return { type: 'ui_window', title: args[0].value, children: [] };
    });

    this.registerNativeFunction('titulo', ['texto', 'tamano'], (args) => {
      const size = args[1] ? args[1].value : 1;
      const uiObj = { type: 'ui_heading', text: args[0].value, size };
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

    // ===== MOTOR 3D - CREACIÓN DE OBJETOS =====
    this.registerNativeFunction('crear_cubo', ['nombre', 'x', 'y', 'z'], (args) => {
      const obj = {
        type: '3d_cube',
        name: args[0].value,
        position: { x: args[1].value, y: args[2].value, z: args[3].value },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: { r: 128, g: 128, b: 128 },
        visible: true,
        physics: false,
        static: false
      };
      this.uiCommands.push(obj);
      return { type: 'object', value: obj };
    });

    this.registerNativeFunction('crear_esfera', ['nombre', 'x', 'y', 'z', 'radio'], (args) => {
      const obj = {
        type: '3d_sphere',
        name: args[0].value,
        position: { x: args[1].value, y: args[2].value, z: args[3].value },
        radius: args[4].value,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: { r: 128, g: 128, b: 128 },
        visible: true,
        physics: false,
        static: false
      };
      this.uiCommands.push(obj);
      return { type: 'object', value: obj };
    });

    this.registerNativeFunction('crear_cilindro', ['nombre', 'x', 'y', 'z', 'radio', 'altura'], (args) => {
      const obj = {
        type: '3d_cylinder',
        name: args[0].value,
        position: { x: args[1].value, y: args[2].value, z: args[3].value },
        radius: args[4].value,
        height: args[5].value,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: { r: 128, g: 128, b: 128 },
        visible: true,
        physics: false,
        static: false
      };
      this.uiCommands.push(obj);
      return { type: 'object', value: obj };
    });

    this.registerNativeFunction('crear_plano', ['nombre', 'x', 'y', 'z', 'ancho', 'largo'], (args) => {
      const obj = {
        type: '3d_plane',
        name: args[0].value,
        position: { x: args[1].value, y: args[2].value, z: args[3].value },
        width: args[4].value,
        depth: args[5].value,
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: { r: 100, g: 200, b: 100 },
        visible: true,
        physics: false,
        static: true
      };
      this.uiCommands.push(obj);
      return { type: 'object', value: obj };
    });

    // ===== TRANSFORMACIONES 3D =====
    this.registerNativeFunction('mover', ['objeto', 'x', 'y', 'z'], (args) => {
      const obj = args[0].value;
      if (obj && obj.position) {
        obj.position.x = args[1].value;
        obj.position.y = args[2].value;
        obj.position.z = args[3].value;
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('mover_relativo', ['objeto', 'dx', 'dy', 'dz'], (args) => {
      const obj = args[0].value;
      if (obj && obj.position) {
        obj.position.x += args[1].value;
        obj.position.y += args[2].value;
        obj.position.z += args[3].value;
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('rotar', ['objeto', 'x', 'y', 'z'], (args) => {
      const obj = args[0].value;
      if (obj && obj.rotation) {
        obj.rotation.x = args[1].value * Math.PI / 180;
        obj.rotation.y = args[2].value * Math.PI / 180;
        obj.rotation.z = args[3].value * Math.PI / 180;
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('escalar', ['objeto', 'sx', 'sy', 'sz'], (args) => {
      const obj = args[0].value;
      if (obj && obj.scale) {
        obj.scale.x = args[1].value;
        obj.scale.y = args[2].value;
        obj.scale.z = args[3].value;
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('cambiar_color', ['objeto', 'r', 'g', 'b'], (args) => {
      const obj = args[0].value;
      if (obj && obj.color) {
        obj.color.r = args[1].value;
        obj.color.g = args[2].value;
        obj.color.b = args[3].value;
      }
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('mostrar_objeto', ['objeto'], (args) => {
      const obj = args[0].value;
      if (obj) obj.visible = true;
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('ocultar_objeto', ['objeto'], (args) => {
      const obj = args[0].value;
      if (obj) obj.visible = false;
      return { type: 'null', value: null };
    });

    // ===== FÍSICA =====
    this.registerNativeFunction('aplicar_fisica', ['objeto'], (args) => {
      const obj = args[0].value;
      if (obj) obj.physics = true;
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('hacer_estatico', ['objeto'], (args) => {
      const obj = args[0].value;
      if (obj) obj.static = true;
      return { type: 'null', value: null };
    });

    this.registerNativeFunction('obtener_posicion', ['objeto'], (args) => {
      const obj = args[0].value;
      if (obj && obj.position) {
        return {
          type: 'array',
          value: [
            { type: 'number', value: obj.position.x },
            { type: 'number', value: obj.position.y },
            { type: 'number', value: obj.position.z }
          ]
        };
      }
      return { type: 'array', value: [] };
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

    this.recursionDepth++;
    if (this.recursionDepth > this.maxRecursionDepth) {
      throw new Error(`Límite de recursión excedido (máximo ${this.maxRecursionDepth})`);
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
    this.recursionDepth--;
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
      this.totalIterations++;
      if (this.totalIterations > this.maxTotalIterations) {
        throw new Error(`Límite de iteraciones excedido (máximo ${this.maxTotalIterations})`);
      }
      this.currentScope.variables.set(node.variable, item);
      this.executeBlock(node.body);
    }
    return null;
  }

  private executeWhileLoop(node: any): GWLValue | null {
    while (this.isTruthy(this.executeNode(node.condition))) {
      this.totalIterations++;
      if (this.totalIterations > this.maxTotalIterations) {
        throw new Error(`Límite de iteraciones excedido (máximo ${this.maxTotalIterations})`);
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
