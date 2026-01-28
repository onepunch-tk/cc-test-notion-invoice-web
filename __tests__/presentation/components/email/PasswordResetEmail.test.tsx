import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import PasswordResetEmail from "~/presentation/components/email/password-reset-email";

describe("PasswordResetEmail 컴포넌트", () => {
	const mockResetUrl = "https://example.com/auth/reset-password?token=abc123";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("이메일 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(screen.getByText("비밀번호 재설정")).toBeInTheDocument();
		});

		it("안내 문구가 렌더링된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(
				screen.getByText(
					/비밀번호 재설정을 요청하셨습니다\. 아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요\./,
				),
			).toBeInTheDocument();
		});
	});

	describe("비밀번호 재설정 버튼", () => {
		it("비밀번호 재설정하기 버튼이 렌더링된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			const resetButton = screen.getByRole("link", {
				name: "비밀번호 재설정하기",
			});
			expect(resetButton).toBeInTheDocument();
		});

		it("버튼의 href가 resetUrl로 설정된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			const resetButton = screen.getByRole("link", {
				name: "비밀번호 재설정하기",
			});
			expect(resetButton).toHaveAttribute("href", mockResetUrl);
		});
	});

	describe("대체 링크 표시", () => {
		it("링크 복사 안내 문구가 렌더링된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(
				screen.getByText(
					"버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:",
				),
			).toBeInTheDocument();
		});

		it("resetUrl이 텍스트로 표시된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(screen.getByText(mockResetUrl)).toBeInTheDocument();
		});
	});

	describe("경고 메시지", () => {
		it("링크 유효 시간 경고가 표시된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(
				screen.getByText(/이 링크는 보안을 위해 1시간 동안만 유효합니다\./),
			).toBeInTheDocument();
		});

		it("중요 라벨이 표시된다", () => {
			// Arrange & Act
			render(<PasswordResetEmail resetUrl={mockResetUrl} />);

			// Assert
			expect(screen.getByText("중요:")).toBeInTheDocument();
		});
	});

	describe("Footer 메시지", () => {
		it("자동 발송 안내와 보안 경고가 표시된다", () => {
			// Arrange & Act
			const { container } = render(
				<PasswordResetEmail resetUrl={mockResetUrl} />,
			);

			// Assert
			expect(container.innerHTML).toContain(
				"이 이메일은 자동으로 발송되었습니다",
			);
			expect(container.innerHTML).toContain(
				"비밀번호 재설정을 요청하지 않으셨다면 즉시 계정 보안을 확인해주세요",
			);
		});
	});

	describe("다양한 resetUrl", () => {
		it("긴 URL도 올바르게 표시된다", () => {
			// Arrange
			const longUrl =
				"https://example.com/auth/reset-password?token=verylongtokenvalue123456789abcdefghijklmnop";

			// Act
			render(<PasswordResetEmail resetUrl={longUrl} />);

			// Assert
			expect(screen.getByText(longUrl)).toBeInTheDocument();
		});

		it("쿼리 파라미터가 포함된 URL이 올바르게 처리된다", () => {
			// Arrange
			const urlWithParams =
				"https://example.com/reset?token=abc&user=test@email.com";

			// Act
			render(<PasswordResetEmail resetUrl={urlWithParams} />);

			// Assert
			expect(screen.getByText(urlWithParams)).toBeInTheDocument();
			const resetButton = screen.getByRole("link", {
				name: "비밀번호 재설정하기",
			});
			expect(resetButton).toHaveAttribute("href", urlWithParams);
		});
	});
});
