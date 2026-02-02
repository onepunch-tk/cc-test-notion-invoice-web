/**
 * InvoiceCard 컴포넌트 테스트
 *
 * TDD Red 단계: 컴포넌트 구현 전 실패하는 테스트 작성
 */
import { screen } from "@testing-library/react";
import type { Invoice } from "~/domain/invoice/invoice.types";
import InvoiceCard from "~/presentation/components/invoice/invoice-card";
import {
	createValidInvoiceData,
	INVOICE_STATUS,
} from "../../../fixtures/invoice/invoice.fixture";
import { renderWithRouter } from "../../../utils/render-with-router";

/**
 * 타입이 적용된 Invoice 데이터 생성 헬퍼
 */
const createInvoice = (
	overrides: Parameters<typeof createValidInvoiceData>[0] = {},
): Invoice => createValidInvoiceData(overrides) as Invoice;

describe("InvoiceCard", () => {
	describe("렌더링", () => {
		it("invoice_number를 올바르게 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				invoice_number: "INV-2024-TEST-001",
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			expect(screen.getByText("INV-2024-TEST-001")).toBeInTheDocument();
		});

		it("client_name을 올바르게 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				client_name: "Test Company Ltd.",
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			expect(screen.getByText("Test Company Ltd.")).toBeInTheDocument();
		});

		it("포맷된 issue_date를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				issue_date: new Date("2024-03-15"),
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			// 날짜 포맷팅 확인 (예: "2024-03-15" 또는 "Mar 15, 2024" 형태)
			expect(
				screen.getByText(/2024.*03.*15|Mar.*15.*2024|2024년.*3월.*15일/i),
			).toBeInTheDocument();
		});

		it("포맷된 total_amount를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				total_amount: 1250.5,
				currency: "USD",
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			// 금액 포맷팅 확인 (예: "$1,250.50" 또는 "1,250.50 USD" 형태)
			expect(screen.getByText(/1,?250\.?50|1250\.50/)).toBeInTheDocument();
		});
	});

	describe("Badge 상태 표시", () => {
		it("Draft 상태일 때 secondary variant Badge를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				status: INVOICE_STATUS.DRAFT,
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			const badge = screen.getByText(INVOICE_STATUS.DRAFT);
			expect(badge).toBeInTheDocument();
			// Badge가 secondary variant 스타일을 가지는지 확인 (bg-secondary 클래스)
			expect(badge).toHaveClass("bg-secondary");
		});

		it("Sent 상태일 때 outline variant Badge를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				status: INVOICE_STATUS.SENT,
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			const badge = screen.getByText(INVOICE_STATUS.SENT);
			expect(badge).toBeInTheDocument();
			// Badge가 outline variant 스타일을 가지는지 확인 (border는 있지만 bg-transparent가 아닌 것)
			expect(badge).toHaveClass("text-foreground");
		});

		it("Paid 상태일 때 default variant Badge를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				status: INVOICE_STATUS.PAID,
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			const badge = screen.getByText(INVOICE_STATUS.PAID);
			expect(badge).toBeInTheDocument();
			// Badge가 default variant 스타일을 가지는지 확인 (bg-primary 클래스)
			expect(badge).toHaveClass("bg-primary");
		});

		it("Overdue 상태일 때 destructive variant Badge를 렌더링한다", () => {
			// Arrange
			const invoice = createInvoice({
				status: INVOICE_STATUS.OVERDUE,
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			const badge = screen.getByText(INVOICE_STATUS.OVERDUE);
			expect(badge).toBeInTheDocument();
			// Badge가 destructive variant 스타일을 가지는지 확인 (bg-destructive 클래스)
			expect(badge).toHaveClass("bg-destructive");
		});
	});

	describe("링크 동작", () => {
		it("카드가 /invoices/{invoice_id} 경로로 연결되는 링크이다", () => {
			// Arrange
			const invoice = createInvoice({
				invoice_id: "test-invoice-123",
			});

			// Act
			renderWithRouter(<InvoiceCard invoice={invoice} />);

			// Assert
			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/invoices/test-invoice-123");
		});
	});

	describe("스타일링", () => {
		it("커스텀 className이 적용된다", () => {
			// Arrange
			const invoice = createInvoice();
			const customClassName = "custom-test-class";

			// Act
			renderWithRouter(
				<InvoiceCard invoice={invoice} className={customClassName} />,
			);

			// Assert
			const card = screen.getByRole("link");
			expect(card).toHaveClass(customClassName);
		});
	});
});
