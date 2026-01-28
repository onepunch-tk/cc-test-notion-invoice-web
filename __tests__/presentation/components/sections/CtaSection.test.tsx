import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CtaSection from "~/presentation/components/sections/cta-section";

// sonner의 toast 모킹
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// navigator.clipboard 모킹
const mockWriteText = vi.fn();
Object.assign(navigator, {
	clipboard: {
		writeText: mockWriteText,
	},
});

describe("CtaSection 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockWriteText.mockResolvedValue(undefined);
	});

	describe("기본 렌더링", () => {
		it("섹션 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("지금 바로 시작하세요")).toBeInTheDocument();
		});

		it("섹션 부제목이 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByText("단 하나의 명령어로 프로젝트를 시작할 수 있습니다"),
			).toBeInTheDocument();
		});
	});

	describe("Git Clone 명령어", () => {
		it("git clone 명령어가 표시된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByText(
					"git clone https://github.com/onepunch-tk/claude-rr7-starterkit.git",
				),
			).toBeInTheDocument();
		});

		it("복사 버튼이 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const copyButton = screen.getByRole("button", {
				name: "클립보드에 복사",
			});
			expect(copyButton).toBeInTheDocument();
		});

		it("복사 버튼 클릭 시 클립보드에 복사된다", async () => {
			// Arrange
			render(<CtaSection />);
			const copyButton = screen.getByRole("button", {
				name: "클립보드에 복사",
			});

			// Act
			fireEvent.click(copyButton);

			// Assert
			expect(mockWriteText).toHaveBeenCalledWith(
				"git clone https://github.com/onepunch-tk/claude-rr7-starterkit.git",
			);
		});

		it("복사 버튼 클릭 시 성공 토스트가 표시된다", async () => {
			// Arrange
			const { toast } = await import("sonner");
			render(<CtaSection />);
			const copyButton = screen.getByRole("button", {
				name: "클립보드에 복사",
			});

			// Act
			fireEvent.click(copyButton);

			// Assert
			expect(toast.success).toHaveBeenCalledWith("클립보드에 복사되었습니다!");
		});
	});

	describe("빠른 시작 가이드", () => {
		it("빠른 시작 가이드 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("빠른 시작 가이드")).toBeInTheDocument();
		});

		it("1단계 안내가 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(
				screen.getByText("위 명령어로 프로젝트를 클론합니다"),
			).toBeInTheDocument();
		});

		it("2단계 bun install 명령어가 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("bun install")).toBeInTheDocument();
		});

		it("3단계 bun run dev 명령어가 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("bun run dev")).toBeInTheDocument();
		});

		it("단계 번호 1, 2, 3이 표시된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			expect(screen.getByText("1")).toBeInTheDocument();
			expect(screen.getByText("2")).toBeInTheDocument();
			expect(screen.getByText("3")).toBeInTheDocument();
		});
	});

	describe("외부 링크", () => {
		it("GitHub에서 보기 링크가 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const githubLink = screen.getByRole("link", { name: "GitHub에서 보기" });
			expect(githubLink).toBeInTheDocument();
		});

		it("GitHub 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const githubLink = screen.getByRole("link", { name: "GitHub에서 보기" });
			expect(githubLink).toHaveAttribute(
				"href",
				"https://github.com/onepunch-tk/claude-rr7-starterkit",
			);
		});

		it("GitHub 링크가 새 탭에서 열린다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const githubLink = screen.getByRole("link", { name: "GitHub에서 보기" });
			expect(githubLink).toHaveAttribute("target", "_blank");
			expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
		});

		it("문서 읽기 링크가 렌더링된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const docsLink = screen.getByRole("link", { name: "문서 읽기" });
			expect(docsLink).toBeInTheDocument();
		});

		it("문서 링크의 href가 올바르게 설정된다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const docsLink = screen.getByRole("link", { name: "문서 읽기" });
			expect(docsLink).toHaveAttribute(
				"href",
				"https://github.com/onepunch-tk/claude-rr7-starterkit#readme",
			);
		});

		it("문서 링크가 새 탭에서 열린다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const docsLink = screen.getByRole("link", { name: "문서 읽기" });
			expect(docsLink).toHaveAttribute("target", "_blank");
			expect(docsLink).toHaveAttribute("rel", "noopener noreferrer");
		});
	});

	describe("접근성", () => {
		it("복사 버튼에 aria-label이 설정되어 있다", () => {
			// Arrange & Act
			render(<CtaSection />);

			// Assert
			const copyButton = screen.getByRole("button", {
				name: "클립보드에 복사",
			});
			expect(copyButton).toHaveAttribute("aria-label", "클립보드에 복사");
		});
	});
});
