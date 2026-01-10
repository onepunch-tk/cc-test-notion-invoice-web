import { Outlet } from "react-router";
import { requireAuth } from "@/middleware/auth.middleware";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Route } from "./+types/layout";

/**
 * 대시보드 레이아웃
 * - 인증 필수
 * - 사이드바 + 헤더 + 메인 컨텐츠 구조
 */
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = await requireAuth({ request, context });
	return { user };
};

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<div className="flex flex-1 flex-col">
					<Header user={loaderData.user} />
					<main className="flex-1 p-6">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
