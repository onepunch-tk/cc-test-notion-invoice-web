import { redirect } from "react-router";
import type { IUser } from "~/domain/user";
import type { IContainer } from "~/application/shared/container.types";

/**
 * 미들웨어 컨텍스트 타입
 */
export interface MiddlewareContext {
	request: Request;
	container: IContainer;
}

/**
 * 인증 필수 미들웨어
 *
 * 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * 인증된 사용자의 정보를 반환
 *
 * @param args - 미들웨어 컨텍스트
 * @returns 사용자 정보
 * @throws redirect - 인증되지 않은 경우 /auth/signin?redirectTo=원래URL로 리다이렉트
 */
export const requireAuth = async ({
	request,
	container,
}: MiddlewareContext): Promise<IUser> => {
	const user = await container.authService.getCurrentUser(request.headers);

	if (!user) {
		const url = new URL(request.url);
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(`/auth/signin?redirectTo=${redirectTo}`);
	}

	return user;
};

/**
 * 선택적 인증 미들웨어
 *
 * 인증 여부와 상관없이 사용자 정보를 반환
 * 인증된 경우 사용자 정보, 미인증 시 null 반환
 *
 * @param args - 미들웨어 컨텍스트
 * @returns 사용자 정보 또는 null
 */
export const getOptionalAuth = async ({
	request,
	container,
}: MiddlewareContext): Promise<IUser | null> => {
	try {
		const user = await container.authService.getCurrentUser(request.headers);
		return user;
	} catch {
		return null;
	}
};
