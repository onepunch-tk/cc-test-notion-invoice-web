import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import NavigationBar from "~/presentation/components/navigation-bar";
import { SidebarProvider } from "~/presentation/components/ui/sidebar";
import type { IUser } from "~/domain/user";

/**
 * 테스트용 사용자 데이터
 */
const mockUser: IUser = {
	id: "user-123",
	name: "테스트 사용자",
	email: "test@example.com",
	emailVerified: true,
	image: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

/**
 * NavigationBar를 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithRouter = (
	props: { user?: IUser; loading?: boolean } = {},
	initialPath = "/",
) => {
	const routes = [
		{
			path: "/",
			element: (
				<SidebarProvider>
					<NavigationBar {...props} />
				</SidebarProvider>
			),
		},
		{
			path: "/my/dashboard",
			element: (
				<SidebarProvider>
					<NavigationBar {...props} />
				</SidebarProvider>
			),
		},
		{
			path: "/auth/signin",
			element: <div>로그인 페이지</div>,
		},
		{
			path: "/auth/signup",
			element: <div>회원가입 페이지</div>,
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

describe("NavigationBar 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("로고가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("C")).toBeInTheDocument();
		});

		it("로고 텍스트가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("Claude RR7 Starterkit")).toBeInTheDocument();
		});

		it("로고 클릭 시 홈으로 이동하는 링크가 있다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const logoLink = screen.getByRole("link", {
				name: /Claude RR7 Starterkit/,
			});
			expect(logoLink).toHaveAttribute("href", "/");
		});
	});

	describe("비로그인 상태 (user가 없을 때)", () => {
		it("로그인 버튼이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const loginButton = screen.getByRole("link", { name: "로그인" });
			expect(loginButton).toBeInTheDocument();
		});

		it("로그인 버튼의 href가 /auth/signin으로 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const loginButton = screen.getByRole("link", { name: "로그인" });
			expect(loginButton).toHaveAttribute("href", "/auth/signin");
		});

		it("시작하기 버튼이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const signupButton = screen.getByRole("link", { name: "시작하기" });
			expect(signupButton).toBeInTheDocument();
		});

		it("시작하기 버튼의 href가 /auth/signup으로 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const signupButton = screen.getByRole("link", { name: "시작하기" });
			expect(signupButton).toHaveAttribute("href", "/auth/signup");
		});
	});

	describe("로딩 상태", () => {
		it("로딩 중일 때 스켈레톤이 표시된다", () => {
			// Arrange & Act
			const { container } = renderWithRouter({ loading: true });

			// Assert
			const skeleton = container.querySelector(".animate-pulse");
			expect(skeleton).toBeInTheDocument();
		});

		it("로딩 중일 때 로그인/시작하기 버튼이 표시되지 않는다", () => {
			// Arrange & Act
			renderWithRouter({ loading: true });

			// Assert
			expect(screen.queryByRole("link", { name: "로그인" })).not.toBeInTheDocument();
			expect(screen.queryByRole("link", { name: "시작하기" })).not.toBeInTheDocument();
		});
	});

	describe("로그인 상태 (user가 있을 때)", () => {
		it("사용자 메뉴 버튼이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter({ user: mockUser });

			// Assert
			// UserMenu의 트리거 버튼 확인
			const userButton = screen.getByRole("button");
			expect(userButton).toBeInTheDocument();
		});

		it("로그인/시작하기 버튼이 표시되지 않는다", () => {
			// Arrange & Act
			renderWithRouter({ user: mockUser });

			// Assert
			expect(screen.queryByRole("link", { name: "로그인" })).not.toBeInTheDocument();
			expect(screen.queryByRole("link", { name: "시작하기" })).not.toBeInTheDocument();
		});
	});

	describe("네비게이션 요소", () => {
		it("nav 요소가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const navElement = screen.getByRole("navigation");
			expect(navElement).toBeInTheDocument();
		});

		it("sticky 클래스가 적용되어 있다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const navElement = screen.getByRole("navigation");
			expect(navElement).toHaveClass("sticky");
		});
	});

	describe("접근성", () => {
		it("로고 링크가 클릭 가능한 상태이다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const logoLink = screen.getByRole("link", {
				name: /Claude RR7 Starterkit/,
			});
			expect(logoLink).toBeVisible();
		});

		it("비로그인 상태에서 모든 버튼이 클릭 가능한 상태이다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const loginButton = screen.getByRole("link", { name: "로그인" });
			const signupButton = screen.getByRole("link", { name: "시작하기" });

			expect(loginButton).toBeVisible();
			expect(signupButton).toBeVisible();
		});
	});
});
