import { Suspense } from "react";
import { Await, Outlet } from "react-router";
import FooterSection from "~/components/footer-section";
import NavigationBar from "~/components/navigation-bar";
import { getOptionalAuth } from "~/middleware/auth.middleware";
import type { Route } from "./+types/navgation.layout";

/**
 * 공개 페이지 레이아웃
 *
 * - NavigationBar 포함 (사용자 정보 선택적 표시)
 * - 로그인 상태와 무관하게 접근 가능
 * - 로그인한 사용자는 NavigationBar에 UserMenu 표시
 */
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = await getOptionalAuth({ request, context });
	return { user };
};

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Suspense fallback={<NavigationBar loading={true} />}>
				<Await resolve={user}>
					{(user) => (user ? <NavigationBar user={user} /> : <NavigationBar />)}
				</Await>
			</Suspense>

			<main className="flex-1">
				<Outlet context={{ user }} />
			</main>

			<FooterSection />
		</div>
	);
}
