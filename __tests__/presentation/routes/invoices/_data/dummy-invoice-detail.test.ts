/**
 * dummyInvoiceDetail 더미 데이터 테스트
 *
 * TDD Red Phase: 인보이스 상세 페이지에서 사용할 더미 데이터를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { describe, expect, it } from "vitest";
import type { CompanyInfo } from "~/domain/company/company.types";
import type {
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice/invoice.types";
import {
	dummyCompanyInfo,
	dummyInvoiceDetail,
	dummyLineItems,
} from "~/presentation/routes/invoices/_data/dummy-invoice-detail";

describe("dummyInvoiceDetail", () => {
	describe("dummyCompanyInfo 구조 검증", () => {
		it("dummyCompanyInfo가 모든 필수 CompanyInfo 필드를 포함해야 한다", () => {
			// Arrange
			const requiredFields: (keyof CompanyInfo)[] = [
				"company_name",
				"company_address",
				"company_email",
				"company_phone",
				"tax_id",
			];

			// Act & Assert
			for (const field of requiredFields) {
				expect(dummyCompanyInfo).toHaveProperty(field);
				expect(dummyCompanyInfo[field]).toBeDefined();
			}
		});

		it("dummyCompanyInfo의 company_name이 문자열이어야 한다", () => {
			// Arrange & Act & Assert
			expect(typeof dummyCompanyInfo.company_name).toBe("string");
			expect(dummyCompanyInfo.company_name.length).toBeGreaterThan(0);
		});

		it("dummyCompanyInfo의 company_email이 유효한 이메일 형식이어야 한다", () => {
			// Arrange
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			// Act & Assert
			expect(dummyCompanyInfo.company_email).toMatch(emailRegex);
		});

		it("dummyCompanyInfo의 logo_url이 선택적 필드로 존재할 수 있다", () => {
			// Arrange & Act & Assert
			// logo_url은 선택적 필드이므로 있거나 없을 수 있음
			if (dummyCompanyInfo.logo_url) {
				expect(typeof dummyCompanyInfo.logo_url).toBe("string");
			}
		});
	});

	describe("dummyLineItems 구조 검증", () => {
		it("dummyLineItems가 정확히 6개의 아이템을 포함해야 한다", () => {
			// Arrange & Act
			const itemCount = dummyLineItems.length;

			// Assert
			expect(itemCount).toBe(6);
		});

		it("각 라인 아이템이 유효한 InvoiceLineItem 구조를 가져야 한다", () => {
			// Arrange
			const requiredFields: (keyof InvoiceLineItem)[] = [
				"id",
				"invoice_id",
				"description",
				"quantity",
				"unit_price",
				"line_total",
				"sort_order",
			];

			// Act & Assert
			for (const item of dummyLineItems) {
				for (const field of requiredFields) {
					expect(item).toHaveProperty(field);
				}
			}
		});

		it("각 라인 아이템의 line_total이 quantity * unit_price와 일치해야 한다", () => {
			// Arrange & Act & Assert
			for (const item of dummyLineItems) {
				const calculatedTotal = item.quantity * item.unit_price;
				expect(item.line_total).toBe(calculatedTotal);
			}
		});

		it("라인 아이템이 sort_order 순서대로 정렬되어 있어야 한다", () => {
			// Arrange & Act
			const sortOrders = dummyLineItems.map((item) => item.sort_order);

			// Assert
			for (let i = 0; i < sortOrders.length - 1; i++) {
				expect(sortOrders[i]).toBeLessThanOrEqual(sortOrders[i + 1]);
			}
		});

		it("모든 라인 아이템의 id가 고유해야 한다", () => {
			// Arrange
			const ids = dummyLineItems.map((item) => item.id);

			// Act
			const uniqueIds = new Set(ids);

			// Assert
			expect(uniqueIds.size).toBe(ids.length);
		});

		it("모든 라인 아이템의 invoice_id가 동일해야 한다", () => {
			// Arrange & Act
			const invoiceIds = dummyLineItems.map((item) => item.invoice_id);
			const uniqueInvoiceIds = new Set(invoiceIds);

			// Assert
			expect(uniqueInvoiceIds.size).toBe(1);
		});
	});

	describe("dummyInvoiceDetail 복합 타입 검증", () => {
		it("dummyInvoiceDetail이 invoice와 line_items를 올바르게 결합해야 한다", () => {
			// Arrange
			const requiredInvoiceFields: (keyof InvoiceWithLineItems)[] = [
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
				"line_items",
			];

			// Act & Assert
			for (const field of requiredInvoiceFields) {
				expect(dummyInvoiceDetail).toHaveProperty(field);
			}
		});

		it("dummyInvoiceDetail의 line_items가 배열이어야 한다", () => {
			// Arrange & Act & Assert
			expect(Array.isArray(dummyInvoiceDetail.line_items)).toBe(true);
		});

		it("dummyInvoiceDetail의 line_items가 dummyLineItems와 일치해야 한다", () => {
			// Arrange & Act & Assert
			expect(dummyInvoiceDetail.line_items).toEqual(dummyLineItems);
		});
	});

	describe("금액 계산 검증", () => {
		it("subtotal이 7,500,000원이어야 한다", () => {
			// Arrange
			const expectedSubtotal = 7500000;

			// Act & Assert
			expect(dummyInvoiceDetail.subtotal).toBe(expectedSubtotal);
		});

		it("taxRate가 10%이어야 한다", () => {
			// Arrange
			const expectedTaxRate = 10;

			// Act & Assert
			expect(dummyInvoiceDetail.tax_rate).toBe(expectedTaxRate);
		});

		it("taxAmount가 750,000원이어야 한다", () => {
			// Arrange
			const expectedTaxAmount = 750000;

			// Act & Assert
			expect(dummyInvoiceDetail.tax_amount).toBe(expectedTaxAmount);
		});

		it("total이 8,250,000원이어야 한다", () => {
			// Arrange
			const expectedTotal = 8250000;

			// Act & Assert
			expect(dummyInvoiceDetail.total_amount).toBe(expectedTotal);
		});

		it("subtotal이 모든 line_items의 line_total 합계와 일치해야 한다", () => {
			// Arrange
			const calculatedSubtotal = dummyLineItems.reduce(
				(sum, item) => sum + item.line_total,
				0,
			);

			// Act & Assert
			expect(dummyInvoiceDetail.subtotal).toBe(calculatedSubtotal);
		});

		it("taxAmount가 subtotal * (taxRate / 100)과 일치해야 한다", () => {
			// Arrange
			const calculatedTaxAmount =
				dummyInvoiceDetail.subtotal * (dummyInvoiceDetail.tax_rate / 100);

			// Act & Assert
			expect(dummyInvoiceDetail.tax_amount).toBe(calculatedTaxAmount);
		});

		it("total_amount가 subtotal + taxAmount와 일치해야 한다", () => {
			// Arrange
			const calculatedTotal =
				dummyInvoiceDetail.subtotal + dummyInvoiceDetail.tax_amount;

			// Act & Assert
			expect(dummyInvoiceDetail.total_amount).toBe(calculatedTotal);
		});
	});

	describe("통화 검증", () => {
		it("dummyInvoiceDetail의 currency가 KRW이어야 한다", () => {
			// Arrange & Act & Assert
			expect(dummyInvoiceDetail.currency).toBe("KRW");
		});
	});
});
