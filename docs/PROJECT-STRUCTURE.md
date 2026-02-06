# Project Structure Guide

## Overview

This project is based on **Clean Architecture** pattern, designed to reuse the same core logic across multiple platforms (Cloudflare Workers, Express, Fastify).

---

## Top-Level Directory Structure

```
├── app/              # Core application code (Clean Architecture)
├── adapters/         # Platform-specific adapters (Cloudflare, Express, Fastify)
├── server/           # Node.js server entry point
├── workers/          # Cloudflare Workers entry point
├── public/           # Static assets (images, fonts, etc.)
├── docker/           # Docker deployment configuration
├── supabase/         # Supabase migrations and settings
├── docs/             # Project documentation
├── __tests__/        # Test files
├── .github/          # GitHub Actions CI/CD
└── .claude/          # Claude agent configuration
```

---

## app/ Directory (Core Application)

Follows Clean Architecture 4-layer structure.

### app/domain/

**Role**: Business rules and entity definitions (no external dependencies)

**Contains**:
- Entity - Core business objects
- Types - Domain-related TypeScript types
- Schemas - Zod validation schemas
- Errors - Domain-specific error classes

**When to use**:
- Adding new business concepts (e.g., orders, products, payments)
- When API request/response validation schemas are needed
- Defining custom business errors

**Structure example**:
```
domain/
├── auth/           # Auth domain
├── user/           # User domain
├── shared/         # Common types (BaseEntity, etc.)
└── index.ts        # Barrel export
```

---

### app/application/

**Role**: Business logic and use case implementation

**Contains**:
- Service - Business logic implementation
- Port - External system interface definitions

**When to use**:
- Adding new business logic (sign-up, payment processing, etc.)
- When communication with external systems (email, payment gateway) is needed

**Structure example**:
```
application/
├── auth/           # Auth service and ports
├── user/           # User service and ports
├── shared/         # Common ports (email, etc.)
└── index.ts
```

**Port and Service relationship**:
- `*.port.ts` - Interface definition (what can be done)
- `*.service.ts` - Business logic (how to do it)

---

### app/infrastructure/

**Role**: External system integration and implementations

**Contains**:
- **config/**: DI container (Composition Root)
- **persistence/**: Database-related (Drizzle ORM, schemas, repository implementations)
- **external/**: External service integrations (Better-auth, Resend, etc.)

**When to use**:
- Adding database tables/schemas → `persistence/schema/`
- Creating new repository implementations → `persistence/drizzle/`
- Adding external API integrations (payment, notifications) → `external/`
- Registering new services to DI container → `config/container.ts`

**Structure example**:
```
infrastructure/
├── config/
│   └── container.ts      # DI container (assembles all dependencies)
├── persistence/
│   ├── drizzle/          # Drizzle ORM settings and repositories
│   └── schema/           # Database schemas
└── external/
    ├── better-auth/      # Auth system implementation
    └── resend/           # Email service implementation
```

---

### app/presentation/

**Role**: UI, routing, user interface related

**Contains**:
- **components/**: UI components
- **hooks/**: Custom React hooks
- **routes/**: Pages and API routes
- **lib/**: Utilities and middleware

**When to use**:
- Adding new pages → `routes/`
- Creating UI components → `components/`
- When custom hooks are needed → `hooks/`
- Adding route middleware → `lib/middleware/`

**Structure example**:
```
presentation/
├── components/
│   ├── ui/             # shadcn/ui base components
│   ├── forms/          # Form-related components
│   ├── sections/       # Page sections (Hero, Footer, etc.)
│   └── email/          # Email templates
├── hooks/              # Custom React hooks
├── routes/
│   ├── auth/           # Auth-related routes
│   ├── dashboard/      # Dashboard (auth required)
│   ├── settings/       # Settings (auth required)
│   ├── layouts/        # Layout components
│   └── resources/      # robots.txt, sitemap.xml
└── lib/
    └── middleware/     # Route middleware
```

---

### app/ Root Files

| File | Role | When to modify |
|------|------|----------------|
| `root.tsx` | React Router root component, Theme Provider | When adding global Providers |
| `routes.ts` | Route definitions | When adding new pages/layouts |
| `entry.server.tsx` | Server rendering entry point | When customizing SSR |
| `app.css` | Global styles (Tailwind) | When adding global CSS variables |
| `env.d.ts` | Client environment variable types (Vite `import.meta.env`) | When adding client-side environment variables |

---

## adapters/ Directory (Platform Adapters)

**Role**: Connect the application to various runtime environments

```
adapters/
├── cloudflare/       # Cloudflare Workers environment
├── express/          # Express server environment
├── fastify/          # Fastify server environment
└── shared/           # Common context and types
```

**When to use**:
- When supporting a new deployment platform
- When adding platform-specific middleware
- When modifying environment variable handling

**shared/ directory**:
- `context.ts` - Platform-common context types
- `env.ts` - Unified environment variable handling
- `react-router.d.ts` - React Router type extensions

---

## Other Key Directories

### server/

**Role**: Node.js server entry point

**When to use**: When changing Express/Fastify server settings

---

### workers/

**Role**: Cloudflare Workers entry point

**When to use**: When changing Cloudflare Workers settings

---

### public/

**Role**: Static asset storage (served directly without build)

**Contains**: Images, fonts, favicon, etc.

---

### docker/

**Role**: Docker-based deployment configuration

**Contains**: Dockerfile, nginx settings, docker-compose

---

### supabase/

**Role**: Supabase project settings

**When to use**: When adding database migrations

---

### \_\_tests\_\_/

**Role**: Actual test file location

**File pattern**: `**/*.test.{ts,tsx}`

**When to use**: When writing unit tests, component tests

---

## Path Aliases

```typescript
// Defined in tsconfig.app.json
"~/*"        → "./app/*"
"adapters/*" → "./adapters/*"
"tests/*"    → "./tests/*"
```

**Usage example**:
```typescript
import { AuthService } from '~/application/auth';
import { createExpressServer } from 'adapters/express/server';
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| Add new page | `app/presentation/routes/` |
| Add UI component | `app/presentation/components/` |
| Add business logic | `app/application/{domain}/` |
| Add DB schema | `app/infrastructure/persistence/schema/` |
| Add external API integration | `app/infrastructure/external/` |
| Define types/entities | `app/domain/{domain}/` |
| Write test files | `__tests__/` |
| Add static files | `public/` |
