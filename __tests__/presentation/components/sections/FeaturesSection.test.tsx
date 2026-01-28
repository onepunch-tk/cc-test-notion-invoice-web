import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import FeaturesSection from "~/presentation/components/sections/features-section";

describe("FeaturesSection 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("섹션 헤더", () => {
		it("섹션 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("포함된 주요 기능")).toBeInTheDocument();
		});

		it("섹션 부제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText("프로덕션 레디 기능들이 이미 구현되어 있습니다"),
			).toBeInTheDocument();
		});

		it("섹션 제목이 h2 태그로 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			const heading = screen.getByRole("heading", { level: 2 });
			expect(heading).toHaveTextContent("포함된 주요 기능");
		});
	});

	describe("기능 카드 - Supabase 인증", () => {
		it("Supabase 인증 카드 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("Supabase 인증")).toBeInTheDocument();
		});

		it("Supabase 인증 카드 설명이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText(
					"이메일 기반 회원가입, 로그인, 비밀번호 재설정 기능이 모두 포함되어 있습니다.",
				),
			).toBeInTheDocument();
		});
	});

	describe("기능 카드 - 대시보드", () => {
		it("대시보드 카드 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("대시보드")).toBeInTheDocument();
		});

		it("대시보드 카드 설명이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText(
					"인증된 사용자를 위한 대시보드 페이지가 준비되어 있어 바로 기능을 추가할 수 있습니다.",
				),
			).toBeInTheDocument();
		});
	});

	describe("기능 카드 - 설정 페이지", () => {
		it("설정 페이지 카드 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("설정 페이지")).toBeInTheDocument();
		});

		it("설정 페이지 카드 설명이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText(
					"프로필 설정, 이메일 변경 등 사용자 설정 관리 기능이 구현되어 있습니다.",
				),
			).toBeInTheDocument();
		});
	});

	describe("기능 카드 - Drizzle ORM", () => {
		it("Drizzle ORM 카드 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(screen.getByText("Drizzle ORM")).toBeInTheDocument();
		});

		it("Drizzle ORM 카드 설명이 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			expect(
				screen.getByText(
					"타입 안전한 데이터베이스 ORM으로 빠르고 안전하게 데이터를 관리할 수 있습니다.",
				),
			).toBeInTheDocument();
		});
	});

	describe("카드 개수", () => {
		it("4개의 기능 카드가 렌더링된다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			const cardTitles = [
				"Supabase 인증",
				"대시보드",
				"설정 페이지",
				"Drizzle ORM",
			];

			for (const title of cardTitles) {
				expect(screen.getByText(title)).toBeInTheDocument();
			}
		});
	});

	describe("접근성", () => {
		it("적절한 heading 계층 구조를 가진다", () => {
			// Arrange & Act
			render(<FeaturesSection />);

			// Assert
			const h2 = screen.getByRole("heading", { level: 2 });
			expect(h2).toBeInTheDocument();
		});
	});
});
