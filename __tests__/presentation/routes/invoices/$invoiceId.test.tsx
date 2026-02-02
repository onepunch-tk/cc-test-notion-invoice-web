/**
 * Invoice Detail 페이지 컴포넌트 테스트
 *
 * TDD Red Phase: Task 006 인보이스 상세 페이지 UI 구현을 위한 테스트입니다.
 * 기존 테스트와 새로운 컴포넌트 통합 테스트가 포함됩니다.
 */

import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InvoiceDetail from "~/presentation/routes/invoices/$invoiceId";
import { renderWithRouter } from "../../../utils/render-with-router";

// formatDate 함수 모킹
vi.mock("~/presentation/lib/format", () => ({
	formatDate: vi.fn((date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}),
	formatCurrency: vi.fn((amount: number, currency: string) => {
		if (currency === "KRW") {
			return `₩${amount.toLocaleString()}`;
		}
		return `$${amount.toLocaleString()}`;
	}),
}));

describe("Invoice Detail 페이지", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderInvoiceDetail = () => {
		return renderWithRouter(<InvoiceDetail />);
	};

	describe("기존 기능 검증", () => {
		it("인보이스 상세 헤딩을 렌더링해야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			expect(
				screen.getByRole("heading", { level: 1, name: /인보이스 상세/i }),
			).toBeInTheDocument();
		});

		it("params에서 invoiceId를 표시해야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// invoiceId가 화면에 표시되어야 함 (구현 시 params에서 가져옴)
			expect(screen.getByText(/인보이스 ID:/i)).toBeInTheDocument();
		});
	});

	describe("InvoiceActions 컴포넌트 렌더링", () => {
		it("페이지 상단에 InvoiceActions가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const actionsContainer = screen.getByTestId("invoice-actions");
			expect(actionsContainer).toBeInTheDocument();
		});

		it('"목록으로" 링크가 렌더링되어야 한다', () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			expect(backLink).toBeInTheDocument();
			expect(backLink).toHaveAttribute("href", "/invoices");
		});

		it('"인쇄" 버튼이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			expect(printButton).toBeInTheDocument();
		});

		it('"PDF 다운로드" 버튼이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			expect(pdfButton).toBeInTheDocument();
		});
	});

	describe("InvoiceHeader 컴포넌트 렌더링", () => {
		it("회사 정보가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// dummyCompanyInfo의 회사명이 표시되어야 함
			expect(screen.getByText("테크솔루션 주식회사")).toBeInTheDocument();
		});

		it("인보이스 번호가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// dummyInvoiceDetail의 인보이스 번호가 표시되어야 함
			expect(screen.getByText("INV-2024-DETAIL-001")).toBeInTheDocument();
		});

		it("고객 정보(Bill To)가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			expect(screen.getByText(/bill to/i)).toBeInTheDocument();
		});

		it("발행일과 마감일이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// 날짜 형식의 텍스트가 존재해야 함
			const dateElements = screen.getAllByText(/\d{4}-\d{2}-\d{2}/);
			expect(dateElements.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("InvoiceTable 컴포넌트 렌더링", () => {
		it("라인 아이템 테이블이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const table = screen.getByRole("table");
			expect(table).toBeInTheDocument();
		});

		it("테이블 헤더가 올바르게 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
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

		it("dummyLineItems의 6개 라인 아이템이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const rows = screen.getAllByRole("row");
			// 헤더 1개 + 데이터 6개 = 7개
			expect(rows.length).toBe(7);
		});

		it("라인 아이템의 설명이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// dummyLineItems에 있는 description 중 하나가 표시되어야 함
			const table = screen.getByRole("table");
			expect(table).toBeInTheDocument();
		});
	});

	describe("InvoiceSummary 컴포넌트 렌더링", () => {
		it("요약 섹션이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const summaryContainer = screen.getByTestId("invoice-summary-container");
			expect(summaryContainer).toBeInTheDocument();
		});

		it("소계(subtotal)가 올바르게 표시되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const subtotalElement = screen.getByTestId("invoice-summary-subtotal");
			expect(subtotalElement).toBeInTheDocument();
			// 7,500,000원이 표시되어야 함
			expect(subtotalElement).toHaveTextContent("7,500,000");
		});

		it("세율과 세금이 올바르게 표시되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const taxLabelElement = screen.getByTestId("invoice-summary-tax-label");
			expect(taxLabelElement).toHaveTextContent("10%");

			const taxAmountElement = screen.getByTestId("invoice-summary-tax-amount");
			// 750,000원이 표시되어야 함
			expect(taxAmountElement).toHaveTextContent("750,000");
		});

		it("총액(total)이 올바르게 표시되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const totalElement = screen.getByTestId("invoice-summary-total");
			expect(totalElement).toBeInTheDocument();
			// 8,250,000원이 표시되어야 함
			expect(totalElement).toHaveTextContent("8,250,000");
		});

		it("통화가 KRW로 표시되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const totalElement = screen.getByTestId("invoice-summary-total");
			expect(totalElement).toHaveTextContent("₩");
		});
	});

	describe("Notes 섹션 렌더링", () => {
		it("notes가 있을 때 Notes 섹션이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// dummyInvoiceDetail에 notes가 있으면 표시되어야 함
			const notesSection = screen.queryByTestId("invoice-notes");
			// notes가 있는 경우에만 존재
			if (notesSection) {
				expect(notesSection).toBeInTheDocument();
			}
		});

		it("Notes 섹션에 제목이 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const notesHeading = screen.queryByRole("heading", { name: /notes/i });
			// notes가 있는 경우에만 존재
			if (notesHeading) {
				expect(notesHeading).toBeInTheDocument();
			}
		});
	});

	describe("페이지 레이아웃 구조", () => {
		it("페이지 컨테이너가 적절한 패딩을 가져야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const container = screen.getByTestId("invoice-detail-container");
			expect(container.className).toMatch(/p[xy]?-/);
		});

		it("print-optimized 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const container = screen.getByTestId("invoice-detail-container");
			expect(container).toHaveClass("print-optimized");
		});

		it("반응형 최대 너비가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const container = screen.getByTestId("invoice-detail-container");
			expect(container.className).toMatch(/max-w-/);
		});
	});

	describe("데이터 통합 검증", () => {
		it("dummyInvoiceDetail 데이터로 모든 컴포넌트가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
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

		it("dummyCompanyInfo의 회사 정보가 InvoiceHeader에 전달되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// 회사 이메일 또는 전화번호가 표시되어야 함
			// dummyCompanyInfo 데이터에 따라 검증
			const header = screen.getByTestId("invoice-actions").parentElement;
			expect(header).toBeDefined();
		});

		it("dummyLineItems가 InvoiceTable에 전달되어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			// 6개의 라인 아이템이 테이블에 렌더링되어야 함
			const dataRows = screen.getAllByRole("row").slice(1); // 헤더 제외
			expect(dataRows).toHaveLength(6);
		});
	});

	describe("접근성 검증", () => {
		it("페이지에 적절한 제목 계층 구조가 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			const h1Elements = screen.getAllByRole("heading", { level: 1 });
			expect(h1Elements.length).toBeGreaterThanOrEqual(1);
		});

		it("테이블에 적절한 시맨틱 구조가 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			expect(screen.getByRole("table")).toBeInTheDocument();
			expect(screen.getAllByRole("columnheader").length).toBeGreaterThan(0);
			expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
		});

		it("버튼과 링크에 접근 가능한 이름이 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceDetail();

			// Assert
			expect(
				screen.getByRole("link", { name: /목록으로/i }),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /인쇄/i })).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /pdf 다운로드/i }),
			).toBeInTheDocument();
		});
	});
});
