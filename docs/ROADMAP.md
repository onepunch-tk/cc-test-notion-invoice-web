# Invoice-Web Development Roadmap

Notion 기반 인보이스 데이터를 웹 페이지로 변환하고 PDF 다운로드 기능을 제공하는 서비스

## Overview

Invoice-Web은 관리자(Notion에서 인보이스 관리)와 클라이언트(웹에서 인보이스 조회/다운로드)를 위해 다음 기능을 제공합니다:

- **Invoice Detail View (F001)**: 인보이스 상세 정보 표시 (회사 정보, 고객 정보, 라인 아이템, 금액, 날짜)
- **PDF Export (F002)**: @react-pdf/renderer를 활용한 클라이언트 사이드 PDF 다운로드
- **Notion Integration (F003)**: Notion 데이터베이스 실시간 연동 및 Cloudflare KV 캐싱
- **Invoice List View (F004)**: 모든 인보이스 목록 표시 및 상세 페이지 네비게이션
- **Responsive Design (F005)**: 모바일/데스크톱 반응형 레이아웃 및 인쇄 최적화

## Development Workflow

1. **Task Planning**

- 기존 코드베이스를 학습하고 현재 상태 파악
- `ROADMAP.md`를 업데이트하여 새로운 작업 추가
- 마지막으로 완료된 작업 다음에 우선순위 작업 삽입

2. **Task Creation**

- 기존 코드베이스를 학습하고 현재 상태 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 파일명 형식: `XXX-description.md` (예: `001-setup.md`)
- 상위 사양, 관련 파일, 수락 기준, 구현 단계 포함
- **반드시 "## Test Checklist" 섹션 포함** (CLAUDE.md Workflow Step 6, 10 참고)
- **반드시 "## Mandatory Workflow (CRITICAL)" 섹션 포함** (서브에이전트 호출 체크박스)
- `/tasks` 디렉토리의 마지막 완료된 작업을 참조 예시로 사용
- 완료된 작업은 최종 상태를 반영 (체크된 박스, 변경 요약). 새 작업은 빈 박스로 시작
- 초기 상태 샘플은 `000-sample.md` 참조

3. **Task Implementation**

- 작업 파일의 사양 따르기
- 기능 구현
- 각 단계 완료 후 작업 파일 내 진행 상황 업데이트
- **테스트는 CLAUDE.md Development Workflow 준수**
- **필수**: "## Mandatory Workflow (CRITICAL)" 섹션의 모든 체크박스 완료
- **필수**: 테스트 커버리지 90% 이상 달성 (`bun run test:coverage:check`)
- 테스트 통과 확인 후 다음 단계 진행
- 각 단계 완료 후 중지하고 추가 지시 대기

4. **Task Completion & Roadmap Update**

- **CRITICAL**: `/tasks/XXX-description.md` 작업 파일 업데이트:
  - 완료된 항목에 `[x]` 체크박스 표시
  - Change History 테이블에 날짜와 변경 사항 요약 기록
- ROADMAP.md에 완료된 작업 ✅ 표시
- 완료된 작업에 `**Must** Read:` 참조 링크 추가

## Infrastructure & Tooling

### Test Coverage Infrastructure - ✅ Complete (2026-02-05)

테스트 커버리지 측정 및 검증 기능 추가:

- **Modified Files**:
  - `package.json`: `test:coverage`, `test:coverage:check` 스크립트 추가
  - `vitest.config.ts`: 커버리지 임계값 설정 (90% statements/branches/functions/lines)
  - `.claude/agents/dev/unit-test-writer.md`: Step 6에 커버리지 검증 단계 추가
  - `CLAUDE.md`: 워크플로우 간소화 (NOTE.md 단계 제거), Test Commands 섹션 추가

- **Test Commands**:
  - `bun run test:coverage`: 커버리지 리포트 생성
  - `bun run test:coverage:check`: 유연한 임계값으로 커버리지 검증

## Development Phases

### Phase 1: Application Skeleton Build ✅

- **Task 001: Project Structure and Routing Setup** ✅ - Completed
  - blockedBy: none
  - blocks: Task 002, Task 003, Task 003-A
  - **Must** Read: [001-route-structure.md](/tasks/001-route-structure.md)
  - ✅ React Router v7 기반 전체 라우트 구조 생성
  - ✅ 모든 주요 페이지의 빈 쉘 파일 생성 (Invoice List, Invoice Detail, 404)
  - ✅ 공통 레이아웃 컴포넌트 스켈레톤 구현
  - Related: F004, F006, F009

