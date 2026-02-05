# Task 017: Accessibility Audit and Fixes

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

웹 접근성(a11y) 감사를 수행하고 WCAG 2.1 AA 기준을 충족하도록 수정합니다. 키보드 네비게이션, 스크린 리더 호환성, 색상 대비, ARIA 라벨 등을 검증하고 개선합니다.

## 관련 기능

- F005 - Responsive Design: 모든 사용자를 위한 접근성

## 관련 파일

- `app/presentation/components/**/*.tsx` - 모든 UI 컴포넌트
- `app/presentation/routes/**/*.tsx` - 모든 페이지 컴포넌트
- `app/styles/app.css` - 스타일 파일

## 수락 기준

- [ ] 모든 인터랙티브 요소에 키보드로 접근 가능
- [ ] Tab 순서가 논리적으로 구성됨
- [ ] 스크린 리더로 모든 콘텐츠 접근 가능
- [ ] 색상 대비가 WCAG 2.1 AA 기준 (4.5:1) 충족
- [ ] 모든 이미지에 적절한 alt 텍스트 또는 aria-hidden 적용
- [ ] 폼 요소에 적절한 label 연결
- [ ] 에러 메시지가 스크린 리더에 전달됨
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료

## 구현 단계

### Step 1: 접근성 감사 도구 설정

- [ ] axe-core 또는 pa11y 설치 및 설정
- [ ] 자동화된 접근성 테스트 스크립트 작성
- [ ] CI에 접근성 테스트 추가

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 접근성 테스트 인프라 구축

### Step 2: 키보드 네비게이션 개선

- [ ] 모든 버튼, 링크에 포커스 스타일 확인
- [ ] Tab 순서 검증 및 수정 (tabindex)
- [ ] Skip to content 링크 추가
- [ ] 모달/드롭다운 포커스 트랩 구현 (해당 시)
- [ ] Escape 키로 모달 닫기 (해당 시)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 키보드만으로 모든 기능 사용 가능

### Step 3: 스크린 리더 호환성

- [ ] 시맨틱 HTML 검증 (header, main, nav, footer)
- [ ] ARIA 랜드마크 추가 (role="navigation" 등)
- [ ] 동적 콘텐츠에 aria-live 적용
- [ ] 버튼/링크에 적절한 aria-label 추가
- [ ] 테이블에 적절한 caption, th scope 추가

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- VoiceOver/NVDA로 테스트 통과

### Step 4: 색상 및 시각적 접근성

- [ ] 텍스트 색상 대비 검증 (4.5:1 이상)
- [ ] 대형 텍스트 색상 대비 검증 (3:1 이상)
- [ ] 색상만으로 정보 전달하지 않음 확인
- [ ] 포커스 인디케이터 가시성 확인
- [ ] 상태 배지에 텍스트 라벨 추가 (색상 외)

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- WCAG 색상 대비 기준 충족

### Step 5: 폼 및 에러 접근성

- [ ] 모든 입력 필드에 label 연결
- [ ] 필수 필드 표시 (aria-required)
- [ ] 에러 메시지에 aria-describedby 연결
- [ ] 에러 발생 시 포커스 이동
- [ ] 성공/에러 상태 aria-live로 알림

**완료 조건**:
- 모든 단위 테스트 통과
- 폼 사용성 검증

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
- [ ] axe-core 자동화 테스트 통과
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 수동 테스트
- [ ] 색상 대비 검증

## 참고 사항

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- axe-core: https://github.com/dequelabs/axe-core
- VoiceOver (macOS): Cmd + F5로 활성화
- Chrome DevTools Accessibility 패널 활용
- Lighthouse Accessibility 점수 목표: 90+

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
