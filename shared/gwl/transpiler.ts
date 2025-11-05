import { Lexer } from './lexer';
import { Parser } from './parser';
import { GWLRuntime } from './runtime';
import { GWLParseResult, ITranspiler } from './types';

export class GWLTranspiler implements ITranspiler {
  transpile(code: string): GWLParseResult {
    const errors: string[] = [];
    let html = '';
    let css = '';
    let js = '';

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

      html = this.uiCommandsToHTML(uiCommands);

      if (!html) {
        html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>El código se ejecutó correctamente, pero no se generó ninguna interfaz. Usa funciones como mostrar() para crear elementos visuales.</p></div>';
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      errors.push(errorMsg);
      
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

  private uiCommandsToHTML(commands: any[]): string {
    if (!commands || commands.length === 0) {
      return '';
    }
    
    let html = '<div class="gwl-app">';
    for (const cmd of commands) {
      html += this.renderUICommand(cmd);
    }
    html += '</div>';
    
    return html;
  }

  private renderUICommand(cmd: any): string {
    if (!cmd || !cmd.type) {
      return '';
    }

    switch (cmd.type) {
      case 'ui_window':
        return `<div class="gwl-window"><h1 class="gwl-title">${cmd.title}</h1>${cmd.children.map((c: any) => this.renderUICommand(c)).join('')}</div>`;
      case 'ui_heading':
        return `<h${cmd.size} class="gwl-heading">${cmd.text}</h${cmd.size}>`;
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
}

export function interpretGWL(code: string): GWLParseResult {
  const transpiler = new GWLTranspiler();
  return transpiler.transpile(code);
}
