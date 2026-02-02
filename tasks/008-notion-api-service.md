# Task 008: Notion API Integration Service

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Notion API 클라이언트를 설정하고 Invoice, InvoiceLineItem, CompanyInfo 데이터를 가져오는 서비스를 구현합니다. Clean Architecture의 Infrastructure Layer에 해당하며, Application Layer의 Port 인터페이스를 구현합니다. Notion API 응답을 도메인 타입으로 변환하는 mapper도 함께 구현합니다.

## 관련 기능

- F003 - Notion Database Integration: Notion 데이터베이스에서 데이터 가져오기
- F007 - Invoice Number Validation: 인보이스 ID 검증 및 존재 여부 확인

## 관련 파일

- `app/application/invoice/invoice.port.ts` - Invoice 서비스 인터페이스 (Port)
- `app/application/invoice/invoice.service.ts` - Invoice 비즈니스 로직
- `app/application/invoice/index.ts` - barrel export
- `app/infrastructure/external/notion/notion.client.ts` - Notion 클라이언트 설정
- `app/infrastructure/external/notion/invoice.repository.impl.ts` - Invoice 리포지토리 구현
- `app/infrastructure/external/notion/notion.mapper.ts` - Notion 응답 → 도메인 타입 변환
- `app/infrastructure/external/notion/index.ts` - barrel export
- `app/infrastructure/config/container.ts` - DI 컨테이너 등록

## 수락 기준

- [ ] Notion API 클라이언트가 환경 변수로 설정됨
- [ ] 모든 인보이스 목록을 가져오는 함수가 동작함
- [ ] 특정 인보이스 ID로 상세 정보를 가져오는 함수가 동작함
- [ ] 인보이스에 연결된 라인 아이템을 가져오는 함수가 동작함
- [ ] 회사 정보를 가져오는 함수가 동작함
- [ ] Notion API 응답이 Zod 스키마로 검증됨
- [ ] 존재하지 않는 인보이스 조회 시 null 반환
- [ ] 모든 테스트 통과 (MSW로 API 모킹)
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: Invoice Port (인터페이스) 정의

- [ ] `app/application/invoice/` 디렉토리 생성
- [ ] `invoice.port.ts` 생성
  ```typescript
  interface InvoiceRepository {
    findAll(): Promise<Invoice[]>;
    findById(invoiceId: string): Promise<InvoiceWithLineItems | null>;
    findLineItems(invoiceId: string): Promise<InvoiceLineItem[]>;
  }

  interface CompanyRepository {
    getCompanyInfo(): Promise<CompanyInfo>;
  }
  ```
- [ ] 에러 타입 정의 (InvoiceNotFoundError 등)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 인터페이스 타입 체크 통과

### Step 2: Notion 클라이언트 설정

- [ ] `app/infrastructure/external/notion/` 디렉토리 생성
- [ ] `notion.client.ts` 생성
  - @notionhq/client의 Client 인스턴스 생성 함수
  - 환경 변수에서 API 키 주입
  - 클라이언트 팩토리 패턴 사용
- [ ] 타입 안전한 클라이언트 export

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 클라이언트 생성 테스트 통과

### Step 3: Notion Mapper 구현

- [ ] `notion.mapper.ts` 생성
  - mapNotionPageToInvoice: Notion 페이지 → Invoice
  - mapNotionPageToLineItem: Notion 페이지 → InvoiceLineItem
  - mapNotionPageToCompanyInfo: Notion 페이지 → CompanyInfo
- [ ] Notion API 응답 타입 정의 (PageObjectResponse)
- [ ] 프로퍼티 추출 헬퍼 함수 (getTextProperty, getNumberProperty, getDateProperty 등)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- mapper 함수 테스트 통과

### Step 4: Invoice Repository 구현

- [ ] `invoice.repository.impl.ts` 생성
  - InvoiceRepository 인터페이스 구현
  - findAll: 인보이스 데이터베이스 쿼리 (정렬: created_at desc)
  - findById: invoice_id로 필터링 쿼리
  - findLineItems: invoice_id relation으로 필터링 쿼리
- [ ] CompanyRepository 구현
  - getCompanyInfo: 단일 레코드 쿼리
- [ ] Zod 스키마로 응답 검증

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- repository 메서드 테스트 통과 (MSW 모킹)

### Step 5: Invoice Service 구현

- [ ] `app/application/invoice/invoice.service.ts` 생성
  - 비즈니스 로직 캡슐화
  - getInvoiceList: 전체 목록 조회
  - getInvoiceDetail: 상세 조회 (인보이스 + 라인 아이템 + 회사 정보)
- [ ] 에러 핸들링 (NotFoundError, APIError)
- [ ] 캐싱 레이어와 통합 준비 (Task 009와 연계)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- service 메서드 테스트 통과

### Step 6: DI 컨테이너 등록 및 통합

- [ ] `app/infrastructure/config/container.ts` 업데이트
  - InvoiceRepository 바인딩
  - CompanyRepository 바인딩
  - InvoiceService 바인딩
- [ ] Barrel export 파일 생성/업데이트
- [ ] 전체 통합 테스트

**완료 조건**:
- 모든 단위 테스트 통과
- DI 컨테이너에서 의존성 주입 동작

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
- [ ] Notion API 호출 테스트 (MSW 모킹)
- [ ] Mapper 함수 테스트
- [ ] Repository 메서드 테스트
- [ ] Service 메서드 테스트
- [ ] 에러 핸들링 테스트
- [ ] Zod 스키마 검증 테스트

## 참고 사항

- @notionhq/client 패키지 이미 설치됨
- Notion API 응답 구조: https://developers.notion.com/reference
- Notion 프로퍼티 타입: title, rich_text, number, date, select, relation, url, email
- MSW (Mock Service Worker) 패키지 이미 설치됨
- Rate Limit 대응은 Task 009 (KV 캐싱)에서 구현
- Clean Architecture: Port → Service → Repository 순서로 의존성 방향

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
