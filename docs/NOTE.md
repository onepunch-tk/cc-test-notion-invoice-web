# Development Notes

Common mistakes and solutions encountered during development.

---

## Task 001: Route Structure and Page Shell Setup

### Lesson 1: Testing Library - Multiple Element Matches

**Problem**: Test failed with "Found multiple elements with the text" error when using `screen.getByText(/invoice-web/i)` because the regex matched both header link and footer copyright text.

**Solution**: Be more specific with selectors. Instead of:
```tsx
expect(screen.getByText(/invoice-web/i)).toBeInTheDocument();
```

Use:
```tsx
const footer = screen.getByRole("contentinfo");
expect(footer).toHaveTextContent(/©.*Invoice-Web/i);
```

**Takeaway**: When testing layouts with repeated text (like branding), scope queries to specific elements using `getByRole` first, then check text content.

---

### Lesson 2: React Router v7 Layout Routes

**Pattern**: Use `layout()` helper to wrap routes with a common layout component.

```ts
// app/routes.ts
import { layout, index, route } from "@react-router/dev/routes";

export default [
  // Resource routes outside layout
  route("robots.txt", "presentation/routes/resources/robots.ts"),

  // App routes with layout
  layout("presentation/routes/layouts/app.layout.tsx", [
    index("presentation/routes/home/home.tsx"),
    route("invoices/:invoiceId", "presentation/routes/invoices/$invoiceId.tsx"),
  ]),
] satisfies RouteConfig;
```

**Key Points**:
- Resource routes (robots.txt, sitemap.xml) should be outside the layout
- Dynamic route params use `:paramName` in routes.ts but `$paramName` in file names
- Layout component uses `<Outlet />` to render child routes

---

### Lesson 3: Dynamic Route Types in React Router v7

**Pattern**: Access route types from the generated `+types` directory.

```tsx
// app/presentation/routes/invoices/$invoiceId.tsx
import type { Route } from "./+types/$invoiceId";

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    { title: `Invoice ${params.invoiceId}` },
  ];
};

export default function InvoiceDetail({
  params,
}: {
  params: Route.ComponentProps["params"];
}) {
  return <div>{params.invoiceId}</div>;
}
```

**Key Points**:
- Run `react-router typegen` to generate types before `tsc`
- Import types from `./+types/$filename` (relative to the route file)

---

### Lesson 4: Testing - Regex Pattern for Multiple Keywords

**Problem**: When testing that text contains multiple keywords (e.g., "Notion", "인보이스", "웹", "PDF"), using separate `getByText` calls fails when the same keyword appears in multiple elements.

```tsx
// This fails when "인보이스" appears in both description and link
expect(screen.getByText(/notion/i)).toBeInTheDocument();
expect(screen.getByText(/인보이스/i)).toBeInTheDocument(); // Error: Found multiple elements
```

**Solution**: Use a single regex pattern that matches the entire expected text with all keywords:

```tsx
// Match all keywords in order within a single element
const description = screen.getByText(/notion.*인보이스.*웹.*pdf/i);
expect(description).toBeInTheDocument();
```

**Takeaway**: When testing for multiple keywords in a description, combine them into a single regex pattern to avoid multiple element matches.

---

### Lesson 5: MetaFunction Type Import

**Problem**: React Router v7's auto-generated `+types` directory types are only available after running `react-router typegen`. For simpler cases without complex loader data, this can be avoided.

**Solution**: Use `MetaFunction` from `react-router` directly:

```tsx
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Title" },
    { name: "description", content: "Page description" },
  ];
};
```

**When to use which**:
- `MetaFunction` from `react-router`: Simple pages without loader data
- `Route.MetaArgs` from `+types`: When accessing loader data or params in meta

---

## Task 002: Type Definitions and Interface Design

### Lesson 6: Zod Date Coercion for API Responses

**Problem**: Notion API returns dates as ISO strings, but our domain types expect `Date` objects.

**Solution**: Use `z.coerce.date()` to automatically convert string dates to Date objects:

```ts
export const invoiceSchema = z.object({
  issue_date: z.coerce.date(),  // Accepts both Date and string
  due_date: z.coerce.date(),
  created_at: z.coerce.date(),
});
```

