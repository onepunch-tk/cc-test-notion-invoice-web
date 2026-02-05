/**
 * Notion API PageObjectResponse 테스트용 fixture 빌더
 *
 * @notionhq/client의 PageObjectResponse 구조를 모방하여
 * Invoice, InvoiceLineItem, CompanyInfo 페이지 목 객체를 생성합니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Mock Invoice Page 생성
 *
 * @param overrides - 덮어쓸 속성들
 * @returns Invoice용 PageObjectResponse 목 객체
 */
export const createMockInvoicePage = (
	overrides: Partial<PageObjectResponse> = {},
): PageObjectResponse => {
	const basePage: PageObjectResponse = {
		object: "page",
		id: "invoice-page-123",
		created_time: "2024-01-15T00:00:00.000Z",
		last_edited_time: "2024-01-15T00:00:00.000Z",
		created_by: { object: "user", id: "user-1" },
		last_edited_by: { object: "user", id: "user-1" },
		cover: null,
		icon: null,
		parent: {
			type: "database_id",
			database_id: "invoice-db-id",
		},
		archived: false,
		in_trash: false,
		properties: {
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
			"Invoice Number": {
				id: "prop-2",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "INV-2024-001", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "INV-2024-001",
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
						text: { content: "John Doe", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "John Doe",
						href: null,
					},
				],
			},
			"Client Email": {
				id: "prop-4",
				type: "email",
				email: "john@example.com",
			},
			"Client Address": {
				id: "prop-5",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "123 Main St", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "123 Main St",
						href: null,
					},
				],
			},
			"Issue Date": {
				id: "prop-6",
				type: "date",
				date: {
					start: "2024-01-15",
					end: null,
					time_zone: null,
				},
			},
			"Due Date": {
				id: "prop-7",
				type: "date",
				date: {
					start: "2024-02-15",
					end: null,
					time_zone: null,
				},
			},
			Status: {
				id: "prop-8",
				type: "select",
				select: {
					id: "status-1",
					name: "Draft",
					color: "gray",
				},
			},
			Subtotal: {
				id: "prop-9",
				type: "number",
				number: 1000,
			},
			"Tax Rate": {
				id: "prop-10",
				type: "number",
				number: 10,
			},
			"Tax Amount": {
				id: "prop-11",
				type: "number",
				number: 100,
			},
			"Total Amount": {
				id: "prop-12",
				type: "number",
				number: 1100,
			},
			Currency: {
				id: "prop-13",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "USD", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "USD",
						href: null,
					},
				],
			},
			Notes: {
				id: "prop-14",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "Test note", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "Test note",
						href: null,
					},
				],
			},
		},
		url: "https://notion.so/invoice-page-123",
		public_url: null,
	};

	return {
		...basePage,
		...overrides,
		properties: {
			...basePage.properties,
			...(overrides.properties || {}),
		},
	};
};

/**
 * Mock InvoiceLineItem Page 생성
 *
 * @param overrides - 덮어쓸 속성들
 * @returns InvoiceLineItem용 PageObjectResponse 목 객체
 */
export const createMockLineItemPage = (
	overrides: Partial<PageObjectResponse> = {},
): PageObjectResponse => {
	const basePage: PageObjectResponse = {
		object: "page",
		id: "lineitem-page-123",
		created_time: "2024-01-15T00:00:00.000Z",
		last_edited_time: "2024-01-15T00:00:00.000Z",
		created_by: { object: "user", id: "user-1" },
		last_edited_by: { object: "user", id: "user-1" },
		cover: null,
		icon: null,
		parent: {
			type: "database_id",
			database_id: "lineitem-db-id",
		},
		archived: false,
		in_trash: false,
		properties: {
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
			"Invoice ID": {
				id: "prop-2",
				type: "rich_text",
				rich_text: [
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
			Description: {
				id: "prop-3",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "Web Development Service", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "Web Development Service",
						href: null,
					},
				],
			},
			Quantity: {
				id: "prop-4",
				type: "number",
				number: 10,
			},
			"Unit Price": {
				id: "prop-5",
				type: "number",
				number: 100,
			},
			"Line Total": {
				id: "prop-6",
				type: "number",
				number: 1000,
			},
			"Sort Order": {
				id: "prop-7",
				type: "number",
				number: 1,
			},
		},
		url: "https://notion.so/lineitem-page-123",
		public_url: null,
	};

	return {
		...basePage,
		...overrides,
		properties: {
			...basePage.properties,
			...(overrides.properties || {}),
		},
	};
};

/**
 * Mock CompanyInfo Page 생성
 *
 * @param overrides - 덮어쓸 속성들
 * @returns CompanyInfo용 PageObjectResponse 목 객체
 */
export const createMockCompanyInfoPage = (
	overrides: Partial<PageObjectResponse> = {},
): PageObjectResponse => {
	const basePage: PageObjectResponse = {
		object: "page",
		id: "company-page-123",
		created_time: "2024-01-15T00:00:00.000Z",
		last_edited_time: "2024-01-15T00:00:00.000Z",
		created_by: { object: "user", id: "user-1" },
		last_edited_by: { object: "user", id: "user-1" },
		cover: null,
		icon: null,
		parent: {
			type: "database_id",
			database_id: "company-db-id",
		},
		archived: false,
		in_trash: false,
		properties: {
			"Company Name": {
				id: "prop-1",
				type: "title",
				title: [
					{
						type: "text",
						text: { content: "Acme Corporation", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "Acme Corporation",
						href: null,
					},
				],
			},
			"Company Address": {
				id: "prop-2",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "456 Business Ave", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "456 Business Ave",
						href: null,
					},
				],
			},
			"Company Email": {
				id: "prop-3",
				type: "email",
				email: "info@acme.com",
			},
			"Company Phone": {
				id: "prop-4",
				type: "phone_number",
				phone_number: "+1-555-1234",
			},
			"Logo URL": {
				id: "prop-5",
				type: "url",
				url: "https://example.com/logo.png",
			},
			"Tax ID": {
				id: "prop-6",
				type: "rich_text",
				rich_text: [
					{
						type: "text",
						text: { content: "TAX-12345", link: null },
						annotations: {
							bold: false,
							italic: false,
							strikethrough: false,
							underline: false,
							code: false,
							color: "default",
						},
						plain_text: "TAX-12345",
						href: null,
					},
				],
			},
		},
		url: "https://notion.so/company-page-123",
		public_url: null,
	};

	return {
		...basePage,
		...overrides,
		properties: {
			...basePage.properties,
			...(overrides.properties || {}),
		},
	};
};
