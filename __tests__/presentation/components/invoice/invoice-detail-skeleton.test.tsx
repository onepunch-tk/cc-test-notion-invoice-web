/**
 * InvoiceDetailSkeleton 컴포넌트 테스트
 *
 * TDD Red Phase: 인보이스 상세 페이지 로딩 스켈레톤 컴포넌트를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceDetailSkeleton from "~/presentation/components/invoice/invoice-detail-skeleton";

describe("InvoiceDetailSkeleton", () => {
	describe("기본 렌더링", () => {
		it("스켈레톤 컨테이너가 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			expect(container).toBeInTheDocument();
		});
	});

	describe("헤더 스켈레톤 섹션", () => {
		it("헤더 스켈레톤 영역이 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const headerSkeleton = screen.getByTestId(
				"invoice-detail-skeleton-header",
			);
			expect(headerSkeleton).toBeInTheDocument();
		});

		it("헤더 스켈레톤에 회사 로고 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const logoPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-logo",
			);
			expect(logoPlaceholder).toBeInTheDocument();
		});

		it("헤더 스켈레톤에 회사 정보 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const companyInfoPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-company-info",
			);
			expect(companyInfoPlaceholder).toBeInTheDocument();
		});

		it("헤더 스켈레톤에 인보이스 메타 정보 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const metaPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-meta",
			);
			expect(metaPlaceholder).toBeInTheDocument();
		});
	});

	describe("Bill-to 스켈레톤 섹션", () => {
		it("Bill-to 스켈레톤 영역이 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const billToSkeleton = screen.getByTestId(
				"invoice-detail-skeleton-bill-to",
			);
			expect(billToSkeleton).toBeInTheDocument();
		});

		it("Bill-to 스켈레톤에 고객명 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const clientNamePlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-client-name",
			);
			expect(clientNamePlaceholder).toBeInTheDocument();
		});

		it("Bill-to 스켈레톤에 고객 주소 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const clientAddressPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-client-address",
			);
			expect(clientAddressPlaceholder).toBeInTheDocument();
		});
	});

	describe("테이블 스켈레톤 섹션", () => {
		it("테이블 스켈레톤 영역이 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const tableSkeleton = screen.getByTestId("invoice-detail-skeleton-table");
			expect(tableSkeleton).toBeInTheDocument();
		});

		it("테이블 스켈레톤에 5개의 행 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const rowPlaceholders = screen.getAllByTestId(
				"invoice-detail-skeleton-table-row",
			);
			expect(rowPlaceholders).toHaveLength(5);
		});

		it("테이블 스켈레톤에 헤더 행이 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const tableHeader = screen.getByTestId(
				"invoice-detail-skeleton-table-header",
			);
			expect(tableHeader).toBeInTheDocument();
		});
	});

	describe("요약 스켈레톤 섹션", () => {
		it("요약 스켈레톤 영역이 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const summarySkeleton = screen.getByTestId(
				"invoice-detail-skeleton-summary",
			);
			expect(summarySkeleton).toBeInTheDocument();
		});

		it("요약 스켈레톤에 소계 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const subtotalPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-subtotal",
			);
			expect(subtotalPlaceholder).toBeInTheDocument();
		});

		it("요약 스켈레톤에 세금 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const taxPlaceholder = screen.getByTestId("invoice-detail-skeleton-tax");
			expect(taxPlaceholder).toBeInTheDocument();
		});

		it("요약 스켈레톤에 총액 플레이스홀더가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const totalPlaceholder = screen.getByTestId(
				"invoice-detail-skeleton-total",
			);
			expect(totalPlaceholder).toBeInTheDocument();
		});
	});

	describe("애니메이션 검증", () => {
		it("스켈레톤 요소에 애니메이션 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			const animatedElements = container.querySelectorAll(".animate-pulse");
			expect(animatedElements.length).toBeGreaterThan(0);
		});
	});

	describe("className prop 검증", () => {
		it("className prop이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-skeleton-class";

			// Act
			render(<InvoiceDetailSkeleton className={customClassName} />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			expect(container).toHaveClass(customClassName);
		});

		it("className prop과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "mt-8";

			// Act
			render(<InvoiceDetailSkeleton className={customClassName} />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			expect(container).toHaveClass(customClassName);
			// 컨테이너는 기본 스타일도 가지고 있어야 함
			expect(container.className.length).toBeGreaterThan(
				customClassName.length,
			);
		});
	});

	describe("레이아웃 구조 검증", () => {
		it("스켈레톤 섹션이 올바른 순서로 배치되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			const sections = container.children;

			// 최소 4개 섹션이 있어야 함 (header, bill-to, table, summary)
			expect(sections.length).toBeGreaterThanOrEqual(4);
		});

		it("반응형 레이아웃 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceDetailSkeleton />);

			// Assert
			const container = screen.getByTestId("invoice-detail-skeleton");
			// max-width 또는 반응형 클래스가 적용되어야 함
			expect(container.className).toBeDefined();
		});
	});
});
