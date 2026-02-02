# Task 015: Performance Optimization

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

애플리케이션의 성능을 최적화합니다. PDF 라이브러리 lazy loading, 이미지 최적화, React 19 Server Components 활용, Cloudflare Edge 캐싱 최적화를 진행합니다.

## 관련 기능

- F003 - Notion Database Integration: 데이터 fetching 최적화
- F005 - Responsive Design: 이미지 최적화

## 관련 파일

- `app/presentation/routes/invoices/$invoiceId.tsx` - lazy loading 적용
- `app/presentation/components/pdf/index.ts` - PDF 컴포넌트 lazy export
- `app/presentation/components/ui/optimized-image.tsx` - 최적화된 이미지 컴포넌트
- `wrangler.toml` - 캐싱 설정

## 수락 기준

- [ ] PDF 라이브러리가 필요할 때만 로드됨 (lazy loading)
- [ ] 초기 번들 사이즈 감소 (lighthouse 측정)
- [ ] 이미지 로딩 최적화 (lazy loading, srcset)
- [ ] Cloudflare Cache API 활용 (선택)
- [ ] Core Web Vitals 기준 충족 (LCP, FID, CLS)
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: PDF 라이브러리 Lazy Loading

- [ ] PDF 컴포넌트 dynamic import 적용
  ```typescript
  const InvoicePdfDocument = React.lazy(
    () => import('~/presentation/components/pdf/invoice-pdf-document')
  );
  ```
- [ ] PDF 다운로드 버튼 클릭 시에만 로드
- [ ] Suspense 폴백 UI (로딩 스피너)
- [ ] 번들 분석으로 코드 스플리팅 확인

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- lazy loading 동작 테스트 통과

### Step 2: 이미지 최적화

- [ ] `optimized-image.tsx` 생성 (선택)
  - loading="lazy" 속성
  - 적절한 width/height 지정
  - srcset 및 sizes 속성 (반응형)
  - placeholder blur 효과 (선택)
- [ ] 회사 로고 이미지 최적화 적용
- [ ] 이미지 포맷 권장 (WebP, AVIF)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 이미지 로딩 테스트 통과

### Step 3: React 19 Server Components 활용

- [ ] 서버에서만 필요한 데이터 fetching 확인
  - loader 함수에서 모든 데이터 fetching
  - 클라이언트에 필요한 데이터만 전달
- [ ] 불필요한 클라이언트 번들 제거
- [ ] use 훅 활용 (React 19 기능, 선택)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 서버/클라이언트 분리 확인

### Step 4: Cloudflare Edge 캐싱 최적화

- [ ] Cache-Control 헤더 설정
  - 정적 자산: max-age=31536000 (1년)
  - HTML: max-age=0, s-maxage=3600 (Cloudflare 1시간)
  - API 응답: stale-while-revalidate
- [ ] wrangler.toml 캐싱 설정 확인
- [ ] Cache API 활용 (선택)
  ```typescript
  const cache = caches.default;
  const cached = await cache.match(request);
  ```

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 캐싱 설정 테스트 통과

### Step 5: 번들 분석 및 최적화

- [ ] 번들 분석 도구 실행
  - `bun run build --analyze` 또는
  - vite-bundle-visualizer 플러그인
- [ ] 큰 종속성 식별 및 최적화
  - tree-shaking 확인
  - 불필요한 종속성 제거
- [ ] date-fns 선택적 import 확인 (`import { format } from 'date-fns'`)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 번들 사이즈 목표 달성

### Step 6: Core Web Vitals 측정 및 개선

- [ ] Lighthouse 성능 측정
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- [ ] 성능 병목 식별 및 개선
- [ ] 측정 결과 기록

**완료 조건**:
- 모든 테스트 통과
- Core Web Vitals 기준 충족

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
- [ ] lazy loading 동작 테스트
- [ ] 이미지 로딩 테스트
- [ ] 캐싱 동작 테스트
- [ ] 번들 사이즈 테스트
- [ ] 성능 메트릭 테스트 (선택)

## 참고 사항

- React.lazy는 default export만 지원
- Vite 번들 분석: rollup-plugin-visualizer
- Cloudflare Cache API: https://developers.cloudflare.com/workers/runtime-apis/cache/
- Core Web Vitals: https://web.dev/vitals/
- React 19는 자동 최적화 (useCallback/useMemo 불필요)
- @react-pdf/renderer는 약 200KB+ 번들 사이즈 (lazy loading 필수)

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
