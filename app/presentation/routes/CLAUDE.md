# Routes

## Route File Structure
```
loader (server) → Component (shared) → ErrorBoundary (shared)
```

## Loader
- Server-side only in React Router v7 Framework Mode
- Access env: `context.cloudflare.env`
- DI: `createContainer(context.cloudflare.env)`
- Validate params with Zod before querying
- Return `data()` with status codes, throw `data()` for errors

## Component
- `export default function` for route components
- `useLoaderData<typeof loader>()` for data access
- Client-only components (PDF): `React.lazy` + `Suspense`

## ErrorBoundary
- Export from every route that has a loader
- `isRouteErrorResponse(error)` → 404 vs 500
- `NotFoundState` for 404, `ErrorState` for others

## File Naming
- `index.tsx` — List/index routes
- `$paramName.tsx` — Dynamic routes
- `_data/` — Co-located data files