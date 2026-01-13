import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createDrizzleClient } from "~/db";
import * as schema from "~/db/schema";
import { userTable } from "~/db/schema";
import {
	DuplicateEmailError,
	UserCreationError,
} from "~/features/auth/errors";
import { createUserProfile } from "~/features/auth/services/profile.server";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.server";

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
	resendApiKey?: string,
	resendFromEmail?: string,
) => {
	const db = createDrizzleClient(databaseUrl);

	return betterAuth({
		// ✅ 비밀 키 (환경 변수에서 자동 로드)
		// BETTER_AUTH_SECRET 환경 변수 필수!
		secret: process.env.BETTER_AUTH_SECRET,

		// ✅ 기본 URL
		baseURL,
		basePath: "/auth/api",

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
				await sendPasswordResetEmail(
					user.email,
					url,
					resendApiKey,
					resendFromEmail,
				);
			},
		},

		// ✅ 이메일 인증 설정
		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				await sendVerificationEmail(
					user.email,
					url,
					resendApiKey,
					resendFromEmail,
				);
			},
		},

		// ✅ OAuth 프로바이더 설정
		socialProviders: {
			github:
				githubClientId && githubClientSecret
					? {
							clientId: githubClientId,
							clientSecret: githubClientSecret,
						}
					: undefined,
			google:
				googleClientId && googleClientSecret
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

/**
 * Cloudflare Workers 환경 변수 타입
 */
export interface CloudflareAuthEnv {
	DATABASE_URL: string;
	BASE_URL: string;
	BETTER_AUTH_SECRET: string;
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	KAKAO_CLIENT_ID?: string;
	KAKAO_CLIENT_SECRET?: string;
	RESEND_API_KEY?: string;
	RESEND_FROM_EMAIL?: string;
}

/**
 * 미들웨어 컨텍스트 타입
 */
export interface MiddlewareContext {
	request: Request;
	context: LoaderFunctionArgs["context"] | ActionFunctionArgs["context"];
}

/**
 * 환경 변수 추출 헬퍼
 *
 * Context에서 Cloudflare 환경 변수를 추출하고 필수 값을 검증합니다.
 *
 * @param context - Loader 또는 Action 컨텍스트
 * @returns Cloudflare 환경 변수
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const extractAuthEnv = (
	context: MiddlewareContext["context"],
): CloudflareAuthEnv => {
	const env = context.cloudflare?.env as CloudflareAuthEnv | undefined;

	if (!env?.DATABASE_URL || !env?.BASE_URL || !env?.BETTER_AUTH_SECRET) {
		throw new Error(
			"필수 환경 변수가 설정되지 않았습니다. " +
				"DATABASE_URL, BASE_URL, BETTER_AUTH_SECRET를 확인하세요.",
		);
	}

	return env;
};

/**
 * Context에서 Auth 인스턴스 생성
 *
 * 환경 변수를 추출하고 Better-auth 인스턴스를 생성합니다.
 * 미들웨어와 액션에서 공통으로 사용됩니다.
 *
 * @param context - Loader 또는 Action 컨텍스트
 * @returns Better-auth 인스턴스
 * @throws Error 필수 환경 변수가 없을 경우
 */
export const createAuthFromContext = (
	context: MiddlewareContext["context"],
) => {
	const env = extractAuthEnv(context);

	return createAuthInstance(
		env.DATABASE_URL,
		env.BASE_URL,
		env.GITHUB_CLIENT_ID,
		env.GITHUB_CLIENT_SECRET,
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET,
		env.KAKAO_CLIENT_ID,
		env.KAKAO_CLIENT_SECRET,
		env.RESEND_API_KEY,
		env.RESEND_FROM_EMAIL,
	);
};

/**
 * 로그아웃 헬퍼 (Action 전용)
 *
 * Better-auth signOut API를 호출하여 세션을 삭제합니다.
 * 리다이렉트는 호출자에서 처리합니다.
 *
 * @param args - 미들웨어 컨텍스트
 * @returns void
 * @throws Error 환경 변수가 없거나 로그아웃 실패 시
 */
export const signOut = async ({ request, context }: MiddlewareContext) => {
	const auth = createAuthFromContext(context);
	await auth.api.signOut({ headers: request.headers });
};

/**
 * 이메일/비밀번호 로그인 (Action 전용)
 *
 * Better-auth의 signInEmail API를 호출합니다.
 *
 * @param args - 로그인 정보
 * @throws Error 로그인 실패 시
 */
export const signInWithCredentials = async ({
	request,
	context,
	email,
	password,
}: {
	request: Request;
	context: MiddlewareContext["context"];
	email: string;
	password: string;
}) => {
	const auth = createAuthFromContext(context);
	return await auth.api.signInEmail({
		body: { email, password },
		headers: request.headers,
	});
};

/**
 * 이메일/비밀번호 회원가입 (Action 전용)
 *
 * Better-auth의 signUpEmail API를 호출하고, 추가 로직을 수행합니다:
 * 1. 이메일 중복 체크 (명시적)
 * 2. Better-auth를 통한 사용자 생성
 * 3. 프로필 자동 생성
 *
 * @param args - 회원가입 정보
 * @throws DuplicateEmailError 이메일이 이미 사용 중인 경우
 * @throws UserCreationError 사용자 생성에 실패한 경우
 */
export const signUpWithCredentials = async ({
	request,
	context,
	email,
	password,
	name,
}: {
	request: Request;
	context: MiddlewareContext["context"];
	email: string;
	password: string;
	name: string;
}) => {
	// 1. 환경 변수 및 DB 클라이언트 생성
	const env = extractAuthEnv(context);
	const db = createDrizzleClient(env.DATABASE_URL);

	// 2. 이메일 중복 체크 (명시적 확인)
	const existingUser = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	if (existingUser.length > 0) {
		throw new DuplicateEmailError();
	}

	// 3. Better-auth로 사용자 생성 (기존 로직)
	const auth = createAuthFromContext(context);
	const result = await auth.api.signUpEmail({
		body: { email, password, name },
		headers: request.headers,
	});

	// 4. 생성된 사용자 조회
	const newUser = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	if (newUser.length === 0) {
		throw new UserCreationError();
	}

	// 5. 프로필 자동 생성 (실패해도 회원가입은 성공)
	try {
		await createUserProfile(db, {
			userId: newUser[0].id,
			fullName: name,
			avatarUrl: null,
			bio: null,
		});
	} catch (profileError) {
		// ProfileCreationError는 비치명적이므로 로그만 남김
		console.error("프로필 생성 실패:", profileError);
		// 회원가입은 성공으로 처리
	}

	return result;
};

/**
 * 비밀번호 변경 (Action 전용)
 *
 * Better-auth의 changePassword API를 호출합니다.
 *
 * @param args - 비밀번호 변경 정보
 * @throws Error 변경 실패 시
 */
export const changePasswordWithCurrent = async ({
	request,
	context,
	currentPassword,
	newPassword,
	revokeOtherSessions = true,
}: {
	request: Request;
	context: MiddlewareContext["context"];
	currentPassword: string;
	newPassword: string;
	revokeOtherSessions?: boolean;
}) => {
	const auth = createAuthFromContext(context);
	return await auth.api.changePassword({
		body: { currentPassword, newPassword, revokeOtherSessions },
		headers: request.headers,
	});
};

/**
 * 비밀번호 재설정 요청 (Action 전용)
 *
 * Better-auth의 requestPasswordReset API를 호출합니다.
 *
 * @param args - 비밀번호 찾기 정보
 * @throws Error 요청 실패 시
 */
export const requestPasswordReset = async ({
	request,
	context,
	email,
}: {
	request: Request;
	context: MiddlewareContext["context"];
	email: string;
}) => {
	const auth = createAuthFromContext(context);
	return await auth.api.requestPasswordReset({
		body: { email },
		headers: request.headers,
	});
};

/**
 * 비밀번호 재설정 실행 (Action 전용)
 *
 * Better-auth의 resetPassword API를 호출합니다.
 *
 * @param args - 비밀번호 재설정 정보
 * @throws Error 재설정 실패 시
 */
export const resetPasswordWithToken = async ({
	request,
	context,
	newPassword,
	token,
}: {
	request: Request;
	context: MiddlewareContext["context"];
	newPassword: string;
	token: string;
}) => {
	const auth = createAuthFromContext(context);
	return await auth.api.resetPassword({
		body: { newPassword, token },
		headers: request.headers,
	});
};
