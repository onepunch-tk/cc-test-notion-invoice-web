/**
 * Notion Mapper 단위 테스트
 *
 * Notion API PageObjectResponse를 도메인 타입으로 변환하는
 * 매퍼 함수들의 동작을 검증합니다.
 */

import { describe, expect, it } from "vitest";
import {
	getDate,
	getEmail,
	getNumber,
	getPhoneNumber,
	getRichText,
	getSelect,
	getTitleText,
	getUrl,
	mapNotionPageToCompanyInfo,
	mapNotionPageToInvoice,
	mapNotionPageToLineItem,
} from "~/infrastructure/external/notion/notion.mapper";
import {
	createMockCompanyInfoPage,
	createMockInvoicePage,
	createMockLineItemPage,
} from "../../../fixtures/notion/notion-page-response.fixture";
import {
	createMockCheckboxProperty,
	createMockDateProperty,
	createMockEmailProperty,
	createMockNumberProperty,
	createMockPhoneNumberProperty,
	createMockRichTextProperty,
	createMockSelectProperty,
	createMockTitleProperty,
	createMockUrlProperty,
} from "../../../fixtures/notion/notion-properties.fixture";

describe("Notion Property Extractors", () => {
	describe("getTitleText", () => {
		it("유효한 title 프로퍼티에서 텍스트를 추출해야 한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty({
				title: [{ plain_text: "Test Title" }] as never,
			});

			// Act
			const result = getTitleText(titleProp);

			// Assert
			expect(result).toBe("Test Title");
		});

		it("빈 title 배열인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty({
				title: [],
			});

			// Act
			const result = getTitleText(titleProp);

			// Assert
			expect(result).toBe("");
		});

		it("title이 아닌 프로퍼티인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const checkboxProp = createMockCheckboxProperty();

			// Act
			const result = getTitleText(checkboxProp);

			// Assert
			expect(result).toBe("");
		});

		it("undefined가 전달된 경우 빈 문자열을 반환해야 한다", () => {
			// Act
			const result = getTitleText(undefined);

			// Assert
			expect(result).toBe("");
		});
	});

	describe("getRichText", () => {
		it("유효한 rich_text 프로퍼티에서 텍스트를 추출해야 한다", () => {
			// Arrange
			const richTextProp = createMockRichTextProperty({
				rich_text: [{ plain_text: "Test Description" }] as never,
			});

			// Act
			const result = getRichText(richTextProp);

			// Assert
			expect(result).toBe("Test Description");
		});

		it("빈 rich_text 배열인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const richTextProp = createMockRichTextProperty({
				rich_text: [],
			});

			// Act
			const result = getRichText(richTextProp);

			// Assert
			expect(result).toBe("");
		});

		it("rich_text가 아닌 프로퍼티인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const numberProp = createMockNumberProperty();

			// Act
			const result = getRichText(numberProp);

			// Assert
			expect(result).toBe("");
		});

		it("undefined가 전달된 경우 빈 문자열을 반환해야 한다", () => {
			// Act
			const result = getRichText(undefined);

			// Assert
			expect(result).toBe("");
		});
	});

	describe("getNumber", () => {
		it("유효한 number 프로퍼티에서 숫자를 추출해야 한다", () => {
			// Arrange
			const numberProp = createMockNumberProperty({
				number: 1234.56,
			});

			// Act
			const result = getNumber(numberProp);

			// Assert
			expect(result).toBe(1234.56);
		});

		it("number 프로퍼티의 값이 null인 경우 0을 반환해야 한다", () => {
			// Arrange
			const numberProp = createMockNumberProperty({
				number: null,
			});

			// Act
			const result = getNumber(numberProp);

			// Assert
			expect(result).toBe(0);
		});

		it("number가 아닌 프로퍼티인 경우 0을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getNumber(textProp);

			// Assert
			expect(result).toBe(0);
		});

		it("undefined가 전달된 경우 0을 반환해야 한다", () => {
			// Act
			const result = getNumber(undefined);

			// Assert
			expect(result).toBe(0);
		});
	});

	describe("getDate", () => {
		it("유효한 date 프로퍼티에서 날짜 문자열을 추출해야 한다", () => {
			// Arrange
			const dateProp = createMockDateProperty({
				date: {
					start: "2024-01-15",
					end: null,
					time_zone: null,
				},
			});

			// Act
			const result = getDate(dateProp);

			// Assert
			expect(result).toBe("2024-01-15");
		});

		it("date 프로퍼티의 값이 null인 경우 null을 반환해야 한다", () => {
			// Arrange
			const dateProp = createMockDateProperty({
				date: null,
			});

			// Act
			const result = getDate(dateProp);

			// Assert
			expect(result).toBeNull();
		});

		it("date가 아닌 프로퍼티인 경우 null을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getDate(textProp);

			// Assert
			expect(result).toBeNull();
		});

		it("undefined가 전달된 경우 null을 반환해야 한다", () => {
			// Act
			const result = getDate(undefined);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("getSelect", () => {
		it("유효한 select 프로퍼티에서 선택된 값을 추출해야 한다", () => {
			// Arrange
			const selectProp = createMockSelectProperty({
				select: {
					id: "select-1",
					name: "Paid",
					color: "green",
				},
			});

			// Act
			const result = getSelect(selectProp);

			// Assert
			expect(result).toBe("Paid");
		});

		it("select 프로퍼티의 값이 null인 경우 null을 반환해야 한다", () => {
			// Arrange
			const selectProp = createMockSelectProperty({
				select: null,
			});

			// Act
			const result = getSelect(selectProp);

			// Assert
			expect(result).toBeNull();
		});

		it("select가 아닌 프로퍼티인 경우 null을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getSelect(textProp);

			// Assert
			expect(result).toBeNull();
		});

		it("undefined가 전달된 경우 null을 반환해야 한다", () => {
			// Act
			const result = getSelect(undefined);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("getEmail", () => {
		it("유효한 email 프로퍼티에서 이메일을 추출해야 한다", () => {
			// Arrange
			const emailProp = createMockEmailProperty({
				email: "test@example.com",
			});

			// Act
			const result = getEmail(emailProp);

			// Assert
			expect(result).toBe("test@example.com");
		});

		it("email 프로퍼티의 값이 null인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const emailProp = createMockEmailProperty({
				email: null,
			});

			// Act
			const result = getEmail(emailProp);

			// Assert
			expect(result).toBe("");
		});

		it("email이 아닌 프로퍼티인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getEmail(textProp);

			// Assert
			expect(result).toBe("");
		});

		it("undefined가 전달된 경우 빈 문자열을 반환해야 한다", () => {
			// Act
			const result = getEmail(undefined);

			// Assert
			expect(result).toBe("");
		});
	});

	describe("getUrl", () => {
		it("유효한 url 프로퍼티에서 URL을 추출해야 한다", () => {
			// Arrange
			const urlProp = createMockUrlProperty({
				url: "https://example.com",
			});

			// Act
			const result = getUrl(urlProp);

			// Assert
			expect(result).toBe("https://example.com");
		});

		it("url 프로퍼티의 값이 null인 경우 null을 반환해야 한다", () => {
			// Arrange
			const urlProp = createMockUrlProperty({
				url: null,
			});

			// Act
			const result = getUrl(urlProp);

			// Assert
			expect(result).toBeNull();
		});

		it("url이 아닌 프로퍼티인 경우 null을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getUrl(textProp);

			// Assert
			expect(result).toBeNull();
		});

		it("undefined가 전달된 경우 null을 반환해야 한다", () => {
			// Act
			const result = getUrl(undefined);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("getPhoneNumber", () => {
		it("유효한 phone_number 프로퍼티에서 전화번호를 추출해야 한다", () => {
			// Arrange
			const phoneProp = createMockPhoneNumberProperty({
				phone_number: "+1-555-9999",
			});

			// Act
			const result = getPhoneNumber(phoneProp);

			// Assert
			expect(result).toBe("+1-555-9999");
		});

		it("phone_number 프로퍼티의 값이 null인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const phoneProp = createMockPhoneNumberProperty({
				phone_number: null,
			});

			// Act
			const result = getPhoneNumber(phoneProp);

			// Assert
			expect(result).toBe("");
		});

		it("phone_number가 아닌 프로퍼티인 경우 빈 문자열을 반환해야 한다", () => {
			// Arrange
			const textProp = createMockRichTextProperty();

			// Act
			const result = getPhoneNumber(textProp);

			// Assert
			expect(result).toBe("");
		});

		it("undefined가 전달된 경우 빈 문자열을 반환해야 한다", () => {
			// Act
			const result = getPhoneNumber(undefined);

			// Assert
			expect(result).toBe("");
		});
	});
});

