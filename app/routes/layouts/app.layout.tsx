import { Outlet, useOutletContext } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import type { User } from "~/db/schema";

/**
 * 앱 레이아웃
 * - Dashboard와 Settings가 공유하는 사이드바 레이아웃
 * - private.layout에서 인증 처리됨
 * - NavigationBar는 전역으로 표시되므로 헤더 불필요
 */
export default function AppLayout() {
	const { user } = useOutletContext<{ user: User }>();

	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<main className="flex-1 p-6">
					<Outlet context={{ user }} />
				</main>
			</div>
		</SidebarProvider>
	);
}
