/**
 * 인증 관련 상수
 */

// Better-auth 쿠키 접두사
export const COOKIE_PREFIX = "cc-rr7";

// Better-auth 세션 쿠키 이름들
export const SESSION_COOKIE_NAMES = [
	`${COOKIE_PREFIX}.session_token`,
	`${COOKIE_PREFIX}.session_data`,
] as const;

// 세션 쿠키 클리어 헤더 생성
export const createClearSessionHeaders = (): Headers => {
	const headers = new Headers();
	for (const name of SESSION_COOKIE_NAMES) {
		headers.append(
			"Set-Cookie",
			`${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
		);
	}
	return headers;
};
