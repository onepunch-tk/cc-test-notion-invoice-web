# Task 005: Invoice List Page UI

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

인보이스 목록 페이지의 UI를 하드코딩된 더미 데이터를 사용하여 구현합니다. InvoiceCard 컴포넌트를 활용한 그리드 레이아웃, 로딩 스켈레톤, 빈 상태 UI를 구현하고 반응형 디자인을 적용합니다. 실제 데이터 연동은 Phase 3에서 진행합니다.

## 관련 기능

- F004 - Invoice List View: 인보이스 목록 표시
- F005 - Responsive Design: 반응형 디자인
- F008 - Loading States: 로딩 상태 표시
- F009 - Error Handling: 에러 상태 표시

## 관련 파일

- `app/presentation/routes/invoices/index.tsx` - 인보이스 목록 페이지
- `app/presentation/components/invoice/invoice-card.tsx` - 인보이스 카드 (Task 004에서 생성)
- `app/presentation/components/invoice/invoice-list-skeleton.tsx` - 로딩 스켈레톤
- `app/presentation/components/invoice/empty-invoice-list.tsx` - 빈 상태 컴포넌트

## 수락 기준

- [ ] 인보이스 목록이 카드 그리드로 표시됨
- [ ] 각 카드에 인보이스 번호, 고객명, 날짜, 금액, 상태가 표시됨
- [ ] 카드 클릭 시 상세 페이지로 이동하는 링크 동작
- [ ] 로딩 스켈레톤 UI가 구현됨
- [ ] 빈 상태 UI가 구현됨 (인보이스 없을 때)
- [ ] 모바일/태블릿/데스크톱 반응형 레이아웃 적용
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 더미 데이터 생성

- [ ] `app/presentation/routes/invoices/_data/dummy-invoices.ts` 생성
  - 5-10개의 더미 Invoice 데이터 배열
  - 다양한 상태 (Draft, Sent, Paid, Overdue) 포함
  - 다양한 금액 및 날짜 포함
- [ ] 타입 안전성 확보 (Invoice 타입 사용)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 더미 데이터가 Invoice 스키마 검증 통과

### Step 2: 로딩 스켈레톤 컴포넌트 구현

- [ ] `app/presentation/components/invoice/invoice-list-skeleton.tsx` 생성
  - 카드 형태의 Skeleton 컴포넌트 3-6개 표시
  - 실제 InvoiceCard와 동일한 레이아웃
  - count prop으로 스켈레톤 개수 조절
- [ ] 반응형 그리드 레이아웃 적용

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 3: 빈 상태 컴포넌트 구현

- [ ] `app/presentation/components/invoice/empty-invoice-list.tsx` 생성
  - "인보이스가 없습니다" 메시지
  - 아이콘 또는 일러스트레이션
  - 안내 텍스트 (Notion에서 인보이스 생성 안내)
- [ ] 중앙 정렬 레이아웃

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 4: 인보이스 목록 페이지 구현

- [ ] `app/presentation/routes/invoices/index.tsx` 업데이트
  - 페이지 제목 "Invoices" 표시
  - InvoiceCard 그리드 레이아웃 (더미 데이터 사용)
  - 반응형 그리드: 모바일 1열, 태블릿 2열, 데스크톱 3열
  - meta 함수로 페이지 제목 설정
- [ ] 조건부 렌더링 준비 (로딩/빈 상태/데이터)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 페이지 렌더링 테스트 통과

### Step 5: 상태별 UI 통합

- [ ] isLoading 상태일 때 InvoiceListSkeleton 표시 (시뮬레이션)
- [ ] 데이터가 비어있을 때 EmptyInvoiceList 표시
- [ ] 데이터가 있을 때 InvoiceCard 그리드 표시
- [ ] 상태 전환 테스트용 버튼 추가 (개발용, 나중에 제거)

**완료 조건**:
- 모든 단위 테스트 통과
- 모든 상태 UI 확인 가능

### Step 6: 반응형 디자인 최적화

- [ ] 모바일 (< 640px): 1열 레이아웃, 터치 친화적 카드 크기
- [ ] 태블릿 (640px - 1024px): 2열 레이아웃
- [ ] 데스크톱 (> 1024px): 3열 레이아웃
- [ ] 카드 간격 및 패딩 조정
- [ ] 페이지 최대 너비 설정 (max-w-7xl)

**완료 조건**:
- 모든 단위 테스트 통과
- 각 뷰포트에서 레이아웃 확인

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
- [ ] 인보이스 카드 렌더링 테스트
- [ ] 로딩 스켈레톤 렌더링 테스트
- [ ] 빈 상태 렌더링 테스트
- [ ] 카드 클릭 네비게이션 테스트
- [ ] 반응형 레이아웃 테스트

## 참고 사항

- PRD Invoice List Page 섹션 참고
- TailwindCSS 그리드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Skeleton 컴포넌트는 shadcn/ui에서 설치됨 (Task 004)
- 실제 데이터 연동은 Task 010에서 진행
- 더미 데이터는 개발 완료 후 제거 예정

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
