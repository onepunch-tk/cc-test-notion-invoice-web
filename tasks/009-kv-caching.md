# Task 009: Cloudflare KV Caching Layer

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Cloudflare KV를 활용한 캐싱 레이어를 구현합니다. Notion API의 Rate Limit (3 req/sec)에 대응하고, 인보이스 데이터를 TTL 기반으로 캐싱합니다. 캐시 무효화 전략과 폴백 처리도 함께 구현합니다.

## 관련 기능

- F003 - Notion Database Integration: Notion API 응답 캐싱으로 성능 개선

## 관련 파일

- `app/application/shared/cache.port.ts` - 캐시 서비스 인터페이스
- `app/infrastructure/external/cloudflare/kv-cache.service.ts` - KV 캐시 구현
- `app/infrastructure/external/cloudflare/index.ts` - barrel export
- `app/infrastructure/config/container.ts` - DI 컨테이너 등록
- `wrangler.toml` - KV namespace 바인딩 (Task 003에서 설정됨)

## 수락 기준

- [ ] KV 캐시 서비스가 구현됨 (get, set, delete)
- [ ] 인보이스 목록 캐싱 (TTL: 5분)
- [ ] 인보이스 상세 캐싱 (TTL: 10분)
- [ ] 회사 정보 캐싱 (TTL: 15분)
- [ ] 캐시 미스 시 Notion API 호출 및 캐시 저장
- [ ] 캐시 키 네이밍 규칙 정의
- [ ] Rate Limit 에러 시 캐시 폴백 처리
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 캐시 Port (인터페이스) 정의

- [ ] `app/application/shared/cache.port.ts` 생성
  ```typescript
  interface CacheService {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    getOrSet<T>(
      key: string,
      fetcher: () => Promise<T>,
      ttlSeconds?: number
    ): Promise<T>;
  }
  ```
- [ ] 캐시 키 타입 정의

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 인터페이스 타입 체크 통과

### Step 2: KV 캐시 서비스 구현

- [ ] `app/infrastructure/external/cloudflare/` 디렉토리 생성
- [ ] `kv-cache.service.ts` 생성
  - CacheService 인터페이스 구현
  - Cloudflare KV API 사용 (KVNamespace)
  - JSON 직렬화/역직렬화
  - TTL 옵션 지원 (expirationTtl)
- [ ] 에러 핸들링 (KV 접근 실패 시)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐시 서비스 테스트 통과

### Step 3: 캐시 키 전략 정의

- [ ] 캐시 키 유틸리티 함수 생성 (`cache-keys.ts`)
  - `invoiceListKey()`: "invoices:list"
  - `invoiceDetailKey(invoiceId)`: "invoices:detail:{invoiceId}"
  - `invoiceLineItemsKey(invoiceId)`: "invoices:line-items:{invoiceId}"
  - `companyInfoKey()`: "company:info"
- [ ] TTL 상수 정의
  - INVOICE_LIST_TTL: 5 * 60 (5분)
  - INVOICE_DETAIL_TTL: 10 * 60 (10분)
  - COMPANY_INFO_TTL: 15 * 60 (15분)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐시 키 생성 테스트 통과

### Step 4: Invoice Repository에 캐싱 적용

- [ ] `invoice.repository.impl.ts` 수정
  - CacheService 주입
  - findAll: 캐시 확인 → 미스 시 API 호출 → 캐시 저장
  - findById: 캐시 확인 → 미스 시 API 호출 → 캐시 저장
  - getOrSet 패턴 활용
- [ ] Rate Limit 에러 감지 및 캐시 폴백

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐싱 동작 테스트 통과

### Step 5: 캐시 무효화 전략 구현

- [ ] 수동 캐시 무효화 함수 (개발/디버깅용)
  - invalidateInvoiceList()
  - invalidateInvoiceDetail(invoiceId)
  - invalidateAll()
- [ ] Stale-While-Revalidate 패턴 고려 (선택)
- [ ] 캐시 워밍 함수 (선택)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐시 무효화 테스트 통과

### Step 6: DI 컨테이너 등록 및 통합

- [ ] `app/infrastructure/config/container.ts` 업데이트
  - CacheService 바인딩 (KVCacheService)
  - InvoiceRepository에 CacheService 주입
- [ ] Barrel export 파일 업데이트
- [ ] 전체 통합 테스트

**완료 조건**:
- 모든 단위 테스트 통과
- 캐싱 레이어 통합 동작

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
- [ ] 캐시 get/set/delete 테스트
- [ ] 캐시 히트/미스 테스트
- [ ] TTL 만료 테스트
- [ ] 캐시 키 생성 테스트
- [ ] 에러 핸들링 테스트
- [ ] Rate Limit 폴백 테스트

## 참고 사항

- Cloudflare KV API: https://developers.cloudflare.com/workers/runtime-apis/kv/
- KVNamespace 메서드: get(key), put(key, value, options), delete(key)
- TTL 옵션: { expirationTtl: seconds }
- Notion API Rate Limit: 3 requests/second
- 로컬 테스트: wrangler dev --local 또는 miniflare
- KV는 최종 일관성 모델 (Strong Consistency 아님)
- 테스트 시 KV 모킹 필요 (miniflare 또는 직접 모킹)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
