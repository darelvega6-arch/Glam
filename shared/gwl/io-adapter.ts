import { IOAdapter } from './types';

export class ConsoleIOAdapter implements IOAdapter {
  private stdout: string[] = [];
  private stderr: string[] = [];

  print(value: string): void {
    this.stdout.push(value);
  }

  async input(prompt: string): Promise<string> {
    throw new Error('Input no soportado en modo console');
  }

  clear(): void {
    this.stdout = [];
    this.stderr = [];
  }

  getOutput(): string[] {
    return [...this.stdout];
  }

  getErrors(): string[] {
    return [...this.stderr];
  }

  addError(error: string): void {
    this.stderr.push(error);
  }
}
