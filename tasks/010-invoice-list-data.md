# Task 010: Invoice List Page Data Integration

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

인보이스 목록 페이지에 실제 Notion 데이터를 연동합니다. React Router의 loader 함수를 사용하여 서버 사이드에서 데이터를 가져오고, Task 005에서 구현한 UI에 연결합니다. 에러 핸들링과 로딩 상태 처리도 함께 구현합니다.

## 관련 기능

- F003 - Notion Database Integration: 실제 Notion 데이터 연동
- F004 - Invoice List View: 인보이스 목록 표시
- F008 - Loading States: 로딩 상태 처리
- F009 - Error Handling: 에러 상태 처리

## 관련 파일

- `app/presentation/routes/invoices/index.tsx` - 인보이스 목록 페이지 (수정)
- `app/application/invoice/invoice.service.ts` - Invoice 서비스 (Task 008에서 생성)
- `app/infrastructure/config/container.ts` - DI 컨테이너

## 수락 기준

- [ ] loader 함수에서 InvoiceService를 통해 데이터 가져옴
- [ ] useLoaderData로 컴포넌트에서 데이터 접근
- [ ] Notion 데이터가 InvoiceCard 컴포넌트에 올바르게 표시됨
- [ ] 데이터 로딩 중 스켈레톤 UI 표시 (Suspense 또는 useNavigation)
- [ ] API 에러 시 에러 UI 표시
- [ ] 빈 목록일 때 EmptyInvoiceList 표시
- [ ] 더미 데이터 파일 제거
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: Loader 함수 구현

- [ ] `app/presentation/routes/invoices/index.tsx` 수정
  - loader 함수 export 추가
  - DI 컨테이너에서 InvoiceService 가져오기
  - getInvoiceList() 호출
  - 응답 데이터 반환 (json)
- [ ] 타입 안전한 loader 데이터 정의

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- loader 함수 동작 테스트 통과

### Step 2: 컴포넌트에 Loader 데이터 연결

- [ ] useLoaderData 훅으로 데이터 접근
- [ ] 더미 데이터 import 제거
- [ ] InvoiceCard 컴포넌트에 실제 데이터 전달
- [ ] TypeScript 타입 체크 통과

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 3: 로딩 상태 처리

- [ ] useNavigation 훅으로 로딩 상태 감지
  ```typescript
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  ```
- [ ] 또는 Suspense + defer 패턴 사용 (선택)
- [ ] 로딩 중 InvoiceListSkeleton 표시
- [ ] 로딩 완료 시 실제 데이터 표시

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 로딩 상태 전환 테스트 통과

### Step 4: 에러 핸들링 구현

- [ ] loader에서 try-catch로 에러 캐치
- [ ] Notion API 에러 시 에러 응답 throw
  ```typescript
  throw new Response("Failed to load invoices", { status: 500 });
  ```
- [ ] ErrorBoundary에서 에러 UI 표시
- [ ] 재시도 버튼 구현 (페이지 새로고침 또는 revalidator)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 에러 상태 처리 테스트 통과

### Step 5: 빈 상태 처리

- [ ] 인보이스 목록이 비어있을 때 EmptyInvoiceList 표시
- [ ] 조건부 렌더링:
  ```typescript
  if (invoices.length === 0) {
    return <EmptyInvoiceList />;
  }
  ```

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 빈 상태 UI 테스트 통과

### Step 6: 정리 및 최적화

- [ ] 더미 데이터 파일 삭제 (`_data/dummy-invoices.ts`)
- [ ] 불필요한 import 정리
- [ ] 메타 함수 업데이트 (동적 제목 등)
- [ ] 전체 통합 테스트

**완료 조건**:
- 모든 단위 테스트 통과
- 실제 Notion 데이터로 페이지 동작

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
- [ ] loader 함수 테스트 (MSW 모킹)
- [ ] 컴포넌트 데이터 바인딩 테스트
- [ ] 로딩 상태 테스트
- [ ] 에러 상태 테스트
- [ ] 빈 목록 상태 테스트

## 참고 사항

- React Router v7 loader 함수: https://reactrouter.com/en/main/route/loader
- useLoaderData 훅으로 타입 안전한 데이터 접근
- useNavigation으로 네비게이션 상태 감지
- Cloudflare Workers 환경에서 loader 실행됨 (서버 사이드)
- DI 컨테이너 접근: context.cloudflare.env에서 환경 변수 접근
- defer/Await 패턴으로 스트리밍 렌더링 가능 (선택)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
