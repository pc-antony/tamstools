---
description: "Use when writing or modifying any source file. Covers project-wide conventions: import ordering, file naming, exports, styling, and path aliases."
applyTo: "**"
---

# Coding Conventions

## File Extensions
- `.jsx` — React components, hooks, stores, and views (anything that imports React or React-based libraries)
- `.js` — Pure utility/logic files with no React dependency (e.g., `chunkArray.js`, `timerange.js`)
- `.tsx` / `.ts` — TypeScript files (currently scoped to `views/OmakasePlayer/`)
- Never mix extensions within the same directory — all siblings should share the same extension

## File Naming
- Components and views: PascalCase (e.g., `EditableField.jsx`, `FlowActionsModal.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useFlows.jsx`, `useApi.jsx`)
- Utilities: camelCase (e.g., `chunkArray.js`, `paginationFetcher.js`)
- Stores: camelCase with `use` prefix and `Store` suffix (e.g., `useAlertsStore.jsx`)

## Import Order
1. React / React hooks
2. Third-party UI libraries (Cloudscape Design)
3. Third-party utilities (react-router-dom, luxon, etc.)
4. Local hooks (`@/hooks/`)
5. Local stores (`@/stores/`)
6. Local components (`@/components/`)
7. Local utilities (`@/utils/`)
8. CSS imports (last)

## Path Aliases
- Use `@/` to reference the `src/` directory (e.g., `import useApi from "@/hooks/useApi"`)

## Exports
- Use `export default` for components, views, and stores
- Use named exports for hooks that expose multiple functions (e.g., `export const useFlows`, `export const useFlow`)

## Styling
- Use Cloudscape Design system components and tokens as the primary styling approach
- Plain CSS files for targeted overrides only — no CSS Modules or styled-components
- Import CSS files last in the import block
- Use inline styles sparingly, only for dynamic/interactive state (e.g., `cursor: "pointer"`)

## General
- Functional components only — no class components
- Destructure props in function parameters
- Use `const` for component definitions with arrow functions
- Use `useState` for local UI state, Zustand for shared app state
