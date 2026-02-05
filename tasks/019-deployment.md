# Task 019: Production Deployment

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

Cloudflare Workers에 프로덕션 환경을 구성하고 배포합니다. 환경 변수 설정, KV 스토리지 구성, 도메인 설정, 모니터링 설정을 포함합니다.

## 관련 기능

- All Features (F001-F009): 프로덕션 환경 배포

## 관련 파일

- `wrangler.toml` - 배포 설정
- `.env` - 환경 변수 (로컬)
- `.env.production` - 프로덕션 환경 변수
- `docs/NOTE.md` - 배포 체크리스트 및 노트

## 수락 기준

- [ ] Cloudflare Workers에 성공적으로 배포됨
- [ ] 프로덕션 환경 변수가 올바르게 설정됨
- [ ] Cloudflare KV가 프로덕션 환경에 구성됨
- [ ] 커스텀 도메인이 연결됨 (해당 시)
- [ ] HTTPS가 활성화됨
- [ ] 프로덕션 환경에서 실제 Notion 데이터로 동작
- [ ] 모니터링 및 로깅이 활성화됨
- [ ] 롤백 절차가 문서화됨
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 배포 전 체크리스트

- [ ] 환경 변수 확인
  - NOTION_API_KEY 설정
  - NOTION_INVOICE_DATABASE_ID 설정
  - NOTION_LINE_ITEM_DATABASE_ID 설정
  - NOTION_COMPANY_DATABASE_ID 설정
- [ ] Cloudflare KV namespace 생성 및 ID 설정
- [ ] wrangler.toml 프로덕션 설정 확인
- [ ] 빌드 테스트: `bun run build:cloudflare`
- [ ] 타입 체크: `bun run typecheck`
- [ ] 린트: `bun run lint`

**완료 조건**:
- 모든 체크리스트 항목 확인
- 배포 준비 완료

### Step 2: Staging 환경 배포 및 테스트

- [ ] Staging 환경 배포
  ```bash
  wrangler deploy --env staging
  ```
- [ ] Staging 환경 변수 설정
  ```bash
  wrangler secret put NOTION_API_KEY --env staging
  wrangler secret put NOTION_INVOICE_DATABASE_ID --env staging
  wrangler secret put NOTION_LINE_ITEM_DATABASE_ID --env staging
  ```
- [ ] Staging URL에서 전체 기능 테스트
- [ ] 실제 Notion 데이터로 동작 확인
- [ ] 캐싱 동작 확인
- [ ] 에러 로깅 확인 (Cloudflare Dashboard)

**완료 조건**:
- Staging 환경 배포 성공
- Staging 테스트 통과

### Step 3: Production 환경 배포

- [ ] Production KV namespace 생성
  ```bash
  wrangler kv namespace create INVOICE_CACHE
  ```
- [ ] Production 환경 변수 설정
  ```bash
  wrangler secret put NOTION_API_KEY
  wrangler secret put NOTION_INVOICE_DATABASE_ID
  wrangler secret put NOTION_LINE_ITEM_DATABASE_ID
  ```
- [ ] Production 배포
  ```bash
  wrangler deploy
  ```
- [ ] Production URL에서 스모크 테스트

**완료 조건**:
- Production 배포 성공
- 스모크 테스트 통과

### Step 4: 도메인 및 DNS 설정

- [ ] 커스텀 도메인 연결 (해당 시)
  ```bash
  wrangler deploy --route "yourdomain.com/*"
  ```
- [ ] DNS 레코드 설정 (Cloudflare DNS)
- [ ] SSL/TLS 인증서 확인
- [ ] www 리다이렉트 설정 (해당 시)

**완료 조건**:
- 도메인 연결 완료
- HTTPS 동작 확인

### Step 5: 모니터링 및 알림 설정

- [ ] Cloudflare Analytics 활성화
- [ ] 에러 알림 설정 (Workers 대시보드)
- [ ] Uptime 모니터링 설정 (Cloudflare 또는 외부)
- [ ] 로그 보존 기간 설정
- [ ] `wrangler tail`로 실시간 로그 확인

**완료 조건**:
- 모니터링 활성화
- 알림 설정 완료

### Step 6: 배포 완료 문서화

- [ ] 배포 완료 정보 문서화 (docs/NOTE.md)
  - Production URL
  - 배포 날짜/시간
  - 배포 버전
- [ ] 롤백 절차 문서화
  ```bash
  wrangler rollback
  ```
- [ ] 환경 변수 목록 문서화 (값 제외)
- [ ] ROADMAP.md 최종 업데이트

**완료 조건**:
- 모든 문서화 완료
- ROADMAP 업데이트 완료

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
- [ ] Staging 배포 테스트
- [ ] Production 스모크 테스트
- [ ] 도메인 및 HTTPS 테스트
- [ ] 모니터링 동작 테스트

## 참고 사항

- Cloudflare Workers 배포: `wrangler deploy`
- 환경 변수 설정: `wrangler secret put <KEY>`
- 로그 확인: `wrangler tail`
- KV 생성: `wrangler kv namespace create <NAME>`
- 롤백: `wrangler rollback`
- 프로덕션 배포 전 반드시 Staging 테스트 수행
- 배포 후 모니터링 대시보드 확인

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
