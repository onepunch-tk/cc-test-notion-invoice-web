import { z } from "zod";

/**
 * 환경 변수 스키마 (Single Source of Truth)
 *
 * Invoice-Web MVP 환경 변수:
 * - NOTION_API_KEY: Notion Integration 토큰
 * - NOTION_INVOICE_DATABASE_ID: 인보이스 데이터베이스 ID
 * - NOTION_COMPANY_DATABASE_ID: 회사 정보 데이터베이스 ID
 *
 * 새 환경 변수 추가 시 이 스키마만 수정하면 됩니다:
 * - 필수: z.string()
 * - 선택: z.string().optional()
 */
export const envSchema = z.object({
	NOTION_API_KEY: z.string().min(1, "NOTION_API_KEY is required"),
	NOTION_INVOICE_DATABASE_ID: z
		.string()
		.min(1, "NOTION_INVOICE_DATABASE_ID is required"),
	NOTION_LINE_ITEM_DATABASE_ID: z
		.string()
		.min(1, "NOTION_LINE_ITEM_DATABASE_ID is required"),
	NOTION_COMPANY_DATABASE_ID: z
		.string()
		.min(1, "NOTION_COMPANY_DATABASE_ID is required"),
});

/** 환경 변수 타입 (스키마에서 자동 추론) */
export type AppEnv = z.infer<typeof envSchema>;

/** 환경 변수 키 목록 (스키마에서 자동 추출) */
export const ENV_KEYS = Object.keys(envSchema.shape) as (keyof AppEnv)[];

/**
 * 환경 변수 소스에서 AppEnv 추출
 *
 * Cloudflare 환경(Record 객체)에서 환경 변수를 추출합니다.
 *
 * @param source - 환경 변수 소스 (Cloudflare Env)
 * @returns Partial<AppEnv> 환경 변수 객체
 */
export const extractEnvFromSource = (
	source: Record<string, unknown>,
): Partial<AppEnv> => {
	if (ENV_KEYS.length === 0) {
		return {} as unknown as Partial<AppEnv>;
	}

	const result: Record<string, string> = {};
	for (const key of ENV_KEYS) {
		const value = source[key as string];
		if (typeof value === "string") {
			result[key as string] = value;
		}
	}
	return result as unknown as Partial<AppEnv>;
};

/**
 * 환경 변수 검증 및 파싱
 *
 * Zod 스키마로 필수/선택 환경 변수를 자동 검증합니다.
 *
 * @param source - 환경 변수 소스 (Cloudflare Env)
 * @returns AppEnv 검증된 환경 변수 객체
 * @throws ZodError 필수 환경 변수 누락 또는 타입 오류 시
 */
export const parseEnv = (source: Record<string, unknown>): AppEnv => {
	const partialEnv = extractEnvFromSource(source);
	return envSchema.parse(partialEnv);
};
