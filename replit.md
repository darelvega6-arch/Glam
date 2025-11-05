# Proyecto GWL+ IDE/Intérprete

## Descripción
IDE completo para el lenguaje de programación personalizado GWL+ (GlaWebLang Plus). Incluye editor de código, intérprete, y sistema de ejecución backend.

## Estructura del Proyecto

### Backend
- **server/**: Servidor Express con endpoints API
  - `server/index.ts`: Punto de entrada del servidor
  - `server/routes.ts`: Rutas API (proyectos, GWL ejecutor/transpilador)
  - `server/gwl-service.ts`: Servicio de ejecución GWL+
  - `server/storage.ts`: Almacenamiento en memoria

### Frontend
- **client/**: Aplicación React con Vite
  - `client/src/pages/`: Páginas principales (Editor, Proyectos, Tutoriales, Landing)
  - `client/src/components/`: Componentes reutilizables (CodeEditor, PreviewPanel, etc.)
  - `client/src/lib/`: Librerías (exporta intérprete compartido)

### Módulo Compartido GWL+
- **shared/gwl/**: Intérprete completo de GWL+ (usado en backend y frontend)
  - `lexer.ts`: Tokenizador
  - `parser.ts`: Parser AST
  - `runtime.ts`: Runtime de ejecución con límites de seguridad
  - `transpiler.ts`: Transpilador a HTML/CSS/JS
  - `executor.ts`: Ejecutor backend
  - `io-adapter.ts`: Adaptadores de entrada/salida
  - `types.ts`: Tipos e interfaces compartidas
  - ⚠️ **SECURITY.md**: **LEER ANTES DE USAR** - Limitaciones de seguridad importantes

### Base de Datos
- **shared/schema.ts**: Esquema Drizzle (PostgreSQL)
  - `users`: Usuarios del sistema
  - `projects`: Proyectos GWL+ guardados
  - `tutorials`: Tutoriales interactivos

## Arquitectura del Ejecutor GWL+

El proyecto implementa un **ejecutor personalizado** de GWL+ con dos modos:

1. **Modo Transpilación** (`/api/gwl/transpile`):
   - Convierte código GWL+ a HTML/CSS/JS
   - Para interfaces visuales con funciones como `mostrar()`, `titulo()`, `boton()`

2. **Modo Ejecución** (`/api/gwl/execute`):
   - Ejecuta código GWL+ en el backend
   - Devuelve stdout, stderr, UI commands, errores
   - Con timeout y límites de recursos

## ⚠️ Limitaciones de Seguridad

**IMPORTANTE**: El ejecutor actual **NO tiene sandboxing real**. Código malicioso puede causar denial-of-service.

### Límites Implementados
- Recursión: máximo 100 niveles
- Iteraciones totales: 100,000
- Output: máximo 1MB
- Timeout: 100ms - 30s
- Código: máximo 100KB

### Uso Recomendado
- ✅ **Desarrollo local**: Seguro para desarrollo con código confiable
- ❌ **Producción**: **NO USAR** sin implementar sandboxing real

Para más detalles, ver `shared/gwl/SECURITY.md`

## Mejoras Futuras Recomendadas

### Prioridad Alta - Seguridad
- [ ] Implementar sandboxing real con Worker Threads + resourceLimits
- [ ] Agregar timeout activo que termina el worker/proceso
- [ ] Implementar cola de ejecución para limitar concurrencia

### Prioridad Media - Features
- [ ] Sistema de autenticación completo
- [ ] Guardar historial de ejecuciones en la base de datos
- [ ] Editor con syntax highlighting mejorado
- [ ] Debugger interactivo para GWL+

### Prioridad Baja - UX
- [ ] Temas de editor personalizables
- [ ] Atajos de teclado configurables
- [ ] Exportar proyectos como archivos standalone

## Comandos

```bash
# Desarrollo
npm run dev          # Inicia servidor backend + frontend

# Base de datos
npm run db:push      # Sincronizar esquema con base de datos

# Producción
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
```

## APIs Disponibles

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `GET /api/projects/:id` - Obtener un proyecto
- `POST /api/projects` - Crear proyecto
- `PATCH /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Ejecutor GWL+
- `POST /api/gwl/transpile` - Transpilar código GWL+ a HTML/CSS/JS
  - Body: `{ code: string }`
  - Response: `{ html, css, js, errors }`

- `POST /api/gwl/execute` - Ejecutar código GWL+ en backend
  - Body: `{ code: string, timeout?: number }`
  - Response: `{ stdout, stderr, uiCommands, exitCode, duration, errors }`

## Documentación GWL+

Ver `DOCUMENTACION_GWL+.md` y `MANUAL_COMPLETO_GWL+.txt` para la documentación completa del lenguaje GWL+.

## Estado del Proyecto

✅ **Migración completada**: El proyecto ha sido migrado exitosamente con ejecutor personalizado backend.

⚠️ **Siguiente paso crítico**: Implementar sandboxing real antes de cualquier deployment público.
