import { Button, Section, Text } from "@react-email/components";
import EmailLayout, { emailStyles } from "./email-layout";

interface PasswordResetEmailProps {
	resetUrl: string;
}

/**
 * 비밀번호 재설정 템플릿
 */
export default function PasswordResetEmail({
	resetUrl,
}: PasswordResetEmailProps) {
	return (
		<EmailLayout
			preview="비밀번호 재설정 요청"
			title="비밀번호 재설정"
			footer="이 이메일은 자동으로 발송되었습니다. 비밀번호 재설정을 요청하지 않으셨다면 즉시 계정 보안을 확인해주세요."
		>
			<Text style={emailStyles.text}>
				비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새로운 비밀번호를
				설정해주세요.
			</Text>
			<Section style={emailStyles.buttonContainer}>
				<Button style={emailStyles.button} href={resetUrl}>
					비밀번호 재설정하기
				</Button>
			</Section>
			<Text style={emailStyles.linkText}>
				버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
			</Text>
			<Text style={emailStyles.code}>{resetUrl}</Text>
			<Section style={emailStyles.warningBox}>
				<Text style={emailStyles.warningText}>
					<strong>중요:</strong> 이 링크는 보안을 위해 1시간 동안만 유효합니다.
				</Text>
			</Section>
		</EmailLayout>
	);
}
