# Task 003: Environment Variables and Configuration

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Notion API 연동과 Cloudflare KV 캐싱에 필요한 환경 변수를 정의하고 설정합니다. 기존 `adapters/shared/env.ts`의 envSchema를 확장하여 NOTION_API_KEY, DATABASE_ID들을 추가하고, Cloudflare KV 바인딩을 wrangler.toml에 설정합니다.

## 관련 기능

- F003 - Notion Database Integration: Notion API 키 및 데이터베이스 ID 환경 변수

## 관련 파일

- `adapters/shared/env.ts` - 환경 변수 스키마 정의 (수정)
- `wrangler.toml` - Cloudflare Workers 설정 (수정)
- `worker-configuration.d.ts` - Cloudflare 타입 정의 (자동 생성)
- `.env.example` - 개발 환경 변수 예시 파일 (생성)

## 수락 기준

- [x] NOTION_API_KEY 환경 변수가 envSchema에 정의됨
- [x] NOTION_INVOICE_DATABASE_ID 환경 변수가 envSchema에 정의됨
- [x] NOTION_LINE_ITEM_DATABASE_ID 환경 변수가 envSchema에 정의됨
- [x] NOTION_COMPANY_DATABASE_ID 환경 변수가 envSchema에 정의됨
- [x] Cloudflare KV namespace가 wrangler.toml에 설정됨
- [x] 환경 변수 검증 로직이 동작함
- [x] 모든 테스트 통과
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: 환경 변수 스키마 확장

- [x] `adapters/shared/env.ts` 수정
  - NOTION_API_KEY: z.string() (필수)
  - NOTION_INVOICE_DATABASE_ID: z.string() (필수)
  - NOTION_LINE_ITEM_DATABASE_ID: z.string() (필수)
  - NOTION_COMPANY_DATABASE_ID: z.string() (필수)
- [x] AppEnv 타입이 자동으로 업데이트됨 확인
- [x] ENV_KEYS 배열이 자동으로 업데이트됨 확인

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 타입 체크 통과

### Step 2: Cloudflare KV 바인딩 설정

- [x] `wrangler.toml` 수정
  - KV namespace 바인딩 추가 (INVOICE_CACHE)
  - 주석 해제 및 placeholder ID 설정
- [x] `bun run cf:typegen` 실행하여 타입 생성
- [x] `worker-configuration.d.ts`에 KV 타입 추가됨 확인

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- wrangler types 명령 성공

### Step 3: 개발 환경 변수 예시 파일 생성

- [x] `.env.example` 파일 생성
  - 모든 필수 환경 변수의 placeholder 값 포함
  - 각 변수에 대한 설명 주석 추가
- [x] `.gitignore`에 `.env` 추가 확인 (실제 값 제외)
- [x] `bun run cf:typegen` 실행하여 Cloudflare 타입 생성
- [x] README나 CLAUDE.md에 환경 변수 설정 안내 참조 추가

**완료 조건**:
- 예시 파일이 명확한 가이드 제공
- 보안에 민감한 값이 gitignore됨

### Step 4: 환경 변수 유효성 검증 테스트

- [x] parseEnv 함수로 유효한 환경 변수 파싱 테스트
- [x] 필수 환경 변수 누락 시 ZodError 발생 테스트
- [x] extractEnvFromSource 함수 동작 테스트

**완료 조건**:
- 모든 단위 테스트 통과
- 환경 변수 검증 로직 정상 동작

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
- [x] `e2e-tester` 서브에이전트 호출 (Task tool 사용) - N/A (환경 변수 설정은 E2E 테스트 대상 아님)
- [x] E2E 테스트 통과 확인 - N/A

### Completion Phase
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/NOTE.md`에 배운 점 기록
- [x] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [x] Unit tests written via `unit-test-writer`
- [x] E2E tests written via `e2e-tester` - N/A (환경 변수 설정은 E2E 대상 아님)
- [x] All tests passing (16 unit tests)
- [x] 환경 변수 파싱 성공 테스트
- [x] 환경 변수 누락 시 에러 테스트
- [x] 타입 안정성 테스트

## 참고 사항

- Notion API Key는 Notion Integration에서 발급
- Database ID는 Notion 데이터베이스 URL에서 추출 (32자리 hex)
- Cloudflare KV namespace는 `bunx wrangler kv namespace create INVOICE_CACHE`로 생성
- 로컬 개발 시 `.env` 파일 사용 (wrangler dev 자동 로드)
- 환경 변수 변경 후 `bun run cf:typegen` 실행하여 타입 재생성
- 프로덕션 환경 변수는 Cloudflare Dashboard 또는 `wrangler secret put` 사용

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-31 | Task 003 완료 - 4개 Notion 환경 변수 추가, KV 바인딩 설정, 16개 단위 테스트 통과 |
| 2026-02-02 | `.dev.vars` → `.env` 방식으로 변경, `bun run cf:typegen` 호출 방식 문서화 |
