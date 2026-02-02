# Task 012: Core Feature Integration Testing

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Phase 3에서 구현한 핵심 기능들의 통합 테스트를 수행합니다. MSW를 활용한 API 통합 테스트, 비즈니스 로직 검증, 에러 핸들링 및 엣지 케이스 테스트를 작성합니다. 이전 Task들에서 작성한 단위 테스트를 보완하는 통합 테스트를 추가합니다.

## 관련 기능

- F003 - Notion Database Integration: API 통합 테스트
- F007 - Invoice Number Validation: 검증 로직 테스트
- F008 - Loading States: 상태 전환 테스트
- F009 - Error Handling: 에러 처리 테스트

## 관련 파일

- `__tests__/integration/invoice-list.integration.test.tsx` - 목록 페이지 통합 테스트
- `__tests__/integration/invoice-detail.integration.test.tsx` - 상세 페이지 통합 테스트
- `__tests__/integration/notion-api.integration.test.ts` - Notion API 통합 테스트
- `__tests__/integration/caching.integration.test.ts` - 캐싱 통합 테스트
- `tests/mocks/handlers.ts` - MSW 핸들러 (업데이트)
- `tests/mocks/data.ts` - 테스트용 목 데이터

## 수락 기준

- [ ] 인보이스 목록 페이지 end-to-end 흐름 테스트 통과
- [ ] 인보이스 상세 페이지 end-to-end 흐름 테스트 통과
- [ ] Notion API 호출 및 응답 처리 테스트 통과
- [ ] 캐시 히트/미스 시나리오 테스트 통과
- [ ] 에러 시나리오 테스트 통과 (API 에러, 404, 400)
- [ ] 엣지 케이스 테스트 통과 (빈 목록, 누락된 필드 등)
- [ ] 테스트 커버리지 80% 이상
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: MSW 핸들러 확장

- [ ] `tests/mocks/handlers.ts` 업데이트
  - Notion API 엔드포인트 모킹 추가
  - 성공 응답, 에러 응답, 빈 응답 시나리오
  - Rate Limit 응답 (429) 시뮬레이션
- [ ] `tests/mocks/data.ts` 생성
  - 다양한 테스트 시나리오용 목 데이터
  - Invoice, LineItem, CompanyInfo 목 데이터

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- MSW 핸들러 동작 확인

### Step 2: Notion API 통합 테스트

- [ ] `__tests__/integration/notion-api.integration.test.ts` 생성
  - 인보이스 목록 조회 테스트
  - 인보이스 상세 조회 테스트
  - 라인 아이템 조회 테스트
  - 회사 정보 조회 테스트
  - API 에러 응답 처리 테스트
  - Rate Limit 에러 처리 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- API 통합 테스트 통과

### Step 3: 캐싱 통합 테스트

- [ ] `__tests__/integration/caching.integration.test.ts` 생성
  - 캐시 미스 → API 호출 → 캐시 저장 흐름 테스트
  - 캐시 히트 → API 호출 없음 테스트
  - TTL 만료 후 재요청 테스트
  - 캐시 무효화 테스트
  - Rate Limit 시 캐시 폴백 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐싱 통합 테스트 통과

### Step 4: 인보이스 목록 페이지 통합 테스트

- [ ] `__tests__/integration/invoice-list.integration.test.tsx` 생성
  - 페이지 로드 → 데이터 표시 흐름 테스트
  - 로딩 상태 전환 테스트
  - 빈 목록 표시 테스트
  - API 에러 시 에러 UI 표시 테스트
  - 카드 클릭 → 상세 페이지 네비게이션 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 목록 페이지 통합 테스트 통과

### Step 5: 인보이스 상세 페이지 통합 테스트

- [ ] `__tests__/integration/invoice-detail.integration.test.tsx` 생성
  - 페이지 로드 → 데이터 표시 흐름 테스트
  - 유효한 invoiceId로 접근 테스트
  - 잘못된 invoiceId 형식 → 400 에러 테스트
  - 존재하지 않는 invoiceId → 404 에러 테스트
  - 모든 섹션 (헤더, 테이블, 합계) 렌더링 테스트
  - 인쇄 버튼 동작 테스트
  - 목록으로 돌아가기 버튼 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 상세 페이지 통합 테스트 통과

### Step 6: 엣지 케이스 및 에러 시나리오 테스트

- [ ] 엣지 케이스 테스트 추가
  - 라인 아이템이 없는 인보이스
  - 선택적 필드가 null인 경우 (notes, logo_url 등)
  - 매우 긴 텍스트 필드
  - 특수 문자가 포함된 데이터
  - 다양한 통화 (USD, KRW, EUR)
- [ ] 에러 시나리오 테스트 추가
  - 네트워크 에러
  - 타임아웃
  - 잘못된 JSON 응답
  - Zod 스키마 검증 실패

**완료 조건**:
- 모든 테스트 통과
- 테스트 커버리지 목표 달성

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
- [ ] 통합 테스트 커버리지 확인
- [ ] 엣지 케이스 테스트 완료
- [ ] 에러 시나리오 테스트 완료
- [ ] 성능 관련 테스트 (선택)

## 참고 사항

- MSW (Mock Service Worker) 문서: https://mswjs.io/
- vitest 통합 테스트 패턴: describe → it → expect
- React Testing Library로 컴포넌트 통합 테스트
- 테스트 격리: beforeEach/afterEach로 상태 초기화
- 커버리지 리포트: `bun test --coverage`
- CI/CD에서 테스트 실행 고려

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
