# Task 016: Security and Input Validation

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

애플리케이션의 보안을 강화합니다. invoice_id 형식 검증으로 인젝션 공격을 방지하고, Notion 데이터 sanitization으로 XSS를 방지합니다. 선택적으로 Rate limiting도 구현합니다.

## 관련 기능

- F006 - URL-based Access: URL 파라미터 보안 검증
- F007 - Invoice Number Validation: 인보이스 ID 형식 검증

## 관련 파일

- `app/domain/invoice/invoice.schemas.ts` - ID 검증 스키마 추가
- `app/presentation/lib/validators/invoice-id.validator.ts` - ID 검증 유틸리티
- `app/presentation/lib/sanitizers/notion-data.sanitizer.ts` - 데이터 sanitization
- `app/infrastructure/external/notion/notion.mapper.ts` - sanitization 적용
- `app/presentation/middleware/security-headers.middleware.ts` - Security Headers 설정 [Security]
- `app/presentation/middleware/cors.middleware.ts` - CORS 설정 [Security]
- `app/entry.server.tsx` - Security Headers 적용

## 수락 기준

- [ ] invoice_id 형식 검증이 loader에서 수행됨
- [ ] 잘못된 형식의 ID는 400 Bad Request 반환
- [ ] SQL/NoSQL 인젝션 패턴 차단
- [ ] Notion 데이터의 HTML/스크립트가 sanitize됨
- [ ] XSS 공격 벡터 차단
- [ ] **[Security]** 라우트 파라미터 (`invoiceId`) Zod 검증으로 NoSQL Injection 방지
- [ ] **[Security]** Security Headers 설정 완료:
  - Content-Security-Policy (CSP)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
- [ ] **[Security]** CORS 설정 (필요 시)
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: Invoice ID 검증 스키마 정의 [NoSQL Injection 방지]

- [ ] `invoice.schemas.ts`에 invoiceIdSchema 추가
  ```typescript
  // NoSQL Injection 방지를 위한 엄격한 검증
  export const invoiceIdSchema = z
    .string()
    .min(1)
    .max(36)
    .regex(/^[a-zA-Z0-9-]+$/, 'Invalid invoice ID format')
    .refine(
      (id) => !containsNoSQLOperators(id),
      'Invalid characters detected'
    );

  // NoSQL 연산자 차단
  const containsNoSQLOperators = (value: string): boolean => {
    const dangerousPatterns = [
      /\$[a-z]+/i,  // MongoDB operators: $gt, $lt, $ne, etc.
      /\{|\}/,      // JSON injection
      /\[|\]/,      // Array injection
    ];
    return dangerousPatterns.some((pattern) => pattern.test(value));
  };
  ```
- [ ] Notion 페이지 ID 형식 검증 (32자리 hex 또는 UUID)
- [ ] 위험한 문자 차단 (quotes, semicolons, NoSQL operators)
- [ ] 라우트 파라미터 검증을 loader에서 즉시 수행

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- NoSQL Injection 공격 패턴 차단 테스트 통과
- 스키마 검증 테스트 통과

### Step 2: ID 검증 유틸리티 구현

- [ ] `invoice-id.validator.ts` 생성
  ```typescript
  export const validateInvoiceId = (id: string): string => {
    const result = invoiceIdSchema.safeParse(id);
    if (!result.success) {
      throw new Response('Invalid invoice ID', { status: 400 });
    }
    return result.data;
  };
  ```
- [ ] loader 함수에서 검증 호출
- [ ] 에러 메시지 표준화

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 검증 유틸리티 테스트 통과

### Step 3: Notion 데이터 Sanitization

- [ ] `notion-data.sanitizer.ts` 생성
  - sanitizeText: HTML 태그 제거, 특수문자 이스케이프
  - sanitizeUrl: URL 검증, javascript: 스킴 차단
  - sanitizeEmail: 이메일 형식 검증
- [ ] DOMPurify 또는 직접 구현 (Edge Runtime 호환)
  ```typescript
  export const sanitizeText = (text: string): string => {
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };
  ```

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- sanitization 테스트 통과

### Step 4: Notion Mapper에 Sanitization 적용

- [ ] `notion.mapper.ts` 수정
  - 모든 텍스트 필드에 sanitizeText 적용
  - URL 필드에 sanitizeUrl 적용
  - 이메일 필드에 sanitizeEmail 적용
- [ ] 원본 데이터 로깅 (디버깅용, 프로덕션에서 비활성화)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- mapper 통합 테스트 통과

### Step 5: Rate Limiting 구현 (선택)

- [ ] `rate-limit.middleware.ts` 생성 (선택)
  - Cloudflare Rate Limiting 또는 직접 구현
  - IP 기반 제한 (분당 60회 등)
  - KV를 활용한 카운터 저장
