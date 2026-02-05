/**
 * NotFoundState 컴포넌트 테스트
 *
 * TDD Red Phase: 아직 구현되지 않은 NotFoundState 컴포넌트를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFoundState from "~/presentation/components/error/not-found-state";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("NotFoundState", () => {
	describe("기본 렌더링", () => {
		it("404 텍스트가 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			expect(screen.getByText("404")).toBeInTheDocument();
		});

		it("FileQuestion 아이콘이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const icon = screen.getByTestId("not-found-icon");
			expect(icon).toBeInTheDocument();
		});

		it("기본 제목이 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			expect(screen.getByText("Page Not Found")).toBeInTheDocument();
		});

		it("기본 메시지가 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			expect(
				screen.getByText("The page you're looking for doesn't exist."),
			).toBeInTheDocument();
		});

		it("기본 액션 버튼이 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const link = screen.getByRole("link", { name: "Go to Invoice List" });
			expect(link).toBeInTheDocument();
		});

		it("기본 액션 버튼이 /invoices 경로로 연결되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const link = screen.getByRole("link", { name: "Go to Invoice List" });
			expect(link).toHaveAttribute("href", "/invoices");
		});
	});

	describe("커스텀 props 렌더링", () => {
		it("커스텀 title이 표시되어야 한다", () => {
			// Arrange
			const customTitle = "Invoice Not Found";

			// Act
			renderWithRouter(<NotFoundState title={customTitle} />);

			// Assert
			expect(screen.getByText(customTitle)).toBeInTheDocument();
		});

		it("커스텀 message가 표시되어야 한다", () => {
			// Arrange
			const customMessage = "The invoice you are looking for does not exist.";

			// Act
			renderWithRouter(<NotFoundState message={customMessage} />);

			// Assert
			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});

		it("커스텀 actionLabel이 표시되어야 한다", () => {
			// Arrange
			const customActionLabel = "Return Home";

			// Act
			renderWithRouter(<NotFoundState actionLabel={customActionLabel} />);

			// Assert
			expect(
				screen.getByRole("link", { name: customActionLabel }),
			).toBeInTheDocument();
		});

		it("커스텀 actionHref가 적용되어야 한다", () => {
			// Arrange
			const customHref = "/dashboard";

			// Act
			renderWithRouter(<NotFoundState actionHref={customHref} />);

			// Assert
			const link = screen.getByRole("link", { name: "Go to Invoice List" });
			expect(link).toHaveAttribute("href", customHref);
		});

		it("모든 커스텀 props가 함께 적용되어야 한다", () => {
			// Arrange
			const customProps = {
				title: "Resource Not Found",
				message: "This resource has been moved or deleted.",
				actionLabel: "Go Back",
				actionHref: "/home",
			};

			// Act
			renderWithRouter(<NotFoundState {...customProps} />);

			// Assert
			expect(screen.getByText(customProps.title)).toBeInTheDocument();
			expect(screen.getByText(customProps.message)).toBeInTheDocument();
			const link = screen.getByRole("link", { name: customProps.actionLabel });
			expect(link).toHaveAttribute("href", customProps.actionHref);
		});
	});

	describe("접근성", () => {
		it('role="status" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const container = screen.getByRole("status");
			expect(container).toBeInTheDocument();
		});

		it('aria-live="polite" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const container = screen.getByRole("status");
			expect(container).toHaveAttribute("aria-live", "polite");
		});

		it('data-testid="not-found-state" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const container = screen.getByTestId("not-found-state");
			expect(container).toBeInTheDocument();
		});
	});

	describe("아이콘 렌더링", () => {
		it('아이콘에 data-testid="not-found-icon" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const icon = screen.getByTestId("not-found-icon");
			expect(icon).toBeInTheDocument();
		});

		it("아이콘이 SVG를 포함해야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const icon = screen.getByTestId("not-found-icon");
			expect(icon.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("커스텀 className이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-not-found-class";

			// Act
			renderWithRouter(<NotFoundState className={customClassName} />);

			// Assert
			const container = screen.getByTestId("not-found-state");
			expect(container).toHaveClass(customClassName);
		});

		it("커스텀 className과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "my-custom-class";

			// Act
			renderWithRouter(<NotFoundState className={customClassName} />);

			// Assert
			const container = screen.getByTestId("not-found-state");
			expect(container).toHaveClass(customClassName);
			// 기본 레이아웃 클래스도 유지되어야 함
			expect(container.className).toMatch(/flex|text-center/);
		});
	});

	describe("레이아웃 구조", () => {
		it("컨테이너가 중앙 정렬되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const container = screen.getByTestId("not-found-state");
			expect(container.className).toMatch(
				/(items-center|justify-center|text-center)/,
			);
		});

		it("세로 방향 레이아웃이어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<NotFoundState />);

			// Assert
			const container = screen.getByTestId("not-found-state");
			expect(container.className).toMatch(/flex-col/);
		});
	});
});
