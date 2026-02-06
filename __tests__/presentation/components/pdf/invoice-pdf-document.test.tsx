/**
 * InvoicePdfDocument 컴포넌트 단위 테스트
 *
 * @react-pdf/renderer 컴포넌트를 모킹하여 구조/props 검증
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice/invoice.types";
import {
	createValidCompanyInfoData,
	createValidCompanyInfoWithoutLogo,
} from "../../../fixtures/company/company.fixture";
import {
	createValidInvoiceData,
	createValidLineItemData,
} from "../../../fixtures/invoice/invoice.fixture";

// @react-pdf/renderer 컴포넌트를 HTML 요소로 모킹
vi.mock("@react-pdf/renderer", () => ({
	Document: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="pdf-document">{children}</div>
	),
	Page: ({ children, size }: { children: React.ReactNode; size?: string }) => (
		<div data-testid="pdf-page" data-size={size}>
			{children}
		</div>
	),
	View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	Text: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
	Image: ({ src }: { src?: string }) => (
		<img data-testid="pdf-image" src={src} alt="" />
	),
	StyleSheet: {
		create: <T extends Record<string, unknown>>(styles: T): T => styles,
	},
	Font: {
		register: vi.fn(),
	},
}));

vi.mock("~/presentation/lib/format", () => ({
	formatCurrency: vi.fn(
		(amount: number, currency = "USD") => `${currency} ${amount}`,
	),
	formatDate: vi.fn((date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}),
}));

import InvoicePdfDocument from "~/presentation/components/pdf/invoice-pdf-document";

describe("InvoicePdfDocument", () => {
	let defaultInvoice: Invoice;
	let defaultLineItems: InvoiceLineItem[];
	let defaultCompanyInfo: CompanyInfo;

	beforeEach(() => {
		vi.clearAllMocks();

		defaultInvoice = createValidInvoiceData({
			invoice_number: "INV-2024-001",
			issue_date: new Date("2024-01-15"),
			due_date: new Date("2024-02-15"),
			client_name: "Test Client Corp",
			client_address: "123 Client Street, Seoul",
			client_email: "client@example.com",
			subtotal: 1000,
			tax_rate: 10,
			tax_amount: 100,
			total_amount: 1100,
			currency: "USD",
			notes: "Payment due within 30 days",
		}) as Invoice;

		defaultLineItems = [
			createValidLineItemData({
				id: "line-001",
				description: "Web Development",
				quantity: 10,
				unit_price: 50,
				line_total: 500,
				sort_order: 1,
			}) as InvoiceLineItem,
			createValidLineItemData({
				id: "line-002",
				description: "Design Services",
				quantity: 5,
				unit_price: 100,
				line_total: 500,
				sort_order: 2,
			}) as InvoiceLineItem,
		];

		defaultCompanyInfo = createValidCompanyInfoData({
			company_name: "Acme Inc.",
			company_address: "456 Business Ave, Busan",
			company_email: "billing@acme.com",
			company_phone: "+82-10-1234-5678",
			logo_url: "https://example.com/logo.png",
		}) as CompanyInfo;
	});

	describe("Document 구조", () => {
		it("Document와 Page 컴포넌트가 렌더링된다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
			expect(screen.getByTestId("pdf-page")).toBeInTheDocument();
		});

		it("Page는 A4 사이즈를 가진다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByTestId("pdf-page")).toHaveAttribute("data-size", "A4");
		});
	});

	describe("회사 정보 렌더링", () => {
		it("회사 이름을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Acme Inc.")).toBeInTheDocument();
		});

		it("회사 주소, 이메일, 전화번호를 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("456 Business Ave, Busan")).toBeInTheDocument();
			expect(screen.getByText("billing@acme.com")).toBeInTheDocument();
			expect(screen.getByText("+82-10-1234-5678")).toBeInTheDocument();
		});

		it("logo_url이 있으면 로고 이미지를 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			const image = screen.getByTestId("pdf-image");
			expect(image).toHaveAttribute("src", "https://example.com/logo.png");
		});

		it("logo_url이 없으면 로고를 렌더링하지 않는다", () => {
			const companyWithoutLogo = createValidCompanyInfoWithoutLogo({
				company_name: "No Logo Corp",
			}) as CompanyInfo;

			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={companyWithoutLogo}
				/>,
			);

			expect(screen.queryByTestId("pdf-image")).not.toBeInTheDocument();
		});
	});

	describe("인보이스 메타 정보 렌더링", () => {
		it("INVOICE 제목을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("INVOICE")).toBeInTheDocument();
		});

		it("인보이스 번호를 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("INV-2024-001")).toBeInTheDocument();
		});

		it("포맷팅된 발행일과 마감일을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("2024-01-15")).toBeInTheDocument();
			expect(screen.getByText("2024-02-15")).toBeInTheDocument();
		});
	});

	describe("Bill To 섹션 렌더링", () => {
		it("Bill To 라벨을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Bill To")).toBeInTheDocument();
		});

		it("고객 이름, 주소, 이메일을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Test Client Corp")).toBeInTheDocument();
			expect(screen.getByText("123 Client Street, Seoul")).toBeInTheDocument();
			expect(screen.getByText("client@example.com")).toBeInTheDocument();
		});
	});

	describe("테이블 섹션 렌더링", () => {
		it("테이블 헤더를 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Description")).toBeInTheDocument();
			expect(screen.getByText("Qty")).toBeInTheDocument();
			expect(screen.getByText("Unit Price")).toBeInTheDocument();
		});

		it("라인 아이템을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Web Development")).toBeInTheDocument();
			expect(screen.getByText("Design Services")).toBeInTheDocument();
		});

		it("라인 아이템의 수량과 금액을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("10")).toBeInTheDocument();
			expect(screen.getByText("5")).toBeInTheDocument();
		});

		it("빈 라인 아이템일 경우 No items를 표시한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={[]}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("No items")).toBeInTheDocument();
		});

		it("라인 아이템을 sort_order 순으로 정렬한다", () => {
			const unsortedItems = [
				createValidLineItemData({
					id: "line-b",
					description: "Second Item",
					sort_order: 2,
				}) as InvoiceLineItem,
				createValidLineItemData({
					id: "line-a",
					description: "First Item",
					sort_order: 1,
				}) as InvoiceLineItem,
			];

			const { container } = render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={unsortedItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			const spans = container.querySelectorAll("span");
			const texts = Array.from(spans).map((s) => s.textContent);
			const firstIdx = texts.indexOf("First Item");
			const secondIdx = texts.indexOf("Second Item");
			expect(firstIdx).toBeLessThan(secondIdx);
		});
	});

	describe("합계 섹션 렌더링", () => {
		it("Subtotal을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Subtotal")).toBeInTheDocument();
			expect(screen.getByText("USD 1000")).toBeInTheDocument();
		});

		it("Tax 라벨과 금액을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText(/^Tax \(/)).toBeInTheDocument();
			// USD 100 — line item unit_price와 tax_amount 둘 다 존재
			const usd100Elements = screen.getAllByText("USD 100");
			expect(usd100Elements.length).toBeGreaterThanOrEqual(2);
		});

		it("Total 금액을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// "Total" — table header와 summary 둘 다 존재
			const totalElements = screen.getAllByText("Total");
			expect(totalElements.length).toBeGreaterThanOrEqual(2);
			expect(screen.getByText("USD 1100")).toBeInTheDocument();
		});
	});

	describe("Notes 섹션 렌더링", () => {
		it("notes가 있으면 Notes 섹션을 렌더링한다", () => {
			render(
				<InvoicePdfDocument
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.getByText("Notes")).toBeInTheDocument();
			expect(
				screen.getByText("Payment due within 30 days"),
			).toBeInTheDocument();
		});

		it("notes가 없으면 Notes 섹션을 렌더링하지 않는다", () => {
			const invoiceWithoutNotes = createValidInvoiceData({
				notes: undefined,
			}) as Invoice;

			render(
				<InvoicePdfDocument
					invoice={invoiceWithoutNotes}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			expect(screen.queryByText("Notes")).not.toBeInTheDocument();
		});
	});
});
