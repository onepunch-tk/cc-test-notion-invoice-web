import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDrizzleClient } from "@/db";
import * as schema from "@/db/schema";
import {
	sendVerificationEmail,
	sendPasswordResetEmail,
} from "./email.server";

/**
 * Better-auth 인스턴스 생성
 *
 * @param databaseUrl - PostgreSQL 데이터베이스 URL
 * @param baseURL - 애플리케이션 기본 URL (OAuth 콜백용)
 * @param githubClientId - GitHub OAuth 클라이언트 ID
 * @param githubClientSecret - GitHub OAuth 클라이언트 시크릿
 * @param googleClientId - Google OAuth 클라이언트 ID
 * @param googleClientSecret - Google OAuth 클라이언트 시크릿
 * @param kakaoClientId - Kakao OAuth 클라이언트 ID
 * @param kakaoClientSecret - Kakao OAuth 클라이언트 시크릿
 * @returns Better-auth 인스턴스
 */
export const createAuthInstance = (
	databaseUrl: string,
	baseURL: string,
	githubClientId?: string,
	githubClientSecret?: string,
	googleClientId?: string,
	googleClientSecret?: string,
	kakaoClientId?: string,
	kakaoClientSecret?: string,
) => {
	const db = createDrizzleClient(databaseUrl);

	return betterAuth({
		// ✅ 비밀 키 (환경 변수에서 자동 로드)
		// BETTER_AUTH_SECRET 환경 변수 필수!
		secret: process.env.BETTER_AUTH_SECRET,

		// ✅ 기본 URL
		baseURL,

		// ✅ DrizzleAdapter 연결 (PostgreSQL)
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				user: schema.userTable,
				session: schema.sessionTable,
				account: schema.accountTable,
				verification: schema.verificationTable,
				// 2FA 사용 시 추가
				// twoFactor: schema.twoFactorTable,
			},
		}),

		// ✅ 이메일/비밀번호 인증 설정
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: true,
			sendResetPassword: async ({ user, url }) => {
				await sendPasswordResetEmail(user.email, url, baseURL);
			},
		},

		// ✅ 이메일 인증 설정
		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				await sendVerificationEmail(user.email, url, baseURL);
			},
		},

		// ✅ OAuth 프로바이더 설정
		socialProviders: {
			github: githubClientId && githubClientSecret
				? {
						clientId: githubClientId,
						clientSecret: githubClientSecret,
				  }
				: undefined,
			google: googleClientId && googleClientSecret
				? {
						clientId: googleClientId,
						clientSecret: googleClientSecret,
				  }
				: undefined,
			// Kakao는 Better-auth v1.3+에서 공식 지원
			// 아직 지원되지 않으면 커스텀 OAuth로 구현 필요
		},

		// ✅ 세션 설정
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7일
			updateAge: 60 * 60 * 24, // 1일마다 갱신
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5, // 5분
			},
		},

		// ✅ 보안 설정
		advanced: {
			crossSubDomainCookies: {
				enabled: false,
			},
			generateId: false, // Drizzle이 자동으로 생성
		},
	});
};

/**
 * Auth 인스턴스 타입 추론
 */
export type AuthInstance = ReturnType<typeof createAuthInstance>;
