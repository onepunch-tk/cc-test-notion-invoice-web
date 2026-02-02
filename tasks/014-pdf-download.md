# Task 014: PDF Download Feature

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

@react-pdf/renderer의 PDFDownloadLink 컴포넌트를 사용하여 PDF 다운로드 기능을 구현합니다. 클라이언트 사이드 전용으로 동작하도록 dynamic import를 사용하고, 다운로드 중 로딩 상태를 처리합니다.

## 관련 기능

- F002 - PDF Export: PDF 다운로드 기능

## 관련 파일

- `app/presentation/components/pdf/pdf-download-button.tsx` - 다운로드 버튼 컴포넌트
- `app/presentation/components/pdf/pdf-download-button.client.tsx` - 클라이언트 전용 컴포넌트
- `app/presentation/routes/invoices/$invoiceId.tsx` - 상세 페이지 (수정)
- `app/presentation/components/invoice/invoice-actions.tsx` - 액션 버튼 (수정)

## 수락 기준

- [ ] PDF 다운로드 버튼이 인보이스 상세 페이지에 표시됨
- [ ] 버튼 클릭 시 PDF 파일 다운로드 시작
- [ ] 다운로드 중 로딩 상태 표시 (버튼 비활성화 또는 스피너)
- [ ] 파일명이 invoice_number 기반으로 생성됨 (예: INV-001.pdf)
- [ ] 클라이언트 사이드에서만 PDF 생성됨 (SSR 에러 없음)
- [ ] 서버 사이드 렌더링 시 폴백 UI 표시
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 클라이언트 전용 PDF 다운로드 컴포넌트 구현

- [ ] `pdf-download-button.client.tsx` 생성
  - PDFDownloadLink 컴포넌트 사용
  - InvoicePdfDocument 컴포넌트 렌더링
  - Props: invoice, lineItems, companyInfo, fileName
  - 로딩 상태 처리 (loading prop)
- [ ] 파일명 생성 로직
  ```typescript
  const fileName = `${invoice.invoice_number}.pdf`;
  ```

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 클라이언트 컴포넌트 동작 테스트 통과

### Step 2: SSR 호환 래퍼 컴포넌트 구현

- [ ] `pdf-download-button.tsx` 생성
  - React.lazy 또는 dynamic import 사용
  - Suspense로 로딩 폴백 제공
  - 또는 ClientOnly 패턴 사용
  ```typescript
  const PdfDownloadButtonClient = React.lazy(
    () => import('./pdf-download-button.client')
  );
  ```
- [ ] SSR 시 폴백 버튼 표시 (비활성화 상태)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- SSR 에러 없이 렌더링

### Step 3: 로딩 상태 UI 구현

- [ ] PDFDownloadLink의 loading prop 활용
  ```typescript
  <PDFDownloadLink document={<InvoicePdfDocument {...} />} fileName={fileName}>
    {({ loading }) => (
      <Button disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download PDF'}
      </Button>
    )}
  </PDFDownloadLink>
  ```
- [ ] 로딩 스피너 또는 프로그레스 표시
- [ ] 버튼 비활성화

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 로딩 상태 전환 테스트 통과

### Step 4: InvoiceActions 컴포넌트 업데이트

- [ ] `invoice-actions.tsx` 수정
  - 플레이스홀더 버튼을 PdfDownloadButton으로 교체
  - invoice, lineItems, companyInfo props 전달
  - 버튼 그룹 레이아웃 유지
- [ ] Print 버튼과의 시각적 일관성 유지

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 액션 버튼 렌더링 테스트 통과

### Step 5: 인보이스 상세 페이지 통합

- [ ] `$invoiceId.tsx`에서 InvoiceActions에 데이터 전달
  - loader 데이터에서 invoice, lineItems, companyInfo 추출
  - InvoiceActions 컴포넌트에 props 전달
- [ ] PDF 다운로드 end-to-end 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 통합 테스트 통과

### Step 6: 에러 핸들링 및 최적화

- [ ] PDF 생성 실패 시 에러 처리
  - try-catch 또는 ErrorBoundary
  - 사용자 친화적 에러 메시지
- [ ] 대용량 인보이스 처리 (라인 아이템 많을 때)
- [ ] 브라우저 호환성 테스트 (Chrome, Firefox, Safari)

**완료 조건**:
- 모든 단위 테스트 통과
- PDF 다운로드 기능 완전 동작

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
- [ ] 다운로드 버튼 렌더링 테스트
- [ ] 클릭 이벤트 테스트
- [ ] 로딩 상태 테스트
- [ ] 파일명 생성 테스트
- [ ] SSR 호환성 테스트
- [ ] 에러 핸들링 테스트

## 참고 사항

- @react-pdf/renderer는 브라우저 환경에서만 동작
- Cloudflare Workers (Edge Runtime)에서 서버 사이드 PDF 생성 불가
- PDFDownloadLink vs usePDF hook: 다운로드 링크가 더 간단
- blob() 메서드로 Blob 객체 얻어 수동 다운로드도 가능
- React Router v7에서 클라이언트 전용 컴포넌트: .client.tsx 접미사 또는 lazy import
- 파일명에 특수문자 포함 시 인코딩 필요

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
