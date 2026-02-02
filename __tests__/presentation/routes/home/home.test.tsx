import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "~/presentation/routes/home/home";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("Home 페이지", () => {
	const renderHome = () => {
		return renderWithRouter(<Home />);
	};

	it("Invoice-Web을 포함한 환영 헤딩을 렌더링해야 한다", () => {
		// Arrange & Act
		renderHome();

		// Assert
		expect(
			screen.getByRole("heading", { name: /invoice-web/i }),
		).toBeInTheDocument();
	});

	it("Notion, 인보이스, 웹, PDF를 언급하는 서비스 설명을 렌더링해야 한다", () => {
		// Arrange & Act
		renderHome();

		// Assert - 서비스 설명이 모든 키워드를 포함하는지 확인
		const description = screen.getByText(/notion.*인보이스.*웹.*pdf/i);
		expect(description).toBeInTheDocument();
	});

	it("/invoices 페이지로 이동하는 링크가 있어야 한다", () => {
		// Arrange & Act
		renderHome();

		// Assert
		const link = screen.getByRole("link", { name: /인보이스/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/invoices");
	});
});
