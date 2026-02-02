/**
 * 환경 변수 테스트용 fixture 빌더
 *
 * TDD Red 단계에서 사용할 환경 변수 테스트 데이터를 생성합니다.
 */

/**
 * 유효한 환경 변수 fixture
 */
export const validEnvFixture = {
	NOTION_API_KEY: "secret_abc123",
	NOTION_INVOICE_DATABASE_ID: "invoice-db-id-123",
	NOTION_LINE_ITEM_DATABASE_ID: "line-item-db-id-456",
	NOTION_COMPANY_DATABASE_ID: "company-db-id-789",
};

/**
 * 환경 변수 키 목록
 */
export const ENV_KEY_LIST = [
	"NOTION_API_KEY",
	"NOTION_INVOICE_DATABASE_ID",
	"NOTION_LINE_ITEM_DATABASE_ID",
	"NOTION_COMPANY_DATABASE_ID",
] as const;

/**
 * 특정 키를 제외한 부분 환경 변수 생성
 *
 * @param omit - 제외할 환경 변수 키 배열
 * @returns 지정된 키가 제외된 환경 변수 객체
 */
export const createPartialEnv = (omit: string[]) => {
	const env = { ...validEnvFixture };
	for (const key of omit) {
		delete env[key as keyof typeof env];
	}
	return env;
};

/**
 * 특정 키를 빈 문자열로 설정한 환경 변수 생성
 *
 * @param emptyKey - 빈 문자열로 설정할 환경 변수 키
 * @returns 지정된 키가 빈 문자열인 환경 변수 객체
 */
export const createEnvWithEmpty = (emptyKey: string) => ({
	...validEnvFixture,
	[emptyKey]: "",
});

/**
 * 추가 키를 포함한 환경 변수 생성
 *
 * @param extraKeys - 추가할 키-값 쌍 객체
 * @returns 추가 키가 포함된 환경 변수 객체
 */
export const createEnvWithExtraKeys = (extraKeys: Record<string, unknown>) => ({
	...validEnvFixture,
	...extraKeys,
});
