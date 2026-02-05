/**
 * ErrorState 컴포넌트 테스트
 *
 * TDD Red Phase: 아직 구현되지 않은 ErrorState 컴포넌트를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorState from "~/presentation/components/error/error-state";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("ErrorState", () => {
	describe("기본 렌더링 (error variant)", () => {
		it("기본 제목이 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		});

		it("기본 메시지가 표시되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			expect(
				screen.getByText("An unexpected error occurred."),
			).toBeInTheDocument();
		});

		it("AlertCircle 아이콘이 렌더링되어야 한다 (error variant)", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const icon = screen.getByTestId("error-icon");
			expect(icon).toBeInTheDocument();
		});

		it("onRetry 없이 기본 actionLabel은 Go Home이어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState actionHref="/" />);

			// Assert
			const link = screen.getByRole("link", { name: "Go Home" });
			expect(link).toBeInTheDocument();
		});
	});

	describe("warning variant 렌더링", () => {
		it("AlertTriangle 아이콘이 렌더링되어야 한다 (warning variant)", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState variant="warning" />);

			// Assert
			const icon = screen.getByTestId("warning-icon");
			expect(icon).toBeInTheDocument();
		});

		it("warning variant에서는 error-icon이 렌더링되지 않아야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState variant="warning" />);

			// Assert
			expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
		});

		it("error variant에서는 warning-icon이 렌더링되지 않아야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState variant="error" />);

			// Assert
			expect(screen.queryByTestId("warning-icon")).not.toBeInTheDocument();
		});
	});

	describe("onRetry 버튼", () => {
		it("onRetry가 제공되면 버튼이 렌더링되어야 한다", () => {
			// Arrange
			const handleRetry = vi.fn();

			// Act
			renderWithRouter(<ErrorState onRetry={handleRetry} />);

			// Assert
			const button = screen.getByRole("button", { name: "Try Again" });
			expect(button).toBeInTheDocument();
		});

		it("onRetry 버튼 클릭 시 콜백이 호출되어야 한다", async () => {
			// Arrange
			const handleRetry = vi.fn();
			const user = userEvent.setup();
			renderWithRouter(<ErrorState onRetry={handleRetry} />);

			// Act
			const button = screen.getByRole("button", { name: "Try Again" });
			await user.click(button);

			// Assert
			expect(handleRetry).toHaveBeenCalledOnce();
		});

		it("onRetry가 제공되면 기본 actionLabel은 Try Again이어야 한다", () => {
			// Arrange
			const handleRetry = vi.fn();

			// Act
			renderWithRouter(<ErrorState onRetry={handleRetry} />);

			// Assert
			expect(
				screen.getByRole("button", { name: "Try Again" }),
			).toBeInTheDocument();
		});

		it("커스텀 actionLabel이 onRetry 버튼에 적용되어야 한다", () => {
			// Arrange
			const handleRetry = vi.fn();
			const customLabel = "Retry Request";

			// Act
			renderWithRouter(
				<ErrorState onRetry={handleRetry} actionLabel={customLabel} />,
			);

			// Assert
			expect(
				screen.getByRole("button", { name: customLabel }),
			).toBeInTheDocument();
		});
	});

	describe("actionHref 링크", () => {
		it("actionHref가 제공되면 링크가 렌더링되어야 한다", () => {
			// Arrange
			const customHref = "/dashboard";

			// Act
			renderWithRouter(<ErrorState actionHref={customHref} />);

			// Assert
			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", customHref);
		});

		it("actionHref와 actionLabel이 함께 적용되어야 한다", () => {
			// Arrange
			const customHref = "/invoices";
			const customLabel = "Back to Invoices";

			// Act
			renderWithRouter(
				<ErrorState actionHref={customHref} actionLabel={customLabel} />,
			);

			// Assert
			const link = screen.getByRole("link", { name: customLabel });
			expect(link).toHaveAttribute("href", customHref);
		});
	});

	describe("onRetry와 actionHref 동시 제공", () => {
		it("onRetry와 actionHref가 모두 제공되면 두 개의 버튼이 렌더링되어야 한다", () => {
			// Arrange
			const handleRetry = vi.fn();
			const customHref = "/home";

			// Act
			renderWithRouter(
				<ErrorState onRetry={handleRetry} actionHref={customHref} />,
			);

			// Assert
			const button = screen.getByRole("button", { name: "Try Again" });
			const link = screen.getByRole("link", { name: "Go Home" });
			expect(button).toBeInTheDocument();
			expect(link).toBeInTheDocument();
		});

		it("두 버튼이 모두 제대로 동작해야 한다", async () => {
			// Arrange
			const handleRetry = vi.fn();
			const customHref = "/dashboard";
			const user = userEvent.setup();
			renderWithRouter(
				<ErrorState onRetry={handleRetry} actionHref={customHref} />,
			);

			// Act
			const button = screen.getByRole("button", { name: "Try Again" });
			await user.click(button);

			// Assert
			expect(handleRetry).toHaveBeenCalledOnce();
			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", customHref);
		});
	});

	describe("커스텀 props", () => {
		it("커스텀 title이 표시되어야 한다", () => {
			// Arrange
			const customTitle = "Failed to Load Data";

			// Act
			renderWithRouter(<ErrorState title={customTitle} />);

			// Assert
			expect(screen.getByText(customTitle)).toBeInTheDocument();
		});

		it("커스텀 message가 표시되어야 한다", () => {
			// Arrange
			const customMessage = "Unable to connect to the server.";

			// Act
			renderWithRouter(<ErrorState message={customMessage} />);

			// Assert
			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});

		it("모든 커스텀 props가 함께 적용되어야 한다", () => {
			// Arrange
			const handleRetry = vi.fn();
			const customProps = {
				title: "Connection Error",
				message: "Please check your internet connection.",
				onRetry: handleRetry,
				variant: "warning" as const,
			};

			// Act
			renderWithRouter(<ErrorState {...customProps} />);

			// Assert
			expect(screen.getByText(customProps.title)).toBeInTheDocument();
			expect(screen.getByText(customProps.message)).toBeInTheDocument();
			expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Try Again" }),
			).toBeInTheDocument();
		});
	});

	describe("접근성", () => {
		it('role="alert" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const container = screen.getByRole("alert");
			expect(container).toBeInTheDocument();
		});

		it('aria-live="assertive" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const container = screen.getByRole("alert");
			expect(container).toHaveAttribute("aria-live", "assertive");
		});

		it('data-testid="error-state" 속성이 있어야 한다', () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const container = screen.getByTestId("error-state");
			expect(container).toBeInTheDocument();
		});
	});

	describe("아이콘 렌더링", () => {
		it("error variant 아이콘이 SVG를 포함해야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState variant="error" />);

			// Assert
			const icon = screen.getByTestId("error-icon");
			expect(icon.querySelector("svg")).toBeInTheDocument();
		});

		it("warning variant 아이콘이 SVG를 포함해야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState variant="warning" />);

			// Assert
			const icon = screen.getByTestId("warning-icon");
			expect(icon.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("커스텀 className이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-error-class";

			// Act
			renderWithRouter(<ErrorState className={customClassName} />);

			// Assert
			const container = screen.getByTestId("error-state");
			expect(container).toHaveClass(customClassName);
		});

		it("커스텀 className과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "my-custom-error";

			// Act
			renderWithRouter(<ErrorState className={customClassName} />);

			// Assert
			const container = screen.getByTestId("error-state");
			expect(container).toHaveClass(customClassName);
			// 기본 레이아웃 클래스도 유지되어야 함
			expect(container.className).toMatch(/flex|text-center/);
		});
	});

	describe("레이아웃 구조", () => {
		it("컨테이너가 중앙 정렬되어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const container = screen.getByTestId("error-state");
			expect(container.className).toMatch(
				/(items-center|justify-center|text-center)/,
			);
		});

		it("세로 방향 레이아웃이어야 한다", () => {
			// Arrange & Act
			renderWithRouter(<ErrorState />);

			// Assert
			const container = screen.getByTestId("error-state");
			expect(container.className).toMatch(/flex-col/);
		});
	});
});
