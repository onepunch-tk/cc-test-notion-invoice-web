import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthService } from "~/application/auth/auth.service";
import { SESSION_COOKIE_NAMES } from "~/application/auth/auth.const";
import type {
	IAuthProvider,
	OAuthSignInResult,
	SignInResult,
	SignUpResult,
} from "~/application/auth/auth.port";
import type { IUserRepository } from "~/application/user/user.port";
import { DuplicateEmailError } from "~/domain/auth";
import type { IUser } from "~/domain/user";

/**
 * Mock 사용자 데이터 생성 헬퍼
 */
const createMockUser = (overrides?: Partial<IUser>): IUser => ({
	id: "user-123",
	name: "테스트 사용자",
	email: "test@example.com",
	emailVerified: true,
	image: null,
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
	...overrides,
});

/**
 * Mock AuthProvider 생성 헬퍼
 */
const createMockAuthProvider = (
	overrides?: Partial<IAuthProvider>,
): IAuthProvider => ({
	getSession: vi.fn(),
	signInWithCredentials: vi.fn(),
	signUpWithCredentials: vi.fn(),
	signInWithOAuth: vi.fn(),
	signOut: vi.fn(),
	changePassword: vi.fn(),
	requestPasswordReset: vi.fn(),
	resetPassword: vi.fn(),
	...overrides,
});

/**
 * Mock UserRepository 생성 헬퍼
 */
const createMockUserRepository = (
	overrides?: Partial<IUserRepository>,
): IUserRepository => ({
	findById: vi.fn(),
	findByEmail: vi.fn(),
	findWithProfile: vi.fn(),
	update: vi.fn(),
	...overrides,
});

