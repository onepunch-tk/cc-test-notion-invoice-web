# Project Structure Guide

## Overview

Notion에서 관리하는 인보이스 데이터를 웹 페이지로 변환하여 조회하고 PDF로 다운로드할 수 있는 애플리케이션입니다. **Clean Architecture** 패턴을 적용하여 핵심 비즈니스 로직을 플랫폼(Cloudflare Workers, Express, Fastify)으로부터 분리했습니다.

**Architecture Pattern**: Clean Architecture (4-layer separation) + Hexagonal (Ports & Adapters)
**Framework**: React Router Framework v7+ (SSR mode)
**Key Characteristics**:
- Platform-agnostic core (`app/`) reusable across Cloudflare Workers, Express, Fastify
- Strict dependency flow: Presentation -> Application -> Domain
- Infrastructure isolated via Dependency Injection (factory function based)
- Notion API as the sole data source (CMS-driven architecture)

---

## Top-Level Directory Structure

```
├── app/              # Core application code (Clean Architecture 4-layer)
├── adapters/         # Platform-specific adapters (Cloudflare)
├── workers/          # Cloudflare Workers entry point (re-exports adapters/cloudflare)
├── public/           # Static assets (favicon)
├── __tests__/        # All test files (mirrors app/ structure)
├── tasks/            # Development task specifications (numbered markdown)
├── scripts/          # One-off setup scripts (Notion DB provisioning)
├── docs/             # Project documentation (PRD, Roadmap, reports)
├── .claude/          # AI agent configuration (agents, skills, hooks)
└── .github/          # GitHub Actions CI/CD workflows
```

**Key directories**:
- `app/` - Core application (Clean Architecture layers: domain, application, infrastructure, presentation)
- `adapters/` - Platform-specific adapters (currently Cloudflare only)
- `workers/` - Cloudflare Workers entry point (delegates to `adapters/cloudflare/`)
- `public/` - Static assets served directly without build
- `__tests__/` - Test files mirroring source directory structure
- `tasks/` - Numbered task specification files for development workflow
- `scripts/` - Setup and utility scripts (e.g., Notion database provisioning)
- `docs/` - Documentation and review reports
- `.claude/` - AI agent definitions and skill configurations

---

## app/ Directory (Core Application)

Follows Clean Architecture 4-layer structure.

### app/domain/

**Role**: Business rules and entity definitions (no external dependencies)

**Contains**:
- Types - Core business object interfaces (`*.types.ts`)
- Schemas - Zod validation schemas for runtime validation (`*.schemas.ts`)
- Barrel exports - Re-export modules via `index.ts`

**When to use**:
- Adding new business concepts (e.g., payments, clients)
- When Notion API response validation schemas are needed
- Defining shared base types used across domains

**Structure**:
```
domain/
├── invoice/            # Invoice domain (Invoice, InvoiceLineItem, InvoiceStatus)
│   ├── invoice.types.ts
│   ├── invoice.schemas.ts
│   └── index.ts
├── company/            # Company domain (CompanyInfo)
│   ├── company.types.ts
│   ├── company.schemas.ts
│   └── index.ts
├── shared/             # Common types (BaseEntity) and base schemas
│   ├── common.types.ts
│   ├── common.schemas.ts
│   └── index.ts
└── index.ts            # Barrel export
```

**Example entities/schemas**:
- `Invoice` / `InvoiceWithLineItems` - Core invoice entity with line items, status, amounts
- `CompanyInfo` - Company information (name, address, email, tax ID)
- `invoiceSchema` / `companyInfoSchema` - Zod schemas for runtime validation of Notion API responses
- `InvoiceStatus` - Enum-like const (`Draft`, `Sent`, `Paid`, `Overdue`)

---

### app/application/

**Role**: Business logic and use case implementation

**Contains**:
- Service - Business logic implementation via factory functions (`*.service.ts`)
- Port - External system interface definitions (`*.port.ts`)
- Errors - Domain-specific error classes (`errors.ts`)
- Container types - DI container interface for presentation layer (`container.types.ts`)

**When to use**:
- Adding new business logic (invoice retrieval, future payment processing, etc.)
- When communication with external systems (Notion, cache, etc.) is needed
- Defining new port interfaces for infrastructure implementations

