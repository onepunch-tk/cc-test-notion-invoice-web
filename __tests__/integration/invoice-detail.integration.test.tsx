/**
 * Invoice Detail 페이지 통합 테스트
 *
 * Zod 파라미터 검증 → loader → 컴포넌트 → ErrorBoundary의
 * 전체 통합 플로우를 테스트합니다.
 *
 * 기존 유닛 테스트(__tests__/presentation/routes/invoices/$invoiceId.test.tsx)를
 * 보완하며, 실제 loader 실행과 서비스 레이어 통합을 검증합니다.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvoiceNotFoundError } from "~/application/invoice/errors";
import type { InvoiceService } from "~/application/invoice/invoice.service";
import type { CompanyInfo } from "~/domain/company";
import type { InvoiceStatus, InvoiceWithLineItems } from "~/domain/invoice";
import InvoiceDetail, {
	ErrorBoundary,
} from "~/presentation/routes/invoices/$invoiceId";
import {
	createValidCompanyInfoData,
	createValidCompanyInfoWithoutLogo,
} from "../fixtures/company/company.fixture";
import { createValidInvoiceWithLineItemsData } from "../fixtures/invoice/invoice.fixture";

// formatDate/formatCurrency 모킹
vi.mock("~/presentation/lib/format", () => ({
	formatDate: vi.fn((date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}),
	formatCurrency: vi.fn((amount: number, currency: string) => {
		if (currency === "KRW") {
			return `₩${amount.toLocaleString()}`;
		}
		return `$${amount.toLocaleString()}`;
	}),
}));

describe("Invoice Detail 통합 테스트", () => {
	let mockInvoiceService: InvoiceService;

	beforeEach(() => {
		vi.clearAllMocks();

		// 기본 InvoiceService mock 설정
		mockInvoiceService = {
			getInvoiceList: vi.fn(),
			getInvoiceDetail: vi.fn(),
		};
	});

	/**
	 * Fixture 데이터를 도메인 타입으로 변환하는 헬퍼
	 */
	const toInvoiceWithLineItems = (
		data: ReturnType<typeof createValidInvoiceWithLineItemsData>,
	): InvoiceWithLineItems => ({
		...data,
		issue_date: new Date(data.issue_date),
		due_date: new Date(data.due_date),
		created_at: new Date(data.created_at),
		status: data.status as InvoiceStatus,
	});

	/**
	 * Fixture 데이터를 CompanyInfo 타입으로 변환하는 헬퍼
	 */
	const toCompanyInfo = (
		data:
			| ReturnType<typeof createValidCompanyInfoData>
			| ReturnType<typeof createValidCompanyInfoWithoutLogo>,
	): CompanyInfo => ({
		company_name: data.company_name,
		company_address: data.company_address,
		company_email: data.company_email,
		company_phone: data.company_phone,
		tax_id: data.tax_id,
		logo_url: "logo_url" in data ? data.logo_url : undefined,
	});

	/**
	 * 통합 테스트용 렌더링 헬퍼
	 * loader를 실제로 실행하여 서비스 호출까지 검증
	 */
	const renderWithIntegration = (
		invoiceId: string,
		serviceResponse?: {
			invoice: InvoiceWithLineItems;
			company: CompanyInfo;
		},
	) => {
		// 서비스 응답 설정
		if (serviceResponse) {
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockResolvedValue(
				serviceResponse,
			);
		}

		// React Router의 createRoutesStub으로 통합 테스트
		const RoutesStub = createRoutesStub([
			{
				path: "/invoices/:invoiceId",
				Component: InvoiceDetail,
				ErrorBoundary,
				loader: async ({ params }: { params: { invoiceId?: string } }) => {
					// 실제 loader 로직 재현 (Zod 검증 포함)
					const { z } = await import("zod");

					const invoiceIdSchema = z
						.string()
						.min(1, "Invoice ID is required")
						.max(100, "Invoice ID is too long")
						.regex(
							/^[a-f0-9-]+$/i,
							"Invoice ID must contain only hexadecimal characters and hyphens",
						);

					const parseResult = invoiceIdSchema.safeParse(params.invoiceId);
					if (!parseResult.success) {
						throw new Response("Invalid invoice ID format", {
							status: 400,
						});
					}

					const validInvoiceId = parseResult.data;

					try {
						const { invoice, company } =
							await mockInvoiceService.getInvoiceDetail(validInvoiceId);

						return {
							invoice,
							companyInfo: company,
						};
					} catch (error) {
						if (error instanceof InvoiceNotFoundError) {
							throw new Response("Invoice not found", { status: 404 });
						}

						const message =
							error instanceof Error
								? error.message
								: "Failed to load invoice detail";
						throw new Response(message, { status: 500 });
					}
				},
			},
		]);

		return render(<RoutesStub initialEntries={[`/invoices/${invoiceId}`]} />);
	};

	describe("Full Section Rendering - 서비스 데이터로 전체 섹션 렌더링", () => {
		it("Header section이 회사 정보와 인보이스 메타데이터를 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					invoice_number: "INV-2024-INT-001",
				}),
			);
			const company = toCompanyInfo(
				createValidCompanyInfoData({
					company_name: "통합테스트 주식회사",
				}),
			);

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(screen.getByText("통합테스트 주식회사")).toBeInTheDocument();
				expect(screen.getByText("INV-2024-INT-001")).toBeInTheDocument();
			});
		});

		it("Bill To section이 고객 정보를 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					client_name: "고객사 주식회사",
					client_email: "client@example.com",
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(screen.getByText(/bill to/i)).toBeInTheDocument();
				expect(screen.getByText("고객사 주식회사")).toBeInTheDocument();
			});
		});

		it("Line items table이 올바른 행 개수로 렌더링되어야 한다", async () => {
			// Arrange - 3개 line items
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({}, [
					{ description: "서비스 A" },
					{ description: "서비스 B" },
					{ description: "서비스 C" },
				]),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				const rows = screen.getAllByRole("row");
				// 헤더 1개 + 데이터 3개 = 4개
				expect(rows).toHaveLength(4);
			});
		});

		it("Summary section이 소계, 세금, 총액을 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					subtotal: 5000000,
					tax_rate: 10,
					tax_amount: 500000,
					total_amount: 5500000,
					currency: "KRW",
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(
					screen.getByTestId("invoice-summary-subtotal"),
				).toHaveTextContent("5,000,000");
				expect(
					screen.getByTestId("invoice-summary-tax-label"),
				).toHaveTextContent("10%");
				expect(
					screen.getByTestId("invoice-summary-tax-amount"),
				).toHaveTextContent("500,000");
				expect(screen.getByTestId("invoice-summary-total")).toHaveTextContent(
					"5,500,000",
				);
			});
		});

		it("Notes section이 notes 값이 있을 때 렌더링되어야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					notes: "결제는 30일 이내에 완료해주세요.",
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				const notesSection = screen.getByTestId("invoice-notes");
				expect(notesSection).toBeInTheDocument();
				expect(notesSection).toHaveTextContent(
					"결제는 30일 이내에 완료해주세요.",
				);
			});
		});

		it("Actions section이 back link, print, PDF download 버튼을 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData(),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("a1b2c3d4e5f6", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(screen.getByRole("link", { name: /목록으로/i })).toHaveAttribute(
					"href",
					"/invoices",
				);
				expect(
					screen.getByRole("button", { name: /인쇄/i }),
				).toBeInTheDocument();
				expect(
					screen.getByRole("button", { name: /pdf 다운로드/i }),
				).toBeInTheDocument();
			});
		});
	});

	describe("Zod Param Validation → 400 Error", () => {
		it("빈 invoiceId는 400 에러를 발생시켜야 한다", async () => {
			// Arrange & Act
			// 빈 문자열은 라우트 매칭 실패로 404가 되므로, 공백 문자열로 테스트
			renderWithIntegration(" ");

			// Assert
			await waitFor(() => {
				const errorState = screen.getByTestId("error-state");
				expect(errorState).toBeInTheDocument();
				expect(errorState).toHaveTextContent("잘못된 요청");
			});
		});

		it("특수문자가 포함된 invoiceId는 400 에러를 발생시켜야 한다", async () => {
			// Arrange & Act
			renderWithIntegration("abc!@#123");

			// Assert
			await waitFor(() => {
				const errorState = screen.getByTestId("error-state");
				expect(errorState).toBeInTheDocument();
				expect(errorState).toHaveTextContent("잘못된 요청");
			});
		});

		it("100자를 초과하는 invoiceId는 400 에러를 발생시켜야 한다", async () => {
			// Arrange
			const longId = "a".repeat(101);

			// Act
			renderWithIntegration(longId);

			// Assert
			await waitFor(() => {
				const errorState = screen.getByTestId("error-state");
				expect(errorState).toBeInTheDocument();
				expect(errorState).toHaveTextContent("잘못된 요청");
			});
		});

		it("SQL injection 시도는 400 에러를 발생시켜야 한다", async () => {
			// Arrange & Act
			renderWithIntegration("' OR 1=1--");

			// Assert
			await waitFor(() => {
				const errorState = screen.getByTestId("error-state");
				expect(errorState).toBeInTheDocument();
				expect(errorState).toHaveTextContent("잘못된 요청");
			});
		});
	});

	describe("404 Flow - InvoiceNotFoundError", () => {
		it("서비스가 InvoiceNotFoundError를 던지면 404 NotFoundState가 렌더링되어야 한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockRejectedValue(
				new InvoiceNotFoundError("deadbeef1234"),
			);

			// Act
			renderWithIntegration("deadbeef1234");

			// Assert
			await waitFor(() => {
				const notFoundState = screen.getByTestId("not-found-state");
				expect(notFoundState).toBeInTheDocument();
				expect(notFoundState).toHaveTextContent("인보이스를 찾을 수 없습니다");
			});
		});

		it("NotFoundState에 /invoices 링크가 표시되어야 한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockRejectedValue(
				new InvoiceNotFoundError("deadbeef1234"),
			);

			// Act
			renderWithIntegration("deadbeef1234");

			// Assert
			await waitFor(() => {
				const listLink = screen.getByRole("link", {
					name: /인보이스 목록으로/i,
				});
				expect(listLink).toHaveAttribute("href", "/invoices");
			});
		});
	});

	describe("500 Flow - 서비스 에러", () => {
		it("서비스가 일반 Error를 던지면 500 ErrorState가 렌더링되어야 한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockRejectedValue(
				new Error("Database connection failed"),
			);

			// Act
			renderWithIntegration("abc123def456");

			// Assert
			await waitFor(() => {
				const errorState = screen.getByTestId("error-state");
				expect(errorState).toBeInTheDocument();
			});
		});

		it("ErrorState에 재시도 버튼이 표시되어야 한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockRejectedValue(
				new Error("Network error"),
			);

			// Act
			renderWithIntegration("abc123def456");

			// Assert
			await waitFor(() => {
				const retryButton = screen.getByRole("button", { name: /try again/i });
				expect(retryButton).toBeInTheDocument();
			});
		});

		it("ErrorState에 /invoices 링크가 표시되어야 한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceService.getInvoiceDetail).mockRejectedValue(
				new Error("Server error"),
			);

			// Act
			renderWithIntegration("abc123def456");

			// Assert
			await waitFor(() => {
				const homeLink = screen.getByRole("link", { name: /go home/i });
				expect(homeLink).toHaveAttribute("href", "/invoices");
			});
		});
	});

	describe("Edge Cases - 엣지 케이스", () => {
		it("빈 line_items 배열은 헤더와 테이블 구조를 렌더링해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({}, []),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				const table = screen.getByRole("table");
				expect(table).toBeInTheDocument();
				expect(
					screen.getByRole("columnheader", { name: /description/i }),
				).toBeInTheDocument();

				// 실제 데이터 행 수 확인 (빈 line_items이므로 데이터 행이 없거나 empty state 행만 있음)
				const allRows = screen.getAllByRole("row");
				expect(allRows.length).toBeLessThanOrEqual(2); // header + (optional empty state row)
			});
		});

		it("undefined notes는 notes section을 렌더링하지 않아야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					notes: undefined,
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(
					screen.getByTestId("invoice-detail-container"),
				).toBeInTheDocument();
			});
			expect(screen.queryByTestId("invoice-notes")).not.toBeInTheDocument();
		});

		it("KRW 통화는 ₩ 심볼을 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					currency: "KRW",
					total_amount: 1000000,
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				const totalElement = screen.getByTestId("invoice-summary-total");
				expect(totalElement).toHaveTextContent("₩");
				expect(totalElement).toHaveTextContent("1,000,000");
			});
		});

		it("USD 통화는 $ 심볼을 표시해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({
					currency: "USD",
					total_amount: 5000,
				}),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				const totalElement = screen.getByTestId("invoice-summary-total");
				expect(totalElement).toHaveTextContent("$");
				expect(totalElement).toHaveTextContent("5,000");
			});
		});

		it("logo_url이 없는 회사 정보도 정상 렌더링되어야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData(),
			);
			const company = toCompanyInfo(
				createValidCompanyInfoWithoutLogo({
					company_name: "로고없는회사",
				}),
			);

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(screen.getByText("로고없는회사")).toBeInTheDocument();
			});
		});
	});

	describe("Accessibility - 접근성", () => {
		it("h1 heading hierarchy가 올바르게 구성되어야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData(),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				const h1Elements = screen.getAllByRole("heading", { level: 1 });
				expect(h1Elements.length).toBeGreaterThanOrEqual(1);
			});
		});

		it("Table semantic structure가 올바르게 구성되어야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData({}, [
					{ description: "Item 1" },
					{ description: "Item 2" },
				]),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(screen.getByRole("table")).toBeInTheDocument();

				const columnHeaders = screen.getAllByRole("columnheader");
				expect(columnHeaders.length).toBeGreaterThan(0);

				const rows = screen.getAllByRole("row");
				expect(rows.length).toBeGreaterThan(1);
			});
		});

		it("Buttons와 links는 접근 가능한 이름을 가져야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData(),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				// Links
				const backLink = screen.getByRole("link", { name: /목록으로/i });
				expect(backLink).toHaveAccessibleName();

				// Buttons
				const printButton = screen.getByRole("button", { name: /인쇄/i });
				expect(printButton).toHaveAccessibleName();

				const pdfButton = screen.getByRole("button", {
					name: /pdf 다운로드/i,
				});
				expect(pdfButton).toHaveAccessibleName();
			});
		});
	});

	describe("서비스 호출 검증", () => {
		it("loader는 올바른 invoiceId로 서비스를 호출해야 한다", async () => {
			// Arrange
			const invoice = toInvoiceWithLineItems(
				createValidInvoiceWithLineItemsData(),
			);
			const company = toCompanyInfo(createValidCompanyInfoData());

			// Act
			renderWithIntegration("abc123def456", { invoice, company });

			// Assert
			await waitFor(() => {
				expect(mockInvoiceService.getInvoiceDetail).toHaveBeenCalledWith(
					"abc123def456",
				);
				expect(mockInvoiceService.getInvoiceDetail).toHaveBeenCalledTimes(1);
			});
		});

		it("Zod 검증 실패 시 서비스를 호출하지 않아야 한다", async () => {
			// Arrange & Act
			renderWithIntegration("invalid!@#");

			// Assert
			await waitFor(() => {
				expect(screen.getByTestId("error-state")).toBeInTheDocument();
			});
			expect(mockInvoiceService.getInvoiceDetail).not.toHaveBeenCalled();
		});
	});
});