describe("AuthService", () => {
	let mockAuthProvider: IAuthProvider;
	let mockUserRepository: IUserRepository;
	let authService: ReturnType<typeof createAuthService>;
	let mockHeaders: Headers;

	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthProvider = createMockAuthProvider();
		mockUserRepository = createMockUserRepository();
		authService = createAuthService(mockAuthProvider, mockUserRepository);
		mockHeaders = new Headers();
	});

	describe("getCurrentUser", () => {
		it("세션이 존재하면 사용자를 반환한다", async () => {
			// Arrange
			const mockUser = createMockUser();
			vi.mocked(mockAuthProvider.getSession).mockResolvedValue({
				user: mockUser,
			});

			// Act
			const result = await authService.getCurrentUser(mockHeaders);

			// Assert
			expect(result).toEqual(mockUser);
			expect(mockAuthProvider.getSession).toHaveBeenCalledWith(mockHeaders);
		});

		it("세션이 존재하지 않으면 null을 반환한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.getSession).mockResolvedValue(null);

			// Act
			const result = await authService.getCurrentUser(mockHeaders);

			// Assert
			expect(result).toBeNull();
			expect(mockAuthProvider.getSession).toHaveBeenCalledWith(mockHeaders);
		});
	});

	describe("signIn", () => {
		it("인증 성공 시 로그인 결과를 반환한다", async () => {
			// Arrange
			const email = "test@example.com";
			const password = "password123";
			const expectedResult: SignInResult = {
				setCookie: "session_token=abc123; Path=/; HttpOnly",
			};
			vi.mocked(mockAuthProvider.signInWithCredentials).mockResolvedValue(
				expectedResult,
			);

			// Act
			const result = await authService.signIn(email, password, mockHeaders);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockAuthProvider.signInWithCredentials).toHaveBeenCalledWith(
				email,
				password,
				mockHeaders,
			);
		});

		it("인증 실패 시 setCookie가 null인 결과를 반환한다", async () => {
			// Arrange
			const email = "test@example.com";
			const password = "wrong-password";
			const expectedResult: SignInResult = {
				setCookie: null,
			};
			vi.mocked(mockAuthProvider.signInWithCredentials).mockResolvedValue(
				expectedResult,
			);

			// Act
			const result = await authService.signIn(email, password, mockHeaders);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(result.setCookie).toBeNull();
		});
	});

	describe("signUp", () => {
		it("신규 사용자를 성공적으로 생성한다", async () => {
			// Arrange
			const email = "newuser@example.com";
			const password = "password123";
			const name = "신규 사용자";
			const signUpResult: SignUpResult = {
				user: {
					id: "new-user-id",
					name,
					email,
					emailVerified: false,
					image: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
			vi.mocked(mockAuthProvider.signUpWithCredentials).mockResolvedValue(
				signUpResult,
			);

			// Act
			const result = await authService.signUp(
				email,
				password,
				name,
				mockHeaders,
			);

			// Assert
			expect(result).toEqual(signUpResult.user);
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
			expect(mockAuthProvider.signUpWithCredentials).toHaveBeenCalledWith(
				email,
				password,
				name,
				mockHeaders,
			);
		});

		it("이메일이 중복되면 DuplicateEmailError를 던진다", async () => {
			// Arrange
			const email = "existing@example.com";
			const password = "password123";
			const name = "기존 사용자";
			const existingUser = createMockUser({ email });
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(existingUser);

			// Act & Assert
			await expect(
				authService.signUp(email, password, name, mockHeaders),
			).rejects.toThrow(DuplicateEmailError);
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
			expect(mockAuthProvider.signUpWithCredentials).not.toHaveBeenCalled();
		});

		it("이메일 인증이 필요한 경우 id가 없는 사용자 정보를 반환한다", async () => {
			// Arrange
			const email = "newuser@example.com";
			const password = "password123";
			const name = "신규 사용자";
			const signUpResult: SignUpResult = {
				user: {
					name,
					email,
					emailVerified: false,
					image: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
			vi.mocked(mockAuthProvider.signUpWithCredentials).mockResolvedValue(
				signUpResult,
			);

			// Act
			const result = await authService.signUp(
				email,
				password,
				name,
				mockHeaders,
			);

			// Assert
			expect(result.id).toBeUndefined();
			expect(result.email).toBe(email);
		});
	});

	describe("signInWithOAuth", () => {
		it("GitHub OAuth 로그인 시 리다이렉트 URL을 반환한다", async () => {
			// Arrange
			const provider = "github" as const;
			const callbackURL = "/auth/callback";
			const expectedResult: OAuthSignInResult = {
				redirectUrl: "https://github.com/login/oauth/authorize?...",
				setCookies: ["oauth_state=xyz; Path=/; HttpOnly"],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(
				expectedResult,
			);

			// Act
			const result = await authService.signInWithOAuth(
				provider,
				callbackURL,
				mockHeaders,
			);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				provider,
				callbackURL,
				mockHeaders,
			);
		});

		it("Google OAuth 로그인 시 리다이렉트 URL을 반환한다", async () => {
			// Arrange
			const provider = "google" as const;
			const callbackURL = "/auth/callback";
			const expectedResult: OAuthSignInResult = {
				redirectUrl: "https://accounts.google.com/o/oauth2/auth?...",
				setCookies: ["oauth_state=abc; Path=/; HttpOnly"],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(
				expectedResult,
			);

			// Act
			const result = await authService.signInWithOAuth(
				provider,
				callbackURL,
				mockHeaders,
			);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				provider,
				callbackURL,
				mockHeaders,
			);
		});

		it("Kakao OAuth 로그인 시 리다이렉트 URL을 반환한다", async () => {
			// Arrange
			const provider = "kakao" as const;
			const callbackURL = "/auth/callback";
			const expectedResult: OAuthSignInResult = {
				redirectUrl: "https://kauth.kakao.com/oauth/authorize?...",
				setCookies: ["oauth_state=def; Path=/; HttpOnly"],
			};
			vi.mocked(mockAuthProvider.signInWithOAuth).mockResolvedValue(
				expectedResult,
			);

			// Act
			const result = await authService.signInWithOAuth(
				provider,
				callbackURL,
				mockHeaders,
			);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockAuthProvider.signInWithOAuth).toHaveBeenCalledWith(
				provider,
				callbackURL,
				mockHeaders,
			);
		});
	});

	describe("signOut", () => {
		it("로그아웃을 성공적으로 수행한다", async () => {
			// Arrange
			vi.mocked(mockAuthProvider.signOut).mockResolvedValue(undefined);

			// Act
			await authService.signOut(mockHeaders);

			// Assert
			expect(mockAuthProvider.signOut).toHaveBeenCalledWith(mockHeaders);
		});
	});

	describe("changePassword", () => {
		it("비밀번호를 성공적으로 변경한다", async () => {
			// Arrange
			const currentPassword = "oldPassword123";
			const newPassword = "newPassword456";
			const revokeOtherSessions = true;
			vi.mocked(mockAuthProvider.changePassword).mockResolvedValue(undefined);

			// Act
			await authService.changePassword(
				currentPassword,
				newPassword,
				revokeOtherSessions,
				mockHeaders,
			);

			// Assert
			expect(mockAuthProvider.changePassword).toHaveBeenCalledWith(
				currentPassword,
				newPassword,
				revokeOtherSessions,
				mockHeaders,
			);
		});

		it("다른 세션을 유지하면서 비밀번호를 변경할 수 있다", async () => {
			// Arrange
			const currentPassword = "oldPassword123";
			const newPassword = "newPassword456";
			const revokeOtherSessions = false;
			vi.mocked(mockAuthProvider.changePassword).mockResolvedValue(undefined);

			// Act
			await authService.changePassword(
				currentPassword,
				newPassword,
				revokeOtherSessions,
				mockHeaders,
			);

			// Assert
			expect(mockAuthProvider.changePassword).toHaveBeenCalledWith(
				currentPassword,
				newPassword,
				false,
				mockHeaders,
			);
		});
	});

	describe("requestPasswordReset", () => {
		it("비밀번호 재설정 요청을 성공적으로 수행한다", async () => {
			// Arrange
			const email = "test@example.com";
			vi.mocked(mockAuthProvider.requestPasswordReset).mockResolvedValue(
				undefined,
			);

			// Act
			await authService.requestPasswordReset(email, mockHeaders);

			// Assert
			expect(mockAuthProvider.requestPasswordReset).toHaveBeenCalledWith(
				email,
				mockHeaders,
			);
		});
	});

	describe("resetPassword", () => {
		it("비밀번호 재설정을 성공적으로 수행한다", async () => {
			// Arrange
			const newPassword = "newSecurePassword123";
			const token = "reset-token-abc123";
			vi.mocked(mockAuthProvider.resetPassword).mockResolvedValue(undefined);

			// Act
			await authService.resetPassword(newPassword, token, mockHeaders);

			// Assert
			expect(mockAuthProvider.resetPassword).toHaveBeenCalledWith(
				newPassword,
				token,
				mockHeaders,
			);
		});
	});

	describe("clearSessionHeaders", () => {
		it("모든 세션 쿠키를 삭제하는 헤더를 반환한다", () => {
			// Arrange & Act
			const headers = authService.clearSessionHeaders();

			// Assert
			const setCookieHeaders = headers.getSetCookie();
			expect(setCookieHeaders).toHaveLength(SESSION_COOKIE_NAMES.length);

			for (const cookieName of SESSION_COOKIE_NAMES) {
				const hasExpiredCookie = setCookieHeaders.some(
					(cookie) =>
						cookie.includes(cookieName) &&
						cookie.includes("Expires=Thu, 01 Jan 1970 00:00:00 GMT") &&
						cookie.includes("HttpOnly"),
				);
				expect(hasExpiredCookie).toBe(true);
			}
		});

		it("쿠키에 Path=/가 설정되어 있다", () => {
			// Arrange & Act
			const headers = authService.clearSessionHeaders();

			// Assert
			const setCookieHeaders = headers.getSetCookie();
			for (const cookie of setCookieHeaders) {
				expect(cookie).toContain("Path=/");
			}
		});
	});
});