**Structure**:
```
application/
├── invoice/              # Invoice use cases
│   ├── invoice.port.ts   # InvoiceRepository, CompanyRepository interfaces
│   ├── invoice.service.ts # createInvoiceService factory (getInvoiceList, getInvoiceDetail)
│   ├── errors.ts         # InvoiceNotFoundError, NotionApiError, ValidationError, etc.
│   └── index.ts
├── shared/               # Cross-cutting port interfaces
│   ├── cache.port.ts     # CacheService interface (get/set/delete/getOrSet)
│   ├── circuit-breaker.port.ts # CircuitBreaker interface (execute, recordSuccess/Failure)
│   ├── rate-limiter.port.ts    # RateLimiter interface (checkLimit, recordRequest)
│   ├── container.types.ts      # IContainer interface (exposed to presentation layer)
│   └── index.ts
└── index.ts
```

**Port and Service relationship**:
- `*.port.ts` - Interface definition (what can be done) - e.g., `InvoiceRepository`, `CacheService`
- `*.service.ts` - Business logic (how to do it) - e.g., `createInvoiceService` factory

**Example services**:
- `createInvoiceService({ invoiceRepository, companyRepository })` - Factory function that returns `InvoiceService` with `getInvoiceList()` and `getInvoiceDetail(id)` methods
- `IContainer` - DI container interface exposing only `invoiceService` to presentation layer

---

### app/infrastructure/

**Role**: External system integration and port implementations

