/**
 * Error Sanitizer Utility
 *
 * 에러 메시지에서 민감한 정보를 제거하여 안전하게 로깅할 수 있도록 합니다.
 */

/**
 * 민감한 정보 패턴 정의
 */
const SENSITIVE_PATTERNS = [
	// API 키 패턴
	{ pattern: /api[_-]?key[=:]\s*[^\s]+/gi, replacement: "API_KEY=[REDACTED]" },
	// Secret 패턴
	{ pattern: /secret[_-]?[=:]\s*[^\s]+/gi, replacement: "SECRET=[REDACTED]" },
	// Password 패턴
	{
		pattern: /password[=:]\s*['"]?[^\s'"]+['"]?/gi,
		replacement: "password=[REDACTED]",
	},
	// Token 패턴
	{
		pattern: /token[=:]\s*['"]?[^\s'"]+['"]?/gi,
		replacement: "token=[REDACTED]",
	},

	// Database Connection Strings
	{
		pattern: /postgresql:\/\/[^@\s]+@[^\s]+/g,
		replacement: "postgresql://[REDACTED]",
	},
	{
		pattern: /mongodb:\/\/[^@\s]+@[^\s]+/g,
		replacement: "mongodb://[REDACTED]",
	},
	{
		pattern: /mongodb\+srv:\/\/[^@\s]+@[^\s]+/gi,
		replacement: "mongodb+srv://[REDACTED]",
	},
	{ pattern: /mysql:\/\/[^@\s]+@[^\s]+/g, replacement: "mysql://[REDACTED]" },
	{
		pattern: /redis(?:s)?:\/\/[^@\s]+@[^\s]+/gi,
		replacement: "redis://[REDACTED]",
	},
	{ pattern: /sqlite:\/\/[^\s]+/gi, replacement: "sqlite://[REDACTED]" },
	{
		pattern: /\.rds\.amazonaws\.com/gi,
		replacement: "[RDS_ENDPOINT_REDACTED]",
	},

	// Notion Database ID (32자리 hex 또는 UUID 형식)
	{
		pattern: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
		replacement: "[DATABASE_ID_REDACTED]",
	},
	// 32자리 hex ID
	{ pattern: /[a-f0-9]{32}/gi, replacement: "[ID_REDACTED]" },
	// Bearer 토큰
	{
		pattern: /bearer\s+[a-zA-Z0-9_-]+/gi,
		replacement: "Bearer [TOKEN_REDACTED]",
	},
	// Authorization 헤더
	{
		pattern: /authorization[=:]\s*[^\s]+/gi,
		replacement: "Authorization=[REDACTED]",
	},

	// File paths with usernames
	{ pattern: /\/Users\/[^/\s]+/g, replacement: "/Users/[USER]" },
	{ pattern: /\/home\/[^/\s]+/g, replacement: "/home/[USER]" },
	{ pattern: /C:\\Users\\[^\\\s]+/g, replacement: "C:\\Users\\[USER]" },
];

/**
 * 에러 메시지에서 민감한 정보를 제거합니다.
 *
 * @param message - 원본 에러 메시지
 * @returns 민감한 정보가 제거된 메시지
 */
export const sanitizeErrorMessage = (message: string): string => {
	let sanitized = message;

	for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
		sanitized = sanitized.replace(pattern, replacement);
	}

	return sanitized;
};

/**
 * 에러 객체를 로깅에 안전한 형태로 변환합니다.
 *
 * @param error - 원본 에러
 * @returns 로깅에 안전한 에러 정보 문자열
 */
export const sanitizeErrorForLogging = (error: unknown): string => {
	if (!(error instanceof Error)) {
		return "Unknown error occurred";
	}

	const sanitizedMessage = sanitizeErrorMessage(error.message);
	const errorName = error.name || "Error";

	return `[${errorName}] ${sanitizedMessage}`;
};
