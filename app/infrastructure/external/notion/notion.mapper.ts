/**
 * Notion API Mapper
 *
 * Notion API PageObjectResponse를 도메인 타입으로 변환하는 매퍼 함수들을 제공합니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { CompanyInfo } from "~/domain/company";
import { companyInfoSchema } from "~/domain/company/company.schemas";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice";
import {
	invoiceLineItemSchema,
	invoiceSchema,
} from "~/domain/invoice/invoice.schemas";
import {
	isDateProperty,
	isEmailProperty,
	isNumberProperty,
	isPhoneNumberProperty,
	isRichTextProperty,
	isSelectProperty,
	isTitleProperty,
	isUrlProperty,
} from "./notion.types";

/**
 * unknown 타입을 object로 안전하게 캐스팅하는 헬퍼
 */
const isObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null;
};

/**
 * Title 프로퍼티에서 텍스트 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 텍스트 또는 빈 문자열
 */
export const getTitleText = (prop: unknown): string => {
	if (!isObject(prop)) return "";
	if (!isTitleProperty(prop as PageObjectResponse["properties"][string]))
		return "";

	const titleProp = prop as { title: Array<{ plain_text: string }> };
	if (!Array.isArray(titleProp.title) || titleProp.title.length === 0)
		return "";

	return titleProp.title[0]?.plain_text ?? "";
};

/**
 * RichText 프로퍼티에서 텍스트 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 텍스트 또는 빈 문자열
 */
export const getRichText = (prop: unknown): string => {
	if (!isObject(prop)) return "";
	if (!isRichTextProperty(prop as PageObjectResponse["properties"][string]))
		return "";

	const richTextProp = prop as { rich_text: Array<{ plain_text: string }> };
	if (
		!Array.isArray(richTextProp.rich_text) ||
		richTextProp.rich_text.length === 0
	)
		return "";

	return richTextProp.rich_text[0]?.plain_text ?? "";
};

/**
 * Number 프로퍼티에서 숫자 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 숫자 또는 0
 */
export const getNumber = (prop: unknown): number => {
	if (!isObject(prop)) return 0;
	if (!isNumberProperty(prop as PageObjectResponse["properties"][string]))
		return 0;

	const numberProp = prop as { number: number | null };
	return numberProp.number ?? 0;
};

/**
 * Date 프로퍼티에서 날짜 문자열 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 날짜 문자열 또는 null
 */
export const getDate = (prop: unknown): string | null => {
	if (!isObject(prop)) return null;
	if (!isDateProperty(prop as PageObjectResponse["properties"][string]))
		return null;

	const dateProp = prop as { date: { start: string } | null };
	return dateProp.date?.start ?? null;
};

/**
 * Select 프로퍼티에서 선택된 값 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 선택 값 또는 null
 */
export const getSelect = (prop: unknown): string | null => {
	if (!isObject(prop)) return null;
	if (!isSelectProperty(prop as PageObjectResponse["properties"][string]))
		return null;

	const selectProp = prop as { select: { name: string } | null };
	return selectProp.select?.name ?? null;
};

/**
 * Email 프로퍼티에서 이메일 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 이메일 또는 빈 문자열
 */
export const getEmail = (prop: unknown): string => {
	if (!isObject(prop)) return "";
	if (!isEmailProperty(prop as PageObjectResponse["properties"][string]))
		return "";

	const emailProp = prop as { email: string | null };
	return emailProp.email ?? "";
};

/**
 * URL 프로퍼티에서 URL 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 URL 또는 null
 */
export const getUrl = (prop: unknown): string | null => {
	if (!isObject(prop)) return null;
	if (!isUrlProperty(prop as PageObjectResponse["properties"][string]))
		return null;

	const urlProp = prop as { url: string | null };
	return urlProp.url ?? null;
};

/**
 * PhoneNumber 프로퍼티에서 전화번호 추출
 *
 * @param prop - Notion 프로퍼티
 * @returns 추출된 전화번호 또는 빈 문자열
 */
export const getPhoneNumber = (prop: unknown): string => {
	if (!isObject(prop)) return "";
	if (!isPhoneNumberProperty(prop as PageObjectResponse["properties"][string]))
		return "";

	const phoneProp = prop as { phone_number: string | null };
	return phoneProp.phone_number ?? "";
};

/**
 * Notion Page를 Invoice 도메인 객체로 변환
 *
 * @param page - Notion PageObjectResponse
 * @returns Invoice 도메인 객체
 * @throws Zod validation error if data is invalid
 */
export const mapNotionPageToInvoice = (page: PageObjectResponse): Invoice => {
	const props = page.properties;
	const notes = getRichText(props.Notes);

	const rawData = {
		invoice_id: getTitleText(props["Invoice ID"]),
		invoice_number: getRichText(props["Invoice Number"]),
		client_name: getRichText(props["Client Name"]),
		client_email: getEmail(props["Client Email"]),
		client_address: getRichText(props["Client Address"]),
		issue_date: getDate(props["Issue Date"]),
		due_date: getDate(props["Due Date"]),
		status: getSelect(props.Status),
		subtotal: getNumber(props.Subtotal),
		tax_rate: getNumber(props["Tax Rate"]),
		tax_amount: getNumber(props["Tax Amount"]),
		total_amount: getNumber(props["Total Amount"]),
		currency: getRichText(props.Currency),
		notes: notes || undefined,
		created_at: page.created_time,
	};

	return invoiceSchema.parse(rawData);
};

/**
 * Notion Page를 InvoiceLineItem 도메인 객체로 변환
 *
 * @param page - Notion PageObjectResponse
 * @returns InvoiceLineItem 도메인 객체
 * @throws Zod validation error if data is invalid
 */
export const mapNotionPageToLineItem = (
	page: PageObjectResponse,
): InvoiceLineItem => {
	const props = page.properties;

	const rawData = {
		id: getTitleText(props["Line Item ID"]),
		invoice_id: getRichText(props["Invoice ID"]),
		description: getRichText(props.Description),
		quantity: getNumber(props.Quantity),
		unit_price: getNumber(props["Unit Price"]),
		line_total: getNumber(props["Line Total"]),
		sort_order: getNumber(props["Sort Order"]),
	};

	return invoiceLineItemSchema.parse(rawData);
};

/**
 * Notion Page를 CompanyInfo 도메인 객체로 변환
 *
 * @param page - Notion PageObjectResponse
 * @returns CompanyInfo 도메인 객체
 * @throws Zod validation error if data is invalid
 */
export const mapNotionPageToCompanyInfo = (
	page: PageObjectResponse,
): CompanyInfo => {
	const props = page.properties;
	const logoUrl = getUrl(props["Logo URL"]);

	const rawData = {
		company_name: getTitleText(props["Company Name"]),
		company_address: getRichText(props["Company Address"]),
		company_email: getEmail(props["Company Email"]),
		company_phone: getPhoneNumber(props["Company Phone"]),
		logo_url: logoUrl || undefined,
		tax_id: getRichText(props["Tax ID"]),
	};

	return companyInfoSchema.parse(rawData);
};
