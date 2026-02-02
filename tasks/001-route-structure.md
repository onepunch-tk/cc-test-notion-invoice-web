# Task 001: Project Structure and Routing Setup

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

React Router v7 기반의 전체 라우트 구조를 생성합니다. Invoice-Web MVP에 필요한 모든 주요 페이지의 빈 쉘 파일을 생성하고, 공통 레이아웃 컴포넌트 스켈레톤을 구현합니다. Structure-First Approach에 따라 실제 기능 구현 전에 전체 애플리케이션의 뼈대를 완성합니다.

## 관련 기능

- F004 - Invoice List View: 인보이스 목록 페이지 라우트
- F006 - URL-based Access: URL 기반 인보이스 상세 페이지 접근
- F009 - Error Handling: 404 에러 페이지

## 관련 파일

- `app/routes.ts` - 라우트 정의 파일
- `app/presentation/routes/invoices/index.tsx` - 인보이스 목록 페이지
- `app/presentation/routes/invoices/$invoiceId.tsx` - 인보이스 상세 페이지
- `app/presentation/routes/not-found.tsx` - 404 에러 페이지
- `app/presentation/routes/layouts/app.layout.tsx` - 공통 레이아웃

## 수락 기준

- [x] 인보이스 목록 페이지 라우트 (`/invoices`) 접근 가능
- [x] 인보이스 상세 페이지 라우트 (`/invoices/:invoiceId`) 접근 가능
- [x] 404 에러 페이지가 존재하지 않는 경로에서 표시됨
- [x] 공통 레이아웃이 모든 페이지에 적용됨
- [x] 각 페이지에서 기본 placeholder 텍스트 표시
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: 라우트 구조 설계 및 파일 생성

- [x] `app/presentation/routes/invoices/` 디렉토리 생성
- [x] `app/presentation/routes/invoices/index.tsx` 생성 (목록 페이지 쉘)
- [x] `app/presentation/routes/invoices/$invoiceId.tsx` 생성 (상세 페이지 쉘)
- [x] 기존 `app/presentation/components/not-found.tsx` 확인 및 필요시 업데이트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 각 페이지 컴포넌트가 기본 export default function으로 정의됨

### Step 2: 라우트 정의 업데이트

- [x] `app/routes.ts`에 인보이스 관련 라우트 추가
- [x] index 라우트를 인보이스 목록으로 리디렉션 설정
- [x] 동적 라우트 파라미터 (`$invoiceId`) 설정
- [x] catch-all 404 라우트 설정

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 라우트 타입 체크 통과 (`bun run typecheck`)

### Step 3: 공통 레이아웃 스켈레톤 구현

- [x] `app/presentation/routes/layouts/app.layout.tsx` 업데이트
- [x] 기본 Header 영역 placeholder 추가
- [x] Main content 영역 (Outlet) 설정
- [x] Footer 영역 placeholder 추가
- [x] 반응형 컨테이너 스타일 적용

**완료 조건**:
- 모든 단위 테스트 통과
- 레이아웃이 모든 하위 라우트에 적용됨

### Step 4: 페이지 쉘 컴포넌트 구현

- [x] 인보이스 목록 페이지에 "Invoice List" placeholder 텍스트 표시
- [x] 인보이스 상세 페이지에 URL 파라미터 (`invoiceId`) 표시
- [x] 404 페이지에 "Not Found" 메시지와 홈 링크 표시
- [x] 각 페이지에 meta 함수 추가 (title, description)

**완료 조건**:
- 모든 페이지가 브라우저에서 렌더링됨
- 통합 테스트 작성 및 통과

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
- [x] 미해결 이슈 모두 수정 (이슈 0건)

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
- [x] All tests passing (Unit: 12/12, E2E: 11/11)
- [x] 각 라우트 접근 테스트
- [x] 레이아웃 적용 테스트
- [x] 404 라우트 테스트

## 참고 사항

- React Router v7 Framework Mode 사용 (App Router 스타일)
- `routes.ts`에서 `layout`, `index`, `route` 함수 사용
- 동적 라우트는 `$` prefix 사용 (예: `$invoiceId`)
- PRD Menu Structure 참고: Invoice List, Invoice Detail, Not Found

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-31 | Task 완료 - 모든 라우트 구현, 테스트 통과, 코드 리뷰 완료 |
