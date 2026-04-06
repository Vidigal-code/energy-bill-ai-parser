# Frontend Architecture (Next.js + FSD)

The client-side domain of the **Energy Bill AI Parser** heavily relies on **Next.js (App Router)** properly supercharged by React v18 features and concurrent loading patterns.

## Feature-Sliced Design (FSD) Methodology
The directory tree mirrors the modern **Feature-Sliced Design**, breaking down UI components vertically from generic utilities up to highly coupled business domains.

1. **`app/`**: Rotational entrypoint. Manages Global layouts, strict Not Found fallbacks, default roots, and context Wrappers (`ReduxProvider`, `QueryProvider`).
2. **`pages/`**: Batches route-centric modules aligned to the FSD patterns.
3. **`widgets/`**: Standalone chunks combining several entities. For example, a heavy "Header Navigation Bar" or an integrated Data Table mixing pagination, sorting, and user fetches perfectly.
4. **`features/`**: User-driven functional segments. Inside houses things like "Logging in procedure", "Invoice Upload Flow", or "Language Translation triggers", grouping related UI atoms and specific local APIs constraints.
5. **`entities/`**: Core detached models. e.g. A naive UI `UserCard` visual block or the raw Typescript Definition depicting the `Invoice` schema structure.
6. **`shared/`**: UI logic, generic Tailwind base tokens, helper functions, and abstractions completely uncoupled from any business requirement. Built for maximum reusability.

## Tailwind CSS and App Aesthetics
We adopted **Tailwind CSS** as our primary stylistic engine. It guarantees 100% mobile-first scaling alongside precompiled Dark Mode native triggers running flawlessly.