- **Task 002: Type Definitions and Interface Design** ✅ - Completed
  - blockedBy: Task 001
  - blocks: Task 004, Task 005, Task 006, Task 008
  - **Must** Read: [002-type-definitions.md](/tasks/002-type-definitions.md)
  - ✅ Invoice, InvoiceLineItem, CompanyInfo TypeScript 인터페이스 및 타입 정의
  - ✅ Zod 스키마 정의 (Notion API 응답 검증용)
  - ✅ Notion API 응답 타입 정의
  - Related: F003, F007

- **Task 003: Environment Variables and Configuration** ✅ - Completed
  - blockedBy: Task 001
  - blocks: Task 003-A, Task 008, Task 009
  - **Must** Read: [003-env-config.md](/tasks/003-env-config.md)
  - ✅ Notion API 환경 변수 스키마 정의 (NOTION_API_KEY, DATABASE_IDs)
  - ✅ Cloudflare KV 바인딩 설정
  - ✅ Wrangler 설정 업데이트
  - Related: F003

- **Task 003-A: Notion Database Setup** ✅ - Completed
  - blockedBy: Task 003
  - blocks: Task 008
  - **Must** Read: [003-A-notion-database-setup.md](/tasks/003-A-notion-database-setup.md)
  - ✅ Notion API를 통한 Invoice, Line Item 데이터베이스 자동 생성
  - ✅ Company 데이터베이스 검증
  - ✅ `scripts/setup-notion-databases.ts` 스크립트 제공
  - Generated Database IDs:
    - Invoice: `2fbd6380-800d-81d8-96e0-e8fe519d03f5`
    - Line Item: `2fbd6380-800d-8192-908a-e911d3a6b313`
  - Related: F003

### Phase 2: UI/UX Completion (Using Dummy Data) ✅

- **Task 004: Common Component Library Implementation** ✅ - Completed
  - blockedBy: Task 001, Task 002
  - blocks: Task 005, Task 006, Task 007
  - **Must** Read: [004-component-library.md](/tasks/004-component-library.md)
  - ✅ shadcn/ui 기반 공통 컴포넌트 구현 (Button, Card, Table, Badge, Skeleton)
  - ✅ 인보이스 관련 UI 컴포넌트 (InvoiceCard, InvoiceTable, InvoiceHeader, InvoiceSummary)
  - ✅ format utilities (formatCurrency, formatDate) 및 invoice-utils (getStatusBadgeVariant)
  - ✅ 132개 테스트 통과, 코드/보안 리뷰 완료
  - Related: F005

- **Task 005: Invoice List Page UI** ✅ - Completed
  - blockedBy: Task 004
  - blocks: Task 010
  - **Must** Read: [005-invoice-list-ui.md](/tasks/005-invoice-list-ui.md)
  - ✅ 인보이스 목록 페이지 UI 구현 (하드코딩된 더미 데이터 사용)
  - ✅ InvoiceCard 그리드 레이아웃 (반응형: 1/2/3열)
  - ✅ 로딩 스켈레톤 (InvoiceListSkeleton) 및 빈 상태 UI (EmptyInvoiceList)
  - ✅ 8개 더미 Invoice 데이터 (Draft 2, Sent 2, Paid 3, Overdue 1, KRW/USD 혼합)
  - ✅ 185개 테스트 통과, 코드/보안 리뷰 완료
  - Related: F004, F005, F008, F009

- **Task 006: Invoice Detail Page UI** ✅ - Completed
  - blockedBy: Task 004
  - blocks: Task 011
  - **Must** Read: [006-invoice-detail-ui.md](/tasks/006-invoice-detail-ui.md)
  - ✅ 인보이스 상세 페이지 UI 구현 (하드코딩된 더미 데이터 사용)
  - ✅ 회사 정보, 고객 정보, 라인 아이템 테이블, 합계 섹션
  - ✅ 인쇄 최적화 레이아웃 (A4 사이즈)
  - ✅ PDF 다운로드 버튼 플레이스홀더
  - ✅ 271개 테스트 통과, E2E 10/10 통과, 코드/보안 리뷰 완료
  - Related: F001, F005, F006, F008, F009

