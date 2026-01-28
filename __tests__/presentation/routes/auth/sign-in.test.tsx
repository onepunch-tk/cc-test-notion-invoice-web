import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/sign-in";

/**
 * sign-in 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 이메일/비밀번호 로그인
 * - OAuth 로그인 (GitHub)
 * - 유효성 검증 실패
 * - HTTP 메서드 검증
 */

// Mock authService
const mockSignIn = vi.fn();
const mockSignInWithOAuth = vi.fn();

const mockAuthService = {
	signIn: mockSignIn,
	signInWithOAuth: mockSignInWithOAuth,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (
	method: string,
	formData: Record<string, string>,
	url = "http://localhost:3000/auth/signin",
): Request => {
	const form = new FormData();
	for (const [key, value] of Object.entries(formData)) {
		form.append(key, value);
	}
	return new Request(url, {
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

describe("sign-in action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("HTTP 메서드 검증", () => {
		it("POST가 아닌 요청은 에러를 반환한다", async () => {
			// Arrange
			const request = new Request("http://localhost:3000/auth/signin", {
				method: "GET",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "POST 요청만 허용됩니다." });
		});
	});

	describe("이메일/비밀번호 로그인", () => {
		it("유효한 자격증명으로 로그인 성공 시 대시보드로 리다이렉트한다", async () => {
			// Arrange
			mockSignIn.mockResolvedValueOnce({ setCookie: "session=abc123" });
			const request = createRequest("POST", {
				email: "test@example.com",
				password: "Test1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockSignIn).toHaveBeenCalledWith(
				"test@example.com",
				"Test1234!",
				expect.any(Headers),
			);
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe("/my/dashboard");
			expect(response.headers.get("Set-Cookie")).toBe("session=abc123");
		});

		it("redirectTo 파라미터가 있으면 해당 경로로 리다이렉트한다", async () => {
			// Arrange
			mockSignIn.mockResolvedValueOnce({ setCookie: "session=abc123" });
			const request = createRequest(
				"POST",
				{
					email: "test@example.com",
					password: "Test1234!",
				},
				"http://localhost:3000/auth/signin?redirectTo=/my/settings",
			);
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.headers.get("Location")).toBe("/my/settings");
		});

		it("setCookie가 null이면 쿠키 없이 리다이렉트한다", async () => {
			// Arrange
			mockSignIn.mockResolvedValueOnce({ setCookie: null });
			const request = createRequest("POST", {
				email: "test@example.com",
				password: "Test1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Set-Cookie")).toBeNull();
		});

		it("로그인 실패 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));
			const request = createRequest("POST", {
				email: "test@example.com",
				password: "wrongpassword",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("error");
			expect((result as { error: string }).error).toBe(
				"로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
			);
		});
	});

	describe("폼 유효성 검증", () => {
		it("이메일 형식이 잘못된 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				email: "invalid-email",
				password: "Test1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("email");
		});

		it("비밀번호가 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest("POST", {
				email: "test@example.com",
				password: "",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("errors");
			const errors = (result as { errors: Record<string, unknown> }).errors;
			expect(errors).toHaveProperty("password");
		});
	});

	describe("OAuth 로그인 (GitHub)", () => {
		it("GitHub 로그인 요청 시 리다이렉트 URL로 이동한다", async () => {
			// Arrange
			mockSignInWithOAuth.mockResolvedValueOnce({
				redirectUrl: "https://github.com/login/oauth/authorize?...",
				setCookies: ["oauth_state=xyz789"],
			});
			const request = createRequest("POST", {
				provider: "github",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockSignInWithOAuth).toHaveBeenCalledWith(
				"github",
				"/my/dashboard",
				expect.any(Headers),
			);
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe(
				"https://github.com/login/oauth/authorize?...",
			);
			expect(response.headers.get("Set-Cookie")).toBe("oauth_state=xyz789");
		});

		it("OAuth 리다이렉트 URL이 없으면 에러를 반환한다", async () => {
			// Arrange
			mockSignInWithOAuth.mockResolvedValueOnce({
				redirectUrl: null,
				setCookies: [],
			});
			const request = createRequest("POST", {
				provider: "github",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({
				error: "소셜 로그인 URL을 생성할 수 없습니다.",
			});
		});

		it("OAuth 로그인 실패 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockSignInWithOAuth.mockRejectedValueOnce(new Error("OAuth error"));
			const request = createRequest("POST", {
				provider: "github",
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
