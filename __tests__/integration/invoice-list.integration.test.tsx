/**
 * Invoice List 통합 테스트
 *
 * Service → Loader → Component → ErrorBoundary 플로우 테스트
 * 기존 단위 테스트(__tests__/presentation/routes/invoices/index.test.tsx)와의 차이점:
 * - 단위 테스트: 컴포넌트에 직접 데이터 전달
 * - 통합 테스트: 실제 loader와 service 레이어를 모킹하여 전체 플로우 검증
 */

import { render, screen, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InvoiceService } from "~/application/invoice/invoice.service";
import { NotionApiError } from "~/application/invoice/errors";
import type { IContainer } from "~/application/shared/container.types";
import { createValidInvoiceData } from "../fixtures/invoice/invoice.fixture";
import InvoiceList, {
	ErrorBoundary,
	loader,
} from "~/presentation/routes/invoices/index";

/**
 * 모킹된 컨테이너 생성 헬퍼
 */
const createMockContext = (invoiceService: Partial<InvoiceService>) => ({
	context: {
		container: {
			invoiceService,
		} as unknown as IContainer,
	},
});

/**
 * loader 호출을 위한 args 생성 헬퍼
 */
const createLoaderArgs = (invoiceService: Partial<InvoiceService>) =>
	createMockContext(invoiceService) as unknown as Parameters<typeof loader>[0];

describe("Invoice List 통합 테스트", () => {
	let mockInvoiceService: Partial<InvoiceService>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockInvoiceService = {
			getInvoiceList: vi.fn(),
		};
	});

	describe("Service → Loader → Component 플로우", () => {
		it("서비스가 여러 인보이스를 반환하면 모든 카드가 렌더링되어야 한다", async () => {
			// Arrange
			const mockInvoices = [
				createValidInvoiceData({
					invoice_id: "inv-001",
					invoice_number: "INV-2024-001",
					client_name: "테스트 회사 A",
					status: "Draft",
					total_amount: 1000000,
					currency: "KRW",
				}),
				createValidInvoiceData({
					invoice_id: "inv-002",
					invoice_number: "INV-2024-002",
					client_name: "테스트 회사 B",
					status: "Sent",
					total_amount: 2000000,
					currency: "USD",
				}),
				createValidInvoiceData({
					invoice_id: "inv-003",
					invoice_number: "INV-2024-003",
					client_name: "테스트 회사 C",
					status: "Paid",
					total_amount: 3000000,
					currency: "KRW",
				}),
			];

			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockResolvedValue(mockInvoices);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			await waitFor(() => {
				const cards = screen.getAllByTestId("invoice-card");
				expect(cards).toHaveLength(3);
			});
		});

		it("서비스가 빈 배열을 반환하면 EmptyInvoiceList가 렌더링되어야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi.fn().mockResolvedValue([]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			expect(
				await screen.findByTestId("empty-invoice-list"),
			).toBeInTheDocument();
		});

		it("서비스가 단일 인보이스를 반환하면 올바른 필드가 표시되어야 한다", async () => {
			// Arrange
			const mockInvoice = createValidInvoiceData({
				invoice_id: "inv-001",
				invoice_number: "INV-2024-001",
				client_name: "테스트 회사",
				status: "Draft",
				total_amount: 1100000,
				currency: "KRW",
			});

			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockResolvedValue([mockInvoice]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			await waitFor(() => {
				expect(screen.getByText("INV-2024-001")).toBeInTheDocument();
				expect(screen.getByText("테스트 회사")).toBeInTheDocument();
				expect(screen.getByText("Draft")).toBeInTheDocument();
			});
		});
	});

	describe("Service → Loader → ErrorBoundary 플로우", () => {
		it("서비스가 일반 Error를 던지면 500 에러로 ErrorBoundary가 렌더링되어야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockRejectedValue(new Error("Database connection failed"));

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					ErrorBoundary: ErrorBoundary,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			expect(await screen.findByTestId("error-state")).toBeInTheDocument();
		});

		it("서비스가 NotionApiError를 던지면 500 에러로 ErrorBoundary가 렌더링되어야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockRejectedValue(
					new NotionApiError("Notion API rate limit exceeded"),
				);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					ErrorBoundary: ErrorBoundary,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			expect(await screen.findByTestId("error-state")).toBeInTheDocument();
		});

		it("ErrorBoundary는 재시도 버튼을 표시해야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockRejectedValue(new Error("Service error"));

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					ErrorBoundary: ErrorBoundary,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			const retryButton = await screen.findByRole("button", {
				name: /Try Again/i,
			});
			expect(retryButton).toBeInTheDocument();
		});

		it("ErrorBoundary는 홈으로 이동 링크를 표시해야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockRejectedValue(new Error("Service error"));

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					ErrorBoundary: ErrorBoundary,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			const homeLink = await screen.findByRole("link", { name: /Go Home/i });
			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveAttribute("href", "/");
		});
	});

	describe("네비게이션", () => {
		it("인보이스 카드는 상세 페이지로 가는 링크를 포함해야 한다", async () => {
			// Arrange
			const mockInvoice = createValidInvoiceData({
				invoice_id: "inv-001",
			});

			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockResolvedValue([mockInvoice]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			const link = await screen.findByRole("link", {
				name: /INV-2024-001/i,
			});
			expect(link).toHaveAttribute("href", "/invoices/inv-001");
		});
	});

	describe("페이지 구조", () => {
		it('h1 제목 "인보이스 목록"이 표시되어야 한다', async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi.fn().mockResolvedValue([]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			const heading = await screen.findByRole("heading", {
				level: 1,
				name: /인보이스 목록/i,
			});
			expect(heading).toBeInTheDocument();
		});

		it("header와 main 랜드마크가 존재해야 한다", async () => {
			// Arrange
			mockInvoiceService.getInvoiceList = vi.fn().mockResolvedValue([]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			await waitFor(() => {
				expect(screen.getByRole("banner")).toBeInTheDocument();
				expect(screen.getByRole("main")).toBeInTheDocument();
			});
		});

		it("반응형 그리드 레이아웃 클래스가 적용되어야 한다", async () => {
			// Arrange
			const mockInvoice = createValidInvoiceData();
			mockInvoiceService.getInvoiceList = vi
				.fn()
				.mockResolvedValue([mockInvoice]);

			const RoutesStub = createRoutesStub([
				{
					path: "/invoices",
					Component: InvoiceList,
					loader: () => loader(createLoaderArgs(mockInvoiceService)),
				},
			]);

			// Act
			render(<RoutesStub initialEntries={["/invoices"]} />);

			// Assert
			const grid = await screen.findByTestId("invoice-grid");
			expect(grid).toHaveClass("grid");
			expect(grid.className).toMatch(/grid-cols-1/);
			expect(grid.className).toMatch(/sm:grid-cols-2/);
			expect(grid.className).toMatch(/lg:grid-cols-3/);
		});
	});
});
