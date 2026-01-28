import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/reset-password";

/**
 * reset-password 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 비밀번호 재설정 성공 시 로그인 페이지로 리다이렉트
 * - 유효성 검증 실패
 * - 토큰 검증 실패
 * - HTTP 메서드 검증
 */

// Mock authService
const mockResetPassword = vi.fn();

const mockAuthService = {
	resetPassword: mockResetPassword,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (
	method: string,
	formData: Record<string, string>,
): Request => {
	const form = new FormData();
	for (const [key, value] of Object.entries(formData)) {
		form.append(key, value);
	}
	return new Request("http://localhost:3000/auth/reset-password", {
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

describe("reset-password action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("HTTP 메서드 검증", () => {
		it("POST가 아닌 요청은 에러를 반환한다", async () => {
			// Arrange
			const request = new Request(
				"http://localhost:3000/auth/reset-password",
				{
					method: "GET",
				},
			);
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "POST 요청만 허용됩니다." });
		});
	});

	describe("비밀번호 재설정 성공", () => {
		it("유효한 데이터로 비밀번호 재설정 성공 시 로그인 페이지로 리다이렉트한다", async () => {
			// Arrange
			mockResetPassword.mockResolvedValueOnce(undefined);
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
				token: "valid-reset-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockResetPassword).toHaveBeenCalledWith(
				"NewTest1234!",
				"valid-reset-token",
				expect.any(Headers),
			);
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe(
				"/auth/signin?message=password-reset-success",
			);
		});
	});

	describe("폼 유효성 검증", () => {
		it("새 비밀번호가 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				newPassword: "",
				newPasswordConfirm: "",
				token: "valid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("newPassword");
		});

		it("비밀번호가 8자 미만인 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				newPassword: "Test1!",
				newPasswordConfirm: "Test1!",
				token: "valid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("newPassword");
		});

		it("비밀번호가 복잡도 요구사항을 충족하지 않는 경우 검증 에러를 반환한다", async () => {
			// Arrange: 특수문자 없음
			const request = createRequest("POST", {
				newPassword: "Test12345",
				newPasswordConfirm: "Test12345",
				token: "valid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("newPassword");
		});

		it("비밀번호 확인이 일치하지 않는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "DifferentTest1234!",
				token: "valid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("newPasswordConfirm");
		});

		it("토큰이 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
				token: "",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("token");
		});
	});

	describe("에러 처리", () => {
		it("유효하지 않은 토큰으로 재설정 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockResetPassword.mockRejectedValueOnce(new Error("Invalid token"));
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
				token: "invalid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("error");
			// getAuthErrorMessage 함수가 에러를 처리하여 기본 메시지 또는 매핑된 메시지 반환
			expect(typeof (result as { error: string }).error).toBe("string");
			expect((result as { error: string }).error.length).toBeGreaterThan(0);
		});

		it("만료된 토큰으로 재설정 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockResetPassword.mockRejectedValueOnce(new Error("Token expired"));
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
				token: "expired-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("error");
			expect(typeof (result as { error: string }).error).toBe("string");
		});

		it("서버 에러 발생 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockResetPassword.mockRejectedValueOnce(
				new Error("Internal server error"),
			);
			const request = createRequest("POST", {
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
				token: "valid-token",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("error");
			// getAuthErrorMessage 함수가 에러를 처리하여 기본 메시지 반환
			expect(typeof (result as { error: string }).error).toBe("string");
			expect((result as { error: string }).error.length).toBeGreaterThan(0);
		});
	});
});
