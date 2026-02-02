# Invoice-Web MVP PRD

## Core Information

**Purpose**: Transform Notion-managed invoices into shareable web pages with PDF download capability
**Users**: Administrators managing invoice data in Notion, and clients viewing/downloading invoices via web

## User Journey

```
1. [Admin: Notion Database]
   ↓ [Creates/Updates invoice in Notion]

2. [System: Auto-generates unique invoice URL]
   ↓ [Admin shares URL with client]

3. [Client: Receives URL]
   ↓ [Clicks invoice link]

4. [Invoice Detail Page]
   ↓ [Client decision]

   [View on Web] → [Reads invoice details] → [Done]
   [Download PDF] → [Clicks download button] → [Saves PDF file] → [Done]
```

## Feature Specifications

### 1. MVP Core Features

| ID | Feature Name | Description | MVP Necessity | Related Pages |
|----|--------------|-------------|---------------|---------------|
| **F001** | Invoice Detail View | Display comprehensive invoice information including company details, client info, line items, amounts, and dates | Core value delivery - primary service purpose | Invoice Detail Page |
| **F002** | PDF Export | Convert displayed invoice into downloadable PDF with identical layout and formatting | Core value delivery - essential client requirement | Invoice Detail Page |
| **F003** | Notion Database Integration | Fetch and synchronize invoice data from Notion database in real-time | Core business logic - single source of truth | Invoice Detail Page, Invoice List Page |
| **F004** | Invoice List View | Display all available invoices with basic information (invoice number, client name, date, amount) | Basic user need - navigation to specific invoices | Invoice List Page |
| **F005** | Responsive Design | Ensure invoice pages are mobile-friendly and print-ready | Basic user need - multi-device accessibility | Invoice Detail Page, Invoice List Page |

### 2. MVP Required Support Features

| ID | Feature Name | Description | MVP Necessity | Related Pages |
|----|--------------|-------------|---------------|---------------|
| **F006** | URL-based Access | Access invoices via unique URL without authentication | Minimum access control for MVP | Invoice Detail Page |
| **F007** | Invoice Number Validation | Validate invoice ID from URL and handle not-found cases | Essential data integrity | Invoice Detail Page |
| **F008** | Loading States | Display loading indicators during data fetch from Notion API | Essential UX for network operations | Invoice Detail Page, Invoice List Page |
| **F009** | Error Handling | Display user-friendly error messages for API failures or invalid invoices | Essential reliability feature | Invoice Detail Page, Invoice List Page |

### 3. Post-MVP Features (Excluded)

- Password-protected invoice access
- Invoice approval/rejection workflow
- Email notification system
- Payment integration
- Invoice versioning and history
- Multi-language support
- Custom branding per client
- Analytics and tracking

## Menu Structure

```
📱 Invoice-Web Navigation

🏠 Public Access (No Authentication)
├── 📄 Invoice List
│   └── Feature: F003, F004, F005, F008, F009 (Browse all invoices)
├── 📋 Invoice Detail
│   └── Feature: F001, F002, F003, F005, F006, F007, F008, F009 (View and download specific invoice)
└── ❓ Not Found
    └── Feature: F009 (Handle invalid invoice URLs)

🔧 Common Features (All Pages)
├── 🎨 Responsive Layout
│   └── Feature: F005 (Mobile/Desktop optimization)
└── ⚡ Loading & Error States
    └── Feature: F008, F009 (User feedback)
```

---

## Page-by-Page Detailed Features

### Invoice List Page

> **Implemented Features:** `F003`, `F004`, `F005`, `F008`, `F009` | **Menu Location:** Home/Landing Page

| Item | Content |
|------|---------|
| **Role** | Landing page providing overview of all available invoices with quick access links |
| **Entry Path** | Direct URL access to root domain (e.g., invoice-web.com/) or homepage navigation |
| **User Actions** | Browse invoice list, click on specific invoice to view details, search/filter invoices (visual scan) |
| **Key Features** | • Invoice grid/table with key information (number, client name, date, total amount)<br>• Real-time data sync from Notion database<br>• Responsive card/table layout<br>• Loading skeleton during data fetch<br>• Error message display if Notion API fails<br>• **Click invoice card** to navigate to detail page |
| **Next Navigation** | Click invoice → Invoice Detail Page, API error → Error state display |

---

