import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createAuthInstance } from "./auth.server";

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
 *
 * @example
 * ```tsx
 * const env = extractAuthEnv(context);
 * console.log(env.DATABASE_URL);
 * ```
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
 *
 * @example
 * ```tsx
 * const auth = createAuthFromContext(context);
 * const session = await auth.api.getSession({ headers: request.headers });
 * ```
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
 *
 * @example
 * ```tsx
 * export const action = async ({ request, context }: ActionFunctionArgs) => {
 *   await signOut({ request, context });
 *   return redirect("/");
 * };
 * ```
 */
export const signOut = async ({ request, context }: MiddlewareContext) => {
	const auth = createAuthFromContext(context);
	await auth.api.signOut({ headers: request.headers });
};
