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

### Test Dependencies (Verified 2026-02-06 - Task 012)
- **MSW v2**: Network request mocking with `onUnhandledRequest: "error"` prevents unintended leaks
- **Vitest**: Latest version, no known CVEs
- **@testing-library/react**: Latest version, secure
- **@notionhq/client**: Used in tests with mock data only

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
| A03 - Injection | ✅ Pass | Comprehensive Zod validation tests (Task 012) |
| A09 - Logging Failures | ⚠️ Issue | Error disclosure in DEV |

### Task 012 Test Infrastructure Audit (2026-02-06)
- **Status**: ✅ PASS with 1 advisory recommendation
- **Severity**: 0 Critical, 0 High, 1 Medium (mock URL cosmetic), 0 Low
- **Test Coverage**: SQL injection (`' OR 1=1--`), XSS (implicit via React 19), input validation
- **Mock Data Security**: All test data uses RFC 2606 reserved domains (`example.com`), safe placeholders
- **MSW Configuration**: `onUnhandledRequest: "error"` prevents network leaks

---

## Test Code Security Patterns (NEW - Task 012)

### Mock Data Best Practices
```typescript
// ✅ GOOD: Use RFC 2606 reserved domains
email: "test@example.com"
email: "user@example.org"
url: "https://example.com/resource"

// ❌ BAD: Real production domains
email: "test@gmail.com"
url: "https://notion.so/page-123"  // Use example.com instead

// ✅ GOOD: Reserved phone prefixes
phone: "+1-555-1234"  // North America 555 prefix

// ✅ GOOD: Generic placeholders for API keys
api_key: "test-api-key"
database_id: "test-db-id"

// ❌ BAD: Production-like values
api_key: "ntn_a1b2c3d4e5f6g7h8i9j0"
```

### MSW Handler Security
```typescript
// ✅ GOOD: Network isolation
server.listen({ onUnhandledRequest: "error" });

// ✅ GOOD: Generic error messages
return notionApiErrorHandler(
    401,
    "unauthorized",
    "API token is invalid or has been revoked.",  // No token exposure
);

// ❌ BAD: Exposing sensitive info
message: `Invalid token: ${actualToken}`,
```

### Input Validation Testing Pattern
```typescript
// ✅ GOOD: Test attack vectors explicitly
describe("Zod Param Validation → 400 Error", () => {
    it("SQL injection 시도는 400 에러를 발생시켜야 한다", async () => {
        renderWithIntegration("' OR 1=1--");
        // expect 400 error
    });

    it("특수문자가 포함된 invoiceId는 400 에러를 발생시켜야 한다", async () => {
        renderWithIntegration("abc!@#123");
        // expect 400 error
    });

    it("100자를 초과하는 invoiceId는 400 에러를 발생시켜야 한다", async () => {
        renderWithIntegration("a".repeat(101));
        // expect 400 error
    });
});
```

### Test Fixture Type Safety
```typescript
// ✅ GOOD: Type-safe builders prevent type mismatches
export const createMockInvoicePage = (
    overrides: Partial<PageObjectResponse> = {},
): PageObjectResponse => {
    // Merges overrides with base fixture safely
};
```

---

## Recommended Security Patterns

### Error Message Sanitization
```typescript
// ✅ Already implemented in app/infrastructure/utils/error-sanitizer.ts
const sanitizeErrorMessage = (message: string): string => {
  return message
    .replace(/postgresql:\/\/[^@]+@[^\s]+/g, 'postgresql://[REDACTED]')
    .replace(/api[_-]?key[=:]\s*[^\s]+/gi, 'API_KEY=[REDACTED]')
    .replace(/[a-f0-9]{32}/gi, '[DATABASE_ID_REDACTED]')  // Notion DB IDs
    .replace(/\/Users\/[^\/]+/g, '/Users/[USER]');
};
```

### External URL Validation (NEW - Required for Task 011/013 fixes)
```typescript
// app/infrastructure/utils/url-validator.ts
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'cdn.example.com',
  's3.amazonaws.com'
];

export const validateImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);

    // Only HTTPS in production
    if (import.meta.env.PROD && parsed.protocol !== 'https:') {
      return false;
    }

    // Block data URIs and private IPs
    if (parsed.protocol === 'data:' || isPrivateIP(parsed.hostname)) {
      return false;
    }

    // Check domain allowlist
    return ALLOWED_IMAGE_DOMAINS.some(domain =>
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};
```

