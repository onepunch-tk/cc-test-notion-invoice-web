# E2E Test Plan for Task 008: Notion API Integration Service

## Test Date
2026-02-05

## Test Environment
- Node Version: v24.12.0
- Bun Version: 1.3.2
- React Router: v7.12.0
- Platform: Cloudflare Workers (development mode)
- Browser: Chromium (agent-browser)

## Test Status: BLOCKED

### Critical Blocker

**Issue**: Development server fails to start due to module import error

```
5:35:57 PM [vite] Internal server error: (0 , __vite_ssr_import_3__.createNotionClient) is not a function
      at createContainer (/Users/tkstart/Desktop/development/remix/invoice-web/app/infrastructure/config/container.ts:23:23)
      at Object.fetch (/Users/tkstart/Desktop/development/remix/invoice-web/adapters/cloudflare/app.ts:19:21)
```

**Root Cause Analysis**:
- The `createNotionClient` export exists in `/Users/tkstart/Desktop/development/remix/invoice-web/app/infrastructure/external/notion/notion.client.ts`
- Node.js ESM import succeeds: `Module exports: [ 'createNotionClient' ]`
- TypeScript compilation passes without errors: `react-router typegen && tsc -b --noEmit` succeeds
- Issue occurs during Vite SSR transformation in Cloudflare Workers mode
- The barrel export pattern in `notion/index.ts` may be causing module resolution issues in Vite SSR context

**Impact**:
- Cannot start development server
- Cannot perform E2E browser-based testing
- Cannot verify user flows
- Cannot test Notion API integration in browser context

**Severity**: CRITICAL - Complete blocker for E2E testing

**Recommended Fix** (for development team):
1. Option A: Use direct imports instead of barrel exports in `container.ts`:
   ```typescript
   import { createNotionClient } from "~/infrastructure/external/notion/notion.client";
   import { createNotionInvoiceRepository } from "~/infrastructure/external/notion/invoice.repository.impl";
   import { createNotionCompanyRepository } from "~/infrastructure/external/notion/company.repository.impl";
   ```
2. Option B: Investigate Vite SSR configuration for barrel export optimization
3. Option C: Add explicit `"exports"` field to package.json for better ESM resolution
4. Option D: Temporarily wrap container creation in try-catch with fallback mock for development

---

## Unit Test Status

**Status**: FAILED - Module resolution errors

All unit tests fail with "Cannot find module" errors:
- `~/application/invoice/errors`
- `~/domain/company`
- `~/domain/invoice`
- `~/infrastructure/external/notion/*`

This suggests the Notion API integration implementation is incomplete or has import path issues that need to be resolved before E2E testing can proceed.

---

## Planned E2E Test Scenarios

Once the blocker is resolved, the following E2E tests should be executed:

### Test Suite 1: Invoice List Page

#### TC-001: Navigate to Invoice List Page
**Priority**: P0 (Critical)
**User Story**: As a user, I want to view the list of all invoices
**Steps**:
1. Start browser session
2. Navigate to `http://localhost:5173/invoices`
3. Wait for page load
4. Verify page title contains "인보이스 목록"
5. Take screenshot

**Expected Results**:
- Page loads successfully (status 200)
- Header displays "인보이스 목록"
- Description text visible: "Notion 데이터베이스로 관리되는 인보이스를 조회합니다."
- Invoice grid is rendered

**Acceptance Criteria**:
- `[data-testid="invoice-list-container"]` exists
- `h1` contains "인보이스 목록"

#### TC-002: Display Invoice Cards
**Priority**: P0 (Critical)
**User Story**: As a user, I want to see invoice cards with summary information
**Steps**:
1. Navigate to `/invoices`
2. Wait for invoice grid to render
3. Count invoice cards
4. Verify first invoice card data
5. Take screenshot

**Expected Results**:
- Invoice grid displays (based on dummy data: 8 invoices)
- Each card shows:
  - Invoice number (e.g., "INV-2024-001")
  - Client name
  - Total amount with currency
  - Status badge (Draft, Sent, Paid, Overdue)
  - Issue date and due date
- Cards are clickable

**Acceptance Criteria**:
- `[data-testid="invoice-grid"]` contains 8 invoice cards
- Each card has proper formatting and data

