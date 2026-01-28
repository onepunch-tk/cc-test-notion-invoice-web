import { describe, it, expect } from "vitest";
import {
	AuthError,
	DuplicateEmailError,
	UserCreationError,
	InvalidCredentialsError,
	EmailNotVerifiedError,
	EmailServiceNotConfiguredError,
	EmailSendError,
} from "~/domain/auth/auth.errors";

describe("Auth 도메인 에러 클래스", () => {
	describe("DuplicateEmailError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new DuplicateEmailError();

			// Assert
			expect(error.message).toBe("이미 사용 중인 이메일입니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "test@example.com은 이미 등록된 이메일입니다.";

			// Act
			const error = new DuplicateEmailError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new DuplicateEmailError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 DuplicateEmailError이다", () => {
			// Arrange & Act
			const error = new DuplicateEmailError();

			// Assert
			expect(error.name).toBe("DuplicateEmailError");
		});
	});

	describe("UserCreationError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new UserCreationError();

			// Assert
			expect(error.message).toBe("사용자 생성에 실패했습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "데이터베이스 오류로 사용자 생성 실패";

			// Act
			const error = new UserCreationError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new UserCreationError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 UserCreationError이다", () => {
			// Arrange & Act
			const error = new UserCreationError();

			// Assert
			expect(error.name).toBe("UserCreationError");
		});
	});

	describe("InvalidCredentialsError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new InvalidCredentialsError();

			// Assert
			expect(error.message).toBe("이메일 또는 비밀번호가 일치하지 않습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "로그인 정보가 올바르지 않습니다.";

			// Act
			const error = new InvalidCredentialsError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new InvalidCredentialsError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 InvalidCredentialsError이다", () => {
			// Arrange & Act
			const error = new InvalidCredentialsError();

			// Assert
			expect(error.name).toBe("InvalidCredentialsError");
		});
	});

	describe("EmailNotVerifiedError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new EmailNotVerifiedError();

			// Assert
			expect(error.message).toBe("이메일 인증이 완료되지 않았습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "이메일 인증 후 로그인해 주세요.";

			// Act
			const error = new EmailNotVerifiedError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new EmailNotVerifiedError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 EmailNotVerifiedError이다", () => {
			// Arrange & Act
			const error = new EmailNotVerifiedError();

			// Assert
			expect(error.name).toBe("EmailNotVerifiedError");
		});
	});

	describe("EmailServiceNotConfiguredError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new EmailServiceNotConfiguredError();

			// Assert
			expect(error.message).toBe("이메일 서비스가 설정되지 않았습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "Resend API 키가 설정되지 않았습니다.";

			// Act
			const error = new EmailServiceNotConfiguredError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new EmailServiceNotConfiguredError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 EmailServiceNotConfiguredError이다", () => {
			// Arrange & Act
			const error = new EmailServiceNotConfiguredError();

			// Assert
			expect(error.name).toBe("EmailServiceNotConfiguredError");
		});
	});

	describe("EmailSendError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new EmailSendError();

			// Assert
			expect(error.message).toBe("이메일 전송에 실패했습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "SMTP 서버 연결 실패";

			// Act
			const error = new EmailSendError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("AuthError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new EmailSendError();

			// Assert
			expect(error).toBeInstanceOf(AuthError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 EmailSendError이다", () => {
			// Arrange & Act
			const error = new EmailSendError();

			// Assert
			expect(error.name).toBe("EmailSendError");
		});
	});
});
