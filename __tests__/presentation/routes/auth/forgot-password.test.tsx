import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/forgot-password";

/**
 * forgot-password 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 비밀번호 재설정 요청 성공
 * - 유효성 검증 실패
 * - HTTP 메서드 검증
 * - 보안: 실패해도 같은 응답 반환 (이메일 존재 여부 노출 방지)
 */

// Mock authService
const mockRequestPasswordReset = vi.fn();

const mockAuthService = {
	requestPasswordReset: mockRequestPasswordReset,
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
	return new Request("http://localhost:3000/auth/forgot-password", {
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

describe("forgot-password action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("HTTP 메서드 검증", () => {
		it("POST가 아닌 요청은 에러를 반환한다", async () => {
			// Arrange
			const request = new Request(
				"http://localhost:3000/auth/forgot-password",
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

	describe("비밀번호 재설정 요청 성공", () => {
		it("유효한 이메일로 요청 시 성공 응답을 반환한다", async () => {
			// Arrange
			mockRequestPasswordReset.mockResolvedValueOnce(undefined);
			const request = createRequest("POST", {
				email: "test@example.com",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockRequestPasswordReset).toHaveBeenCalledWith(
				"test@example.com",
				expect.any(Headers),
			);
			expect(result).toEqual({ success: true });
		});
	});

	describe("폼 유효성 검증", () => {
		it("이메일이 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				email: "",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("email");
		});

		it("이메일 형식이 잘못된 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				email: "invalid-email",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("email");
		});
	});

	describe("보안: 이메일 존재 여부 노출 방지", () => {
		it("존재하지 않는 이메일로 요청해도 성공 응답을 반환한다", async () => {
			// Arrange
			// 실제 에러가 발생해도 같은 응답을 반환해야 함
			mockRequestPasswordReset.mockRejectedValueOnce(
				new Error("User not found"),
			);
			const request = createRequest("POST", {
				email: "nonexistent@example.com",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			// 보안상 이유로 실패해도 같은 응답 반환
			expect(result).toEqual({ success: true });
		});

		it("이메일 전송 실패해도 성공 응답을 반환한다", async () => {
			// Arrange
			mockRequestPasswordReset.mockRejectedValueOnce(
				new Error("Email send failed"),
			);
			const request = createRequest("POST", {
				email: "test@example.com",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			// 보안상 이유로 실패해도 같은 응답 반환
			expect(result).toEqual({ success: true });
		});

		it("서버 에러가 발생해도 성공 응답을 반환한다", async () => {
			// Arrange
			mockRequestPasswordReset.mockRejectedValueOnce(
				new Error("Internal server error"),
			);
			const request = createRequest("POST", {
				email: "test@example.com",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			// 보안상 이유로 실패해도 같은 응답 반환
			expect(result).toEqual({ success: true });
		});
	});
});