#### TC-003: Test Loading State
**Priority**: P1 (High)
**User Story**: As a user, I want to see a loading indicator while data is fetched
**Steps**:
1. Navigate to `/invoices`
2. Click "Toggle Loading" button (development mode only)
3. Verify skeleton loader appears
4. Click "Toggle Loading" again
5. Verify invoice grid reappears
6. Take screenshots of both states

**Expected Results**:
- `[data-testid="invoice-list-skeleton"]` visible during loading
- Skeleton shows grid layout with placeholder cards
- Loading state transitions smoothly

#### TC-004: Test Empty State
**Priority**: P1 (High)
**User Story**: As a user, I want to see a helpful message when no invoices exist
**Steps**:
1. Navigate to `/invoices`
2. Click "Toggle Empty" button (development mode only)
3. Verify empty state component appears
4. Check for empty state message and illustration
5. Take screenshot

**Expected Results**:
- Empty state component renders
- User-friendly message displayed
- No invoice grid visible

#### TC-005: Click Invoice Card Navigation
**Priority**: P0 (Critical)
**User Story**: As a user, I want to click an invoice card to view its details
**Steps**:
1. Navigate to `/invoices`
2. Wait for invoice grid
3. Click first invoice card (inv-001)
4. Verify navigation to `/invoices/inv-001`
5. Verify invoice detail page loads

**Expected Results**:
- Browser navigates to `/invoices/inv-001`
- URL changes correctly
- Invoice detail page renders

### Test Suite 2: Invoice Detail Page

#### TC-006: View Invoice Detail
**Priority**: P0 (Critical)
**User Story**: As a user, I want to view the complete details of an invoice
**Steps**:
1. Navigate directly to `/invoices/inv-detail-001`
2. Wait for page load
3. Verify all sections render
4. Take screenshot

**Expected Results**:
- `[data-testid="invoice-detail-container"]` exists
- Page title shows "인보이스 상세"
- Invoice ID displayed: "inv-detail-001"
- All sections visible:
  - InvoiceActions (navigation, print, PDF buttons)
  - InvoiceHeader (company info + client info)
  - InvoiceTable (line items)
  - InvoiceSummary (subtotal, tax, total)
  - Notes section (if present)

**Acceptance Criteria**:
- All data matches dummy data from `dummy-invoice-detail.ts`
- Company name: "테크솔루션 주식회사"
- Client name: "스마트커머스 주식회사"
- Total amount: 8,250,000 KRW

#### TC-007: Verify Company Information Section
**Priority**: P0 (Critical)
**User Story**: As a user, I want to see the issuing company's details
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Locate company info section in InvoiceHeader
3. Verify all company fields

**Expected Results**:
- Company name: "테크솔루션 주식회사"
- Address: "서울특별시 강남구 테헤란로 152, 강남파이낸스센터 15층"
- Email: "billing@techsolution.co.kr"
- Phone: "02-1234-5678"
- Tax ID: "123-45-67890"

#### TC-008: Verify Client Information Section
**Priority**: P0 (Critical)
**User Story**: As a user, I want to see who the invoice is billed to
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Locate client info section in InvoiceHeader
3. Verify all client fields

**Expected Results**:
- Client name: "스마트커머스 주식회사"
- Address: "서울특별시 서초구 반포대로 45, 스마트타워 8층"
- Email: "finance@smartcommerce.co.kr"

#### TC-009: Verify Line Items Table
**Priority**: P0 (Critical)
**User Story**: As a user, I want to see a detailed breakdown of invoice items
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Locate line items table
3. Count rows (should be 6)
4. Verify table headers and data
5. Take screenshot

**Expected Results**:
- Table headers: Description, Quantity, Unit Price, Total
- 6 line items displayed:
  1. 웹 개발 컨설팅 서비스 (3 × 800,000 = 2,400,000)
  2. UI/UX 디자인 (2 × 600,000 = 1,200,000)
  3. 백엔드 API 개발 (1 × 1,500,000 = 1,500,000)
  4. 프론트엔드 개발 (2 × 500,000 = 1,000,000)
  5. QA 테스팅 (3 × 200,000 = 600,000)
  6. 프로젝트 관리 (2 × 400,000 = 800,000)
- All calculations correct
- Proper number formatting with commas

#### TC-010: Verify Invoice Summary Calculations
**Priority**: P0 (Critical)
**User Story**: As a user, I want to see accurate subtotal, tax, and total calculations
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Locate InvoiceSummary section
3. Verify all calculated amounts
4. Take screenshot

