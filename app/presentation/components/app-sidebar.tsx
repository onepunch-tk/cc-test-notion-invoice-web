import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "~/presentation/components/ui/sidebar";

/**
 * 메뉴 아이템 정의 (간소화)
 */
const menuItems = [
	{ title: "대시보드", url: "/my/dashboard", icon: LayoutDashboard },
	{ title: "설정", url: "/my/settings", icon: Settings },
];

/**
 * 애플리케이션 사이드바
 * - Dashboard와 Settings 두 개의 핵심 메뉴만 제공
 * - 활성 상태 표시 (정확한 일치)
 */
export const AppSidebar = () => {
	const location = useLocation();

	return (
		<Sidebar collapsible="icon" className="pt-16">
			<SidebarHeader className="pb-0">
				<SidebarTrigger className="hidden md:flex" />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="pt-2">
					<SidebarGroupLabel>애플리케이션</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={location.pathname === item.url}
										tooltip={item.title}
									>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* 모바일에서만 로그아웃 버튼 표시 (md 이상에서는 NavigationBar의 UserMenu 사용) */}
			<SidebarFooter className="md:hidden">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="로그아웃">
							<Link to="/auth/signout">
								<LogOut />
								<span>로그아웃</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
