import type { ReactElement } from "react";
import { Resend } from "resend";
import PasswordResetEmail from "~/components/password-reset-email";
import VerificationEmail from "~/components/verification-email";
import {
	EmailSendError,
	EmailServiceNotConfiguredError,
} from "~/features/auth/errors";

/**
 * 이메일 전송 옵션
 */
interface SendEmailOptions {
	to: string;
	subject: string;
	react: ReactElement;
	from?: string;
}

/**
 * Resend 클라이언트 생성
 */
const createResendClient = (apiKey: string) => {
	return new Resend(apiKey);
};

/**
 * 이메일 전송
 *
 * @param options - 이메일 전송 옵션
 * @param apiKey - Resend API 키
 * @param defaultFrom - 기본 발신자 이메일
 * @throws EmailServiceNotConfiguredError API 키가 없을 경우
 * @throws EmailSendError 이메일 전송 실패 시
 */
export const sendEmail = async (
	options: SendEmailOptions,
	apiKey?: string,
	defaultFrom?: string,
): Promise<void> => {
	// API 키 검증
	if (!apiKey) {
		console.error("❌ RESEND_API_KEY 환경 변수가 설정되지 않았습니다.");
		throw new EmailServiceNotConfiguredError();
	}

	// 발신자 이메일 설정
	const fromEmail = options.from || defaultFrom || "onboarding@resend.dev";

	// Resend 클라이언트 생성
	const resend = createResendClient(apiKey);

	try {
		// 이메일 전송
		const result = await resend.emails.send({
			from: fromEmail,
			to: [options.to],
			subject: options.subject,
			react: options.react,
		});

		// 성공 로그
		if (process.env.NODE_ENV !== "production") {
			console.log("✅ 이메일 전송 성공:");
			console.log(`  - ID: ${result.data?.id}`);
			console.log(`  - To: ${options.to}`);
			console.log(`  - Subject: ${options.subject}`);
		}
	} catch (error) {
		console.error("❌ 이메일 전송 실패:", error);

		if (error instanceof Error) {
			throw new EmailSendError(`이메일 전송 실패: ${error.message}`);
		}

		throw new EmailSendError();
	}
};

/**
 * 이메일 인증 링크 전송
 */
export const sendVerificationEmail = async (
	email: string,
	token: string,
	baseURL: string,
	apiKey?: string,
	fromEmail?: string,
): Promise<void> => {
	const verificationUrl = `${baseURL}/auth/api/verify-email?token=${token}`;

	await sendEmail(
		{
			to: email,
			subject: "이메일 인증을 완료해주세요",
			react: VerificationEmail({ verificationUrl }),
		},
		apiKey,
		fromEmail,
	);
};

/**
 * 비밀번호 재설정 링크 전송
 */
export const sendPasswordResetEmail = async (
	email: string,
	token: string,
	baseURL: string,
	apiKey?: string,
	fromEmail?: string,
): Promise<void> => {
	const resetUrl = `${baseURL}/auth/reset-password?token=${token}`;

	await sendEmail(
		{
			to: email,
			subject: "비밀번호 재설정 요청",
			react: PasswordResetEmail({ resetUrl }),
		},
		apiKey,
		fromEmail,
	);
};
