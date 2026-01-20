import { createEmailServiceImpl } from "~/infrastructure/external/resend/email.service.impl";
import { createProfileRepositoryImpl } from "~/infrastructure/persistence";
import { createDrizzleClient } from "~/infrastructure/persistence/drizzle/drizzle.server";
import { type BetterAuthInstance, createBetterAuth } from "./auth.config";

/**
 * Auth 인스턴스 타입
 */
export type AuthInstance = BetterAuthInstance;
export type Auth = BetterAuthInstance;

/**
 * CLI용 auth 인스턴스 (Lazy initialization)
 *
 * 순환 참조 방지를 위해 lazy getter로 구현합니다.
 * 주의: 이 인스턴스는 CLI 스키마 생성 및 로컬 개발용입니다.
 * Cloudflare Workers 환경에서는 Container를 사용하세요.
 */
let _auth: BetterAuthInstance | null = null;

export const getAuth = (): BetterAuthInstance => {
	if (!_auth) {
		const db = createDrizzleClient(process.env.DATABASE_URL!);
		const emailService = createEmailServiceImpl(
			process.env.RESEND_API_KEY,
			process.env.RESEND_FROM_EMAIL,
		);
		const profileRepository = createProfileRepositoryImpl(db);

		_auth = createBetterAuth(
			db,
			{
				databaseUrl: process.env.DATABASE_URL!,
				baseURL: process.env.BASE_URL!,
				secret: process.env.BETTER_AUTH_SECRET!,
				githubClientId: process.env.GITHUB_CLIENT_ID,
				githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
				googleClientId: process.env.GOOGLE_CLIENT_ID,
				googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
				kakaoClientId: process.env.KAKAO_CLIENT_ID,
				kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET,
				resendApiKey: process.env.RESEND_API_KEY,
				resendFromEmail: process.env.RESEND_FROM_EMAIL,
			},
			emailService.sendVerificationEmail,
			emailService.sendPasswordResetEmail,
			profileRepository,
		);
	}
	return _auth;
};

/**
 * CLI 호환성을 위한 auth 인스턴스 export
 *
 * Better-auth CLI가 스키마 생성 시 이 변수를 찾습니다.
 * CLI는 `export default auth` 또는 `export const auth`를 기대합니다.
 */
export const auth = getAuth();
