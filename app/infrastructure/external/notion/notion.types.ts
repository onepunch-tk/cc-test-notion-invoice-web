/**
 * Notion API Type Helpers and Guards
 *
 * @notionhq/client의 PageObjectResponse properties에 대한 타입 가드와 헬퍼 타입을 제공합니다.
 * 이를 통해 Notion API 응답을 안전하게 파싱하고 타입을 좁힐 수 있습니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Database IDs 설정 인터페이스
 *
 * 환경 변수에서 로드한 Notion Database ID들을 관리합니다.
 */
export interface NotionDatabaseIds {
	invoiceDbId: string;
	lineItemDbId: string;
	companyDbId: string;
}

/**
 * Notion Property Value 타입
 *
 * PageObjectResponse의 properties 객체에서 각 프로퍼티의 값 타입
 */
type PropertyValueType = PageObjectResponse["properties"][string];

/**
 * Title 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns title 타입이면 true, 아니면 false
 */
export const isTitleProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "title" }> => {
	return prop.type === "title";
};

/**
 * RichText 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns rich_text 타입이면 true, 아니면 false
 */
export const isRichTextProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "rich_text" }> => {
	return prop.type === "rich_text";
};

/**
 * Number 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns number 타입이면 true, 아니면 false
 */
export const isNumberProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "number" }> => {
	return prop.type === "number";
};

/**
 * Date 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns date 타입이면 true, 아니면 false
 */
export const isDateProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "date" }> => {
	return prop.type === "date";
};

/**
 * Select 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns select 타입이면 true, 아니면 false
 */
export const isSelectProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "select" }> => {
	return prop.type === "select";
};

/**
 * Email 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns email 타입이면 true, 아니면 false
 */
export const isEmailProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "email" }> => {
	return prop.type === "email";
};

/**
 * URL 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns url 타입이면 true, 아니면 false
 */
export const isUrlProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "url" }> => {
	return prop.type === "url";
};

/**
 * PhoneNumber 프로퍼티 타입 가드
 *
 * @param prop - 검사할 Notion 프로퍼티
 * @returns phone_number 타입이면 true, 아니면 false
 */
export const isPhoneNumberProperty = (
	prop: PropertyValueType,
): prop is Extract<PropertyValueType, { type: "phone_number" }> => {
	return prop.type === "phone_number";
};