- **Task 007: Error Pages and States UI** ✅ - Completed
  - blockedBy: Task 004
  - blocks: none
  - **Must** Read: [007-error-pages-ui.md](/tasks/007-error-pages-ui.md)
  - ✅ NotFoundState 컴포넌트 (FileQuestion 아이콘, 커스터마이즈 가능한 props)
  - ✅ ErrorState 컴포넌트 (error/warning variant, onRetry 콜백 지원)
  - ✅ ErrorBoundary 개선 (404/일반 에러 분기, 에러 메시지 sanitization)
  - ✅ CatchAll 라우트 ($.tsx) NotFoundState 적용
  - ✅ 접근성: role="status/alert", aria-live 속성 적용
  - ✅ 319개 단위 테스트 통과, E2E 10/10 통과, 코드/보안/성능 리뷰 완료
  - Related: F009

### Phase 3: Core Feature Implementation

- **Task 008: Notion API Integration Service** ✅ - Completed
  - blockedBy: Task 002, Task 003, Task 003-A
  - blocks: Task 010, Task 011, Task 012
  - **Must** Read: [008-notion-api-service.md](/tasks/008-notion-api-service.md)
  - ✅ Notion API 클라이언트 설정 (@notionhq/client)
  - ✅ Invoice, LineItem, CompanyInfo 데이터 fetching 서비스 구현
  - ✅ Notion API 응답을 도메인 타입으로 변환하는 mapper 구현
  - ✅ Zod 스키마로 응답 검증
  - Related: F003, F007

- **Task 009: Cloudflare KV Caching Layer** ✅ - Completed
  - blockedBy: Task 003
  - blocks: Task 010, Task 011
  - **Must** Read: [009-kv-caching.md](/tasks/009-kv-caching.md)
  - ✅ Cloudflare KV 캐싱 서비스 구현 (CacheService 인터페이스, KVCacheService 구현체)
  - ✅ TTL 설정 (Invoice List: 5분, Invoice Detail: 10분, Company Info: 15분)
  - ✅ Rate Limiting 구현 (Sliding Window 알고리즘, Notion API 3 req/sec 준수)
  - ✅ Circuit Breaker 패턴 구현 (CLOSED/OPEN/HALF-OPEN 상태 관리)
  - ✅ Cached Repository 구현 (CachedInvoiceRepository, CachedCompanyRepository)
  - ✅ Null Services 구현 (로컬 개발/테스트용 투명 폴백)
  - ✅ **[Security]** Cache key 입력 검증 (인젝션 방지)
  - ✅ 539개 테스트 통과 (42개 신규 캐싱 레이어 테스트 포함)
  - Related: F003

- **Task 010: Invoice List Page Data Integration** ✅ - Completed
  - blockedBy: Task 005, Task 008, Task 009
  - blocks: Task 012
  - **Must** Read: [010-invoice-list-data.md](/tasks/010-invoice-list-data.md)
  - ✅ 인보이스 목록 페이지에 실제 Notion 데이터 연동
  - ✅ loader 함수 구현 (서버 사이드 데이터 fetching)
  - ✅ ErrorBoundary 에러 핸들링 구현
  - ✅ 더미 데이터 제거 및 useLoaderData 연동
  - ✅ createRoutesStub 활용 종합 테스트 작성
  - Related: F003, F004, F008, F009

