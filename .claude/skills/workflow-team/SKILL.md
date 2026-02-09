---
name: workflow-team
description: |
  Workflow for Agent Teams autonomous parallel development.
  Provides team lead orchestration guide and teammate execution protocol.
  Covers file ownership, communication, and merge strategy.
argument-hint: "[lead|teammate]"
---

# Agent Teams Workflow

Autonomous parallel development workflow for Agent Teams.
Invoke with: `/workflow-team lead` or `/workflow-team teammate`

---

## For Team Lead (`/workflow-team lead`)

### Phase 1: Plan

| Step | Action |
|------|--------|
| 1 | Enter `PlanMode` |
| 2 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, `docs/ROADMAP.md` |
| 3 | Analyze task scope, identify required files and dependencies |
| 4 | Break work into tasks with **clear file ownership** (no overlapping files) |
| 5 | Create detailed step-by-step plan with task breakdown |
| 6 | Exit `PlanMode` → wait for plan approval |

> After plan approval, create tasks via `TaskCreate` and spawn teammates immediately. No separate confirmation needed.

### Phase 2: Execute (after user approval)

| Step | Action |
|------|--------|
| 1 | Switch to `development` branch, create a working branch for the team |
| 2 | Spawn teammates with detailed prompts (see Spawn Example below) |
| 3 | Use **Delegate Mode** (Shift+Tab) — do NOT implement yourself |
| 4 | Monitor teammate progress, unblock as needed |

> Enable **Plan Approval** for complex/risky tasks.
> All teammates work on the **same feature branch** (file ownership prevents conflicts).

#### Spawn Example

```
Create an agent team with N teammates:
1. "{name}" — Read {task-file-path}. Own files: {file-list}.
2. "{name}" — Read {task-file-path}. Own files: {file-list}.
Use Opus for all teammates. Require plan approval.
```

### Phase 3: Review & Merge (after all teammates complete)

| Step | Action |
|------|--------|
| 1 | Run the project's test command (see CLAUDE.md Commands) to verify integration |
| 2 | Run `code-reviewer` sub-agent on all changed files |
| 3 | Run `e2e-tester` sub-agent to validate user flows |
| 4 | Read report in `/docs/reports/code-review/` → fix ALL issues where status ≠ "complete" |
| 5 | Merge working branch → `development` |
| 6 | Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` |

### Merge Strategy

```
main
 └── development
      └── {working-branch}  ← single branch, all teammates work here
           ├── teammate-A commits (owns: file-list-A)
           ├── teammate-B commits (owns: file-list-B)
           └── teammate-C commits (owns: file-list-C)

After all teammates done → Phase 3
```

### Git Conventions

See [workflow-commits.md](../git/references/workflow-commits.md)

---

## For Teammates (`/workflow-team teammate`)

### Execution Steps

| Step | Action |
|------|--------|
| 1 | Read `CLAUDE.md`, `docs/PROJECT-STRUCTURE.md`, assigned task file |
| 2 | Run `unit-test-writer` sub-agent (Red Phase). **NEVER analyze patterns or write test code yourself — always delegate to the `unit-test-writer` subagent.** |
| 3 | Implement code to pass tests (Green Phase) → run the project's test command (see CLAUDE.md Commands) |
| 4 | Run the project's coverage command (see CLAUDE.md Commands) |
| 5 | Commit per [workflow-commits.md](../git/references/workflow-commits.md) |
| 6 | Message lead: files changed, test results, remaining issues |

### Teammate Rules

- **ONLY modify files** assigned to you
- **NEVER touch** files owned by another teammate
- **Shared files** (barrel `index.ts`, `routes.ts`): message lead before modifying
- **New files**: create freely within your task scope
- **Do NOT create branches** — work on the feature branch created by lead

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

- Use `opus` model for teammates
- Teammates: **NO code-reviewer** — TDD cycle is the quality gate, lead handles all review in Phase 3
- Lead runs `code-reviewer` + `e2e-tester` as the single review gate post-merge
- Minimize sub-agent calls per teammate
- Avoid broadcast messages — message lead directly
