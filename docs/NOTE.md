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