**Key Points**:
- `z.coerce.date()` handles ISO strings like "2024-01-15" and "2024-01-15T00:00:00.000Z"
- Invalid date strings (e.g., "not-a-date") will fail validation
- Use this pattern for any API that returns date strings

---

### Lesson 7: Biome Import Ordering

**Problem**: Biome's `organizeImports` rule requires exports in barrel files to be alphabetically sorted.

**Solution**: Run `bunx biome check --write <paths>` to auto-fix import/export ordering:

```bash
bunx biome check --write app/domain __tests__/domain
```

**Takeaway**: Run biome check after creating barrel files to ensure consistent ordering.

---

### Lesson 8: Test Fixture Builder Pattern

**Pattern**: Create reusable test data builders with override support:

```ts
export const createValidInvoiceData = (
  overrides: Partial<InvoiceData> = {},
) => ({
  invoice_id: "inv-001",
  invoice_number: "INV-2024-001",
  // ... default values
  ...overrides,
});

// Usage in tests
const customData = createValidInvoiceData({ status: "Paid" });
```

**Benefits**:
- Reduces test data duplication
- Makes tests more readable
- Easy to create edge case variations

---

### Lesson 9: Zod Enum vs TypeScript Enum

**Pattern**: Use `as const` objects instead of TypeScript enums for better Zod integration:

```ts
// Instead of: enum InvoiceStatus { Draft = "Draft", ... }
export const InvoiceStatus = {
  Draft: "Draft",
  Sent: "Sent",
  Paid: "Paid",
  Overdue: "Overdue",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

// Zod schema
export const invoiceStatusSchema = z.enum(["Draft", "Sent", "Paid", "Overdue"]);
```

**Benefits**:
- Better type inference
- Works seamlessly with Zod's `z.enum()`
- More predictable runtime behavior

---

## Task 003: Environment Variables and Configuration

### Lesson 10: Zod min(1) for Required Non-Empty Strings

**Problem**: `z.string()` alone accepts empty strings, which is often not desired for required environment variables.

**Solution**: Use `z.string().min(1, "message")` to require non-empty strings:

```ts
export const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
  NOTION_INVOICE_DATABASE_ID: z.string().min(1, "NOTION_INVOICE_DATABASE_ID is required"),
});
```

**Key Points**:
- `z.string()` validates type but allows empty string `""`
- `z.string().min(1)` ensures at least 1 character
- Custom error messages improve debugging when env vars are missing

---

### Lesson 11: Test Import Paths in Monorepo-style Projects

**Problem**: Tests using path aliases like `adapters/shared/env` fail with "Cannot find module" error when TypeScript path mappings aren't configured for the test runner.

**Solution**: Use relative paths in test files:

```ts
// Instead of:
import { envSchema } from "adapters/shared/env";

// Use:
import { envSchema } from "../../../adapters/shared/env";
```

**Takeaway**: Test files should use relative imports unless the test runner (Vitest/Jest) is explicitly configured with path aliases matching `tsconfig.json`.

---

### Lesson 12: Cloudflare KV Type Generation

**Pattern**: Use `bun run cf:typegen` (or `wrangler types`) to auto-generate TypeScript types for Cloudflare bindings.

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "INVOICE_CACHE"
id = "<YOUR_KV_NAMESPACE_ID>"
```

After running `cf:typegen`:
```ts
// worker-configuration.d.ts (auto-generated)
interface Env {
  INVOICE_CACHE: KVNamespace;
  ASSETS: Fetcher;
}
```

**Key Points**:
- Always run `cf:typegen` after modifying `wrangler.toml`
- The generated types ensure type safety when accessing KV, D1, R2, etc.
- Placeholder IDs work for type generation but need real IDs for deployment

---

## Task 004: Common Component Library Implementation

### Lesson 13: formatCurrency Locale Auto-Detection

**Problem**: When calling `formatCurrency(100, "USD")` in tests vs `formatCurrency(100, "USD", "en-US")` in components, different locales produced different output (e.g., "US$100.00" vs "$100.00").

**Solution**: Make locale optional and auto-detect based on currency:

```ts
const currencyLocaleMap: Record<string, string> = {
  KRW: "ko-KR",
  USD: "en-US",
  EUR: "de-DE",
};

