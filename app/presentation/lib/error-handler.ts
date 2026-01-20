/**
 * Better-auth 에러 처리 유틸리티
 *
 * Better-auth의 공식 에러 코드를 사용하여 타입 안전한 에러 처리를 제공합니다.
 */

import { BASE_ERROR_CODES } from "@better-auth/core/error";

/**
 * Better-auth 에러 코드에 대응하는 한글 메시지 매핑
 */
const AUTH_ERROR_MESSAGES: Partial<
	Record<keyof typeof BASE_ERROR_CODES, string>
> = {
	// 로그인 관련
	INVALID_EMAIL_OR_PASSWORD: "이메일 또는 비밀번호가 올바르지 않습니다.",
	EMAIL_NOT_VERIFIED: "이메일 인증을 완료해주세요.",
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
	INVALID_PASSWORD: "비밀번호가 올바르지 않습니다.",
	INVALID_EMAIL: "올바르지 않은 이메일 형식입니다.",

	// 토큰 관련
	INVALID_TOKEN: "유효하지 않거나 만료된 링크입니다.",
	SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",

	// 계정 관련
	USER_ALREADY_EXISTS: "이미 등록된 이메일입니다.",
	CREDENTIAL_ACCOUNT_NOT_FOUND: "계정 정보를 찾을 수 없습니다.",

	// 비밀번호 관련
	PASSWORD_TOO_SHORT: "비밀번호가 너무 짧습니다.",
	PASSWORD_TOO_LONG: "비밀번호가 너무 깁니다.",

	// 인증 관련
	EMAIL_ALREADY_VERIFIED: "이미 인증된 이메일입니다.",
	VERIFICATION_EMAIL_NOT_ENABLED: "이메일 인증이 활성화되지 않았습니다.",
} as const;

/**
 * OAuth 관련 에러 코드에 대응하는 한글 메시지 매핑
 *
 * Better-auth의 BASE_ERROR_CODES에 포함되지 않은 OAuth 관련 에러 코드들입니다.
 * 주로 state 검증 실패나 OAuth 콜백 처리 중 발생하는 에러입니다.
 */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
	state_not_found: "OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.",
	state_mismatch: "OAuth 인증 상태가 일치하지 않습니다. 다시 시도해주세요.",
	invalid_state: "유효하지 않은 인증 상태입니다. 다시 시도해주세요.",
	oauth_error: "OAuth 인증 중 오류가 발생했습니다.",
	access_denied: "접근이 거부되었습니다.",
	invalid_request: "잘못된 요청입니다.",
	unauthorized_client: "인증되지 않은 클라이언트입니다.",
	unsupported_response_type: "지원하지 않는 응답 형식입니다.",
	invalid_scope: "유효하지 않은 권한 범위입니다.",
	server_error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
	temporarily_unavailable: "서비스를 일시적으로 사용할 수 없습니다.",
} as const;

/**
 * Better-auth 에러를 사용자 친화적인 한글 메시지로 변환
 *
 * @param error - 발생한 에러 객체
 * @param defaultMessage - 매칭되는 에러가 없을 때 사용할 기본 메시지
 * @returns 사용자 친화적인 한글 에러 메시지
 *
 * @example
 * ```typescript
 * try {
 *   await signInWithCredentials({ ... });
 * } catch (error) {
 *   const message = getAuthErrorMessage(error, "로그인에 실패했습니다.");
 *   return { error: message };
 * }
 * ```
 */
export const getAuthErrorMessage = (
	error: unknown,
	defaultMessage = "처리 중 오류가 발생했습니다.",
): string => {
	// Error 객체가 아닌 경우
	if (!(error instanceof Error)) {
		return defaultMessage;
	}

	// Better-auth 에러 코드 매칭
	// BASE_ERROR_CODES의 값(메시지)과 error.message를 정확히 비교
	const errorEntry = Object.entries(BASE_ERROR_CODES).find(
		([_, codeMessage]) => error.message === codeMessage,
	);

	// 매칭되는 에러 코드가 있으면 한글 메시지 반환
	if (errorEntry) {
		const [code] = errorEntry;
		const koreanMessage =
			AUTH_ERROR_MESSAGES[code as keyof typeof BASE_ERROR_CODES];
		if (koreanMessage) {
			return koreanMessage;
		}
	}

	// OAuth 에러 코드 매칭 (에러 메시지에 코드가 포함된 경우)
	const oauthErrorCode = Object.keys(OAUTH_ERROR_MESSAGES).find(
		(code) =>
			error.message.toLowerCase().includes(code) ||
			error.message.toLowerCase().includes(code.replace(/_/g, " ")),
	);

	if (oauthErrorCode) {
		return OAUTH_ERROR_MESSAGES[oauthErrorCode];
	}

	// 매칭되지 않으면 기본 메시지 반환
	return defaultMessage;
};
