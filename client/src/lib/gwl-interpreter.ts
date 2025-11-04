export interface GWLParseResult {
  html: string;
  css: string;
  js: string;
  errors: string[];
}

interface Component {
  name: string;
  props: string[];
  body: string[];
}

interface Style {
  name: string;
  rules: string;
}

export function interpretGWL(code: string): GWLParseResult {
  const errors: string[] = [];
  let html = '';
  let css = '';
  let js = '';

  try {
    const lines = code.split('\n');
    const components: Component[] = [];
    const styles: Style[] = [];
    let variables: Record<string, string> = {};
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('//') || trimmed.length === 0) {
        i++;
        continue;
      }

      // Parse variable declarations
      if (trimmed.startsWith('set ')) {
        const varMatch = trimmed.match(/set\s+(\w+)\s*=\s*"(.+?)"/);
        if (varMatch) {
          variables[varMatch[1]] = varMatch[2];
        }
        i++;
        continue;
      }

      // Parse component definitions
      if (trimmed.startsWith('component ')) {
        const result = parseComponent(lines, i);
        if (result.component) {
          components.push(result.component);
        }
        i = result.nextIndex;
        continue;
      }

      // Parse style definitions
      if (trimmed.startsWith('style ')) {
        const result = parseStyle(lines, i);
        if (result.style) {
          styles.push(result.style);
        }
        i = result.nextIndex;
        continue;
      }

      // Parse render blocks (standalone)
      if (trimmed === 'render:') {
        i++;
        while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
          if (lines[i].trim()) {
            html += convertGWLToHTML(lines[i].trim(), variables) + '\n';
          }
          i++;
        }
        continue;
      }

      i++;
    }

    // Generate CSS from styles
    if (styles.length > 0) {
      css = styles.map(s => `.${s.name} {\n${s.rules}\n}`).join('\n\n');
    }

    // Render components
    for (const component of components) {
      let componentHTML = '';
      for (const line of component.body) {
        componentHTML += convertGWLToHTML(line, variables) + '\n';
      }
      html += `<div class="gwl-component" data-component="${component.name}">\n${componentHTML}</div>\n`;
    }

    // Add default message if no output
    if (!html || html.trim() === '') {
      html = '<div class="gwl-preview"><h2>Vista Previa GWL+</h2><p>Escribe tu código para comenzar...</p></div>';
    }

    // Wrap in container
    html = `<div class="gwl-app">\n${html}\n</div>`;

  } catch (error) {
    errors.push(`Error de interpretación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    html = '<div class="gwl-error"><h3>Error en el código</h3><p>Revisa tu sintaxis GWL+</p></div>';
  }

  return { html, css, js, errors };
}

function parseComponent(lines: string[], startIndex: number): { component: Component | null; nextIndex: number } {
  const trimmed = lines[startIndex].trim();
  const match = trimmed.match(/component\s+(\w+)\s*\((.*?)\):/);
  
  if (!match) {
    return { component: null, nextIndex: startIndex + 1 };
  }

  const name = match[1];
  const props = match[2].split(',').map(p => p.trim()).filter(p => p);
  const body: string[] = [];
  
  let i = startIndex + 1;
  let inRender = false;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line === 'end') {
      break;
    }
    
    if (line === 'render:') {
      inRender = true;
      i++;
      continue;
    }
    
    if (inRender && line && !line.startsWith('//')) {
      body.push(line);
    }
    
    i++;
  }
  
  return {
    component: { name, props, body },
    nextIndex: i + 1
  };
}

function parseStyle(lines: string[], startIndex: number): { style: Style | null; nextIndex: number } {
  const trimmed = lines[startIndex].trim();
  const match = trimmed.match(/style\s+(\w+):\s*{/);
  
  if (!match) {
    return { style: null, nextIndex: startIndex + 1 };
  }

  const name = match[1];
  let rules = '';
  let i = startIndex + 1;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line === '}') {
      break;
    }
    
    if (line && !line.startsWith('//')) {
      rules += `  ${line}\n`;
    }
    
    i++;
  }
  
  return {
    style: { name, rules },
    nextIndex: i + 1
  };
}

function convertGWLToHTML(gwlLine: string, variables: Record<string, string> = {}): string {
  gwlLine = gwlLine.trim();

  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    gwlLine = gwlLine.replace(new RegExp(`\\$${key}\\b`, 'g'), value);
  }

  // Text element
  if (gwlLine.startsWith('Text(')) {
    const match = gwlLine.match(/Text\("(.+?)"\)/);
    if (match) return `<p class="gwl-text">${match[1]}</p>`;
  }

  // Heading element
  if (gwlLine.startsWith('Heading(')) {
    const match = gwlLine.match(/Heading\("(.+?)"\)/);
    if (match) return `<h1 class="gwl-heading">${match[1]}</h1>`;
  }

  // Subheading element
  if (gwlLine.startsWith('Subheading(')) {
    const match = gwlLine.match(/Subheading\("(.+?)"\)/);
    if (match) return `<h2 class="gwl-subheading">${match[1]}</h2>`;
  }

  // Button element with optional onclick
  if (gwlLine.startsWith('Button(')) {
    const match = gwlLine.match(/Button\("(.+?)"(?:,\s*onClick="(.+?)")?\)/);
    if (match) {
      const text = match[1];
      const onClick = match[2] ? ` onclick="alert('${match[2]}')"` : '';
      return `<button class="gwl-button"${onClick}>${text}</button>`;
    }
  }

  // Input element
  if (gwlLine.startsWith('Input(')) {
    const match = gwlLine.match(/Input\("(.+?)"(?:,\s*type="(.+?)")?\)/);
    if (match) {
      const placeholder = match[1];
      const type = match[2] || 'text';
      return `<input type="${type}" placeholder="${placeholder}" class="gwl-input" />`;
    }
  }

  // Image element
  if (gwlLine.startsWith('Image(')) {
    const match = gwlLine.match(/Image\("(.+?)"(?:,\s*alt="(.+?)")?\)/);
    if (match) {
      const src = match[1];
      const alt = match[2] || 'Image';
      return `<img src="${src}" alt="${alt}" class="gwl-image" />`;
    }
  }

  // Link element
  if (gwlLine.startsWith('Link(')) {
    const match = gwlLine.match(/Link\("(.+?)",\s*"(.+?)"\)/);
    if (match) {
      return `<a href="${match[2]}" class="gwl-link">${match[1]}</a>`;
    }
  }

  // Container with class
  if (gwlLine.startsWith('Container(')) {
    const match = gwlLine.match(/Container\((?:class="(.+?)")?\):/);
    if (match) {
      const className = match[1] || '';
      return `<div class="gwl-container ${className}">`;
    }
  }

  // Row for horizontal layout
  if (gwlLine.startsWith('Row(')) {
    const match = gwlLine.match(/Row\((?:class="(.+?)")?\):/);
    if (match) {
      const className = match[1] || '';
      return `<div class="gwl-row ${className}">`;
    }
  }

  // Column for vertical layout
  if (gwlLine.startsWith('Column(')) {
    const match = gwlLine.match(/Column\((?:class="(.+?)")?\):/);
    if (match) {
      const className = match[1] || '';
      return `<div class="gwl-column ${className}">`;
    }
  }

  // Card element
  if (gwlLine.startsWith('Card(')) {
    const match = gwlLine.match(/Card\((?:class="(.+?)")?\):/);
    if (match) {
      const className = match[1] || '';
      return `<div class="gwl-card ${className}">`;
    }
  }

  // List element
  if (gwlLine.startsWith('List(')) {
    return `<ul class="gwl-list">`;
  }

  // ListItem element
  if (gwlLine.startsWith('ListItem(')) {
    const match = gwlLine.match(/ListItem\("(.+?)"\)/);
    if (match) return `<li class="gwl-list-item">${match[1]}</li>`;
  }

  // Closing tags
  if (gwlLine === 'end') {
    return '</div>';
  }

  if (gwlLine === '}') {
    return '</div>';
  }

  return '';
}

export const exampleGWLCode = `// Ejemplo completo de GWL+
// Variables
set title = "¡Bienvenido a GWL+!"
set description = "Crea aplicaciones web con sintaxis simple"

// Definir estilos personalizados
style hero: {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 12px;
  color: white;
  text-align: center;
}

style feature-card: {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

// Componente principal
component App():
  render:
    Container(class="hero"):
      Heading($title)
      Text($description)
      Button("Comenzar Ahora", onClick="¡Has hecho clic!")
    end
    
    Row():
      Card(class="feature-card"):
        Subheading("Fácil de Aprender")
        Text("Sintaxis intuitiva tipo Python")
      end
      
      Card(class="feature-card"):
        Subheading("Potente")
        Text("Crea apps completas")
      end
    end
    
    Container():
      Subheading("Características")
      List():
        ListItem("Componentes reutilizables")
        ListItem("Estilos personalizados")
        ListItem("Variables dinámicas")
      end
    end
end
`;

export const tutorialExamples = {
  basic: `// Tutorial 1: Lo Básico
component HelloWorld():
  render:
    Heading("¡Hola Mundo!")
    Text("Mi primera app en GWL+")
    Button("Click aquí")
end`,

  withStyles: `// Tutorial 2: Estilos
style card: {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
}

component StyledCard():
  render:
    Container(class="card"):
      Heading("Tarjeta con Estilo")
      Text("Los estilos hacen todo mejor")
    end
end`,

  withVariables: `// Tutorial 3: Variables
set nombre = "Desarrollador"
set mensaje = "¡Estás haciendo un gran trabajo!"

component PersonalGreeting():
  render:
    Heading("Hola, $nombre")
    Text($mensaje)
end`,

  complete: `// Tutorial 4: App Completa
set appName = "Mi App"

style header: {
  background: #6366f1;
  color: white;
  padding: 20px;
  text-align: center;
}

style content: {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

component FullApp():
  render:
    Container(class="header"):
      Heading($appName)
    end
    
    Container(class="content"):
      Subheading("Bienvenido")
      Text("Esta es una aplicación completa")
      Input("Escribe algo...")
      Button("Enviar", onClick="Formulario enviado")
    end
end`,
};
