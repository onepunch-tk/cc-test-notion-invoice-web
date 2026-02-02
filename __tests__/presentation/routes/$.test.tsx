import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CatchAll from "~/presentation/routes/$";
import { renderWithRouter } from "../../utils/render-with-router";

describe("404 Catch-all 라우트", () => {
	const renderCatchAll = () => {
		return renderWithRouter(<CatchAll />);
	};

	it("NotFound 컴포넌트를 렌더링해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(screen.getByText(/404/i)).toBeInTheDocument();
	});

	it("404 메시지를 표시해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(screen.getByText(/찾을 수 없습니다/i)).toBeInTheDocument();
	});

	it("인보이스를 찾을 수 없다는 메시지를 표시해야 한다", () => {
		// Arrange & Act
		renderCatchAll();

		// Assert
		expect(
			screen.getByText(/인보이스를 찾을 수 없습니다/i),
		).toBeInTheDocument();
	});
});