**Contains**:
- **config/**: DI container (Composition Root) - assembles all dependencies
- **external/notion/**: Notion API integration (repository implementations, mapper, client)
- **external/cloudflare/**: Cloudflare KV-based services (caching, rate limiting, circuit breaker)
- **utils/**: Cross-cutting utilities (error sanitization)

**When to use**:
- Adding new Notion API integrations -> `external/notion/`
- Creating Cloudflare KV-based services -> `external/cloudflare/`
- Registering new services to DI container -> `config/container.ts`
- Adding security/logging utilities -> `utils/`

**Structure**:
```
infrastructure/
├── config/
│   ├── container.ts               # createContainer(env, kv?) - Composition Root
│   └── index.ts
├── external/
│   ├── notion/
│   │   ├── notion-client.ts       # Notion SDK client factory (Workers-compatible fetch)
│   │   ├── notion.mapper.ts       # Notion API response -> domain entity mapping
│   │   ├── notion.types.ts        # Notion-specific type definitions
│   │   ├── invoice.repository.impl.ts    # InvoiceRepository implementation (Notion API)
│   │   ├── company.repository.impl.ts    # CompanyRepository implementation (Notion API)
│   │   ├── cached-invoice.repository.ts  # Decorator: caching + rate limiting + circuit breaker
│   │   ├── cached-company.repository.ts  # Decorator: caching + rate limiting + circuit breaker
│   │   └── index.ts
│   ├── cloudflare/
│   │   ├── kv-cache.service.ts    # CacheService implementation (Cloudflare KV)
│   │   ├── rate-limiter.service.ts # RateLimiter implementation (KV-based sliding window)
│   │   ├── circuit-breaker.service.ts # CircuitBreaker implementation (KV-based state)
│   │   ├── null-services.ts       # Null implementations for dev environment (no KV)
│   │   ├── cache-keys.ts          # Cache key generators, TTL/config constants
│   │   ├── protection-utils.ts    # Protection utility functions
│   │   ├── errors.ts              # Cloudflare-specific error classes
│   │   └── index.ts
│   └── index.ts
├── utils/
│   └── error-sanitizer.ts         # Sanitize sensitive data from error messages
└── index.ts
```

**Example integrations**:
- `createContainer(env, kv?)` - Composition Root: validates env, creates Notion client, repositories (base + cached decorators), and services. Falls back to Null implementations when KV is unavailable (dev mode)
- `createNotionInvoiceRepository(client, { invoiceDbId, lineItemDbId })` - Queries Notion databases for invoice data
- `createCachedInvoiceRepository({ repository, cache, rateLimiter, circuitBreaker })` - Decorator pattern adding caching, rate limiting, and circuit breaker to base repository
- `createKVCacheService(kv)` - Cloudflare KV-based cache with TTL support

---

### app/presentation/

**Role**: UI, routing, user interface related

**Contains**:
- **components/**: UI components organized by feature domain
- **hooks/**: Custom React hooks (currently empty, reserved for future use)
- **routes/**: Pages and API routes (React Router v7 Framework Mode)
- **lib/**: Utilities, formatters, and middleware

**When to use**:
- Adding new pages -> `routes/`
- Creating UI components -> `components/`
- When custom hooks are needed -> `hooks/`
- Adding route middleware -> `lib/middleware/`
- Adding formatters/utilities -> `lib/`

**Structure**:
```
presentation/
├── components/
│   ├── ui/                # shadcn/ui base components (Button, Card, Table, Dialog, etc.)
│   ├── invoice/           # Invoice-specific components (InvoiceCard, InvoiceTable, etc.)
│   ├── error/             # Error/NotFound state display components
│   ├── pdf/               # PDF generation components (react-pdf based)
│   └── not-found.tsx      # Standalone 404 component
├── hooks/                 # Custom React hooks (reserved)
├── routes/
│   ├── home/              # Home/welcome page
│   ├── invoices/          # Invoice list and detail pages
│   ├── layouts/           # Layout wrappers (AppLayout with header/footer)
│   ├── resources/         # Resource routes (robots.txt, sitemap.xml)
│   ├── auth/              # Auth routes (reserved)
│   ├── dashboard/         # Dashboard routes (reserved)
│   └── $.tsx              # Catch-all 404 route
└── lib/
    ├── utils.ts           # cn() - Tailwind class merge utility
    ├── format.ts          # formatCurrency(), formatDate() utilities
    ├── invoice-utils.ts   # getStatusBadgeVariant() - status-to-UI mapping
    ├── form-helpers.ts    # Form utility functions
    ├── middleware/         # Route middleware (reserved)
    └── index.ts
```

**Route file conventions (React Router v7)**:
- `home/home.tsx` - Home welcome page (index route)
- `invoices/index.tsx` - Invoice list page with loader + ErrorBoundary
- `invoices/$invoiceId.tsx` - Invoice detail page with dynamic param
- `layouts/app.layout.tsx` - Shared layout wrapper (header, footer)
- `resources/robots.ts`, `resources/sitemap.ts` - Resource routes (no layout)
- `$.tsx` - Catch-all route for 404 pages

**Example routes**:
- `GET /` - Home page (welcome + link to invoice list)
- `GET /invoices` - Invoice list with grid layout, loading skeleton, empty state
- `GET /invoices/:invoiceId` - Invoice detail with header, line items table, summary, PDF actions
- `GET /robots.txt`, `GET /sitemap.xml` - SEO resource routes

---

### app/ Root Files

| File | Role | When to modify |
|------|------|----------------|
| `root.tsx` | React Router root component, ThemeProvider (next-themes), Toaster, global ErrorBoundary | When adding global Providers |
| `routes.ts` | Route definitions (layout nesting, resource routes) | When adding new pages/layouts |
| `entry.server.tsx` | Server rendering entry point (renderToReadableStream, bot detection) | When customizing SSR behavior |
| `app.css` | Global styles (Tailwind CSS v4) | When adding global CSS variables |
| `env.d.ts` | Client environment variable types (Vite `import.meta.env`) | When adding client-side environment variables |

---

## adapters/ Directory (Platform Adapters)

**Role**: Connect the application to various runtime environments

```
adapters/
├── cloudflare/
│   ├── app.ts             # Cloudflare Workers fetch handler (Composition Root entry)
│   └── env.adapter.ts     # Cloudflare Env -> AppEnv extraction
└── shared/
    ├── context.ts          # Platform-common context types (CloudflareContext, Platform)
    ├── env.ts              # Environment variable schema (Zod), parsing, extraction
    └── react-router.d.ts   # AppLoadContext type extension (env, platform, container, cloudflare)
```

**When to use**:
- When supporting a new deployment platform (e.g., Express, Fastify)
- When adding platform-specific middleware
- When modifying environment variable handling
- When extending AppLoadContext with new properties

**shared/ directory**:
- `context.ts` - Platform-common context types (`CloudflareContext`, `Platform` type)
- `env.ts` - Unified environment variable schema (Zod-based `envSchema`), `parseEnv()`, `extractEnvFromSource()` -- Single Source of Truth for env vars
- `react-router.d.ts` - React Router `AppLoadContext` type extension (injects `env`, `platform`, `container`, `cloudflare`)

**Data flow**: Cloudflare Workers `fetch()` -> `extractCloudflareEnv(env)` -> `createContainer(env, kv)` -> `requestHandler(request, { env, platform, container, cloudflare })`

---

## Other Key Directories

### workers/

**Role**: Cloudflare Workers entry point (backward compatibility shim)

**Contains**: `app.ts` that re-exports from `adapters/cloudflare/app.ts`

**When to use**: This file exists for `wrangler.toml` compatibility. Modify `adapters/cloudflare/` instead.

---

### scripts/

**Role**: One-off setup and utility scripts

**Contains**: Notion database provisioning script (`setup-notion-databases.ts`)

**When to use**: When adding database setup, migration, or maintenance scripts

---

### tasks/

**Role**: Numbered development task specifications (000-019)

**Contains**: Markdown files defining implementation tasks with acceptance criteria, following the project roadmap

**When to use**: Reference when implementing features; add new task files for new development items

---

### public/

**Role**: Static asset storage (served directly without build)

**Contains**: `favicon.ico`

---

### __tests__/

**Role**: All test files, organized to mirror source directory structure

**File pattern**: `**/*.test.{ts,tsx}`

**Structure**:
```
__tests__/
├── domain/                   # Domain layer tests (schemas, types)
├── application/              # Application layer tests (services, ports, errors)
├── infrastructure/
│   └── external/
│       ├── notion/           # Notion repository and mapper tests
│       └── cloudflare/       # KV cache, rate limiter, circuit breaker tests
├── adapters/
│   └── shared/               # Environment variable handling tests
├── presentation/
│   ├── components/           # Component tests (invoice, error, pdf)
│   ├── routes/               # Route loader and component tests
│   └── lib/                  # Utility function tests
├── integration/              # Cross-layer integration tests
├── fixtures/                 # Test data factories (invoice, company, notion, env, cloudflare)
├── mocks/                    # MSW handlers and mock data
├── utils/                    # Test utilities (renderWithRouter)
└── setup.ts                  # Vitest global setup (DOM API mocks)
```

**When to use**: When writing unit tests, component tests, or integration tests. Test files must mirror the source file path (e.g., `app/domain/invoice/invoice.schemas.ts` -> `__tests__/domain/invoice/invoice.schemas.test.ts`).

---

### docs/

**Role**: Project documentation

**Contains**:
- `PRD.md` - Product Requirements Document
- `ROADMAP.md` - Development roadmap
- `PROJECT-STRUCTURE.md` - This file
- `reports/` - Code review, performance review, and security review reports

---

### .claude/

**Role**: AI agent configuration

**Contains**:
- `agents/dev/` - Development agent definitions (code-reviewer, e2e-tester, unit-test-writer, starter-cleaner)
- `agents/docs/` - Documentation agent definitions (development-planner, prd-generator, prd-validator, project-structure-analyzer, roadmap-validator)
- `skills/` - Reusable skill definitions (git, project-structure, review-report, tdd, workflow-interactive, workflow-team)
- `hooks/` - Agent lifecycle hooks
- `agent-memory/` - Persistent agent memory storage

---

### .github/

**Role**: GitHub Actions CI/CD workflows

**Contains**: Deployment workflows for Cloudflare Workers and Docker

---

## Path Aliases

```typescript
// Defined in tsconfig.app.json
"~/*"        -> "./app/*"
"adapters/*" -> "./adapters/*"
"tests/*"    -> "./tests/*"
```

**Usage example**:
```typescript
// Domain imports
import { Invoice, InvoiceWithLineItems } from '~/domain/invoice';
import { CompanyInfo } from '~/domain/company';

