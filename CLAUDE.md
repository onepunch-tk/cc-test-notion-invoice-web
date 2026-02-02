# Invoice-Web

## Project Overview
- **Service Name**: Invoice-Web
- **Goal**: Transform Notion-managed invoices into shareable web pages with PDF download capability
- **Target Users**: Administrators managing invoice data in Notion, and clients viewing/downloading invoices via web

## Core Principles
> **TDD-First**: All implementations must be preceded by writing tests first.

## Tech Stack
- **Package Manager**
  - bun
- **Language**: TypeScript
- **Backend & SSR Frontend**
  - **basic** React Router Framework Mode v7+
  - **node-based (user choice)**
    - express/fastify + React Router Framework Mode v7+
- **UI**
  - shadcn/ui
  - tailwind css v4+
- **CMS**
  - Notion API
- **Deployment (user choice)**
  - **Cloudflare**: wrangler
- **Lint & Formatter**
  - biome

## Critical Documents
- Project Structure [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md): **MANDATORY** - Reference before ANY task
- Common Mistakes & Solutions [docs/NOTE.md](docs/NOTE.md): **MANDATORY** - Record frequent mistakes after code modifications to prevent repetition
- PRD Document [docs/PRD.md](docs/PRD.md): **MANDATORY**
- Development RoadMap [docs/ROADMAP.md](docs/ROADMAP.md): **MANDATORY**

## Development Workflow [MANDATORY]

> **CRITICAL**: Follow ALL steps below IN ORDER. Do NOT skip any step. Do NOT proceed without explicit user approval at Step 5.

### Workflow Execution Steps

Execute these steps SEQUENTIALLY. Each step MUST complete before proceeding.

| Step | Action | Output | Blocker |
|------|--------|--------|---------|
| **1** | Enter `PlanMode` | Plan mode activated | - |
| **2** | Analyze current state thoroughly | Understanding of existing code, dependencies, impact areas | - |
| **3** | Create detailed step-by-step plan | Comprehensive plan covering edge cases | - |
| **4** | Call `TaskCreate` tool | Granular tasks and subtasks (maximize decomposition) | - |
| **5** | **STOP** - Call `TaskList` tool to display tasks | Task list shown to user | **WAIT for user instruction** |
| **6** | Switch to `development` branch (create if not exists) | On development branch | User approval from Step 5 |
| **7** | Create feature branch from `development` | Feature branch created (e.g., `feat/task-description`) | Step 6 complete |
| **8** | **MUST** Run `unit-test-writer` sub-agent | Failing tests written (TDD Red phase) | Step 7 complete |
| **9** | Implement code to pass tests | All tests pass (TDD Green phase) | Step 8 complete |
| **10** | **MUST** Run background agents in parallel: `code-reviewer` + `security-code-reviewer` | Review reports generated | Step 9 complete |
| **11** | Read `/docs/reports/*`, fix all non-complete issues | All issues resolved | Step 10 complete |
| **12** | Run `e2e-tester` sub-agent | E2E test results | Step 11 complete |
| **13** | Fix bugs/issues discovered in E2E tests | All E2E tests pass | Step 12 complete |
| **14** | Update `/docs/NOTE.md` with lessons learned | Knowledge documented | Step 13 complete |
| **15** | Commit changes, merge feature branch to `development` | Branch merged, feature branch deleted | Step 14 complete |

### Critical Checkpoints

```
CHECKPOINT 0: Before ANY Work (CRITICAL - Branch Safety)
  → NEVER work directly on `main` or `master` branch
  → Verify current branch is NOT main/master before any code changes
  → If on main/master → Switch to development immediately
  → All development MUST happen on feature branches

CHECKPOINT 1: After Step 5 (TaskList)
  → MUST call `TaskList` tool to display all tasks
  → MUST wait for explicit user instruction (e.g., "proceed", "start", "go")
  → DO NOT auto-execute any task without user approval

CHECKPOINT 2: After Step 7 (Branch Setup)
  → Verify on feature branch (NOT main/master/development)
  → If development doesn't exist → Create from main
  → Feature branch naming convention:
    - `feat/` for new features
    - `fix/` for bug fixes
    - `refactor/` for refactoring
    - Example: `feat/add-invoice-pdf-export`

CHECKPOINT 3: After Step 8 (TDD Red Phase)
  → Verify tests are written and FAILING (Red state)
  → If tests pass immediately → Review test logic (may not be testing correctly)
  → Proceed to Step 9 only when failing tests exist

CHECKPOINT 4: After Step 9 (TDD Green Phase)
  → Run `bun test` to verify ALL unit tests pass
  → If any test fails → Fix implementation before proceeding
  → DO NOT proceed to code review with failing tests

CHECKPOINT 5: After Step 11 (Code Review Fixes)
  → MUST read all report files in /docs/reports/
  → MUST fix ALL issues where status != "complete"
  → Re-run reviewers if significant changes were made
  → THEN proceed to Step 12

CHECKPOINT 6: After Step 12 (E2E Testing)
  → If E2E tests fail → Proceed to Step 13 (bug fixing)
  → If E2E tests pass → Skip Step 13, proceed to Step 14
  → Document all discovered issues before fixing

CHECKPOINT 7: After Step 15 (Merge - FINAL)
  → Verify all changes are committed with descriptive message
  → Merge feature branch to development using `--no-ff` (preserve branch history)
  → Delete feature branch after successful merge
  → NEVER merge directly to main/master (requires PR review)

CHECKPOINT 8: Failure Recovery
  → IF any step fails: STOP execution immediately
  → Report failure details to user
  → WAIT for user instruction before retrying
  → DO NOT auto-retry failed operations
```

## Code Conventions [MANDATORY]
### React 19 Optimization & Performance [STRICT]
- **Trust React Compiler**: Since the project uses React 19, the compiler automatically handles rendering optimization. **The use of `useCallback` and `useMemo` is strictly prohibited unless absolutely necessary.**
- **Manual Optimization Restrictions**:
  - **DO NOT** use `useCallback` or `useMemo` by default.
  - Exceptions are granted **ONLY** when performance degradation is empirically proven or computational costs are extremely high.
  - Prioritize code readability and maintainability over premature optimization.

### Function Definition Principles
- **General Functions (Logic, Utils, Handlers, Libs)**:
  - **MUST**: Use **Arrow Functions**.
  - Format: `export const functionName = () => { ... }`
- **React Components**:
  - **MUST**: Use **`export default function`**.
  - Format: `export default function ComponentName() { ... }`

### Type Safety Principles
- **NO `any`**: The explicit use of the `any` type is **strictly prohibited** in all cases.
  - If an external library returns `any`, cast it to `unknown` first, then narrow it down.
- **Use `unknown`**: When the shape of data is uncertain, use `unknown`.
  - **MUST**: Validate data using **Type Guards**, **Zod**, or the **`is`** keyword before using it.

### Generics Usage
- **Constraints**: When using Generics (`T`), always enforce constraints using `extends` to ensure type safety.
  - *Bad*: `const functionName = <T>(arg: T) => { ... }`
  - *Good*: `const functionName = <T extends Record<string, unknown>>(arg: T) => { ... }`
- **Defaults**: Provide safe default types for generics if necessary.

## File Creation Rules
| Pattern | Reason |
|---------|--------|
| `*.d.ts` | Type declarations only |
| `**/types.ts`, `**/types/**` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.config.ts` | Configuration files |
| `**/constants.ts`, `**/const.ts` | Static values only |
| `**/*.css`, `**/*.scss` | Style files |
