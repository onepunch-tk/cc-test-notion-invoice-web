import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import HeroSection from "~/presentation/components/sections/hero-section";

/**
 * HeroSection을 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithRouter = () => {
	const routes = [
		{
			path: "/",
			element: <HeroSection />,
		},
		{
			path: "/auth/signup",
			element: <div>회원가입 페이지</div>,
		},
		{
			path: "/auth/signin",
			element: <div>로그인 페이지</div>,
		},
	];

	const router = createMemoryRouter(routes, {
		initialEntries: ["/"],
	});

	return render(<RouterProvider router={router} />);
};

describe("HeroSection 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("배지 텍스트가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(
				screen.getByText("React Router v7 + Supabase + Drizzle ORM"),
			).toBeInTheDocument();
		});

		it("메인 타이틀이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("빠르고 현대적인")).toBeInTheDocument();
			expect(screen.getByText("풀스택 웹 개발")).toBeInTheDocument();
		});

		it("서브타이틀이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(
				screen.getByText(/React Router v7, Supabase, Drizzle ORM, Tailwind CSS로 구축된/),
			).toBeInTheDocument();
		});
	});

	describe("CTA 버튼", () => {
		it("시작하기 버튼이 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const startButton = screen.getByRole("link", { name: /시작하기/ });
			expect(startButton).toBeInTheDocument();
		});

		it("시작하기 버튼의 href가 /auth/signup으로 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const startButton = screen.getByRole("link", { name: /시작하기/ });
			expect(startButton).toHaveAttribute("href", "/auth/signup");
		});

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
	});

	describe("기술 스택 태그", () => {
		it("TypeScript 태그가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("TypeScript")).toBeInTheDocument();
		});

		it("React 19 태그가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("React 19")).toBeInTheDocument();
		});

		it("Tailwind CSS v4 태그가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("Tailwind CSS v4")).toBeInTheDocument();
		});

		it("shadcn/ui v3 태그가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("shadcn/ui v3")).toBeInTheDocument();
		});

		it("Cloudflare Workers 태그가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("Cloudflare Workers")).toBeInTheDocument();
		});
	});

	describe("접근성", () => {
		it("메인 타이틀이 h1 태그로 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const heading = screen.getByRole("heading", { level: 1 });
			expect(heading).toBeInTheDocument();
		});

		it("CTA 버튼들이 클릭 가능한 상태이다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const startButton = screen.getByRole("link", { name: /시작하기/ });
			const loginButton = screen.getByRole("link", { name: "로그인" });

			expect(startButton).toBeVisible();
			expect(loginButton).toBeVisible();
		});
	});
});
