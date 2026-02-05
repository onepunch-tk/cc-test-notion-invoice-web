# Security Auditor Agent Memory

## Project Security Profile

**Tech Stack**: React Router v7 + React 19 + TypeScript + Cloudflare Workers
**Authentication**: Not yet implemented (planned)
**CMS**: Notion API integration
**Deployment**: Cloudflare Workers (wrangler)

---

## Recurring Security Patterns

### Information Disclosure
- **Pattern**: Development error messages expose raw Error.message and stack traces
- **Location**: `app/root.tsx` ErrorBoundary (lines 84-96)
- **Risk**: DEV mode may leak database URLs, API keys, internal paths
- **Mitigation**: Implement error message sanitization even in DEV mode

### React 19 XSS Prevention
- **Auto-escaping**: React 19 automatically escapes all JSX text content
- **Safe components**: Error components (NotFoundState, ErrorState) are XSS-safe by default
- **Advisory**: Props accepting user input should still use Zod validation for defense-in-depth

---

## Security-Sensitive File Locations

### Error Handling
- `app/root.tsx` - Global ErrorBoundary with conditional debug output
- `app/presentation/components/error/` - Reusable error UI components
- `app/presentation/routes/$.tsx` - 404 catch-all route

### Authentication (Future)
- Not yet implemented - watch for auth logic in future audits

### Environment Configuration
- `import.meta.env.DEV` - Used for conditional debug features
- No `.env` files found in git (good practice)

---

## Common Vulnerability Patterns to Watch

### High Priority
1. **Information Disclosure**: Raw error messages in any user-facing context
2. **Dependency Vulnerabilities**: Check `bun audit` for transitive dependencies (shadcn CLI tools)
3. **XSS in Props**: User-controlled strings passed to components without validation

### Medium Priority
1. **Stack Trace Exposure**: Even in DEV mode, should sanitize paths
2. **Missing Input Validation**: Props that may receive URL params or user input

---

## Dependency Security Notes

### Known Issues (2026-02-05)
- `@isaacs/brace-expansion` <=5.0.0: High severity, transitive from shadcn
  - CVE: GHSA-7h2j-956f-4vf2 (Uncontrolled Resource Consumption)
- `@modelcontextprotocol/sdk` 1.10.0-1.25.3: High severity, transitive from shadcn
  - CVE: GHSA-345p-7cg4-v4c7 (Cross-client data leak)
- **Impact**: Dev dependencies only, not runtime vulnerabilities
- **Action**: Run `bun update` to patch

---

## Notion API Integration Security Profile

### Environment Variable Handling
- **Location**: `adapters/shared/env.ts`
- **Pattern**: Zod schema validation for all environment variables
- **Secrets Management**: ✅ No hardcoded API keys detected
- **Required Variables**:
  - `NOTION_API_KEY` (validated, min length 1)
  - `NOTION_INVOICE_DATABASE_ID`
  - `NOTION_LINE_ITEM_DATABASE_ID`
  - `NOTION_COMPANY_DATABASE_ID`

### Error Handling Vulnerabilities
- **Pattern**: Raw Notion API errors propagate without sanitization
- **Risk**: Database IDs, API details may leak in error messages
- **Location**: All repository implementations lack try-catch wrappers
- **Recommendation**: Implement centralized `handleNotionError()` utility

### Rate Limiting
- **Status**: ❌ Not implemented
- **Risk**: API quota exhaustion, potential DoS
- **Notion Limit**: 3 requests per second
- **Available Infrastructure**: KV namespace configured in wrangler.toml
- **Recommendation**: Implement KV-based caching layer (TTL: 5-15 min)

---

## OWASP Compliance Status

| Category | Status | Notes |
|----------|--------|-------|
| A01 - Access Control | Not audited | No auth logic yet |
| A02 - Cryptographic Failures | ✅ Pass | No hardcoded secrets |
| A03 - Injection | ⚠️ Advisory | XSS-safe but add validation |
| A09 - Logging Failures | ⚠️ Issue | Error disclosure in DEV |

---

## Recommended Security Patterns

### Error Message Sanitization
```typescript
const sanitizeErrorMessage = (message: string): string => {
  return message
    .replace(/postgresql:\/\/[^@]+@[^\s]+/g, 'postgresql://[REDACTED]')
    .replace(/api[_-]?key[=:]\s*[^\s]+/gi, 'API_KEY=[REDACTED]')
    .replace(/[a-f0-9]{32}/gi, '[DATABASE_ID_REDACTED]')  // Notion DB IDs
    .replace(/\/Users\/[^\/]+/g, '/Users/[USER]');
};
```

### Notion Error Handler Pattern
```typescript
// app/infrastructure/external/notion/notion.error-handler.ts
import { NotionApiError } from "~/application/invoice/errors";

export const handleNotionError = (error: unknown): never => {
  const message = error instanceof Error
    ? error.message.replace(/[a-f0-9]{32}/gi, '[DATABASE_ID_REDACTED]')
    : "Unknown Notion API error";

  throw new NotionApiError(
    "Failed to fetch data from Notion",
    { originalMessage: message }
  );
};
```

### Input Validation for Repository Parameters
```typescript
import { z } from 'zod';

const invoiceIdSchema = z.string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9-_]+$/, "Invalid invoice ID format");

// Use in repository methods before querying
const validatedId = invoiceIdSchema.parse(invoiceId);
```

