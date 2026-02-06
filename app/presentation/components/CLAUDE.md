# Components

## Structure
- `ui/` — shadcn/ui base components (DO NOT modify unless upgrading)
- `invoice/` — Invoice-specific composed components
- `error/` — Error state components

## Rules
- `export default function ComponentName()` for all components
- NO `useCallback` / `useMemo` (React 19 compiler handles it)
- Props: TypeScript interfaces, never `any`
- All interactive elements need `aria-*` attributes

## shadcn/ui (`ui/`)
- Install: `bunx shadcn@latest add <component>`
- Customize via className props, not by editing source
- If editing source: document change in comment at top