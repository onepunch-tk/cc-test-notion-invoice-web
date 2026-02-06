# Performance Analyzer Agent Memory

## Project-Specific Context

**Tech Stack**: React 19 + React Router v7 + TypeScript + Tailwind CSS v4 + shadcn/ui + Notion API

**Critical Convention**: This project uses React 19 with the React Compiler. Manual `useCallback` and `useMemo` are **STRICTLY PROHIBITED** unless empirically proven necessary.

## Established Performance Baselines

### Error Boundary Components
- **Expected Impact**: Negligible (not hot paths - only render on errors)
- **Acceptable Bundle Size**: 3-5KB for complete error handling system
- **SSR Requirements**: Must be fully SSR-compatible (no client-only APIs)
- **Time Complexity**: O(1) for error state components (static rendering)

### External API Integration (Notion)
- **Expected Response Time**: 200-400ms per Notion API call
- **Rate Limits**: 3 requests/second (Notion API limit)
- **Bundle Impact**: Server-side only (0KB client bundle impact)
- **Critical Pattern**: Always parallelize independent API calls with `Promise.all`
- **Caching Strategy**: Company info (1hr TTL), Invoice list (5min TTL), Invoice detail (30min TTL)

### Component Categories by Performance Priority

**Hot Path Components** (high priority optimization):
- List/table components with data iteration
- Components rendered in loops
- High-frequency re-render components (form inputs, animations)
- **React Router loaders** fetching from external APIs (critical for SSR performance)

**Cold Path Components** (low priority optimization):
- Error boundaries and error states
- Modal/dialog components
- One-time render layouts

## Common Performance Patterns

### React 19 Optimization Strategy
1. **Trust the Compiler**: React 19 compiler handles most optimizations automatically
2. **Avoid Manual Memoization**: Only use when empirically proven necessary
3. **Focus on Architecture**: State colocation, component composition, proper data fetching

### Bundle Size Best Practices
- lucide-react icons: Use named imports (tree-shakeable), ~0.5-1KB per icon
- shadcn/ui components: Already optimized, minimal bundle impact
- Critical components (errors, layouts): Keep in main bundle for reliability

### SSR Compatibility Checklist
- ✅ No `window`, `document`, or browser-only APIs in component body
- ✅ Use `import.meta.env.DEV` for dev-only features (vite handles this correctly)
- ✅ Avoid `useEffect` for critical rendering logic

## Performance Issues by Severity

### Critical (Must Fix Before Merge)
- Memory leaks (uncleaned intervals, subscriptions)
- Unbounded array/object growth
- O(n²) or higher algorithms in hot paths
- N+1 query patterns

### High (Should Fix Before Merge)
- **Sequential API calls** when parallel execution is possible
- Missing pagination for large lists
- Over-fetching data (retrieve unused fields)
- Missing virtualization for long lists (>100 items)
- Unnecessary API calls in loops

### Medium (Can Defer with Justification)
- Function recreation in cold path components
- Minor conditional logic complexity
- Missing cache opportunities (non-critical data)

### Low (Optional)
- Documentation improvements
- Style/readability optimizations in performant code
- Premature optimizations

## Anti-Patterns Detected

### Function Definitions
❌ **Avoid**: Handler functions defined inside components that are only used once
```typescript
// Inside ErrorBoundary
const handleRetry = () => {
  window.location.reload();
};
```

✅ **Prefer**: Inline handlers for simple operations or module-level constants
```typescript
// Inline
<Button onClick={() => window.location.reload()}>Retry</Button>

// Or module-level if reused
const reloadPage = () => window.location.reload();
```

**Rationale**: In React 19, the compiler optimizes most cases. Function recreation in cold paths (error boundaries) has negligible impact. Focus on readability.

## Bundle Size Analysis Methodology

1. **Measure New Dependencies**: Check if new imports add to bundle
2. **Verify Tree-Shaking**: Ensure ES modules with named imports
3. **Icon Libraries**: lucide-react is tree-shakeable (use named imports)
4. **Critical vs Code-Split**: Error handling must be in main bundle

## Lessons Learned

### 2026-02-05: Error Component Performance Analysis
- Error boundary components are cold paths (only render on errors)
- Even with minor inefficiencies (function recreation), performance impact is negligible
- Focus on SSR compatibility and accessibility over micro-optimizations
- React 19 compiler eliminates need for manual memoization in presentational components
- Bundle size impact for error handling (~3KB) is acceptable and necessary for reliability

### 2026-02-05: Notion API Integration Performance Analysis
- **Critical Issue**: Sequential API calls are the #1 performance bottleneck
  - Example: `findById` makes 2 sequential Notion API calls (invoice + line items) = 400-800ms
  - Solution: Always use `Promise.all` for independent queries = 200-400ms (2x faster)
