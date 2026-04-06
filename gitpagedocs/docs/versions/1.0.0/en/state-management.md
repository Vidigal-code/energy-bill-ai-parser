# State Management

The frontend orchestrates data by wielding two main asynchronous state layers running in perfect sync: **Redux Toolkit** and **React Query**.

## Redux Toolkit (Synchronous Global State)
Reserved strictly for transient client-side context (flags, tokens, superficial layout shifts).
- **`authSlice`**: Takes hold of current memory credentials, preserving the `isAuthenticated` payload reducing flickering while routing securely on the frontend.
- **`themeSlice`**: Persistently tracks whether the user expects a Dark or Light mode UI.

## React Query (Asynchronous / Server State)
When it deals with backend communications (Fetching files, invoices, tables), `@tanstack/react-query` takes over.
- Deals natively with network Retries with no friction.
- Caches aggressively saving redundant HTTP chatter.
- Surrenders highly predictive hooks like `useQuery` or `useMutation` armed with states such as `isLoading`, `isError`, and `data`.

## Strict Client-Side Cookies Handling
Since the Node.js boundary forces strong, untamperable Http-Only JWE secure Cookies, the browser state layers are completely unaware of raw tokens. If a React Query fails yielding an HTTP 401 Unauthorized Interceptor error, the application automatically dispatches a universal `logout` trigger flushing local Redux state and redirecting instantly to `/login`.
