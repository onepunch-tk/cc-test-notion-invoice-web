# Task 004: Common Component Library Implementation

> **Status**: ✅ Complete

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
- `app/presentation/lib/format.ts` - 통화/날짜 포맷 유틸리티
- `app/presentation/lib/invoice-utils.ts` - 인보이스 상태 뱃지 유틸리티

## 수락 기준

- [x] shadcn/ui 기본 컴포넌트 설치됨 (Button, Card, Table, Badge, Skeleton)
- [x] InvoiceCard 컴포넌트가 인보이스 요약 정보를 표시
- [x] InvoiceTable 컴포넌트가 라인 아이템을 테이블로 표시
- [x] InvoiceHeader 컴포넌트가 회사/고객 정보를 표시
- [x] InvoiceSummary 컴포넌트가 소계/세금/합계를 표시
- [x] 모든 컴포넌트가 반응형 디자인 적용됨
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: shadcn/ui 기본 컴포넌트 설치

- [x] `bunx shadcn@latest add button` 실행
- [x] `bunx shadcn@latest add card` 실행
- [x] `bunx shadcn@latest add table` 실행
- [x] `bunx shadcn@latest add badge` 실행
- [x] `bunx shadcn@latest add skeleton` 실행
- [x] 각 컴포넌트가 `app/presentation/components/ui/`에 생성됨 확인

**완료 조건**:
- [x] `unit-test-writer` 서브에이전트 실행 완료
- [x] 모든 컴포넌트 import 가능

### Step 2: InvoiceCard 컴포넌트 구현

- [x] `app/presentation/components/invoice/` 디렉토리 생성
- [x] `invoice-card.tsx` 생성
  - Props: invoice (Invoice 타입)
  - 표시 정보: invoice_number, client_name, issue_date, total_amount, status
  - 클릭 시 상세 페이지로 이동하는 Link 포함
  - Badge로 status 표시 (색상 구분)
- [x] 반응형 카드 레이아웃 (모바일: 전체 폭, 데스크톱: 그리드)

**완료 조건**:
- [x] `unit-test-writer` 서브에이전트 실행 완료
- [x] 컴포넌트 렌더링 테스트 통과

### Step 3: InvoiceHeader 컴포넌트 구현

- [x] `invoice-header.tsx` 생성
  - Props: companyInfo, invoice (client 정보)
  - 좌측: 회사 정보 (로고, 이름, 주소, 연락처)
  - 우측: 고객 정보 (이름, 이메일, 주소)
  - 인보이스 번호, 발행일, 마감일 표시
- [x] 인쇄 최적화 스타일 적용
- [x] A4 레이아웃 고려한 여백 설정

**완료 조건**:
- [x] `unit-test-writer` 서브에이전트 실행 완료
- [x] 컴포넌트 렌더링 테스트 통과

### Step 4: InvoiceTable 컴포넌트 구현

- [x] `invoice-table.tsx` 생성
  - Props: lineItems (InvoiceLineItem[] 타입)
  - 컬럼: description, quantity, unit_price, line_total
  - shadcn/ui Table 컴포넌트 활용
  - sort_order 기준 정렬
- [x] 숫자 포맷팅 (통화, 소수점)
- [x] 빈 상태 처리 (라인 아이템 없을 때)

**완료 조건**:
- [x] `unit-test-writer` 서브에이전트 실행 완료
- [x] 컴포넌트 렌더링 테스트 통과

### Step 5: InvoiceSummary 컴포넌트 구현

- [x] `invoice-summary.tsx` 생성
  - Props: subtotal, tax_rate, tax_amount, total_amount, currency
  - 소계, 세금 (세율 %), 합계 표시
  - 통화 기호 및 포맷팅
- [x] 우측 정렬 레이아웃
- [x] 합계 강조 스타일

**완료 조건**:
- [x] `unit-test-writer` 서브에이전트 실행 완료
- [x] 컴포넌트 렌더링 테스트 통과

### Step 6: Barrel Export 및 통합

- [x] `app/presentation/components/invoice/index.ts` 생성
- [x] 모든 invoice 컴포넌트 export
- [x] import 경로 정상 동작 확인

**완료 조건**:
- [x] 모든 단위 테스트 통과
- [x] import 경로 정상 동작

## Mandatory Workflow (CRITICAL)

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
- [x] 미해결 이슈 모두 수정 (이슈 0개)

### E2E Test Phase
- [x] E2E 테스트 확인 (프레젠테이션 레이어 컴포넌트로 Unit 테스트로 충분히 검증됨)

### Completion Phase
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/NOTE.md`에 배운 점 기록 (Lesson 13-17)
- [x] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [x] Unit tests written via `unit-test-writer`
- [x] All tests passing (132 tests)
- [x] 각 컴포넌트 렌더링 테스트
- [x] Props 전달 테스트
- [x] 반응형 레이아웃 테스트

## 참고 사항

- shadcn/ui 설치 시 `components.json` 설정 필요 (이미 설정되어 있음)
- TailwindCSS v4 사용 중 - 클래스 문법 확인
- 통화 포맷팅: Intl.NumberFormat 사용 (formatCurrency 유틸리티)
- 날짜 포맷팅: 직접 구현 (formatDate 유틸리티)
- React 19 사용 중 - useCallback/useMemo 지양 (컴파일러 최적화)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-02 | Task 완료 - 4개 컴포넌트, 2개 유틸리티 구현, 35개 테스트 추가 |
