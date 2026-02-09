# Workflow Commit & Merge Conventions

Commit and merge conventions for workflow agents (interactive, team).

> **Format**: Follow [commit-prefix-rules.md](./commit-prefix-rules.md) — emoji + type + Korean description required.

---

## Phase-Specific Commit Patterns

| Phase | Prefix | Message Pattern | Example |
|-------|--------|-----------------|---------|
| Red (tests) | `✅ test:` | `{feature} 실패 테스트 추가` | `✅ test: 인보이스 상세 조회 실패 테스트 추가` |
| Green (impl) | `✨ feat:` | `{feature} 구현` | `✨ feat: 인보이스 상세 조회 구현` |
| Review fix | `♻️ refactor:` | `{feature} 리뷰 피드백 반영` | `♻️ refactor: 인보이스 상세 조회 리뷰 피드백 반영` |
| E2E fix | `🐛 fix:` | `{feature} E2E 테스트 실패 수정` | `🐛 fix: 인보이스 상세 조회 E2E 테스트 실패 수정` |
| Bug fix | `🐛 fix:` | `{description}` | `🐛 fix: 날짜 포맷 오류 수정` |
| Config/Build | `🔧 chore:` | `{description}` | `🔧 chore: 테스트 설정 업데이트` |

---

## Merge Convention

When merging a feature branch into `development`:

```
🔀 merge: {branch} → development ({context})
```

**Example**:
```
🔀 merge: feature/task-014-pdf-export → development (Task 014)
```

---

## Rules

1. **Korean description** required (see commit-prefix-rules.md)
2. **No Co-Authored-By** (see commit-prefix-rules.md)
3. **Atomic commits** — one commit per phase (do not split unnecessarily)
4. Replace `{feature}` with a Korean summary of the implementation target