- [ ] 429 Too Many Requests 응답
- [ ] Retry-After 헤더 포함

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- rate limiting 테스트 통과

### Step 6: Security Headers 설정 [MANDATORY]

- [ ] `app/presentation/middleware/security-headers.middleware.ts` 생성
  ```typescript
  export const securityHeaders = {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",  // React hydration 필요
      "style-src 'self' 'unsafe-inline'",   // Tailwind CSS 필요
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
  ```
- [ ] `entry.server.tsx`에 Security Headers 적용
- [ ] wrangler.toml에 headers 설정 (선택적)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 모든 Security Headers가 응답에 포함됨
- CSP 위반 없이 앱이 정상 동작

### Step 7: CORS 설정 (필요 시)

- [ ] `app/presentation/middleware/cors.middleware.ts` 생성
  ```typescript
  export const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  ```
- [ ] OPTIONS preflight 요청 처리
- [ ] 허용된 origin만 CORS 허용 (production)

**완료 조건**:
- CORS 헤더가 필요한 경우에만 적용
- 불필요한 origin 차단

### Step 8: 보안 테스트 및 최종 검토

- [ ] 보안 테스트 수행
  - SQL/NoSQL 인젝션 시도
  - XSS 페이로드 테스트
  - 경로 조작 테스트
  - Security Headers 검증
- [ ] 보안 리포트 작성
- [ ] OWASP Top 10 체크리스트 검토

**완료 조건**:
- 모든 테스트 통과
- 보안 검토 완료

## Mandatory Workflow (CRITICAL)

> 아래 단계는 **절대 건너뛸 수 없습니다**. 완료 후 각 항목에 체크하세요.

### TDD Red Phase
- [ ] `unit-test-writer` 서브에이전트 호출 (Task tool 사용)
- [ ] 실패하는 테스트 작성 확인

### TDD Green Phase
- [ ] 테스트 통과를 위한 코드 구현
- [ ] `bun test` 통과 확인

### Code Review Phase
- [ ] `code-reviewer` 서브에이전트 호출 (background)
- [ ] `security-code-reviewer` 서브에이전트 호출 (background)
- [ ] `/docs/reports/` 리뷰 결과 확인
- [ ] 미해결 이슈 모두 수정

### E2E Test Phase
- [ ] `e2e-tester` 서브에이전트 호출 (Task tool 사용)
- [ ] E2E 테스트 통과 확인

### Completion Phase
- [ ] 이 Task 파일의 모든 체크박스 업데이트
- [ ] `docs/NOTE.md`에 배운 점 기록
- [ ] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [ ] Unit tests written via `unit-test-writer`
- [ ] E2E tests written via `e2e-tester`
- [ ] All tests passing
- [ ] ID 검증 테스트 (유효/무효 케이스)
- [ ] Sanitization 테스트 (XSS 페이로드)
- [ ] 인젝션 방지 테스트
- [ ] **[Security]** NoSQL Injection 패턴 차단 테스트:
  - `$gt`, `$lt`, `$ne`, `$or` 등 MongoDB 연산자
  - JSON/Array injection 패턴
  - 특수문자 포함 ID
- [ ] **[Security]** Security Headers 테스트:
  - CSP 헤더 존재 확인
  - X-Frame-Options: DENY 확인
  - X-Content-Type-Options: nosniff 확인
  - Referrer-Policy 확인
- [ ] **[Security]** CORS 테스트 (필요 시):
  - 허용된 origin 응답 확인
  - 비허용 origin 차단 확인
- [ ] 보안 헤더 테스트

## 참고 사항

- PRD Security 섹션 참고
- Notion 페이지 ID: 32자리 hex (하이픈 없음) 또는 UUID 형식
- XSS 방지: 사용자 입력은 항상 이스케이프
- DOMPurify는 브라우저 환경 전용 (Edge Runtime에서 직접 구현 필요)
- Cloudflare Rate Limiting: https://developers.cloudflare.com/waf/rate-limiting-rules/
- OWASP Top 10 참고: https://owasp.org/Top10/

### Security References

- **NoSQL Injection Prevention**:
  - MongoDB 연산자 차단: `$gt`, `$lt`, `$ne`, `$or`, `$and`, `$regex`, `$where`
  - Notion API는 NoSQL 기반이므로 쿼리 파라미터 검증 필수
  - 참고: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection

- **Security Headers**:
  - CSP (Content-Security-Policy): https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  - X-Frame-Options: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  - Referrer-Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  - 보안 헤더 테스트: https://securityheaders.com/

- **CORS**:
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  - Cloudflare Workers CORS: https://developers.cloudflare.com/workers/examples/cors-header-proxy/

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-05 | [Security] NoSQL Injection 방지, Security Headers, CORS 요구사항 추가 (보안 리뷰 반영) |