export const formatCurrency = (
  amount: number,
  currency = "KRW",
  locale?: string,  // Optional - auto-detected if not provided
): string => {
  const resolvedLocale = locale ?? currencyLocaleMap[currency] ?? "en-US";
  return new Intl.NumberFormat(resolvedLocale, { /* ... */ }).format(amount);
};
```

**Takeaway**: When creating format utilities, consider making locale/region settings optional with smart defaults based on the primary parameter (currency in this case).

---

### Lesson 14: React Testing Library - Text Split Across Elements

**Problem**: `screen.getByText("2024-01-15")` failed when the text was part of a larger string like "Issue Date: 2024-01-15" in a single `<p>` element.

**Solution**: Separate dynamic values into their own elements for testability:

```tsx
// Instead of:
<p>Issue Date: {formatDate(date)}</p>

// Use:
<p>
  <span>Issue Date: </span>
  <span>{formatDate(date)}</span>
</p>
```

**Takeaway**: When testing specific dynamic values, wrap them in separate elements (like `<span>`) so `getByText` can find them precisely.

---

### Lesson 15: Vitest Mock Module - Export All Required Functions

**Problem**: When using `vi.mock("~/presentation/lib/format", () => ({ formatDate: vi.fn() }))`, only `formatDate` was exported, causing errors if other exports like `formatCurrency` were used.

**Solution**: When mocking a module, either:
1. Mock all used exports, or
2. Use `vi.mock` with `importOriginal` to preserve other exports:

```ts
vi.mock("~/presentation/lib/format", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    formatDate: vi.fn((date: Date) => "2024-01-15"),
  };
});
```

**Takeaway**: Be aware that `vi.mock` replaces the entire module. Either mock all needed exports or use `importOriginal` to preserve unmocked functions.

---

### Lesson 16: Badge Variant Class Testing

**Problem**: Testing Badge component variants by checking CSS classes like `bg-primary` or `bg-secondary` is brittle if the underlying component library changes.

**Best Practice**: For production code, prefer testing:
1. The `variant` prop passed to the Badge component
2. The visible text/content
3. Accessibility attributes

However, when verifying visual styling is critical (like status colors), checking specific classes is acceptable:

```tsx
const badge = screen.getByText("Draft");
expect(badge).toHaveClass("bg-secondary");
```

**Takeaway**: Balance between testing implementation details (CSS classes) and behavior. For critical visual states (like status indicators), class testing may be appropriate.

---

### Lesson 17: Parallel TDD with Multiple Components

**Pattern**: When implementing multiple independent components with TDD:

1. Write all failing tests in parallel (spawn multiple test-writer agents)
2. Implement all components
3. Run tests to verify
4. Run code review and security review in parallel (background)

This approach significantly reduces development time for independent component implementations.

```
Tests (parallel) → Implementations (parallel where possible) → Reviews (parallel)
```

**Takeaway**: Identify independent units and parallelize TDD phases when components don't have dependencies on each other

---

## Task 005: Invoice List Page UI

### Lesson 18: Testing Responsive Grid Classes with Tailwind

**Problem**: Tests expecting `md:grid-cols-2` failed when implementation used `sm:grid-cols-2`. The breakpoint naming convention can vary based on design requirements.

**Solution**: Align test expectations with actual design requirements (PRD/plan). In this case, the plan specified:
- Mobile (`< 640px`): 1 column → `grid-cols-1`
- Tablet (`640px - 1023px`): 2 columns → `sm:grid-cols-2`
- Desktop (`>= 1024px`): 3 columns → `lg:grid-cols-3`

```tsx
// Correct classes based on plan
className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
```

**Takeaway**: When writing tests for responsive layouts, verify the breakpoint conventions with the design specification before writing test assertions.

---

### Lesson 19: Skeleton Component Key with Index

**Pattern**: Using array index as key is acceptable for skeleton/placeholder components because they:
1. Are static and don't reorder
2. Don't have meaningful unique identifiers
3. Are purely presentational

```tsx
// Acceptable for skeletons
{Array.from({ length: count }).map((_, index) => (
  <Card key={`skeleton-${index}`} data-testid="invoice-skeleton-card">
    ...
  </Card>
))}
```

**Takeaway**: React's key warning about index-based keys applies to dynamic lists that can reorder. Static placeholder lists can safely use index with a descriptive prefix.

---

### Lesson 20: Accessibility for Empty State Components

**Pattern**: Empty state components should include ARIA attributes for screen reader accessibility:

```tsx
<div
  data-testid="empty-invoice-list"
  role="status"
  aria-live="polite"
  className="flex flex-col items-center justify-center"
