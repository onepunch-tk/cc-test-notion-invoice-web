import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { AppSidebar } from "~/presentation/components/app-sidebar";
import { SidebarProvider } from "~/presentation/components/ui/sidebar";

/**
 * AppSidebar를 SidebarProvider와 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithProviders = (initialPath = "/my/dashboard") => {
	const routes = [
		{
			path: "/my/dashboard",
			element: (
				<SidebarProvider>
					<AppSidebar />
				</SidebarProvider>
			),
		},
		{
			path: "/my/settings",
			element: (
				<SidebarProvider>
					<AppSidebar />
				</SidebarProvider>
			),
		},
		{
			path: "/auth/signout",
			element: <div>로그아웃 페이지</div>,
		},
	];

	const router = createMemoryRouter(routes, {
		initialEntries: [initialPath],
	});

	return render(<RouterProvider router={router} />);
};

describe("AppSidebar 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("애플리케이션 그룹 라벨이 렌더링된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			expect(screen.getByText("애플리케이션")).toBeInTheDocument();
		});

		it("사이드바가 렌더링된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			// Sidebar 컴포넌트가 렌더링되었는지 확인
			expect(screen.getByText("애플리케이션")).toBeInTheDocument();
		});
	});

	describe("메뉴 아이템", () => {
		it("대시보드 메뉴가 렌더링된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			expect(screen.getByText("대시보드")).toBeInTheDocument();
		});

		it("대시보드 링크의 href가 /my/dashboard로 설정된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			const dashboardLink = screen.getByRole("link", { name: /대시보드/ });
			expect(dashboardLink).toHaveAttribute("href", "/my/dashboard");
		});

		it("설정 메뉴가 렌더링된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			expect(screen.getByText("설정")).toBeInTheDocument();
		});

		it("설정 링크의 href가 /my/settings로 설정된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/ });
			expect(settingsLink).toHaveAttribute("href", "/my/settings");
		});
	});

	describe("로그아웃 버튼", () => {
		it("로그아웃 메뉴가 렌더링된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			expect(screen.getByText("로그아웃")).toBeInTheDocument();
		});

		it("로그아웃 링크의 href가 /auth/signout으로 설정된다", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			const logoutLink = screen.getByRole("link", { name: /로그아웃/ });
			expect(logoutLink).toHaveAttribute("href", "/auth/signout");
		});
	});

	describe("활성 상태 표시", () => {
		it("대시보드 페이지에서 대시보드 메뉴가 활성화된다", () => {
			// Arrange & Act
			renderWithProviders("/my/dashboard");

			// Assert
			const dashboardLink = screen.getByRole("link", { name: /대시보드/ });
			// SidebarMenuButton의 isActive prop에 따라 data-active 속성이 설정됨
			expect(dashboardLink).toHaveAttribute("data-active", "true");
		});

		it("설정 페이지에서 설정 메뉴가 활성화된다", () => {
			// Arrange & Act
			renderWithProviders("/my/settings");

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/ });
			expect(settingsLink).toHaveAttribute("data-active", "true");
		});

		it("대시보드 페이지에서 설정 메뉴는 비활성화 상태이다", () => {
			// Arrange & Act
			renderWithProviders("/my/dashboard");

			// Assert
			const settingsLink = screen.getByRole("link", { name: /설정/ });
			expect(settingsLink).not.toHaveAttribute("data-active", "true");
		});
	});

	describe("메뉴 개수", () => {
		it("메인 메뉴 2개가 렌더링된다 (대시보드, 설정)", () => {
			// Arrange & Act
			renderWithProviders();

			// Assert
			expect(screen.getByText("대시보드")).toBeInTheDocument();
			expect(screen.getByText("설정")).toBeInTheDocument();
		});
	});
});
