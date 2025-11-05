# ⚠️ Seguridad del Ejecutor GWL+ - IMPORTANTE

## ⛔ LIMITACIÓN CRÍTICA

**El ejecutor GWL+ NO tiene sandboxing real.** El código se ejecuta de forma síncrona en el mismo proceso Node.js del servidor.

**Riesgo:** Código GWL+ malicioso o con bugs puede causar **denial-of-service** al servidor, bloqueando todos los requests.

**NO USAR EN PRODUCCIÓN** sin implementar sandboxing real primero.

## Estado Actual

### ⚠️ Limitación Principal

**Ejecución in-process**: A pesar de tener un sistema de timeout basado en Promises, la ejecución es síncrona y bloqueante. Un bucle infinito con operaciones pesadas puede colgar el servidor hasta que alcance los límites de recursos del sistema operativo.

### ✅ Límites implementados (mitigación parcial):
   - Recursión máxima: 100 niveles
   - Iteraciones totales: 100,000
   - Tamaño de salida: 1MB
   - Timeout de ejecución: configurable (100ms - 30s)
   - Tamaño máximo de código: 100KB

3. **Qué falta**:
   - Aislamiento de proceso real (Workers o procesos separados)
   - Límites de memoria por ejecución
   - Límites de CPU por ejecución
   - Sandbox de sistema de archivos
   - Restricción de acceso a red

## Recomendaciones

### ⚠️ Solo para Desarrollo Local
- Los límites actuales son adecuados SOLO para desarrollo local en entorno controlado
- **NUNCA exponer este ejecutor a internet público**
- Usar solo con código confiable durante desarrollo

### ❌ NO Apto para Producción
Este ejecutor **NO DEBE USARSE EN PRODUCCIÓN**. Para producción se REQUIERE:

1. **Implementar sandboxing real** usando una de estas opciones:
   - Worker Threads de Node.js con resourceLimits
   - Procesos separados con spawn/fork
   - Contenedores Docker con límites de recursos
   - VM sandbox libraries como vm2 o isolated-vm

2. **Agregar autenticación y rate limiting**
3. **Monitoreo de recursos** del servidor
4. **Logs de auditoría** de todas las ejecuciones

## Mejoras Futuras

- [ ] Implementar Worker Threads con resource limits
- [ ] Agregar sandbox de sistema de archivos
- [ ] Implementar cola de ejecución para limitar concurrencia
- [ ] Agregar métricas de uso de recursos
- [ ] Implementar sistema de permisos por usuario