### Environment-Aware Logging Pattern (NEW)
```typescript
// Only log detailed errors in development
if (import.meta.env.DEV) {
  console.error("[Context]", sanitizedMessage);
}
// Always throw generic message to client
throw new Response("Generic error message", { status: 500 });
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

### Invoice Detail & PDF Components (Task 011 & 013 - 2026-02-06)
1. **External Image URL Injection** (High Severity - SSRF/Content Injection)
   - `companyInfo.logo_url` rendered without URL validation/allowlist
   - Risk: SSRF to internal metadata services, data URI injection, mixed content
   - Location: invoice-pdf-document.tsx:39, invoice-header.tsx:31
   - Fix: Implement URL allowlist validator blocking data:, private IPs, non-HTTPS

2. **Missing CSP for Font Loading** (High Severity - Supply Chain)
   - Google Fonts CDN URLs hardcoded without CSP headers
   - Risk: Compromised CDN, MITM attacks, privacy leakage
   - Location: pdf-fonts.ts:20-27
   - Fix: Add CSP headers with font-src allowlist, consider self-hosting fonts

3. **Missing Rate Limiting on Detail Page** (Medium Severity)
   - Invoice detail loader has no rate limiting
   - Risk: ID enumeration (32-char hex brute-force), DoS, cost escalation
   - Location: $invoiceId.tsx:72-104
   - Fix: Leverage existing KV rate limiter (10 req/min per IP)

4. **Console Logging in Production** (Medium Severity)
   - Error messages logged even after sanitization
   - Risk: Information disclosure via browser/server logs
   - Location: $invoiceId.tsx:101
   - Fix: Conditional logging with import.meta.env.DEV check

**Positive Findings** ✅:
- Excellent input validation with Zod (blocks XSS, SQL injection, path traversal)
- Comprehensive error sanitization (16+ sensitive patterns)
- React 19 XSS auto-escaping properly leveraged
- Type-safe error handling with custom error classes
- 14 test cases covering security edge cases (TDD compliance)

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

## Latest Comprehensive Audit Summary (2026-02-06)

### Most Recent: Task 012 Test Infrastructure
**Date**: 2026-02-06
**Scope**: Integration test files (MSW, fixtures, handlers)
**Findings**: 0 Critical, 0 High, 1 Medium (cosmetic), 0 Low
**Overall Status**: PASS ✅ (Excellent test security practices)
**Report**: `/docs/reports/task-012-security-review.md`

### Previous: Task 011 & 013
**Commit**: 9475fc8 (Task 011 & 013)
**Scope**: Invoice Detail Page + PDF Document Component
**Findings**: 2 High, 2 Medium, 1 Low severity issues
**Overall Status**: GOOD ✅ (Excellent security practices with minor gaps)

### Critical Takeaways
1. **Input Validation Excellence** ✅ - Comprehensive Zod validation blocks injection attacks
2. **Error Sanitization Working** ✅ - 16+ sensitive patterns properly redacted
3. **XSS Prevention by Design** ✅ - React 19 auto-escaping leveraged correctly
4. **External URL Risk** ⚠️ - logo_url needs allowlist validation (SSRF risk)
5. **CSP Headers Missing** ⚠️ - Google Fonts CDN without CSP configuration

### Status Updates Since Last Audit (3d74345)
- ✅ **IMPROVED**: Invoice detail loader has excellent input validation
- ✅ **IMPROVED**: Test coverage includes XSS/injection attack scenarios
- ⚠️ **NEW ISSUE**: External image URLs lack validation (H-1)
- ⚠️ **NEW ISSUE**: Missing CSP headers for font loading (H-2)
- ⚠️ **UNCHANGED**: Rate limiting still not implemented on detail page (M-1)

### Production Readiness Blockers
1. **[High]** Implement URL validation with allowlist for logo_url
2. **[High]** Add CSP headers for font-src and img-src
3. **[Medium]** Add rate limiting to invoice detail loader

---

*Last Updated: 2026-02-06*
*Latest Audit: Invoice Detail & PDF Components (Commits: af98800, 9475fc8)*
*Previous Audit: Full Security Audit (Commit: 3d74345)*
