/**
 * InvoiceDetail 페이지 Loader 테스트
 *
 * TDD Red Phase: 인보이스 상세 페이지의 loader 함수를 테스트합니다.
 * - 성공: 인보이스 상세 + 회사 정보 반환
 * - 404: 존재하지 않는 인보이스
 * - 400: 잘못된 invoiceId 형식
 * - 500: 서비스 에러
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InvoiceDetailResult } from "~/application/invoice/invoice.service";
import { InvoiceNotFoundError } from "~/application/invoice/errors";
import type { IContainer } from "~/application/shared/container.types";
import type { CompanyInfo } from "~/domain/company";
import type { InvoiceWithLineItems } from "~/domain/invoice";
import { loader } from "~/presentation/routes/invoices/$invoiceId";

/**
 * Mock InvoiceWithLineItems 생성 헬퍼
 */
const createMockInvoiceDetail = (
	overrides: Partial<InvoiceWithLineItems> = {},
): InvoiceWithLineItems => ({
	invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
	invoice_number: "INV-2024-001",
	client_name: "테스트 회사",
	client_email: "test@example.com",
	client_address: "서울시 강남구",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: "Sent",
	subtotal: 1000000,
	tax_rate: 10,
	tax_amount: 100000,
	total_amount: 1100000,
	currency: "KRW",
	notes: "테스트 노트",
	created_at: new Date("2024-01-15"),
	line_items: [
		{
			id: "line-001",
			invoice_id: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
			description: "웹 개발",
			quantity: 1,
			unit_price: 1000000,
			line_total: 1000000,
			sort_order: 1,
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
	company_address: "서울시 강남구 테헤란로 152",
	company_email: "billing@techsolution.co.kr",
	company_phone: "02-1234-5678",
	tax_id: "123-45-67890",
	logo_url: undefined,
	...overrides,
});

/**
 * Loader Args 생성 헬퍼
 */
const createLoaderArgs = (container: IContainer, invoiceId: string) =>
	({
		request: new Request(`http://localhost/invoices/${invoiceId}`),
		context: { env: {}, platform: "node", container },
		params: { invoiceId },
	}) as unknown as Parameters<typeof loader>[0];

describe("InvoiceDetail Loader", () => {
	let mockContainer: IContainer;
	let mockGetInvoiceDetail: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockGetInvoiceDetail = vi.fn();
		mockContainer = {
			invoiceService: {
				getInvoiceList: vi.fn(),
				getInvoiceDetail: mockGetInvoiceDetail,
			},
		} as unknown as IContainer;
	});

	describe("성공 케이스", () => {
		it("유효한 invoiceId로 인보이스 상세 + 회사 정보를 반환해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
			const mockResult: InvoiceDetailResult = {
				invoice: createMockInvoiceDetail({ invoice_id: invoiceId }),
				company: createMockCompanyInfo(),
			};
			mockGetInvoiceDetail.mockResolvedValue(mockResult);

			// Act
			const result = await loader(createLoaderArgs(mockContainer, invoiceId));

			// Assert
			expect(mockGetInvoiceDetail).toHaveBeenCalledWith(invoiceId);
			expect(result).toEqual({
				invoice: mockResult.invoice,
				companyInfo: mockResult.company,
			});
		});

		it("하이픈 포함 UUID 형식도 허용해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6";
			const mockResult: InvoiceDetailResult = {
				invoice: createMockInvoiceDetail({ invoice_id: invoiceId }),
				company: createMockCompanyInfo(),
			};
			mockGetInvoiceDetail.mockResolvedValue(mockResult);

			// Act
			const result = await loader(createLoaderArgs(mockContainer, invoiceId));

			// Assert
			expect(mockGetInvoiceDetail).toHaveBeenCalledWith(invoiceId);
			expect(result).toEqual({
				invoice: mockResult.invoice,
				companyInfo: mockResult.company,
			});
		});
	});

	describe("404 에러 케이스", () => {
		it("InvoiceNotFoundError 발생 시 404 Response를 throw해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
			mockGetInvoiceDetail.mockRejectedValue(
				new InvoiceNotFoundError(invoiceId),
			);

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, invoiceId));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(404);
			}
		});
	});

	describe("400 에러 케이스 - invoiceId 검증", () => {
		it("빈 문자열 invoiceId는 400 Response를 throw해야 한다", async () => {
			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, ""));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(400);
			}
		});

		it("특수문자가 포함된 invoiceId는 400 Response를 throw해야 한다", async () => {
			// Act & Assert
			try {
				await loader(
					createLoaderArgs(mockContainer, "<script>alert('xss')</script>"),
				);
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(400);
			}
		});

		it("SQL 인젝션 시도는 400 Response를 throw해야 한다", async () => {
			// Act & Assert
			try {
				await loader(
					createLoaderArgs(mockContainer, "'; DROP TABLE invoices;--"),
				);
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(400);
			}
		});

		it("너무 긴 invoiceId는 400 Response를 throw해야 한다", async () => {
			// Act & Assert
			const longId = "a".repeat(200);
			try {
				await loader(createLoaderArgs(mockContainer, longId));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(400);
			}
		});

		it("유효하지 않은 형식의 invoiceId는 서비스를 호출하지 않아야 한다", async () => {
			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, "<script>xss</script>"));
			} catch {
				// expected
			}

			expect(mockGetInvoiceDetail).not.toHaveBeenCalled();
		});
	});

	describe("500 에러 케이스", () => {
		it("서비스 에러 시 500 Response를 throw해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
			mockGetInvoiceDetail.mockRejectedValue(
				new Error("Database connection failed"),
			);

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, invoiceId));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(500);
			}
		});

		it("에러 메시지에 민감한 정보가 포함되면 sanitize해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
			const sensitiveError = new Error("API call failed with token=secret123");
			mockGetInvoiceDetail.mockRejectedValue(sensitiveError);

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, invoiceId));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				const text = await response.text();
				expect(text).not.toContain("secret123");
			}
		});

		it("Error가 아닌 에러도 500 Response로 처리해야 한다", async () => {
			// Arrange
			const invoiceId = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";
			mockGetInvoiceDetail.mockRejectedValue("Unknown error");

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer, invoiceId));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(500);
			}
		});
	});
});
