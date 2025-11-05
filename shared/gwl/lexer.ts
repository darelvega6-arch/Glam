import { Token } from './types';

export class Lexer {
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

      if (char === '#') {
        this.skipComment();
        continue;
      }

      if (char === '\n') {
        this.tokens.push({ type: 'NEWLINE', value: '\n', line: this.line });
        this.line++;
        this.pos++;
        continue;
      }

      if (char === '"' || char === "'") {
        this.tokens.push(this.readString(char));
        continue;
      }

      if (this.isDigit(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      if (this.isOperatorStart(char)) {
        this.tokens.push(this.readOperator());
        continue;
      }

      if ('()[]{},:'.includes(char)) {
        this.tokens.push({ type: 'PUNCTUATION', value: char, line: this.line });
        this.pos++;
        continue;
      }

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
    this.pos++;
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

    if (this.pos < this.code.length) this.pos++;

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
