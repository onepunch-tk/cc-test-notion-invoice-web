# Code Reviewer Agent Memory

## Project-Specific Patterns

### Error Handling Components (Added: 2026-02-05)
- **Pattern**: Error state components use shadcn/ui Button with `asChild` pattern
- **Convention**: Component files use kebab-case (e.g., `error-state.tsx`) while component names use PascalCase
- **Accessibility**: Project prioritizes ARIA attributes - `role="alert"` for errors, `role="status"` for informational states
- **Test IDs**: Components use `data-testid` attributes following pattern: `{component-name}-{element-type}` (e.g., `error-state`, `error-icon`)

### React Router v7 Usage
- **Error Boundaries**: Uses `isRouteErrorResponse` from react-router to differentiate route errors
- **Route Props**: Error boundary receives `Route.ErrorBoundaryProps` typed from route files
- **Meta Function**: SEO meta tags defined via `MetaFunction` export from react-router
- **Loader Pattern**: Loader functions access DI container via `context.container` for type-safe service injection
- **Type-Safe Data Loading**: `useLoaderData<typeof loader>` provides automatic type inference
- **Loading State Detection**: `useNavigation` hook detects loader pending state for skeleton UI

### Notion API Integration Patterns (Added: 2026-02-05)
- **Factory Pattern**: Project uses factory functions for dependency injection (e.g., `createNotionClient`, `createNotionInvoiceRepository`)
- **Type Guards**: External API responses always go through type guards before mapping to domain models
- **Mapper Pattern**: Clear separation between infrastructure (Notion API) and domain types using dedicated mapper functions
- **Zod Validation**: Domain schemas validate data at infrastructure boundaries (after mapping from external APIs)
- **Repository Pattern**: Clean implementation of Port-Adapter pattern with interfaces in application layer and implementations in infrastructure layer

### Error Sanitization Patterns (Added: 2026-02-05)
- **Duplicate Logic**: Found sanitization logic duplicated in `root.tsx` and `infrastructure/utils/error-sanitizer.ts`
- **Best Practice**: Should always use shared utility from infrastructure layer
- **Patterns to Sanitize**: Database URLs, API keys, file paths, tokens, Notion Database IDs, Bearer tokens

### Cloudflare KV Cache Layer Patterns (Added: 2026-02-05)
- **Factory Pattern**: All services use factory functions (`createKVCacheService`, `createKVRateLimiter`, `createCircuitBreaker`)
- **Null Object Pattern**: Complete null implementations in `null-services.ts` for dev/test without KV
- **Wrapper Pattern**: `createCachedInvoiceRepository` and `createCachedCompanyRepository` wrap base repositories with caching/rate limiting/circuit breaker
- **Graceful Degradation**: Cache operations fail silently to avoid breaking app when KV is down
- **KVNamespaceLike Interface**: Abstract KV interface allows testing without actual Cloudflare Workers runtime
- **Time Injection**: Services accept optional `_getCurrentTime` for testing time-dependent logic
- **Centralized Keys**: Cache keys and TTL constants centralized in `cache-keys.ts`
- **Domain Errors**: Custom error classes (`CacheError`, `RateLimitExceededError`, `CircuitOpenError`) with proper prototype chain

### CLAUDE.md Convention Clarifications
- **Local Handlers**: Convention states "handlers use arrow functions" but doesn't clarify if this applies to local handlers within component bodies
- **Finding**: Local handlers like `const handleRetry = () => {}` inside components are acceptable and correct, but CLAUDE.md should explicitly state this to avoid confusion
- **Handler Extraction Pattern**: For handlers that don't depend on component state/props (like `window.location.reload()`), extracting to module-level arrow functions improves consistency and follows CLAUDE.md more strictly

## Common Code Quality Issues

### Type Safety Anti-Patterns to Watch For
1. **Optional Props Without Validation**: When multiple optional props interact (e.g., `actionLabel`, `actionHref`, `onRetry`), use discriminated unions to enforce valid combinations
2. **Duplicated Conditional Logic**: Watch for button label resolution logic scattered across multiple locations - consolidate to single source of truth
3. **Duplicated Type Guards**: Watch for identical type guard functions duplicated across multiple files - extract to shared utilities
4. **Generic Constraints for Serialization**: When generics are used with JSON serialization (cache, API responses), `extends Record<string, unknown>` may be too permissive. Consider stricter constraints or JSDoc warnings about non-serializable types (Functions, Dates, undefined)

