import { Outlet, useOutletContext } from "react-router";
import type { IUser } from "~/domain/user";
import { AppSidebar } from "~/presentation/components/app-sidebar";

/**
 * 앱 레이아웃
 * - Dashboard와 Settings가 공유하는 사이드바 레이아웃
 * - private.layout에서 인증 처리됨
 * - SidebarProvider는 navigation.layout에서 제공
 * - 모바일 토글 버튼은 NavigationBar에 통합
 */
export default function AppLayout() {
	const { user } = useOutletContext<{ user: IUser }>();

	return (
		<div className="flex min-h-screen w-full pt-16">
			<AppSidebar />
			<main className="flex-1 p-6">
				<Outlet context={{ user }} />
			</main>
		</div>
	);
}
