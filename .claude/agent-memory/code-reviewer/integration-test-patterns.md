# Integration Test Patterns

## Task 012 Integration Test Review Findings (2026-02-06)

### Excellent Patterns to Follow

#### 1. MSW v2 Handler Factory Pattern
```typescript
// Reusable handler factory for different responses
export const createNotionHandler = (
  databaseId: string,
  pages: PageObjectResponse[],
) => {
  return http.post(
    "https://api.notion.com/v1/databases/:databaseId/query",
    ({ params }) => {
      if (params.databaseId === databaseId) {
        return HttpResponse.json(createNotionQueryResponse(pages));
      }
      return HttpResponse.json(createNotionQueryResponse([]));
    },
  );
};
```

**Benefits**:
- Reusable across tests
- Type-safe responses
- Easy to create different scenarios

#### 2. Scenario-Based Fixture Helpers
```typescript
export const createInvoiceDetailScenario = (
  invoiceId: string,
  lineItemCount = 2,
): {
  invoicePages: PageObjectResponse[];
  lineItemPages: PageObjectResponse[];
} => {
  // Generate related invoice + line items together
  // Maintains referential integrity
};
```

**Benefits**:
- Encapsulates complex test setup
- Maintains data relationships
- Reduces test boilerplate

#### 3. Korean Test Descriptions
```typescript
describe("Cache Integration - Invoice List", () => {
  it("캐시 미스 시 base repository에서 조회 후 캐시에 저장한다", async () => {
    // Test implementation
  });
});
```

**Benefits**:
- Improves team readability (Korean-speaking team)
- Domain terms clear in native language
- Technical terms (cache, repository) mixed appropriately

#### 4. Comprehensive Error Scenario Testing
```typescript
describe("Zod Param Validation → 400 Error", () => {
  it("빈 invoiceId는 400 에러를 발생시켜야 한다", async () => { });
  it("특수문자가 포함된 invoiceId는 400 에러를 발생시켜야 한다", async () => { });
  it("100자를 초과하는 invoiceId는 400 에러를 발생시켜야 한다", async () => { });
  it("SQL injection 시도는 400 에러를 발생시켜야 한다", async () => { });
});
```

**Benefits**:
- Security validation testing
- Input boundary testing
- Clear separation by error type (400/404/500)

#### 5. Full Integration Flow Testing
```typescript
const renderWithIntegration = (invoiceId: string, serviceResponse?: {...}) => {
  const RoutesStub = createRoutesStub([
    {
      path: "/invoices/:invoiceId",
      Component: InvoiceDetail,
      ErrorBoundary,
      loader: async ({ params }) => {
        // Reproduce actual loader logic including Zod validation
        const invoiceIdSchema = z.string().min(1).max(100).regex(/^[a-f0-9-]+$/i);
        const parseResult = invoiceIdSchema.safeParse(params.invoiceId);
        // ...
      },
    },
  ]);
  return render(<RoutesStub initialEntries={[`/invoices/${invoiceId}`]} />);
};
```

**Benefits**:
- Tests complete request flow (validation → loader → component)
- Catches integration issues between layers
- More realistic than isolated component tests

### Patterns to Improve

#### 1. Fixture → Domain Type Conversion

**Current** (duplicated across test files):
```typescript
// In test file
const toInvoiceWithLineItems = (data: ...) => ({
  ...data,
  issue_date: new Date(data.issue_date),
  due_date: new Date(data.due_date),
  status: data.status as InvoiceStatus,
});
```

**Recommended** (shared utility):
```typescript
// In __tests__/fixtures/invoice/invoice.fixture.ts
export const toInvoiceWithLineItems = (
  data: ReturnType<typeof createValidInvoiceWithLineItemsData>,
): InvoiceWithLineItems => ({
  ...data,
  issue_date: new Date(data.issue_date),
  due_date: new Date(data.due_date),
  created_at: new Date(data.created_at),
  status: data.status as InvoiceStatus,
});
```

#### 2. Test Isolation with Fresh Instances

**Current** (shared state risk):
```typescript
beforeEach(() => {
  mockKV = createMockKVNamespace();
  // All tests share this mockKV
});
```

**Recommended** (explicit isolation):
```typescript
it("캐시 히트 시 base repository를 호출하지 않는다", async () => {
  // Arrange - dedicated KV instance for this test
  const testKV = createMockKVNamespace();
  const cache = createKVCacheService(testKV);
  // ...
});
```

**Note**: Current code is acceptable since `beforeEach` recreates `mockKV`, but explicit instances are clearer.

#### 3. Mock vs Real Functions in Integration Tests

**Current** (hardcoded mock logic):
```typescript
vi.mock("~/presentation/lib/format", () => ({
  formatDate: vi.fn((date: Date) => {
    const year = date.getFullYear();
    // ... reproduce format logic
    return `${year}-${month}-${day}`;
  }),
}));
```

**Recommended for Integration Tests**:
```typescript
// Don't mock - use real implementation
import { formatDate, formatCurrency } from "~/presentation/lib/format";

// Assert with actual formatted result
expect(totalElement).toHaveTextContent(formatCurrency(5500000, "KRW"));
```

**Rationale**: Integration tests should test real interactions. Mock only external dependencies (APIs, databases).

### Anti-Patterns Found

#### 1. Type Assertions in Test Data
```typescript
// Avoid
{
  ...createValidInvoiceData({ invoice_id: "inv-001" }),
  issue_date: new Date("2024-01-15"),
  due_date: new Date("2024-02-15"),
  created_at: new Date("2024-01-15"),
} as Invoice,
```

**Solution**: Use typed fixture helpers to eliminate assertions.

#### 2. Magic Numbers
```typescript
// Avoid
expect(duration).toBeLessThan(100);

// Better
const MAX_PARALLEL_FETCH_DURATION_MS = 100;
expect(duration).toBeLessThan(MAX_PARALLEL_FETCH_DURATION_MS);
```

### Test Organization Best Practices

#### Describe Block Hierarchy
```typescript
describe("Feature Name", () => {
  describe("Happy Path Scenarios", () => {
    it("specific behavior", () => {});
  });

  describe("Error Scenarios", () => {
    it("specific error case", () => {});
  });

  describe("Edge Cases", () => {
    it("boundary condition", () => {});
  });

  describe("Accessibility", () => {
    it("ARIA attributes", () => {});
  });
});
```

### AAA Pattern Enforcement

**Always use comments**:
```typescript
it("test description", async () => {
  // Arrange
  const data = createTestData();

  // Act
  const result = await systemUnderTest(data);

  // Assert
  expect(result).toBe(expected);
});
```

### Coverage Checklist for Integration Tests

- [ ] Happy path (main use case)
- [ ] Empty/null data handling
- [ ] Error responses (400, 404, 500)
- [ ] Security validation (injection, XSS)
- [ ] Accessibility (ARIA, semantic HTML)
- [ ] Loading states
- [ ] Edge cases (boundaries, optional fields)
- [ ] Navigation flows
- [ ] Error boundary rendering

## Statistics

### Task 012 Integration Test Quality
- **Total Tests**: 75
- **Files**: 6
- **AAA Pattern Compliance**: 100%
- **Korean Descriptions**: 100%
- **Type Safety**: 100% (Zero `any`)
- **Code Quality**: A-

### Common Test Counts by Category
- Happy path: ~30% of tests
- Error scenarios: ~25% of tests
- Edge cases: ~20% of tests
- Accessibility: ~10% of tests
- Validation: ~15% of tests
