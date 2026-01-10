/**
 * 이메일 전송 유틸리티
 *
 * 개발 환경: 콘솔 로그로 이메일 내용 출력
 * 프로덕션: Resend, SendGrid 등의 서비스 사용
 */

interface SendEmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

/**
 * 이메일 전송
 *
 * @param options - 이메일 전송 옵션
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
	// 개발 환경에서는 콘솔에 출력
	if (process.env.NODE_ENV !== "production") {
		console.log("📧 이메일 전송 (개발 모드):");
		console.log(`To: ${options.to}`);
		console.log(`Subject: ${options.subject}`);
		console.log(`Text: ${options.text || "N/A"}`);
		console.log(`HTML: ${options.html || "N/A"}`);
		console.log("---");
		return;
	}

	// 프로덕션 환경에서는 실제 이메일 서비스 사용
	// TODO: Resend, SendGrid 등의 서비스 연동
	throw new Error("이메일 전송 서비스가 설정되지 않았습니다.");
};

/**
 * 이메일 인증 링크 전송
 *
 * @param email - 수신자 이메일
 * @param token - 인증 토큰
 * @param baseURL - 애플리케이션 기본 URL
 */
export const sendVerificationEmail = async (
	email: string,
	token: string,
	baseURL: string,
): Promise<void> => {
	const verificationUrl = `${baseURL}/api/auth/verify-email?token=${token}`;

	await sendEmail({
		to: email,
		subject: "이메일 인증",
		text: `다음 링크를 클릭하여 이메일을 인증해주세요: ${verificationUrl}`,
		html: `
			<h1>이메일 인증</h1>
			<p>다음 버튼을 클릭하여 이메일을 인증해주세요:</p>
			<a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
				이메일 인증하기
			</a>
			<p>또는 다음 링크를 복사하여 브라우저에 붙여넣으세요:</p>
			<p>${verificationUrl}</p>
		`,
	});
};

/**
 * 비밀번호 재설정 링크 전송
 *
 * @param email - 수신자 이메일
 * @param token - 재설정 토큰
 * @param baseURL - 애플리케이션 기본 URL
 */
export const sendPasswordResetEmail = async (
	email: string,
	token: string,
	baseURL: string,
): Promise<void> => {
	const resetUrl = `${baseURL}/auth/reset-password?token=${token}`;

	await sendEmail({
		to: email,
		subject: "비밀번호 재설정",
		text: `다음 링크를 클릭하여 비밀번호를 재설정해주세요: ${resetUrl}`,
		html: `
			<h1>비밀번호 재설정</h1>
			<p>다음 버튼을 클릭하여 비밀번호를 재설정해주세요:</p>
			<a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
				비밀번호 재설정하기
			</a>
			<p>또는 다음 링크를 복사하여 브라우저에 붙여넣으세요:</p>
			<p>${resetUrl}</p>
			<p>이 링크는 1시간 동안 유효합니다.</p>
		`,
	});
};
