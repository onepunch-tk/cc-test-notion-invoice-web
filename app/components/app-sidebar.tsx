import { LayoutDashboard, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";

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
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>애플리케이션</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={location.pathname === item.url}
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
		</Sidebar>
	);
};
