# Arquitectura del Frontend (Next.js + FSD)

La capa frontend del proyecto **Energy Bill AI Parser** reside sobre la infraestructura robusta proporcionada por **Next.js (App Router)** bajo el ala de React v18 y sus rutinas de renderizado del lado servidor.

## Metodología FSD (Feature-Sliced Design)
La organización estructural responde a las mejores prácticas de la disciplina **Feature-Sliced Design**. Ésta segrega la base desde los eslabones simples hasta la lógica masivamente acoplada.

1. **`app/`**: Puerta de entrada. Acuña los `Layouts` maestros, `Providers` y reglas de jerarquía primarias como `ReduxProvider` o `QueryProvider`.
2. **`pages/`**: Conjunto enrutado unificando piezas masivas FSD donde habitan los paneles terminados.
3. **`widgets/`**: Combinaciones de `features` y `entities`. Imagínese un bloque enorme autogestionado como un Dashboard entero o la Tabla de Paginación cargando recursos.
4. **`features/`**: Acciones delimitadas del cliente. Es aquí donde "Iniciar Sesión", "Subir un recibo PDF" o "Cambiar Tema Oscuro/Claro" son creados modularmente, resguardando tanto hooks y llamados APIs para ese evento particular.
5. **`entities/`**: Modelos planos con casi nula gestión asíncrona. Ej, una UI Card para Invoices.
6. **`shared/`**: El catálogo universal: botones, inputs base, bibliotecas externas, iconografía Tailwind unificada y Helpers. Toda la capa de reutilización garantizada.

## Tailwind CSS y Control de Apariencias
Navegamos toda la estética sobre las utilidades atomizadas de **Tailwind CSS**. Abarca de manera impecable todo desde ajustes responsivos basados en "Mobile-first" hasta el clásico soporte Dark/Light mode ininterrumpido.
