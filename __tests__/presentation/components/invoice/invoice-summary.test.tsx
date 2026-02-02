import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceSummary from "~/presentation/components/invoice/invoice-summary";

/**
 * InvoiceSummary 컴포넌트 테스트
 *
 * Props:
 * - subtotal: number - 소계
 * - taxRate: number - 세율 (%)
 * - taxAmount: number - 세금 금액
 * - totalAmount: number - 총액
 * - currency?: string - 통화 코드 (기본값: 'KRW')
 * - className?: string - 추가 클래스명
 */
describe("InvoiceSummary 컴포넌트", () => {
	// 기본 테스트 데이터
	const defaultProps = {
		subtotal: 100000,
		taxRate: 10,
		taxAmount: 10000,
		totalAmount: 110000,
	};

	describe("기본 렌더링", () => {
		it("소계(subtotal)를 올바르게 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceSummary {...defaultProps} />);

			// Assert
			const subtotalElement = screen.getByTestId("invoice-summary-subtotal");
			expect(subtotalElement).toBeInTheDocument();
			expect(subtotalElement).toHaveTextContent("100,000");
		});

		it("세금을 세율 퍼센트와 함께 렌더링해야 한다 (예: 'Tax (10%)')", () => {
			// Arrange & Act
			render(<InvoiceSummary {...defaultProps} />);

			// Assert
			const taxLabelElement = screen.getByTestId("invoice-summary-tax-label");
			expect(taxLabelElement).toBeInTheDocument();
			expect(taxLabelElement).toHaveTextContent("10%");

			const taxAmountElement = screen.getByTestId("invoice-summary-tax-amount");
			expect(taxAmountElement).toBeInTheDocument();
			expect(taxAmountElement).toHaveTextContent("10,000");
		});

		it("총액(totalAmount)을 올바르게 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceSummary {...defaultProps} />);

			// Assert
			const totalElement = screen.getByTestId("invoice-summary-total");
			expect(totalElement).toBeInTheDocument();
			expect(totalElement).toHaveTextContent("110,000");
		});
	});

	describe("통화(currency) 처리", () => {
		it("currency prop이 없으면 기본값 KRW를 사용해야 한다", () => {
			// Arrange & Act
			render(<InvoiceSummary {...defaultProps} />);

			// Assert
			// KRW 포맷: 원화 기호 포함
			const totalElement = screen.getByTestId("invoice-summary-total");
			expect(totalElement).toHaveTextContent("₩");
		});

		it("currency prop이 제공되면 해당 통화로 포맷팅해야 한다", () => {
			// Arrange
			const propsWithUSD = {
				subtotal: 1000,
				taxRate: 10,
				taxAmount: 100,
				totalAmount: 1100,
				currency: "USD",
			};

			// Act
			render(<InvoiceSummary {...propsWithUSD} />);

			// Assert
			// USD 포맷: 달러 기호 포함
			const totalElement = screen.getByTestId("invoice-summary-total");
			expect(totalElement).toHaveTextContent("$");
		});
	});

	describe("스타일링", () => {
		it("className prop이 제공되면 적용해야 한다", () => {
			// Arrange
			const customClassName = "custom-summary-class";

			// Act
			render(<InvoiceSummary {...defaultProps} className={customClassName} />);

			// Assert
			const containerElement = screen.getByTestId("invoice-summary-container");
			expect(containerElement).toHaveClass(customClassName);
		});
	});
});
