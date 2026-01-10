import { redirect } from "react-router";
import { getOptionalAuth } from "./auth.middleware";

interface MiddlewareContext {
	request: Request;
	context: {
		cloudflare?: {
			env: {
				DATABASE_URL: string;
				BASE_URL: string;
				BETTER_AUTH_SECRET: string;
				GITHUB_CLIENT_ID?: string;
				GITHUB_CLIENT_SECRET?: string;
				GOOGLE_CLIENT_ID?: string;
				GOOGLE_CLIENT_SECRET?: string;
				KAKAO_CLIENT_ID?: string;
				KAKAO_CLIENT_SECRET?: string;
			};
		};
	};
}

/**
 * 게스트 전용 미들웨어
 *
 * 이미 로그인한 사용자를 대시보드로 리다이렉트
 * 로그인/회원가입 페이지 등에서 사용
 *
 * @param args - 미들웨어 컨텍스트
 * @throws redirect - 이미 로그인된 경우 /dashboard로 리다이렉트
 *
 * @example
 * ```tsx
 * export const loader = async ({ request, context }: LoaderFunctionArgs) => {
 *   await requireGuest({ request, context });
 *   return {};
 * };
 * ```
 */
export const requireGuest = async ({
	request,
	context,
}: MiddlewareContext): Promise<void> => {
	const user = await getOptionalAuth({ request, context });

	if (user) {
		throw redirect("/dashboard");
	}
};
