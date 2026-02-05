# Task 007: Error Pages and States UI

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

404 Not Found 페이지, 일반 에러 상태 컴포넌트, 그리고 React Router의 에러 바운더리를 구현합니다. 사용자 친화적인 에러 메시지와 복구 액션(홈으로 이동, 재시도 등)을 제공합니다.

## 관련 기능

- F009 - Error Handling: 에러 페이지 및 상태 표시

## 관련 파일

- `app/presentation/routes/not-found.tsx` - 404 페이지 (또는 $.tsx catch-all)
- `app/presentation/components/error/error-state.tsx` - 일반 에러 상태 컴포넌트
- `app/presentation/components/error/not-found-state.tsx` - Not Found 상태 컴포넌트
- `app/presentation/components/error/index.ts` - barrel export
- `app/root.tsx` - ErrorBoundary 설정

## 수락 기준

- [x] 404 페이지가 존재하지 않는 경로에서 표시됨
- [x] 에러 메시지가 사용자 친화적으로 표시됨
- [x] "Go to Invoice List" 버튼이 동작함
- [x] 일반 에러 상태 컴포넌트가 재사용 가능함
- [x] ErrorBoundary가 예외를 캐치하고 에러 UI 표시
- [x] 모든 에러 페이지가 반응형 디자인 적용됨
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: Not Found 상태 컴포넌트 구현

- [x] `app/presentation/components/error/` 디렉토리 생성
- [x] `not-found-state.tsx` 생성
  - Props: title?, message?, actionLabel?, actionHref?
  - 기본값: "Page Not Found", "The page you're looking for doesn't exist."
  - 아이콘 (Lucide React: FileQuestion 또는 AlertCircle)
  - 액션 버튼 (Link 컴포넌트)
- [x] 중앙 정렬 레이아웃

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 2: 일반 에러 상태 컴포넌트 구현

- [x] `error-state.tsx` 생성
  - Props: title?, message?, onRetry?, actionLabel?, actionHref?
  - 에러 아이콘 (Lucide React: AlertTriangle)
  - 재시도 버튼 (onRetry가 있을 때)
  - 홈으로 이동 링크 (actionHref가 있을 때)
- [x] 에러 타입별 스타일 변형 (variant?: 'error' | 'warning')

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 3: 404 페이지 라우트 구현

- [x] `app/presentation/routes/$.tsx` (catch-all) 또는 `not-found.tsx` 생성
  - NotFoundState 컴포넌트 사용
  - 인보이스 관련 메시지: "Invoice not found"
  - "Go to Invoice List" 버튼 (/invoices로 이동)
- [x] meta 함수로 페이지 제목 설정 ("Page Not Found")
- [x] HTTP 상태 코드 404 반환 (loader에서 throw Response)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 404 페이지 렌더링 테스트 통과

### Step 4: ErrorBoundary 구현

- [x] `app/root.tsx`에 ErrorBoundary export 추가
  - isRouteErrorResponse로 에러 타입 구분
  - 404 에러: NotFoundState 표시
  - 기타 에러: ErrorState 표시
  - 개발 환경에서 에러 스택 표시 (선택)
- [x] 레이아웃 유지하며 에러 표시

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- ErrorBoundary 동작 테스트 통과

### Step 5: 인보이스별 에러 상태 구현

- [x] 인보이스 상세 페이지용 에러 처리
  - "Invoice not found" (존재하지 않는 인보이스 ID)
  - "Failed to load invoice" (API 에러)
- [x] 목록 페이지용 에러 처리
  - "Failed to load invoices" (API 에러)
  - 재시도 버튼 제공

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 에러 상태 표시 테스트 통과

### Step 6: Barrel Export 및 통합

- [x] `app/presentation/components/error/index.ts` 생성
- [x] 모든 에러 컴포넌트 export
- [x] 기존 `app/presentation/components/not-found.tsx` 정리 (있다면)

**완료 조건**:
- 모든 단위 테스트 통과
- import 경로 정상 동작

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
- [x] NotFoundState 렌더링 테스트
- [x] ErrorState 렌더링 테스트
- [x] 404 라우트 테스트
- [x] ErrorBoundary 동작 테스트
- [x] 액션 버튼 클릭 테스트

## 참고 사항

- PRD 404 Error Page 섹션 참고
- React Router v7의 ErrorBoundary는 export function ErrorBoundary() 형태
- isRouteErrorResponse로 HTTP 에러 응답 구분
- Lucide React 아이콘: FileQuestion, AlertTriangle, AlertCircle
- 에러 페이지도 반응형 디자인 적용 필수

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-05 | Task 007 완료: NotFoundState, ErrorState 컴포넌트 구현, ErrorBoundary 개선, CatchAll 라우트 업데이트. 319 단위 테스트, E2E 10/10 통과. 코드/보안/성능 리뷰 완료. |