### KV-Based Caching for Rate Limiting
```typescript
export const createCachedInvoiceRepository = (
  baseRepository: InvoiceRepository,
  kv: KVNamespace,
  ttl = 300 // 5 minutes
): InvoiceRepository => ({
  findAll: async () => {
    const cached = await kv.get("invoices:all", "json");
    if (cached) return cached as Invoice[];

    const fresh = await baseRepository.findAll();
    await kv.put("invoices:all", JSON.stringify(fresh), {
      expirationTtl: ttl
    });
    return fresh;
  },
});
```

---

## Common Vulnerability Patterns Found

### Notion API Integration (Task 008)
1. **Error Information Disclosure** (High Severity) - ✅ Fixed with error-sanitizer.ts
2. **Missing Rate Limiting** (High Severity) - ✅ Implemented in Task 009
3. **NoSQL Injection Risk** (Medium Severity) - Still needs input validation
4. **Logging Without Sanitization** (Medium Severity) - ✅ Fixed with sanitizeErrorForLogging

### KV Caching Layer (Task 009 - Commit 3d74345)
1. **Cache Key Injection** (Critical)
   - `invoiceDetailKey(id)` and `ipRateLimitKey(ip)` lack input validation
   - Direct string interpolation allows cache poisoning
   - Fix: Add Zod validators (z.string().regex, z.string().ip)

2. **Unsafe JSON Deserialization** (High)
   - `kv.get()` casts unknown to T without validation
   - Fix: Validate with Zod before returning cached data

3. **Information Disclosure in Errors** (High)
   - CacheError/RateLimitExceededError expose full keys
   - Fix: Sanitize keys in error constructors

4. **Silent Error Swallowing** (Medium)
   - All KV errors caught without logging
   - Fix: Add error callback mechanism

5. **Rate Limiter Race Condition** (Medium)
   - Non-atomic read-modify-write in checkAndRecord
   - Mitigation: Set conservative limits, document limitation

### Invoice List Data Integration (Task 010 - 2026-02-05)
1. **Broken Access Control** (Critical)
   - loader 함수에 인증/인가 체크 부재
   - 모든 방문자가 재무 정보(client_email, total_amount) 접근 가능
   - Fix: JWT/Session 기반 인증 미들웨어 추가

2. **Rate Limiting 미적용** (Critical)
   - loader에 요청 빈도 제한 없음
   - DoS 공격으로 Notion API quota 소진 가능
   - Fix: KVRateLimiter를 loader에 통합 (10 req/min per IP)

3. **보안 로깅 부족** (High)
   - 에러 로그에 IP, User-Agent, timestamp 등 context 정보 부재
   - 공격 패턴 분석 불가
   - Fix: 구조화된 로깅 유틸리티 생성 (JSON 형식, Cloudflare Logpush 연동)

4. **클라이언트 측 재시도** (High)
   - `window.location.reload()` 사용으로 보안 이벤트 추적 불가
   - Fix: React Router의 `revalidator.revalidate()` 사용

---

## Security Testing Checklist

### KV Caching Tests
- [ ] Cache key injection attempts fail validation
- [ ] Malicious cached data rejected on deserialization
- [ ] Error messages don't expose sensitive IDs or IPs
- [ ] Race condition impact measured under concurrent load
- [ ] Cache TTL works correctly
- [ ] Invalid invoice IDs are rejected
- [ ] Malformed input doesn't cause errors

---

## Future Audit Focus Areas

1. **Authentication Implementation** (Next Priority)
   - Audit for OWASP A01 (Broken Access Control)
   - Audit for OWASP A07 (Authentication Failures)
   - Verify session management security
   - Check for horizontal privilege escalation (IDOR)

2. **Invoice Access Control**
   - Ensure users can only view their own invoices
   - Check authorization middleware on all routes
   - Verify invoice ID validation prevents IDOR

3. **PDF Generation** (Future)
   - Check for injection vulnerabilities in PDF rendering
   - Validate data sanitization before PDF generation

4. **File Upload** (If Implemented)
   - Audit for malicious file upload protection
   - Check file type validation
   - Verify file size limits

---

## Latest Comprehensive Audit Summary (2026-02-05)

**Commit**: 3d74345
**Scope**: Full app/ directory security audit
**Findings**: 2 High, 2 Medium, 1 Low severity issues
**Overall Status**: GOOD ✅ (Strong foundation with actionable improvements)

### Critical Takeaways
1. **Error Sanitization Implemented** ✅ - Previous concerns about information disclosure have been addressed
2. **No Hardcoded Secrets** ✅ - All environment variables properly managed
3. **Rate Limiting Still Missing** ⚠️ - Highest priority for production readiness
4. **Input Validation Gap** ⚠️ - Route parameters need validation before Notion queries

### Status Updates Since Last Audit
- ✅ **FIXED**: Error sanitization utility added (`app/infrastructure/utils/error-sanitizer.ts`)
- ✅ **FIXED**: SSR error handling now sanitizes before logging (`app/entry.server.tsx:26`)
- ✅ **FIXED**: Client ErrorBoundary sanitizes error messages (`app/root.tsx:102-104`)
- ⚠️ **UNCHANGED**: Rate limiting not implemented (still critical)
- ⚠️ **UNCHANGED**: NoSQL injection risk remains (input validation needed)

---

*Last Updated: 2026-02-05*
*Latest Audit: Full Security Audit - app/ directory (Commit: 3d74345)*
*Previous Audit: Notion API Integration (Commit: bae1c16)*
