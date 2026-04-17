---
description: "Use when creating or modifying React components, views, modals, or page layouts. Covers component structure, Fluent UI usage, and view patterns."
applyTo: "**"
---

# Component & View Patterns

## Component Structure
```jsx
import { useState } from "react"
import { Text } from "@fluentui/react-components"
import { useHook } from "@/hooks/useHook"

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null)
  // ...
  return <div>...</div>
}

export default MyComponent
```

## UI Library
- Use **Fluent UI** (`@fluentui/react-components`) for all UI primitives — buttons, tables, forms, modals (Dialog), alerts (MessageBar), tabs, etc.
- Use `@fluentui/react-icons` for icons
- Use flex layout with gap for consistent spacing
- Use `<Text>` for typography and `tokens` for design token values

## Views / Pages
- Each view lives in `src/views/<Name>/index.jsx`
- Sub-components live in `src/views/<Name>/components/`
- Follow this loading/error pattern:

```jsx
const Page = () => {
  const { data, isLoading, error } = useDataHook()
  if (error) return <MessageBar intent="error">...</MessageBar>
  if (isLoading) return <Spinner />
  return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>...</div>
}
```

## Modals
- Manage modal visibility with local `useState` in the parent component
- Use `<Dialog open={...} onOpenChange={...}>` with `DialogSurface`, `DialogBody`, `DialogTitle`, `DialogContent`, `DialogActions`
- Modal trigger and modal component are siblings (see `FlowActionsButton` pattern)

## Routing
- App uses `HashRouter` with nested routes under a `<Layout>` wrapper
- Use `react-router-dom` hooks: `useParams`, `useNavigate`, `useLocation`
- Route paths are defined in `App.jsx`
