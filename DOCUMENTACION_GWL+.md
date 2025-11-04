
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
10. [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 INTRODUCCIÓN

**GWL+** (GlaWebLang Plus) es un lenguaje de programación moderno diseñado para ser:
- **Simple**: Sintaxis inspirada en Python
- **Poderoso**: Capacidad para crear interfaces de usuario
- **Intuitivo**: Fácil de aprender para principiantes
- **Único**: Sintaxis completamente original

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

## 🚀 PRÓXIMAS CARACTERÍSTICAS

En futuras versiones de GWL+ se agregarán:
- Objetos y clases
- Manejo de archivos
- Eventos de UI interactivos
- Importación de módulos
- Manejo de excepciones
- Funciones asíncronas

---

**© 2024 GlaWebLang Plus - Documentación v1.0**
