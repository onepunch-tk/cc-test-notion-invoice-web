/**
 * InvoiceActions 컴포넌트 테스트
 *
 * 인보이스 상세 페이지 액션 버튼 컴포넌트를 테스트합니다.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InvoiceActions from "~/presentation/components/invoice/invoice-actions";
import { createValidCompanyInfoData } from "../../../fixtures/company/company.fixture";
import { createTypedInvoiceWithLineItems } from "../../../fixtures/invoice/invoice.fixture";
import { renderWithRouter } from "../../../utils/render-with-router";

// PdfDownloadButton 모킹
vi.mock("~/presentation/components/pdf", () => ({
	PdfDownloadButton: ({
		invoice,
		lineItems,
		companyInfo,
	}: {
		invoice: { invoice_id: string };
		lineItems: unknown[];
		companyInfo: { company_name: string };
	}) => (
		<button
			data-testid="pdf-download-button"
			data-invoice-id={invoice.invoice_id}
			data-line-items-count={lineItems.length}
			data-company-name={companyInfo.company_name}
		>
			PDF 다운로드
		</button>
	),
}));

describe("InvoiceActions", () => {
	// window.print 모킹
	const mockPrint = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		// window.print 모킹
		Object.defineProperty(window, "print", {
			value: mockPrint,
			writable: true,
		});
	});

	describe("기본 렌더링", () => {
		it("액션 컨테이너가 렌더링되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toBeInTheDocument();
		});

		it("3개의 액션 버튼이 렌더링되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const buttons = screen.getAllByRole("button");
			// "목록으로"는 링크이므로 버튼 2개 (인쇄, PDF 다운로드)
			expect(buttons).toHaveLength(2);
		});
	});

	describe("목록으로 버튼", () => {
		it('"목록으로" 버튼이 렌더링되어야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			expect(backLink).toBeInTheDocument();
		});

		it('"목록으로" 버튼이 /invoices로 이동해야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			expect(backLink).toHaveAttribute("href", "/invoices");
		});

		it('"목록으로" 버튼에 적절한 아이콘이 있어야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			// 아이콘 요소가 존재하는지 확인 (svg 또는 특정 클래스)
			const icon = backLink.querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("인쇄 버튼", () => {
		it('"인쇄" 버튼이 렌더링되어야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			expect(printButton).toBeInTheDocument();
		});

		it('"인쇄" 버튼 클릭 시 window.print()가 호출되어야 한다', async () => {
			// Arrange
			const user = userEvent.setup();
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Act
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			await user.click(printButton);

			// Assert
			expect(mockPrint).toHaveBeenCalledOnce();
		});

		it('"인쇄" 버튼에 적절한 아이콘이 있어야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			const icon = printButton.querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("PDF 다운로드 버튼", () => {
		it('"PDF 다운로드" 버튼이 렌더링되어야 한다', () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			expect(pdfButton).toBeInTheDocument();
		});

		it("PdfDownloadButton에 invoice props가 전달되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const pdfButton = screen.getByTestId("pdf-download-button");
			expect(pdfButton).toHaveAttribute("data-invoice-id", invoice.invoice_id);
		});

		it("PdfDownloadButton에 lineItems props가 전달되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const pdfButton = screen.getByTestId("pdf-download-button");
			expect(pdfButton).toHaveAttribute(
				"data-line-items-count",
				String(invoice.line_items.length),
			);
		});

		it("PdfDownloadButton에 companyInfo props가 전달되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const pdfButton = screen.getByTestId("pdf-download-button");
			expect(pdfButton).toHaveAttribute(
				"data-company-name",
				companyInfo.company_name,
			);
		});
	});

	describe("className prop 검증", () => {
		it("className prop이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();
			const customClassName = "custom-actions-class";

			// Act
			renderWithRouter(
				<InvoiceActions
					invoice={invoice}
					companyInfo={companyInfo}
					className={customClassName}
				/>,
			);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toHaveClass(customClassName);
		});

		it("className prop과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();
			const customClassName = "mt-4";

			// Act
			renderWithRouter(
				<InvoiceActions
					invoice={invoice}
					companyInfo={companyInfo}
					className={customClassName}
				/>,
			);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toHaveClass(customClassName);
			// 기본 레이아웃 클래스도 있어야 함
			expect(container.className.length).toBeGreaterThan(
				customClassName.length,
			);
		});
	});

	describe("레이아웃 검증", () => {
		it("버튼들이 flex 레이아웃으로 배치되어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toHaveClass("flex");
		});

		it("버튼 간 적절한 간격이 있어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container.className).toMatch(/gap-/);
		});
	});

	describe("접근성 검증", () => {
		it("모든 버튼에 접근 가능한 레이블이 있어야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			expect(
				screen.getByRole("link", { name: /목록으로/i }),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /인쇄/i })).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /pdf 다운로드/i }),
			).toBeInTheDocument();
		});

		it("버튼들이 키보드로 접근 가능해야 한다", () => {
			// Arrange
			const invoice = createTypedInvoiceWithLineItems();
			const companyInfo = createValidCompanyInfoData();

			// Act
			renderWithRouter(
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />,
			);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });

			// 포커스 가능해야 함
			expect(backLink.tabIndex).not.toBe(-1);
			expect(printButton.tabIndex).not.toBe(-1);
			expect(pdfButton.tabIndex).not.toBe(-1);
		});
	});
});
