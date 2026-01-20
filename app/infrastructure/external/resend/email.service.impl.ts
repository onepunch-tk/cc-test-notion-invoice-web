import { Resend } from "resend";
import type {
	IEmailService,
	SendEmailOptions,
} from "~/application/shared/email.port";
import { EmailSendError, EmailServiceNotConfiguredError } from "~/domain/auth";
import PasswordResetEmail from "~/presentation/components/email/password-reset-email";
import VerificationEmail from "~/presentation/components/email/verification-email";

/**
 * Email Service 구현체 (Resend)
 *
 * IEmailService 인터페이스를 Resend로 구현합니다.
 */
export const createEmailServiceImpl = (
	apiKey: string | undefined,
	fromEmail: string | undefined,
): IEmailService => {
	const defaultFrom = fromEmail || "onboarding@resend.dev";

	const send = async (options: SendEmailOptions): Promise<void> => {
		if (!apiKey) {
			console.error("❌ RESEND_API_KEY 환경 변수가 설정되지 않았습니다.");
			throw new EmailServiceNotConfiguredError();
		}

		const resend = new Resend(apiKey);
		const from = options.from || defaultFrom;

		try {
			const result = await resend.emails.send({
				from,
				to: [options.to],
				subject: options.subject,
				react: options.react,
			});

			// Resend API 에러 응답 확인
			if (result.error) {
				console.error("❌ 이메일 전송 실패:");
				console.error(`  - 에러: ${result.error.message}`);
				console.error(`  - To: ${options.to}`);
				throw new EmailSendError(`이메일 전송 실패: ${result.error.message}`);
			}

			// 성공 시 로깅
			if (process.env.NODE_ENV !== "production") {
				console.log("✅ 이메일 전송 성공:");
				console.log(`  - ID: ${result.data?.id}`);
				console.log(`  - To: ${options.to}`);
				console.log(`  - Subject: ${options.subject}`);
			}
		} catch (error) {
			// 이미 EmailSendError인 경우 그대로 전파
			if (error instanceof EmailSendError) {
				throw error;
			}

			console.error("❌ 이메일 전송 실패:", error);

			if (error instanceof Error) {
				throw new EmailSendError(`이메일 전송 실패: ${error.message}`);
			}

			throw new EmailSendError();
		}
	};

	return {
		send,

		async sendVerificationEmail(
			email: string,
			verificationUrl: string,
		): Promise<void> {
			await send({
				to: email,
				subject: "이메일 인증을 완료해주세요",
				react: VerificationEmail({ verificationUrl }),
			});
		},

		async sendPasswordResetEmail(
			email: string,
			resetUrl: string,
		): Promise<void> {
			await send({
				to: email,
				subject: "비밀번호 재설정 요청",
				react: PasswordResetEmail({ resetUrl }),
			});
		},
	};
};
