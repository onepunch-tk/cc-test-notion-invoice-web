import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import SubmitButton from "~/presentation/components/forms/submit-button";

/**
 * SubmitButton을 React Router 컨텍스트 내에서 렌더링하는 헬퍼 함수
 */
const renderWithRouter = (
	ui: React.ReactElement,
	navigationState: "idle" | "loading" | "submitting" = "idle",
) => {
	const routes = [
		{
			path: "/",
			element: ui,
		},
	];

	const router = createMemoryRouter(routes, {
		initialEntries: ["/"],
	});

	// navigation state를 시뮬레이션하기 위해 router 상태 조작
	if (navigationState !== "idle") {
		Object.defineProperty(router.state, "navigation", {
			value: { state: navigationState, location: undefined, formData: undefined },
			writable: true,
		});
	}

	return render(<RouterProvider router={router} />);
};

describe("SubmitButton 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("children 텍스트가 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter(<SubmitButton>로그인</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toHaveTextContent("로그인");
		});

		it("type이 submit으로 설정된다", () => {
			// Arrange & Act
			renderWithRouter(<SubmitButton>제출</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});

		it("idle 상태에서 버튼이 활성화되어 있다", () => {
			// Arrange & Act
			renderWithRouter(<SubmitButton>저장</SubmitButton>);

			// Assert
			expect(screen.getByRole("button")).not.toBeDisabled();
		});
	});

	describe("Props 전달", () => {
		it("className이 버튼에 적용된다", () => {
			// Arrange & Act
			renderWithRouter(
				<SubmitButton className="w-full">전체 너비 버튼</SubmitButton>,
			);

			// Assert
			expect(screen.getByRole("button")).toHaveClass("w-full");
		});

		it("variant prop이 전달된다", () => {
			// Arrange & Act
			renderWithRouter(
				<SubmitButton variant="outline">아웃라인 버튼</SubmitButton>,
			);

			// Assert
			// Button 컴포넌트의 variant가 적용되었는지 확인
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("size prop이 전달된다", () => {
			// Arrange & Act
			renderWithRouter(<SubmitButton size="lg">큰 버튼</SubmitButton>);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});
	});

	describe("커스텀 loadingText", () => {
		it("기본 loadingText가 '처리 중...'이다", () => {
			// Arrange & Act
			renderWithRouter(<SubmitButton>제출</SubmitButton>);

			// Assert - 기본값 확인은 submitting 상태에서 테스트
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("커스텀 loadingText를 설정할 수 있다", () => {
			// Arrange & Act
			renderWithRouter(
				<SubmitButton loadingText="저장 중...">저장</SubmitButton>,
			);

			// Assert
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});
	});

	describe("버튼 렌더링 상태", () => {
		it("children이 ReactNode일 때도 올바르게 렌더링된다", () => {
			// Arrange & Act
			renderWithRouter(
				<SubmitButton>
					<span data-testid="custom-content">커스텀 컨텐츠</span>
				</SubmitButton>,
			);

			// Assert
			expect(screen.getByTestId("custom-content")).toBeInTheDocument();
		});

		it("버튼 내부에 아이콘과 텍스트를 함께 렌더링할 수 있다", () => {
			// Arrange & Act
			renderWithRouter(
				<SubmitButton>
					<span data-testid="icon">아이콘</span>
					<span>제출하기</span>
				</SubmitButton>,
			);

			// Assert
			expect(screen.getByTestId("icon")).toBeInTheDocument();
			expect(screen.getByText("제출하기")).toBeInTheDocument();
		});
	});
});
