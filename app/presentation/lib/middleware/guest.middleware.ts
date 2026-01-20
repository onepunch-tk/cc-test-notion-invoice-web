import { redirect } from "react-router";
import type { MiddlewareContext } from "./auth.middleware";
import { getOptionalAuth } from "./auth.middleware";

/**
 * 게스트 전용 미들웨어
 *
 * 이미 로그인한 사용자를 대시보드로 리다이렉트
 * 로그인/회원가입 페이지 등에서 사용
 *
 * @param args - 미들웨어 컨텍스트
 * @throws redirect - 이미 로그인된 경우 /dashboard로 리다이렉트
 */
export const requireGuest = async ({
	request,
	container,
}: MiddlewareContext): Promise<void> => {
	const user = await getOptionalAuth({ request, container });

	if (user) {
		throw redirect("/dashboard");
	}
};
