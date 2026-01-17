---
name: ralph-loop-playwright
description: |
  자동화된 디버깅 루프 스킬. 에러 및 목표 도달까지 [테스트→심층분석→계획→컨펌→수정] 사이클 반복.
  Playwright MCP로 웹 오류 자동 수집, Context7 MCP로 라이브러리 문서 학습.
  사용 시점: 웹 앱 에러 디버깅, UI 테스트 자동화, 반복적인 수정-검증 작업.
argument-hint: [goal] [url] [max] [email] [password]
allowed-tools: [
  "mcp__playwright__*",
  "mcp__context7__*"
]
model: inherit
---

# Ralph-Loop Playwright

Goal에 도달할 때까지 **테스트 → 분석 → 계획 → 컨펌 → 수정 → 검증** 사이클을 반복한다.
코드 수정 전 반드시 사용자 승인을 받는다.

## 사전 요구사항

Playwright MCP와 Context7 MCP가 필요하다.
`.claude/settings.local.json`에 다음 설정 확인:
```json
{
  "enabledMcpjsonServers": ["playwright", "context7"]
}
```

## 파라미터

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| `goal` | ✅ | 달성할 목표 |
| `url` | ❌ | 테스트 대상 URL |
| `max` | ❌ | 최대 루프 횟수 (0 = 무제한) |
| `email` | ❌ | 로그인용 이메일 |
| `password` | ❌ | 로그인용 비밀번호 |

---

## 워크플로우

```
LOOP_COUNT = 0
반복:
  LOOP_COUNT++

  [PHASE 0] credentials 존재 AND 첫 루프 → 인증
  [PHASE 1] 오류 수집 → Goal 달성시 종료
  [PHASE 2] 원인 심층 분석 → 결과 제시 → 사용자 컨펌
  [PHASE 3] 수정 계획 수립 → 계획 제시 → 사용자 컨펌
  [PHASE 4] 코드 수정
  [PHASE 5] 테스트 검증 → PASS=종료, FAIL=다음 루프

  max 도달시 종료
```

---

## PHASE 0: 인증 (조건부)

**실행 조건**: `LOOP_COUNT == 1` AND `email`, `password` 존재

1. 로그인 페이지로 이동 `browser_navigate`
2. 페이지 스냅샷으로 폼 요소 ref 획득 `browser_snapshot`
3. credentials 입력 및 제출 `browser_type`, `browser_click`
4. 인증 결과 확인 `browser_snapshot`

**성공 판정**: URL 변경됨, 로그인 폼 사라짐

---

## PHASE 1: 오류 수집

**목적**: 현재 페이지 상태와 에러 수집, Goal 달성 여부 판정

1. 대상 페이지 이동 (url 존재시) `browser_navigate`
2. 페이지 로드 대기 `browser_wait_for({ time: 2 })`
3. 콘솔 에러 수집 `browser_console_messages({ level: "error" })`
4. 페이지 스냅샷 `browser_snapshot`
5. 스크린샷 `browser_take_screenshot({ fullPage: true })`
6. 네트워크 실패 확인 `browser_network_requests`

**Goal 달성 조건** (모두 충족):
- 콘솔 에러 없음
- 네트워크 실패 없음
- Goal에 명시된 UI/기능이 정상 동작

**Goal 달성시**: `"✅ GOAL 달성"` 출력 후 **즉시 종료**

---

## PHASE 2: 원인 심층 분석

> **[필수]** 이 Phase에서는 다음을 반드시 준수해야 합니다:
> 1. 체계적이고 철저한 분석 수행
> 2. 분석 결과를 사용자에게 상세히 제시
> 3. 사용자 확인을 받은 후에만 다음 단계 진행
>
> 빠른 응답보다 정확한 분석이 우선입니다.
> 모든 가능성을 검토하고 증거 기반으로 결론을 도출하세요.

**상세 프로세스**: [references/phase-2-analysis.md](references/phase-2-analysis.md) 참조

**핵심 단계**:
1. 증상 정리 - 에러 메시지 나열, 발생 조건 파악
2. 가설 수립 - 가능한 원인들 나열, 가능성 평가
3. 코드 추적 - 스택 트레이스에서 파일/라인 추출, 소스 확인
4. 라이브러리 문서 학습 - Context7 MCP로 관련 문서 조회
5. 가설 교차 검증 - 문서 기준으로 가설 검증
6. 근본 원인 확정 - 수정 위치 결정, 영향 범위 평가

**결과물**: 분석 리포트 (error_type, root_cause, target_files, fix_direction)