describe("Notion Page Mappers", () => {
	describe("mapNotionPageToInvoice", () => {
		it("유효한 Invoice 페이지를 Invoice 도메인 객체로 변환해야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage();

			// Act
			const result = mapNotionPageToInvoice(mockPage);

			// Assert
			expect(result).toMatchObject({
				invoice_id: "inv-001",
				invoice_number: "INV-2024-001",
				client_name: "John Doe",
				client_email: "john@example.com",
				client_address: "123 Main St",
				status: "Draft",
				subtotal: 1000,
				tax_rate: 10,
				tax_amount: 100,
				total_amount: 1100,
				currency: "USD",
				notes: "Test note",
			});
			expect(result.issue_date).toBeInstanceOf(Date);
			expect(result.due_date).toBeInstanceOf(Date);
			expect(result.created_at).toBeInstanceOf(Date);
		});

		it("Notes가 없는 경우 optional 필드로 처리해야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					...createMockInvoicePage().properties,
					Notes: {
						id: "prop-14",
						type: "rich_text",
						rich_text: [],
					},
				},
			});

			// Act
			const result = mapNotionPageToInvoice(mockPage);

			// Assert
			expect(result.notes).toBeUndefined();
		});

		it("잘못된 이메일 형식인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					...createMockInvoicePage().properties,
					"Client Email": {
						id: "prop-4",
						type: "email",
						email: "invalid-email",
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToInvoice(mockPage)).toThrow();
		});

		it("필수 필드가 누락된 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					...createMockInvoicePage().properties,
					"Client Name": {
						id: "prop-3",
						type: "rich_text",
						rich_text: [],
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToInvoice(mockPage)).toThrow();
		});

		it("음수 금액인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					...createMockInvoicePage().properties,
					Subtotal: {
						id: "prop-9",
						type: "number",
						number: -100,
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToInvoice(mockPage)).toThrow();
		});

		it("잘못된 Status 값인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockInvoicePage({
				properties: {
					...createMockInvoicePage().properties,
					Status: {
						id: "prop-8",
						type: "select",
						select: {
							id: "status-invalid",
							name: "InvalidStatus",
							color: "gray",
						},
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToInvoice(mockPage)).toThrow();
		});
	});

	describe("mapNotionPageToLineItem", () => {
		it("유효한 LineItem 페이지를 InvoiceLineItem 도메인 객체로 변환해야 한다", () => {
			// Arrange
			const mockPage = createMockLineItemPage();

			// Act
			const result = mapNotionPageToLineItem(mockPage);

			// Assert
			expect(result).toMatchObject({
				id: "lineitem-001",
				invoice_id: "inv-001",
				description: "Web Development Service",
				quantity: 10,
				unit_price: 100,
				line_total: 1000,
				sort_order: 1,
			});
		});

		it("필수 필드가 누락된 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockLineItemPage({
				properties: {
					...createMockLineItemPage().properties,
					Description: {
						id: "prop-3",
						type: "rich_text",
						rich_text: [],
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToLineItem(mockPage)).toThrow();
		});

		it("음수 수량인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockLineItemPage({
				properties: {
					...createMockLineItemPage().properties,
					Quantity: {
						id: "prop-4",
						type: "number",
						number: -5,
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToLineItem(mockPage)).toThrow();
		});

		it("음수 단가인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockLineItemPage({
				properties: {
					...createMockLineItemPage().properties,
					"Unit Price": {
						id: "prop-5",
						type: "number",
						number: -50,
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToLineItem(mockPage)).toThrow();
		});

		it("음수 정렬 순서인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockLineItemPage({
				properties: {
					...createMockLineItemPage().properties,
					"Sort Order": {
						id: "prop-7",
						type: "number",
						number: -1,
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToLineItem(mockPage)).toThrow();
		});
	});

	describe("mapNotionPageToCompanyInfo", () => {
		it("유효한 CompanyInfo 페이지를 CompanyInfo 도메인 객체로 변환해야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage();

			// Act
			const result = mapNotionPageToCompanyInfo(mockPage);

			// Assert
			expect(result).toMatchObject({
				company_name: "Acme Corporation",
				company_address: "456 Business Ave",
				company_email: "info@acme.com",
				company_phone: "+1-555-1234",
				logo_url: "https://example.com/logo.png",
				tax_id: "TAX-12345",
			});
		});

		it("Logo URL이 없는 경우 optional 필드로 처리해야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Logo URL": {
						id: "prop-5",
						type: "url",
						url: null,
					},
				},
			});

			// Act
			const result = mapNotionPageToCompanyInfo(mockPage);

			// Assert
			expect(result.logo_url).toBeUndefined();
		});

		it("잘못된 이메일 형식인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Email": {
						id: "prop-3",
						type: "email",
						email: "invalid-email",
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToCompanyInfo(mockPage)).toThrow();
		});

		it("잘못된 URL 형식인 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Logo URL": {
						id: "prop-5",
						type: "url",
						url: "not-a-valid-url",
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToCompanyInfo(mockPage)).toThrow();
		});

		it("필수 필드가 누락된 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Name": {
						id: "prop-1",
						type: "title",
						title: [],
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToCompanyInfo(mockPage)).toThrow();
		});

		it("Tax ID가 누락된 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Tax ID": {
						id: "prop-6",
						type: "rich_text",
						rich_text: [],
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToCompanyInfo(mockPage)).toThrow();
		});

		it("Phone이 누락된 경우 검증 에러를 발생시켜야 한다", () => {
			// Arrange
			const mockPage = createMockCompanyInfoPage({
				properties: {
					...createMockCompanyInfoPage().properties,
					"Company Phone": {
						id: "prop-4",
						type: "phone_number",
						phone_number: null,
					},
				},
			});

			// Act & Assert
			expect(() => mapNotionPageToCompanyInfo(mockPage)).toThrow();
		});
	});
});
