# Git Commit

변경사항을 분석하고 Conventional Commits 형식의 커밋 메시지를 생성하여 커밋한다.

## 파라미터

`$ARGUMENTS`: 선택적 커밋 메시지. 제공 시 해당 메시지 사용, 미제공 시 자동 생성.

## 워크플로우

### 1. 변경사항 수집 (스테이지 하지 않음)

```bash
git status
git diff --cached  # 이미 스테이지된 파일 확인
git diff           # 아직 스테이지되지 않은 변경사항
git branch --show-current
```

### 2. 분기 처리

**A) 이미 스테이지된 파일 있음** → 해당 파일만 커밋 (분할 분석 생략, 5단계로 이동)

**B) 스테이지된 파일 없음** → 3단계로 진행

### 3. 논리적 변경사항 분석

수집된 정보로 핵심 요약:
- 어떤 파일이 변경되었는가?
- 어떤 종류의 변경인가? (추가/수정/삭제)
- 변경의 목적은 무엇인가?
- **여러 목적의 변경이 섞여있는지 확인**
  - 서로 다른 기능/버그/리팩토링이 혼재된 경우 감지
  - 예: feat + fix, refactor + feat 등

### 4. 분할 필요시 제안

2개 이상의 논리적 변경사항 감지 시, 사용자에게 분할 커밋 제안 (AskUserQuestion):

```json
{
  "questions": [{
    "header": "커밋 분할",
    "question": "2개의 논리적 변경사항이 감지되었습니다:\n1. ✨ feat: 로그인 폼 추가\n2. 🐛 fix: 세션 만료 버그\n\n분할 커밋할까요?",
    "multiSelect": false,
    "options": [
      { "label": "분할", "description": "2개의 커밋으로 분리" },
      { "label": "통합", "description": "하나의 커밋으로 유지" }
    ]
  }]
}
```

### 5. 커밋 메시지 결정

**$ARGUMENTS 존재 시**: 해당 메시지를 description으로 사용

**$ARGUMENTS 미존재 시**: 변경사항 기반 메시지 자동 생성

### 6. 타입 & 이모지 추론

[commit-prefix-rules.md](commit-prefix-rules.md) 참조

추론 우선순위:
1. 브랜치 이름 (feature/*, fix/*, hotfix/*, docs/* 등)
2. 변경된 파일 경로/확장자
3. diff 내용 분석
4. 기본값: `feat`

### 7. 스테이지 & 커밋 실행

**분할 O** → 파일별 선택적 git add + 각각 커밋 (반복)

```bash
# 첫 번째 변경사항
git add src/login.tsx src/auth.ts
git commit -m "<emoji> <type>: 메시지"

# 두 번째 변경사항
git add src/session.ts
git commit -m "<emoji> <type>: 메시지"
```

**분할 X** → git add . + 단일 커밋

```bash
git add .
git commit -m "<emoji> <type>: 메시지 제목

- 상세 변경 내용 1
- 상세 변경 내용 2"
```

## 커밋 메시지 형식 (Conventional Commits)

```
<emoji> <type>[scope][!]: <description>

- [상세 변경 내용 1]
- [상세 변경 내용 2]
```

### 타입 & 이모지 맵

| 타입 | 이모지 |
|------|--------|
| `feat` | ✨ |
| `fix` | 🐛 |
| `docs` | 📝 |
| `style` | 💄 |
| `refactor` | ♻️ |
| `perf` | ⚡ |
| `test` | ✅ |
| `chore` | 🔧 |
| `ci` | 🚀 |
| `build` | 📦 |
| `revert` | ⏪ |

## 예시

### $ARGUMENTS 제공 시

입력: `로그인 버그 수정`

출력:
```
🐛 fix: 로그인 버그 수정

- 세션 만료 처리 로직 수정
- 에러 메시지 개선
```

### $ARGUMENTS 미제공 시

변경: `src/components/Header.tsx` 새 파일 추가

출력:
```
✨ feat: Header 컴포넌트 추가

- 반응형 네비게이션 구현
- 로고 및 메뉴 아이템 렌더링
```

### Scope 포함 예시

입력: `인증 토큰 갱신 오류 수정`

출력:
```
🐛 fix(auth): 인증 토큰 갱신 오류 수정

- 토큰 갱신 타이밍 조정
- 에러 핸들링 개선
```

### Breaking Change 예시

입력: `API 응답 구조 변경 (Breaking)`

출력:
```
✨ feat(api)!: API 응답 구조 변경

- response.data → response.items
- 페이지네이션 메타데이터 추가

BREAKING CHANGE: 기존 API 클라이언트 수정 필요
```

## 커밋 메시지 규칙

### 길이 제한

- **제목 (첫 줄)**: 72자 미만 (이모지 + 타입 + scope 포함)
- 본문: 줄당 72자 권장

### 어조

- **명령형** 사용 (현재형, 동사로 시작)
- ✅ "추가", "수정", "삭제", "개선", "리팩토링"
- ❌ "추가됨", "수정했음", "삭제했습니다"

### 원자적 커밋 원칙

- **단일 목적**: 하나의 커밋은 하나의 논리적 변경만 포함
- 관련 없는 변경사항은 별도 커밋으로 분할
- 예: feat + fix 혼재 → 2개 커밋으로 분리

## 주의사항

- 커밋 전 변경사항이 없으면 커밋하지 않음
- 민감한 파일(.env, credentials 등) 포함 시 경고
- 한국어로 커밋 메시지 작성
- `Co-Authored-By` 패턴 절대 추가 금지
