# Task 017: Final QA and Deployment

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

전체 MVP 기능의 최종 품질 검증 및 Cloudflare Workers 배포를 진행합니다. 전체 기능 통합 테스트, 크로스 브라우저 테스트, 모바일 반응형 테스트를 수행하고, 프로덕션 환경에 배포합니다.

## 관련 기능

- All Features (F001-F009): 전체 기능 통합 테스트

## 관련 파일

- `wrangler.toml` - 배포 설정
- `.env` - 환경 변수 (로컬)
- `__tests__/e2e/` - E2E 테스트 파일들
- `docs/NOTE.md` - 배포 체크리스트 및 노트

## 수락 기준

- [ ] 모든 MVP 기능 (F001-F009)이 정상 동작함
- [ ] Chrome, Firefox, Safari에서 테스트 통과
- [ ] 모바일 (iOS, Android) 뷰에서 정상 동작
- [ ] PDF 다운로드가 모든 브라우저에서 동작
- [ ] 인쇄 기능이 정상 동작
- [ ] 404 에러 페이지가 올바르게 표시됨
- [ ] Cloudflare Workers에 성공적으로 배포됨
- [ ] 프로덕션 환경에서 실제 Notion 데이터로 동작
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 전체 기능 통합 테스트

- [ ] 인보이스 목록 페이지 테스트
  - 목록 로딩 및 표시
  - 카드 클릭 → 상세 페이지 이동
  - 빈 목록 상태
  - 에러 상태
- [ ] 인보이스 상세 페이지 테스트
  - 상세 정보 표시
  - PDF 다운로드
  - 인쇄 기능
  - 목록으로 돌아가기
- [ ] 404 페이지 테스트
  - 잘못된 URL 접근
  - 존재하지 않는 인보이스 ID

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 모든 기능 테스트 통과

### Step 2: 크로스 브라우저 테스트

- [ ] Chrome 테스트
  - 최신 버전
  - 모든 기능 동작 확인
- [ ] Firefox 테스트
  - 최신 버전
  - PDF 다운로드 확인
- [ ] Safari 테스트
  - 최신 버전 (macOS/iOS)
  - 특수 동작 확인 (date-fns 포맷 등)
- [ ] Edge 테스트 (선택)
  - 최신 버전

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 모든 브라우저에서 동작 확인

### Step 3: 모바일 반응형 테스트

- [ ] 모바일 뷰 (< 640px) 테스트
  - 카드 레이아웃 (1열)
  - 테이블 가로 스크롤 또는 반응형 변환
  - 터치 인터랙션
- [ ] 태블릿 뷰 (640px - 1024px) 테스트
  - 카드 레이아웃 (2열)
  - 버튼 크기 및 터치 영역
- [ ] 데스크톱 뷰 (> 1024px) 테스트
  - 카드 레이아웃 (3열)
  - 최대 너비 제한

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 모든 뷰포트에서 레이아웃 확인

### Step 4: 배포 전 체크리스트

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
- `unit-test-writer` 서브에이전트 실행 완료
- 배포 준비 완료

### Step 5: Staging 환경 배포 및 테스트

- [ ] Staging 환경 배포
  ```bash
  bun run deploy:staging
  ```
- [ ] Staging URL에서 전체 기능 테스트
- [ ] 실제 Notion 데이터로 동작 확인
- [ ] 캐싱 동작 확인
- [ ] 에러 로깅 확인 (Cloudflare Dashboard)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- Staging 테스트 통과

### Step 6: Production 배포

- [ ] Production 환경 배포
  ```bash
  bun run deploy:production
  ```
- [ ] Production URL에서 스모크 테스트
- [ ] 모니터링 설정 확인
- [ ] 배포 완료 문서화 (docs/NOTE.md)
- [ ] ROADMAP.md 최종 업데이트

**완료 조건**:
- 모든 테스트 통과
- Production 배포 완료

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
- [ ] 전체 기능 통합 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 반응형 테스트
- [ ] 배포 스모크 테스트

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
