---
name: workflow-team
description: |
  Workflow for Agent Teams autonomous parallel development.
  Provides team lead orchestration guide and teammate execution protocol.
  Covers branch strategy, file ownership, communication, and merge order.
argument-hint: "[lead|teammate]"
---

# Agent Teams Workflow

Autonomous parallel development workflow for Agent Teams.
Invoke with: `/workflow-team lead` or `/workflow-team teammate`

---

## For Team Lead (`/workflow-team lead`)

### Setup

1. Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, `docs/ROADMAP.md`
2. Break work into tasks with **clear file ownership** (no overlapping files)
3. Create tasks with `TaskCreate` tool
4. Spawn teammates with detailed prompts:
   - Task file path
   - Specific files to modify
   - "Follow CLAUDE.md and read your assigned task file"

### Spawn Example

```
Create an agent team with N teammates:
1. "{name}" — Read {task-file-path}. Own files: {file-list}.
2. "{name}" — Read {task-file-path}. Own files: {file-list}.
Use Sonnet for all teammates. Require plan approval.
```

### Lead Rules

- Use **Delegate Mode** (Shift+Tab) — do NOT implement yourself
- Enable **Plan Approval** for complex/risky tasks
- Merge teammates' branches in dependency order
- Run full review suite post-merge: `security-auditor` + `performance-analyzer` + `e2e-tester`
- Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` after all merges

### Merge Order

```
main
 └── development
      ├── team/{teammate-A}  ← merge first (most dependencies)
      ├── team/{teammate-B}  ← merge second
      └── team/{teammate-C}  ← merge last (independent)

After each merge: run `bun run test` + resolve conflicts
After all merges: run e2e suite
```

---

## For Teammates (`/workflow-team teammate`)

### Execution Steps

| Step | Action |
|------|--------|
| 1 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, assigned task file |
| 2 | Create branch `team/{your-name}` from `development` |
| 3 | Run `unit-test-writer` sub-agent (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** |
| 4 | Implement code to pass tests (Green Phase) → `bun run test` |
| 5 | Run `code-reviewer` sub-agent only (cost efficiency) |
| 6 | Fix Critical/High issues (Medium/Low → log, don't block) |
| 7 | Run `bun run test:coverage:check` |
| 8 | Commit with descriptive message |
| 9 | Message lead: files changed, test results, remaining issues |

### Teammate Rules

- **ONLY modify files** assigned to you
- **NEVER touch** files owned by another teammate
- **Shared files** (barrel `index.ts`, `routes.ts`): message lead before modifying
- **New files**: create freely within your task scope

### Failure Recovery (Autonomous)

```
IF any step fails:
  1. Log to docs/reports/failures/{teammate-name}-{timestamp}.md
  2. Retry SAME approach (1 attempt)
  3. Retry DIFFERENT approach (1 attempt)
  4. After 3 failures:
     → Message lead: "Blocked on [issue]. Attempted [approaches]."
     → Pick up next available task
     → DO NOT STOP
```

### Communication

| Event | Action |
|-------|--------|
| Task complete | Message lead with summary |
| Blocked by another task | Message lead, pick up next task |
| Found issue in shared code | Message lead (don't fix directly) |
| Need design decision | Message lead with options + recommendation |

---

## Cost Notes

- Use `sonnet` model for teammates (not opus)
- Teammates run `code-reviewer` only — lead runs full suite post-merge
- Minimize sub-agent calls per teammate
- Avoid broadcast messages — message lead directly