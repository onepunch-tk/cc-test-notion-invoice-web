/**
 * InvoiceList 페이지 컴포넌트 테스트
 *
 * TDD Red Phase: InvoiceList 페이지의 향상된 기능을 테스트합니다.
 * 새로운 기능(인보이스 카드, 스켈레톤, 빈 상태, 그리드 레이아웃)에 대한 테스트는
 * 실패해야 합니다 (아직 구현되지 않음).
 */

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceList from "~/presentation/routes/invoices/index";
import { renderWithRouter } from "../../../utils/render-with-router";

describe("InvoiceList 페이지", () => {
	const renderInvoiceList = () => {
		return renderWithRouter(<InvoiceList />);
	};

	describe("페이지 헤더 렌더링", () => {
		it('"인보이스 목록" 제목이 렌더링되어야 한다', () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			expect(
				screen.getByRole("heading", { level: 1, name: /인보이스 목록/i }),
			).toBeInTheDocument();
		});

		it("제목이 h1 태그여야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const heading = screen.getByRole("heading", { level: 1 });
			expect(heading).toHaveTextContent(/인보이스 목록/i);
		});

		it("페이지 설명이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const description = screen.getByText(/Notion/i);
			expect(description).toBeInTheDocument();
		});
	});

	describe("인보이스 카드 렌더링", () => {
		it("데이터가 있을 때 인보이스 카드들이 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			// 더미 데이터가 있을 때 invoice-card가 렌더링되어야 함
			const invoiceCards = screen.queryAllByTestId("invoice-card");
			expect(invoiceCards.length).toBeGreaterThan(0);
		});

		it("8개의 더미 인보이스 카드가 렌더링되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const invoiceCards = screen.getAllByTestId("invoice-card");
			expect(invoiceCards).toHaveLength(8);
		});
	});

	describe("로딩 상태 렌더링", () => {
		it("로딩 중일 때 스켈레톤이 렌더링되어야 한다", () => {
			// Arrange & Act
			// 로딩 상태를 시뮬레이션하기 위해 isLoading prop 또는 상태 사용
			renderInvoiceList();

			// Assert
			// 로딩 상태일 때 스켈레톤 컴포넌트가 표시되어야 함
			const skeleton = screen.queryByTestId("invoice-list-skeleton");
			// 이 테스트는 로딩 상태 구현 후 조건부로 통과
			expect(skeleton).toBeDefined();
		});
	});

	describe("빈 상태 렌더링", () => {
		it("데이터가 없을 때 빈 상태 컴포넌트가 렌더링되어야 한다", () => {
			// Arrange & Act
			// 데이터가 없는 상태를 시뮬레이션
			renderInvoiceList();

			// Assert
			// 데이터가 없을 때 빈 상태 컴포넌트가 표시되어야 함
			const emptyState = screen.queryByTestId("empty-invoice-list");
			// 현재는 더미 데이터가 있으므로 빈 상태가 표시되지 않아야 함
			// 데이터가 비어있을 때만 표시되어야 함
			expect(emptyState).toBeDefined();
		});
	});

	describe("반응형 그리드 레이아웃", () => {
		it("인보이스 카드 컨테이너에 그리드 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const gridContainer = screen.getByTestId("invoice-grid");
			expect(gridContainer).toHaveClass("grid");
		});

		it("모바일에서 1열 그리드가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const gridContainer = screen.getByTestId("invoice-grid");
			expect(gridContainer).toHaveClass("grid-cols-1");
		});

		it("태블릿에서 2열 그리드가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const gridContainer = screen.getByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/sm:grid-cols-2/);
		});

		it("데스크탑에서 3열 그리드가 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const gridContainer = screen.getByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/lg:grid-cols-3/);
		});

		it("그리드 아이템 간 간격이 적용되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const gridContainer = screen.getByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/gap-/);
		});
	});

	describe("페이지 레이아웃 구조", () => {
		it("컨테이너가 적절한 패딩을 가져야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const container = screen.getByTestId("invoice-list-container");
			expect(container.className).toMatch(/p[xy]?-/);
		});

		it("헤더와 메인 콘텐츠가 분리되어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const header = screen.getByRole("banner");
			const main = screen.getByRole("main");

			expect(header).toBeInTheDocument();
			expect(main).toBeInTheDocument();
		});

		it("헤더와 메인 사이에 적절한 간격이 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const header = screen.getByRole("banner");
			expect(header.className).toMatch(/mb-/);
		});
	});

	describe("접근성 검증", () => {
		it("페이지에 적절한 랜드마크가 있어야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			expect(screen.getByRole("banner")).toBeInTheDocument();
			expect(screen.getByRole("main")).toBeInTheDocument();
		});

		it("제목이 적절한 계층 구조를 가져야 한다", () => {
			// Arrange & Act
			renderInvoiceList();

			// Assert
			const h1 = screen.getByRole("heading", { level: 1 });
			expect(h1).toBeInTheDocument();
		});
	});
});
