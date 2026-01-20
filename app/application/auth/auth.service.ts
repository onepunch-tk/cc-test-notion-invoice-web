import { DuplicateEmailError } from "~/domain/auth";
import type { IUser } from "~/domain/user";
import type { IUserRepository } from "../user/user.port";
import type {
	IAuthProvider,
	OAuthSignInResult,
	SignInResult,
} from "./auth.port";

/**
 * Auth Service 타입
 */
export type AuthService = ReturnType<typeof createAuthService>;

/**
 * Auth Service 팩토리
 *
 * 인증 관련 비즈니스 로직을 제공합니다.
 *
 * @param authProvider - 인증 프로바이더
 * @param userRepository - 사용자 저장소
 */
export const createAuthService = (
	authProvider: IAuthProvider,
	userRepository: IUserRepository,
) => ({
	/**
	 * 현재 세션에서 사용자 정보 조회
	 */
	async getCurrentUser(headers: Headers): Promise<IUser | null> {
		const session = await authProvider.getSession(headers);
		return session?.user ?? null;
	},

	/**
	 * 이메일/비밀번호 로그인
	 */
	async signIn(
		email: string,
		password: string,
		headers: Headers,
	): Promise<SignInResult> {
		return authProvider.signInWithCredentials(email, password, headers);
	},

	/**
	 * 이메일/비밀번호 회원가입
	 *
	 * 1. 이메일 중복 체크
	 * 2. Better-auth로 사용자 생성 (프로필은 databaseHooks에서 자동 생성)
	 */
	async signUp(
		email: string,
		password: string,
		name: string,
		headers: Headers,
	): Promise<IUser> {
		// 1. 이메일 중복 체크
		const existingUser = await userRepository.findByEmail(email);
		if (existingUser) {
			throw new DuplicateEmailError();
		}

		// 2. Better-auth로 사용자 생성 (프로필은 databaseHooks에서 자동 생성)
		const result = await authProvider.signUpWithCredentials(
			email,
			password,
			name,
			headers,
		);

		return result.user;
	},

	/**
	 * OAuth 로그인
	 */
	async signInWithOAuth(
		provider: "github" | "google" | "kakao",
		callbackURL: string,
		headers: Headers,
	): Promise<OAuthSignInResult> {
		return authProvider.signInWithOAuth(provider, callbackURL, headers);
	},

	/**
	 * 로그아웃
	 */
	async signOut(headers: Headers): Promise<void> {
		return authProvider.signOut(headers);
	},

	/**
	 * 비밀번호 변경
	 */
	async changePassword(
		currentPassword: string,
		newPassword: string,
		revokeOtherSessions: boolean,
		headers: Headers,
	): Promise<void> {
		return authProvider.changePassword(
			currentPassword,
			newPassword,
			revokeOtherSessions,
			headers,
		);
	},

	/**
	 * 비밀번호 재설정 요청
	 */
	async requestPasswordReset(email: string, headers: Headers): Promise<void> {
		return authProvider.requestPasswordReset(email, headers);
	},

	/**
	 * 비밀번호 재설정 실행
	 */
	async resetPassword(
		newPassword: string,
		token: string,
		headers: Headers,
	): Promise<void> {
		return authProvider.resetPassword(newPassword, token, headers);
	},
});
