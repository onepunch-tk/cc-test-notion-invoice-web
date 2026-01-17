---
name: git
description: |
  Git 자동화 스킬. /git 명령어 실행 시 작업 선택 UI 제공.
  commit, push, sync, merge 작업 중 선택 가능.
model: inherit
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - AskUserQuestion
---

# Git 자동화 스킬

`/git` 명령어 실행 시 작업을 선택한다.

## 아규먼트 파싱

스킬 호출 시 `args` 파라미터를 파싱하여 작업과 메시지를 분리한다.

### 파싱 규칙

| 입력 예시 | 파싱 결과 |
|-----------|-----------|
| (없음) | action=없음, message=없음 |
| `"로그인 기능"` | action=없음, message="로그인 기능" |
| `commit` | action=commit, message=없음 |
| `commit "로그인 기능"` | action=commit, message="로그인 기능" |
| `sync` | action=sync, message=없음 |
| `sync "로그인 기능"` | action=sync, message="로그인 기능" |
| `push` | action=push |
| `merge` | action=merge |

### 파싱 방법

1. args가 따옴표로 시작하면 → 전체를 message로 처리 (action 없음)
2. args가 `commit`, `sync`, `push`, `merge`로 시작하면 → 해당 값을 action으로, 나머지를 message로 처리
3. 그 외 → action 없음, 전체를 message로 처리

## 실행 흐름

### 1. action이 없는 경우 → 작업 선택 UI 표시

**AskUserQuestion 도구를 호출하여 작업 선택 UI를 제공한다.**

#### message가 없는 경우:

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

#### message가 있는 경우 (예: `/git "로그인 기능"`):

```json
{
  "questions": [
    {
      "header": "Git 작업",
      "question": "어떤 Git 작업을 수행할까요? (메시지: \"로그인 기능\")",
      "multiSelect": false,
      "options": [
        { "label": "commit", "description": "입력한 메시지로 커밋" },
        { "label": "sync", "description": "입력한 메시지로 add → commit → push" },
        { "label": "push", "description": "현재 브랜치 push (메시지 사용 안함)" },
        { "label": "merge", "description": "trunk-based merge (메시지 사용 안함)" }
      ]
    }
  ]
}
```

**UI에서 Other 선택 시:**
- commit/sync 작업에 사용할 메시지로 처리

### 2. action이 있는 경우 → 바로 해당 작업 수행

| action | message 유무 | 동작 |
|--------|-------------|------|
| commit | 없음 | 자동 메시지 생성 후 커밋 |
| commit | 있음 | 해당 메시지로 커밋 |
| sync | 없음 | 자동 메시지 생성 후 add → commit → push |
| sync | 있음 | 해당 메시지로 add → commit → push |
| push | - | 바로 push |
| merge | - | 브랜치 삭제 여부 질문 후 merge |

### 3. 작업별 참조 문서

| 작업 | 참조 문서 |
|------|-----------|
| commit | [references/commit.md](references/commit.md) |
| push | [references/push.md](references/push.md) |
| sync | [references/sync.md](references/sync.md) |
| merge | [references/merge.md](references/merge.md) |

## 공통 규칙

### 커밋 메시지 형식 (Conventional Commits)

```
<emoji> <type>[scope][!]: <description>

- [상세 변경 내용 1]
- [상세 변경 내용 2]
```

### 타입 & 이모지 맵

| 타입 | 이모지 | 용도 |
|------|--------|------|
| `feat` | ✨ | 새 기능 |
| `fix` | 🐛 | 버그 수정 |
| `docs` | 📝 | 문서 변경 |
| `style` | 💄 | 코드 스타일 |
| `refactor` | ♻️ | 리팩토링 |
| `perf` | ⚡ | 성능 개선 |
| `test` | ✅ | 테스트 |
| `chore` | 🔧 | 설정/빌드 |
| `ci` | 🚀 | CI/CD |
| `build` | 📦 | 빌드 시스템 |
| `revert` | ⏪ | 되돌리기 |

상세 규칙: [references/commit-prefix-rules.md](references/commit-prefix-rules.md)

### 커밋 메시지 규칙

- **제목 72자 미만** (이모지 + 타입 + scope 포함)
- **명령형 어조** ("추가" not "추가됨")
- **원자적 커밋** (단일 목적)
- 관련 없는 변경사항 분할

### 언어 규칙

- 커밋 메시지: **한국어**
- 변수/함수명: **영문**

### 금지 사항 [중요]

- ❌ **`Co-Authored-By` 패턴 사용 금지** (예: `Co-Authored-By: Claude ...`)
- ❌ **비표준 타입 사용 금지** (위 표에 없는 타입)
- ❌ **`hotfix:` 타입 금지** → `fix` 사용
- ❌ **`merge:` 타입 금지** → Git 자동 생성 메시지 사용
- ❌ **force push 금지**

## 참조 문서

- [커밋 워크플로우](references/commit.md)
- [푸시 워크플로우](references/push.md)
- [동기화 워크플로우](references/sync.md)
- [머지 워크플로우](references/merge.md)
- [커밋 접두사 규칙](references/commit-prefix-rules.md)
