import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/auth/sign-out";

/**
 * sign-out 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 로그아웃 성공 시 홈으로 리다이렉트
 * - 로그아웃 실패 시에도 쿠키 삭제 후 홈으로 리다이렉트
 * - HTTP 메서드 검증 (POST만 허용)
 */

// Mock authService
const mockSignOut = vi.fn();
const mockClearSessionHeaders = vi.fn();

const mockAuthService = {
	signOut: mockSignOut,
	clearSessionHeaders: mockClearSessionHeaders,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (method: string): Request => {
	return new Request("http://localhost:3000/auth/signout", {
		method,
	});
};

// Helper: ActionArgs 생성
const createActionArgs = (request: Request) =>
	({
		request,
		context: { container: mockContainer },
		params: {},
	}) as unknown as Parameters<typeof action>[0];

describe("sign-out action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// 기본 clearSessionHeaders 응답
		mockClearSessionHeaders.mockReturnValue(
			new Headers({
				"Set-Cookie": "session=; Max-Age=0; Path=/",
			}),
		);
	});

	describe("HTTP 메서드 검증", () => {
		it("GET 요청은 405 에러를 던진다", async () => {
			// Arrange
			const request = createRequest("GET");
			const args = createActionArgs(request);

			// Act & Assert
			await expect(action(args)).rejects.toBeInstanceOf(Response);
			try {
				await action(args);
			} catch (error) {
				const response = error as Response;
				expect(response.status).toBe(405);
				expect(await response.text()).toBe("Method not allowed");
			}
		});

		it("PUT 요청은 405 에러를 던진다", async () => {
			// Arrange
			const request = createRequest("PUT");
			const args = createActionArgs(request);

			// Act & Assert
			await expect(action(args)).rejects.toBeInstanceOf(Response);
		});

		it("DELETE 요청은 405 에러를 던진다", async () => {
			// Arrange
			const request = createRequest("DELETE");
			const args = createActionArgs(request);

			// Act & Assert
			await expect(action(args)).rejects.toBeInstanceOf(Response);
		});
	});

	describe("로그아웃 성공", () => {
		it("로그아웃 성공 시 세션 쿠키를 삭제하고 홈으로 리다이렉트한다", async () => {
			// Arrange
			mockSignOut.mockResolvedValueOnce(undefined);
			const request = createRequest("POST");
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockClearSessionHeaders).toHaveBeenCalled();
			expect(mockSignOut).toHaveBeenCalledWith(expect.any(Headers));
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe("/");
			expect(response.headers.get("Set-Cookie")).toBe(
				"session=; Max-Age=0; Path=/",
			);
		});
	});

	describe("로그아웃 실패", () => {
		it("로그아웃 API 실패 시에도 쿠키를 삭제하고 홈으로 리다이렉트한다", async () => {
			// Arrange
			mockSignOut.mockRejectedValueOnce(new Error("Logout failed"));
			const request = createRequest("POST");
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			// 실패해도 쿠키는 삭제하고 홈으로 리다이렉트해야 함
			expect(mockClearSessionHeaders).toHaveBeenCalled();
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe("/");
			expect(response.headers.get("Set-Cookie")).toBe(
				"session=; Max-Age=0; Path=/",
			);
		});

		it("세션이 이미 만료된 경우에도 정상적으로 홈으로 리다이렉트한다", async () => {
			// Arrange
			mockSignOut.mockRejectedValueOnce(new Error("Session expired"));
			const request = createRequest("POST");
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toBeInstanceOf(Response);
			const response = result as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe("/");
		});
	});
});
