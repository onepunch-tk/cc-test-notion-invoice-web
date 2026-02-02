import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceDetail from "~/presentation/routes/invoices/$invoiceId";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("Invoice Detail 페이지", () => {
	const renderInvoiceDetail = () => {
		return renderWithRouter(<InvoiceDetail />);
	};

	it("인보이스 상세 헤딩을 렌더링해야 한다", () => {
		// Arrange & Act
		renderInvoiceDetail();

		// Assert
		expect(
			screen.getByRole("heading", { level: 1, name: /인보이스 상세/i }),
		).toBeInTheDocument();
	});

	it("params에서 invoiceId를 표시해야 한다", () => {
		// Arrange & Act
		renderInvoiceDetail();

		// Assert
		// invoiceId가 화면에 표시되어야 함 (구현 시 params에서 가져옴)
		expect(screen.getByText(/inv-/i)).toBeInTheDocument();
	});

	it("Notion API 연동을 위한 플레이스홀더 메시지를 렌더링해야 한다", () => {
		// Arrange & Act
		renderInvoiceDetail();

		// Assert
		expect(screen.getByText(/notion api 연동 후 활성화/i)).toBeInTheDocument();
	});

	it("/invoices로 돌아가는 링크가 있어야 한다", () => {
		// Arrange & Act
		renderInvoiceDetail();

		// Assert
		const link = screen.getByRole("link", { name: /목록/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/invoices");
	});
});
