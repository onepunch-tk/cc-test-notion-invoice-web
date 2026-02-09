---
name: workflow-interactive
description: |
  Development workflow for implementation tasks. Use when: implementing features, fixing bugs, creating components, writing routes, integrating APIs, or any task that involves writing production code. Provides the standard TDD-first development cycle with code review and validation steps. Do NOT use for research, documentation-only, or planning-only tasks.
---

# Interactive Development Workflow

Standard development workflow for human-in-the-loop implementation tasks.
Follow these steps **sequentially**. Each step MUST complete before proceeding.

---

## Phase 1: Plan

| Step | Action |
|------|--------|
| 1 | Enter `PlanMode` |
| 2 | Analyze current state thoroughly |
| 3 | Create detailed step-by-step plan |
| 4 | Call `TaskCreate` tool |
| 5 | **STOP** — Call `TaskList` tool to display tasks |

> ⛔ **CHECKPOINT**: MUST wait for explicit user instruction (e.g., "proceed", "start", "go").
> DO NOT auto-execute any task without user approval.

---

## Phase 2: TDD (after user approval)

| Step | Action |
|------|--------|
| 6 | Switch to `development` branch (create if not exists) |
| 7 | Create feature branch from `development` |
| 8 | Run `unit-test-writer` sub-agent → **verify tests FAIL** (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** |
| 9 | Implement code to pass tests → run `bun run test` → **verify ALL pass** (Green Phase) |

**Auto-verify (no human wait needed)**:
- After Step 8: If tests pass immediately → review test logic, likely not testing correctly
- After Step 9: If any test fails → fix implementation before proceeding

> 💡 **Context tip**: Consider `/clear` here. Plan context is no longer needed.

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Red/Green phase

---

## Phase 3: Review

| Step | Action |
|------|--------|
| 10 | Run `code-reviewer` sub-agent (unified: quality + security + performance) |
| 11 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" |

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — Review phase

> 💡 **Context tip**: Consider `/clear` here. Review details are no longer needed.

---

## Phase 4: Validate & Finalize

| Step | Action |
|------|--------|
| 12 | Run `e2e-tester` sub-agent |
| 13 | Fix bugs discovered in E2E (skip if all pass) |
| 14 | Run `development-planner` sub-agent |
| 15 | Merge feature branch to `development` |

**Commit**: Per [workflow-commits.md](../git/references/workflow-commits.md) — E2E fix phase (if needed)

---

## Failure Recovery

```
IF any step fails:
  1. Log failure to docs/reports/failures/{timestamp}-{step}.md
  2. Retry SAME approach (1 attempt)
  3. Retry DIFFERENT approach (1 attempt)
  4. After 3 total failures → STOP, report to user, WAIT for instruction
```

---

## Context Management

- `/clear` after Phase 2 (TDD complete): plan + test exploration no longer needed
- `/clear` after Phase 3 (review complete): review reports no longer needed
- Target: stay under 60k tokens per phase
- If unsure: `/context` to check usage