/**
 * InvoiceListSkeleton 컴포넌트 테스트
 *
 * TDD Red Phase: 아직 구현되지 않은 InvoiceListSkeleton 컴포넌트를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InvoiceListSkeleton from "~/presentation/components/invoice/invoice-list-skeleton";

describe("InvoiceListSkeleton", () => {
	describe("기본 렌더링", () => {
		it("기본값으로 6개의 스켈레톤 카드를 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton />);

			// Assert
			const skeletonCards = screen.getAllByTestId("invoice-skeleton-card");
			expect(skeletonCards).toHaveLength(6);
		});

		it("스켈레톤 카드 내부에 애니메이션 효과가 있어야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton />);

			// Assert
			const skeletonCards = screen.getAllByTestId("invoice-skeleton-card");
			// 각 카드에 animate-pulse 클래스가 포함되어야 함
			for (const card of skeletonCards) {
				expect(card.querySelector(".animate-pulse")).toBeInTheDocument();
			}
		});
	});

	describe("count prop 검증", () => {
		it("count prop이 3일 때 3개의 스켈레톤 카드를 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton count={3} />);

			// Assert
			const skeletonCards = screen.getAllByTestId("invoice-skeleton-card");
			expect(skeletonCards).toHaveLength(3);
		});

		it("count prop이 10일 때 10개의 스켈레톤 카드를 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton count={10} />);

			// Assert
			const skeletonCards = screen.getAllByTestId("invoice-skeleton-card");
			expect(skeletonCards).toHaveLength(10);
		});

		it("count prop이 1일 때 1개의 스켈레톤 카드를 렌더링해야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton count={1} />);

			// Assert
			const skeletonCards = screen.getAllByTestId("invoice-skeleton-card");
			expect(skeletonCards).toHaveLength(1);
		});
	});

	describe("그리드 레이아웃 검증", () => {
		it("그리드 컨테이너가 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton />);

			// Assert
			const gridContainer = screen.getByTestId("invoice-skeleton-grid");
			expect(gridContainer).toBeInTheDocument();
		});

		it("그리드 레이아웃 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton />);

			// Assert
			const gridContainer = screen.getByTestId("invoice-skeleton-grid");
			expect(gridContainer).toHaveClass("grid");
		});

		it("반응형 그리드 클래스가 적용되어야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton />);

			// Assert
			const gridContainer = screen.getByTestId("invoice-skeleton-grid");
			// sm:grid-cols-2, lg:grid-cols-3 반응형 클래스 확인
			expect(gridContainer.className).toMatch(/sm:grid-cols-/);
			expect(gridContainer.className).toMatch(/lg:grid-cols-/);
		});
	});

	describe("className prop 검증", () => {
		it("className prop이 그리드 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-class-name";

			// Act
			render(<InvoiceListSkeleton className={customClassName} />);

			// Assert
			const gridContainer = screen.getByTestId("invoice-skeleton-grid");
			expect(gridContainer).toHaveClass(customClassName);
		});

		it("className prop과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "mt-4";

			// Act
			render(<InvoiceListSkeleton className={customClassName} />);

			// Assert
			const gridContainer = screen.getByTestId("invoice-skeleton-grid");
			expect(gridContainer).toHaveClass("grid");
			expect(gridContainer).toHaveClass(customClassName);
		});
	});

	describe("스켈레톤 카드 구조 검증", () => {
		it("각 스켈레톤 카드가 헤더 영역 플레이스홀더를 가져야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton count={1} />);

			// Assert
			const headerPlaceholder = screen.getByTestId("skeleton-header");
			expect(headerPlaceholder).toBeInTheDocument();
		});

		it("각 스켈레톤 카드가 콘텐츠 영역 플레이스홀더를 가져야 한다", () => {
			// Arrange & Act
			render(<InvoiceListSkeleton count={1} />);

			// Assert
			const contentPlaceholder = screen.getByTestId("skeleton-content");
			expect(contentPlaceholder).toBeInTheDocument();
		});
	});
});
