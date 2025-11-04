export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
}

export function interpretGWL(code: string): GWLParseResult {
  const errors: string[] = [];
  let html = '';
  let css = '';
  let js = '';

  try {
    const lines = code.split('\n');
    let inComponent = false;
    let componentName = '';
    let componentProps: string[] = [];
    let componentBody: string[] = [];
    let styles: string[] = [];
    let currentIndent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('//') || trimmed.length === 0) {
        continue;
      }

      if (trimmed.startsWith('component ')) {
        inComponent = true;
        const match = trimmed.match(/component\s+(\w+)\s*\((.*?)\):/);
        if (match) {
          componentName = match[1];
          componentProps = match[2].split(',').map(p => p.trim()).filter(p => p);
          componentBody = [];
        }
      } else if (trimmed.startsWith('style ')) {
        const styleMatch = trimmed.match(/style\s+(\w+):\s*{/);
        if (styleMatch) {
          const className = styleMatch[1];
          let styleContent = '';
          i++;
          while (i < lines.length && !lines[i].trim().startsWith('}')) {
            const styleLine = lines[i].trim();
            if (styleLine && !styleLine.startsWith('//')) {
              styleContent += `  ${styleLine}\n`;
            }
            i++;
          }
          styles.push(`.${className} {\n${styleContent}}`);
        }
      } else if (trimmed.startsWith('render:')) {
        i++;
        while (i < lines.length && lines[i].startsWith('  ')) {
          const renderLine = lines[i].substring(2);
          html += convertGWLToHTML(renderLine) + '\n';
          i++;
        }
        i--;
      } else if (inComponent && trimmed === 'end') {
        inComponent = false;
        html += `<div id="${componentName.toLowerCase()}">${componentBody.join('\n')}</div>`;
      }
    }

    if (styles.length > 0) {
      css = styles.join('\n\n');
    }

    if (!html) {
      html = '<div class="gwl-preview"><p>Escribe tu código GWL+ para ver la vista previa</p></div>';
    }

  } catch (error) {
    errors.push(`Error de sintaxis: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    html = '<div class="gwl-error"><p>Error al interpretar el código</p></div>';
  }

  return { html, css, js, errors };
}

function convertGWLToHTML(gwlLine: string): string {
  gwlLine = gwlLine.trim();

  if (gwlLine.startsWith('Text(')) {
    const match = gwlLine.match(/Text\("(.+?)"\)/);
    if (match) return `<p>${match[1]}</p>`;
  }

  if (gwlLine.startsWith('Heading(')) {
    const match = gwlLine.match(/Heading\("(.+?)"\)/);
    if (match) return `<h1>${match[1]}</h1>`;
  }

  if (gwlLine.startsWith('Button(')) {
    const match = gwlLine.match(/Button\("(.+?)"\)/);
    if (match) return `<button class="gwl-button">${match[1]}</button>`;
  }

  if (gwlLine.startsWith('Container(')) {
    const match = gwlLine.match(/Container\((.*?)\):\s*{/);
    if (match) {
      const props = match[1];
      return `<div class="gwl-container ${props}">`;
    }
  }

  if (gwlLine === '}') {
    return '</div>';
  }

  if (gwlLine.startsWith('Input(')) {
    const match = gwlLine.match(/Input\("(.+?)"\)/);
    if (match) return `<input type="text" placeholder="${match[1]}" class="gwl-input" />`;
  }

  if (gwlLine.startsWith('Image(')) {
    const match = gwlLine.match(/Image\("(.+?)"\)/);
    if (match) return `<img src="${match[1]}" alt="Image" class="gwl-image" />`;
  }

  return gwlLine;
}

export const exampleGWLCode = `// Ejemplo de GWL+ - Tu primer componente
component HelloWorld():
  render:
    Heading("¡Bienvenido a GWL+!")
    Text("Un lenguaje simple y poderoso")
    Button("Empezar")
end

// Define estilos
style container: {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
`;