// Application imports
import { createInvoiceService } from '~/application/invoice/invoice.service';
import type { IContainer } from '~/application/shared/container.types';

// Infrastructure imports
import { createContainer } from '~/infrastructure/config/container';

// Presentation imports
import { InvoiceCard } from '~/presentation/components/invoice';
import { formatCurrency } from '~/presentation/lib/format';

// Adapter imports
import { parseEnv } from 'adapters/shared/env';
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| Add new page | `app/presentation/routes/` |
| Add UI component | `app/presentation/components/` |
| Add shadcn/ui component | `app/presentation/components/ui/` (via `bunx shadcn@latest add`) |
| Add business logic | `app/application/{domain}/` |
| Add domain types/schemas | `app/domain/{domain}/` |
| Add Notion API integration | `app/infrastructure/external/notion/` |
| Add Cloudflare service | `app/infrastructure/external/cloudflare/` |
| Register to DI container | `app/infrastructure/config/container.ts` |
| Add external API integration | `app/infrastructure/external/{service}/` |
| Define port interfaces | `app/application/{domain}/*.port.ts` or `app/application/shared/*.port.ts` |
| Add environment variables | `adapters/shared/env.ts` (schema) + `.env` (values) |
| Add platform adapter | `adapters/{platform}/` |
| Write test files | `__tests__/` (mirror source structure) |
| Add static files | `public/` |
| Add setup scripts | `scripts/` |
| Add task specifications | `tasks/` |