### Error Handling Anti-Patterns (Added: 2026-02-05)
1. **Generic Error Usage**: Using `new Error()` instead of domain-specific error classes reduces error handling precision
2. **Unhandled External API Errors**: External API calls (Notion, REST APIs) should be wrapped in try-catch and re-thrown as domain errors
3. **Unhandled Validation Errors**: Zod schema validation should be wrapped in try-catch with contextual error messages including entity IDs
4. **Missing Error Context**: When wrapping errors, always include operation context (e.g., "Failed to fetch invoice list", not just "API call failed")
5. **Silent Error Swallowing**: Found in `kv-cache.service.ts` - cache operations silently catch all errors without logging, making debugging impossible. At minimum, log to console.error

### Code Duplication Patterns (Added: 2026-02-05)
1. **Repetitive Helper Functions**: Multiple helper functions with identical structure (check type, extract value, return default) - use generic extractors
2. **Property Extraction Pattern**: `getTitleText`, `getRichText`, `getNumber`, etc. all follow same pattern - extract to generic property extractor
3. **Error Sanitization**: Duplicated between `root.tsx` and `error-sanitizer.ts` - always use shared utility
4. **Rate Limit Checking**: Found `checkRateLimit` and `executeWithProtection` duplicated in `cached-invoice.repository.ts` and `cached-company.repository.ts` - extract to shared utility in `infrastructure/external/cloudflare/protection-utils.ts`
5. **ErrorBoundary Container Duplication**: Watch for identical JSX container wrappers in multiple return branches - consolidate error message logic and use single wrapper (Added: 2026-02-06)

### React 19 Compliance
- **Status**: ✅ All reviewed files correctly avoid `useCallback` and `useMemo`
- **Trust the Compiler**: Project properly relies on React 19 compiler for optimization
- **Zero Violations**: Full app directory review found 0 React 19 violations

## Recurring Suggestions

### Documentation Patterns
- **Complex Prop Interactions**: When props have interdependencies, add JSDoc comments explaining valid combinations
- **Deprecation Notices**: Use detailed JSDoc with `@deprecated` tag and migration examples (see `not-found.tsx`)
- **Edge Cases in Helpers**: Helper functions that return defaults should document this in JSDoc (e.g., "returns empty string if property is missing")
- **Type Guard Documentation**: All type guard functions should have JSDoc explaining purpose, parameters, and return value
- **Optional Fields**: Always document why fields are optional and when they'll be undefined
- **Port Interfaces**: Port interfaces need comprehensive JSDoc with examples, edge cases, error behavior, and type constraints (found missing in `cache.port.ts`, `rate-limiter.port.ts`, `circuit-breaker.port.ts`)

### Test Maintainability
- **Test ID Constants**: Consider extracting `data-testid` values to constants for easier test maintenance (low priority)
- **Pattern**: `export const TEST_IDS = { COMPONENT_NAME: 'value' } as const`

### Code Organization
- **Barrel Exports**: Large index.ts files benefit from grouping exports by functional area with comments
- **Pattern**: Group by Client, Repositories, Mappers, Type Guards, etc.
- **Dev-Only Code**: Remove development testing state from production components - use Storybook or dedicated dev routes instead

### Date Formatting (Added: 2026-02-05)
- **Current Limitation**: `format.ts` only supports basic `yyyy-MM-dd` string replacement
- **Improvement**: Use `Intl.DateTimeFormat` for internationalization and time support
- **Backward Compatibility**: Keep simple string format for common use cases

### Button Label Resolution (Added: 2026-02-05)
- **Anti-Pattern**: Nested ternary operators for button label logic create confusion
- **Solution**: Use helper functions with clear names or discriminated unions
- **Example**: `getRetryButtonLabel(actionLabel)` and `getNavigationButtonLabel(hasRetry, actionLabel)`

## Files to Monitor

### Frequently Modified Components
- `app/root.tsx` - Error boundary may need updates as error handling evolves
- `app/presentation/components/error/` - New error handling pattern directory

