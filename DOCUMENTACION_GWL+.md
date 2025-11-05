
# 📚 DOCUMENTACIÓN COMPLETA GWL+
## Lenguaje de Programación GlaWebLang Plus

---

## 📖 ÍNDICE

1. [Introducción](#introducción)
2. [Sintaxis Básica](#sintaxis-básica)
3. [Palabras Clave](#palabras-clave)
4. [Tipos de Datos](#tipos-de-datos)
5. [Variables](#variables)
6. [Operadores](#operadores)
7. [Estructuras de Control](#estructuras-de-control)
8. [Funciones](#funciones)
9. [Funciones Nativas](#funciones-nativas)
10. [Funciones 3D - Motor de Videojuegos](#funciones-3d---motor-de-videojuegos)
11. [Sistema de Eventos 3D](#sistema-de-eventos-3d)
12. [Ejemplos de Videojuegos 3D](#ejemplos-de-videojuegos-3d)
13. [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 INTRODUCCIÓN

**GWL+** (GlaWebLang Plus) es un lenguaje de programación moderno diseñado para ser:
- **Simple**: Sintaxis inspirada en Python
- **Poderoso**: Capacidad para crear videojuegos 3D y automatizar tareas
- **Intuitivo**: Fácil de aprender para principiantes
- **Único**: Sintaxis completamente original
- **Versátil**: Desde scripts de automatización hasta juegos 3D completos

### 🎮 Motor de Videojuegos 3D
GWL+ incluye un motor 3D completo tipo Roblox Studio que permite crear juegos tridimensionales con bloques programables. Cada objeto en el mundo puede tener scripts GWL+ que controlan su comportamiento, física, colisiones y más.

---

## 📝 SINTAXIS BÁSICA

### Comentarios
```gwl
# Esto es un comentario de una línea
# Los comentarios empiezan con el símbolo #
```

### Bloques de Código
Los bloques se delimitan con `:` y terminan con `fin`

```gwl
si condicion:
    # código aquí
fin
```

---

## 🔤 PALABRAS CLAVE

| Palabra Clave | Significado | Uso |
|---------------|-------------|-----|
| `definir` | Definir función | `definir nombre_funcion(parametros):` |
| `fin` | Terminar bloque | Cierra estructuras de control y funciones |
| `si` | Condicional if | `si condicion:` |
| `sino` | Else | `sino:` |
| `para` | Bucle for | `para variable en coleccion:` |
| `en` | Operador in | Usado en bucles `para` |
| `mientras` | Bucle while | `mientras condicion:` |
| `retornar` | Return | Devuelve valor de función |
| `verdadero` | Boolean true | Valor booleano verdadero |
| `falso` | Boolean false | Valor booleano falso |
| `nulo` | Null | Valor nulo/vacío |
| `y` | AND lógico | Operador lógico AND |
| `o` | OR lógico | Operador lógico OR |

---

## 📊 TIPOS DE DATOS

### 1. **Números** (`number`)
```gwl
edad = 25
precio = 19.99
negativo = -10
```

### 2. **Cadenas** (`string`)
```gwl
nombre = "Juan"
apellido = 'Pérez'
mensaje = "Hola Mundo"
```

### 3. **Booleanos** (`boolean`)
```gwl
activo = verdadero
inactivo = falso
```

### 4. **Nulo** (`null`)
```gwl
valor_vacio = nulo
```

### 5. **Arrays** (`array`)
```gwl
numeros = [1, 2, 3, 4, 5]
nombres = ["Ana", "Luis", "María"]
mixto = [1, "texto", verdadero]
```

---

## 💾 VARIABLES

### Declaración
Las variables se declaran con el operador `=`

```gwl
# Variable numérica
contador = 0

# Variable de texto
nombre = "GWL+"

# Variable booleana
activo = verdadero

# Variable array
lista = [1, 2, 3]
```

### Reasignación
```gwl
x = 10
x = x + 5  # x ahora vale 15
```

---

## ➗ OPERADORES

### Operadores Aritméticos
| Operador | Significado | Ejemplo | Resultado |
|----------|-------------|---------|-----------|
| `+` | Suma | `5 + 3` | `8` |
| `-` | Resta | `10 - 4` | `6` |
| `*` | Multiplicación | `6 * 7` | `42` |
| `/` | División | `20 / 4` | `5` |

### Operadores de Comparación
| Operador | Significado | Ejemplo |
|----------|-------------|---------|
| `==` | Igual a | `x == 5` |
| `!=` | Diferente de | `x != 0` |
| `<` | Menor que | `x < 10` |
| `>` | Mayor que | `x > 5` |
| `<=` | Menor o igual | `x <= 8` |
| `>=` | Mayor o igual | `x >= 3` |

### Operadores Lógicos
| Operador | Significado | Ejemplo |
|----------|-------------|---------|
| `y` | AND lógico | `x > 0 y x < 10` |
| `o` | OR lógico | `x == 0 o x == 1` |

---

## 🔀 ESTRUCTURAS DE CONTROL

### Condicional SI (IF)
```gwl
si edad >= 18:
    imprimir("Mayor de edad")
sino:
    imprimir("Menor de edad")
fin
```

### Bucle PARA (FOR)
```gwl
numeros = [1, 2, 3, 4, 5]

para numero en numeros:
    imprimir(numero)
fin
```

### Bucle MIENTRAS (WHILE)
```gwl
contador = 0

mientras contador < 5:
    imprimir(contador)
    contador = contador + 1
fin
```

---

## 🔧 FUNCIONES

### Definir Función
```gwl
definir saludar(nombre):
    retornar "Hola, " + nombre
fin

mensaje = saludar("María")
imprimir(mensaje)  # Imprime: Hola, María
```

### Función con Múltiples Parámetros
```gwl
definir sumar(a, b):
    retornar a + b
fin

resultado = sumar(10, 5)  # resultado = 15
```

### Función Recursiva
```gwl
definir factorial(n):
    si n == 0:
        retornar 1
    sino:
        retornar n * factorial(n - 1)
    fin
fin

fact5 = factorial(5)  # fact5 = 120
```

---

## 🎨 FUNCIONES NATIVAS

### 1. **mostrar(elemento)**
Muestra un elemento de UI en la pantalla

```gwl
mostrar(titulo("Mi App", 1))
mostrar(texto("Bienvenido"))
```

### 2. **imprimir(valor)**
Imprime en consola

```gwl
imprimir("Hola Mundo")
imprimir(42)
```

### 3. **str(valor)**
Convierte cualquier valor a cadena

```gwl
numero = 42
texto = str(numero)  # "42"
```

### 4. **crear_ventana(titulo)**
Crea una ventana de UI

```gwl
ventana = crear_ventana("Mi Aplicación")
```

### 5. **titulo(texto, tamano)**
Crea un encabezado
- `tamano`: 1 (más grande) a 6 (más pequeño)

```gwl
h1 = titulo("Título Principal", 1)
h2 = titulo("Subtítulo", 2)
```

### 6. **texto(contenido)**
Crea un párrafo de texto

```gwl
parrafo = texto("Este es un párrafo")
mostrar(parrafo)
```

### 7. **boton(etiqueta)**
Crea un botón

```gwl
btn = boton("Haz clic aquí")
mostrar(btn)
```

### 8. **entrada(placeholder)**
Crea un campo de entrada

```gwl
input = entrada("Escribe tu nombre")
mostrar(input)
```

---

## 🎮 FUNCIONES 3D - MOTOR DE VIDEOJUEGOS

GWL+ incluye un motor 3D completo para crear juegos tipo Roblox. Estas funciones controlan objetos, movimiento, física y más.

### 📦 CREACIÓN DE OBJETOS 3D

#### **crear_cubo(nombre, x, y, z)**
Crea un cubo en la escena 3D
```gwl
cubo = crear_cubo("MiCubo", 0, 0, 0)
```

#### **crear_esfera(nombre, x, y, z, radio)**
Crea una esfera en la escena
```gwl
pelota = crear_esfera("Pelota", 0, 5, 0, 1)
```

#### **crear_cilindro(nombre, x, y, z, radio, altura)**
Crea un cilindro
```gwl
columna = crear_cilindro("Columna", 0, 0, 0, 0.5, 3)
```

#### **crear_plano(nombre, x, y, z, ancho, largo)**
Crea un plano (ideal para suelos)
```gwl
suelo = crear_plano("Suelo", 0, -1, 0, 20, 20)
```

### 🎨 PROPIEDADES VISUALES

#### **cambiar_color(objeto, r, g, b)**
Cambia el color del objeto (RGB 0-255)
```gwl
cambiar_color(cubo, 255, 0, 0)  # Rojo
cambiar_color(pelota, 0, 255, 0)  # Verde
```

#### **cambiar_material(objeto, tipo)**
Cambia el material del objeto
- Tipos: "basico", "metal", "brillante", "mate"
```gwl
cambiar_material(cubo, "metal")
```

#### **mostrar_objeto(objeto)**
Hace visible un objeto
```gwl
mostrar_objeto(cubo)
```

#### **ocultar_objeto(objeto)**
Hace invisible un objeto
```gwl
ocultar_objeto(cubo)
```

### 🚀 TRANSFORMACIONES

#### **mover(objeto, x, y, z)**
Mueve el objeto a una posición absoluta
```gwl
mover(cubo, 5, 0, 0)
```

#### **mover_relativo(objeto, dx, dy, dz)**
Mueve el objeto de forma relativa
```gwl
mover_relativo(pelota, 0, 0.1, 0)  # Sube 0.1 unidades
```

#### **rotar(objeto, x, y, z)**
Rota el objeto (ángulos en grados)
```gwl
rotar(cubo, 0, 45, 0)  # Rota 45° en Y
```

#### **escalar(objeto, sx, sy, sz)**
Cambia el tamaño del objeto
```gwl
escalar(cubo, 2, 1, 1)  # Doble ancho
```

#### **obtener_posicion(objeto)**
Obtiene la posición actual [x, y, z]
```gwl
pos = obtener_posicion(cubo)
x = pos[0]
y = pos[1]
z = pos[2]
```

### ⚡ FÍSICA

#### **aplicar_fisica(objeto)**
Habilita física (gravedad, colisiones)
```gwl
aplicar_fisica(pelota)
```

#### **aplicar_fuerza(objeto, fx, fy, fz)**
Aplica una fuerza al objeto
```gwl
aplicar_fuerza(pelota, 0, 100, 0)  # Impulso hacia arriba
```

#### **hacer_estatico(objeto)**
Hace que el objeto no se mueva (pero colisiona)
```gwl
hacer_estatico(suelo)
```

#### **detectar_colision(objeto1, objeto2)**
Verifica si dos objetos colisionan
```gwl
si detectar_colision(pelota, suelo):
    imprimir("¡La pelota tocó el suelo!")
fin
```

### 🎯 CONTROLES Y ENTRADA

#### **tecla_presionada(tecla)**
Verifica si una tecla está presionada
- Teclas: "w", "a", "s", "d", "espacio", "flecha_arriba", etc.
```gwl
si tecla_presionada("w"):
    mover_relativo(jugador, 0, 0, -0.1)
fin
```

#### **raton_click()**
Verifica si se hizo clic con el ratón
```gwl
si raton_click():
    imprimir("¡Click!")
fin
```

#### **obtener_posicion_raton()**
Obtiene posición del ratón [x, y]
```gwl
pos_raton = obtener_posicion_raton()
```

### 🎵 AUDIO

#### **reproducir_sonido(nombre_archivo)**
Reproduce un sonido
```gwl
reproducir_sonido("explosion.mp3")
```

#### **reproducir_musica(nombre_archivo, loop)**
Reproduce música de fondo
```gwl
reproducir_musica("tema_principal.mp3", verdadero)
```

### 🌍 MUNDO Y CÁMARA

#### **cambiar_camara(x, y, z)**
Posiciona la cámara
```gwl
cambiar_camara(0, 10, 10)
```

#### **mirar_hacia(objeto)**
Hace que la cámara mire hacia un objeto
```gwl
mirar_hacia(jugador)
```

#### **cambiar_fondo(r, g, b)**
Cambia el color de fondo del mundo
```gwl
cambiar_fondo(135, 206, 235)  # Azul cielo
```

---

## ⚙️ SISTEMA DE EVENTOS 3D

Los objetos en GWL+ pueden reaccionar a eventos del juego. Estos eventos se ejecutan automáticamente.

### **alIniciar()**
Se ejecuta una vez cuando el objeto aparece
```gwl
definir alIniciar():
    imprimir("¡Objeto creado!")
    cambiar_color(este, 255, 0, 0)
fin
```

### **alActualizar()**
Se ejecuta cada frame (60 veces por segundo)
```gwl
definir alActualizar():
    # Rotar constantemente
    rotar_relativo(este, 0, 1, 0)
fin
```

### **alColisionar(otro_objeto)**
Se ejecuta cuando colisiona con otro objeto
```gwl
definir alColisionar(otro):
    imprimir("¡Colisión con " + otro)
    reproducir_sonido("golpe.wav")
fin
```

### **alClickear()**
Se ejecuta cuando se hace clic en el objeto
```gwl
definir alClickear():
    cambiar_color(este, 0, 255, 0)
    aplicar_fuerza(este, 0, 50, 0)
fin
```

### **este**
Variable especial que referencia al objeto actual
```gwl
definir alActualizar():
    pos = obtener_posicion(este)
    si pos[1] < 0:
        # Si cae del mundo, volver arriba
        mover(este, 0, 10, 0)
    fin
fin
```

---

## 🎮 EJEMPLOS DE VIDEOJUEGOS 3D

### Ejemplo 1: Cubo Saltarín
```gwl
# Crear jugador
jugador = crear_cubo("Jugador", 0, 1, 0)
cambiar_color(jugador, 0, 100, 255)
aplicar_fisica(jugador)

# Crear suelo
suelo = crear_plano("Suelo", 0, 0, 0, 20, 20)
hacer_estatico(suelo)
cambiar_color(suelo, 100, 200, 100)

# Script del jugador
definir alActualizar():
    # Movimiento
    si tecla_presionada("a"):
        mover_relativo(este, -0.1, 0, 0)
    fin
    si tecla_presionada("d"):
        mover_relativo(este, 0.1, 0, 0)
    fin
    
    # Saltar
    si tecla_presionada("espacio"):
        aplicar_fuerza(este, 0, 200, 0)
    fin
fin
```

### Ejemplo 2: Recolector de Monedas
```gwl
# Crear jugador
jugador = crear_esfera("Jugador", 0, 1, 0, 0.5)
cambiar_color(jugador, 255, 200, 0)

# Crear monedas
puntos = 0
para i en [1, 2, 3, 4, 5]:
    x = i * 2
    moneda = crear_cilindro("Moneda" + str(i), x, 1, 0, 0.3, 0.1)
    cambiar_color(moneda, 255, 215, 0)
fin

# Sistema de recolección
definir alActualizar():
    # Mover jugador
    si tecla_presionada("flecha_izq"):
        mover_relativo(jugador, -0.1, 0, 0)
    fin
    si tecla_presionada("flecha_der"):
        mover_relativo(jugador, 0.1, 0, 0)
    fin
fin

definir alColisionar(otro):
    si otro == "Moneda":
        puntos = puntos + 1
        ocultar_objeto(otro)
        reproducir_sonido("moneda.wav")
        imprimir("¡Puntos: " + str(puntos))
    fin
fin
```

### Ejemplo 3: Torre de Defensa Simple
```gwl
# Crear torre
torre = crear_cilindro("Torre", 0, 1, 0, 1, 2)
cambiar_color(torre, 100, 100, 100)
hacer_estatico(torre)

# Crear enemigos
enemigos = []
contador_spawn = 0

definir crear_enemigo():
    x = 10
    z = 0
    enemigo = crear_cubo("Enemigo", x, 0.5, z)
    cambiar_color(enemigo, 255, 0, 0)
    aplicar_fisica(enemigo)
    retornar enemigo
fin

definir alActualizar():
    # Spawner de enemigos
    contador_spawn = contador_spawn + 1
    si contador_spawn >= 60:  # Cada segundo
        nuevo = crear_enemigo()
        contador_spawn = 0
    fin
    
    # Mover enemigos hacia torre
    para enemigo en enemigos:
        pos_enemigo = obtener_posicion(enemigo)
        mover_relativo(enemigo, -0.05, 0, 0)
        
        # Verificar si llegó a la torre
        si detectar_colision(enemigo, torre):
            imprimir("¡Game Over!")
        fin
    fin
fin

definir alClickear():
    # Disparar al enemigo clickeado
    ocultar_objeto(este)
    reproducir_sonido("explosion.wav")
fin
```

---

## 💡 EJEMPLOS COMPLETOS

### Ejemplo 1: Calculadora Simple
```gwl
# Variables
titulo_app = "Calculadora GWL+"
num1 = 10
num2 = 5

# Operaciones
suma = num1 + num2
resta = num1 - num2
multiplicacion = num1 * num2
division = num1 / num2

# Mostrar resultados
mostrar(titulo(titulo_app, 1))
mostrar(texto("Suma: " + str(suma)))
mostrar(texto("Resta: " + str(resta)))
mostrar(texto("Multiplicación: " + str(multiplicacion)))
mostrar(texto("División: " + str(division)))
```

### Ejemplo 2: Factorial
```gwl
# Función factorial
definir factorial(n):
    si n == 0:
        retornar 1
    sino:
        retornar n * factorial(n - 1)
    fin
fin

# Calcular factorial de 5
resultado = factorial(5)

# Mostrar
mostrar(titulo("Factorial", 1))
mostrar(texto("Factorial de 5 = " + str(resultado)))
```

### Ejemplo 3: Lista de Tareas
```gwl
# Variables
titulo_app = "Lista de Tareas"
tareas = ["Estudiar GWL+", "Hacer ejercicio", "Leer un libro"]

# Función para contar tareas
definir contar_tareas(lista):
    contador = 0
    para tarea en lista:
        contador = contador + 1
    fin
    retornar contador
fin

# Mostrar UI
total = contar_tareas(tareas)
mostrar(titulo(titulo_app, 1))
mostrar(texto("Total de tareas: " + str(total)))

para tarea en tareas:
    mostrar(texto("✓ " + tarea))
fin

mostrar(boton("Agregar Tarea"))
```

### Ejemplo 4: Validación de Edad
```gwl
# Variables
nombre = "Ana"
edad = 20

# Validación
si edad >= 18:
    mensaje = nombre + " es mayor de edad"
    puede_votar = verdadero
sino:
    mensaje = nombre + " es menor de edad"
    puede_votar = falso
fin

# Interfaz
mostrar(titulo("Sistema de Validación", 1))
mostrar(texto(mensaje))

si puede_votar:
    mostrar(boton("Registrar para votar"))
fin
```

---

## 📐 REGLAS DE SINTAXIS

1. **Indentación**: No es obligatoria pero se recomienda para legibilidad
2. **Punto y coma**: NO se usa
3. **Paréntesis**: Obligatorios en funciones `nombre(params)`
4. **Dos puntos**: Obligatorios al iniciar bloques `si condicion:`
5. **fin**: Obligatorio para cerrar bloques
6. **Comentarios**: Solo con `#`, no hay comentarios multi-línea
7. **Strings**: Se pueden usar `"` o `'`
8. **Case sensitive**: Las variables distinguen mayúsculas/minúsculas

---

## ⚠️ ERRORES COMUNES

### Error 1: Olvidar `fin`
```gwl
# ❌ INCORRECTO
si x > 0:
    imprimir(x)
# Falta fin

# ✅ CORRECTO
si x > 0:
    imprimir(x)
fin
```

### Error 2: División por cero
```gwl
# ❌ Error
resultado = 10 / 0  # Error: División por cero

# ✅ Correcto
si divisor != 0:
    resultado = 10 / divisor
fin
```

### Error 3: Variable no definida
```gwl
# ❌ Error
imprimir(variable_inexistente)  # Error: Variable no definida

# ✅ Correcto
variable = 10
imprimir(variable)
```

---

## 🎓 CONVENCIONES DE CÓDIGO

1. **Nombres de variables**: usar minúsculas con guiones bajos
   - ✅ `nombre_usuario`, `total_items`
   - ❌ `NombreUsuario`, `totalItems`

2. **Nombres de funciones**: usar verbos descriptivos
   - ✅ `calcular_total`, `obtener_nombre`
   - ❌ `calculo`, `nombre`

3. **Comentarios**: explicar el "por qué", no el "qué"
   ```gwl
   # ✅ Bueno
   # Convertimos a string para concatenar con mensaje
   texto = str(numero)
   
   # ❌ Malo
   # Convierte numero a string
   texto = str(numero)
   ```

---

## 🚀 CARACTERÍSTICAS ACTUALES

### ✅ Implementado
- ✅ Motor 3D completo con Three.js
- ✅ Objetos 3D (cubos, esferas, cilindros, planos)
- ✅ Sistema de física y colisiones
- ✅ Eventos de ciclo de vida (alIniciar, alActualizar, alColisionar, alClickear)
- ✅ Controles de teclado y ratón
- ✅ Sistema de audio (sonidos y música)
- ✅ Transformaciones 3D (mover, rotar, escalar)
- ✅ Propiedades visuales (color, material, visibilidad)
- ✅ Automatización tipo Python

### 🔮 PRÓXIMAS CARACTERÍSTICAS

En futuras versiones se agregarán:
- Multijugador en tiempo real
- Importación de modelos 3D personalizados
- Sistema de partículas
- Iluminación avanzada y sombras
- Terrenos procedurales
- Sistema de inventario
- Cinemáticas y animaciones
- Exportar juegos como ejecutables

---

## 📚 RECURSOS DE APRENDIZAJE

### Tutoriales Interactivos
1. **Intro a GWL+**: Variables, funciones y estructuras de control
2. **Primeros Pasos 3D**: Crear tu primer mundo 3D
3. **Física y Movimiento**: Hacer que los objetos se muevan
4. **Crear un Juego**: Tutorial completo paso a paso

### Comunidad
- Discord: discord.gg/gwlplus
- Galería de Juegos: gwlplus.com/galeria
- Documentación Completa: gwlplus.com/docs

---

**© 2024 GlaWebLang Plus - Motor de Videojuegos 3D v2.0**
