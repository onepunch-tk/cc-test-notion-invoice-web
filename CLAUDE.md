# Invoice-Web

## Project Overview
- **Service Name**: Invoice-Web
- **Goal**: Transform Notion-managed invoices into shareable web pages with PDF download capability
- **Target Users**: Administrators managing invoice data in Notion, and clients viewing/downloading invoices via web

## Core Principles
> **TDD-First**: All implementations must be preceded by writing tests first.
> **Side Effect Awareness**: All code modifications (except tests) must be written with careful consideration of potential side effects.

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
- PRD Document [docs/PRD.md](docs/PRD.md): **MANDATORY**
- Development RoadMap [docs/ROADMAP.md](docs/ROADMAP.md): **MANDATORY**

### Workflow Execution Steps

Execute these steps SEQUENTIALLY. Each step **MUST** complete before proceeding.

| Step | Action | Blocker |
|------|--------|---------|
| **1** | Enter `PlanMode` | - |
| **2** | Analyze current state thoroughly | - |
| **3** | Create detailed step-by-step plan | - |
| **4** | Call `TaskCreate` tool | - |
| **5** | **STOP** - Call `TaskList` tool to display tasks | **WAIT for user instruction** |
| **6** | Switch to `development` branch (create if not exists) | User approval from Step 5 |
| **7** | Create feature branch from `development` | - |
| **8** | Run `unit-test-writer` sub-agent | - |
| **9** | Implement code to pass tests | - |
| **10** | Run in parallel: `code-reviewer` + `security-auditor` + `performance-analyzer` sub-agents | - |
| **11** | Scan ALL report directories, fix ALL pending issues | - |
| **12** | Run `e2e-tester` sub-agent | - |
| **13** | Fix bugs/issues discovered in E2E tests | E2E failures exist |
| **14** | Run `development-planner` sub-agent | - |
| **15** | Commit changes, merge feature branch to `development` | **ALL Steps 1-14 completed** |

### Critical Checkpoints

```
CHECKPOINT 1: After Step 5 (TaskList)
  → MUST call `TaskList` tool to display all tasks
  → MUST wait for explicit user instruction (e.g., "proceed", "start", "go")
  → DO NOT auto-execute any task without user approval

CHECKPOINT 2: After Step 8 (TDD Red Phase)
  → Verify tests are written and FAILING (Red state)
  → If tests pass immediately → Review test logic (may not be testing correctly)
  → Proceed to Step 9 only when failing tests exist

CHECKPOINT 3: After Step 9 (TDD Green Phase)
  → Run `bun test` to verify ALL unit tests pass
  → If any test fails → Fix implementation before proceeding
  → DO NOT proceed to code review with failing tests

CHECKPOINT 4: After Step 11 (Code Review Fixes)
  → MUST read all report files in /docs/reports/
  → MUST fix ALL issues where status != "complete"
  → Re-run reviewers if significant changes were made
  → THEN proceed to Step 12

CHECKPOINT 5: After Step 12 (E2E Testing)
  → If E2E tests fail → Proceed to Step 13 (bug fixing)
  → If E2E tests pass → Skip Step 13, proceed to Step 14
  → Document all discovered issues before fixing

CHECKPOINT 6: Failure Recovery
  → IF any step fails: STOP execution immediately
  → Report failure details to user
  → WAIT for user instruction before retrying
  → DO NOT auto-retry failed operations
```

### Post-Completion Documentation

After all workflow steps are complete, update the following documents **as needed**:

| Document | Update When |
|----------|-------------|
| `docs/PROJECT-STRUCTURE.md` | New directories, files, or architectural changes |
| `docs/PRD.md` | Feature scope changes or new requirements discovered |
| `CLAUDE.md` | Workflow improvements or new conventions identified |

> **Format Requirements**: Follow the existing format of each document. Write in English.

## Code Conventions [MANDATORY]

### File Naming Convention (React Router Framework) [CRITICAL]
- `*.client.ts` / `*.client.tsx` → **Client-side ONLY** (browser execution)
- `*.server.ts` / `*.server.tsx` → **Server-side ONLY** (SSR execution)

⚠️ **CRITICAL WARNING**:
Files with `.client.ts` suffix are EXCLUDED from server bundles.
If you name a server-side utility `something.client.ts`, it will be bundled as `void 0` and cause runtime errors like `X is not a function`.

**Example of WRONG naming**:
- ❌ `notion.client.ts` - Treated as client-only, causes SSR errors

**Correct naming**:
- ✅ `notion-client.ts` - Hyphen, not dot before "client"
- ✅ `notion.service.ts` - Different suffix

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
| `*.client.ts`, `*.client.tsx` | **CLIENT-SIDE ONLY** - React Router excludes from SSR bundle |
| `*.server.ts`, `*.server.tsx` | **SERVER-SIDE ONLY** - Not available in browser |

## Test Commands

| Command | Description |
|---------|-------------|
| `bun run test` | Run all unit tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run test:coverage:check` | Run tests with coverage (flexible thresholds) |

## TypeCheck Commands
- `bun run typecheck`