- **Missing Pagination**: Notion API returns max 100 results, but `has_more` cursor is ignored
  - This causes silent data loss beyond 100 items
  - Must implement cursor-based pagination for `findAll()`
- **No Caching Strategy**: Every request hits Notion API
  - Company info fetched on every detail page (unchanging data)
  - Recommend in-memory LRU cache with TTL (company: 1hr, invoices: 5-30min)
  - React Router loader caching + HTTP Cache-Control headers are essential
- **Service Layer Patterns**: InvoiceService also has sequential calls
  - `getInvoiceDetail` awaits invoice, then awaits company (sequential)
  - Should parallelize: `Promise.all([findById(), getCompanyInfo()])`
- **Rate Limiting**: Notion API has 3 req/sec limit - no retry logic implemented
  - Recommend exponential backoff retry for transient failures
- **Mapper Performance**: All O(1) property extractors are already optimal
  - Type guards are correctly implemented
  - No algorithmic improvements needed for mappers

### API Integration Best Practices
- **Always parallelize independent calls** with `Promise.all`
- **Implement pagination** for any list operations (never load unbounded data)
- **Cache aggressively** for rarely-changing data (company info, immutable invoices)
- **Add retry logic** for external API rate limits/transient failures
- **Measure I/O latency** separately from algorithmic complexity
- **Server-side only** external API clients (no client bundle impact)

### 2026-02-06: Invoice List Page SSR Performance Analysis (Task 010)
- **SSR Data Fetching**: React Router loader로 초기 로딩 속도 최적화 완료
  - useLoaderData로 waterfall 방지 (데이터가 렌더링 전 준비됨)
  - SSR → Hydration 패턴으로 FCP, TTI 개선
- **Critical Missing Feature**: Notion API 페이지네이션 미구현 (HIGH severity)
  - `has_more` cursor 처리 누락 → 100개 초과 시 데이터 손실 발생 가능
  - findAll()에서 while(cursor) 루프로 전체 데이터 로드 필요
  - 또는 서버 페이지네이션 + Infinite Scroll 구현 권장
- **HTTP Caching 미활용**: React Router loader에 Cache-Control 헤더 미설정
  - 브라우저 캐싱으로 반복 방문 시 네트워크 요청 절약 가능
  - 권장: `Cache-Control: public, max-age=300, s-maxage=300` (5분)
- **알고리즘 복잡도**: 모두 O(n) 최적 (filter + map 체이닝)
- **번들 사이즈**: 거의 변화 없음 (~0KB, 더미 데이터 제거 + 에러 컴포넌트 추가)
- **Multi-layer Caching**: KV Cache (5분) + Rate Limiter + Circuit Breaker 완벽 구현
  - 캐시 히트: 5-10ms, 캐시 미스: 250-450ms (Notion API 의존)
- **Observability**: 개발/프로덕션 환경별 에러 로깅 분리 권장
  - 현재는 모든 환경에서 sanitizeErrorMessage 적용
  - 개발 환경에서는 원본 에러 로깅으로 디버깅 효율성 향상 가능

### 2026-02-06: Invoice Detail + PDF Component (Task 011, 013)
- **Perfect Loader Parallelization**: InvoiceService.getInvoiceDetail() 최적화 완료
  - `Promise.all([invoice, company])` 병렬 호출 → 2배 속도 향상 (200-400ms vs 400-800ms)
  - NotionInvoiceRepository.findById()도 `Promise.all([invoice, lineItems])` 구현됨
  - 캐시 히트: 5-10ms, 캐시 미스: 200-400ms
- **CRITICAL BUG PERSISTS**: Notion API 페이지네이션 여전히 미구현
  - Task 010에서 발견된 이슈가 Task 011/013에서도 해결 안 됨
  - findAll()은 100개 이상 데이터 손실 발생 (while loop + cursor 필요)
  - **우선순위**: MUST FIX BEFORE MERGE (production blocker)
- **PDF Component (@react-pdf/renderer)**:
  - Bundle Size: ~150-200KB (client-side only)
  - **권장**: `.client.tsx` suffix로 SSR 번들 제외 (현재 미적용)
  - StyleSheet.create() module-level 실행: 5-10ms (cold path라 무시 가능)
  - Rendering: 100-500ms (client-side, line items 수에 비례)
- **Algorithm Complexity**:
  - Array.sort() O(n log n) - 최적 (작은 데이터셋)
  - map() O(n) - 최적
  - Zod validation O(1) - regex pattern matching