**분석 완료 후 사용자 컨펌**:
```
AskUserQuestion({
  questions: [{
    question: "위 분석 결과가 정확합니까? 다음 단계(수정 계획 수립)로 진행할까요?",
    header: "분석 확인",
    options: [
      { label: "확인", description: "분석 결과 승인, 계획 수립 진행" },
      { label: "추가 분석", description: "더 깊은 분석 필요" },
      { label: "종료", description: "루프 종료" }
    ],
    multiSelect: false
  }]
})
```

---

## PHASE 3: 수정 계획 수립

> **[필수]** 이 Phase에서는 다음을 반드시 준수해야 합니다:
> 1. 철저하고 완벽한 계획 수립
> 2. 계획을 사용자에게 상세히 제시
> 3. 사용자 승인을 받은 후에만 코드 수정 진행
>
> 모든 수정 사항의 영향 범위를 깊이 고려하세요.
> 부작용과 회귀 버그 가능성을 철저히 검토한 후 계획을 제시하세요.

**상세 프로세스**: [references/phase-3-planning.md](references/phase-3-planning.md) 참조

**핵심 단계**:
1. 수정 범위 정의 - 파일 목록, 우선순위, 의존성
2. 상세 변경 사항 설계 - 변경 전/후 코드
3. 리스크 평가 - 부작용, 회귀 버그 가능성
4. 실행 순서 최적화 - 의존성 기반 순서
5. 예상 결과 시뮬레이션 - 성공 기준, 실패 대응

**사용자 컨펌 요청**:
```
AskUserQuestion({
  questions: [{
    question: "위 수정 계획을 승인하시겠습니까?",
    header: "계획 승인",
    options: [
      { label: "승인", description: "계획대로 수정 진행" },
      { label: "수정 요청", description: "계획 수정 후 재검토" },
      { label: "거절", description: "루프 종료" }
    ],
    multiSelect: false
  }]
})
```

**응답 처리**:
| 응답 | 다음 단계 |
|------|----------|
| 승인 | PHASE 4 진행 |
| 수정 요청 | 피드백 반영 후 PHASE 3 재실행 |
| 거절 | `"⏸️ 사용자 거절"` 출력 후 종료 |

---

## PHASE 4: 코드 수정

**전제조건**: 사용자가 PHASE 3의 계획을 승인함

**원칙**:
- 승인된 계획 범위 내에서만 수정
- 최소 변경 원칙 준수
- 기존 코드 스타일 유지

**단계**:
1. 대상 파일 Read
2. 계획된 순서대로 Edit 적용
3. 타입 검사 (필요시) `bun run typecheck`

---

## PHASE 5: 테스트 검증

**목적**: 수정 사항이 문제를 해결했는지 확인

1. 페이지 새로고침 `browser_navigate`
2. 페이지 로드 대기 `browser_wait_for({ time: 2 })`
3. 에러 재확인 `browser_console_messages({ level: "error" })`
4. 상태 확인 `browser_snapshot`, `browser_take_screenshot`

**PASS 조건** (모두 충족):
- 기존 에러 해결됨
- 새로운 에러 없음
- Goal 조건 충족

**결과 처리**:
| 결과 | 다음 단계 |
|------|----------|
| PASS | `"✅ GOAL 달성"` 출력 후 종료 |
| FAIL + max 미도달 | 다음 루프 (PHASE 1로) |
| FAIL + max 도달 | `"⚠️ 최대 시도 도달"` 출력 후 종료 |

---

## 참조 문서

- [Playwright MCP 도구](references/playwright-tools.md) - 네비게이션, 정보 수집, 상호작용
- [에러 패턴](references/error-patterns.md) - 일반적인 에러 유형과 해결 방향

---

## 출력 형식

**루프 시작**:
```
═══════════════════════════════════════
RALPH-LOOP #N
Goal: <goal>
═══════════════════════════════════════
```

**Phase 진행**:
```
[1/5] 오류 수집 중...
[2/5] 원인 심층 분석 중...
[3/5] 수정 계획 수립 중...
[4/5] 코드 수정 중...
[5/5] 테스트 검증 중...
```

**루프 종료**:
```
───────────────────────────────────────
결과: PASS/FAIL
다음: 종료/LOOP #N+1 진행
───────────────────────────────────────
```

---

## 종료 코드

| 상황 | 메시지 |
|------|--------|
| Goal 달성 | ✅ GOAL 달성 (N회) |
| 사용자 거절 | ⏸️ 사용자 거절 |
| Max 도달 | ⚠️ 최대 시도 도달 |
| 치명적 오류 | ❌ 복구 불가 |
