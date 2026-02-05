/**
 * Notion Company Repository 단위 테스트
 *
 * Notion API 기반 CompanyRepository 구현체의 동작을 검증합니다.
 */

import type { Client } from "@notionhq/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createNotionCompanyRepository } from "~/infrastructure/external/notion/company.repository.impl";
import { createMockCompanyInfoPage } from "../../../fixtures/notion/notion-page-response.fixture";

describe("NotionCompanyRepository", () => {
	// Mock Notion Client
	const mockClient = {
		databases: {
			query: vi.fn(),
		},
	} as unknown as Client;

	const config = {
		companyDbId: "company-db-id-123",
	};

	beforeEach(() => {
		// 모든 mock 초기화
		vi.clearAllMocks();
	});

	describe("getCompanyInfo", () => {
		it("회사 정보를 성공적으로 조회하고 매핑된 CompanyInfo를 반환해야 한다", async () => {
			// Arrange
			const mockCompanyPage = createMockCompanyInfoPage();
			const mockClient = {
				databases: {
					query: vi.fn().mockResolvedValue({
						results: [mockCompanyPage],
						has_more: false,
						next_cursor: null,
					}),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act
			const result = await repository.getCompanyInfo();

			// Assert
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
			expect(result).toMatchObject({
				company_name: "Acme Corporation",
				company_address: "456 Business Ave",
				company_email: "info@acme.com",
				company_phone: "+1-555-1234",
				logo_url: "https://example.com/logo.png",
				tax_id: "TAX-12345",
			});
		});

		it("회사 정보가 존재하지 않을 때 에러를 발생시켜야 한다", async () => {
			// Arrange
			const mockClient = {
				databases: {
					query: vi.fn().mockResolvedValue({
						results: [],
						has_more: false,
						next_cursor: null,
					}),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act & Assert
			await expect(repository.getCompanyInfo()).rejects.toThrow(
				"Company information not found",
			);
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
		});

		it("여러 회사 정보가 존재할 때 첫 번째 결과를 사용해야 한다", async () => {
			// Arrange
			const mockCompanyPage1 = createMockCompanyInfoPage({
				id: "company-page-1",
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Name": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "First Company", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "First Company",
								href: null,
							},
						],
					},
				},
			});

			const mockCompanyPage2 = createMockCompanyInfoPage({
				id: "company-page-2",
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Name": {
						id: "prop-1",
						type: "title",
						title: [
							{
								type: "text",
								text: { content: "Second Company", link: null },
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: "default",
								},
								plain_text: "Second Company",
								href: null,
							},
						],
					},
				},
			});

			const mockClient = {
				databases: {
					query: vi.fn().mockResolvedValue({
						results: [mockCompanyPage1, mockCompanyPage2],
						has_more: false,
						next_cursor: null,
					}),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act
			const result = await repository.getCompanyInfo();

			// Assert
			expect(result.company_name).toBe("First Company");
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
		});

		it("Notion API 에러가 발생하면 NotionApiError로 래핑하여 전파해야 한다", async () => {
			// Arrange
			const notionError = new Error("Notion API error");
			const mockClient = {
				databases: {
					query: vi.fn().mockRejectedValue(notionError),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act & Assert
			await expect(repository.getCompanyInfo()).rejects.toThrow(
				"Failed to fetch company information from Notion",
			);
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
		});

		it("잘못된 데이터 형식의 응답을 받으면 검증 에러를 발생시켜야 한다", async () => {
			// Arrange
			const invalidCompanyPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Email": {
						id: "prop-3",
						type: "email",
						email: "invalid-email-format",
					},
				},
			});

			const mockClient = {
				databases: {
					query: vi.fn().mockResolvedValue({
						results: [invalidCompanyPage],
						has_more: false,
						next_cursor: null,
					}),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act & Assert
			await expect(repository.getCompanyInfo()).rejects.toThrow();
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
		});

		it("Logo URL이 없는 회사 정보도 정상적으로 처리해야 한다", async () => {
			// Arrange
			const mockCompanyPageWithoutLogo = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Logo URL": {
						id: "prop-5",
						type: "url",
						url: null,
					},
				},
			});

			const mockClient = {
				databases: {
					query: vi.fn().mockResolvedValue({
						results: [mockCompanyPageWithoutLogo],
						has_more: false,
						next_cursor: null,
					}),
				},
			} as unknown as Client;

			const repository = createNotionCompanyRepository(mockClient, config);

			// Act
			const result = await repository.getCompanyInfo();

			// Assert
			expect(result.logo_url).toBeUndefined();
			expect(result.company_name).toBe("Acme Corporation");
			expect(mockClient.databases.query).toHaveBeenCalledWith({
				database_id: "company-db-id-123",
				page_size: 1,
			});
		});
	});
});
