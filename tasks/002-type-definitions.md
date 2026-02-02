# Task 002: Type Definitions and Interface Design

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Invoice-Web MVP에서 사용되는 모든 도메인 타입과 인터페이스를 정의합니다. PRD의 Data Model을 기반으로 Invoice, InvoiceLineItem, CompanyInfo 타입을 정의하고, Notion API 응답 검증을 위한 Zod 스키마를 작성합니다. Clean Architecture의 Domain Layer에 해당하는 작업입니다.

## 관련 기능

- F003 - Notion Database Integration: Notion 데이터베이스 스키마와 매핑되는 타입 정의
- F007 - Invoice Number Validation: 인보이스 ID 검증을 위한 타입 정의

## 관련 파일

- `app/domain/invoice/invoice.types.ts` - Invoice 관련 타입 정의
- `app/domain/invoice/invoice.schemas.ts` - Invoice Zod 스키마
- `app/domain/invoice/invoice.entity.ts` - Invoice 엔티티 클래스
- `app/domain/invoice/index.ts` - barrel export
- `app/domain/company/company.types.ts` - CompanyInfo 타입 정의
- `app/domain/company/company.schemas.ts` - CompanyInfo Zod 스키마
- `app/domain/company/index.ts` - barrel export
- `app/domain/index.ts` - 전체 domain barrel export

## 수락 기준

- [x] Invoice 타입이 PRD Data Model의 모든 필드를 포함
- [x] InvoiceLineItem 타입이 PRD Data Model의 모든 필드를 포함
- [x] CompanyInfo 타입이 PRD Data Model의 모든 필드를 포함
- [x] 모든 타입에 대응하는 Zod 스키마가 존재
- [x] InvoiceStatus enum이 정의됨 (Draft, Sent, Paid, Overdue)
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: Invoice 도메인 타입 정의

- [x] `app/domain/invoice/` 디렉토리 생성
- [x] `invoice.types.ts` 생성
  - Invoice 인터페이스 (invoice_id, invoice_number, client_name, client_email, client_address, issue_date, due_date, status, subtotal, tax_rate, tax_amount, total_amount, currency, notes, created_at)
  - InvoiceLineItem 인터페이스 (id, invoice_id, description, quantity, unit_price, line_total, sort_order)
  - InvoiceStatus enum (Draft, Sent, Paid, Overdue)
  - InvoiceWithLineItems 복합 타입

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 타입 체크 통과 (`bun run typecheck`)

### Step 2: Invoice Zod 스키마 정의

- [x] `invoice.schemas.ts` 생성
  - invoiceSchema: Invoice 타입 검증
  - invoiceLineItemSchema: InvoiceLineItem 타입 검증
  - invoiceStatusSchema: InvoiceStatus enum 검증
  - invoiceWithLineItemsSchema: 복합 타입 검증
- [x] 각 스키마에서 타입 추론 (z.infer) 테스트

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 스키마 parse/safeParse 테스트 통과

### Step 3: CompanyInfo 도메인 타입 정의

- [x] `app/domain/company/` 디렉토리 생성
- [x] `company.types.ts` 생성
  - CompanyInfo 인터페이스 (company_name, company_address, company_email, company_phone, logo_url, tax_id)
- [x] `company.schemas.ts` 생성
  - companyInfoSchema: CompanyInfo 타입 검증

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 스키마 parse/safeParse 테스트 통과

### Step 4: Barrel Export 및 통합

- [x] `app/domain/invoice/index.ts` 생성 (타입, 스키마 export)
- [x] `app/domain/company/index.ts` 생성 (타입, 스키마 export)
- [x] `app/domain/index.ts` 업데이트 (invoice, company export 추가)
- [x] 전체 import/export 경로 테스트

**완료 조건**:
- 모든 단위 테스트 통과
- `~/domain` 경로로 import 가능

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
- [x] 미해결 이슈 모두 수정 (Biome import 정렬 4건 수정)

### E2E Test Phase
- [N/A] `e2e-tester` 서브에이전트 호출 (Task tool 사용) - 도메인 레이어 타입 정의로 UI 없음
- [N/A] E2E 테스트 통과 확인 - 도메인 레이어 타입 정의로 UI 없음

### Completion Phase
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/NOTE.md`에 배운 점 기록
- [x] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [x] Unit tests written via `unit-test-writer`
- [N/A] E2E tests written via `e2e-tester` - 도메인 레이어 타입 정의로 UI 없음
- [x] All tests passing (60/60)
- [x] Zod 스키마 유효한 데이터 parse 테스트
- [x] Zod 스키마 무효한 데이터 reject 테스트
- [x] 타입 추론 정확성 테스트

## 참고 사항

- PRD Data Model 섹션 참고
- Zod v4 문법 사용 (z.object, z.string, z.number, z.date, z.enum)
- 날짜 필드는 z.coerce.date() 사용 권장 (Notion API 응답이 문자열)
- currency 필드는 문자열로 정의 (USD, KRW 등)
- BaseEntity 상속 대신 독립적인 타입 정의 (Notion 데이터 구조에 맞춤)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-31 | Task 완료 - Invoice, InvoiceLineItem, CompanyInfo 타입 및 Zod 스키마 구현, 60개 테스트 통과 |
