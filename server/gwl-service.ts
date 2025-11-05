import { GWLExecutor, GWLTranspiler, ConsoleIOAdapter, GWLExecutionResult, GWLParseResult } from '@shared/gwl';

export class GWLService {
  private executor: GWLExecutor;
  private transpiler: GWLTranspiler;

  constructor() {
    this.executor = new GWLExecutor();
    this.transpiler = new GWLTranspiler();
  }

  async execute(code: string, timeout: number = 5000): Promise<GWLExecutionResult> {
    const ioAdapter = new ConsoleIOAdapter();
    return await this.executor.execute(code, ioAdapter, timeout);
  }

  transpile(code: string): GWLParseResult {
    return this.transpiler.transpile(code);
  }
}

export const gwlService = new GWLService();