- **Task 011: Invoice Detail Page Data Integration** ✅ - Completed
  - blockedBy: Task 006, Task 008, Task 009
  - blocks: Task 012
  - **Must** Read: [011-invoice-detail-data.md](/tasks/011-invoice-detail-data.md)
  - ✅ 인보이스 상세 페이지에 실제 Notion 데이터 연동
  - ✅ loader 함수 구현 (Zod 기반 invoiceId 검증, DI 컨테이너 서비스 호출)
  - ✅ 404/400/500 에러 처리 (InvoiceNotFoundError, 검증 실패, 서버 에러)
  - ✅ 더미 데이터 제거 및 useLoaderData 연동
  - ✅ 동적 meta 함수 (Invoice #{number})
  - ✅ 567개 테스트 통과, 코드 리뷰 완료
  - Related: F001, F003, F006, F007, F008, F009

- **Task 012: Core Feature Integration Testing**
  - blockedBy: Task 008, Task 010, Task 011
  - blocks: none
  - See: `/tasks/012-integration-testing.md`
  - API 통합 테스트 (MSW 활용)
  - 비즈니스 로직 검증
  - 에러 핸들링 및 엣지 케이스 테스트
  - Related: F003, F007, F008, F009

### Phase 4: PDF Export and Polish

- **Task 013: PDF Document Component** ✅ - Completed
  - blockedBy: none
  - blocks: Task 014
  - **Must** Read: [013-pdf-document.md](/tasks/013-pdf-document.md)
  - ✅ @react-pdf/renderer v4.3.2 기반 InvoicePdfDocument 컴포넌트 구현
  - ✅ 웹 뷰와 동일한 레이아웃 (Header/BillTo/Table/Summary/Notes)
  - ✅ A4 사이즈 최적화 PDF StyleSheet
  - ✅ 한글 폰트 등록 유틸리티 (NotoSansKR)
  - ✅ 567개 테스트 통과 (39개 PDF 관련 테스트 포함)
  - Related: F002

- **Task 014: PDF Download Feature** ✅ - Completed
  - blockedBy: Task 013
  - blocks: Task 015
  - **Must** Read: [014-pdf-download.md](/tasks/014-pdf-download.md)
  - ✅ PdfDownloadButtonClient (.client.tsx) — PDFDownloadLink 기반 클라이언트 전용
  - ✅ PdfDownloadButton — React.lazy + Suspense SSR 래퍼
  - ✅ InvoiceActions 통합 — 플레이스홀더 → 실제 PDF 다운로드 버튼
  - ✅ 파일명 규칙: `${invoice_number}.pdf`
  - ✅ SSRF 방지: company.schemas.ts에 logo_url HTTPS 강제 + 내부 IP 차단
  - ✅ 661개 테스트 통과, 코드 리뷰 Grade A
  - Related: F002

- **Task 015: Performance Optimization** ✅ - Completed
  - blockedBy: Task 014
  - blocks: Task 018
  - **Must** Read: [015-performance.md](/tasks/015-performance.md)
  - ✅ PDF 라이브러리 lazy loading (React.lazy + Suspense, 이전 Task 014에서 완료)
  - ✅ 이미지 최적화 (loading="lazy", decoding="async", width/height for CLS)
  - ✅ Cache-Control 헤더 (entry.server 기본 + per-route s-maxage 설정)
  - ✅ Dead dependency 제거 (date-fns)
  - ✅ 번들 분석 도구 추가 (rollup-plugin-visualizer, build:analyze script)
  - ✅ 683개 테스트 통과, 코드 리뷰 완료
  - Related: F003, F005

- **Task 016: Security and Input Validation** - Priority
  - blockedBy: none
  - blocks: Task 018
  - See: `/tasks/016-security.md`
  - invoice_id 형식 검증 (인젝션 방지)
  - Notion 데이터 sanitization (XSS 방지)
  - **[Security]** NoSQL Injection 방지: 라우트 파라미터 (`invoiceId`) Zod 검증
  - **[Security]** Security Headers 설정: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
  - **[Security]** CORS 설정 (필요시)
  - Related: F006, F007

- **Task 017: Accessibility Audit and Fixes** - Priority
  - blockedBy: none
  - blocks: Task 018
  - See: `/tasks/017-accessibility.md`
  - 키보드 네비게이션 검증 및 개선
  - 스크린 리더 호환성 확인
  - 색상 대비 WCAG 2.1 AA 준수
  - ARIA 라벨 및 시맨틱 마크업 검증
  - Related: F005

- **Task 018: Final QA and Testing**
  - blockedBy: Task 015, Task 016, Task 017
  - blocks: Task 019
  - See: `/tasks/018-final-qa.md`
  - 전체 기능 통합 테스트
  - 크로스 브라우저 테스트 (Chrome, Firefox, Safari, Edge)
  - 모바일 반응형 테스트 (iOS Safari, Android Chrome)
  - Related: All Features

- **Task 019: Production Deployment**
  - blockedBy: Task 018
  - blocks: none
  - See: `/tasks/019-deployment.md`
  - Cloudflare Workers 배포 설정
  - 환경 변수 및 시크릿 설정
  - 도메인 및 DNS 구성
  - 배포 검증 및 모니터링 설정
  - Related: All Features
