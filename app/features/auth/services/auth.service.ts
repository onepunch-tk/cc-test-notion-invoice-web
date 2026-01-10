/**
 * 인증 비즈니스 로직 서비스
 *
 * 인증 관련 비즈니스 로직을 처리합니다.
 * 향후 추가될 기능:
 * - 사용자 회원가입 후처리
 * - 사용자 프로필 생성
 * - 인증 이벤트 로깅
 * - 추가 검증 로직
 */

import type { AuthInstance } from "~/lib/auth.server";

/**
 * 회원가입 후처리 로직
 *
 * @param userId - 생성된 사용자 ID
 * @param email - 사용자 이메일
 */
export const handlePostSignup = async (
	userId: string,
	email: string,
): Promise<void> => {
	// TODO: 회원가입 후처리 로직 구현
	// 예: 프로필 초기화, 웰컴 이메일 전송, 분석 이벤트 기록 등
	console.log(`사용자 생성 완료: ${userId} (${email})`);
};

/**
 * 로그인 후처리 로직
 *
 * @param userId - 로그인한 사용자 ID
 */
export const handlePostLogin = async (userId: string): Promise<void> => {
	// TODO: 로그인 후처리 로직 구현
	// 예: 마지막 로그인 시간 업데이트, 로그인 이벤트 기록 등
	console.log(`사용자 로그인: ${userId}`);
};

/**
 * 로그아웃 후처리 로직
 *
 * @param userId - 로그아웃한 사용자 ID
 */
export const handlePostLogout = async (userId: string): Promise<void> => {
	// TODO: 로그아웃 후처리 로직 구현
	// 예: 세션 정리, 로그아웃 이벤트 기록 등
	console.log(`사용자 로그아웃: ${userId}`);
};
