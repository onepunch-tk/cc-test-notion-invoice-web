/**
 * Invoice Detail 페이지 컴포넌트 테스트
 *
 * createRoutesStub을 사용하여 loader 데이터와 함께 컴포넌트를 테스트합니다.
 * - loader 데이터로 인보이스 상세 렌더링
 * - ErrorBoundary 404/400/500 테스트
 */

import { render, screen, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { CompanyInfo } from "~/domain/company";
import type { InvoiceWithLineItems } from "~/domain/invoice";
import InvoiceDetail, {
	ErrorBoundary,
} from "~/presentation/routes/invoices/$invoiceId";

// InvoiceActions 컴포넌트 모킹
vi.mock("~/presentation/components/invoice", async () => {
	const actual = await vi.importActual<
		typeof import("~/presentation/components/invoice")
	>("~/presentation/components/invoice");
	return {
		...actual,
		InvoiceActions: ({
			invoice,
			companyInfo,
		}: {
			invoice?: { invoice_id: string };
			companyInfo?: { company_name: string };
		}) => (
			<div
				data-testid="invoice-actions"
				data-invoice-id={invoice?.invoice_id}
				data-company-name={companyInfo?.company_name}
			>
				<a href="/invoices">목록으로</a>
				<button>인쇄</button>
				<button>PDF 다운로드</button>
			</div>
		),
	};
});

// formatDate/formatCurrency 함수 모킹
vi.mock("~/presentation/lib/format", () => ({
	formatDate: vi.fn((date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}),
	formatCurrency: vi.fn((amount: number, currency: string) => {
		if (currency === "KRW") {
			return `\u20A9${amount.toLocaleString()}`;
		}
		return `$${amount.toLocaleString()}`;
	}),
}));

/**
 * Mock InvoiceWithLineItems 생성 헬퍼
 */
const createMockInvoice = (
	overrides: Partial<InvoiceWithLineItems> = {},
): InvoiceWithLineItems => ({
	invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
	invoice_number: "INV-2024-DETAIL-001",
	client_name: "스마트커머스 주식회사",
	client_email: "finance@smartcommerce.co.kr",
	client_address: "서울특별시 서초구 반포대로 45, 스마트타워 8층",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: "Sent",
	subtotal: 7500000,
	tax_rate: 10,
	tax_amount: 750000,
	total_amount: 8250000,
	currency: "KRW",
	notes: "본 인보이스는 2024년 1분기 웹 개발 프로젝트에 대한 청구서입니다.",
	created_at: new Date("2024-01-15"),
	line_items: [
		{
			id: "line-001",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "웹 개발 컨설팅 서비스",
			quantity: 3,
			unit_price: 800000,
			line_total: 2400000,
			sort_order: 1,
		},
		{
			id: "line-002",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "UI/UX 디자인",
			quantity: 2,
			unit_price: 600000,
			line_total: 1200000,
			sort_order: 2,
		},
		{
			id: "line-003",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "백엔드 API 개발",
			quantity: 1,
			unit_price: 1500000,
			line_total: 1500000,
			sort_order: 3,
		},
		{
			id: "line-004",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "프론트엔드 개발",
			quantity: 2,
			unit_price: 500000,
			line_total: 1000000,
			sort_order: 4,
		},
		{
			id: "line-005",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "QA 테스팅",
			quantity: 3,
			unit_price: 200000,
			line_total: 600000,
			sort_order: 5,
		},
		{
			id: "line-006",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "프로젝트 관리",
			quantity: 2,
			unit_price: 400000,
			line_total: 800000,
			sort_order: 6,
		},
	],
	...overrides,
});

/**
 * Mock CompanyInfo 생성 헬퍼
 */
const createMockCompanyInfo = (
	overrides: Partial<CompanyInfo> = {},
): CompanyInfo => ({
	company_name: "테크솔루션 주식회사",
	company_address: "서울특별시 강남구 테헤란로 152, 강남파이낸스센터 15층",
	company_email: "billing@techsolution.co.kr",
	company_phone: "02-1234-5678",
	tax_id: "123-45-67890",
	logo_url: undefined,
	...overrides,
});

/**
 * createRoutesStub을 사용한 렌더링 헬퍼
 */
const renderWithLoaderData = (
	invoice: InvoiceWithLineItems,
	companyInfo: CompanyInfo,
) => {
	const RoutesStub = createRoutesStub([
		{
			path: "/invoices/:invoiceId",
			Component: InvoiceDetail,
			loader: () => ({ invoice, companyInfo }),
		},
	]);

	return render(
		<RoutesStub initialEntries={[`/invoices/${invoice.invoice_id}`]} />,
	);
};

/**
 * ErrorBoundary 테스트용 렌더링 헬퍼
 */
const renderWithError = (status: number, message: string) => {
	const RoutesStub = createRoutesStub([
		{
			path: "/invoices/:invoiceId",
			Component: InvoiceDetail,
			ErrorBoundary: ErrorBoundary,
			loader: () => {
				throw new Response(message, { status });
			},
		},
	]);

	return render(<RoutesStub initialEntries={["/invoices/abc123"]} />);
};

describe("Invoice Detail 페이지", () => {
	describe("기존 기능 검증", () => {
		it("인보이스 상세 헤딩을 렌더링해야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(
				await screen.findByRole("heading", {
					level: 1,
					name: /인보이스 상세/i,
				}),
			).toBeInTheDocument();
		});

		it("invoice_id를 표시해야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(await screen.findByText(/인보이스 ID:/i)).toBeInTheDocument();
		});
	});

	describe("InvoiceActions 컴포넌트 렌더링", () => {
		it("페이지 상단에 InvoiceActions가 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const actionsContainer = await screen.findByTestId("invoice-actions");
			expect(actionsContainer).toBeInTheDocument();
		});

		it('"목록으로" 링크가 렌더링되어야 한다', async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const backLink = await screen.findByRole("link", { name: /목록으로/i });
			expect(backLink).toBeInTheDocument();
			expect(backLink).toHaveAttribute("href", "/invoices");
		});

		it('"인쇄" 버튼이 렌더링되어야 한다', async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const printButton = await screen.findByRole("button", {
				name: /인쇄/i,
			});
			expect(printButton).toBeInTheDocument();
		});

		it('"PDF 다운로드" 버튼이 렌더링되어야 한다', async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const pdfButton = await screen.findByRole("button", {
				name: /pdf 다운로드/i,
			});
			expect(pdfButton).toBeInTheDocument();
		});

		it("InvoiceActions에 invoice props가 전달되어야 한다", async () => {
			const invoice = createMockInvoice();
			const companyInfo = createMockCompanyInfo();
			renderWithLoaderData(invoice, companyInfo);

			const actionsContainer = await screen.findByTestId("invoice-actions");
			expect(actionsContainer).toHaveAttribute(
				"data-invoice-id",
				invoice.invoice_id,
			);
		});

		it("InvoiceActions에 companyInfo props가 전달되어야 한다", async () => {
			const invoice = createMockInvoice();
			const companyInfo = createMockCompanyInfo();
			renderWithLoaderData(invoice, companyInfo);

			const actionsContainer = await screen.findByTestId("invoice-actions");
			expect(actionsContainer).toHaveAttribute(
				"data-company-name",
				companyInfo.company_name,
			);
		});
	});

	describe("InvoiceHeader 컴포넌트 렌더링", () => {
		it("회사 정보가 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(
				await screen.findByText("테크솔루션 주식회사"),
			).toBeInTheDocument();
		});

		it("인보이스 번호가 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(
				await screen.findByText("INV-2024-DETAIL-001"),
			).toBeInTheDocument();
		});

		it("고객 정보(Bill To)가 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(await screen.findByText(/bill to/i)).toBeInTheDocument();
		});

		it("발행일과 마감일이 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				const dateElements = screen.getAllByText(/\d{4}-\d{2}-\d{2}/);
				expect(dateElements.length).toBeGreaterThanOrEqual(2);
			});
		});
	});

	describe("InvoiceTable 컴포넌트 렌더링", () => {
		it("라인 아이템 테이블이 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			expect(await screen.findByRole("table")).toBeInTheDocument();
		});

		it("테이블 헤더가 올바르게 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				expect(
					screen.getByRole("columnheader", { name: /description/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("columnheader", { name: /qty/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("columnheader", { name: /unit price/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("columnheader", { name: /total/i }),
				).toBeInTheDocument();
			});
		});

		it("6개 라인 아이템이 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				const rows = screen.getAllByRole("row");
				// 헤더 1개 + 데이터 6개 = 7개
				expect(rows.length).toBe(7);
			});
		});
	});

	describe("InvoiceSummary 컴포넌트 렌더링", () => {
		it("요약 섹션이 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const summaryContainer = await screen.findByTestId(
				"invoice-summary-container",
			);
			expect(summaryContainer).toBeInTheDocument();
		});

		it("소계(subtotal)가 올바르게 표시되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const subtotalElement = await screen.findByTestId(
				"invoice-summary-subtotal",
			);
			expect(subtotalElement).toHaveTextContent("7,500,000");
		});

		it("세율과 세금이 올바르게 표시되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				const taxLabelElement = screen.getByTestId("invoice-summary-tax-label");
				expect(taxLabelElement).toHaveTextContent("10%");

				const taxAmountElement = screen.getByTestId(
					"invoice-summary-tax-amount",
				);
				expect(taxAmountElement).toHaveTextContent("750,000");
			});
		});

		it("총액(total)이 올바르게 표시되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const totalElement = await screen.findByTestId("invoice-summary-total");
			expect(totalElement).toHaveTextContent("8,250,000");
		});

		it("통화가 KRW로 표시되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const totalElement = await screen.findByTestId("invoice-summary-total");
			expect(totalElement).toHaveTextContent("\u20A9");
		});
	});

	describe("Notes 섹션 렌더링", () => {
		it("notes가 있을 때 Notes 섹션이 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const notesSection = await screen.findByTestId("invoice-notes");
			expect(notesSection).toBeInTheDocument();
		});

		it("notes가 없을 때 Notes 섹션이 렌더링되지 않아야 한다", async () => {
			renderWithLoaderData(
				createMockInvoice({ notes: undefined }),
				createMockCompanyInfo(),
			);

			await screen.findByTestId("invoice-detail-container");
			expect(screen.queryByTestId("invoice-notes")).not.toBeInTheDocument();
		});
	});

	describe("페이지 레이아웃 구조", () => {
		it("페이지 컨테이너가 적절한 패딩을 가져야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const container = await screen.findByTestId("invoice-detail-container");
			expect(container.className).toMatch(/p[xy]?-/);
		});

		it("print-optimized 클래스가 적용되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const container = await screen.findByTestId("invoice-detail-container");
			expect(container).toHaveClass("print-optimized");
		});

		it("반응형 최대 너비가 적용되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			const container = await screen.findByTestId("invoice-detail-container");
			expect(container.className).toMatch(/max-w-/);
		});
	});

	describe("데이터 통합 검증", () => {
		it("loader 데이터로 모든 컴포넌트가 렌더링되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				// InvoiceActions
				expect(screen.getByTestId("invoice-actions")).toBeInTheDocument();
				// InvoiceHeader (회사/고객 정보)
				expect(screen.getByText(/bill to/i)).toBeInTheDocument();
				// InvoiceTable
				expect(screen.getByRole("table")).toBeInTheDocument();
				// InvoiceSummary
				expect(
					screen.getByTestId("invoice-summary-container"),
				).toBeInTheDocument();
			});
		});

		it("loader의 라인 아이템이 InvoiceTable에 전달되어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				const dataRows = screen.getAllByRole("row").slice(1); // 헤더 제외
				expect(dataRows).toHaveLength(6);
			});
		});
	});

	describe("접근성 검증", () => {
		it("페이지에 적절한 제목 계층 구조가 있어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				const h1Elements = screen.getAllByRole("heading", { level: 1 });
				expect(h1Elements.length).toBeGreaterThanOrEqual(1);
			});
		});

		it("테이블에 적절한 시맨틱 구조가 있어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				expect(screen.getByRole("table")).toBeInTheDocument();
				expect(screen.getAllByRole("columnheader").length).toBeGreaterThan(0);
				expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
			});
		});

		it("버튼과 링크에 접근 가능한 이름이 있어야 한다", async () => {
			renderWithLoaderData(createMockInvoice(), createMockCompanyInfo());

			await waitFor(() => {
				expect(
					screen.getByRole("link", { name: /목록으로/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("button", { name: /인쇄/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("button", { name: /pdf 다운로드/i }),
				).toBeInTheDocument();
			});
		});
	});

	describe("ErrorBoundary 렌더링", () => {
		it("404 에러 시 NotFoundState가 렌더링되어야 한다", async () => {
			renderWithError(404, "Invoice not found");

			const notFoundState = await screen.findByTestId("not-found-state");
			expect(notFoundState).toBeInTheDocument();
		});

		it("404 에러 시 인보이스 목록 링크가 표시되어야 한다", async () => {
			renderWithError(404, "Invoice not found");

			const listLink = await screen.findByRole("link", {
				name: /인보이스 목록으로/i,
			});
			expect(listLink).toBeInTheDocument();
			expect(listLink).toHaveAttribute("href", "/invoices");
		});

		it("500 에러 시 ErrorState가 렌더링되어야 한다", async () => {
			renderWithError(500, "Server error");

			const errorState = await screen.findByTestId("error-state");
			expect(errorState).toBeInTheDocument();
		});

		it("에러 상태에서 재시도 버튼이 표시되어야 한다", async () => {
			renderWithError(500, "Server error");

			const retryButton = await screen.findByRole("button", {
				name: /Try Again/i,
			});
			expect(retryButton).toBeInTheDocument();
		});

		it("에러 상태에서 인보이스 목록 링크가 표시되어야 한다", async () => {
			renderWithError(500, "Server error");

			const listLink = await screen.findByRole("link", { name: /Go Home/i });
			expect(listLink).toBeInTheDocument();
			expect(listLink).toHaveAttribute("href", "/invoices");
		});

		it("400 에러 시 잘못된 요청 메시지가 표시되어야 한다", async () => {
			renderWithError(400, "Invalid invoice ID format");

			const errorState = await screen.findByTestId("error-state");
			expect(errorState).toBeInTheDocument();
		});
	});
});
