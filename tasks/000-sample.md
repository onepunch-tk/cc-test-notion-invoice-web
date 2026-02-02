# Task XXX: [Task Title]

> **CRITICAL**: 이 작업을 실행할 때, CLAUDE.md Development Workflow를 **반드시** 준수해야 합니다.
> `unit-test-writer` 서브에이전트 호출 없이 테스트 코드를 직접 작성하는 것은 **금지**됩니다.
> `e2e-tester` 서브에이전트 호출 없이 `bunx vitest run`을 실행하는 것은 **금지**됩니다.

## Overview

[한글로 작업 설명을 작성합니다. 이 작업의 목적, 범위, 주요 구현 내용을 설명합니다.]

## 관련 기능

- [PRD의 Feature ID와 설명, 예: F001 - Invoice Detail View]
- [관련된 다른 Feature ID]

## 관련 파일

- `app/domain/[domain]/[file].ts` - [파일 설명]
- `app/presentation/routes/[route]/[file].tsx` - [파일 설명]
- `app/infrastructure/[layer]/[file].ts` - [파일 설명]

## 수락 기준

- [ ] [첫 번째 수락 기준 - 이 기능이 완료되었다고 판단하기 위한 조건]
- [ ] [두 번째 수락 기준]
- [ ] [세 번째 수락 기준]
- [ ] [모든 테스트 통과]
- [ ] [코드 리뷰 완료]

## 구현 단계

### Step 1: [첫 번째 단계 제목]

- [ ] [구현 항목 1 - 구체적인 작업 내용]
- [ ] [구현 항목 2]
- [ ] [구현 항목 3]

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 이 단계의 테스트 통과

### Step 2: [두 번째 단계 제목]

- [ ] [구현 항목 1]
- [ ] [구현 항목 2]

**완료 조건**:
- `unit-test-writer` 서브에이전트 실행 완료
- 이 단계의 테스트 통과

### Step 3: [세 번째 단계 제목]

- [ ] [구현 항목 1]
- [ ] [구현 항목 2]

**완료 조건**:
- 모든 단위 테스트 통과
- 통합 테스트 작성 및 통과

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
- [ ] Edge cases covered
- [ ] Error handling tested

## 참고 사항

- [구현 시 참고할 사항이나 주의점]
- [관련 문서 링크]
- [기술적 결정 사항]

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| | |
