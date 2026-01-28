import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { NotFound } from "~/presentation/components/not-found";

/**
 * NotFound 컴포넌트를 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithRouter = (initialPath = "/not-found") => {
	const routes = [
		{
			path: "/",
			element: <div>홈 페이지</div>,
		},
		{
			path: "/not-found",
			element: <NotFound />,
		},
	];

	const router = createMemoryRouter(routes, {
		initialEntries: [initialPath],
	});

	return render(<RouterProvider router={router} />);
};

describe("NotFound 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("404 텍스트가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(screen.getByText("404")).toBeInTheDocument();
		});

		it("페이지를 찾을 수 없다는 메시지가 표시된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(
				screen.getByText("페이지를 찾을 수 없습니다"),
			).toBeInTheDocument();
		});

		it("안내 문구가 표시된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			expect(
				screen.getByText(
					"요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 주소를 다시 확인해주세요.",
				),
			).toBeInTheDocument();
		});
	});

	describe("홈으로 돌아가기 링크", () => {
		it("홈으로 돌아가기 링크가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const homeLink = screen.getByRole("link", { name: "홈으로 돌아가기" });
			expect(homeLink).toBeInTheDocument();
		});

		it("홈으로 돌아가기 링크의 href가 /로 설정된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const homeLink = screen.getByRole("link", { name: "홈으로 돌아가기" });
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});

	describe("스타일링", () => {
		it("404 텍스트에 적절한 스타일 클래스가 적용된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const notFoundText = screen.getByText("404");
			expect(notFoundText).toHaveClass("text-9xl");
			expect(notFoundText).toHaveClass("font-black");
		});

		it("제목에 적절한 스타일 클래스가 적용된다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const heading = screen.getByRole("heading", {
				name: "페이지를 찾을 수 없습니다",
			});
			expect(heading).toHaveClass("text-2xl");
			expect(heading).toHaveClass("font-bold");
		});
	});

	describe("접근성", () => {
		it("적절한 heading 계층 구조를 가진다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const headings = screen.getAllByRole("heading");
			expect(headings.length).toBeGreaterThanOrEqual(1);
		});

		it("링크가 클릭 가능한 상태이다", () => {
			// Arrange & Act
			renderWithRouter();

			// Assert
			const homeLink = screen.getByRole("link", { name: "홈으로 돌아가기" });
			expect(homeLink).toBeVisible();
		});
	});
});