**Expected Results**:
- Subtotal: 7,500,000 KRW
- Tax Rate: 10%
- Tax Amount: 750,000 KRW
- Total Amount: 8,250,000 KRW
- Amounts formatted correctly with currency

**Acceptance Criteria**:
- Math.sum(line_items.line_total) === subtotal
- tax_amount === subtotal * (tax_rate / 100)
- total_amount === subtotal + tax_amount

#### TC-011: Verify Notes Section
**Priority**: P1 (High)
**User Story**: As a user, I want to see additional notes or payment instructions
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Scroll to notes section
3. Verify notes content
4. Take screenshot

**Expected Results**:
- `[data-testid="invoice-notes"]` exists
- Notes text displays: "본 인보이스는 2024년 1분기 웹 개발 프로젝트에 대한 청구서입니다..."
- Text preserves line breaks (whitespace-pre-wrap)

#### TC-012: Test Back Navigation
**Priority**: P1 (High)
**User Story**: As a user, I want to navigate back to the invoice list
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Click back button in InvoiceActions
3. Verify navigation to `/invoices`
4. Verify invoice list appears

**Expected Results**:
- Browser navigates back to `/invoices`
- Invoice list grid reloads
- Previous navigation state preserved

#### TC-013: Test Print Functionality (UI Only)
**Priority**: P2 (Medium)
**User Story**: As a user, I want to print the invoice
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Click "Print" button
3. Verify print dialog opens (browser native)
4. Check print styles applied

**Expected Results**:
- Browser print dialog opens
- Print-specific CSS applied:
  - `.no-print` elements hidden
  - `.print-optimized` styling active
  - Page break controls applied

**Note**: Cannot fully test print output in E2E, only verify print dialog trigger

#### TC-014: Test PDF Download Placeholder
**Priority**: P2 (Medium)
**User Story**: As a user, I want to download the invoice as PDF
**Steps**:
1. Navigate to `/invoices/inv-detail-001`
2. Click "Download PDF" button
3. Verify placeholder behavior

**Expected Results**:
- Button is visible and clickable
- Placeholder action occurs (Task 015 will implement actual PDF generation)

**Note**: Full PDF download functionality is out of scope for Task 008

### Test Suite 3: Error Handling

#### TC-015: Test Non-Existent Invoice ID
**Priority**: P0 (Critical)
**User Story**: As a user, I should see an error page for invalid invoice IDs
**Steps**:
1. Navigate to `/invoices/non-existent-id-999`
2. Wait for response
3. Verify error page renders
4. Take screenshot

**Expected Results**:
- 404 error page displays (when Notion API integration is complete)
- User-friendly error message
- Link back to invoice list

**Current Status**: Not yet integrated with Notion API, needs verification once API layer is connected

#### TC-016: Test Network Error Handling
**Priority**: P1 (High)
**User Story**: As a user, I should see a helpful error message if the API fails
**Steps**:
1. Simulate network failure (requires MSW or network throttling)
2. Navigate to `/invoices`
3. Verify error state
4. Take screenshot

**Expected Results**:
- Error boundary catches failure
- User-friendly error message
- Retry or refresh option

**Current Status**: Requires Notion API integration and error boundary testing

### Test Suite 4: Notion API Integration (Post-Blocker Resolution)

#### TC-017: Fetch Invoice List from Notion API
**Priority**: P0 (Critical)
**User Story**: As a system, I want to fetch invoices from Notion database
**Prerequisites**:
- Notion API credentials configured in `.env`
- Test Notion database with sample invoices

**Steps**:
1. Configure valid `NOTION_API_KEY` and database IDs
2. Start dev server
3. Navigate to `/invoices`
4. Monitor network requests
5. Verify Notion API called
6. Check response data

**Expected Results**:
- `POST https://api.notion.com/v1/databases/{invoice_db_id}/query` called
- Response includes invoice pages
- Invoices sorted by `created_time` descending
- UI renders Notion data (not dummy data)

**Verification**:
- Use browser DevTools Network tab
- Check API request headers (Authorization, Notion-Version)
- Validate response structure matches `NotionDatabaseQueryResponse`

#### TC-018: Fetch Invoice Detail with Line Items
**Priority**: P0 (Critical)
**User Story**: As a system, I want to fetch invoice details including line items
**Steps**:
1. Navigate to `/invoices/{valid-notion-invoice-id}`
2. Monitor network requests
3. Verify 2 parallel Notion API calls
4. Check data mapping

