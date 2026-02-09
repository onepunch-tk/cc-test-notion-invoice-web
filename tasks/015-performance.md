# Task 015: Performance Optimization

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.

## Overview

애플리케이션의 성능을 최적화합니다. PDF 라이브러리 lazy loading, 이미지 최적화, Cache-Control 헤더 설정, 번들 분석 도구 추가, dead dependency 제거를 진행합니다.

## 관련 기능

- F003 - Notion Database Integration: Edge 캐싱 최적화
- F005 - Responsive Design: 이미지 최적화

## 관련 파일

- `app/presentation/components/invoice/invoice-header.tsx` - 이미지 최적화 속성 추가
- `app/entry.server.tsx` - 기본 Cache-Control 헤더
- `app/presentation/routes/invoices/$invoiceId.tsx` - route-level Cache-Control
- `app/presentation/routes/invoices/index.tsx` - route-level Cache-Control
- `app/presentation/routes/home/home.tsx` - route-level Cache-Control
- `vite.config.cloudflare.ts` - 번들 분석 플러그인
- `package.json` - dependency 정리, build:analyze script

## 수락 기준

- [x] PDF 라이브러리가 필요할 때만 로드됨 (lazy loading) — 이전에 완료
- [x] 이미지 로딩 최적화 (lazy, decoding, width/height for CLS)
- [x] Cache-Control 헤더 설정 (entry.server + per-route)
- [x] Dead dependency 제거 (date-fns)
- [x] 번들 분석 도구 추가 (rollup-plugin-visualizer)
- [x] 모든 테스트 통과 (683 tests)
- [x] 코드 리뷰 완료

## 구현 단계

### Step 1: PDF 라이브러리 Lazy Loading (이전에 완료)

- [x] `pdf-download-button.tsx`에서 `React.lazy + Suspense` 적용 완료

### Step 2: 이미지 최적화

- [x] logo `<img>`에 `loading="lazy"`, `decoding="async"` 추가
- [x] `width={120}`, `height={48}` 추가 (CLS 방지)
- [x] 기존 테스트 유지 + 새 속성 테스트 4개 추가

### Step 3: Server/Client Split (이전에 완료)

- [x] loader에서 모든 데이터 fetching
- [x] `.client.tsx` 분리 완료

### Step 4: Cloudflare Edge 캐싱 최적화

- [x] `entry.server.tsx`: 200 응답에만 기본 Cache-Control 설정
  - `public, max-age=0, s-maxage=300, stale-while-revalidate=60`
- [x] Invoice Detail: `s-maxage=600` (KV TTL 10분 매칭)
- [x] Invoice List: `s-maxage=300` (KV TTL 5분 매칭)
- [x] Home: `s-maxage=3600` (static content)
- [x] 에러 응답(400/404/500) 캐시 제외

### Step 5: 번들 분석 및 최적화

- [x] `rollup-plugin-visualizer` devDep 추가
- [x] `build:analyze` script 추가 (`ANALYZE=true` 환경변수 활용)
- [x] `vite.config.cloudflare.ts`에 조건부 visualizer 플러그인
- [x] `date-fns` dead dependency 제거
- [x] `stats.html` gitignore 추가

### Step 6: Core Web Vitals 개선

- [x] CLS 방지: logo img에 explicit width/height
- [x] LCP 개선: Cache-Control으로 Edge 캐싱 활성화

## Mandatory Workflow (CRITICAL)

### TDD Red Phase
- [x] 이미지 최적화 테스트 작성
- [x] Cache-Control 헤더 테스트 작성
- [x] route headers 테스트 작성

### TDD Green Phase
- [x] 테스트 통과를 위한 코드 구현
- [x] `bun run test` 통과 확인 (683 tests)

### Code Review Phase
- [x] `code-reviewer` 서브에이전트 호출
- [x] `e2e-tester` 서브에이전트 호출

### Completion Phase
- [x] 이 Task 파일의 모든 체크박스 업데이트
- [x] `docs/ROADMAP.md`에서 Task 완료 표시

## Test Checklist

- [x] Unit tests written (image optimization: 4 tests, cache headers: 4 tests, route headers: 4 tests)
- [x] E2E tests via `e2e-tester`
- [x] All tests passing (44 files, 683 tests)
- [x] 이미지 최적화 속성 테스트
- [x] Cache-Control 동작 테스트 (200 only)
- [x] Route-level headers 테스트

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-09 | Step 2: 이미지 최적화 (loading, decoding, width, height) |
| 2026-02-09 | Step 4: Cache-Control 헤더 (entry.server + per-route) |
| 2026-02-09 | Step 5: date-fns 제거, rollup-plugin-visualizer 추가, build:analyze script |
| 2026-02-09 | Step 6: CLS fix via explicit image dimensions |
