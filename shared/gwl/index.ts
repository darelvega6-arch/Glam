export * from './types';
export * from './lexer';
export * from './parser';
export * from './runtime';
export * from './transpiler';
export * from './executor';
export * from './io-adapter';

export const exampleGWLCode = `# GWL+ - Lenguaje Único de Programación
# Variables y tipos
nombre = "Calculadora GWL+"
numeros = [1, 2, 3, 4, 5]
total = 0

# Función recursiva para factorial
definir factorial(n):
    si n == 0:
        retornar 1
    sino:
        retornar n * factorial(n - 1)
    fin
fin

# Función para sumar array
definir sumar_array(lista):
    suma = 0
    para numero en lista:
        suma = suma + numero
    fin
    retornar suma
fin

# Calcular valores
total = sumar_array(numeros)
fact5 = factorial(5)

# Crear interfaz
ventana = crear_ventana(nombre)
mostrar(titulo(nombre, 1))
mostrar(texto("Suma total: " + str(total)))
mostrar(texto("Factorial de 5: " + str(fact5)))
mostrar(boton("Calcular"))
`;

export const tutorialExamples = {
  basic: `# Tutorial 1: Variables
nombre = "Juan"
edad = 25
activo = verdadero

imprimir(nombre)
imprimir(edad)`,

  functions: `# Tutorial 2: Funciones
definir saludar(nombre):
    retornar "Hola, " + nombre
fin

mensaje = saludar("Mundo")
imprimir(mensaje)`,

  control: `# Tutorial 3: Control de Flujo
edad = 18

si edad >= 18:
    imprimir("Mayor de edad")
sino:
    imprimir("Menor de edad")
fin

# Bucle
contador = 0
mientras contador < 5:
    imprimir(contador)
    contador = contador + 1
fin`,

  complete: `# Tutorial 4: App Completa
items = ["Item 1", "Item 2", "Item 3"]

definir contar(lista):
    cuenta = 0
    para item en lista:
        cuenta = cuenta + 1
    fin
    retornar cuenta
fin

cantidad = contar(items)

mostrar(titulo("Mi Aplicación", 1))
mostrar(texto("Total items: " + str(cantidad)))
mostrar(boton("Actualizar"))`,
};