>
  <h3>인보이스가 없습니다</h3>
  <p>Notion 데이터베이스에 인보이스를 추가해주세요.</p>
</div>
```

**Key Points**:
- `role="status"` identifies the element as a status message
- `aria-live="polite"` announces changes without interrupting the user
- Important for WCAG compliance and screen reader users

**Takeaway**: Always consider accessibility when creating state-based UI components (empty, loading, error states).

---

### Lesson 21: Development-Only UI Toggle Pattern

**Pattern**: For testing UI states during development, use `process.env.NODE_ENV` conditionally:

```tsx
const isDev = process.env.NODE_ENV === "development";

return (
  <div>
    {isDev && (
      <div className="mb-6 flex gap-2">
        <Button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</Button>
        <Button onClick={() => setIsEmpty(!isEmpty)}>Toggle Empty</Button>
      </div>
    )}
    {/* Main content */}
  </div>
);
```

**Considerations**:
- This is acceptable for dummy data implementations
- For production, replace with React Router's loader pattern and useLoaderData
- Be aware of potential SSR hydration mismatch in some edge cases

**Takeaway**: Use dev-only toggles for prototyping UI states, but plan to replace with proper data fetching patterns during API integration phase

---

## Task 006: Invoice Detail Page UI

### Lesson 22: Sonner Toast vs Window Alert

**Problem**: `window.alert()` is a blocking browser API with poor UX - it interrupts user flow and looks dated.

**Solution**: Use the `sonner` toast library (already in project dependencies) for non-blocking notifications:

```tsx
// Instead of:
window.alert("PDF 다운로드 기능은 추후 구현 예정입니다.");

// Use:
import { toast } from "sonner";
toast.info("PDF 다운로드 기능은 추후 구현 예정입니다.");
```

**Key Points**:
- `sonner` provides `toast.info()`, `toast.success()`, `toast.error()`, `toast.warning()`
- Non-blocking - users can continue interacting with the page
- Consistent styling with the design system
- Accessible by default

**Takeaway**: Prefer toast notifications over browser alerts for placeholder messages and user feedback.

---

### Lesson 23: Testing Multiple Elements with Same Pattern

**Problem**: Tests using `screen.getByText(/inv-/i)` failed when multiple elements matched the pattern (e.g., "inv-unknown" in page header and "INV-2024-DETAIL-001" in invoice content).

**Solution**: Be more specific with test selectors:

```tsx
// Instead of:
expect(screen.getByText(/inv-/i)).toBeInTheDocument();

// Use specific text or getAllBy:
expect(screen.getByText("INV-2024-DETAIL-001")).toBeInTheDocument();
// Or
expect(screen.getByText(/인보이스 ID:/i)).toBeInTheDocument();
```

**Takeaway**: When UI contains multiple similar patterns, use exact text matches or query by more specific selectors to avoid "multiple elements found" errors.

---

### Lesson 24: Print Optimization CSS Classes

**Pattern**: Use dedicated CSS classes for print-specific styling:

```css
@media print {
  /* Hide non-printable elements */
  .no-print {
    display: none !important;
  }

  /* A4 page configuration */
  @page {
    size: A4;
    margin: 10mm;
  }

  /* Prevent page breaks inside elements */
  .print-avoid-break {
    break-inside: avoid;
  }

  /* Ensure colors print correctly */
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

**Usage**:
- `no-print`: Navigation, action buttons
- `print-avoid-break`: Cards, tables, summaries
- `print-optimized`: Container element

**Takeaway**: Separate print styles into utility classes for reusable print optimization across components.

---

### Lesson 25: Mocking Sonner Toast in Tests

**Pattern**: When testing components that use `sonner` toast, mock the entire module:

```tsx
import { toast } from "sonner";
import { vi } from "vitest";

// Mock the module
vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// In test
it("shows toast on button click", async () => {
  await user.click(button);
  expect(toast.info).toHaveBeenCalledWith(expect.stringContaining("PDF"));
});
```

**Takeaway**: When mocking external modules like `sonner`, ensure all used methods are included in the mock object.
