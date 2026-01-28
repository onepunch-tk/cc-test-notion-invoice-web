import { describe, it, expect } from "vitest";
import { getAuthErrorMessage } from "~/presentation/lib/error-handler";

describe("getAuthErrorMessage (인증 에러 메시지 변환)", () => {
	describe("Better-auth 에러 코드 매핑", () => {
		it("INVALID_EMAIL_OR_PASSWORD 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("Invalid email or password");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
		});

		it("EMAIL_NOT_VERIFIED 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("Email not verified");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이메일 인증을 완료해주세요.");
		});

		it("USER_NOT_FOUND 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("User not found");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("사용자를 찾을 수 없습니다.");
		});

		it("USER_ALREADY_EXISTS 에러를 한글로 변환한다", () => {
			// Arrange
			// better-auth의 실제 에러 메시지는 "User already exists."로 마침표 포함
			const error = new Error("User already exists.");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("이미 등록된 이메일입니다.");
		});

		it("INVALID_TOKEN 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("Invalid token");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("유효하지 않거나 만료된 링크입니다.");
		});

		it("SESSION_EXPIRED 에러를 한글로 변환한다", () => {
			// Arrange
			// better-auth의 실제 에러 메시지
			const error = new Error("Session expired. Re-authenticate to perform this action.");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("세션이 만료되었습니다. 다시 로그인해주세요.");
		});

		it("PASSWORD_TOO_SHORT 에러를 한글로 변환한다", () => {
			// Arrange
			// better-auth의 실제 에러 메시지
			const error = new Error("Password too short");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("비밀번호가 너무 짧습니다.");
		});

		it("PASSWORD_TOO_LONG 에러를 한글로 변환한다", () => {
			// Arrange
			// better-auth의 실제 에러 메시지
			const error = new Error("Password too long");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("비밀번호가 너무 깁니다.");
		});
	});

	describe("OAuth 에러 코드 매핑", () => {
		it("state_not_found 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("state_not_found: OAuth state missing");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.");
		});

		it("state_mismatch 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("state_mismatch");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 상태가 일치하지 않습니다. 다시 시도해주세요.");
		});

		it("access_denied 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("access_denied by user");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("접근이 거부되었습니다.");
		});

		it("server_error 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("server_error occurred");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		});

		it("temporarily_unavailable 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("Service temporarily_unavailable");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("서비스를 일시적으로 사용할 수 없습니다.");
		});

		it("invalid_state 에러를 한글로 변환한다", () => {
			// Arrange
			const error = new Error("invalid_state parameter");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("유효하지 않은 인증 상태입니다. 다시 시도해주세요.");
		});
	});

	describe("기본 메시지 반환", () => {
		it("매핑되지 않은 에러는 기본 메시지를 반환한다", () => {
			// Arrange
			const error = new Error("Unknown error occurred");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("커스텀 기본 메시지를 사용할 수 있다", () => {
			// Arrange
			const error = new Error("Unknown error");
			const customDefaultMessage = "로그인에 실패했습니다.";

			// Act
			const result = getAuthErrorMessage(error, customDefaultMessage);

			// Assert
			expect(result).toBe("로그인에 실패했습니다.");
		});

		it("빈 에러 메시지는 기본 메시지를 반환한다", () => {
			// Arrange
			const error = new Error("");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});
	});

	describe("비 Error 객체 처리", () => {
		it("null은 기본 메시지를 반환한다", () => {
			// Arrange
			const error = null;

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("undefined는 기본 메시지를 반환한다", () => {
			// Arrange
			const error = undefined;

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("문자열은 기본 메시지를 반환한다", () => {
			// Arrange
			const error = "This is a string error";

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("객체는 기본 메시지를 반환한다", () => {
			// Arrange
			const error = { message: "Error message" };

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});

		it("숫자는 기본 메시지를 반환한다", () => {
			// Arrange
			const error = 404;

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("처리 중 오류가 발생했습니다.");
		});
	});

	describe("대소문자 처리", () => {
		it("OAuth 에러 코드는 대소문자 구분 없이 매칭한다", () => {
			// Arrange
			const error = new Error("STATE_NOT_FOUND");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.");
		});

		it("언더스코어를 공백으로 치환한 형태도 매칭한다", () => {
			// Arrange
			const error = new Error("state not found");

			// Act
			const result = getAuthErrorMessage(error);

			// Assert
			expect(result).toBe("OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.");
		});
	});

	describe("실제 사용 시나리오", () => {
		it("로그인 실패 시나리오", () => {
			// Arrange
			const loginError = new Error("Invalid email or password");

			// Act
			const message = getAuthErrorMessage(loginError, "로그인에 실패했습니다.");

			// Assert
			expect(message).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
		});

		it("회원가입 중복 이메일 시나리오", () => {
			// Arrange
			// better-auth의 실제 에러 메시지는 마침표 포함
			const signupError = new Error("User already exists.");

			// Act
			const message = getAuthErrorMessage(signupError, "회원가입에 실패했습니다.");

			// Assert
			expect(message).toBe("이미 등록된 이메일입니다.");
		});

		it("비밀번호 재설정 토큰 만료 시나리오", () => {
			// Arrange
			const tokenError = new Error("Invalid token");

			// Act
			const message = getAuthErrorMessage(tokenError, "비밀번호 재설정에 실패했습니다.");

			// Assert
			expect(message).toBe("유효하지 않거나 만료된 링크입니다.");
		});

		it("소셜 로그인 거부 시나리오", () => {
			// Arrange
			const oauthError = new Error("access_denied");

			// Act
			const message = getAuthErrorMessage(oauthError, "소셜 로그인에 실패했습니다.");

			// Assert
			expect(message).toBe("접근이 거부되었습니다.");
		});
	});
});
