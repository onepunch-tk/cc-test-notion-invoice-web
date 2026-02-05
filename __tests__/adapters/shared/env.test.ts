import { ZodError } from "zod";
import {
	ENV_KEYS,
	envSchema,
	extractEnvFromSource,
	parseEnv,
} from "../../../adapters/shared/env";
import {
	createEnvWithEmpty,
	createEnvWithExtraKeys,
	createPartialEnv,
	ENV_KEY_LIST,
	validEnvFixture,
} from "../../fixtures/env/env.fixture";

describe("envSchema", () => {
	describe("유효한 환경 변수 파싱", () => {
		it("모든 필수 환경 변수가 있을 때 성공적으로 파싱한다", () => {
			// Arrange
			const validEnv = validEnvFixture;

			// Act
			const result = envSchema.safeParse(validEnv);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.NOTION_API_KEY).toBe(validEnv.NOTION_API_KEY);
				expect(result.data.NOTION_INVOICE_DATABASE_ID).toBe(
					validEnv.NOTION_INVOICE_DATABASE_ID,
				);
				expect(result.data.NOTION_LINE_ITEM_DATABASE_ID).toBe(
					validEnv.NOTION_LINE_ITEM_DATABASE_ID,
				);
				expect(result.data.NOTION_COMPANY_DATABASE_ID).toBe(
					validEnv.NOTION_COMPANY_DATABASE_ID,
				);
			}
		});
	});

	describe("필수 환경 변수 누락 시 에러", () => {
		it("NOTION_API_KEY가 누락되면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithoutApiKey = createPartialEnv(["NOTION_API_KEY"]);

			// Act
			const result = envSchema.safeParse(envWithoutApiKey);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const apiKeyError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_API_KEY",
				);
				expect(apiKeyError).toBeDefined();
			}
		});

		it("NOTION_INVOICE_DATABASE_ID가 누락되면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithoutInvoiceDb = createPartialEnv([
				"NOTION_INVOICE_DATABASE_ID",
			]);

			// Act
			const result = envSchema.safeParse(envWithoutInvoiceDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const invoiceDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_INVOICE_DATABASE_ID",
				);
				expect(invoiceDbError).toBeDefined();
			}
		});

		it("NOTION_LINE_ITEM_DATABASE_ID가 누락되면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithoutLineItemDb = createPartialEnv([
				"NOTION_LINE_ITEM_DATABASE_ID",
			]);

			// Act
			const result = envSchema.safeParse(envWithoutLineItemDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const lineItemDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_LINE_ITEM_DATABASE_ID",
				);
				expect(lineItemDbError).toBeDefined();
			}
		});

		it("NOTION_COMPANY_DATABASE_ID가 누락되면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithoutCompanyDb = createPartialEnv([
				"NOTION_COMPANY_DATABASE_ID",
			]);

			// Act
			const result = envSchema.safeParse(envWithoutCompanyDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const companyDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_COMPANY_DATABASE_ID",
				);
				expect(companyDbError).toBeDefined();
			}
		});
	});

	describe("빈 문자열 환경 변수 거부", () => {
		it("NOTION_API_KEY가 빈 문자열이면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithEmptyApiKey = createEnvWithEmpty("NOTION_API_KEY");

			// Act
			const result = envSchema.safeParse(envWithEmptyApiKey);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const apiKeyError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_API_KEY",
				);
				expect(apiKeyError).toBeDefined();
			}
		});

		it("NOTION_INVOICE_DATABASE_ID가 빈 문자열이면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithEmptyInvoiceDb = createEnvWithEmpty(
				"NOTION_INVOICE_DATABASE_ID",
			);

			// Act
			const result = envSchema.safeParse(envWithEmptyInvoiceDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const invoiceDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_INVOICE_DATABASE_ID",
				);
				expect(invoiceDbError).toBeDefined();
			}
		});

		it("NOTION_LINE_ITEM_DATABASE_ID가 빈 문자열이면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithEmptyLineItemDb = createEnvWithEmpty(
				"NOTION_LINE_ITEM_DATABASE_ID",
			);

			// Act
			const result = envSchema.safeParse(envWithEmptyLineItemDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const lineItemDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_LINE_ITEM_DATABASE_ID",
				);
				expect(lineItemDbError).toBeDefined();
			}
		});

		it("NOTION_COMPANY_DATABASE_ID가 빈 문자열이면 ZodError를 발생시킨다", () => {
			// Arrange
			const envWithEmptyCompanyDb = createEnvWithEmpty(
				"NOTION_COMPANY_DATABASE_ID",
			);

			// Act
			const result = envSchema.safeParse(envWithEmptyCompanyDb);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeInstanceOf(ZodError);
				const companyDbError = result.error.issues.find(
					(issue) => issue.path[0] === "NOTION_COMPANY_DATABASE_ID",
				);
				expect(companyDbError).toBeDefined();
			}
		});
	});
});

