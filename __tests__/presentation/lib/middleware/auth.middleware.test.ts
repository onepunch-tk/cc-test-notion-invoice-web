import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	requireAuth,
	getOptionalAuth,
	type MiddlewareContext,
} from "~/presentation/lib/middleware/auth.middleware";
import type { IUser } from "~/domain/user";
import type { IContainer } from "~/application/shared/container.types";

// react-router의 redirect 모킹
vi.mock("react-router", () => ({
	redirect: vi.fn((url: string) => {
		// redirect는 Response를 throw하는 것처럼 동작
		const error = new Response(null, {
			status: 302,
			headers: { Location: url },
		});
		throw error;
	}),
}));

// 테스트용 Mock 사용자 데이터
const createMockUser = (): IUser => ({
	id: "user-123",
	name: "Test User",
	email: "test@example.com",
	emailVerified: true,
	image: null,
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
});

// 테스트용 Mock Container 생성
const createMockContainer = (
	getCurrentUserReturn: IUser | null,
	shouldThrow = false,
): IContainer => {
	const mockAuthService = {
		getCurrentUser: vi.fn().mockImplementation(() => {
			if (shouldThrow) {
				return Promise.reject(new Error("Auth error"));
			}
			return Promise.resolve(getCurrentUserReturn);
		}),
		signIn: vi.fn(),
		signUp: vi.fn(),
		signInWithOAuth: vi.fn(),
		signOut: vi.fn(),
		changePassword: vi.fn(),
		requestPasswordReset: vi.fn(),
		resetPassword: vi.fn(),
		clearSessionHeaders: vi.fn(),
	};

	return {
		authService: mockAuthService,
		userService: {} as IContainer["userService"],
		emailService: {} as IContainer["emailService"],
		betterAuthHandler: vi.fn(),
	} as unknown as IContainer;
};

// 테스트용 Request 생성
const createMockRequest = (url: string): Request => {
	return new Request(url, {
		headers: new Headers({
			Cookie: "session=test-session",
		}),
	});
};

describe("requireAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("인증된 사용자의 경우 사용자 정보를 반환해야 한다", async () => {
		// Arrange: 인증된 사용자 설정
		const mockUser = createMockUser();
		const mockContainer = createMockContainer(mockUser);
		const mockRequest = createMockRequest("https://example.com/dashboard");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: requireAuth 실행
		const result = await requireAuth(context);

		// Assert: 사용자 정보 반환 확인
		expect(result).toEqual(mockUser);
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledWith(
			mockRequest.headers,
		);
	});

	it("미인증 사용자의 경우 로그인 페이지로 리다이렉트해야 한다", async () => {
		// Arrange: 미인증 사용자 설정
		const mockContainer = createMockContainer(null);
		const mockRequest = createMockRequest("https://example.com/dashboard");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act & Assert: redirect가 throw되는지 확인
		try {
			await requireAuth(context);
			// 여기까지 도달하면 실패
			expect.fail("redirect가 throw되어야 한다");
		} catch (error) {
			// redirect가 Response를 throw함
			expect(error).toBeInstanceOf(Response);
			const response = error as Response;
			expect(response.status).toBe(302);
			expect(response.headers.get("Location")).toBe(
				"/auth/signin?redirectTo=%2Fdashboard",
			);
		}
	});

	it("미인증 시 현재 URL을 redirectTo 파라미터로 포함해야 한다", async () => {
		// Arrange: 미인증 사용자 및 쿼리스트링이 있는 URL 설정
		const mockContainer = createMockContainer(null);
		const mockRequest = createMockRequest(
			"https://example.com/settings?tab=profile",
		);

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act & Assert: redirect URL에 쿼리스트링 포함 확인
		try {
			await requireAuth(context);
			expect.fail("redirect가 throw되어야 한다");
		} catch (error) {
			expect(error).toBeInstanceOf(Response);
			const response = error as Response;
			const location = response.headers.get("Location");
			// /settings?tab=profile이 인코딩되어야 함
			expect(location).toBe(
				"/auth/signin?redirectTo=%2Fsettings%3Ftab%3Dprofile",
			);
		}
	});

	it("authService.getCurrentUser를 올바른 헤더와 함께 호출해야 한다", async () => {
		// Arrange: 인증된 사용자 설정
		const mockUser = createMockUser();
		const mockContainer = createMockContainer(mockUser);
		const mockRequest = createMockRequest("https://example.com/api/data");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: requireAuth 실행
		await requireAuth(context);

		// Assert: getCurrentUser가 request.headers와 함께 호출되었는지 확인
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledTimes(1);
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledWith(
			mockRequest.headers,
		);
	});
});

describe("getOptionalAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("인증된 사용자의 경우 사용자 정보를 반환해야 한다", async () => {
		// Arrange: 인증된 사용자 설정
		const mockUser = createMockUser();
		const mockContainer = createMockContainer(mockUser);
		const mockRequest = createMockRequest("https://example.com/");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: getOptionalAuth 실행
		const result = await getOptionalAuth(context);

		// Assert: 사용자 정보 반환 확인
		expect(result).toEqual(mockUser);
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledWith(
			mockRequest.headers,
		);
	});

	it("미인증 사용자의 경우 null을 반환해야 한다", async () => {
		// Arrange: 미인증 사용자 설정
		const mockContainer = createMockContainer(null);
		const mockRequest = createMockRequest("https://example.com/");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: getOptionalAuth 실행
		const result = await getOptionalAuth(context);

		// Assert: null 반환 확인
		expect(result).toBeNull();
	});

	it("인증 서비스에서 에러가 발생해도 null을 반환해야 한다", async () => {
		// Arrange: 에러를 throw하는 authService 설정
		const mockContainer = createMockContainer(null, true);
		const mockRequest = createMockRequest("https://example.com/");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: getOptionalAuth 실행
		const result = await getOptionalAuth(context);

		// Assert: 에러 발생 시에도 null 반환 확인
		expect(result).toBeNull();
	});

	it("authService.getCurrentUser를 올바른 헤더와 함께 호출해야 한다", async () => {
		// Arrange: 사용자 설정
		const mockUser = createMockUser();
		const mockContainer = createMockContainer(mockUser);
		const mockRequest = createMockRequest("https://example.com/public");

		const context: MiddlewareContext = {
			request: mockRequest,
			container: mockContainer,
		};

		// Act: getOptionalAuth 실행
		await getOptionalAuth(context);

		// Assert: getCurrentUser가 request.headers와 함께 호출되었는지 확인
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledTimes(1);
		expect(mockContainer.authService.getCurrentUser).toHaveBeenCalledWith(
			mockRequest.headers,
		);
	});
});
