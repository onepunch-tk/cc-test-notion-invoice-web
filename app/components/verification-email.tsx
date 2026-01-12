import { Button, Section, Text } from "@react-email/components";
import EmailLayout, { emailStyles } from "./email-layout";

interface VerificationEmailProps {
	verificationUrl: string;
}

/**
 * 이메일 인증 템플릿
 */
export default function VerificationEmail({
	verificationUrl,
}: VerificationEmailProps) {
	return (
		<EmailLayout
			preview="이메일 인증을 완료해주세요"
			title="이메일 인증"
			footer="이 이메일은 자동으로 발송되었습니다. 회원가입을 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다."
		>
			<Text style={emailStyles.text}>
				회원가입을 완료하려면 아래 버튼을 클릭하여 이메일 주소를 인증해주세요.
			</Text>
			<Section style={emailStyles.buttonContainer}>
				<Button style={emailStyles.button} href={verificationUrl}>
					이메일 인증하기
				</Button>
			</Section>
			<Text style={emailStyles.linkText}>
				버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
			</Text>
			<Text style={emailStyles.code}>{verificationUrl}</Text>
		</EmailLayout>
	);
}
