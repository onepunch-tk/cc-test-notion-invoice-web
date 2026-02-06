# Infrastructure Layer

## Architecture: Hexagonal (Ports & Adapters)
- `app/application/` — Use cases, ports (interfaces)
- `app/domain/` — Types, schemas, business rules (PURE)
- `app/infrastructure/` — Implementations (this directory)
- `app/presentation/` — UI, routes, components

## Container (DI)
- Entry: `createContainer(env: CloudflareEnv)`
- Always inject via container, never import implementations directly