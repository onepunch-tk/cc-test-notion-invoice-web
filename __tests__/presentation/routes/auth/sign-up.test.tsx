import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/sign-up";
import {
	AuthError,
	DuplicateEmailError,
	UserCreationError,
} from "~/domain/auth";

/**
 * sign-up 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 회원가입 성공
 * - 유효성 검증 실패
 * - 중복 이메일 에러
 * - 사용자 생성 실패 에러
 * - HTTP 메서드 검증
 */

// Mock authService
const mockSignUp = vi.fn();

const mockAuthService = {
	signUp: mockSignUp,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (
	method: string,
	formData: Record<string, string | boolean>,
): Request => {
	const form = new FormData();
	for (const [key, value] of Object.entries(formData)) {
		if (typeof value === "boolean" && value) {
			form.append(key, "on"); // checkbox true -> "on"
		} else if (typeof value === "string") {
			form.append(key, value);
		}
	}
	return new Request("http://localhost:3000/auth/signup", {
		method,
		body: form,
	});
};

// Helper: ActionArgs 생성
const createActionArgs = (request: Request) =>
	({
		request,
		context: { container: mockContainer },
		params: {},
	}) as unknown as Parameters<typeof action>[0];

describe("sign-up action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("HTTP 메서드 검증", () => {
		it("POST가 아닌 요청은 에러를 반환한다", async () => {
			// Arrange
			const request = new Request("http://localhost:3000/auth/signup", {
				method: "GET",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "POST 요청만 허용됩니다." });
		});
	});

	describe("회원가입 성공", () => {
		it("유효한 데이터로 회원가입 성공 시 성공 메시지를 반환한다", async () => {
			// Arrange
			mockSignUp.mockResolvedValueOnce({
				user: {
					name: "홍길동",
					email: "test@example.com",
					emailVerified: false,
					image: null,
				},
			});
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockSignUp).toHaveBeenCalledWith(
				"test@example.com",
				"Test1234!",
				"홍길동",
				expect.any(Headers),
			);
			expect(result).toEqual({
				success: true,
				message:
					"회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.",
			});
		});
	});

	describe("폼 유효성 검증", () => {
		it("이름이 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				name: "",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("name");
		});

		it("이메일 형식이 잘못된 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				name: "홍길동",
				email: "invalid-email",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("email");
		});

		it("비밀번호가 8자 미만인 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1!", // 6자
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("password");
		});

		it("비밀번호가 복잡도 요구사항을 충족하지 않는 경우 검증 에러를 반환한다", async () => {
			// Arrange: 특수문자 없음
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test12345", // 특수문자 없음
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("password");
		});

		it("이용약관에 동의하지 않은 경우 검증 에러를 반환한다", async () => {
			// Arrange: termsAgreed가 없음
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("termsAgreed");
		});
	});

	describe("에러 처리", () => {
		it("중복 이메일 에러가 발생하면 해당 메시지를 반환한다", async () => {
			// Arrange
			mockSignUp.mockRejectedValueOnce(new DuplicateEmailError());
			const request = createRequest("POST", {
				name: "홍길동",
				email: "existing@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "이미 사용 중인 이메일입니다." });
		});

		it("사용자 생성 실패 에러가 발생하면 해당 메시지를 반환한다", async () => {
			// Arrange
			mockSignUp.mockRejectedValueOnce(new UserCreationError());
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "사용자 생성에 실패했습니다." });
		});

		it("AuthError가 발생하면 해당 메시지를 반환한다", async () => {
			// Arrange
			class TestAuthError extends AuthError {
				constructor() {
					super("인증 관련 에러 발생");
				}
			}
			mockSignUp.mockRejectedValueOnce(new TestAuthError());
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "인증 관련 에러 발생" });
		});

		it("일반 에러가 발생하면 에러 메시지를 반환한다", async () => {
			// Arrange
			mockSignUp.mockRejectedValueOnce(new Error("Unknown error"));
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "Unknown error" });
		});

		it("에러 객체가 아닌 경우 기본 메시지를 반환한다", async () => {
			// Arrange
			mockSignUp.mockRejectedValueOnce("string error");
			const request = createRequest("POST", {
				name: "홍길동",
				email: "test@example.com",
				password: "Test1234!",
				termsAgreed: true,
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "회원가입에 실패했습니다." });
		});
	});
});
