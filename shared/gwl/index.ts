export * from './types';
export * from './lexer';
export * from './parser';
export * from './runtime';
export * from './transpiler';
export * from './executor';
export * from './io-adapter';

export const exampleGWLCode = `# GWL+ Motor 3D - Mi Primer Mundo
# Crear el suelo
suelo = crear_plano("Suelo", 0, 0, 0, 20, 20)
cambiar_color(suelo, 50, 150, 50)
hacer_estatico(suelo)

# Crear jugador (cubo azul)
jugador = crear_cubo("Jugador", 0, 1, 0)
cambiar_color(jugador, 50, 100, 255)
aplicar_fisica(jugador)

# Crear obstáculos
obstaculo1 = crear_cubo("Obstaculo1", 3, 0.5, 0)
cambiar_color(obstaculo1, 255, 0, 0)
hacer_estatico(obstaculo1)

obstaculo2 = crear_cilindro("Obstaculo2", -3, 1, 2, 0.5, 2)
cambiar_color(obstaculo2, 255, 165, 0)
hacer_estatico(obstaculo2)

# Crear meta (esfera dorada)
meta = crear_esfera("Meta", 0, 1, -5, 0.5)
cambiar_color(meta, 255, 215, 0)

# Plataformas flotantes
plataforma1 = crear_cubo("Plataforma1", 5, 2, -3)
escalar(plataforma1, 2, 0.2, 2)
cambiar_color(plataforma1, 100, 100, 200)
hacer_estatico(plataforma1)

# Mensaje de bienvenida
imprimir("¡Mundo 3D creado!")
imprimir("Usa el ratón para explorar")
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
