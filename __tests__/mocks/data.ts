/**
 * MSW Mock Data Infrastructure
 *
 * Notion API 응답을 위한 mock data 생성 유틸리티
 */

import type {
	PageObjectResponse,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
	createMockInvoicePage,
	createMockLineItemPage,
	createMockCompanyInfoPage,
} from "../fixtures/notion/notion-page-response.fixture";

// Re-export existing fixtures
export {
	createMockInvoicePage,
	createMockLineItemPage,
	createMockCompanyInfoPage,
};

/**
 * Notion QueryDatabaseResponse wrapper 생성
 *
 * @param pages - PageObjectResponse 배열
 * @returns Notion API QueryDatabaseResponse 형식의 객체
 */
export const createNotionQueryResponse = (
	pages: PageObjectResponse[],
): QueryDatabaseResponse => ({
	object: "list",
	results: pages,
	has_more: false,
	next_cursor: null,
	type: "page_or_database",
	page_or_database: {},
});

/**
 * 복수의 고유한 Invoice 페이지 생성
 *
 * @param count - 생성할 Invoice 개수
 * @returns Invoice PageObjectResponse 배열
 */
export const createMultipleInvoicePages = (
	count: number,
): PageObjectResponse[] => {
	return Array.from({ length: count }, (_, index) => {
		const invoiceNum = String(index + 1).padStart(3, "0");
		return createMockInvoicePage({
			id: `invoice-page-${invoiceNum}`,
			properties: {
				"Invoice ID": {
					id: "prop-1",
					type: "title",
					title: [
						{
							type: "text",
							text: { content: `inv-${invoiceNum}`, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: `inv-${invoiceNum}`,
							href: null,
						},
					],
				},
				"Invoice Number": {
					id: "prop-2",
					type: "rich_text",
					rich_text: [
						{
							type: "text",
							text: { content: `INV-2024-${invoiceNum}`, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: `INV-2024-${invoiceNum}`,
							href: null,
						},
					],
				},
				"Client Name": {
					id: "prop-3",
					type: "rich_text",
					rich_text: [
						{
							type: "text",
							text: { content: `Client ${index + 1}`, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: `Client ${index + 1}`,
							href: null,
						},
					],
				},
			},
		});
	});
};

/**
 * Invoice 상세 조회 시나리오 데이터 생성
 *
 * Invoice와 연관된 LineItems를 함께 생성합니다.
 *
 * @param invoiceId - Invoice ID
 * @param lineItemCount - 생성할 LineItem 개수 (기본값: 2)
 * @returns { invoicePages, lineItemPages }
 */
export const createInvoiceDetailScenario = (
	invoiceId: string,
	lineItemCount = 2,
): {
	invoicePages: PageObjectResponse[];
	lineItemPages: PageObjectResponse[];
} => {
	const invoicePages = [
		createMockInvoicePage({
			id: `invoice-page-${invoiceId}`,
			properties: {
				"Invoice ID": {
					id: "prop-1",
					type: "title",
					title: [
						{
							type: "text",
							text: { content: invoiceId, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: invoiceId,
							href: null,
						},
					],
				},
			},
		}),
	];

	const lineItemPages = Array.from({ length: lineItemCount }, (_, index) => {
		return createMockLineItemPage({
			id: `lineitem-page-${invoiceId}-${index + 1}`,
			properties: {
				"Line Item ID": {
					id: "prop-1",
					type: "title",
					title: [
						{
							type: "text",
							text: { content: `${invoiceId}-item-${index + 1}`, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: `${invoiceId}-item-${index + 1}`,
							href: null,
						},
					],
				},
				"Invoice ID": {
					id: "prop-2",
					type: "rich_text",
					rich_text: [
						{
							type: "text",
							text: { content: invoiceId, link: null },
							annotations: {
								bold: false,
								italic: false,
								strikethrough: false,
								underline: false,
								code: false,
								color: "default",
							},
							plain_text: invoiceId,
							href: null,
						},
					],
				},
				"Sort Order": {
					id: "prop-7",
					type: "number",
					number: index + 1,
				},
			},
		});
	});

	return { invoicePages, lineItemPages };
};

/**
 * Notion API 에러 응답 타입 정의
 */
interface NotionErrorResponse {
	object: "error";
	status: number;
	code: string;
	message: string;
}

/**
 * Notion API 에러 응답 생성
 *
 * @param status - HTTP 상태 코드
 * @param code - Notion 에러 코드
 * @param message - 에러 메시지
 * @returns Notion API 에러 응답 객체
 */
export const createNotionErrorResponse = (
	status: number,
	code: string,
	message: string,
): NotionErrorResponse => ({
	object: "error",
	status,
	code,
	message,
});
