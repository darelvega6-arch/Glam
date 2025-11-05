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
      html = '<div class="gwl-preview"><h2>Motor 3D GWL+</h2><p>Escribe código GWL+ para crear tu mundo 3D...</p></div>';
      return { html, css, js, errors };
    }

    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const runtime = new GWLRuntime();
      const uiCommands = runtime.execute(ast);

      const has3D = uiCommands.some(cmd => cmd.type && cmd.type.startsWith('3d_'));
      
      if (has3D) {
        html = this.generate3DScene(uiCommands);
      } else {
        html = this.uiCommandsToHTML(uiCommands);
      }

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

  private generate3DScene(commands: any[]): string {
    const objects = commands.filter(cmd => cmd.type && cmd.type.startsWith('3d_'));
    
    const objectsJSON = JSON.stringify(objects);
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; overflow: hidden; font-family: Arial, sans-serif; }
    #scene-container { width: 100vw; height: 100vh; }
    #info {
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      background: rgba(0,0,0,0.7);
      padding: 15px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 100;
    }
    #controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      background: rgba(0,0,0,0.8);
      padding: 15px 25px;
      border-radius: 12px;
      font-size: 13px;
      z-index: 100;
    }
  </style>
</head>
<body>
  <div id="scene-container"></div>
  <div id="info">
    <strong>🎮 Motor 3D GWL+</strong><br>
    Objetos: <span id="object-count">0</span><br>
    FPS: <span id="fps">60</span>
  </div>
  <div id="controls">
    <strong>Controles:</strong> Click + Arrastrar para rotar | Scroll para zoom | Click derecho para mover
  </div>

  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
      }
    }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const container = document.getElementById('scene-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Crear objetos desde GWL+
    const objects = ${objectsJSON};
    const meshes = [];

    objects.forEach(obj => {
      let geometry, material, mesh;

      const color = new THREE.Color(\`rgb(\${obj.color.r}, \${obj.color.g}, \${obj.color.b})\`);
      material = new THREE.MeshStandardMaterial({ color });

      switch(obj.type) {
        case '3d_cube':
          geometry = new THREE.BoxGeometry(1, 1, 1);
          break;
        case '3d_sphere':
          geometry = new THREE.SphereGeometry(obj.radius || 1, 32, 32);
          break;
        case '3d_cylinder':
          geometry = new THREE.CylinderGeometry(obj.radius || 0.5, obj.radius || 0.5, obj.height || 2, 32);
          break;
        case '3d_plane':
          geometry = new THREE.PlaneGeometry(obj.width || 10, obj.depth || 10);
          break;
      }

      if (geometry) {
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
        mesh.visible = obj.visible;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.gwlObject = obj;
        
        scene.add(mesh);
        meshes.push(mesh);
      }
    });

    document.getElementById('object-count').textContent = meshes.length;

    // Sistema de física simple
    const gravity = -9.8;
    const velocities = new Map();

    meshes.forEach(mesh => {
      const obj = mesh.userData.gwlObject;
      if (obj.physics && !obj.static) {
        velocities.set(mesh, { x: 0, y: 0, z: 0 });
      }
    });

    // FPS counter
    let lastTime = performance.now();
    let frames = 0;

    function animate() {
      requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      frames++;
      if (frames % 60 === 0) {
        const fps = Math.round(1 / delta);
        document.getElementById('fps').textContent = fps;
      }

      // Física simple
      meshes.forEach(mesh => {
        const obj = mesh.userData.gwlObject;
        const velocity = velocities.get(mesh);
        
        if (velocity) {
          velocity.y += gravity * delta;
          mesh.position.y += velocity.y * delta;

          // Colisión con el suelo
          if (mesh.position.y < 0.5) {
            mesh.position.y = 0.5;
            velocity.y = -velocity.y * 0.5; // Rebote
            if (Math.abs(velocity.y) < 0.1) velocity.y = 0;
          }
        }
      });

      controls.update();
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  </script>
</body>
</html>
    `;
  }
}

export function interpretGWL(code: string): GWLParseResult {
  const transpiler = new GWLTranspiler();
  return transpiler.transpile(code);
}
