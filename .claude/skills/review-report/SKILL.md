---
name: review-report
description: |
  코드 리뷰 자동화 에이전트를 위한 표준화된 리뷰 리포트를 생성합니다.
  리뷰어 에이전트가 호출하여 일관된 형식의 리포트를 출력합니다.
model: sonnet
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
---

# 리뷰 리포트 스킬

코드 리뷰 자동화 에이전트를 위한 표준화된 리포트를 생성합니다.

---

## 파라미터

`$ARGUMENTS`: 리포트 설정 (`<type> [options]` 형식)

| 타입 | 출력 위치 | 설명 |
|-----|----------|------|
| `code-review` | `docs/reports/code-review/` | 코드 품질 리포트 |
| `security-review` | `docs/reports/security-review/` | 보안 감사 리포트 |
| `performance-review` | `docs/reports/performance-review/` | 성능 분석 리포트 |

---

## 워크플로우

### 1. 커밋 해시 및 날짜 가져오기
```bash
COMMIT_HASH=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d)
FILENAME="${COMMIT_HASH}_${DATE}.md"
```

### 2. 템플릿 선택
리포트 타입에 따라 적절한 템플릿 로드:
- `references/report-template.md`

### 3. 이슈 집계
호출 에이전트로부터 필수 필드와 함께 이슈 수집:
- **severity**: critical | high | medium | low
- **location**: file:line
- **category**: 이슈 분류
- **problem**: 문제 설명
- **impact**: 중요한 이유
- **suggestion**: 해결 방법
- **evidence**: 코드 스니펫 또는 참조
- **references**: 문서 링크 (선택)

### 4. 리포트 생성
템플릿에 집계된 데이터를 적용하여 마크다운 리포트 생성

### 5. 리포트 저장
`docs/reports/{type}/{commit_hash}_{YYYYMMDD}.md` 에 저장

---

## 심각도 정의

| 레벨 | 이모지 | 정의 | 필요 조치 |
|-----|-------|-----|----------|
| Critical | 🔴 | 버그, 보안 취약점, 프로덕션 차단 | 머지 전 필수 수정 |
| High | 🟠 | 유지보수성/보안에 영향을 주는 중요 이슈 | 머지 전 수정 권장 |
| Medium | 🟡 | 코드 품질 이슈, 잠재적 문제 | 빠른 시일 내 해결 |
| Low | 🟢 | 스타일 제안, 사소한 개선 | 선택 사항 |

---

## 참조 템플릿

- [리포트 템플릿](references/report-template.md)