### Invoice Detail Page

> **Implemented Features:** `F001`, `F002`, `F003`, `F005`, `F006`, `F007`, `F008`, `F009` | **Auth:** Public (URL-based)

| Item | Content |
|------|---------|
| **Role** | Core invoice presentation page displaying complete invoice information with PDF export capability |
| **Entry Path** | URL with invoice identifier (e.g., invoice-web.com/invoices/:invoiceId), accessed via shared link or from Invoice List Page |
| **User Actions** | Read invoice details, verify line items and amounts, download PDF copy, navigate back to list |
| **Key Features** | • Complete invoice layout (company logo, addresses, invoice #, dates, payment terms)<br>• Itemized line items table (description, quantity, unit price, total)<br>• Subtotal, tax, and grand total calculations<br>• Invoice metadata (issue date, due date, status)<br>• Notion data fetching with invoice ID validation<br>• Mobile-responsive and print-optimized layout<br>• Loading state during initial fetch<br>• 404 error handling for invalid invoice IDs<br>• **Download as PDF** button (client-side PDF generation)<br>• **Back to List** navigation link |
| **Next Navigation** | Success → Display invoice, Download → Save PDF file, Invalid ID → 404 error page, Back button → Invoice List Page |

---

### 404 Error Page

> **Implemented Features:** `F009` | **Auth:** Public

| Item | Content |
|------|---------|
| **Role** | Error state page for invalid invoice URLs or not-found resources |
| **Entry Path** | Auto-redirect when invalid invoice ID is accessed or Notion API returns no matching invoice |
| **User Actions** | Read error message, navigate back to homepage or invoice list |
| **Key Features** | • Clear error message ("Invoice not found")<br>• Suggested actions (return to homepage)<br>• **Go to Invoice List** button |
| **Next Navigation** | Button click → Invoice List Page |

---

## Data Model

### Invoice (Notion Database)
| Field | Description | Type/Relation |
|-------|-------------|---------------|
| invoice_id | Unique invoice identifier (used in URL) | Text (Unique) |
| invoice_number | Human-readable invoice number | Text |
| client_name | Name of the client receiving invoice | Text |
| client_email | Client contact email | Email |
| client_address | Client billing address | Text |
| issue_date | Date invoice was issued | Date |
| due_date | Payment due date | Date |
| status | Invoice status (Draft, Sent, Paid, Overdue) | Select |
| subtotal | Subtotal before tax | Number |
| tax_rate | Tax percentage | Number |
| tax_amount | Calculated tax amount | Number |
| total_amount | Grand total including tax | Number |
| currency | Currency code (USD, KRW, etc.) | Text |
| notes | Additional notes or payment instructions | Text |
| created_at | Record creation timestamp | Date |

### InvoiceLineItem (Notion Database Relation)
| Field | Description | Type/Relation |
|-------|-------------|---------------|
| id | Unique line item identifier | UUID |
| invoice_id | Reference to parent invoice | → Invoice.invoice_id |
| description | Item/service description | Text |
| quantity | Number of units | Number |
| unit_price | Price per unit | Number |
| line_total | Calculated line total (quantity × unit_price) | Number |
| sort_order | Display order in invoice | Number |

### CompanyInfo (Notion Database - Single Record)
| Field | Description | Type/Relation |
|-------|-------------|---------------|
| company_name | Invoice issuer company name | Text |
| company_address | Company billing address | Text |
| company_email | Company contact email | Email |
| company_phone | Company phone number | Text |
| logo_url | Company logo image URL | URL |
| tax_id | Tax identification number | Text |

## Tech Stack (Latest Versions)

### Frontend Framework

- **React Router Framework v7** (App Router) - React full-stack framework with SSR
- **TypeScript 5.6+** - Type safety
- **React 19** - UI library with latest concurrency features

### Styling & UI

- **TailwindCSS v4** (New CSS engine without config file) - Utility CSS framework
- **shadcn/ui** - High-quality React component library
- **Lucide React** - Icon library

### PDF Generation

- **@react-pdf/renderer** - Client-side only PDF generation
  - ⚠️ Cloudflare Workers edge runtime에서 서버 사이드 렌더링 불가
  - PDFDownloadLink 컴포넌트로 브라우저에서 생성

### Backend & Data Source

- **Notion API (@notionhq/client)** - Primary data source for invoice management
- **Notion Database** - Invoice, LineItem, and Company data storage

### Caching (Rate Limit 대응)

- **Cloudflare KV** - Notion API 응답 캐싱 (TTL: 5-15분)
  - Rate Limit: 3 requests/second 제한 대응
  - InvoiceLineItem 관계형 쿼리 시 배치 처리 권장

### Deployment & Hosting

- **Cloudflare Workers** - Serverless edge deployment
- **Wrangler** - Cloudflare deployment CLI

### Package Management

- **bun** - Fast package manager and runtime

### Additional Libraries

- **Zod** - Runtime validation for Notion API responses
- **date-fns** - Date formatting and manipulation

---

## Consistency Validation Checklist

### Step 1: Feature Specs → Page Connection Validation

- [x] Do all Feature IDs in Feature Specifications exist in Page-by-Page Detailed Features?
  - F001 → Invoice Detail Page ✓
  - F002 → Invoice Detail Page ✓
  - F003 → Invoice Detail Page, Invoice List Page ✓
  - F004 → Invoice List Page ✓
  - F005 → Invoice Detail Page, Invoice List Page ✓
  - F006 → Invoice Detail Page ✓
  - F007 → Invoice Detail Page ✓
  - F008 → Invoice Detail Page, Invoice List Page ✓
  - F009 → Invoice Detail Page, Invoice List Page, 404 Error Page ✓

- [x] Do all Related Page names in Feature Specifications actually exist in Page-by-Page Detailed Features?
  - Invoice Detail Page ✓
  - Invoice List Page ✓
  - 404 Error Page (added for F009) ✓

### Step 2: Menu Structure → Page Connection Validation

- [x] Do all menu items in Menu Structure exist as corresponding pages in Page-by-Page Detailed Features?
  - Invoice List → Invoice List Page ✓
  - Invoice Detail → Invoice Detail Page ✓
  - Not Found → 404 Error Page ✓

- [x] Are all Feature IDs referenced in menu defined in Feature Specifications?
  - F001, F002, F003, F004, F005, F006, F007, F008, F009 all defined ✓

### Step 3: Page-by-Page Detailed Features → Back-reference Validation

- [x] Are all Implemented Feature IDs in Page-by-Page Detailed Features defined in Feature Specifications?
  - Invoice List Page: F003, F004, F005, F008, F009 ✓
  - Invoice Detail Page: F001, F002, F003, F005, F006, F007, F008, F009 ✓
  - 404 Error Page: F009 ✓

- [x] Are all pages accessible from Menu Structure?
  - All three pages listed in menu structure ✓

### Step 4: Missing and Orphan Item Validation

- [x] Are there features only in Feature Specifications not implemented in any page?
  - None - all features F001-F009 implemented ✓

- [x] Are there features only in pages not defined in Feature Specifications?
  - None - all page features reference defined Feature IDs ✓

- [x] Are there menu items without actual pages?
  - None - all menu items have corresponding pages ✓

**Validation Result: PASSED ✓**

---

## Development Notes

### Critical Implementation Points

1. **Notion API Integration**
   - Store Notion API key and database IDs in environment variables
   - Implement caching strategy to reduce API calls (consider Cloudflare KV)
   - Handle rate limiting gracefully

2. **PDF Generation**
   - Match PDF layout exactly with web view for consistency
   - Optimize for A4 print size
   - Include print-friendly styles (no background colors, optimized margins)

3. **Performance**
   - Cloudflare Cache API / KV를 활용한 edge caching 구현 (ISR 대체)
   - Use React 19 Server Components for initial data fetching
   - Lazy load PDF generation library to reduce initial bundle size (client-side only)

4. **Error Handling**
   - Validate Notion response schema with Zod
   - Implement fallback UI for missing invoice data fields
   - Log errors for debugging (use Cloudflare Workers logging)

5. **Security**
   - Even without authentication, validate invoice_id format to prevent injection
   - Sanitize all Notion data before rendering (XSS prevention)
   - Implement rate limiting on invoice access endpoints

### Next Steps for Implementation

1. Set up Notion database schema with required fields
2. Configure Notion API integration token with read permissions
3. Create invoice detail page with responsive layout
4. Implement PDF generation with matching styles
5. Add invoice list page with filtering
6. Deploy to Cloudflare Workers with environment variables
