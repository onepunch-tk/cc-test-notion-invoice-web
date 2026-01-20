import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
	preview: string;
	title: string;
	children: ReactNode;
	footer?: string;
}

/**
 * 공통 이메일 레이아웃 컴포넌트
 */
export default function EmailLayout({
	preview,
	title,
	children,
	footer = "이 이메일은 자동으로 발송되었습니다.",
}: EmailLayoutProps) {
	return (
		<Html>
			<Head />
			<Preview>{preview}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={h1}>{title}</Heading>
					{children}
					<Section style={hr} />
					<Text style={footerText}>{footer}</Text>
				</Container>
			</Body>
		</Html>
	);
}

// 공통 스타일 export
export const emailStyles = {
	text: {
		color: "#4a5568",
		fontSize: "16px",
		lineHeight: "1.6",
		marginBottom: "32px",
	},
	linkText: {
		color: "#718096",
		fontSize: "14px",
		lineHeight: "1.6",
		marginBottom: "8px",
	},
	code: {
		color: "#4a5568",
		fontSize: "14px",
		wordBreak: "break-all" as const,
		backgroundColor: "#f7fafc",
		padding: "12px",
		borderRadius: "4px",
	},
	buttonContainer: {
		textAlign: "center" as const,
		marginBottom: "32px",
	},
	button: {
		display: "inline-block",
		padding: "14px 32px",
		backgroundColor: "#0070f3",
		color: "#ffffff",
		textDecoration: "none",
		borderRadius: "6px",
		fontWeight: "500",
		fontSize: "16px",
	},
	warningBox: {
		marginTop: "32px",
		padding: "16px",
		backgroundColor: "#fff5f5",
		borderLeft: "4px solid #fc8181",
		borderRadius: "4px",
	},
	warningText: {
		color: "#c53030",
		fontSize: "14px",
		lineHeight: "1.6",
		margin: "0",
	},
} as const;

// 내부 스타일 정의
const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "40px 20px",
	maxWidth: "600px",
};

const h1 = {
	color: "#1a1a1a",
	fontSize: "24px",
	fontWeight: "600",
	marginBottom: "24px",
};

const hr = {
	borderTop: "1px solid #e2e8f0",
	margin: "32px 0",
};

const footerText = {
	color: "#a0aec0",
	fontSize: "12px",
	lineHeight: "1.6",
};
