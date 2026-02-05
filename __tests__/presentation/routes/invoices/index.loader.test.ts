/**
 * InvoiceList 페이지 Loader 테스트
 *
 * TDD Red Phase: 인보이스 목록 페이지의 loader 함수를 테스트합니다.
 * - 성공: 서비스에서 인보이스 목록 반환
 * - 빈 배열: 인보이스가 없을 때 빈 배열 반환
 * - 에러: 500 Response와 sanitized 메시지 throw
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IContainer } from "~/application/shared/container.types";
import type { Invoice } from "~/domain/invoice";
import { loader } from "~/presentation/routes/invoices/index";

/**
 * Mock 인보이스 데이터 생성 헬퍼
 */
const createMockInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
	invoice_id: "inv-001",
	invoice_number: "INV-2024-001",
	client_name: "테스트 회사",
	client_email: "test@example.com",
	client_address: "서울시 강남구",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: "Draft",
	subtotal: 1000000,
	tax_rate: 10,
	tax_amount: 100000,
	total_amount: 1100000,
	currency: "KRW",
	notes: "테스트 인보이스",
	created_at: new Date("2024-01-15"),
	...overrides,
});

/**
 * Loader Args 생성 헬퍼
 *
 * Route.LoaderArgs 타입을 직접 사용하기 어려우므로
 * 필요한 프로퍼티만 포함한 객체를 생성합니다.
 */
const createLoaderArgs = (container: IContainer) =>
	({
		request: new Request("http://localhost/invoices"),
		context: { env: {}, platform: "node", container },
		params: {},
	}) as unknown as Parameters<typeof loader>[0];

describe("InvoiceList Loader", () => {
	let mockContainer: IContainer;
	let mockGetInvoiceList: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockGetInvoiceList = vi.fn();
		mockContainer = {
			invoiceService: {
				getInvoiceList: mockGetInvoiceList,
				getInvoiceDetail: vi.fn(),
			},
		} as unknown as IContainer;
	});

	describe("성공 케이스", () => {
		it("서비스에서 인보이스 목록을 반환해야 한다", async () => {
			// Arrange
			const mockInvoices = [
				createMockInvoice({ invoice_id: "inv-001" }),
				createMockInvoice({ invoice_id: "inv-002" }),
			];
			mockGetInvoiceList.mockResolvedValue(mockInvoices);

			// Act
			const result = await loader(createLoaderArgs(mockContainer));

			// Assert
			expect(mockGetInvoiceList).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ invoices: mockInvoices });
		});

		it("서비스가 빈 배열을 반환하면 빈 배열을 반환해야 한다", async () => {
			// Arrange
			mockGetInvoiceList.mockResolvedValue([]);

			// Act
			const result = await loader(createLoaderArgs(mockContainer));

			// Assert
			expect(result).toEqual({ invoices: [] });
		});
	});

	describe("에러 케이스", () => {
		it("서비스 에러 시 500 Response를 throw해야 한다", async () => {
			// Arrange
			const errorMessage = "Database connection failed";
			mockGetInvoiceList.mockRejectedValue(new Error(errorMessage));

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(500);
			}
		});

		it("Error가 아닌 에러를 throw해도 500 Response를 반환해야 한다", async () => {
			// Arrange
			mockGetInvoiceList.mockRejectedValue("Unknown error");

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				expect(response.status).toBe(500);
				const text = await response.text();
				expect(text).toBe("Failed to load invoices");
			}
		});

		it("에러 메시지에 민감한 정보가 포함되어 있으면 sanitize해야 한다", async () => {
			// Arrange
			const sensitiveError = new Error(
				"API call failed with token=secret123 for database abc12345678901234567890123456789012",
			);
			mockGetInvoiceList.mockRejectedValue(sensitiveError);

			// Act & Assert
			try {
				await loader(createLoaderArgs(mockContainer));
				expect.fail("loader should have thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(Response);
				const response = error as Response;
				const text = await response.text();
				// 민감한 정보가 제거되었는지 확인
				expect(text).not.toContain("secret123");
				expect(text).not.toContain("abc12345678901234567890123456789012");
			}
		});
	});
});
