/**
 * InvoiceHeader 컴포넌트 단위 테스트
 *
 * TDD Red 단계 - 컴포넌트 구현 전 실패하는 테스트 작성
 */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice } from "~/domain/invoice/invoice.types";
import {
	createValidCompanyInfoData,
	createValidCompanyInfoWithoutLogo,
} from "../../../fixtures/company/company.fixture";
import {
	createValidInvoiceData,
	INVOICE_STATUS,
} from "../../../fixtures/invoice/invoice.fixture";

// formatDate 함수 모킹
vi.mock("~/presentation/lib/format", () => ({
	formatDate: vi.fn((date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}),
}));

// 테스트 대상 컴포넌트 - 아직 구현되지 않음
import InvoiceHeader from "~/presentation/components/invoice/invoice-header";

describe("InvoiceHeader", () => {
	// 테스트 데이터
	let defaultInvoice: Invoice;
	let defaultCompanyInfo: CompanyInfo;
	let companyInfoWithoutLogo: CompanyInfo;

	beforeEach(() => {
		vi.clearAllMocks();

		// Arrange - 기본 테스트 데이터 설정
		defaultInvoice = createValidInvoiceData({
			invoice_number: "INV-2024-001",
			issue_date: new Date("2024-01-15"),
			due_date: new Date("2024-02-15"),
			client_name: "Test Client",
			client_address: "123 Test Street, Test City",
			client_email: "client@example.com",
			status: INVOICE_STATUS.DRAFT,
		}) as Invoice;

		defaultCompanyInfo = createValidCompanyInfoData({
			company_name: "Test Company Inc.",
			company_address: "456 Business Ave, Corporate City",
			company_email: "contact@testcompany.com",
			company_phone: "+1-555-123-4567",
			logo_url: "https://example.com/logo.png",
		}) as CompanyInfo;

		companyInfoWithoutLogo = createValidCompanyInfoWithoutLogo({
			company_name: "No Logo Company",
			company_address: "789 Plain Street",
			company_email: "info@nologocompany.com",
			company_phone: "+1-555-987-6543",
		}) as CompanyInfo;
	});

	describe("회사 정보 렌더링", () => {
		it("회사 이름과 주소를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText("Test Company Inc.")).toBeInTheDocument();
			expect(
				screen.getByText("456 Business Ave, Corporate City"),
			).toBeInTheDocument();
		});

		it("회사 이메일과 전화번호를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText("contact@testcompany.com")).toBeInTheDocument();
			expect(screen.getByText("+1-555-123-4567")).toBeInTheDocument();
		});

		it("logo_url이 제공되면 회사 로고를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			const logo = screen.getByRole("img", { name: /test company inc/i });
			expect(logo).toBeInTheDocument();
			expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
		});

		it("logo_url이 undefined이면 로고를 렌더링하지 않는다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={companyInfoWithoutLogo}
				/>,
			);

			// Assert
			expect(
				screen.queryByRole("img", { name: /no logo company/i }),
			).not.toBeInTheDocument();
		});
	});

	describe("인보이스 메타 정보 렌더링", () => {
		it("인보이스 번호를 올바르게 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText("INV-2024-001")).toBeInTheDocument();
		});

		it("포맷팅된 issue_date를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			// formatDate 모킹으로 인해 "2024-01-15" 형식으로 표시됨
			expect(screen.getByText("2024-01-15")).toBeInTheDocument();
		});

		it("포맷팅된 due_date를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			// formatDate 모킹으로 인해 "2024-02-15" 형식으로 표시됨
			expect(screen.getByText("2024-02-15")).toBeInTheDocument();
		});
	});

	describe("고객 정보 렌더링 (Bill To 섹션)", () => {
		it("Bill To 섹션 제목을 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText(/bill to/i)).toBeInTheDocument();
		});

		it("고객 이름을 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText("Test Client")).toBeInTheDocument();
		});

		it("고객 주소를 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(
				screen.getByText("123 Test Street, Test City"),
			).toBeInTheDocument();
		});

		it("고객 이메일을 렌더링한다", () => {
			// Arrange - beforeEach에서 설정됨

			// Act
			render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
				/>,
			);

			// Assert
			expect(screen.getByText("client@example.com")).toBeInTheDocument();
		});
	});

	describe("스타일링", () => {
		it("custom className을 적용한다", () => {
			// Arrange
			const customClassName = "custom-header-class";

			// Act
			const { container } = render(
				<InvoiceHeader
					invoice={defaultInvoice}
					companyInfo={defaultCompanyInfo}
					className={customClassName}
				/>,
			);

			// Assert
			// 루트 요소가 custom className을 포함하는지 확인
			const rootElement = container.firstChild;
			expect(rootElement).toHaveClass(customClassName);
		});
	});
});
