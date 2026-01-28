import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import FooterSection from "~/presentation/components/sections/footer-section";

/**
 * FooterSection을 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithRouter = () => {
	const routes = [
		{
			path: "/",
			element: <FooterSection />,
		},
		{
			path: "/privacy-policy",
			element: <div>개인정보처리방침 페이지</div>,
		},
		{
			path: "/terms",
			element: <div>이용약관 페이지</div>,
		},
		{
			path: "/support",
			element: <div>고객지원 페이지</div>,
		},
		{
			path: "/usage",
			element: <div>사용법 페이지</div>,
		},
	];

	const router = createMemoryRouter(routes, {
		initialEntries: ["/"],
	});

	return render(<RouterProvider router={router} />);
};

describe("FooterSection 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Date를 고정하여 테스트 일관성 유지
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-15"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("저작권 표시", () => {
		it("저작권 텍스트가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(
				screen.getByText(/Claude RR7 Starterkit\. All rights reserved\./),
			).toBeInTheDocument();
		});

		it("현재 연도가 저작권에 표시된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText(/© 2024/)).toBeInTheDocument();
		});
	});

	describe("네비게이션 링크", () => {
		it("개인정보처리방침 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const privacyLink = screen.getByRole("link", {
				name: "개인정보처리방침",
			});
			expect(privacyLink).toBeInTheDocument();
		});

		it("개인정보처리방침 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const privacyLink = screen.getByRole("link", {
				name: "개인정보처리방침",
			});
			expect(privacyLink).toHaveAttribute("href", "/privacy-policy");
		});

		it("이용약관 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const termsLink = screen.getByRole("link", { name: "이용약관" });
			expect(termsLink).toBeInTheDocument();
		});

		it("이용약관 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const termsLink = screen.getByRole("link", { name: "이용약관" });
			expect(termsLink).toHaveAttribute("href", "/terms");
		});

		it("고객지원 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const supportLink = screen.getByRole("link", { name: "고객지원" });
			expect(supportLink).toBeInTheDocument();
		});

		it("고객지원 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const supportLink = screen.getByRole("link", { name: "고객지원" });
			expect(supportLink).toHaveAttribute("href", "/support");
		});

		it("사용법 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const usageLink = screen.getByRole("link", { name: "사용법" });
			expect(usageLink).toBeInTheDocument();
		});

		it("사용법 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const usageLink = screen.getByRole("link", { name: "사용법" });
			expect(usageLink).toHaveAttribute("href", "/usage");
		});
	});

	describe("링크 개수", () => {
		it("4개의 네비게이션 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const links = screen.getAllByRole("link");
			expect(links).toHaveLength(4);
		});
	});

	describe("접근성", () => {
		it("nav 요소가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const navElement = screen.getByRole("navigation");
			expect(navElement).toBeInTheDocument();
		});

		it("footer 요소가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const footerElement = screen.getByRole("contentinfo");
			expect(footerElement).toBeInTheDocument();
		});

		it("모든 링크가 클릭 가능한 상태이다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const links = screen.getAllByRole("link");
			for (const link of links) {
				expect(link).toBeVisible();
			}
		});
	});
});
