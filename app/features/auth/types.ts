import { z } from "zod";

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
	email: z.string().email("올바른 이메일 주소를 입력해주세요"),
	password: z.string().min(1, "비밀번호를 입력해주세요"),
	provider: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z.object({
	name: z.string().min(1, "이름을 입력해주세요"),
	email: z.string().email("올바른 이메일 주소를 입력해주세요"),
	password: z
		.string()
		.min(8, "비밀번호는 최소 8자 이상이어야 합니다")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"비밀번호는 대소문자와 숫자를 포함해야 합니다",
		),
});

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * 비밀번호 찾기 폼 스키마
 */
export const forgotPasswordSchema = z.object({
	email: z.string().email("올바른 이메일 주소를 입력해주세요"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * 비밀번호 재설정 폼 스키마
 */
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "비밀번호는 최소 8자 이상이어야 합니다")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"비밀번호는 대소문자와 숫자를 포함해야 합니다",
			),
		passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
		token: z.string().min(1, "유효하지 않은 재설정 링크입니다"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "비밀번호가 일치하지 않습니다",
		path: ["passwordConfirm"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * 비밀번호 변경 폼 스키마
 */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "현재 비밀번호를 입력하세요"),
		newPassword: z
			.string()
			.min(8, "비밀번호는 최소 8자 이상이어야 합니다")
			.regex(/[a-z]/, "소문자를 포함해야 합니다")
			.regex(/[A-Z]/, "대문자를 포함해야 합니다")
			.regex(/[0-9]/, "숫자를 포함해야 합니다"),
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

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
