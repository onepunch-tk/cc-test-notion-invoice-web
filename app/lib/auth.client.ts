import { createAuthClient } from "better-auth/react";

/**
 * Better-auth 클라이언트
 *
 * 브라우저에서 사용되는 인증 클라이언트
 * 서버의 /api/auth/* 엔드포인트와 통신
 */
export const authClient = createAuthClient({
	baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

/**
 * 이메일/비밀번호 회원가입
 *
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @param name - 사용자 이름
 */
export const signUp = async (email: string, password: string, name: string) => {
	return authClient.signUp.email({
		email,
		password,
		name,
	});
};

/**
 * 이메일/비밀번호 로그인
 *
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 */
export const signIn = async (email: string, password: string) => {
	return authClient.signIn.email({
		email,
		password,
	});
};

/**
 * GitHub OAuth 로그인
 */
export const signInWithGitHub = async () => {
	return authClient.signIn.social({
		provider: "github",
		callbackURL: "/dashboard",
	});
};

/**
 * Google OAuth 로그인
 */
export const signInWithGoogle = async () => {
	return authClient.signIn.social({
		provider: "google",
		callbackURL: "/dashboard",
	});
};

/**
 * 로그아웃
 */
export const signOut = async () => {
	return authClient.signOut();
};

/**
 * 비밀번호 재설정 요청
 *
 * @param email - 사용자 이메일
 */
export const forgotPassword = async (email: string) => {
	// Better-auth의 비밀번호 재설정 API 호출
	// 서버에서 이메일 전송 처리
	const response = await fetch("/api/auth/forget-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, redirectTo: "/auth/reset-password" }),
	});

	if (!response.ok) {
		const error = await response.json() as { message?: string };
		throw new Error(error.message || "비밀번호 재설정 요청에 실패했습니다.");
	}

	return response.json();
};

/**
 * 비밀번호 재설정
 *
 * @param newPassword - 새 비밀번호
 * @param token - 재설정 토큰
 */
export const resetPassword = async (newPassword: string, token: string) => {
	const response = await fetch("/api/auth/reset-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ newPassword, token }),
	});

	if (!response.ok) {
		const error = await response.json() as { message?: string };
		throw new Error(error.message || "비밀번호 재설정에 실패했습니다.");
	}

	return response.json();
};

/**
 * 현재 세션 가져오기
 */
export const getSession = async () => {
	return authClient.getSession();
};

/**
 * 사용자 정보 업데이트
 *
 * @param data - 업데이트할 사용자 데이터
 */
export const updateUser = async (data: { name?: string; image?: string }) => {
	return authClient.updateUser(data);
};
