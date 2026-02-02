import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceList from "~/presentation/routes/invoices/index";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("Invoice List 페이지", () => {
	const renderInvoiceList = () => {
		return renderWithRouter(<InvoiceList />);
	};

	it("인보이스 목록 헤딩을 렌더링해야 한다", () => {
		// Arrange & Act
		renderInvoiceList();

		// Assert
		expect(
			screen.getByRole("heading", { level: 1, name: /인보이스 목록/i }),
		).toBeInTheDocument();
	});

	it("Notion API 연동을 위한 플레이스홀더 메시지를 렌더링해야 한다", () => {
		// Arrange & Act
		renderInvoiceList();

		// Assert
		expect(screen.getByText(/notion api 연동 후 활성화/i)).toBeInTheDocument();
	});
});
