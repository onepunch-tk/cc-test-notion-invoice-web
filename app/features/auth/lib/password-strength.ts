import type {
	PasswordStrength,
	PasswordStrengthLevel,
} from "~/features/auth/types";

/**
 * 비밀번호 강도 계산
 *
 * 비밀번호의 강도를 0-100 점수로 계산하고 레벨을 반환합니다.
 *
 * ## 점수 계산 기준:
 * - 길이 점수 (최대 30점):
 *   - 8자 이상: 10점
 *   - 12자 이상: 추가 10점
 *   - 16자 이상: 추가 10점
 * - 소문자 포함: 20점
 * - 대문자 포함: 20점
 * - 숫자 포함: 20점
 * - 특수문자 포함: 10점
 *
 * ## 레벨 결정:
 * - 0-39: 약함 (weak)
 * - 40-69: 보통 (medium)
 * - 70-100: 강함 (strong)
 *
 * @param password - 검사할 비밀번호
 * @returns 비밀번호 강도 결과 (점수, 레벨, 메시지)
 */
export const calculatePasswordStrength = (
	password: string,
): PasswordStrength => {
	let score = 0;

	// 길이 점수 (최대 30점)
	if (password.length >= 8) score += 10;
	if (password.length >= 12) score += 10;
	if (password.length >= 16) score += 10;

	// 문자 다양성 점수
	if (/[a-z]/.test(password)) score += 20; // 소문자
	if (/[A-Z]/.test(password)) score += 20; // 대문자
	if (/[0-9]/.test(password)) score += 20; // 숫자
	if (/[^A-Za-z0-9]/.test(password)) score += 10; // 특수문자

	// 레벨 및 메시지 결정
	let level: PasswordStrengthLevel;
	let message: string;

	if (score < 40) {
		level = "weak";
		message = "약함";
	} else if (score < 70) {
		level = "medium";
		message = "보통";
	} else {
		level = "strong";
		message = "강함";
	}

	return { score, level, message };
};
