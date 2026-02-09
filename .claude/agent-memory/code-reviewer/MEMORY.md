# Code Reviewer Agent Memory (Unified: Quality + Security + Performance)

## Project Security Profile

**Tech Stack**: React 19 + React Router v7 + TypeScript + Tailwind CSS v4 + shadcn/ui + Notion API + Cloudflare Workers
**Authentication**: Not yet implemented (planned)
**CMS**: Notion API (3 req/sec rate limit)

## Project-Specific Patterns

### Clean Architecture
- **DI Container**: Composition root in `infrastructure/config/container.ts`
- **Port-Adapter**: Repository interfaces in application layer, implementations in infrastructure
- **Factory Pattern**: `createNotionClient`, `createKVCacheService`, `createCachedInvoiceRepository`
- **Null Object Pattern**: `null-services.ts` for dev/test without KV

### React Router v7 Patterns
- Loader: `context.container` for DI, `useLoaderData<typeof loader>` for type inference
- Error: `isRouteErrorResponse` + `Route.ErrorBoundaryProps`
- Navigation: `useNavigation` for skeleton UI during loading

### KV Cache Layer
- **Graceful Degradation**: Cache operations fail silently (avoid breaking app)
- **Time Injection**: `_getCurrentTime` param for testing time-dependent logic
- **Centralized Keys**: Cache keys and TTL in `cache-keys.ts`
- **Multi-layer**: KV Cache (5min) + Rate Limiter + Circuit Breaker

### PDF Generation
- **Pattern**: SSR wrapper (`pdf-download-button.tsx`) + client impl (`.client.tsx`)
- **@react-pdf/renderer**: Client-only, use `React.lazy` + `Suspense`
- **Font Registration**: Add duplicate check to prevent errors (`isKoreanFontRegistered` flag)
- **Bundle**: ~150-200KB, properly code-split via `.client.tsx` suffix

## OWASP Compliance Status

| Category | Status | Notes |
|----------|--------|-------|
| A01 - Access Control | Not audited | No auth logic yet |
| A02 - Cryptographic Failures | Pass | No hardcoded secrets |
| A03 - Injection | Pass | Zod validation + React 19 auto-escaping |
| A04 - Insecure Design | Partial | Rate limiting implemented for some routes |
| A05 - Security Misconfig | Needs audit | CSP headers missing for fonts |
| A09 - Logging Failures | Issue | Error disclosure in DEV mode |

## Performance Baselines

### API Response Times
- Cache hit: 5-10ms | Cache miss: 200-400ms (Notion API)
- Parallel `Promise.all`: 2x faster vs sequential calls
- Notion pagination: **NOT IMPLEMENTED** (100-item limit, data loss risk)

### Bundle Considerations
- @react-pdf/renderer: ~150-200KB (client-only, use `.client.tsx`)
- lucide-react: tree-shakeable (~0.5-1KB per icon)
- Error handling system: ~3KB (must be in main bundle)

### Component Performance Priority
- **Hot path**: List/table components, form inputs, loader functions
- **Cold path**: Error boundaries, modals, PDF generation

## Known Vulnerability Patterns

### Active Issues
1. **Missing CSP Headers** (Medium) - Google Fonts CDN without CSP font-src (pdf-fonts.ts uses fonts.gstatic.com)
2. **Font Registration Guard** (Medium) - `registerKoreanFont()` lacks duplicate check (pdf-fonts.ts:16-30)
3. **Notion Pagination** (Critical) - `findAll()` ignores `has_more` cursor, 100-item data loss
4. **Rate Limiting Gaps** (Medium) - Detail page loader missing rate limiting
5. **Cache Key Injection** (Critical) - `invoiceDetailKey(id)` lacks input validation
6. **Unsafe JSON Deserialization** (High) - `kv.get()` casts unknown to T without Zod validation
7. **Module-level Handlers** (Medium) - Event handlers like `handlePrint` defined inside components

### Resolved Issues
- **SSRF Protection** (Task 014): `company.schemas.ts` logo_url validation (HTTPS + IP blocklist) - Resolves External Image URL Injection
- Error sanitization: 16+ patterns in `error-sanitizer.ts`
- Env vars: Zod schema validation in `adapters/shared/env.ts`
- Parallel API calls: `Promise.all` in `InvoiceService.getInvoiceDetail()`

## Common Code Quality Issues

### Type Safety
- No `any` usage (100% compliance across all reviews including Task 150)
- Optional props with complex interactions need discriminated unions
- Generic `extends` constraints required (unconstrained generics found in cache layer)
- Exemplary pattern: `error instanceof Error ? error.message : "Unknown error"` for type-safe error detail extraction

### Code Duplication Hotspots
- `cached-invoice.repository.ts` / `cached-company.repository.ts`: Duplicated rate limit logic
- `root.tsx` / `error-sanitizer.ts`: Duplicated sanitization logic
- `notion.mapper.ts:39-160`: Repetitive property extraction (use generic extractor)

### React 19 Compliance
- **Status**: 100% (0 violations across all reviews)
- useCallback/useMemo: STRICTLY PROHIBITED unless empirically justified

### Error Handling
- Silent error swallowing in `kv-cache.service.ts:32-59` (add logging)
- Generic `Error` usage instead of domain-specific classes
- Missing try-catch in external API calls

## Files with Known Issues

- `app/presentation/components/pdf/pdf-fonts.ts:16-30` - Missing duplicate registration guard (Task 014)
- `app/presentation/components/invoice/invoice-actions.tsx:29-31` - handlePrint should be module-level (Task 014)
- `app/root.tsx:19-32` - Duplicated sanitization logic
- `app/infrastructure/external/cloudflare/kv-cache.service.ts:32-59` - Silent error swallowing
- `app/infrastructure/external/notion/cached-invoice.repository.ts:44-72` - Duplicated rate limit
- `app/infrastructure/external/notion/cached-company.repository.ts:44-67` - Duplicated rate limit
- `app/infrastructure/external/notion/notion.mapper.ts:39-160` - Repetitive extraction
- `app/presentation/lib/format.ts:57-66` - Limited date formatting
- `app/presentation/routes/invoices/index.tsx:119-121` - handleRetry should be module-level
- `app/application/shared/cache.port.ts` - Missing comprehensive JSDoc

## Review Session History

| Date | Scope | Files | Issues | Grade |
|------|-------|-------|--------|-------|
| 2026-02-09 | Task 150: Repository Error Detail | 4 | 0 (0C/0H/0M/0L) | A+ |
| 2026-02-09 | Task 014: PDF Download Feature | 9 | 3 (0C/0H/3M/0L) | A |
| 2026-02-06 | Task 012: Integration Tests | 6 | 8 (0C/0H/3M/5L) | A- |
| 2026-02-06 | Task 010: Invoice List | 2 | 5 (0C/0H/2M/3L) | A |
| 2026-02-05 | Full App Directory | 32 | 14 (0C/0H/6M/8L) | A- |
| 2026-02-05 | KV Cache Layer | 13 | 8 (0C/0H/4M/4L) | A- |

## Quick Check Priorities

1. `useCallback`/`useMemo` → Flag immediately (React 19)
2. `any` type → Flag as High severity
3. OWASP A01-A10 scan on API/auth code
4. O(n^2)+ algorithms in hot paths
5. N+1 query patterns in loaders
6. Hardcoded secrets (`api_key`, `token`, `password` patterns)
7. `dangerouslySetInnerHTML` with user content

*Last Updated: 2026-02-09*
