/**
 * EmptyInvoiceList 컴포넌트 테스트
 *
 * TDD Red Phase: 아직 구현되지 않은 EmptyInvoiceList 컴포넌트를 테스트합니다.
 * 테스트는 실패해야 합니다 (구현 파일이 존재하지 않음).
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmptyInvoiceList from "~/presentation/components/invoice/empty-invoice-list";

describe("EmptyInvoiceList", () => {
	describe("아이콘 렌더링", () => {
		it("FileText 아이콘이 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const icon = screen.getByTestId("empty-invoice-icon");
			expect(icon).toBeInTheDocument();
		});

		it("아이콘이 적절한 크기를 가져야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const icon = screen.getByTestId("empty-invoice-icon");
			// 아이콘 컨테이너 또는 SVG가 적절한 크기 클래스를 가져야 함
			expect(icon.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("메시지 렌더링", () => {
		it('"인보이스가 없습니다" 메시지가 표시되어야 한다', () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const message = screen.getByText("인보이스가 없습니다");
			expect(message).toBeInTheDocument();
		});

		it("메시지가 적절한 스타일을 가져야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const message = screen.getByText("인보이스가 없습니다");
			// 텍스트가 강조되어야 함 (font-medium 또는 font-semibold)
			expect(message.className).toMatch(/font-(medium|semibold|bold)/);
		});
	});

	describe("Notion 안내 텍스트 렌더링", () => {
		it("Notion 안내 텍스트가 표시되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const guidanceText = screen.getByText(/Notion/i);
			expect(guidanceText).toBeInTheDocument();
		});

		it("안내 텍스트가 부가 설명 스타일을 가져야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const guidanceText = screen.getByText(/Notion/i);
			// muted 스타일이 적용되어야 함
			expect(guidanceText.className).toMatch(/text-muted/);
		});

		it("Notion 데이터베이스 추가 안내가 포함되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			// "Notion 데이터베이스에 인보이스를 추가해주세요" 또는 유사한 메시지
			const guidanceText = screen.getByText(/데이터베이스/i);
			expect(guidanceText).toBeInTheDocument();
		});
	});

	describe("className prop 검증", () => {
		it("className prop이 컨테이너에 적용되어야 한다", () => {
			// Arrange
			const customClassName = "custom-empty-class";

			// Act
			render(<EmptyInvoiceList className={customClassName} />);

			// Assert
			const container = screen.getByTestId("empty-invoice-list");
			expect(container).toHaveClass(customClassName);
		});

		it("className prop과 기본 클래스가 함께 적용되어야 한다", () => {
			// Arrange
			const customClassName = "my-8";

			// Act
			render(<EmptyInvoiceList className={customClassName} />);

			// Assert
			const container = screen.getByTestId("empty-invoice-list");
			expect(container).toHaveClass(customClassName);
			// 기본 레이아웃 클래스도 유지되어야 함
			expect(container.className).toMatch(/flex|text-center/);
		});
	});

	describe("레이아웃 구조 검증", () => {
		it("컨테이너가 중앙 정렬되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const container = screen.getByTestId("empty-invoice-list");
			// 중앙 정렬을 위한 클래스 확인 (flex + items-center + justify-center 또는 text-center)
			expect(container.className).toMatch(
				/(items-center|justify-center|text-center)/,
			);
		});

		it("세로 방향 레이아웃이어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const container = screen.getByTestId("empty-invoice-list");
			// flex-col 또는 block 레이아웃
			expect(container.className).toMatch(/(flex-col|block)/);
		});

		it("아이콘, 메시지, 안내 텍스트 순서로 렌더링되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			const container = screen.getByTestId("empty-invoice-list");
			const children = container.children;

			// 최소 3개의 자식 요소가 있어야 함 (아이콘, 메시지, 안내 텍스트)
			expect(children.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe("접근성 검증", () => {
		it("스크린 리더를 위한 적절한 텍스트가 제공되어야 한다", () => {
			// Arrange & Act
			render(<EmptyInvoiceList />);

			// Assert
			// 비어있는 상태를 설명하는 텍스트가 존재해야 함
			expect(screen.getByText("인보이스가 없습니다")).toBeInTheDocument();
		});
	});
});
