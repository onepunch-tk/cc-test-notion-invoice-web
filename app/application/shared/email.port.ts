import type { ReactElement } from "react";

/**
 * 이메일 전송 옵션
 */
export interface SendEmailOptions {
	to: string;
	subject: string;
	react: ReactElement;
	from?: string;
}

/**
 * Email Service 인터페이스
 *
 * 이메일 발송 관련 추상화입니다.
 * 구현체는 Infrastructure 레이어에서 Resend로 제공됩니다.
 */
export interface IEmailService {
	/**
	 * 이메일 전송
	 */
	send(options: SendEmailOptions): Promise<void>;

	/**
	 * 이메일 인증 링크 전송
	 */
	sendVerificationEmail(email: string, verificationUrl: string): Promise<void>;

	/**
	 * 비밀번호 재설정 링크 전송
	 */
	sendPasswordResetEmail(email: string, resetUrl: string): Promise<void>;
}
