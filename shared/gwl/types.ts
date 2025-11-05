export interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'PUNCTUATION' | 'NEWLINE' | 'EOF';
  value: string;
  line: number;
}

export interface GWLValue {
  type: 'string' | 'number' | 'boolean' | 'function' | 'object' | 'array' | 'null';
  value: any;
}

export interface GWLScope {
  variables: Map<string, GWLValue>;
  functions: Map<string, GWLFunction>;
  parent?: GWLScope;
}

export interface GWLFunction {
  params: string[];
  body: any[];
  scope: GWLScope;
  native?: (args: GWLValue[]) => any;
}

export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
}

export interface GWLExecutionResult {
  stdout: string[];
  stderr: string[];
  uiCommands: any[];
  exitCode: number;
  duration: number;
  errors: string[];
}

export interface IOAdapter {
  print(value: string): void;
  input(prompt: string): Promise<string>;
  clear(): void;
  getOutput(): string[];
  getErrors(): string[];
}

export interface IExecutor {
  execute(code: string, ioAdapter: IOAdapter, timeout?: number): Promise<GWLExecutionResult>;
}

export interface ITranspiler {
  transpile(code: string): GWLParseResult;
}
