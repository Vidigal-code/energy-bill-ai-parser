# Gerenciamento de Estado

O frontend depende de duas arquiteturas assíncronas principais atuando em sincronia: **Redux Toolkit** e **React Query**.

## Redux Toolkit (Estado Global Síncrono)
Utilizado para armazenar fatias de contexto estritas ao longo da navegação, ou seja, variáveis imutáveis transientes de front.
- **`authSlice`**: Fica responsável por reter os dados do usuário atual em memória, flag `isAuthenticated` auxiliando o roteamento client-side a não exibir flashes indevidos.
- **`themeSlice`**: Determina e guarda estado para Light/Dark mode.

## React Query (Estado Assíncrono / Server State)
Para qualquer persistência/comunicação de Backend assíncrona (Buscar usuários, listar faturas, ler métricas), utiliza-se o poderoso `@tanstack/react-query`.
- Lida com Retries (tentativas) perfeitamente.
- Faz *Cacheamento* automático evitando requisições desnecessárias.
- Fornece hooks transparentes e diretos como `useQuery` e `useMutation` com estados emulados em variáveis reativas (`isLoading`, `isError`, `data`).

## Manipulação Estrita de Cookies
Como nosso backend impõe a maior segurança moderna (via JWT em Http-Only Cookies), a camada de Estado do cliente está proibida de acessar as chaves vitais em memória. Se a sessão ou cookie expirar e a chamada de backend falhar (Interceptador com código 401), automaticamente o frontend embala uma ação de `logout`, e atira o usuário para o `/login` re-limpando o estado da sessão local.