**Expected Results**:
- Two Notion API calls fired in parallel:
  1. Query invoice database filtered by Invoice ID
  2. Query line item database filtered by Invoice ID
- Line items sorted by `Sort Order` ascending
- Data correctly mapped to domain types via `notion.mapper.ts`

#### TC-019: Fetch Company Information
**Priority**: P0 (Critical)
**User Story**: As a system, I want to display company info on invoices
**Steps**:
1. Navigate to any invoice detail page
2. Verify company info section
3. Check Notion API call for company database

**Expected Results**:
- Company database queried once
- First record returned as company info
- Data displayed in invoice header

#### TC-020: Test Invoice Not Found Error
**Priority**: P1 (High)
**User Story**: As a system, I should handle non-existent invoice IDs gracefully
**Steps**:
1. Navigate to `/invoices/INVALID-ID-999`
2. Verify error handling
3. Check for `InvoiceNotFoundError`

**Expected Results**:
- Notion API query returns empty results
- `findById` returns `null`
- `InvoiceService.getInvoiceDetail` throws `InvoiceNotFoundError`
- Error boundary or error page displays user-friendly message

#### TC-021: Test Notion API Error Handling
**Priority**: P1 (High)
**User Story**: As a system, I should handle Notion API failures gracefully
**Steps**:
1. Configure invalid Notion API key
2. Navigate to `/invoices`
3. Verify error handling

**Expected Results**:
- Notion API returns 401 Unauthorized
- `NotionApiError` thrown with cause
- Error boundary catches and displays error

#### TC-022: Verify Notion Property Mapping
**Priority**: P0 (Critical)
**User Story**: As a system, I want to correctly map Notion properties to domain types
**Steps**:
1. Fetch invoice from Notion
2. Verify each property mapping:
   - Title property → invoice_id
   - Rich text → client_name, notes
   - Email → client_email
   - Date → issue_date, due_date
   - Select → status
   - Number → amounts
   - URL → logo_url

**Expected Results**:
- All property types correctly extracted via mapper helpers
- `getTitleText`, `getRichText`, `getEmail`, `getDate`, `getSelect`, `getNumber`, `getUrl` functions work correctly
- Zod schemas validate mapped data
- Type guards (`isTitleProperty`, etc.) function correctly

### Test Suite 5: Accessibility & Responsiveness

#### TC-023: Test Keyboard Navigation
**Priority**: P1 (High)
**Steps**:
1. Navigate to `/invoices` via keyboard (Tab)
2. Tab through invoice cards
3. Press Enter to select card
4. Verify navigation works

**Expected Results**:
- All interactive elements focusable
- Focus indicators visible
- Enter/Space activates buttons and links

#### TC-024: Test Mobile Responsive Layout
**Priority**: P1 (High)
**Steps**:
1. Set viewport to mobile (375x667)
2. Navigate to `/invoices`
3. Verify grid adjusts to single column
4. Navigate to invoice detail
5. Verify layout stacks vertically

**Expected Results**:
- Grid: `grid-cols-1` on mobile
- Table scrolls horizontally if needed
- Buttons stack appropriately
- Text remains readable

#### TC-025: Test Tablet Responsive Layout
**Priority**: P2 (Medium)
**Steps**:
1. Set viewport to tablet (768x1024)
2. Navigate to `/invoices`
3. Verify grid shows 2 columns
4. Test detail page layout

**Expected Results**:
- Grid: `sm:grid-cols-2` on tablet
- Optimal spacing and padding

#### TC-026: Test Desktop Layout
**Priority**: P1 (High)
**Steps**:
1. Set viewport to desktop (1920x1080)
2. Navigate to `/invoices`
3. Verify grid shows 3 columns
4. Verify detail page max-width constraint

**Expected Results**:
- Grid: `lg:grid-cols-3` on desktop
- Container `max-w-7xl` applied
- Detail page `max-w-4xl` for readability

---

## Performance Tests

### TC-027: Page Load Performance
**Priority**: P2 (Medium)
**Steps**:
1. Navigate to `/invoices`
2. Measure Time to Interactive (TTI)
3. Measure Largest Contentful Paint (LCP)

**Expected Results**:
- LCP < 2.5s
- TTI < 3.5s
- No layout shifts (CLS < 0.1)

