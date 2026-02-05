import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CatchAll from "~/presentation/routes/$";
import { renderWithRouter } from "../../utils/render-with-router";

describe("404 Catch-all 라우트", () => {
	const renderCatchAll = () => {
		return renderWithRouter(<CatchAll />);
	};

	it("NotFoundState 컴포넌트를 렌더링해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(screen.getByText(/404/i)).toBeInTheDocument();
	});

	it("404 제목을 표시해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(screen.getByText("Page Not Found")).toBeInTheDocument();
	});

	it("페이지를 찾을 수 없다는 메시지를 표시해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(
			screen.getByText("The page you're looking for doesn't exist."),
		).toBeInTheDocument();
	});

	it("인보이스 목록 링크가 있어야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		const link = screen.getByRole("link", { name: "Go to Invoice List" });
		expect(link).toHaveAttribute("href", "/invoices");
	});
});