- **Font Loading**: Google Fonts CDN 사용
  - Network latency: ~100-300ms (first load)
  - Local 대안: +80-160KB bundle size, ~10ms loading
  - MVP는 CDN 적합, 오프라인 필요 시 local 전환
- **Error Handling Pattern**: Module-level 함수 (handlePageRetry, getErrorContent)
  - Cold path (ErrorBoundary)라 function recreation 무시 가능
  - 프로젝트 컨벤션 준수 (arrow functions for utilities)

### React Router Loader Performance Patterns
- **SSR Optimization**: loader가 서버에서 실행되어 초기 HTML에 데이터 포함
  - Initial HTML Size 증가 (~10-20KB per 10 invoices) vs 빠른 FCP
  - Trade-off: 네트워크 전송량 증가 vs 렌더링 속도 향상
- **Cache-Control Headers**: loader response에 HTTP 캐싱 헤더 설정 권장
  ```typescript
  return new Response(JSON.stringify(data), {
    headers: { "Cache-Control": "public, max-age=300" }
  });
  ```
- **Waterfall Prevention**: useLoaderData가 컴포넌트 렌더링 전 데이터 준비
- **Error Handling**: ErrorBoundary는 Cold Path (에러 발생 시에만 렌더링)

### 2026-02-05: Cloudflare KV Caching Layer Performance Analysis
- **Critical Pattern**: Sequential KV operations compound latency (HIGH severity)
  - Cache miss scenario: 5-10ms due to sequential KV reads/writes
  - Solution: Parallelize cache.get() + rateLimiter.checkLimit() = 30-50% faster
  - Always check cache AND rate limit in parallel (cache hits skip rate limit)
- **Redundant KV Reads**: Rate limiter's `checkAndRecord()` duplicates work (HIGH severity)
  - Current: 2 KV reads per rate limit check (checkLimit + checkAndRecord)
  - Solution: Atomic check-and-record operation = 50% overhead reduction
- **Type System Constraints**: `Record<string, unknown>` too restrictive
  - Forces unnecessary wrapping: `{ data: invoices }` then unwrap
  - Solution: Use `CacheValue` union type to allow arrays
- **KV Operation Costs**: Read ~0.5-2ms, Write ~1-3ms (baseline latency)
- **All Algorithms O(1)**: Rate limiter sliding window uses math-based calculation (optimal)
- **Circuit Breaker Trade-off**: KV read on every request ensures accuracy
  - Alternative: In-memory cache with 1s TTL (95% fewer KV reads but may lag)
  - Recommendation: Prioritize correctness, optimize only if proven bottleneck

### Component Design Principles
- **Pure Presentational Components**: No side effects, fully SSR-compatible
- **Type Safety**: Always use TypeScript interfaces, avoid `any`
- **Accessibility First**: Proper ARIA attributes in error states
- **Convention Over Configuration**: Follow project's React 19 patterns

### PDF Component Performance Patterns (Task 013)
- **Client-Only Suffix**: Always use `.client.tsx` for @react-pdf/renderer components
  - Prevents SSR bundling (150-200KB saved on server bundle)
  - Edge runtime (Cloudflare Workers) doesn't support @react-pdf/renderer
- **StyleSheet Creation**: Module-level `StyleSheet.create()` is acceptable
  - One-time cost (5-10ms) on module load
  - Cold path (PDF download button click) - not hot path
  - Alternative: Lazy initialization `let cache; const get = () => cache ??= create()`
- **Font Strategy Trade-offs**:
  - CDN (Google Fonts): No bundle cost, ~100-300ms network latency
  - Local: +80-160KB bundle, ~10ms loading, offline support
  - Choose based on: offline needs, bundle budget, first-load UX priority
- **Rendering Performance**: O(n) for line items, O(n log n) for sorting
  - Expected: 100-500ms for typical invoices (<100 line items)
  - Monitor if >1000 items (rare for invoices, but consider pagination)

## Tools and Commands

### Performance Profiling
```bash
# Bundle analysis (when needed)
bun run build && ls -lh dist/client/**/*.js

# Test performance
bun test -- --run performance

# Check for memory leaks in tests
bun test -- --run --reporter=verbose
```

### Performance Metrics to Track
- Time Complexity: O(1), O(n), O(n log n), O(n²), etc.
- Space Complexity: Memory footprint per component instance
- Bundle Size: gzipped size of new code
- SSR Compatibility: Server-render time impact
- Re-render Frequency: How often component updates

## Next Steps

When analyzing future components:
1. Classify as hot path or cold path
2. Verify React 19 convention compliance (no manual memoization)
3. Check SSR compatibility
4. Measure bundle size impact for new dependencies
5. Focus on algorithmic complexity for data processing logic
6. Prioritize issues by real-world impact, not theoretical concerns
