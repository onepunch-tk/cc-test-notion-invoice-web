/**
 * Notion Type Guards 테스트
 *
 * @notionhq/client의 PageObjectResponse properties에 대한 타입 가드를 검증합니다.
 * TDD Red 단계: 이 테스트들은 notion.types.ts 구현 전에 실패해야 합니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, it } from "vitest";
import {
	isDateProperty,
	isEmailProperty,
	isNumberProperty,
	isPhoneNumberProperty,
	isRichTextProperty,
	isSelectProperty,
	isTitleProperty,
	isUrlProperty,
	type NotionDatabaseIds,
} from "~/infrastructure/external/notion/notion.types";
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

type PropertyValueType = PageObjectResponse["properties"][string];

describe("Notion Type Guards", () => {
	describe("isTitleProperty", () => {
		it("title 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isTitleProperty(titleProp);

			// Assert
			expect(result).toBe(true);
		});

		it("title이 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const richTextProp = createMockRichTextProperty();

			// Act
			const result = isTitleProperty(richTextProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 title 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockTitleProperty();

			// Act & Assert
			if (isTitleProperty(prop)) {
				// 타입 좁히기가 작동하면 title 속성에 접근 가능
				expect(prop.title).toBeDefined();
				expect(Array.isArray(prop.title)).toBe(true);
			} else {
				// 이 블록에 도달하면 테스트 실패
				expect.fail("isTitleProperty should return true for title property");
			}
		});
	});

	describe("isRichTextProperty", () => {
		it("rich_text 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const richTextProp = createMockRichTextProperty();

			// Act
			const result = isRichTextProperty(richTextProp);

			// Assert
			expect(result).toBe(true);
		});

		it("rich_text가 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isRichTextProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 rich_text 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockRichTextProperty();

			// Act & Assert
			if (isRichTextProperty(prop)) {
				expect(prop.rich_text).toBeDefined();
				expect(Array.isArray(prop.rich_text)).toBe(true);
			} else {
				expect.fail(
					"isRichTextProperty should return true for rich_text property",
				);
			}
		});
	});

	describe("isNumberProperty", () => {
		it("number 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const numberProp = createMockNumberProperty();

			// Act
			const result = isNumberProperty(numberProp);

			// Assert
			expect(result).toBe(true);
		});

		it("number가 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isNumberProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 number 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockNumberProperty({ number: 42 });

			// Act & Assert
			if (isNumberProperty(prop)) {
				expect(prop.number).toBe(42);
				expect(typeof prop.number).toBe("number");
			} else {
				expect.fail("isNumberProperty should return true for number property");
			}
		});

		it("number 값이 null인 경우에도 number 타입으로 인식한다", () => {
			// Arrange
			const numberProp = createMockNumberProperty({ number: null });

			// Act
			const result = isNumberProperty(numberProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("isDateProperty", () => {
		it("date 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const dateProp = createMockDateProperty();

			// Act
			const result = isDateProperty(dateProp);

			// Assert
			expect(result).toBe(true);
		});

		it("date가 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isDateProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 date 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockDateProperty({
				date: { start: "2024-01-15", end: null, time_zone: null },
			});

			// Act & Assert
			if (isDateProperty(prop)) {
				expect(prop.date).toBeDefined();
				expect(prop.date?.start).toBe("2024-01-15");
			} else {
				expect.fail("isDateProperty should return true for date property");
			}
		});

		it("date 값이 null인 경우에도 date 타입으로 인식한다", () => {
			// Arrange
			const dateProp = createMockDateProperty({ date: null });

			// Act
			const result = isDateProperty(dateProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("isSelectProperty", () => {
		it("select 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const selectProp = createMockSelectProperty();

			// Act
			const result = isSelectProperty(selectProp);

			// Assert
			expect(result).toBe(true);
		});

		it("select가 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isSelectProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 select 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockSelectProperty({
				select: { id: "opt-1", name: "Draft", color: "blue" },
			});

			// Act & Assert
			if (isSelectProperty(prop)) {
				expect(prop.select).toBeDefined();
				expect(prop.select?.name).toBe("Draft");
			} else {
				expect.fail("isSelectProperty should return true for select property");
			}
		});

		it("select 값이 null인 경우에도 select 타입으로 인식한다", () => {
			// Arrange
			const selectProp = createMockSelectProperty({ select: null });

			// Act
			const result = isSelectProperty(selectProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("isEmailProperty", () => {
		it("email 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const emailProp = createMockEmailProperty();

			// Act
			const result = isEmailProperty(emailProp);

			// Assert
			expect(result).toBe(true);
		});

		it("email이 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isEmailProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 email 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockEmailProperty({
				email: "test@example.com",
			});

			// Act & Assert
			if (isEmailProperty(prop)) {
				expect(prop.email).toBe("test@example.com");
				expect(typeof prop.email).toBe("string");
			} else {
				expect.fail("isEmailProperty should return true for email property");
			}
		});

		it("email 값이 null인 경우에도 email 타입으로 인식한다", () => {
			// Arrange
			const emailProp = createMockEmailProperty({ email: null });

			// Act
			const result = isEmailProperty(emailProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("isUrlProperty", () => {
		it("url 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const urlProp = createMockUrlProperty();

			// Act
			const result = isUrlProperty(urlProp);

			// Assert
			expect(result).toBe(true);
		});

		it("url이 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isUrlProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 url 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockUrlProperty({
				url: "https://example.com",
			});

			// Act & Assert
			if (isUrlProperty(prop)) {
				expect(prop.url).toBe("https://example.com");
				expect(typeof prop.url).toBe("string");
			} else {
				expect.fail("isUrlProperty should return true for url property");
			}
		});

		it("url 값이 null인 경우에도 url 타입으로 인식한다", () => {
			// Arrange
			const urlProp = createMockUrlProperty({ url: null });

			// Act
			const result = isUrlProperty(urlProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("isPhoneNumberProperty", () => {
		it("phone_number 타입의 프로퍼티에 대해 true를 반환한다", () => {
			// Arrange
			const phoneProp = createMockPhoneNumberProperty();

			// Act
			const result = isPhoneNumberProperty(phoneProp);

			// Assert
			expect(result).toBe(true);
		});

		it("phone_number가 아닌 타입의 프로퍼티에 대해 false를 반환한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act
			const result = isPhoneNumberProperty(titleProp);

			// Assert
			expect(result).toBe(false);
		});

		it("타입 가드 통과 후 phone_number 프로퍼티로 타입이 좁혀진다", () => {
			// Arrange
			const prop: PropertyValueType = createMockPhoneNumberProperty({
				phone_number: "+1-555-1234",
			});

			// Act & Assert
			if (isPhoneNumberProperty(prop)) {
				expect(prop.phone_number).toBe("+1-555-1234");
				expect(typeof prop.phone_number).toBe("string");
			} else {
				expect.fail(
					"isPhoneNumberProperty should return true for phone_number property",
				);
			}
		});

		it("phone_number 값이 null인 경우에도 phone_number 타입으로 인식한다", () => {
			// Arrange
			const phoneProp = createMockPhoneNumberProperty({ phone_number: null });

			// Act
			const result = isPhoneNumberProperty(phoneProp);

			// Assert
			expect(result).toBe(true);
		});
	});

	describe("다중 타입 가드 조합 테스트", () => {
		it("하나의 프로퍼티는 오직 하나의 타입 가드만 통과한다", () => {
			// Arrange
			const titleProp = createMockTitleProperty();

			// Act & Assert
			expect(isTitleProperty(titleProp)).toBe(true);
			expect(isRichTextProperty(titleProp)).toBe(false);
			expect(isNumberProperty(titleProp)).toBe(false);
			expect(isDateProperty(titleProp)).toBe(false);
			expect(isSelectProperty(titleProp)).toBe(false);
			expect(isEmailProperty(titleProp)).toBe(false);
			expect(isUrlProperty(titleProp)).toBe(false);
			expect(isPhoneNumberProperty(titleProp)).toBe(false);
		});

		it("모든 타입 가드는 checkbox 타입에 대해 false를 반환한다", () => {
			// Arrange
			const checkboxProp = createMockCheckboxProperty();

			// Act & Assert
			expect(isTitleProperty(checkboxProp)).toBe(false);
			expect(isRichTextProperty(checkboxProp)).toBe(false);
			expect(isNumberProperty(checkboxProp)).toBe(false);
			expect(isDateProperty(checkboxProp)).toBe(false);
			expect(isSelectProperty(checkboxProp)).toBe(false);
			expect(isEmailProperty(checkboxProp)).toBe(false);
			expect(isUrlProperty(checkboxProp)).toBe(false);
			expect(isPhoneNumberProperty(checkboxProp)).toBe(false);
		});
	});

	describe("NotionDatabaseIds 인터페이스", () => {
		it("NotionDatabaseIds 타입이 올바른 구조를 가진다", () => {
			// Arrange
			const databaseIds: NotionDatabaseIds = {
				invoiceDbId: "invoice-db-123",
				lineItemDbId: "lineitem-db-456",
				companyDbId: "company-db-789",
			};

			// Act & Assert
			expect(databaseIds.invoiceDbId).toBe("invoice-db-123");
			expect(databaseIds.lineItemDbId).toBe("lineitem-db-456");
			expect(databaseIds.companyDbId).toBe("company-db-789");
		});

		it("NotionDatabaseIds의 모든 필드가 문자열 타입이다", () => {
			// Arrange
			const databaseIds: NotionDatabaseIds = {
				invoiceDbId: "db-1",
				lineItemDbId: "db-2",
				companyDbId: "db-3",
			};

			// Act & Assert
			expect(typeof databaseIds.invoiceDbId).toBe("string");
			expect(typeof databaseIds.lineItemDbId).toBe("string");
			expect(typeof databaseIds.companyDbId).toBe("string");
		});
	});
});
