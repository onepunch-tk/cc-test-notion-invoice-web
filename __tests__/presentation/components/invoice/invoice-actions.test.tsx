/**
 * InvoiceActions 컴포넌트 테스트
 *
 * 인보이스 상세 페이지 액션 버튼 컴포넌트를 테스트합니다.
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InvoiceActions from "~/presentation/components/invoice/invoice-actions";
import { renderWithRouter } from "../../../utils/render-with-router";

// sonner toast 모킹
vi.mock("sonner", () => ({
	toast: {
		info: vi.fn(),
	},
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
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toBeInTheDocument();
		});

		it("3개의 액션 버튼이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const buttons = screen.getAllByRole("button");
			// "목록으로"는 링크이므로 버튼 2개 (인쇄, PDF 다운로드)
			expect(buttons).toHaveLength(2);
		});
	});

	describe("목록으로 버튼", () => {
		it('"목록으로" 버튼이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			expect(backLink).toBeInTheDocument();
		});

		it('"목록으로" 버튼이 /invoices로 이동해야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			expect(backLink).toHaveAttribute("href", "/invoices");
		});

		it('"목록으로" 버튼에 적절한 아이콘이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const backLink = screen.getByRole("link", { name: /목록으로/i });
			// 아이콘 요소가 존재하는지 확인 (svg 또는 특정 클래스)
			const icon = backLink.querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("인쇄 버튼", () => {
		it('"인쇄" 버튼이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			expect(printButton).toBeInTheDocument();
		});

		it('"인쇄" 버튼 클릭 시 window.print()가 호출되어야 한다', async () => {
			// Arrange
			const user = userEvent.setup();
			renderWithRouter(<InvoiceActions />);

			// Act
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			await user.click(printButton);

			// Assert
			expect(mockPrint).toHaveBeenCalledOnce();
		});

		it('"인쇄" 버튼에 적절한 아이콘이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const printButton = screen.getByRole("button", { name: /인쇄/i });
			const icon = printButton.querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("PDF 다운로드 버튼", () => {
		it('"PDF 다운로드" 버튼이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			expect(pdfButton).toBeInTheDocument();
		});

		it('"PDF 다운로드" 버튼 클릭 시 placeholder toast가 표시되어야 한다', async () => {
			// Arrange
			const user = userEvent.setup();
			renderWithRouter(<InvoiceActions />);

			// Act
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			await user.click(pdfButton);

			// Assert
			expect(toast.info).toHaveBeenCalledOnce();
			expect(toast.info).toHaveBeenCalledWith(expect.stringContaining("PDF"));
		});

		it("onDownloadPdf prop이 제공되면 클릭 시 호출되어야 한다", async () => {
			// Arrange
			const user = userEvent.setup();
			const mockOnDownloadPdf = vi.fn();
			renderWithRouter(<InvoiceActions onDownloadPdf={mockOnDownloadPdf} />);

			// Act
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			await user.click(pdfButton);

			// Assert
			expect(mockOnDownloadPdf).toHaveBeenCalledOnce();
		});

		it("onDownloadPdf prop이 제공되면 toast 대신 콜백이 실행되어야 한다", async () => {
			// Arrange
			const user = userEvent.setup();
			const mockOnDownloadPdf = vi.fn();
			renderWithRouter(<InvoiceActions onDownloadPdf={mockOnDownloadPdf} />);

			// Act
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			await user.click(pdfButton);

			// Assert
			expect(mockOnDownloadPdf).toHaveBeenCalledOnce();
			expect(toast.info).not.toHaveBeenCalled();
		});

		it('"PDF 다운로드" 버튼에 적절한 아이콘이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const pdfButton = screen.getByRole("button", { name: /pdf 다운로드/i });
			const icon = pdfButton.querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("className prop 검증", () => {
		it("className prop이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-actions-class";

			// Act
			renderWithRouter(<InvoiceActions className={customClassName} />);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toHaveClass(customClassName);
		});

		it("className prop과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "mt-4";

			// Act
			renderWithRouter(<InvoiceActions className={customClassName} />);

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
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container).toHaveClass("flex");
		});

		it("버튼 간 적절한 간격이 있어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

			// Assert
			const container = screen.getByTestId("invoice-actions");
			expect(container.className).toMatch(/gap-/);
		});
	});

	describe("접근성 검증", () => {
		it("모든 버튼에 접근 가능한 레이블이 있어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

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
			// Arrange & Act
			renderWithRouter(<InvoiceActions />);

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
