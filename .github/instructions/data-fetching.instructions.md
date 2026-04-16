---
description: "Use when creating or modifying API hooks, data fetching, SWR queries, mutations, Zustand stores, or pagination logic."
applyTo: "**"
---

# API & Data Fetching Patterns

## API Layer
- All HTTP requests go through the `useApi` hook which handles auth (bearer token / OAuth2 client credentials)
- `useApi()` returns `{ endpoint, get, put, del }`
- Always use `useApi` — never call `fetch` directly

## Query Hooks (SWR)
Use SWR for all read operations. Follow this pattern:

```jsx
import useSWR from "swr"
import { useApi } from "@/hooks/useApi"

export const useMyData = (id) => {
  const { endpoint, get } = useApi()
  const { data, mutate, isLoading, isValidating, error } = useSWR(
    endpoint ? `${endpoint}/path/${id}` : null,
    get
  )
  return { data, mutate, isLoading, isValidating, error }
}
```

- Gate the SWR key on `endpoint` being truthy (pass `null` key to disable fetching)
- Return `{ data, mutate, isLoading, isValidating, error }` from query hooks

## Mutation Hooks
For write operations, use `useSWRMutation`:

```jsx
import useSWRMutation from "swr/mutation"

export const useUpdate = () => {
  const { endpoint, put } = useApi()
  const { trigger, isMutating } = useSWRMutation(key, putFn)
  return { trigger, isMutating }
}
```

- Return `{ trigger, isMutating }` (or `{ update, isUpdating }`, `{ del, isDeleting }`)

## Pagination
- Use `paginationFetcher` from `@/utils/paginationFetcher` for paginated TAMS API responses
- It follows HTTP `Link` headers and accumulates all pages
- Pass it as the SWR fetcher for list endpoints

## Zustand Stores
```jsx
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useMyStore = create(persist(
  (set, get) => ({
    // state
    // actions
  }),
  { name: "tamstool-storename" }
))

export default useMyStore
```

- Use `persist` middleware when state should survive page reloads
- Use selectors when consuming: `const value = useMyStore((s) => s.value)`
- Keep stores focused — one store per concern (alerts, preferences, store management)