### Infrastructure Layer Patterns
- `app/infrastructure/external/notion/` - Notion API integration follows factory + mapper + type guard pattern
- `app/infrastructure/external/cloudflare/` - KV cache layer with rate limiting and circuit breaker
- `app/application/invoice/` - Service layer with port interfaces and domain-specific errors
- `app/application/shared/` - Shared port interfaces (cache, rate limiter, circuit breaker)
- Watch for: Duplicated type guards, missing error handling, generic Error usage, silent error swallowing

### Convention-Critical Files
- `CLAUDE.md` - May need updates to clarify local vs exported function conventions
- `docs/PROJECT-STRUCTURE.md` - Reference for architectural decisions

### Files with Known Issues (Added: 2026-02-05, Updated: 2026-02-06)
- `app/root.tsx:19-32` - Duplicated sanitization logic, use shared utility
- `app/infrastructure/utils/error-sanitizer.ts:10-32` - Incomplete database pattern coverage
- `app/presentation/lib/format.ts:57-66` - Limited date formatting flexibility
- `app/presentation/components/error/error-state.tsx:36-39` - Confusing button label logic
- `app/infrastructure/external/notion/notion.mapper.ts:39-160` - Repetitive property extraction
- `app/infrastructure/external/cloudflare/kv-cache.service.ts:32-59` - Silent error swallowing, add logging
- `app/infrastructure/external/notion/cached-invoice.repository.ts:44-72` - Duplicated rate limit logic
- `app/infrastructure/external/notion/cached-company.repository.ts:44-67` - Duplicated rate limit logic
- `app/application/shared/cache.port.ts` - Missing comprehensive JSDoc with examples
- `app/application/shared/rate-limiter.port.ts` - Missing comprehensive JSDoc with examples
- `app/application/shared/circuit-breaker.port.ts` - Missing comprehensive JSDoc with examples
- `app/presentation/routes/invoices/index.tsx:119-121` - handleRetry should be extracted to module level
- `app/presentation/routes/invoices/index.tsx:126-158` - ErrorBoundary container duplication

## Review Efficiency Notes

### Files to Exclude (Already Verified)
- Barrel exports (`index.ts`) - minimal logic, just re-exports
- shadcn/ui components (`app/presentation/components/ui/**`) - external library code
- Files matching exclusion patterns work correctly

### Quick Checks
1. **React 19**: Search for `useCallback` and `useMemo` first
2. **Type Safety**: Look for optional props with complex interactions
3. **ARIA**: Verify `role` and `aria-live` on error/status components
4. **Component Export**: Verify `export default function` for components
5. **Code Duplication**: Look for similar helper function patterns

## Architectural Insights

### Clean Architecture Adherence
- **Presentation Layer**: Error components correctly isolated in `presentation/components/error/`
- **No Domain Logic**: Components are pure UI with props, no business logic
- **Reusability**: New error components designed for reuse across application
- **DI Container**: Clean composition root in `infrastructure/config/container.ts`
- **Port-Adapter**: Repository interfaces clearly defined in application layer

### Design System Integration
- **shadcn/ui**: Properly uses Button component with `asChild` pattern
- **Tailwind**: Effective use of design tokens (`muted`, `foreground`, `muted-foreground`)
- **Theme Support**: Components respect dark mode via Tailwind classes

### Performance Patterns (Added: 2026-02-05)
- **Parallel Fetching**: `Promise.all` used correctly in `invoice.service.ts` for parallel data fetching
- **Early Returns**: Mapper functions use early returns to avoid unnecessary processing
- **Proper Sorting**: Line items sorted by `sort_order` for consistent display

## Success Metrics

### Review Session 2026-02-05 (Morning - Error Pages)
- **Files Reviewed**: 6
- **Issues Found**: 7 (0 Critical, 0 High, 3 Medium, 4 Low)
- **Code Quality Grade**: HIGH ✅
- **React 19 Compliance**: 100% ✅
- **CLAUDE.md Adherence**: 95% (minor clarification needed)

### Review Session 2026-02-05 (Afternoon - Notion Integration)
- **Files Reviewed**: 10
- **Issues Found**: 10 (0 Critical, 0 High, 5 Medium, 5 Low)
- **Code Quality Grade**: A- (Excellent) ✅
- **React 19 Compliance**: N/A (Backend code, no hooks used)
- **CLAUDE.md Adherence**: 95%
- **Key Findings**: Excellent type safety and architecture, needs improvement in error handling consistency and code deduplication

