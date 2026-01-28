import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader } from "~/presentation/routes/layouts/private.layout";
import type { IUser } from "~/domain/user";

/**
 * private.layout 라우트 Loader 테스트
 *
 * 테스트 대상:
 * - 인증된 사용자: 사용자 정보 반환
 * - 미인증 사용자: 로그인 페이지로 리다이렉트
 */

// Mock authService
const mockGetCurrentUser = vi.fn();

const mockAuthService = {
	getCurrentUser: mockGetCurrentUser,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (url = "http://localhost:3000/my/dashboard"): Request => {
	return new Request(url, {
		method: "GET",
	});
};

// Helper: LoaderArgs 생성
const createLoaderArgs = (request: Request) =>
	({
		request,
		context: { container: mockContainer },
		params: {},
	}) as unknown as Parameters<typeof loader>[0];

// Mock User 데이터
const mockUser: IUser = {
	id: "user-123",
	name: "홍길동",
	email: "test@example.com",
	emailVerified: true,
	image: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("private.layout loader", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("인증된 사용자", () => {
		it("인증된 사용자의 정보를 반환한다", async () => {
			// Arrange
			mockGetCurrentUser.mockResolvedValueOnce(mockUser);
			const request = createRequest();
			const args = createLoaderArgs(request);

			// Act
			const result = await loader(args);

			// Assert
			expect(mockGetCurrentUser).toHaveBeenCalledWith(expect.any(Headers));
			expect(result).toEqual({ user: mockUser });
		});

		it("이메일 미인증 사용자도 정보를 반환한다", async () => {
			// Arrange
			const unverifiedUser: IUser = {
				...mockUser,
				emailVerified: false,
			};
			mockGetCurrentUser.mockResolvedValueOnce(unverifiedUser);
			const request = createRequest();
			const args = createLoaderArgs(request);

			// Act
			const result = await loader(args);

			// Assert
			expect(result).toEqual({ user: unverifiedUser });
		});

		it("프로필 이미지가 있는 사용자의 정보도 정상적으로 반환한다", async () => {
			// Arrange
			const userWithImage: IUser = {
				...mockUser,
				image: "https://example.com/avatar.png",
			};
			mockGetCurrentUser.mockResolvedValueOnce(userWithImage);
			const request = createRequest();
			const args = createLoaderArgs(request);

			// Act
			const result = await loader(args);

			// Assert
			expect(result).toEqual({ user: userWithImage });
		});
	});

	describe("미인증 사용자", () => {
		it("미인증 사용자는 로그인 페이지로 리다이렉트된다", async () => {
			// Arrange
			mockGetCurrentUser.mockResolvedValueOnce(null);
			const request = createRequest("http://localhost:3000/my/dashboard");
			const args = createLoaderArgs(request);

			// Act & Assert
			await expect(loader(args)).rejects.toBeInstanceOf(Response);
			try {
				await loader(args);
			} catch (error) {
				const response = error as Response;
				expect(response.status).toBe(302);
				expect(response.headers.get("Location")).toBe(
					"/auth/signin?redirectTo=%2Fmy%2Fdashboard",
				);
			}
		});

		it("설정 페이지 접근 시 설정 페이지 URL이 redirectTo에 포함된다", async () => {
			// Arrange
			mockGetCurrentUser.mockResolvedValueOnce(null);
			const request = createRequest("http://localhost:3000/my/settings");
			const args = createLoaderArgs(request);

			// Act & Assert
			try {
				await loader(args);
			} catch (error) {
				const response = error as Response;
				expect(response.headers.get("Location")).toBe(
					"/auth/signin?redirectTo=%2Fmy%2Fsettings",
				);
			}
		});

		it("쿼리 파라미터가 있는 URL도 redirectTo에 포함된다", async () => {
			// Arrange
			mockGetCurrentUser.mockResolvedValueOnce(null);
			const request = createRequest(
				"http://localhost:3000/my/dashboard?tab=overview",
			);
			const args = createLoaderArgs(request);

			// Act & Assert
			try {
				await loader(args);
			} catch (error) {
				const response = error as Response;
				expect(response.headers.get("Location")).toBe(
					"/auth/signin?redirectTo=%2Fmy%2Fdashboard%3Ftab%3Doverview",
				);
			}
		});
	});
});
