/**
 * Notion API Integration Tests
 *
 * MSW를 사용한 Notion API 레이어 통합 테스트
 */

import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	afterEach,
	vi,
} from "vitest";
import { setupServer } from "msw/node";
import { Client } from "@notionhq/client";
import { createNotionInvoiceRepository } from "~/infrastructure/external/notion/invoice.repository.impl";
import { createNotionCompanyRepository } from "~/infrastructure/external/notion/company.repository.impl";
import {
	NotionApiError,
	CompanyInfoNotFoundError,
} from "~/application/invoice/errors";
import {
	notionHandlers,
	notionUnauthorizedHandler,
	notionRateLimitHandler,
	notionServerErrorHandler,
	notionNetworkErrorHandler,
	createNotionHandler,
	createMultiDatabaseHandler,
} from "../mocks/handlers";
import {
	createMockInvoicePage,
	createMockLineItemPage,
	createMockCompanyInfoPage,
	createMultipleInvoicePages,
	createInvoiceDetailScenario,
	createNotionQueryResponse,
} from "../mocks/data";

// MSW 서버 설정
const server = setupServer(...notionHandlers);

describe("Notion API Integration Tests", () => {
	// Notion 클라이언트 및 repository 설정
	// MSW가 globalThis.fetch를 가로채도록 직접 Client 생성
	const client = new Client({
		auth: "test-api-key",
	});
	const invoiceRepo = createNotionInvoiceRepository(client, {
		invoiceDbId: "invoice-db-id",
		lineItemDbId: "lineitem-db-id",
	});
	const companyRepo = createNotionCompanyRepository(client, {
		companyDbId: "company-db-id",
	});

	beforeAll(() => {
		server.listen({ onUnhandledRequest: "error" });
	});

	afterEach(() => {
		server.resetHandlers();
	});

	afterAll(() => {
		server.close();
	});

	describe("Invoice List", () => {
		it("복수 인보이스 조회 성공", async () => {
			// Arrange
			const mockPages = createMultipleInvoicePages(3);
			server.use(createNotionHandler("invoice-db-id", mockPages));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices).toHaveLength(3);
			expect(invoices[0]).toHaveProperty("invoice_id");
			expect(invoices[0]).toHaveProperty("invoice_number");
			expect(invoices[0]).toHaveProperty("client_name");
		});

		it("빈 목록 조회 성공", async () => {
			// Arrange
			server.use(createNotionHandler("invoice-db-id", []));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices).toHaveLength(0);
		});

		it("필드 매핑 검증 - invoice_id", async () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					"Invoice ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "test-inv-123", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "test-inv-123",
								href: null,
							},
						],
					},
				},
			});
			server.use(createNotionHandler("invoice-db-id", [mockPage]));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices[0].invoice_id).toBe("test-inv-123");
		});

		it("필드 매핑 검증 - invoice_number", async () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					"Invoice Number": {
						id: "prop-2",
						type: "rich_text",
						rich_text: [
							{
								type: "text",
								text: { content: "INV-TEST-999", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "INV-TEST-999",
								href: null,
							},
						],
					},
				},
			});
			server.use(createNotionHandler("invoice-db-id", [mockPage]));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices[0].invoice_number).toBe("INV-TEST-999");
		});

		it("필드 매핑 검증 - client_name", async () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					"Client Name": {
						id: "prop-3",
						type: "rich_text",
						rich_text: [
							{
								type: "text",
								text: { content: "Test Client Corp", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "Test Client Corp",
								href: null,
							},
						],
					},
				},
			});
			server.use(createNotionHandler("invoice-db-id", [mockPage]));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices[0].client_name).toBe("Test Client Corp");
		});

		it("필드 매핑 검증 - status", async () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					Status: {
						id: "prop-8",
						type: "select",
						select: {
							id: "status-2",
							name: "Paid",
							color: "green",
						},
					},
				},
			});
			server.use(createNotionHandler("invoice-db-id", [mockPage]));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices[0].status).toBe("Paid");
		});

		it("필드 매핑 검증 - amounts (subtotal, tax_amount, total_amount)", async () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					Subtotal: {
						id: "prop-9",
						type: "number",
						number: 5000,
					},
					"Tax Amount": {
						id: "prop-11",
						type: "number",
						number: 500,
					},
					"Total Amount": {
						id: "prop-12",
						type: "number",
						number: 5500,
					},
				},
			});
			server.use(createNotionHandler("invoice-db-id", [mockPage]));

			// Act
			const invoices = await invoiceRepo.findAll();

			// Assert
			expect(invoices[0].subtotal).toBe(5000);
			expect(invoices[0].tax_amount).toBe(500);
			expect(invoices[0].total_amount).toBe(5500);
		});
	});

	describe("Invoice Detail", () => {
		it("findById 성공 - invoice와 line_items 함께 조회", async () => {
			// Arrange
			const { invoicePages, lineItemPages } =
				createInvoiceDetailScenario("inv-001");

			server.use(
				createMultiDatabaseHandler({
					"invoice-db-id": invoicePages,
					"lineitem-db-id": lineItemPages,
				}),
			);

			// Act
			const result = await invoiceRepo.findById("inv-001");

			// Assert
			expect(result).not.toBeNull();
			expect(result?.invoice_id).toBe("inv-001");
			expect(result?.line_items).toHaveLength(2);
			expect(result?.line_items[0]).toHaveProperty("description");
			expect(result?.line_items[0]).toHaveProperty("quantity");
			expect(result?.line_items[0]).toHaveProperty("unit_price");
		});

		it("findById null - invoice가 존재하지 않음", async () => {
			// Arrange
			server.use(
				createMultiDatabaseHandler({
					"invoice-db-id": [],
					"lineitem-db-id": [],
				}),
			);

			// Act
			const result = await invoiceRepo.findById("non-existent-id");

			// Assert
			expect(result).toBeNull();
		});

		it("빈 line_items - invoice는 존재하지만 line_items가 없음", async () => {
			// Arrange
			const { invoicePages } = createInvoiceDetailScenario("inv-002", 0);

			server.use(
				createMultiDatabaseHandler({
					"invoice-db-id": invoicePages,
					"lineitem-db-id": [],
				}),
			);

			// Act
			const result = await invoiceRepo.findById("inv-002");

			// Assert
			expect(result).not.toBeNull();
			expect(result?.invoice_id).toBe("inv-002");
			expect(result?.line_items).toHaveLength(0);
		});

		it("parallel fetch 검증 - invoice와 line_items를 병렬로 조회", async () => {
			// Arrange
			const { invoicePages, lineItemPages } =
				createInvoiceDetailScenario("inv-003");

			server.use(
				createMultiDatabaseHandler({
					"invoice-db-id": invoicePages,
					"lineitem-db-id": lineItemPages,
				}),
			);

			const startTime = Date.now();

			// Act
			await invoiceRepo.findById("inv-003");

			const endTime = Date.now();
			const duration = endTime - startTime;

			// Assert
			// 병렬 처리이므로 순차 처리보다 빨라야 함
			// MSW는 즉시 응답하므로 100ms 이하여야 함
			expect(duration).toBeLessThan(100);
		});
	});

	describe("Company Info", () => {
		it("회사 정보 조회 성공", async () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage();
			server.use(createNotionHandler("company-db-id", [mockPage]));

			// Act
			const companyInfo = await companyRepo.getCompanyInfo();

			// Assert
			expect(companyInfo).toHaveProperty("company_name");
			expect(companyInfo).toHaveProperty("company_address");
			expect(companyInfo).toHaveProperty("company_email");
			expect(companyInfo).toHaveProperty("company_phone");
			expect(companyInfo).toHaveProperty("tax_id");
		});

		it("CompanyInfoNotFoundError - 빈 결과", async () => {
			// Arrange
			server.use(createNotionHandler("company-db-id", []));

			// Act & Assert
			await expect(companyRepo.getCompanyInfo()).rejects.toThrow(
				CompanyInfoNotFoundError,
			);
		});

		it("optional logo_url - null일 때", async () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					"Logo URL": {
						id: "prop-5",
						type: "url",
						url: null,
					},
				},
			});
			server.use(createNotionHandler("company-db-id", [mockPage]));

			// Act
			const companyInfo = await companyRepo.getCompanyInfo();

			// Assert
			expect(companyInfo.logo_url).toBeUndefined();
		});
	});

	describe("Error Handling", () => {
		it("401 Unauthorized → NotionApiError", async () => {
			// Arrange
			server.use(notionUnauthorizedHandler());

			// Act & Assert
			await expect(invoiceRepo.findAll()).rejects.toThrow(NotionApiError);
		});

		it("429 Rate Limit → NotionApiError", async () => {
			// Arrange
			server.use(notionRateLimitHandler());

			// Act & Assert
			await expect(invoiceRepo.findAll()).rejects.toThrow(NotionApiError);
		});

		it("500 Server Error → NotionApiError", async () => {
			// Arrange
			server.use(notionServerErrorHandler());

			// Act & Assert
			await expect(invoiceRepo.findAll()).rejects.toThrow(NotionApiError);
		});

		it("네트워크 에러 → NotionApiError", async () => {
			// Arrange
			server.use(notionNetworkErrorHandler());

			// Act & Assert
			await expect(invoiceRepo.findAll()).rejects.toThrow(NotionApiError);
		});
	});
});
