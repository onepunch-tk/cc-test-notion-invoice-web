---
name: tdd
description: "TDD (Test-Driven Development) rules and patterns. Use when: (1) Writing unit tests, (2) Determining test targets, (3) Following TDD cycle. Supports Expo, React Native, React Router, NestJS using Vitest/Jest."
---

# TDD Skill

TDD rules and patterns for Node/TypeScript/React projects.

---

## Test Target Rules

### Must Test

| Pattern | Description |
|---------|-------------|
| `*.service.ts` | Service functions |
| `*.helper.ts`, `*.util.ts` | Helper/utility functions |
| `*.tsx` (components) | React components |
| `loader`, `action` | Route loaders/actions |
| `*.schema.ts` | Zod schemas |
| `use*.ts` | Custom hooks |

### Exclude from Testing

| Pattern | Reason |
|---------|--------|
| `*.d.ts` | Type declarations only |
| `**/types.ts`, `**/types/**` | Type definitions only |
| `**/*.port.ts` | Interface definitions only |
| `**/index.ts` | Barrel files (re-exports) |
| `*.config.ts` | Configuration files |
| `**/constants.ts`, `**/const.ts` | Static values only |
| `**/components/ui/**` | shadcn/ui auto-generated |
| `**/*.css`, `**/*.scss` | Style files |

---

## Naming Convention

Source → Test path mapping:

| Source Path | Test Path |
|-------------|-----------|
| `app/services/auth.service.ts` | `__tests__/services/auth.service.test.ts` |
| `app/components/Button.tsx` | `__tests__/components/Button.test.tsx` |
| `app/domain/user/user.schema.ts` | `__tests__/domain/user/user.schema.test.ts` |

**Pattern**: Replace root folder with `__tests__/` and add `.test` before extension.

---

## TDD Cycle

### Red → Green → Refactor

1. **Red** - Write a failing test
2. **Green** - Write minimal code to pass
3. **Refactor** - Improve code (keep tests passing)

---

## AAA Pattern

All tests follow AAA (Arrange-Act-Assert) pattern:

| Phase | Role | Example |
|-------|------|---------|
| **Arrange** | Prepare test data and environment | Mocking, input creation |
| **Act** | Execute test target | Function call, event trigger |
| **Assert** | Verify results | expect statements |

---

## Framework Test Environment

| Framework | Test Runner | Note |
|-----------|-------------|------|
| **Expo** | Jest | Vitest NOT supported |
| **React Native** | Jest | Vitest NOT supported |
| **React Router v7** | Vitest/Jest | Vitest recommended |
| **NestJS** | Jest | Official default |

---

## Test Utility Structure

| Path | Purpose |
|------|---------|
| `__tests__/fixtures/` | Mock data builders |
| `__tests__/utils/` | Test helper functions |

**Rules**:
1. No inline helpers in test files - use shared locations
2. Check existing utilities before creating new ones
3. Support `overrides` parameter for customization

---

## Code Examples

Based on detected framework, read the corresponding reference file (paths relative to `.claude/skills/tdd/`):

| Framework | Reference File |
|-----------|----------------|
| React Router v7 | [references/react-router.example.md](./references/react-router.example.md) |
| React Component | [references/react-component.example.md](./references/react-component.example.md) |
| Zod Schema | [references/zod-schema.example.md](./references/zod-schema.example.md) |
| NestJS | [references/nestjs.example.md](./references/nestjs.example.md) |
| Expo/React Native | [references/expo-react-native.example.md](./references/expo-react-native.example.md) |

> **Note**: Reference examples use English test descriptions for universal accessibility. When writing actual tests, follow the Output Language Rules below.

---

## Output Language Rules

| Item | Language |
|------|----------|
| Test descriptions (`it`, `describe`) | Korean |
| Variable/function names | English |
| Code comments | Korean |

---

## Quality Checklist

Before completing tests:

- [ ] Test file follows naming convention
- [ ] All tests have Korean descriptions
- [ ] AAA pattern followed
- [ ] Mocks initialized in `beforeEach`
- [ ] No `any` type in test code
- [ ] Shared helpers in `__tests__/fixtures/` or `__tests__/utils/`
- [ ] All tests pass
