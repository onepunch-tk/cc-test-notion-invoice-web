---
name: git
description: |
  Git 자동화 스킬. /git 명령어 실행 시 작업 선택 UI 제공.
  commit, push, sync, merge 작업 중 선택 가능.
model: haiku
---

# Git 자동화 스킬

`/git` 명령어 실행 시 작업을 선택한다.

## 실행 흐름

### 1. AskUserQuestion 도구로 작업 선택 [필수]

**중요: 이 스킬이 로드되면 반드시 `AskUserQuestion` 도구를 즉시 호출하여 사용자에게 선택 UI를 제공해야 한다.**

텍스트로 옵션을 나열하지 말고, 아래 형식으로 `AskUserQuestion` 도구를 호출한다:

```json
{
  "questions": [
    {
      "header": "Git 작업",
      "question": "어떤 Git 작업을 수행할까요?",
      "multiSelect": false,
      "options": [
        { "label": "commit", "description": "변경사항 분석 후 커밋" },
        { "label": "push", "description": "현재 브랜치 push" },
        { "label": "sync", "description": "add → commit → push 전체 워크플로우" },
        { "label": "merge", "description": "trunk-based merge (현재 브랜치 → main)" }
      ]
    }
  ]
}
```

### 2. commit/sync 선택 시 커밋 메시지 입력

commit 또는 sync 선택 시, **대화 흐름으로 메시지를 요청**한다:

```
"커밋 메시지를 입력해주세요. (빈 메시지 입력 시 자동 생성)"
```

- 사용자가 메시지를 입력하면 → 해당 메시지 사용
- 사용자가 빈 메시지(엔터만)를 보내면 → 변경사항 분석 후 자동 생성

### 3. 선택에 따른 처리

| 선택 | 참조 문서 | 메시지 처리 |
|------|-----------|-------------|
| commit | [references/commit.md](references/commit.md) | 대화로 입력받거나 자동 생성 |
| push | [references/push.md](references/push.md) | 해당 없음 |
| sync | [references/sync.md](references/sync.md) | 대화로 입력받거나 자동 생성 |
| merge | [references/merge.md](references/merge.md) | 브랜치 삭제 여부만 추가 질문 |

## 공통 규칙

### 커밋 메시지 형식

```
접두사: 핵심 요약 (1줄)

- [실제 작업 내용 1]
- [실제 작업 내용 2]
```

### 접두사 유형

| 접두사 | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `hotfix:` | 긴급 수정 |
| `docs:` | 문서 변경 |
| `style:` | 코드 스타일 |
| `refactor:` | 리팩토링 |
| `test:` | 테스트 |
| `chore:` | 설정/빌드 |
| `merge:` | 브랜치 병합 |

상세 규칙: [references/commit-prefix-rules.md](references/commit-prefix-rules.md)

### 언어 규칙

- 커밋 메시지: **한국어**
- 변수/함수명: **영문**

## 참조 문서

- [커밋 워크플로우](references/commit.md)
- [푸시 워크플로우](references/push.md)
- [동기화 워크플로우](references/sync.md)
- [머지 워크플로우](references/merge.md)
- [커밋 접두사 규칙](references/commit-prefix-rules.md)
