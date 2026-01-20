import { Suspense } from "react";
import { Await, Outlet } from "react-router";
import NavigationBar from "~/presentation/components/navigation-bar";
import FooterSection from "~/presentation/components/sections/footer-section";
import { SidebarProvider } from "~/presentation/components/ui/sidebar";
import { getOptionalAuth } from "~/infrastructure/web/middleware";
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
		<SidebarProvider>
			<div className="flex min-h-screen w-full flex-col bg-background">
				<Suspense fallback={<NavigationBar loading={true} />}>
					<Await resolve={user}>
						{(user) =>
							user ? <NavigationBar user={user} /> : <NavigationBar />
						}
					</Await>
				</Suspense>

				<main className="flex-1">
					<Outlet context={{ user }} />
				</main>

				<FooterSection />
			</div>
		</SidebarProvider>
	);
}
