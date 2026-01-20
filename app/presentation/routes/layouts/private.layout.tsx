import { Outlet } from "react-router";
import { requireAuth } from "~/infrastructure/web/middleware";
import type { Route } from "./+types/private.layout";

/**
 * 인증 필수 레이아웃
 *
 * - 모든 하위 라우트에 대해 requireAuth 미들웨어 적용
 * - UI는 제공하지 않으므로 실제 UI는 하위 레이아웃에서 담당
 * - user context를 통해 인증된 사용자 정보 전달
 */
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = await requireAuth({ request, context });
	return { user };
};

export default function PrivateLayout({ loaderData }: Route.ComponentProps) {
	return <Outlet context={{ user: loaderData.user }} />;
}
