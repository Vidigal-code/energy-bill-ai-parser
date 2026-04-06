# Gestión del Estado

Nuestro frontend gestiona el flujo de datos sincronizando magistralmente dos poderosos ecosistemas de estado: **Redux Toolkit** y **React Query**.

## Redux Toolkit (Estado Global Sincrónico)
Dedicado a los fragmentos efímeros estáticos en memoria; cosas que solo le competen a la visual del cliente.
- **`authSlice`**: Rastrean en memoria la presencia lógica de un usuario vivo con bandera `isAuthenticated`, evitando rutas destellantes e inyecciones raras.
- **`themeSlice`**: Rastrea el pulso guardando la decisión sobre si usar el Tema Claro u Oscuro.

## React Query (Estado Asincrónico / Estado del Servidor)
Para el gran grueso de comunicación Backend (Ingresar faturas, parsear estadísticas), acudimos a puramente `@tanstack/react-query`.
- Asume por cuenta propia los Retries de caídas de baja fidelidad en la web.
- Cachea implacablemente consultas para evitar golpear a las APIs por duplicado reduciendo drásticamente latencias.
- Provee un manantial de hooks limpios (`useQuery`, `useMutation`) informando siempre de `isLoading`, `isError`, etc.

## Estrictas Reglas sobre Cookies en Cliente
Ya que las llaves primarias viajan por debajo de la red bajo etiquetas de JWE vía Http-only dictadas por NestJS, la app React es absolutamente ciega respecto a manipular cookies directas. Si salta un 401 Unauthorized desde cualquier Axios intersector, de inmediato el app dispara un borrado global del redux session y aterriza al infractor de vuelta al entorno aislado `/login`.
