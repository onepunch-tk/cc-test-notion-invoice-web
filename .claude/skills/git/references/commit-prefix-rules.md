# 커밋 접두사 추론 규칙

## 접두사 유형

| 접두사 | 설명 | 예시 |
|--------|------|------|
| `feat:` | 새로운 기능 추가 | 새 컴포넌트, 새 API 엔드포인트 |
| `fix:` | 버그 수정 | 로직 오류 수정, 예외 처리 |
| `hotfix:` | 긴급 버그 수정 | 프로덕션 크리티컬 이슈 |
| `docs:` | 문서 변경 | README, 주석, JSDoc |
| `style:` | 코드 스타일 변경 | 포맷팅, 세미콜론, 공백 |
| `refactor:` | 리팩토링 | 동작 변경 없는 코드 개선 |
| `test:` | 테스트 코드 | 테스트 추가/수정 |
| `chore:` | 빌드, 설정 변경 | package.json, 설정 파일 |
| `perf:` | 성능 개선 | 최적화, 캐싱 |
| `ci:` | CI/CD 설정 | GitHub Actions, 배포 스크립트 |

## 브랜치 기반 추론

현재 브랜치 이름에서 접두사 추론:

| 브랜치 패턴 | 추론 접두사 |
|------------|-------------|
| `feature/*`, `feat/*` | `feat:` |
| `fix/*`, `bugfix/*` | `fix:` |
| `hotfix/*` | `hotfix:` |
| `docs/*` | `docs:` |
| `refactor/*` | `refactor:` |
| `test/*` | `test:` |
| `chore/*` | `chore:` |

## 변경사항 기반 추론

### 파일 확장자/경로 기반

| 변경된 파일 | 추론 접두사 |
|------------|-------------|
| `*.md`, `docs/*` | `docs:` |
| `*.test.*`, `*.spec.*`, `__tests__/*` | `test:` |
| `package.json`, `tsconfig.json`, `.eslintrc` | `chore:` |
| `.github/*`, `Dockerfile`, `*.yml` (CI) | `ci:` |

### 변경 내용 키워드 기반

| diff 내용 키워드 | 추론 접두사 |
|-----------------|-------------|
| `TODO`, `FIXME` 제거 | `fix:` |
| `console.log` 제거 | `chore:` |
| 새 함수/컴포넌트 추가 | `feat:` |
| import 정리만 | `style:` |

## 추론 우선순위

1. **브랜치 이름** (가장 우선)
2. **변경된 파일 경로/확장자**
3. **diff 내용 분석**
4. **기본값**: `feat:` (새 기능으로 간주)

## 예시

### 브랜치: `feature/user-auth`
```
feat: 사용자 인증 기능 추가
```

### 브랜치: `main`, 변경 파일: `README.md`
```
docs: README 업데이트
```

### 브랜치: `main`, 변경 파일: `src/components/Button.tsx` (버그 수정)
```
fix: Button 컴포넌트 클릭 이벤트 오류 수정
```
