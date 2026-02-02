/**
 * CompanyInfo 테스트용 fixture 빌더
 *
 * TDD Red 단계에서 사용할 테스트 데이터를 생성합니다.
 */

/**
 * 유효한 CompanyInfo 데이터 빌더
 */
export const createValidCompanyInfoData = (
	overrides: Partial<{
		company_name: string;
		company_address: string;
		company_email: string;
		company_phone: string;
		logo_url: string;
		tax_id: string;
	}> = {},
) => ({
	company_name: "Test Company Inc.",
	company_address: "456 Business Ave, Corporate City",
	company_email: "contact@testcompany.com",
	company_phone: "+1-555-123-4567",
	logo_url: "https://example.com/logo.png",
	tax_id: "TAX-123456789",
	...overrides,
});

/**
 * logo_url 없는 유효한 CompanyInfo 데이터
 */
export const createValidCompanyInfoWithoutLogo = (
	overrides: Partial<{
		company_name: string;
		company_address: string;
		company_email: string;
		company_phone: string;
		tax_id: string;
	}> = {},
) => ({
	company_name: "Test Company Inc.",
	company_address: "456 Business Ave, Corporate City",
	company_email: "contact@testcompany.com",
	company_phone: "+1-555-123-4567",
	tax_id: "TAX-123456789",
	...overrides,
});

/**
 * 잘못된 CompanyInfo 데이터 케이스들
 */
export const invalidCompanyInfoDataCases = {
	missingCompanyName: {
		company_address: "456 Business Ave",
		company_email: "contact@testcompany.com",
		company_phone: "+1-555-123-4567",
		tax_id: "TAX-123456789",
	},
	invalidEmail: createValidCompanyInfoData({
		company_email: "not-an-email",
	}),
	invalidLogoUrl: createValidCompanyInfoData({
		logo_url: "not-a-valid-url",
	}),
	emptyCompanyName: createValidCompanyInfoData({
		company_name: "",
	}),
	emptyTaxId: createValidCompanyInfoData({
		tax_id: "",
	}),
	emptyPhone: createValidCompanyInfoData({
		company_phone: "",
	}),
};
