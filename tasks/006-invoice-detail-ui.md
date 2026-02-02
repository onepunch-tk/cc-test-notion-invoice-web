# Task 006: Invoice Detail Page UI

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

인보이스 상세 페이지의 UI를 하드코딩된 더미 데이터를 사용하여 구현합니다. 회사 정보, 고객 정보, 라인 아이템 테이블, 합계 섹션을 포함한 완전한 인보이스 레이아웃을 구현하고, A4 인쇄 최적화 스타일을 적용합니다. PDF 다운로드 버튼은 플레이스홀더로 구현합니다.

## 관련 기능

- F001 - Invoice Detail View: 인보이스 상세 정보 표시
- F005 - Responsive Design: 반응형 및 인쇄 최적화 레이아웃
- F006 - URL-based Access: URL 파라미터로 인보이스 접근
- F008 - Loading States: 로딩 상태 표시
- F009 - Error Handling: 에러 상태 표시

## 관련 파일

- `app/presentation/routes/invoices/$invoiceId.tsx` - 인보이스 상세 페이지
- `app/presentation/components/invoice/invoice-header.tsx` - 헤더 (Task 004에서 생성)
- `app/presentation/components/invoice/invoice-table.tsx` - 테이블 (Task 004에서 생성)
- `app/presentation/components/invoice/invoice-summary.tsx` - 합계 (Task 004에서 생성)
- `app/presentation/components/invoice/invoice-detail-skeleton.tsx` - 로딩 스켈레톤
- `app/presentation/components/invoice/invoice-actions.tsx` - 액션 버튼들
- `app/app.css` - 인쇄 스타일 추가

## 수락 기준

- [x] URL 파라미터 (invoiceId)가 페이지에서 추출됨
- [x] 회사 정보 섹션이 올바르게 표시됨
- [x] 고객 정보 섹션이 올바르게 표시됨
- [x] 인보이스 메타 정보 (번호, 날짜, 상태)가 표시됨
- [x] 라인 아이템 테이블이 올바르게 표시됨
- [x] 소계, 세금, 합계가 올바르게 계산 및 표시됨
- [x] PDF 다운로드 버튼이 표시됨 (기능은 플레이스홀더)
- [x] 목록으로 돌아가기 링크가 동작함
- [x] A4 인쇄 레이아웃이 최적화됨
- [x] 로딩 스켈레톤이 구현됨
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: 더미 데이터 생성

- [x] `app/presentation/routes/invoices/_data/dummy-invoice-detail.ts` 생성
  - 단일 Invoice 더미 데이터 (모든 필드 포함)
  - 5-7개의 InvoiceLineItem 더미 데이터
  - CompanyInfo 더미 데이터
- [x] InvoiceWithLineItems 복합 타입 사용

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 더미 데이터가 스키마 검증 통과

### Step 2: 로딩 스켈레톤 컴포넌트 구현

- [x] `app/presentation/components/invoice/invoice-detail-skeleton.tsx` 생성
  - 헤더 영역 스켈레톤
  - 테이블 영역 스켈레톤 (5줄)
  - 합계 영역 스켈레톤
- [x] 실제 레이아웃과 동일한 구조

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 3: 액션 버튼 컴포넌트 구현

- [x] `app/presentation/components/invoice/invoice-actions.tsx` 생성
  - "Download PDF" 버튼 (플레이스홀더, onClick alert)
  - "Back to List" 링크 버튼
  - "Print" 버튼 (window.print 호출)
- [x] 버튼 그룹 레이아웃 (우측 정렬)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 버튼 클릭 이벤트 테스트 통과

### Step 4: 인보이스 상세 페이지 레이아웃 구현

- [x] `app/presentation/routes/invoices/$invoiceId.tsx` 업데이트
  - useParams로 invoiceId 추출
  - 페이지 구조:
    1. 액션 버튼 영역 (상단 우측)
    2. InvoiceHeader (회사/고객 정보)
    3. InvoiceTable (라인 아이템)
    4. InvoiceSummary (합계)
    5. Notes 섹션 (선택)
  - 더미 데이터로 렌더링
- [x] meta 함수로 페이지 제목 설정 (Invoice #{invoice_number})

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 페이지 렌더링 테스트 통과

### Step 5: 인쇄 최적화 스타일 적용

- [x] `app/app.css`에 @media print 스타일 추가
  - 액션 버튼 숨김 (@media print { .no-print { display: none } })
  - A4 사이즈 최적화 (210mm x 297mm)
  - 여백 설정 (margin: 10mm)
  - 배경색 제거 (print-color-adjust: exact 필요한 경우만)
  - 페이지 나눔 방지 (break-inside: avoid)
- [x] 인쇄 미리보기에서 레이아웃 확인

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 인쇄 스타일 적용 확인

### Step 6: 상태별 UI 통합

- [x] isLoading 상태일 때 InvoiceDetailSkeleton 표시
- [x] 데이터가 있을 때 전체 인보이스 표시
- [x] 에러 상태 처리 (Task 007과 연계)
- [x] 조건부 렌더링 로직 구현

**완료 조건**:
- 모든 단위 테스트 통과
- 모든 상태 UI 확인 가능

## Mandatory Workflow (CRITICAL)

> 아래 단계는 **절대 건너뛸 수 없습니다**. 완료 후 각 항목에 체크하세요.

### TDD Red Phase
- [x] `unit-test-writer` 서브에이전트 호출 (Task tool 사용)
- [x] 실패하는 테스트 작성 확인

### TDD Green Phase
- [x] 테스트 통과를 위한 코드 구현
- [x] `bun test` 통과 확인

### Code Review Phase
- [x] `code-reviewer` 서브에이전트 호출 (background)
- [x] `security-code-reviewer` 서브에이전트 호출 (background)
- [x] `/docs/reports/` 리뷰 결과 확인
- [x] 미해결 이슈 모두 수정

### E2E Test Phase
- [x] `e2e-tester` 서브에이전트 호출 (Task tool 사용)
- [x] E2E 테스트 통과 확인

### Completion Phase
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/NOTE.md`에 배운 점 기록
- [x] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [x] Unit tests written via `unit-test-writer`
- [x] E2E tests written via `e2e-tester`
- [x] All tests passing
- [x] URL 파라미터 추출 테스트
- [x] 인보이스 헤더 렌더링 테스트
- [x] 라인 아이템 테이블 렌더링 테스트
- [x] 합계 계산 및 표시 테스트
- [x] 인쇄 스타일 적용 테스트

## 참고 사항

- PRD Invoice Detail Page 섹션 참고
- A4 사이즈: 210mm x 297mm (약 794px x 1123px at 96dpi)
- TailwindCSS print: variant 사용 가능 (`print:hidden`, `print:block`)
- 실제 데이터 연동은 Task 011에서 진행
- PDF 기능은 Task 013-014에서 구현
- 통화 포맷: Intl.NumberFormat 사용

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-03 | Task 006 완료: 인보이스 상세 페이지 UI 구현 - 더미 데이터(dummyCompanyInfo, dummyLineItems, dummyInvoiceDetail) 생성, InvoiceDetailSkeleton 컴포넌트 구현, InvoiceActions 컴포넌트(목록으로/인쇄/PDF 다운로드 버튼) 구현, $invoiceId.tsx 페이지 레이아웃 완성, A4 인쇄 최적화 CSS(no-print, print-avoid-break, @page) 적용, barrel export 업데이트. 271개 단위 테스트 통과, E2E 10/10 통과, 코드/보안 리뷰 완료(0 vulnerabilities) |
