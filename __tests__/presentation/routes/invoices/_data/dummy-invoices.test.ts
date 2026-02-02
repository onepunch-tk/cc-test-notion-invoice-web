/**
 * dummyInvoices 더미 데이터 테스트
 *
 * TDD Red Phase: 아직 구현되지 않은 dummyInvoices 배열을 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { describe, expect, it } from "vitest";
import type { Invoice, InvoiceStatus } from "~/domain/invoice/invoice.types";
import { dummyInvoices } from "~/presentation/routes/invoices/_data/dummy-invoices";

describe("dummyInvoices", () => {
	describe("배열 구조 검증", () => {
		it("dummyInvoices 배열이 정확히 8개의 아이템을 포함해야 한다", () => {
			// Arrange & Act
			const invoiceCount = dummyInvoices.length;

			// Assert
			expect(invoiceCount).toBe(8);
		});

		it("배열의 모든 요소가 Invoice 타입 스키마를 준수해야 한다", () => {
			// Arrange
			const requiredFields: (keyof Invoice)[] = [
				"invoice_id",
				"invoice_number",
				"client_name",
				"client_email",
				"client_address",
				"issue_date",
				"due_date",
				"status",
				"subtotal",
				"tax_rate",
				"tax_amount",
				"total_amount",
				"currency",
				"created_at",
			];

			// Act & Assert
			for (const invoice of dummyInvoices) {
				for (const field of requiredFields) {
					expect(invoice).toHaveProperty(field);
				}
			}
		});
	});

	describe("상태 분포 검증", () => {
		it("Draft 상태의 인보이스가 정확히 2개여야 한다", () => {
			// Arrange
			const expectedStatus: InvoiceStatus = "Draft";

			// Act
			const draftInvoices = dummyInvoices.filter(
				(invoice) => invoice.status === expectedStatus,
			);

			// Assert
			expect(draftInvoices).toHaveLength(2);
		});

		it("Sent 상태의 인보이스가 정확히 2개여야 한다", () => {
			// Arrange
			const expectedStatus: InvoiceStatus = "Sent";

			// Act
			const sentInvoices = dummyInvoices.filter(
				(invoice) => invoice.status === expectedStatus,
			);

			// Assert
			expect(sentInvoices).toHaveLength(2);
		});

		it("Paid 상태의 인보이스가 정확히 3개여야 한다", () => {
			// Arrange
			const expectedStatus: InvoiceStatus = "Paid";

			// Act
			const paidInvoices = dummyInvoices.filter(
				(invoice) => invoice.status === expectedStatus,
			);

			// Assert
			expect(paidInvoices).toHaveLength(3);
		});

		it("Overdue 상태의 인보이스가 정확히 1개여야 한다", () => {
			// Arrange
			const expectedStatus: InvoiceStatus = "Overdue";

			// Act
			const overdueInvoices = dummyInvoices.filter(
				(invoice) => invoice.status === expectedStatus,
			);

			// Assert
			expect(overdueInvoices).toHaveLength(1);
		});
	});

	describe("통화 다양성 검증", () => {
		it("KRW 통화를 사용하는 인보이스가 존재해야 한다", () => {
			// Arrange
			const targetCurrency = "KRW";

			// Act
			const krwInvoices = dummyInvoices.filter(
				(invoice) => invoice.currency === targetCurrency,
			);

			// Assert
			expect(krwInvoices.length).toBeGreaterThan(0);
		});

		it("USD 통화를 사용하는 인보이스가 존재해야 한다", () => {
			// Arrange
			const targetCurrency = "USD";

			// Act
			const usdInvoices = dummyInvoices.filter(
				(invoice) => invoice.currency === targetCurrency,
			);

			// Assert
			expect(usdInvoices.length).toBeGreaterThan(0);
		});

		it("통화가 KRW 또는 USD만 사용되어야 한다", () => {
			// Arrange
			const allowedCurrencies = ["KRW", "USD"];

			// Act & Assert
			for (const invoice of dummyInvoices) {
				expect(allowedCurrencies).toContain(invoice.currency);
			}
		});
	});

	describe("필드 유효성 검증", () => {
		it("모든 인보이스의 invoice_id가 고유해야 한다", () => {
			// Arrange
			const invoiceIds = dummyInvoices.map((invoice) => invoice.invoice_id);

			// Act
			const uniqueIds = new Set(invoiceIds);

			// Assert
			expect(uniqueIds.size).toBe(invoiceIds.length);
		});

		it("모든 인보이스의 invoice_number가 고유해야 한다", () => {
			// Arrange
			const invoiceNumbers = dummyInvoices.map(
				(invoice) => invoice.invoice_number,
			);

			// Act
			const uniqueNumbers = new Set(invoiceNumbers);

			// Assert
			expect(uniqueNumbers.size).toBe(invoiceNumbers.length);
		});

		it("모든 인보이스의 total_amount가 양수여야 한다", () => {
			// Act & Assert
			for (const invoice of dummyInvoices) {
				expect(invoice.total_amount).toBeGreaterThan(0);
			}
		});

		it("모든 인보이스의 due_date가 issue_date 이후여야 한다", () => {
			// Act & Assert
			for (const invoice of dummyInvoices) {
				const issueDate = new Date(invoice.issue_date);
				const dueDate = new Date(invoice.due_date);
				expect(dueDate.getTime()).toBeGreaterThanOrEqual(issueDate.getTime());
			}
		});
	});
});