describe("extractEnvFromSource", () => {
	it("스키마에 정의된 키만 추출한다", () => {
		// Arrange
		const sourceWithExtraKeys = createEnvWithExtraKeys({
			EXTRA_KEY: "extra-value",
			ANOTHER_EXTRA: "another-value",
		});

		// Act
		const result = extractEnvFromSource(sourceWithExtraKeys);

		// Assert
		expect(result).toHaveProperty("NOTION_API_KEY");
		expect(result).toHaveProperty("NOTION_INVOICE_DATABASE_ID");
		expect(result).toHaveProperty("NOTION_LINE_ITEM_DATABASE_ID");
		expect(result).toHaveProperty("NOTION_COMPANY_DATABASE_ID");
		expect(result).not.toHaveProperty("EXTRA_KEY");
		expect(result).not.toHaveProperty("ANOTHER_EXTRA");
	});

	it("문자열이 아닌 값은 무시한다", () => {
		// Arrange
		const sourceWithNonStringValues = {
			NOTION_API_KEY: "valid-key",
			NOTION_INVOICE_DATABASE_ID: 12345, // number
			NOTION_LINE_ITEM_DATABASE_ID: null, // null
			NOTION_COMPANY_DATABASE_ID: undefined, // undefined
		};

		// Act
		const result = extractEnvFromSource(sourceWithNonStringValues);

		// Assert
		expect(result).toHaveProperty("NOTION_API_KEY", "valid-key");
		expect(result).not.toHaveProperty("NOTION_INVOICE_DATABASE_ID");
		expect(result).not.toHaveProperty("NOTION_LINE_ITEM_DATABASE_ID");
		expect(result).not.toHaveProperty("NOTION_COMPANY_DATABASE_ID");
	});
});

describe("parseEnv", () => {
	it("유효한 소스에서 환경 변수를 파싱한다", () => {
		// Arrange
		const validSource = validEnvFixture;

		// Act
		const result = parseEnv(validSource);

		// Assert
		expect(result.NOTION_API_KEY).toBe(validEnvFixture.NOTION_API_KEY);
		expect(result.NOTION_INVOICE_DATABASE_ID).toBe(
			validEnvFixture.NOTION_INVOICE_DATABASE_ID,
		);
		expect(result.NOTION_LINE_ITEM_DATABASE_ID).toBe(
			validEnvFixture.NOTION_LINE_ITEM_DATABASE_ID,
		);
		expect(result.NOTION_COMPANY_DATABASE_ID).toBe(
			validEnvFixture.NOTION_COMPANY_DATABASE_ID,
		);
	});

	it("필수 환경 변수가 누락되면 ZodError를 발생시킨다", () => {
		// Arrange
		const invalidSource = createPartialEnv(["NOTION_API_KEY"]);

		// Act & Assert
		expect(() => parseEnv(invalidSource)).toThrow(ZodError);
	});

	it("추가 키는 무시하고 스키마 키만 반환한다", () => {
		// Arrange
		const sourceWithExtraKeys = createEnvWithExtraKeys({
			EXTRA_KEY: "extra-value",
		});

		// Act
		const result = parseEnv(sourceWithExtraKeys);

		// Assert
		expect(result).not.toHaveProperty("EXTRA_KEY");
		expect(Object.keys(result)).toHaveLength(4);
	});
});

describe("ENV_KEYS", () => {
	it("모든 Notion 환경 변수 키를 포함한다", () => {
		// Arrange
		const expectedKeys = ENV_KEY_LIST;

		// Act & Assert
		for (const key of expectedKeys) {
			expect(ENV_KEYS).toContain(key);
		}
	});

	it("정확히 4개의 키를 포함한다", () => {
		// Arrange & Act & Assert
		expect(ENV_KEYS).toHaveLength(4);
	});
});
