import { z } from "zod";

/**
 * 비밀번호 검증을 위한 공통 스키마
 *
 * - 최소 8자 이상
 * - 대문자, 소문자, 숫자, 특수문자 필수
 */
const passwordSchema = z
	.string()
	.min(8, "비밀번호는 최소 8자 이상이어야 합니다")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
		"비밀번호는 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다",
	);

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
	email: z.email("올바른 이메일 주소를 입력해주세요"),
	password: z.string().min(1, "비밀번호를 입력해주세요"),
	provider: z.string().optional(),
});

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z.object({
	name: z.string().min(1, "이름을 입력해주세요"),
	email: z.email("올바른 이메일 주소를 입력해주세요"),
	password: passwordSchema,
	termsAgreed: z.boolean().refine((val) => val === true, {
		message: "이용약관에 동의해주세요",
	}),
});

/**
 * 비밀번호 찾기 폼 스키마
 */
export const forgotPasswordSchema = z.object({
	email: z.email("올바른 이메일 주소를 입력해주세요"),
});

/**
 * 비밀번호 재설정 폼 스키마
 */
export const resetPasswordSchema = z
	.object({
		newPassword: passwordSchema,
		newPasswordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
		token: z.string().min(1, "유효하지 않은 재설정 링크입니다"),
	})
	.refine((data) => data.newPassword === data.newPasswordConfirm, {
		message: "비밀번호가 일치하지 않습니다",
		path: ["newPasswordConfirm"],
	});

/**
 * 비밀번호 변경 폼 스키마
 */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "현재 비밀번호를 입력하세요"),
		newPassword: passwordSchema,
		newPasswordConfirm: z.string(),
	})
	.refine((data) => data.newPassword === data.newPasswordConfirm, {
		message: "새 비밀번호가 일치하지 않습니다",
		path: ["newPasswordConfirm"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "새 비밀번호는 현재 비밀번호와 달라야 합니다",
		path: ["newPassword"],
	});
