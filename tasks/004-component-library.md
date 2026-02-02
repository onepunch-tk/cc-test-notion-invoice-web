# Task 004: Common Component Library Implementation

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Invoice-Web MVP에서 사용할 공통 UI 컴포넌트를 shadcn/ui를 기반으로 구현합니다. 인보이스 표시에 필요한 기본 컴포넌트(Button, Card, Table, Badge, Skeleton)를 설치하고, 인보이스 도메인에 특화된 컴포넌트 스켈레톤(InvoiceCard, InvoiceTable, InvoiceHeader)을 생성합니다.

## 관련 기능

- F005 - Responsive Design: 반응형 디자인을 지원하는 컴포넌트 구현

## 관련 파일

- `app/presentation/components/ui/` - shadcn/ui 기본 컴포넌트
- `app/presentation/components/invoice/invoice-card.tsx` - 인보이스 카드 컴포넌트
- `app/presentation/components/invoice/invoice-table.tsx` - 라인 아이템 테이블 컴포넌트
- `app/presentation/components/invoice/invoice-header.tsx` - 인보이스 헤더 컴포넌트
- `app/presentation/components/invoice/invoice-summary.tsx` - 합계 섹션 컴포넌트
- `app/presentation/components/invoice/index.ts` - barrel export

## 수락 기준

- [ ] shadcn/ui 기본 컴포넌트 설치됨 (Button, Card, Table, Badge, Skeleton)
- [ ] InvoiceCard 컴포넌트가 인보이스 요약 정보를 표시
- [ ] InvoiceTable 컴포넌트가 라인 아이템을 테이블로 표시
- [ ] InvoiceHeader 컴포넌트가 회사/고객 정보를 표시
- [ ] InvoiceSummary 컴포넌트가 소계/세금/합계를 표시
- [ ] 모든 컴포넌트가 반응형 디자인 적용됨
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: shadcn/ui 기본 컴포넌트 설치

- [ ] `bunx shadcn@latest add button` 실행
- [ ] `bunx shadcn@latest add card` 실행
- [ ] `bunx shadcn@latest add table` 실행
- [ ] `bunx shadcn@latest add badge` 실행
- [ ] `bunx shadcn@latest add skeleton` 실행
- [ ] 각 컴포넌트가 `app/presentation/components/ui/`에 생성됨 확인

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 모든 컴포넌트 import 가능

### Step 2: InvoiceCard 컴포넌트 구현

- [ ] `app/presentation/components/invoice/` 디렉토리 생성
- [ ] `invoice-card.tsx` 생성
  - Props: invoice (Invoice 타입 또는 더미 데이터 타입)
  - 표시 정보: invoice_number, client_name, issue_date, total_amount, status
  - 클릭 시 상세 페이지로 이동하는 Link 포함
  - Badge로 status 표시 (색상 구분)
- [ ] 반응형 카드 레이아웃 (모바일: 전체 폭, 데스크톱: 그리드)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 3: InvoiceHeader 컴포넌트 구현

- [ ] `invoice-header.tsx` 생성
  - Props: companyInfo, invoice (client 정보)
  - 좌측: 회사 정보 (로고, 이름, 주소, 연락처)
  - 우측: 고객 정보 (이름, 이메일, 주소)
  - 인보이스 번호, 발행일, 마감일 표시
- [ ] 인쇄 최적화 스타일 적용
- [ ] A4 레이아웃 고려한 여백 설정

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 4: InvoiceTable 컴포넌트 구현

- [ ] `invoice-table.tsx` 생성
  - Props: lineItems (InvoiceLineItem[] 타입)
  - 컬럼: description, quantity, unit_price, line_total
  - shadcn/ui Table 컴포넌트 활용
  - sort_order 기준 정렬
- [ ] 숫자 포맷팅 (통화, 소수점)
- [ ] 빈 상태 처리 (라인 아이템 없을 때)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 5: InvoiceSummary 컴포넌트 구현

- [ ] `invoice-summary.tsx` 생성
  - Props: subtotal, tax_rate, tax_amount, total_amount, currency
  - 소계, 세금 (세율 %), 합계 표시
  - 통화 기호 및 포맷팅
- [ ] 우측 정렬 레이아웃
- [ ] 합계 강조 스타일

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 6: Barrel Export 및 통합

- [ ] `app/presentation/components/invoice/index.ts` 생성
- [ ] 모든 invoice 컴포넌트 export
- [ ] Storybook이나 개발 페이지에서 컴포넌트 확인 (선택)

**완료 조건**:
- 모든 단위 테스트 통과
- import 경로 정상 동작

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
- [ ] 각 컴포넌트 렌더링 테스트
- [ ] Props 전달 테스트
- [ ] 반응형 레이아웃 테스트 (viewport 변경)
- [ ] 접근성 테스트 (aria-label 등)

## 참고 사항

- shadcn/ui 설치 시 `components.json` 설정 필요 (이미 설정되어 있음)
- TailwindCSS v4 사용 중 - 클래스 문법 확인
- 통화 포맷팅: Intl.NumberFormat 사용 권장
- 날짜 포맷팅: date-fns 사용 (이미 설치됨)
- React 19 사용 중 - useCallback/useMemo 지양 (컴파일러 최적화)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
