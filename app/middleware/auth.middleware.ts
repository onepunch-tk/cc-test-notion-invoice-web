import { redirect } from "react-router";
import type { User } from "~/db/schema";
import {
	createAuthFromContext,
	type MiddlewareContext,
} from "~/lib/auth-helpers.server";

/**
 * 인증 필수 미들웨어
 *
 * 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * 인증된 사용자의 정보를 반환
 *
 * @param args - 미들웨어 컨텍스트
 * @returns 사용자 정보
 * @throws redirect - 인증되지 않은 경우 /auth/login으로 리다이렉트
 *
 * @example
 * ```tsx
 * export const loader = async ({ request, context }: LoaderFunctionArgs) => {
 *   const user = await requireAuth({ request, context });
 *   return { user };
 * };
 * ```
 */
export const requireAuth = async ({
	request,
	context,
}: MiddlewareContext): Promise<User> => {
	const auth = createAuthFromContext(context);
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		const url = new URL(request.url);
		const redirectTo = url.pathname + url.search;
		throw redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	return session.user as User;
};

/**
 * 선택적 인증 미들웨어
 *
 * 인증 여부와 상관없이 사용자 정보를 반환
 * 인증된 경우 사용자 정보, 미인증 시 null 반환
 *
 * @param args - 미들웨어 컨텍스트
 * @returns 사용자 정보 또는 null
 *
 * @example
 * ```tsx
 * export const loader = async ({ request, context }: LoaderFunctionArgs) => {
 *   const user = await getOptionalAuth({ request, context });
 *   return { user };
 * };
 * ```
 */
export const getOptionalAuth = async ({
	request,
	context,
}: MiddlewareContext): Promise<User | null> => {
	try {
		const auth = createAuthFromContext(context);
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user) {
			return null;
		}

		return session.user as User;
	} catch {
		return null;
	}
};
