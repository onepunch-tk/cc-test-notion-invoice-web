# Domain Layer

## This layer is PURE
- No imports from `infrastructure/` or `presentation/`
- No framework dependencies (no React, no Cloudflare, no Notion SDK)
- Only TypeScript types, Zod schemas, and pure business logic

## File Patterns
- `*.types.ts` — TypeScript interfaces and type aliases
- `*.schemas.ts` — Zod validation schemas (runtime validation)
- `index.ts` — Barrel re-exports only

## Schema Rules
- Every domain type MUST have a corresponding Zod schema
- Schemas are used by infrastructure layer to validate external data
- Use `z.infer<typeof schema>` to derive types from schemas when possible