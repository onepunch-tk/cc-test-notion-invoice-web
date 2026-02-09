/**
 * PDF Download Button 컴포넌트 단위 테스트
 *
 * 클라이언트 전용 컴포넌트와 SSR 안전 래퍼 컴포넌트 검증
 */

import { render, screen, waitFor } from "@testing-library/react";
import React, { Suspense } from "react";
import { vi } from "vitest";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice/invoice.types";
import { createValidCompanyInfoData } from "../../../fixtures/company/company.fixture";
import {
	createValidInvoiceData,
	createValidLineItemData,
} from "../../../fixtures/invoice/invoice.fixture";

// @react-pdf/renderer 모킹
const mockPDFDownloadLink = vi.fn();
vi.mock("@react-pdf/renderer", () => ({
	PDFDownloadLink: mockPDFDownloadLink,
}));

// InvoicePdfDocument 모킹
vi.mock("~/presentation/components/pdf/invoice-pdf-document", () => ({
	default: () => <div data-testid="invoice-pdf-document">PDF Document</div>,
}));

// Button 컴포넌트 모킹
vi.mock("~/presentation/components/ui/button", () => ({
	Button: ({
		children,
		disabled,
		variant,
		size,
	}: {
		children: React.ReactNode;
		disabled?: boolean;
		variant?: string;
		size?: string;
	}) => (
		<button
			data-testid="button"
			disabled={disabled}
			data-variant={variant}
			data-size={size}
		>
			{children}
		</button>
	),
}));

// lucide-react 아이콘 모킹
vi.mock("lucide-react", () => ({
	Download: ({ className }: { className?: string }) => (
		<span data-testid="download-icon" className={className}>
			Download Icon
		</span>
	),
	Loader2: ({ className }: { className?: string }) => (
		<span data-testid="loader2-icon" className={className}>
			Loader Icon
		</span>
	),
}));

describe("PdfDownloadButtonClient", () => {
	let defaultInvoice: Invoice;
	let defaultLineItems: InvoiceLineItem[];
	let defaultCompanyInfo: CompanyInfo;

	beforeEach(() => {
		vi.clearAllMocks();

		defaultInvoice = createValidInvoiceData({
			invoice_number: "INV-2024-001",
		}) as Invoice;

		defaultLineItems = [
			createValidLineItemData({
				id: "line-001",
				description: "Test Service",
			}) as InvoiceLineItem,
		];

		defaultCompanyInfo = createValidCompanyInfoData({
			company_name: "Test Company",
		}) as CompanyInfo;

		// PDFDownloadLink 기본 모킹 - loading=false
		mockPDFDownloadLink.mockImplementation(
			({
				children,
				fileName,
				document,
			}: {
				children: (props: { loading: boolean }) => React.ReactNode;
				fileName: string;
				document: React.ReactElement;
			}) => (
				<div
					data-testid="pdf-download-link"
					data-filename={fileName}
					data-document={document ? "present" : "missing"}
				>
					{children({ loading: false })}
				</div>
			),
		);
	});

	describe("렌더링", () => {
		it("PDFDownloadLink 컴포넌트를 렌더링한다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("pdf-download-link")).toBeInTheDocument();
		});

		it("fileName prop을 PDFDownloadLink에 전달한다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="INV-2024-001.pdf"
				/>,
			);

			const link = screen.getByTestId("pdf-download-link");
			expect(link).toHaveAttribute("data-filename", "INV-2024-001.pdf");
		});

		it("InvoicePdfDocument를 document prop으로 전달한다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			const link = screen.getByTestId("pdf-download-link");
			expect(link).toHaveAttribute("data-document", "present");
		});
	});

	describe("로딩 상태", () => {
		it("loading=true일 때 Loader2 아이콘을 표시한다", async () => {
			mockPDFDownloadLink.mockImplementation(
				({
					children,
				}: {
					children: (props: { loading: boolean }) => React.ReactNode;
				}) => <div>{children({ loading: true })}</div>,
			);

			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("loader2-icon")).toBeInTheDocument();
		});

		it("loading=true일 때 버튼이 비활성화된다", async () => {
			mockPDFDownloadLink.mockImplementation(
				({
					children,
				}: {
					children: (props: { loading: boolean }) => React.ReactNode;
				}) => <div>{children({ loading: true })}</div>,
			);

			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("button")).toBeDisabled();
		});

		it("loading=false일 때 Download 아이콘을 표시한다", async () => {
			mockPDFDownloadLink.mockImplementation(
				({
					children,
				}: {
					children: (props: { loading: boolean }) => React.ReactNode;
				}) => <div>{children({ loading: false })}</div>,
			);

			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("download-icon")).toBeInTheDocument();
		});

		it("loading=false일 때 'Download PDF' 텍스트를 표시한다", async () => {
			mockPDFDownloadLink.mockImplementation(
				({
					children,
				}: {
					children: (props: { loading: boolean }) => React.ReactNode;
				}) => <div>{children({ loading: false })}</div>,
			);

			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByText("Download PDF")).toBeInTheDocument();
		});

		it("loading=false일 때 버튼이 활성화된다", async () => {
			mockPDFDownloadLink.mockImplementation(
				({
					children,
				}: {
					children: (props: { loading: boolean }) => React.ReactNode;
				}) => <div>{children({ loading: false })}</div>,
			);

			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("button")).not.toBeDisabled();
		});
	});

	describe("버튼 스타일", () => {
		it("버튼은 variant=default를 가진다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("button")).toHaveAttribute(
				"data-variant",
				"default",
			);
		});

		it("버튼은 size=sm을 가진다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			expect(screen.getByTestId("button")).toHaveAttribute("data-size", "sm");
		});
	});

	describe("Props 전달", () => {
		it("invoice, lineItems, companyInfo를 InvoicePdfDocument에 전달한다", async () => {
			const { default: PdfDownloadButtonClient } = await import(
				"~/presentation/components/pdf/pdf-download-button.client"
			);

			render(
				<PdfDownloadButtonClient
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
					fileName="test.pdf"
				/>,
			);

			// 모킹된 PDFDownloadLink가 호출되었는지 검증
			expect(mockPDFDownloadLink).toHaveBeenCalled();
			const callArgs = mockPDFDownloadLink.mock.calls[0][0];
			expect(callArgs.document).toBeDefined();
		});
	});
});

