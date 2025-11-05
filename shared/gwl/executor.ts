import { Worker } from 'worker_threads';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { GWLRuntime } from './runtime';
import { ConsoleIOAdapter } from './io-adapter';
import { GWLExecutionResult, IExecutor, IOAdapter } from './types';

export class GWLExecutor implements IExecutor {
  async execute(code: string, ioAdapter: IOAdapter, timeout: number = 5000): Promise<GWLExecutionResult> {
    const startTime = Date.now();
    const result: GWLExecutionResult = {
      stdout: [],
      stderr: [],
      uiCommands: [],
      exitCode: 0,
      duration: 0,
      errors: []
    };

    try {
      const executePromise = this.executeInSandbox(code, ioAdapter);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Ejecución excedió el tiempo límite')), timeout);
      });

      const executionResult = await Promise.race([executePromise, timeoutPromise]);
      
      result.stdout = ioAdapter.getOutput();
      result.stderr = ioAdapter.getErrors();
      result.uiCommands = executionResult.uiCommands;
      result.exitCode = 0;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      result.errors.push(errorMsg);
      if (ioAdapter && typeof (ioAdapter as any).addError === 'function') {
        (ioAdapter as any).addError(errorMsg);
      }
      result.stderr = [...ioAdapter.getErrors()];
      result.exitCode = 1;
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  private async executeInSandbox(code: string, ioAdapter: IOAdapter): Promise<{ uiCommands: any[] }> {
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const runtime = new GWLRuntime(ioAdapter);
      const uiCommands = runtime.execute(ast);

      return { uiCommands };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      if (ioAdapter && typeof (ioAdapter as any).addError === 'function') {
        (ioAdapter as any).addError(errorMsg);
      }
      throw error;
    }
  }
}
