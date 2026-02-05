/**
 * InvoiceList 페이지 컴포넌트 테스트
 *
 * createRoutesStub을 사용하여 loader 데이터와 함께 컴포넌트를 테스트합니다.
 * - loader 데이터로 인보이스 목록 렌더링
 * - 빈 상태 렌더링
 * - ErrorBoundary 테스트
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createRoutesStub } from "react-router";
import type { Invoice } from "~/domain/invoice";
import InvoiceList, {
	ErrorBoundary,
} from "~/presentation/routes/invoices/index";

/**
 * Mock 인보이스 데이터 생성 헬퍼
 */
const createMockInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
	invoice_id: "inv-001",
	invoice_number: "INV-2024-001",
	client_name: "테스트 회사",
	client_email: "test@example.com",
	client_address: "서울시 강남구",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: "Draft",
	subtotal: 1000000,
	tax_rate: 10,
	tax_amount: 100000,
	total_amount: 1100000,
	currency: "KRW",
	notes: "테스트 인보이스",
	created_at: new Date("2024-01-15"),
	...overrides,
});

/**
 * createRoutesStub을 사용한 렌더링 헬퍼
 */
const renderWithLoaderData = (invoices: Invoice[]) => {
	const RoutesStub = createRoutesStub([
		{
			path: "/invoices",
			Component: InvoiceList,
			loader: () => ({ invoices }),
		},
	]);

	return render(<RoutesStub initialEntries={["/invoices"]} />);
};

/**
 * ErrorBoundary 테스트를 위한 렌더링 헬퍼
 */
const renderWithError = (status: number, message: string) => {
	const RoutesStub = createRoutesStub([
		{
			path: "/invoices",
			Component: InvoiceList,
			ErrorBoundary: ErrorBoundary,
			loader: () => {
				throw new Response(message, { status });
			},
		},
	]);

	return render(<RoutesStub initialEntries={["/invoices"]} />);
};

describe("InvoiceList 페이지", () => {
	describe("페이지 헤더 렌더링", () => {
		it('"인보이스 목록" 제목이 렌더링되어야 한다', async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			expect(
				await screen.findByRole("heading", {
					level: 1,
					name: /인보이스 목록/i,
				}),
			).toBeInTheDocument();
		});

		it("제목이 h1 태그여야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const heading = await screen.findByRole("heading", { level: 1 });
			expect(heading).toHaveTextContent(/인보이스 목록/i);
		});

		it("페이지 설명이 렌더링되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const description = await screen.findByText(/Notion/i);
			expect(description).toBeInTheDocument();
		});
	});

	describe("인보이스 카드 렌더링", () => {
		it("데이터가 있을 때 인보이스 카드들이 렌더링되어야 한다", async () => {
			// Arrange
			const mockInvoices = [
				createMockInvoice({ invoice_id: "inv-001" }),
				createMockInvoice({ invoice_id: "inv-002" }),
			];

			// Act
			renderWithLoaderData(mockInvoices);

			// Assert
			await waitFor(() => {
				const invoiceCards = screen.queryAllByTestId("invoice-card");
				expect(invoiceCards.length).toBeGreaterThan(0);
			});
		});

		it("loader에서 반환된 인보이스 수만큼 카드가 렌더링되어야 한다", async () => {
			// Arrange
			const mockInvoices = [
				createMockInvoice({ invoice_id: "inv-001" }),
				createMockInvoice({ invoice_id: "inv-002" }),
				createMockInvoice({ invoice_id: "inv-003" }),
			];

			// Act
			renderWithLoaderData(mockInvoices);

			// Assert
			await waitFor(() => {
				const invoiceCards = screen.getAllByTestId("invoice-card");
				expect(invoiceCards).toHaveLength(3);
			});
		});
	});

	describe("빈 상태 렌더링", () => {
		it("데이터가 없을 때 빈 상태 컴포넌트가 렌더링되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([]);

			// Assert
			const emptyState = await screen.findByTestId("empty-invoice-list");
			expect(emptyState).toBeInTheDocument();
		});

		it("데이터가 없을 때 인보이스 그리드가 렌더링되지 않아야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([]);

			// Assert
			await screen.findByTestId("empty-invoice-list");
			expect(screen.queryByTestId("invoice-grid")).not.toBeInTheDocument();
		});
	});

	describe("반응형 그리드 레이아웃", () => {
		it("인보이스 카드 컨테이너에 그리드 클래스가 적용되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const gridContainer = await screen.findByTestId("invoice-grid");
			expect(gridContainer).toHaveClass("grid");
		});

		it("모바일에서 1열 그리드가 적용되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const gridContainer = await screen.findByTestId("invoice-grid");
			expect(gridContainer).toHaveClass("grid-cols-1");
		});

		it("태블릿에서 2열 그리드가 적용되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const gridContainer = await screen.findByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/sm:grid-cols-2/);
		});

		it("데스크탑에서 3열 그리드가 적용되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const gridContainer = await screen.findByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/lg:grid-cols-3/);
		});

		it("그리드 아이템 간 간격이 적용되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const gridContainer = await screen.findByTestId("invoice-grid");
			expect(gridContainer.className).toMatch(/gap-/);
		});
	});

	describe("페이지 레이아웃 구조", () => {
		it("컨테이너가 적절한 패딩을 가져야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const container = await screen.findByTestId("invoice-list-container");
			expect(container.className).toMatch(/p[xy]?-/);
		});

		it("헤더와 메인 콘텐츠가 분리되어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			await waitFor(() => {
				const header = screen.getByRole("banner");
				const main = screen.getByRole("main");

				expect(header).toBeInTheDocument();
				expect(main).toBeInTheDocument();
			});
		});

		it("헤더와 메인 사이에 적절한 간격이 있어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const header = await screen.findByRole("banner");
			expect(header.className).toMatch(/mb-/);
		});
	});

	describe("접근성 검증", () => {
		it("페이지에 적절한 랜드마크가 있어야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			await waitFor(() => {
				expect(screen.getByRole("banner")).toBeInTheDocument();
				expect(screen.getByRole("main")).toBeInTheDocument();
			});
		});

		it("제목이 적절한 계층 구조를 가져야 한다", async () => {
			// Arrange & Act
			renderWithLoaderData([createMockInvoice()]);

			// Assert
			const h1 = await screen.findByRole("heading", { level: 1 });
			expect(h1).toBeInTheDocument();
		});
	});

	describe("ErrorBoundary 렌더링", () => {
		it("500 에러 시 ErrorState가 렌더링되어야 한다", async () => {
			// Arrange & Act
			renderWithError(500, "Server error");

			// Assert
			const errorState = await screen.findByTestId("error-state");
			expect(errorState).toBeInTheDocument();
		});

		it("에러 상태에서 재시도 버튼이 표시되어야 한다", async () => {
			// Arrange & Act
			renderWithError(500, "Server error");

			// Assert
			const retryButton = await screen.findByRole("button", {
				name: /Try Again/i,
			});
			expect(retryButton).toBeInTheDocument();
		});

		it("에러 상태에서 홈으로 이동 링크가 표시되어야 한다", async () => {
			// Arrange & Act
			renderWithError(500, "Server error");

			// Assert
			const homeLink = await screen.findByRole("link", { name: /Go Home/i });
			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});
});
