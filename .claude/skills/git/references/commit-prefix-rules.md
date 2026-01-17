# Conventional Commits 규칙

[Conventional Commits 1.0.0](https://www.conventionalcommits.org/ko/v1.0.0/) 스펙을 따른다.

## 커밋 메시지 형식

```
<emoji> <type>[scope][!]: <description>

[body]

[footer]
```

### 필수 요소

- `<emoji>`: 타입에 해당하는 이모지
- `<type>`: 커밋 타입 (아래 표 참조)
- `<description>`: 변경 사항 요약 (한국어)

### 선택 요소

- `[scope]`: 변경 범위 (예: `feat(auth):`, `fix(api):`)
- `[!]`: Breaking Change 표시 (예: `feat!:`, `feat(auth)!:`)
- `[body]`: 상세 설명 (bullet point 형식)
- `[footer]`: Breaking Change 설명 등

## 타입 & 이모지 맵

| 타입 | 이모지 | 설명 | 예시 |
|------|--------|------|------|
| `feat` | ✨ | 새 기능 추가 | 새 컴포넌트, API 엔드포인트 |
| `fix` | 🐛 | 버그 수정 | 로직 오류, 예외 처리 |
| `docs` | 📝 | 문서 변경 | README, 주석, JSDoc |
| `style` | 💄 | 코드 스타일 | 포맷팅, 세미콜론, 공백 |
| `refactor` | ♻️ | 리팩토링 | 동작 변경 없는 코드 개선 |
| `perf` | ⚡ | 성능 개선 | 최적화, 캐싱 |
| `test` | ✅ | 테스트 | 테스트 추가/수정 |
| `chore` | 🔧 | 설정/빌드 | package.json, 설정 파일 |
| `ci` | 🚀 | CI/CD | GitHub Actions, 배포 스크립트 |
| `build` | 📦 | 빌드 시스템 | 의존성 변경, 빌드 도구 |
| `revert` | ⏪ | 되돌리기 | 이전 커밋 취소 |

## 브랜치 기반 타입 추론

| 브랜치 패턴 | 추론 타입 |
|------------|-----------|
| `feature/*`, `feat/*` | `feat` |
| `fix/*`, `bugfix/*`, `hotfix/*` | `fix` |
| `docs/*` | `docs` |
| `refactor/*` | `refactor` |
| `test/*` | `test` |
| `chore/*` | `chore` |

## 파일 기반 타입 추론

### 파일 확장자/경로

| 변경된 파일 | 추론 타입 |
|------------|-----------|
| `*.md`, `docs/*` | `docs` |
| `*.test.*`, `*.spec.*`, `__tests__/*` | `test` |
| `package.json`, `tsconfig.json`, `.eslintrc` | `chore` |
| `.github/*`, `Dockerfile`, `*.yml` (CI) | `ci` |

### 변경 내용 키워드

| diff 내용 | 추론 타입 |
|-----------|-----------|
| `TODO`, `FIXME` 제거 | `fix` |
| `console.log` 제거 | `chore` |
| 새 함수/컴포넌트 추가 | `feat` |
| import 정리만 | `style` |

## 타입 추론 우선순위

1. **브랜치 이름** (가장 우선)
2. **변경된 파일 경로/확장자**
3. **diff 내용 분석**
4. **기본값**: `feat`

## Breaking Change 표기

### 방법 1: 타입 뒤에 `!` 추가

```
✨ feat!: API 응답 구조 변경
```

### 방법 2: footer에 `BREAKING CHANGE:` 추가

```
✨ feat: API 응답 구조 변경

- 응답 객체 필드명 변경
- 페이지네이션 구조 변경

BREAKING CHANGE: response.data 가 response.items 로 변경됨
```

## Scope 사용법

변경이 특정 모듈/영역에 한정될 때 scope 추가:

```
✨ feat(auth): 소셜 로그인 추가
🐛 fix(api): 토큰 갱신 오류 수정
♻️ refactor(components): Button 컴포넌트 분리
```

## 예시

### 기본 형식

```
✨ feat: 사용자 인증 기능 추가

- 로그인/회원가입 폼 구현
- JWT 토큰 처리 로직 추가
```

### Scope 포함

```
🐛 fix(auth): 세션 만료 처리 오류 수정

- 토큰 갱신 타이밍 조정
- 에러 핸들링 개선
```

### Breaking Change

```
✨ feat(api)!: 응답 구조 변경

- response.data → response.items
- 페이지네이션 메타데이터 추가

BREAKING CHANGE: 기존 API 클라이언트 수정 필요
```

### 브랜치 기반 추론

브랜치 `feature/user-auth`:
```
✨ feat: 사용자 인증 기능 추가
```

브랜치 `hotfix/login-bug`:
```
🐛 fix: 로그인 버그 수정
```

### 파일 기반 추론

변경 파일 `README.md`:
```
📝 docs: README 업데이트
```

## 커밋 메시지 작성 규칙

### 길이 제한

- **제목 (첫 줄)**: 72자 미만 (이모지 + 타입 + scope 포함)
- 본문: 줄당 72자 권장

### 어조

- **명령형** 사용 (현재형, 동사로 시작)
- ✅ "추가", "수정", "삭제", "개선", "리팩토링"
- ❌ "추가됨", "수정했음", "삭제했습니다"

### 원자적 커밋 (Atomic Commits)

- **하나의 커밋 = 하나의 논리적 변경**
- 관련 없는 변경사항은 분할 필수
- 예시:
  - ❌ `feat: 로그인 기능 추가 및 버그 수정` (혼재)
  - ✅ `feat: 로그인 기능 추가` + `fix: 세션 버그 수정` (분할)

## 금지 사항

- ❌ `hotfix:` 타입 사용 → `fix` 사용
- ❌ `merge:` 타입 사용 → Git 자동 생성 메시지 사용
- ❌ 비표준 타입 사용 (위 표에 없는 타입)
- ❌ `Co-Authored-By` 패턴 추가
