import type { z } from "zod";
import type {
	changePasswordSchema,
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signupSchema,
} from "./auth.schemas";

/**
 * 로그인 폼 데이터 타입
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 회원가입 폼 데이터 타입
 */
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * 비밀번호 찾기 폼 데이터 타입
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * 비밀번호 재설정 폼 데이터 타입
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * 비밀번호 변경 폼 데이터 타입
 */
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * 인증 관련 Action의 공통 응답 타입
 *
 * - error: 오류 메시지 (검증 실패, 인증 실패 등)
 * - success: 성공 여부 (forgot-password 등에서 사용)
 * - errors: Zod 검증 에러 (필드별 에러 메시지)
 *   - Zod v4의 $ZodFormattedError 타입과 일치
 */
export interface AuthActionResponse {
	error?: string;
	success?: boolean;
	message?: string;
	errors?: z.core.$ZodFormattedError<unknown>;
}

/**
 * 비밀번호 강도 레벨
 */
export type PasswordStrengthLevel = "weak" | "medium" | "strong";

/**
 * 비밀번호 강도 결과
 *
 * - score: 0-100 점수
 * - level: 강도 레벨 (약함/보통/강함)
 * - label: UI 표시용 레이블 (예: "약함", "보통", "강함")
 * - colorClass: Tailwind CSS 색상 클래스
 */
export interface PasswordStrength {
	score: number;
	level: PasswordStrengthLevel;
	label: string;
	colorClass: string;
}

/**
 * OAuth 프로바이더 타입
 */
export type OAuthProvider = "github" | "google" | "kakao";

/**
 * 세션 정보 타입
 */
export interface SessionInfo {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
}
