import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import VerificationEmail from "~/presentation/components/email/verification-email";

describe("VerificationEmail 컴포넌트", () => {
	const mockVerificationUrl =
		"https://example.com/auth/verify?token=verification123";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("이메일 제목이 렌더링된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			expect(screen.getByText("이메일 인증")).toBeInTheDocument();
		});

		it("안내 문구가 렌더링된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			expect(
				screen.getByText(
					"회원가입을 완료하려면 아래 버튼을 클릭하여 이메일 주소를 인증해주세요.",
				),
			).toBeInTheDocument();
		});
	});

	describe("이메일 인증 버튼", () => {
		it("이메일 인증하기 버튼이 렌더링된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			const verifyButton = screen.getByRole("link", { name: "이메일 인증하기" });
			expect(verifyButton).toBeInTheDocument();
		});

		it("버튼의 href가 verificationUrl로 설정된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			const verifyButton = screen.getByRole("link", { name: "이메일 인증하기" });
			expect(verifyButton).toHaveAttribute("href", mockVerificationUrl);
		});
	});

	describe("대체 링크 표시", () => {
		it("링크 복사 안내 문구가 렌더링된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			expect(
				screen.getByText(
					"버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:",
				),
			).toBeInTheDocument();
		});

		it("verificationUrl이 텍스트로 표시된다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			expect(screen.getByText(mockVerificationUrl)).toBeInTheDocument();
		});
	});

	describe("Footer 메시지", () => {
		it("자동 발송 안내가 표시된다", () => {
			// Arrange & Act
			const { container } = render(
				<VerificationEmail verificationUrl={mockVerificationUrl} />,
			);

			// Assert
			expect(container.innerHTML).toContain(
				"이 이메일은 자동으로 발송되었습니다",
			);
		});

		it("회원가입 요청하지 않은 경우 안내가 표시된다", () => {
			// Arrange & Act
			const { container } = render(
				<VerificationEmail verificationUrl={mockVerificationUrl} />,
			);

			// Assert
			expect(container.innerHTML).toContain(
				"회원가입을 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다",
			);
		});
	});

	describe("다양한 verificationUrl", () => {
		it("긴 URL도 올바르게 표시된다", () => {
			// Arrange
			const longUrl =
				"https://example.com/auth/verify-email?token=verylongtokenvalue123456789abcdefghijklmnopqrstuvwxyz";

			// Act
			render(<VerificationEmail verificationUrl={longUrl} />);

			// Assert
			expect(screen.getByText(longUrl)).toBeInTheDocument();
		});

		it("쿼리 파라미터가 포함된 URL이 올바르게 처리된다", () => {
			// Arrange
			const urlWithParams =
				"https://example.com/verify?token=abc&email=test@email.com&redirect=/dashboard";

			// Act
			render(<VerificationEmail verificationUrl={urlWithParams} />);

			// Assert
			expect(screen.getByText(urlWithParams)).toBeInTheDocument();
			const verifyButton = screen.getByRole("link", { name: "이메일 인증하기" });
			expect(verifyButton).toHaveAttribute("href", urlWithParams);
		});

		it("다른 도메인 URL도 올바르게 처리된다", () => {
			// Arrange
			const differentDomainUrl = "https://auth.mydomain.com/verify?token=xyz";

			// Act
			render(<VerificationEmail verificationUrl={differentDomainUrl} />);

			// Assert
			const verifyButton = screen.getByRole("link", { name: "이메일 인증하기" });
			expect(verifyButton).toHaveAttribute("href", differentDomainUrl);
		});
	});

	describe("PasswordResetEmail과의 차이점", () => {
		it("경고 박스가 표시되지 않는다", () => {
			// Arrange & Act
			render(<VerificationEmail verificationUrl={mockVerificationUrl} />);

			// Assert
			expect(screen.queryByText("중요:")).not.toBeInTheDocument();
			expect(
				screen.queryByText(/1시간 동안만 유효합니다/),
			).not.toBeInTheDocument();
		});
	});
});