### TC-028: API Response Time
**Priority**: P2 (Medium)
**Steps**:
1. Monitor Notion API response times
2. Measure invoice list query
3. Measure invoice detail query

**Expected Results**:
- Invoice list query < 1s
- Invoice detail (with line items) < 1.5s
- Parallel queries complete faster than sequential

---

## Test Data Requirements

### Notion Test Database Setup
For complete E2E testing, the following Notion databases must be configured:

1. **Invoice Database** (`NOTION_INVOICE_DATABASE_ID`)
   - At least 8 test invoices
   - Various statuses: Draft, Sent, Paid, Overdue
   - Mixed currencies: KRW, USD
   - Properties: Invoice ID (title), client name, email, address, dates, status, amounts, currency, notes

2. **Line Item Database** (`NOTION_LINE_ITEM_DATABASE_ID`)
   - At least 6 line items per test invoice
   - Properties: Invoice ID (relation), description, quantity, unit price, line total, sort order

3. **Company Database** (`NOTION_COMPANY_DATABASE_ID`)
   - 1 company record with complete information
   - Properties: company name, address, email, phone, tax ID, logo URL (optional)

---

## Test Execution Checklist

- [ ] Resolve critical blocker (module import error)
- [ ] Fix unit test module resolution issues
- [ ] Start development server successfully
- [ ] Configure Notion test database
- [ ] Set up `.env` with valid credentials
- [ ] Execute Test Suite 1 (Invoice List)
- [ ] Execute Test Suite 2 (Invoice Detail)
- [ ] Execute Test Suite 3 (Error Handling)
- [ ] Execute Test Suite 4 (Notion API Integration)
- [ ] Execute Test Suite 5 (Accessibility & Responsiveness)
- [ ] Execute Performance Tests
- [ ] Capture screenshots for all test cases
- [ ] Document failed tests with reproduction steps
- [ ] Verify all acceptance criteria from Task 008
- [ ] Generate final test report

---

## Test Automation Script Template

Once blocker is resolved, the following `agent-browser` commands can be used:

```bash
# TC-001: Navigate to Invoice List
agent-browser open http://localhost:5173/invoices
agent-browser wait 2000
agent-browser screenshot __tests__/e2e-screenshots/tc-001-invoice-list.png
agent-browser snapshot -i > __tests__/e2e-screenshots/tc-001-snapshot.txt

# TC-005: Click Invoice Card
agent-browser open http://localhost:5173/invoices
agent-browser wait [data-testid="invoice-grid"]
agent-browser click [data-testid="invoice-grid"] > *:first-child
agent-browser wait 2000
agent-browser get url  # Should be /invoices/inv-001
agent-browser screenshot __tests__/e2e-screenshots/tc-005-invoice-detail.png

# TC-006: Verify Invoice Detail
agent-browser open http://localhost:5173/invoices/inv-detail-001
agent-browser wait [data-testid="invoice-detail-container"]
agent-browser get text h1  # Should include "인보이스 상세"
agent-browser screenshot __tests__/e2e-screenshots/tc-006-detail-page.png

# TC-012: Back Navigation
agent-browser click button:has-text("Back")
agent-browser wait [data-testid="invoice-list-container"]
agent-browser get url  # Should be /invoices

# TC-024: Mobile Responsive Test
agent-browser set viewport 375 667
agent-browser open http://localhost:5173/invoices
agent-browser screenshot __tests__/e2e-screenshots/tc-024-mobile.png
```

---

## Conclusion

E2E testing for Task 008 is currently **BLOCKED** due to a critical Vite SSR module resolution issue with the DI container. The Notion API integration implementation appears incomplete based on failing unit tests.

**Immediate Actions Required**:
1. Fix the `createNotionClient` import error in `container.ts`
2. Resolve unit test module resolution issues
3. Verify all Notion API integration code is properly implemented
4. Ensure `.env` is configured with valid test credentials
5. Re-run this E2E test plan once blockers are resolved

**Test Coverage Once Unblocked**:
- 28 test cases covering UI, navigation, data display, API integration, accessibility, and performance
- Automated browser testing with agent-browser
- Screenshot capture for visual regression
- Network monitoring for API verification

**Next Steps**:
1. Development team to fix critical blocker
2. Re-run unit tests to verify infrastructure layer
3. Execute comprehensive E2E test suite
4. Generate final test report with results
5. Update Task 008 with E2E test completion status
