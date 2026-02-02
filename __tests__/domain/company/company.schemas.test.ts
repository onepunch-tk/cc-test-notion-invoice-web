import { companyInfoSchema } from "~/domain/company";
import {
	createValidCompanyInfoData,
	createValidCompanyInfoWithoutLogo,
	invalidCompanyInfoDataCases,
} from "../../fixtures/company/company.fixture";

describe("companyInfoSchema", () => {
	describe("유효한 CompanyInfo 파싱", () => {
		it("유효한 CompanyInfo 데이터를 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidCompanyInfoData();

			// Act
			const result = companyInfoSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as typeof validData;
				expect(data.company_name).toBe(validData.company_name);
				expect(data.company_address).toBe(validData.company_address);
				expect(data.company_email).toBe(validData.company_email);
				expect(data.company_phone).toBe(validData.company_phone);
				expect(data.logo_url).toBe(validData.logo_url);
				expect(data.tax_id).toBe(validData.tax_id);
			}
		});

		it("커스텀 값으로 CompanyInfo 데이터를 파싱할 수 있어야 한다", () => {
			// Arrange
			const customData = createValidCompanyInfoData({
				company_name: "Custom Company LLC",
				company_email: "custom@company.com",
				tax_id: "CUSTOM-TAX-123",
			});

			// Act
			const result = companyInfoSchema.safeParse(customData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as typeof customData;
				expect(data.company_name).toBe("Custom Company LLC");
				expect(data.company_email).toBe("custom@company.com");
				expect(data.tax_id).toBe("CUSTOM-TAX-123");
			}
		});

		it("logo_url이 없는 CompanyInfo 데이터를 파싱할 수 있어야 한다 (optional)", () => {
			// Arrange
			const dataWithoutLogo = createValidCompanyInfoWithoutLogo();

			// Act
			const result = companyInfoSchema.safeParse(dataWithoutLogo);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as typeof dataWithoutLogo & {
					logo_url?: string;
				};
				expect(data.company_name).toBe(dataWithoutLogo.company_name);
				expect(data.logo_url).toBeUndefined();
			}
		});

		it("logo_url이 명시적으로 undefined인 경우 파싱할 수 있어야 한다", () => {
			// Arrange
			const dataWithUndefinedLogo = {
				...createValidCompanyInfoWithoutLogo(),
				logo_url: undefined,
			};

			// Act
			const result = companyInfoSchema.safeParse(dataWithUndefinedLogo);

			// Assert
			expect(result.success).toBe(true);
		});
	});

	describe("유효하지 않은 CompanyInfo 거부", () => {
		it("company_name이 누락된 데이터를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.missingCompanyName;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const companyNameError = result.error.issues.find((issue) =>
					issue.path.includes("company_name"),
				);
				expect(companyNameError).toBeDefined();
			}
		});

		it("유효하지 않은 이메일 형식을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.invalidEmail;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const emailError = result.error.issues.find((issue) =>
					issue.path.includes("company_email"),
				);
				expect(emailError).toBeDefined();
			}
		});

		it("유효하지 않은 logo_url을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.invalidLogoUrl;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const logoUrlError = result.error.issues.find((issue) =>
					issue.path.includes("logo_url"),
				);
				expect(logoUrlError).toBeDefined();
			}
		});

		it("빈 company_name을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.emptyCompanyName;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 tax_id를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.emptyTaxId;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 company_phone을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidCompanyInfoDataCases.emptyPhone;

			// Act
			const result = companyInfoSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("필수 필드가 모두 누락된 빈 객체를 거부해야 한다", () => {
			// Arrange
			const emptyData = {};

			// Act
			const result = companyInfoSchema.safeParse(emptyData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("잘못된 타입의 값을 거부해야 한다", () => {
			// Arrange
			const invalidTypeData = {
				company_name: 123, // 숫자가 아닌 문자열이어야 함
				company_address: "456 Business Ave",
				company_email: "contact@testcompany.com",
				company_phone: "+1-555-123-4567",
				tax_id: "TAX-123456789",
			};

			// Act
			const result = companyInfoSchema.safeParse(invalidTypeData);

			// Assert
			expect(result.success).toBe(false);
		});
	});

	describe("엣지 케이스", () => {
		it("긴 문자열 값을 가진 CompanyInfo를 파싱할 수 있어야 한다", () => {
			// Arrange
			const longString = "A".repeat(500);
			const dataWithLongValues = createValidCompanyInfoData({
				company_name: longString,
				company_address: longString,
			});

			// Act
			const result = companyInfoSchema.safeParse(dataWithLongValues);

			// Assert
			expect(result.success).toBe(true);
		});

		it("특수 문자가 포함된 company_name을 파싱할 수 있어야 한다", () => {
			// Arrange
			const dataWithSpecialChars = createValidCompanyInfoData({
				company_name: "Test & Company, Inc. (주식회사)",
			});

			// Act
			const result = companyInfoSchema.safeParse(dataWithSpecialChars);

			// Assert
			expect(result.success).toBe(true);
		});

		it("국제 전화번호 형식을 파싱할 수 있어야 한다", () => {
			// Arrange
			const dataWithInternationalPhone = createValidCompanyInfoData({
				company_phone: "+82-2-1234-5678",
			});

			// Act
			const result = companyInfoSchema.safeParse(dataWithInternationalPhone);

			// Assert
			expect(result.success).toBe(true);
		});

		it("HTTPS URL을 가진 logo_url을 파싱할 수 있어야 한다", () => {
			// Arrange
			const dataWithHttpsLogo = createValidCompanyInfoData({
				logo_url: "https://cdn.example.com/logos/company-logo.png",
			});

			// Act
			const result = companyInfoSchema.safeParse(dataWithHttpsLogo);

			// Assert
			expect(result.success).toBe(true);
		});
	});
});
