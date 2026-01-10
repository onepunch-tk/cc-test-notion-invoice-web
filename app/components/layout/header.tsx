import { Form } from "react-router";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/db/schema";

interface HeaderProps {
	user: User;
}

/**
 * 애플리케이션 헤더
 * - 사이드바 토글
 * - 사용자 메뉴 (프로필, 로그아웃)
 */
export const Header = ({ user }: HeaderProps) => {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
			<SidebarTrigger>
				<Menu className="h-5 w-5" />
			</SidebarTrigger>
			<div className="flex-1" />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="rounded-full">
						<UserIcon className="h-5 w-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						<div className="flex flex-col">
							<span className="font-medium">{user.email}</span>
							<span className="text-xs text-muted-foreground">
								{user.name ?? "사용자"}
							</span>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Form method="post" action="/auth/logout">
							<button type="submit" className="flex w-full items-center">
								<LogOut className="mr-2 h-4 w-4" />
								로그아웃
							</button>
						</Form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};
