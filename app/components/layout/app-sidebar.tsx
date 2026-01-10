import { Link, useLocation } from "react-router";
import { Home, Users, Settings, LayoutDashboard } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * 메뉴 아이템 정의
 */
const menuItems = [
	{ title: "대시보드", url: "/dashboard", icon: LayoutDashboard },
	{ title: "홈", url: "/dashboard/home", icon: Home },
	{ title: "사용자", url: "/dashboard/users", icon: Users },
	{ title: "설정", url: "/dashboard/settings", icon: Settings },
];

/**
 * 애플리케이션 사이드바
 * - 네비게이션 메뉴
 * - 활성 상태 표시
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
