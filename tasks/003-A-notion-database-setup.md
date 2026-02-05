# Task 003-A: Notion Database Setup

> **NOTE**: 이 작업은 Notion API를 통한 데이터베이스 생성 스크립트입니다.
> 코드 구현이 아닌 인프라 설정 작업이므로 TDD 워크플로우는 해당되지 않습니다.

## Overview

Task 003 (환경 변수 설정)은 완료되었지만, Notion 데이터베이스 "생성" 과정이 누락되었습니다. 이 Task는 Notion API를 통해 Invoice, Line Item 데이터베이스를 자동 생성하고, 기존 Company 데이터베이스를 검증하는 스크립트를 제공합니다.

Task 008 (Notion API Service)은 데이터베이스가 이미 존재한다고 가정하므로, 이 Task를 먼저 완료해야 합니다.

## 관련 기능

- F003 - Notion Database Integration: Invoice, LineItem, CompanyInfo 데이터베이스 구조

## 현재 상태

### Notion 설정 현황
- **Invoice System 페이지**: 생성됨
- **Company 데이터베이스**: 생성됨 (6개 속성)
  - company_name (Title)
  - company_address (Text)
  - company_email (Email)
  - company_phone (Phone)
  - logo_url (URL)
  - tax_id (Text)
- **Invoice 데이터베이스**: 미생성
- **Line Item 데이터베이스**: 미생성

## 관련 파일

- `scripts/setup-notion-databases.ts` - 데이터베이스 생성 스크립트 (생성)
- `.env` - 환경 변수 파일 (Database ID 업데이트)
- `docs/ROADMAP.md` - 로드맵 (Task 추가)

## 수락 기준

- [x] `scripts/setup-notion-databases.ts` 스크립트가 생성됨
- [x] Invoice 데이터베이스가 PRD 스키마에 맞게 생성됨
- [x] Line Item 데이터베이스가 PRD 스키마에 맞게 생성됨
- [x] Line Item → Invoice Relation이 올바르게 설정됨
- [x] Company 데이터베이스 검증 통과 (스킵 - 미설정)
- [x] 생성된 Database ID가 `.env` 파일에 업데이트됨
- [x] ROADMAP.md에 Task 003-A 추가됨

## 데이터베이스 스키마 (PRD 기반)

### Invoice Database

| 속성명 | 타입 | 설명 |
|--------|------|------|
| invoice_id | Title | 고유 식별자 (URL용) |
| invoice_number | Text | 청구서 번호 |
| client_name | Text | 고객명 |
| client_email | Email | 고객 이메일 |
| client_address | Text | 고객 주소 |
| issue_date | Date | 발행일 |
| due_date | Date | 만기일 |
| status | Select | Draft/Sent/Paid/Overdue |
| subtotal | Number | 소계 |
| tax_rate | Number | 세율 (%) |
| tax_amount | Number | 세금액 |
| total_amount | Number | 총액 |
| currency | Select | KRW/USD/EUR |
| notes | Text | 비고 |
| created_at | Date | 생성일 |

### Line Item Database

| 속성명 | 타입 | 설명 |
|--------|------|------|
| description | Title | 항목 설명 |
| invoice | Relation | Invoice 연결 |
| quantity | Number | 수량 |
| unit_price | Number | 단가 |
| line_total | Formula | quantity * unit_price |
| sort_order | Number | 정렬 순서 |

### Company Database (기존)

| 속성명 | 타입 | 설명 |
|--------|------|------|
| company_name | Title | 회사명 |
| company_address | Text | 회사 주소 |
| company_email | Email | 회사 이메일 |
| company_phone | Phone | 회사 전화번호 |
| logo_url | URL | 로고 URL |
| tax_id | Text | 사업자등록번호 |

## 구현 단계

### Step 1: 사전 준비

- [x] Notion에서 Integration 생성 확인
- [x] Invoice System 페이지에 Integration 연결 (Share → Invite → Integration 선택)
- [x] `.env` 파일에 NOTION_API_KEY 설정 확인

**중요**: Integration을 페이지에 연결하지 않으면 API에서 데이터베이스를 생성할 수 없습니다.

### Step 2: 스크립트 실행

```bash
# 스크립트 실행
bun run scripts/setup-notion-databases.ts
```

스크립트가 수행하는 작업:
1. Invoice System 페이지 검색
2. 기존 Company 데이터베이스 검증
3. Invoice 데이터베이스 생성
4. Line Item 데이터베이스 생성 (Invoice와 Relation 연결)
5. 생성된 Database ID 출력

### Step 3: 환경 변수 업데이트

- [x] 스크립트 출력의 Database ID를 `.env` 파일에 복사
  ```
  NOTION_INVOICE_DATABASE_ID=2fbd6380-800d-81d8-96e0-e8fe519d03f5
  NOTION_LINE_ITEM_DATABASE_ID=2fbd6380-800d-8192-908a-e911d3a6b313
  NOTION_COMPANY_DATABASE_ID= (미설정)
  ```

### Step 4: 검증

- [x] Notion에서 Invoice 데이터베이스 확인 (15개 속성)
- [x] Notion에서 Line Item 데이터베이스 확인 (6개 속성)
- [x] Line Item → Invoice Relation 동작 확인
- [x] `bun run dev`로 앱 실행 시 환경 변수 로드 확인

## Mandatory Workflow (CRITICAL)

> 이 Task는 인프라 설정 작업이므로 TDD 워크플로우 대신 수동 검증을 수행합니다.

### Setup Phase
- [x] Integration을 Invoice System 페이지에 연결
- [x] `.env` 파일에 NOTION_API_KEY 설정

### Execution Phase
- [x] `bun run scripts/setup-notion-databases.ts` 실행
- [x] 오류 없이 완료 확인

### Verification Phase
- [x] Notion에서 Invoice 데이터베이스 속성 확인
- [x] Notion에서 Line Item 데이터베이스 속성 확인
- [x] Relation 연결 확인

### Completion Phase
- [x] `.env` 파일에 Database ID 업데이트
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/ROADMAP.md`에서 Task 003-A 완료 표시

## Test Checklist

- [x] 스크립트 실행 성공
- [x] Invoice 데이터베이스 생성 확인
- [x] Line Item 데이터베이스 생성 확인
- [x] Relation 연결 확인
- [x] `.env` 파일 업데이트 확인

## 참고 사항

- Notion API로 데이터베이스 생성 시 부모 페이지에 Integration이 연결되어 있어야 함
- Database ID는 32자리 hex 문자열 (하이픈 없음)
- Formula 속성(line_total)은 API로 직접 생성 가능
- 생성된 데이터베이스는 부모 페이지의 하위에 표시됨

## 문제 해결

### "Could not find parent page" 오류
- Invoice System 페이지에 Integration이 연결되지 않음
- Notion → Share → Invite → Integration 선택

### "Invalid database" 오류
- Database ID가 잘못됨
- Notion URL에서 32자리 ID 확인

### "Missing required properties" 오류
- 스키마 정의에 필수 속성 누락
- 스크립트의 properties 객체 확인

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-02 | Task 003-A 생성 - Notion Database Setup 스크립트 추가 |
| 2026-02-02 | Task 003-A 완료 - Invoice/Line Item 데이터베이스 생성 완료 |