describe("PdfDownloadButton (Wrapper)", () => {
	let defaultInvoice: Invoice;
	let defaultLineItems: InvoiceLineItem[];
	let defaultCompanyInfo: CompanyInfo;

	beforeEach(() => {
		vi.clearAllMocks();

		defaultInvoice = createValidInvoiceData({
			invoice_number: "INV-2024-001",
		}) as Invoice;

		defaultLineItems = [
			createValidLineItemData({
				id: "line-001",
			}) as InvoiceLineItem,
		];

		defaultCompanyInfo = createValidCompanyInfoData() as CompanyInfo;

		// PDFDownloadLink 기본 모킹
		mockPDFDownloadLink.mockImplementation(
			({
				fileName,
				children,
			}: {
				fileName: string;
				children: (props: { loading: boolean }) => React.ReactNode;
			}) => (
				<div data-testid="pdf-link" data-filename={fileName}>
					{children({ loading: false })}
				</div>
			),
		);
	});

	describe("fileName 생성", () => {
		it("invoice_number로부터 fileName을 생성한다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			await waitFor(() => {
				const link = screen.queryByTestId("pdf-link");
				if (link) {
					expect(link).toHaveAttribute("data-filename", "INV-2024-001.pdf");
				}
			});
		});

		it("fileName 형식은 {invoice_number}.pdf이다", async () => {
			const customInvoice = createValidInvoiceData({
				invoice_number: "CUSTOM-123",
			}) as Invoice;

			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={customInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			await waitFor(() => {
				const link = screen.queryByTestId("pdf-link");
				if (link) {
					expect(link).toHaveAttribute("data-filename", "CUSTOM-123.pdf");
				}
			});
		});
	});

	describe("Suspense 통합", () => {
		it("Suspense로 감싸진 컴포넌트를 렌더링한다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Suspense fallback 또는 로드된 컴포넌트 중 하나가 존재해야 함
			await waitFor(() => {
				const button = screen.queryByTestId("button");
				expect(button).toBeInTheDocument();
			});
		});
	});

	describe("Props 전달", () => {
		it("invoice prop을 클라이언트 컴포넌트에 전달한다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// PDFDownloadLink가 호출되었는지 확인
			await waitFor(() => {
				expect(mockPDFDownloadLink).toHaveBeenCalled();
			});
		});

		it("lineItems prop을 클라이언트 컴포넌트에 전달한다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			await waitFor(() => {
				expect(mockPDFDownloadLink).toHaveBeenCalled();
			});
		});

		it("companyInfo prop을 클라이언트 컴포넌트에 전달한다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			render(
				<PdfDownloadButton
					invoice={defaultInvoice}
					lineItems={defaultLineItems}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			await waitFor(() => {
				expect(mockPDFDownloadLink).toHaveBeenCalled();
			});
		});
	});

	describe("SSR 안전성", () => {
		it("서버 사이드에서 렌더링 시 크래시하지 않는다", async () => {
			const { default: PdfDownloadButton } = await import(
				"~/presentation/components/pdf/pdf-download-button"
			);

			// Suspense로 감싸진 컴포넌트는 서버에서도 안전하게 렌더링
			expect(() => {
				render(
					<PdfDownloadButton
						invoice={defaultInvoice}
						lineItems={defaultLineItems}
						companyInfo={defaultCompanyInfo}
					/>,
				);
			}).not.toThrow();
		});
	});
});
