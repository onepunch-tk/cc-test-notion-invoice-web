# Task 011: Invoice Detail Page Data Integration

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

인보이스 상세 페이지에 실제 Notion 데이터를 연동합니다. URL 파라미터에서 invoice_id를 추출하여 해당 인보이스의 상세 정보, 라인 아이템, 회사 정보를 가져옵니다. 존재하지 않는 인보이스에 대한 404 처리도 구현합니다.

## 관련 기능

- F001 - Invoice Detail View: 인보이스 상세 정보 표시
- F003 - Notion Database Integration: 실제 Notion 데이터 연동
- F006 - URL-based Access: URL 파라미터로 인보이스 접근
- F007 - Invoice Number Validation: 인보이스 ID 검증
- F008 - Loading States: 로딩 상태 처리
- F009 - Error Handling: 에러 및 404 처리

## 관련 파일

- `app/presentation/routes/invoices/$invoiceId.tsx` - 인보이스 상세 페이지 (수정)
- `app/application/invoice/invoice.service.ts` - Invoice 서비스
- `app/infrastructure/config/container.ts` - DI 컨테이너

## 수락 기준

- [ ] URL 파라미터 (invoiceId)로 인보이스 조회
- [ ] loader에서 인보이스 + 라인 아이템 + 회사 정보 가져옴
- [ ] 존재하지 않는 인보이스 ID 접근 시 404 에러
- [ ] 인보이스 ID 형식 검증 (인젝션 방지)
- [ ] 모든 데이터가 UI 컴포넌트에 올바르게 표시됨
- [ ] 로딩 상태 처리
- [ ] API 에러 시 에러 UI 표시
- [ ] 더미 데이터 파일 제거
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: Loader 함수 구현

- [ ] `app/presentation/routes/invoices/$invoiceId.tsx` 수정
  - loader 함수 export 추가
  - params에서 invoiceId 추출
  - DI 컨테이너에서 InvoiceService 가져오기
  - getInvoiceDetail(invoiceId) 호출
- [ ] 타입 안전한 loader 데이터 정의
  ```typescript
  type LoaderData = {
    invoice: InvoiceWithLineItems;
    companyInfo: CompanyInfo;
  };
  ```

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- loader 함수 동작 테스트 통과

### Step 2: 404 에러 처리 구현

- [ ] 인보이스가 존재하지 않을 때 404 응답 throw
  ```typescript
  if (!invoice) {
    throw new Response("Invoice not found", { status: 404 });
  }
  ```
- [ ] ErrorBoundary에서 404 UI 표시
- [ ] "Go to Invoice List" 버튼 동작

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 404 에러 처리 테스트 통과

### Step 3: Invoice ID 검증 구현

- [ ] invoiceId 형식 검증 함수 생성
  - UUID 형식 또는 Notion 페이지 ID 형식 확인
  - 악성 문자열 필터링 (SQL 인젝션, XSS 방지)
- [ ] 잘못된 형식일 때 400 Bad Request 반환
- [ ] Zod 스키마로 검증 (선택)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- ID 검증 테스트 통과

### Step 4: 컴포넌트에 Loader 데이터 연결

- [ ] useLoaderData 훅으로 데이터 접근
- [ ] 더미 데이터 import 제거
- [ ] InvoiceHeader에 companyInfo, invoice 전달
- [ ] InvoiceTable에 lineItems 전달
- [ ] InvoiceSummary에 금액 정보 전달
- [ ] PDF 다운로드 버튼에 데이터 연결 준비

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 컴포넌트 렌더링 테스트 통과

### Step 5: 로딩 및 에러 상태 처리

- [ ] useNavigation으로 로딩 상태 감지
- [ ] 로딩 중 InvoiceDetailSkeleton 표시
- [ ] API 에러 시 에러 UI 표시 (500 에러)
- [ ] 재시도 버튼 구현

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 상태 처리 테스트 통과

### Step 6: 정리 및 메타 함수 업데이트

- [ ] 더미 데이터 파일 삭제 (`_data/dummy-invoice-detail.ts`)
- [ ] meta 함수 업데이트 (인보이스 번호 동적 표시)
  ```typescript
  export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `Invoice #${data?.invoice.invoice_number}` }];
  };
  ```
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
- [ ] 404 에러 테스트
- [ ] ID 검증 테스트
- [ ] 컴포넌트 데이터 바인딩 테스트
- [ ] 로딩 상태 테스트
- [ ] 에러 상태 테스트

## 참고 사항

- React Router v7 params: loader 함수의 첫 번째 인자에서 추출
- throw Response로 에러 응답 생성
- Notion 페이지 ID 형식: 32자리 hex (UUID without hyphens)
- 보안: params 검증 필수 (사용자 입력으로 간주)
- 병렬 데이터 fetching: Promise.all로 인보이스, 라인 아이템, 회사 정보 동시 요청

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
