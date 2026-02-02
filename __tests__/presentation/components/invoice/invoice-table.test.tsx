/**
 * InvoiceTable 컴포넌트 단위 테스트
 *
 * TDD Red 단계: 실패하는 테스트 작성
 */

import { render, screen, within } from "@testing-library/react";
import type { InvoiceLineItem } from "~/domain/invoice/invoice.types";
// 컴포넌트 import (아직 존재하지 않음 - Red 단계)
import InvoiceTable from "~/presentation/components/invoice/invoice-table";
import { formatCurrency } from "~/presentation/lib/format";
import { createValidLineItemData } from "../../../fixtures/invoice/invoice.fixture";

describe("InvoiceTable", () => {
	describe("테이블 헤더 렌더링", () => {
		it("테이블 헤더가 올바르게 렌더링된다 (Description, Qty, Unit Price, Total)", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [];

			// Act
			render(<InvoiceTable lineItems={lineItems} />);

			// Assert
			expect(
				screen.getByRole("columnheader", { name: /description/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /qty/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /unit price/i }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("columnheader", { name: /total/i }),
			).toBeInTheDocument();
		});
	});

	describe("라인 아이템 렌더링", () => {
		it("라인 아이템이 sort_order 순서대로 정렬되어 렌더링된다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [
				createValidLineItemData({
					id: "line-003",
					description: "Third Item",
					sort_order: 3,
				}),
				createValidLineItemData({
					id: "line-001",
					description: "First Item",
					sort_order: 1,
				}),
				createValidLineItemData({
					id: "line-002",
					description: "Second Item",
					sort_order: 2,
				}),
			];

			// Act
			render(<InvoiceTable lineItems={lineItems} />);

			// Assert
			const rows = screen.getAllByRole("row");
			// 첫 번째 row는 헤더이므로 제외
			const dataRows = rows.slice(1);

			expect(dataRows).toHaveLength(3);
			expect(within(dataRows[0]).getByText("First Item")).toBeInTheDocument();
			expect(within(dataRows[1]).getByText("Second Item")).toBeInTheDocument();
			expect(within(dataRows[2]).getByText("Third Item")).toBeInTheDocument();
		});

		it("여러 개의 라인 아이템이 올바르게 렌더링된다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [
				createValidLineItemData({
					id: "line-001",
					description: "Web Development",
					quantity: 10,
					unit_price: 50000,
					line_total: 500000,
					sort_order: 1,
				}),
				createValidLineItemData({
					id: "line-002",
					description: "Design Service",
					quantity: 5,
					unit_price: 30000,
					line_total: 150000,
					sort_order: 2,
				}),
			];

			// Act
			render(<InvoiceTable lineItems={lineItems} />);

			// Assert
			expect(screen.getByText("Web Development")).toBeInTheDocument();
			expect(screen.getByText("Design Service")).toBeInTheDocument();
			expect(screen.getByText("10")).toBeInTheDocument();
			expect(screen.getByText("5")).toBeInTheDocument();
		});
	});

	describe("빈 상태 처리", () => {
		it("lineItems가 비어있을 때 빈 상태 메시지를 표시한다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [];

			// Act
			render(<InvoiceTable lineItems={lineItems} />);

			// Assert
			expect(screen.getByText(/no items/i)).toBeInTheDocument();
		});
	});

	describe("통화 포맷팅", () => {
		it("unit_price와 line_total이 올바른 통화 형식으로 포맷팅된다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [
				createValidLineItemData({
					id: "line-001",
					unit_price: 50000,
					line_total: 100000,
					sort_order: 1,
				}),
			];

			// Act
			render(<InvoiceTable lineItems={lineItems} />);

			// Assert
			// 기본 통화는 KRW
			const expectedUnitPrice = formatCurrency(50000, "KRW");
			const expectedLineTotal = formatCurrency(100000, "KRW");

			expect(screen.getByText(expectedUnitPrice)).toBeInTheDocument();
			expect(screen.getByText(expectedLineTotal)).toBeInTheDocument();
		});

		it("currency prop이 전달되면 해당 통화 형식으로 포맷팅된다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [
				createValidLineItemData({
					id: "line-001",
					unit_price: 100,
					line_total: 200,
					sort_order: 1,
				}),
			];

			// Act
			render(<InvoiceTable lineItems={lineItems} currency="USD" />);

			// Assert
			const expectedUnitPrice = formatCurrency(100, "USD");
			const expectedLineTotal = formatCurrency(200, "USD");

			expect(screen.getByText(expectedUnitPrice)).toBeInTheDocument();
			expect(screen.getByText(expectedLineTotal)).toBeInTheDocument();
		});
	});

	describe("className 적용", () => {
		it("className prop이 전달되면 테이블 컨테이너에 적용된다", () => {
			// Arrange
			const lineItems: InvoiceLineItem[] = [];
			const customClassName = "custom-invoice-table";

			// Act
			const { container } = render(
				<InvoiceTable lineItems={lineItems} className={customClassName} />,
			);

			// Assert
			const tableContainer = container.firstChild;
			expect(tableContainer).toHaveClass(customClassName);
		});
	});
});
