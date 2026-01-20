import { createAuthService } from "~/application/auth/auth.service";
import type { IContainer } from "~/application/shared/container.types";
import { createUserService } from "~/application/user/user.service";
import { createBetterAuth } from "~/infrastructure/external/better-auth/auth.config";
import { createClearSessionHeaders } from "~/infrastructure/external/better-auth/auth.const";
import { createAuthProviderImpl } from "~/infrastructure/external/better-auth/auth.provider.impl";
import { createEmailServiceImpl } from "~/infrastructure/external/resend/email.service.impl";
import { createDrizzleClient } from "~/infrastructure/persistence/drizzle/drizzle.server";
import {
	createProfileRepositoryImpl,
	createUserRepositoryImpl,
} from "~/infrastructure/persistence/drizzle/user.repository.impl";
import type { CloudflareAuthEnv } from "./env";

/**
 * DI Container 생성
 *
 * Composition Root에서 호출되어 모든 의존성을 생성하고 주입합니다.
 * Cloudflare Workers 환경에서는 매 요청마다 새로운 컨테이너가 생성됩니다.
 *
 * @param env - Cloudflare Workers 환경 변수
 * @returns IContainer 인터페이스를 구현하는 컨테이너
 */
export const createContainer = (env: CloudflareAuthEnv): IContainer => {
	// 필수 환경 변수 검증
	if (!env?.DATABASE_URL || !env?.BASE_URL || !env?.BETTER_AUTH_SECRET) {
		throw new Error(
			"필수 환경 변수가 설정되지 않았습니다. " +
				"DATABASE_URL, BASE_URL, BETTER_AUTH_SECRET를 확인하세요.",
		);
	}

	// 1. Infrastructure: DB 클라이언트
	const db = createDrizzleClient(env.DATABASE_URL);

	// 2. Infrastructure: Email Service
	const emailService = createEmailServiceImpl(
		env.RESEND_API_KEY,
		env.RESEND_FROM_EMAIL,
	);

	// 3. Infrastructure: Repositories (Better-auth보다 먼저 생성)
	const userRepository = createUserRepositoryImpl(db);
	const profileRepository = createProfileRepositoryImpl(db);

	// 4. Infrastructure: Better-auth 인스턴스 (profileRepository 주입)
	const betterAuth = createBetterAuth(
		db,
		{
			databaseUrl: env.DATABASE_URL,
			baseURL: env.BASE_URL,
			secret: env.BETTER_AUTH_SECRET,
			githubClientId: env.GITHUB_CLIENT_ID,
			githubClientSecret: env.GITHUB_CLIENT_SECRET,
			googleClientId: env.GOOGLE_CLIENT_ID,
			googleClientSecret: env.GOOGLE_CLIENT_SECRET,
			kakaoClientId: env.KAKAO_CLIENT_ID,
			kakaoClientSecret: env.KAKAO_CLIENT_SECRET,
			resendApiKey: env.RESEND_API_KEY,
			resendFromEmail: env.RESEND_FROM_EMAIL,
		},
		emailService.sendVerificationEmail,
		emailService.sendPasswordResetEmail,
		profileRepository,
	);

	// 5. Infrastructure: Auth Provider
	const authProvider = createAuthProviderImpl(betterAuth);

	// 6. Application: Services
	const userService = createUserService(userRepository, profileRepository);
	const authService = createAuthService(authProvider, userRepository);

	return {
		authService,
		userService,
		emailService,
		betterAuthHandler: (request: Request) => betterAuth.handler(request),
		createClearSessionHeaders,
	};
};

/**
 * CLI/스크립트용 정적 컨테이너 생성
 *
 * 환경 변수를 직접 받아 컨테이너를 생성합니다.
 * Cloudflare Workers 외부에서 사용됩니다.
 */
export const createContainerFromEnv = createContainer;