### Review Session 2026-02-05 (Full App Directory)
- **Files Reviewed**: 32 implementation files
- **Issues Found**: 14 (0 Critical, 0 High, 6 Medium, 8 Low)
- **Code Quality Grade**: A- (Excellent) ✅
- **React 19 Compliance**: 100% (0 violations found) ✅
- **CLAUDE.md Adherence**: 98% ✅
- **Type Safety**: 100% (Zero `any` usage) ✅
- **Key Strengths**: Exemplary Clean Architecture, comprehensive type guards, excellent factory pattern usage
- **Key Improvements**: Code duplication (sanitization, property extraction), date formatting flexibility, dev-only code isolation

### Review Session 2026-02-05 (KV Cache Layer)
- **Files Reviewed**: 13 files (11 new, 2 modified)
- **Issues Found**: 8 (0 Critical, 0 High, 4 Medium, 4 Low)
- **Code Quality Grade**: A- (Excellent) ✅
- **React 19 Compliance**: N/A (Backend infrastructure code)
- **CLAUDE.md Adherence**: 100% ✅
- **Type Safety**: 100% (Zero `any` usage) ✅
- **Key Strengths**: Exemplary factory pattern, perfect port-adapter architecture, comprehensive null object pattern, graceful degradation
- **Key Improvements**: Silent error swallowing, missing JSDoc, code duplication in rate limit checks, unconstrained generics

### Review Session 2026-02-06 (Task 010: Invoice List Data Integration)
- **Files Reviewed**: 2 files (1 route, 1 test)
- **Issues Found**: 5 (0 Critical, 0 High, 2 Medium, 3 Low)
- **Code Quality Grade**: A (Excellent) ✅
- **React 19 Compliance**: 100% (0 violations) ✅
- **CLAUDE.md Adherence**: 95% (minor handler location issue)
- **Type Safety**: 100% (Zero `any` usage) ✅
- **Key Strengths**: Perfect loader implementation, comprehensive error handling, excellent test coverage with createRoutesStub, superior UX with loading/empty/error states
- **Key Improvements**: ErrorBoundary code duplication, handler function location, SEO meta optimization

### Review Session 2026-02-06 (Task 012: Integration Tests)
- **Files Reviewed**: 6 test files
- **Test Count**: 75 integration tests (18 Notion API, 21 Caching, 11 Invoice List, 25 Invoice Detail)
- **Issues Found**: 8 (0 Critical, 0 High, 3 Medium, 5 Low)
- **Code Quality Grade**: A- (Excellent) ✅
- **Test Pattern**: AAA Pattern 100% compliance ✅
- **Korean Descriptions**: 100% ✅
- **Type Safety**: 100% (Zero `any` usage) ✅
- **Key Strengths**: MSW v2 accurate usage, comprehensive scenario coverage, excellent test isolation, fixture-based test data
- **Key Improvements**: Fixture → Domain type conversion helpers, test isolation clarity, mock vs real functions in integration tests

## Lessons Learned

### Full Directory Review Approach (Added: 2026-02-05)
- **Systematic Reading**: Read files in logical order (root → domain → application → infrastructure → presentation)
- **Pattern Recognition**: Look for repeated patterns across files to identify duplication early
- **Context Building**: Understanding infrastructure layer first helps review presentation layer more effectively
- **Exclusion Filters**: Properly excluding test files, types, and config files saves significant review time

### Common False Positives (Added: 2026-02-05)
- **JSDoc with word "any"**: The word "any" in comments is not the same as the `any` type
- **Local Function Definitions**: Local arrow functions in component bodies are correct per CLAUDE.md
- **Development Environment Checks**: `process.env.NODE_ENV === "development"` checks are acceptable

### Report Quality (Added: 2026-02-05)
- **Comprehensive Context**: Always include "why" the issue matters, not just "what" is wrong
- **Actionable Solutions**: Provide concrete code examples for fixes
- **Balanced Feedback**: Always include "Positive Aspects" section to recognize good work
- **Prioritization**: Clear severity levels help developers focus on what matters most
