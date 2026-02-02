# Task 013: PDF Document Component

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

@react-pdf/renderer를 사용하여 인보이스를 PDF 문서로 렌더링하는 컴포넌트를 구현합니다. 웹 뷰와 동일한 레이아웃을 재현하고, A4 사이즈에 최적화된 스타일을 적용합니다. 폰트 설정과 스타일시트 정의도 함께 진행합니다.

## 관련 기능

- F002 - PDF Export: PDF 문서 생성

## 관련 파일

- `app/presentation/components/pdf/invoice-pdf-document.tsx` - PDF 문서 컴포넌트
- `app/presentation/components/pdf/pdf-styles.ts` - PDF 스타일시트
- `app/presentation/components/pdf/pdf-fonts.ts` - 폰트 설정
- `app/presentation/components/pdf/index.ts` - barrel export

## 수락 기준

- [ ] InvoicePdfDocument 컴포넌트가 올바르게 렌더링됨
- [ ] PDF 레이아웃이 웹 뷰와 일관성 있음
- [ ] 회사 정보, 고객 정보, 라인 아이템, 합계가 모두 표시됨
- [ ] A4 사이즈 (210mm x 297mm)에 최적화됨
- [ ] 한글 폰트가 올바르게 렌더링됨 (선택)
- [ ] 로고 이미지가 PDF에 포함됨
- [ ] 페이지 번호가 표시됨 (선택)
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: PDF 스타일시트 정의

- [ ] `app/presentation/components/pdf/` 디렉토리 생성
- [ ] `pdf-styles.ts` 생성
  - StyleSheet.create로 스타일 정의
  - page: A4 사이즈, 여백, 배경색
  - header: 회사/고객 정보 영역
  - table: 라인 아이템 테이블
  - summary: 합계 섹션
  - text: 폰트 크기, 색상
- [ ] 웹 뷰 스타일과 최대한 일치하도록 조정

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 스타일 정의 완료

### Step 2: 폰트 설정 (선택)

- [ ] `pdf-fonts.ts` 생성
  - 기본 폰트 사용 또는 커스텀 폰트 등록
  - Font.register로 폰트 파일 등록
  - 한글 폰트 지원 (Noto Sans KR 등)
- [ ] public/fonts/ 디렉토리에 폰트 파일 배치
- [ ] 폰트 로딩 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 폰트 렌더링 확인

### Step 3: PDF 헤더 섹션 구현

- [ ] InvoicePdfHeader 컴포넌트 생성 (또는 Document 내부에 구현)
  - 회사 로고 (Image 컴포넌트)
  - 회사 정보 (이름, 주소, 연락처, Tax ID)
  - 고객 정보 (이름, 이메일, 주소)
  - 인보이스 메타 (번호, 발행일, 마감일, 상태)
- [ ] 레이아웃: 좌측 회사, 우측 고객

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 헤더 섹션 렌더링 테스트 통과

### Step 4: PDF 테이블 섹션 구현

- [ ] InvoicePdfTable 컴포넌트 생성
  - 테이블 헤더: Description, Quantity, Unit Price, Total
  - 테이블 행: lineItems 매핑
  - View와 Text 컴포넌트로 테이블 구조 구현
  - 열 너비 비율 설정
- [ ] 숫자 포맷팅 (통화 기호, 천 단위 구분)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 테이블 섹션 렌더링 테스트 통과

### Step 5: PDF 합계 섹션 구현

- [ ] InvoicePdfSummary 컴포넌트 생성
  - Subtotal
  - Tax (세율 %)
  - Total (강조 표시)
- [ ] 우측 정렬 레이아웃
- [ ] Notes 섹션 (선택)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 합계 섹션 렌더링 테스트 통과

### Step 6: 전체 PDF Document 통합

- [ ] `invoice-pdf-document.tsx` 생성
  ```typescript
  export default function InvoicePdfDocument({
    invoice,
    lineItems,
    companyInfo,
  }: Props) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoicePdfHeader ... />
          <InvoicePdfTable ... />
          <InvoicePdfSummary ... />
        </Page>
      </Document>
    );
  }
  ```
- [ ] 페이지 번호 추가 (선택)
- [ ] 푸터 추가 (선택)
- [ ] barrel export 파일 생성

**완료 조건**:
- 모든 단위 테스트 통과
- PDF 렌더링 정상 동작

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
- [ ] PDF Document 렌더링 테스트
- [ ] 각 섹션 렌더링 테스트
- [ ] 스타일 적용 테스트
- [ ] 폰트 렌더링 테스트
- [ ] 이미지 포함 테스트

## 참고 사항

- @react-pdf/renderer 문서: https://react-pdf.org/
- Cloudflare Workers에서 서버 사이드 PDF 생성 불가 (Edge Runtime 제한)
- 클라이언트 사이드에서만 PDF 생성 가능
- A4 사이즈: 595.28pt x 841.89pt (72dpi 기준)
- 이미지 URL은 CORS 허용 필요 (또는 base64 인코딩)
- 폰트 파일은 public 디렉토리에 배치하거나 CDN URL 사용
- 테스트: jest-pdf 또는 스냅샷 테스트 활용

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
