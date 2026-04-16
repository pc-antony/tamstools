---
description: "Use when creating or modifying React components, views, modals, or page layouts. Covers component structure, Cloudscape usage, and view patterns."
applyTo: "**"
---

# Component & View Patterns

## Component Structure
```jsx
import { useState } from "react"
import { Box } from "@cloudscape-design/components"
import { useHook } from "@/hooks/useHook"

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null)
  // ...
  return <Box>...</Box>
}

export default MyComponent
```

## UI Library
- Use **Cloudscape Design** (`@cloudscape-design/components`) for all UI primitives — buttons, tables, forms, modals, alerts, tabs, etc.
- Wrap page content in `<SpaceBetween size="l">` for consistent spacing
- Use `<Container header={<Header>}>` for content sections

## Views / Pages
- Each view lives in `src/views/<Name>/index.jsx`
- Sub-components live in `src/views/<Name>/components/`
- Follow this loading/error pattern:

```jsx
const Page = () => {
  const { data, isLoading, error } = useDataHook()
  if (error) return <Alert type="error">...</Alert>
  if (isLoading) return <Spinner />
  return <SpaceBetween size="l">...</SpaceBetween>
}
```

## Modals
- Manage modal visibility with local `useState` in the parent component
- Pass `visible` and `onDismiss` props to modal components
- Modal trigger and modal component are siblings (see `FlowActionsButton` pattern)

## Routing
- App uses `HashRouter` with nested routes under a `<Layout>` wrapper
- Use `react-router-dom` hooks: `useParams`, `useNavigate`, `useLocation`
- Route paths are defined in `App.jsx`
