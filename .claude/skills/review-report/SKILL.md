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

# Review Report Skill

Generates a standardized unified review report for the code-reviewer agent.

---

## Output

| Location | Description |
|----------|-------------|
| `docs/reports/code-review/` | Unified review report (quality + security + performance) |

---

## Workflow

### 1. Get Commit Hash and Date
```bash
COMMIT_HASH=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d)
FILENAME="${COMMIT_HASH}_${DATE}.md"
```

### 2. Load Template
Load `references/report-template.md` as the report structure.

### 3. Collect Issues
Collect issues from the calling agent with required fields:
- **severity**: critical | high | medium | low
- **domain**: quality | security | performance
- **confidence**: high (90%+) | medium (70-89%) | low (<70%)
- **location**: file:line
- **category**: issue classification
- **problem**: problem description
- **impact**: why it matters
- **suggestion**: how to fix
- **evidence**: code snippet or reference
- **references**: documentation links (optional)

### 4. Apply Confidence Filtering
| Confidence | Treatment |
|------------|-----------|
| High (90%+) | Include in main findings tables |
| Medium (70-89%) | Include in main findings with advisory note |
| Low (<70%) | Include in Advisory section only |

### 5. Generate Report
Apply collected data to the template and generate the markdown report.

### 6. Save Report
Save to `docs/reports/code-review/{commit_hash}_{YYYYMMDD}.md`

---

## Severity Definitions

| Level | Emoji | Definition | Required Action |
|-------|-------|------------|-----------------|
| Critical | 🔴 | Bugs, security vulnerabilities, production blockers | Must fix before merge |
| High | 🟠 | Important issues affecting maintainability/security | Should fix before merge |
| Medium | 🟡 | Code quality issues, potential problems | Fix soon |
| Low | 🟢 | Style suggestions, minor improvements | Optional |

---

## Reference Template

- [Report Template](references/report-template.md)
