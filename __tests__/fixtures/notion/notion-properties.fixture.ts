/**
 * Notion API 프로퍼티 테스트용 fixture 빌더
 *
 * @notionhq/client의 PageObjectResponse properties 구조를 모방합니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PropertyValueType = PageObjectResponse["properties"][string];

/**
 * Title 프로퍼티 목 생성
 */
export const createMockTitleProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "title" }>> = {},
): Extract<PropertyValueType, { type: "title" }> => ({
	type: "title",
	title: [
		{
			type: "text",
			text: { content: "Test Title", link: null },
			annotations: {
				bold: false,
				italic: false,
				strikethrough: false,
				underline: false,
				code: false,
				color: "default",
			},
			plain_text: "Test Title",
			href: null,
		},
	],
	id: "title-id",
	...overrides,
});

/**
 * RichText 프로퍼티 목 생성
 */
export const createMockRichTextProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "rich_text" }>> = {},
): Extract<PropertyValueType, { type: "rich_text" }> => ({
	type: "rich_text",
	rich_text: [
		{
			type: "text",
			text: { content: "Test Description", link: null },
			annotations: {
				bold: false,
				italic: false,
				strikethrough: false,
				underline: false,
				code: false,
				color: "default",
			},
			plain_text: "Test Description",
			href: null,
		},
	],
	id: "richtext-id",
	...overrides,
});

/**
 * Number 프로퍼티 목 생성
 */
export const createMockNumberProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "number" }>> = {},
): Extract<PropertyValueType, { type: "number" }> => ({
	type: "number",
	number: 100,
	id: "number-id",
	...overrides,
});

/**
 * Date 프로퍼티 목 생성
 */
export const createMockDateProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "date" }>> = {},
): Extract<PropertyValueType, { type: "date" }> => ({
	type: "date",
	date: {
		start: "2024-01-15",
		end: null,
		time_zone: null,
	},
	id: "date-id",
	...overrides,
});

/**
 * Select 프로퍼티 목 생성
 */
export const createMockSelectProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "select" }>> = {},
): Extract<PropertyValueType, { type: "select" }> => ({
	type: "select",
	select: {
		id: "select-option-id",
		name: "Draft",
		color: "default",
	},
	id: "select-id",
	...overrides,
});

/**
 * Email 프로퍼티 목 생성
 */
export const createMockEmailProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "email" }>> = {},
): Extract<PropertyValueType, { type: "email" }> => ({
	type: "email",
	email: "test@example.com",
	id: "email-id",
	...overrides,
});

/**
 * URL 프로퍼티 목 생성
 */
export const createMockUrlProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "url" }>> = {},
): Extract<PropertyValueType, { type: "url" }> => ({
	type: "url",
	url: "https://example.com",
	id: "url-id",
	...overrides,
});

/**
 * PhoneNumber 프로퍼티 목 생성
 */
export const createMockPhoneNumberProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "phone_number" }>> = {},
): Extract<PropertyValueType, { type: "phone_number" }> => ({
	type: "phone_number",
	phone_number: "+1-555-1234",
	id: "phone-id",
	...overrides,
});

/**
 * 잘못된 타입의 프로퍼티 목 (타입 가드 테스트용)
 */
export const createMockCheckboxProperty = (
	overrides: Partial<Extract<PropertyValueType, { type: "checkbox" }>> = {},
): Extract<PropertyValueType, { type: "checkbox" }> => ({
	type: "checkbox",
	checkbox: true,
	id: "checkbox-id",
	...overrides,
});
