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
| 6 | Call `TaskCreate` tool |
| 7 | **STOP** — Call `TaskList` tool to display tasks |

> ⛔ **CHECKPOINT**: MUST wait for explicit user instruction (e.g., "proceed", "start", "go").
> DO NOT spawn teammates or auto-execute without user approval.

### Phase 2: Execute (after user approval)

1. Switch to `development` branch, create a working branch for the team
2. Spawn teammates with detailed prompts:
   - Task file path
   - Specific files to modify
   - "Follow CLAUDE.md and read your assigned task file"

### Spawn Example

```
Create an agent team with N teammates:
1. "{name}" — Read {task-file-path}. Own files: {file-list}.
2. "{name}" — Read {task-file-path}. Own files: {file-list}.
Use Opus for all teammates. Require plan approval.
```

### Lead Rules

- Use **Delegate Mode** (Shift+Tab) — do NOT implement yourself
- Enable **Plan Approval** for complex/risky tasks
- All teammates work on the **same feature branch** (file ownership prevents conflicts)
- After all teammates complete: run the project's test command (see CLAUDE.md Commands) to verify integration
- Run full review suite: `code-reviewer` + `e2e-tester`
- Fix any integration issues discovered
- **Lead merges** feature branch into `development`
- Update `ROADMAP.md` and `PROJECT-STRUCTURE.md` after merge

### Merge Strategy

```
main
 └── development
      └── {working-branch}  ← single branch, all teammates work here
           ├── teammate-A commits (owns: file-list-A)
           ├── teammate-B commits (owns: file-list-B)
           └── teammate-C commits (owns: file-list-C)

After all teammates done:
  1. Lead runs the project's test command
  2. Lead runs `code-reviewer` + `e2e-tester`
  3. Lead fixes integration issues
  4. Lead merges working branch → development
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
| 4 | Run `code-reviewer` sub-agent only (cost efficiency) |
| 5 | Fix Critical/High issues (Medium/Low → log, don't block) |
| 6 | Run the project's coverage command (see CLAUDE.md Commands) |
| 7 | Commit per [workflow-commits.md](../git/references/workflow-commits.md) |
| 8 | Message lead: files changed, test results, remaining issues |

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
- Teammates run `code-reviewer` only — lead also runs `code-reviewer` + `e2e-tester` post-merge
- Minimize sub-agent calls per teammate
- Avoid broadcast messages — message lead directly
