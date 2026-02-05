/**
 * NotionInvoiceRepository 단위 테스트
 *
 * Notion API 기반 Invoice Repository 구현체 테스트
 */

import type { Client } from "@notionhq/client";
import type {
	PageObjectResponse,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NotionInvoiceRepositoryConfig } from "~/infrastructure/external/notion/invoice.repository.impl";
import { createNotionInvoiceRepository } from "~/infrastructure/external/notion/invoice.repository.impl";
import {
	createMockInvoicePage,
	createMockLineItemPage,
} from "../../../fixtures/notion/notion-page-response.fixture";

describe("createNotionInvoiceRepository", () => {
	let mockClient: Client;
	let config: NotionInvoiceRepositoryConfig;

	beforeEach(() => {
		vi.clearAllMocks();

		// Notion Client Mock 생성
		mockClient = {
			databases: {
				query: vi.fn(),
			},
		} as unknown as Client;

		// Repository 설정
		config = {
			invoiceDbId: "invoice-db-id",
			lineItemDbId: "lineitem-db-id",
		};
	});

	describe("findAll", () => {
		it("Invoice 목록을 성공적으로 조회하고 매핑하여 반환한다", async () => {
			// Arrange
			const mockInvoicePage1 = createMockInvoicePage({
				id: "invoice-1",
				properties: {
					...createMockInvoicePage().properties,
					"Invoice ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "inv-001", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "inv-001",
								href: null,
							},
						],
					},
				},
			});

			const mockInvoicePage2 = createMockInvoicePage({
				id: "invoice-2",
				properties: {
					...createMockInvoicePage().properties,
					"Invoice ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "inv-002", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "inv-002",
								href: null,
							},
						],
					},
				},
			});

			const mockResponse: QueryDatabaseResponse = {
				object: "list",
				results: [mockInvoicePage1, mockInvoicePage2],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query).mockResolvedValue(mockResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findAll();

			// Assert
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: config.invoiceDbId,
				sorts: [{ timestamp: "created_time", direction: "descending" }],
			});

			expect(result).toHaveLength(2);
			expect(result[0].invoice_id).toBe("inv-001");
			expect(result[1].invoice_id).toBe("inv-002");
		});

		it("Invoice가 없을 경우 빈 배열을 반환한다", async () => {
			// Arrange
			const mockResponse: QueryDatabaseResponse = {
				object: "list",
				results: [],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query).mockResolvedValue(mockResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findAll();

			// Assert
			expect(result).toEqual([]);
		});

		it("Notion API 오류 발생 시 NotionApiError로 래핑하여 전파한다", async () => {
			// Arrange
			const error = new Error("Notion API Error");
			vi.mocked(mockClient.databases.query).mockRejectedValue(error);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act & Assert
			await expect(repository.findAll()).rejects.toThrow(
				"Failed to fetch invoice list from Notion",
			);
		});
	});

	describe("findById", () => {
		it("Invoice ID로 Invoice와 LineItems를 함께 조회하여 반환한다", async () => {
			// Arrange
			const invoiceId = "inv-001";

			const mockInvoicePage = createMockInvoicePage({
				id: "invoice-page-123",
			});

			const mockLineItemPage1 = createMockLineItemPage({
				id: "lineitem-1",
				properties: {
					...createMockLineItemPage().properties,
					"Line Item ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "lineitem-001", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "lineitem-001",
								href: null,
							},
						],
					},
					"Sort Order": {
						id: "prop-7",
						type: "number",
						number: 1,
					},
				},
			});

			const mockLineItemPage2 = createMockLineItemPage({
				id: "lineitem-2",
				properties: {
					...createMockLineItemPage().properties,
					"Line Item ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "lineitem-002", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "lineitem-002",
								href: null,
							},
						],
					},
					"Sort Order": {
						id: "prop-7",
						type: "number",
						number: 2,
					},
				},
			});

			const mockInvoiceResponse: QueryDatabaseResponse = {
				object: "list",
				results: [mockInvoicePage],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			const mockLineItemsResponse: QueryDatabaseResponse = {
				object: "list",
				results: [mockLineItemPage1, mockLineItemPage2],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query)
				.mockResolvedValueOnce(mockInvoiceResponse)
				.mockResolvedValueOnce(mockLineItemsResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findById(invoiceId);

			// Assert
			expect(mockClient.databases.query).toHaveBeenCalledTimes(2);

			// Invoice 조회 호출 확인
			expect(mockClient.databases.query).toHaveBeenNthCalledWith(1, {
				database_id: config.invoiceDbId,
				filter: {
					property: "Invoice ID",
					title: {
						equals: invoiceId,
					},
				},
			});

			// LineItems 조회 호출 확인
			expect(mockClient.databases.query).toHaveBeenNthCalledWith(2, {
				database_id: config.lineItemDbId,
				filter: {
					property: "Invoice ID",
					rich_text: {
						equals: invoiceId,
					},
				},
				sorts: [{ property: "Sort Order", direction: "ascending" }],
			});

			expect(result).not.toBeNull();
			expect(result?.invoice_id).toBe("inv-001");
			expect(result?.line_items).toHaveLength(2);
			expect(result?.line_items[0].id).toBe("lineitem-001");
			expect(result?.line_items[1].id).toBe("lineitem-002");
		});

		it("존재하지 않는 Invoice ID로 조회 시 null을 반환한다", async () => {
			// Arrange
			const invoiceId = "non-existent-id";

			const mockResponse: QueryDatabaseResponse = {
				object: "list",
				results: [],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query).mockResolvedValue(mockResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findById(invoiceId);

			// Assert
			expect(result).toBeNull();
		});

		it("Invoice는 존재하지만 LineItems가 없는 경우 빈 배열과 함께 반환한다", async () => {
			// Arrange
			const invoiceId = "inv-001";

			const mockInvoicePage = createMockInvoicePage();

			const mockInvoiceResponse: QueryDatabaseResponse = {
				object: "list",
				results: [mockInvoicePage],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			const mockLineItemsResponse: QueryDatabaseResponse = {
				object: "list",
				results: [],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query)
				.mockResolvedValueOnce(mockInvoiceResponse)
				.mockResolvedValueOnce(mockLineItemsResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findById(invoiceId);

			// Assert
			expect(result).not.toBeNull();
			expect(result?.invoice_id).toBe("inv-001");
			expect(result?.line_items).toEqual([]);
		});

		it("Notion API 오류 발생 시 NotionApiError로 래핑하여 전파한다", async () => {
			// Arrange
			const invoiceId = "inv-001";
			const error = new Error("Notion API Error");
			vi.mocked(mockClient.databases.query).mockRejectedValue(error);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act & Assert
			await expect(repository.findById(invoiceId)).rejects.toThrow(
				`Failed to fetch invoice detail for ID: ${invoiceId}`,
			);
		});
	});

	describe("findLineItems", () => {
		it("Invoice ID로 LineItems를 Sort Order 오름차순으로 조회하여 반환한다", async () => {
			// Arrange
			const invoiceId = "inv-001";

			const mockLineItemPage1 = createMockLineItemPage({
				id: "lineitem-1",
				properties: {
					...createMockLineItemPage().properties,
					"Line Item ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "lineitem-001", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "lineitem-001",
								href: null,
							},
						],
					},
					"Sort Order": {
						id: "prop-7",
						type: "number",
						number: 1,
					},
				},
			});

			const mockLineItemPage2 = createMockLineItemPage({
				id: "lineitem-2",
				properties: {
					...createMockLineItemPage().properties,
					"Line Item ID": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "lineitem-002", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "lineitem-002",
								href: null,
							},
						],
					},
					"Sort Order": {
						id: "prop-7",
						type: "number",
						number: 2,
					},
				},
			});

			const mockResponse: QueryDatabaseResponse = {
				object: "list",
				results: [mockLineItemPage1, mockLineItemPage2],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query).mockResolvedValue(mockResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findLineItems(invoiceId);

			// Assert
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: config.lineItemDbId,
				filter: {
					property: "Invoice ID",
					rich_text: {
						equals: invoiceId,
					},
				},
				sorts: [{ property: "Sort Order", direction: "ascending" }],
			});

			expect(result).toHaveLength(2);
			expect(result[0].id).toBe("lineitem-001");
			expect(result[0].sort_order).toBe(1);
			expect(result[1].id).toBe("lineitem-002");
			expect(result[1].sort_order).toBe(2);
		});

		it("해당 Invoice에 대한 LineItems가 없을 경우 빈 배열을 반환한다", async () => {
			// Arrange
			const invoiceId = "inv-001";

			const mockResponse: QueryDatabaseResponse = {
				object: "list",
				results: [],
				next_cursor: null,
				has_more: false,
				type: "page_or_database",
				page_or_database: {},
			};

			vi.mocked(mockClient.databases.query).mockResolvedValue(mockResponse);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act
			const result = await repository.findLineItems(invoiceId);

			// Assert
			expect(result).toEqual([]);
		});

		it("Notion API 오류 발생 시 NotionApiError로 래핑하여 전파한다", async () => {
			// Arrange
			const invoiceId = "inv-001";
			const error = new Error("Notion API Error");
			vi.mocked(mockClient.databases.query).mockRejectedValue(error);

			const repository = createNotionInvoiceRepository(mockClient, config);

			// Act & Assert
			await expect(repository.findLineItems(invoiceId)).rejects.toThrow(
				`Failed to fetch line items for invoice: ${invoiceId}`,
			);
		});
	});
});
