import { z } from "zod";

/**
 * CompanyInfo 도메인 스키마
 *
 * PRD Data Model 기반 Zod 스키마 정의
 * Notion API 응답 검증에 사용
 */

/**
 * CompanyInfo 스키마
 *
 * 회사 정보 검증
 */
export const companyInfoSchema = z.object({
	company_name: z.string().min(1, "Company name is required"),
	company_address: z.string(),
	company_email: z.string().email("Invalid email format"),
	company_phone: z.string().min(1, "Phone number is required"),
	logo_url: z
		.string()
		.url("Invalid URL format")
		.refine(
			(url) => {
				// SSRF 방지: HTTPS만 허용, 내부 IP/localhost 차단
				if (!url.startsWith("https://")) return false;
				try {
					const parsed = new URL(url);
					const hostname = parsed.hostname.toLowerCase();
					// 내부 IP 및 localhost 차단
					const blockedPatterns = [
						/^localhost$/i,
						/^127\./,
						/^10\./,
						/^172\.(1[6-9]|2\d|3[01])\./,
						/^192\.168\./,
						/^169\.254\./, // Link-local
						/^::1$/, // IPv6 localhost
						/^fc00:/i, // IPv6 private
						/^fe80:/i, // IPv6 link-local
					];
					return !blockedPatterns.some((pattern) => pattern.test(hostname));
				} catch {
					return false;
				}
			},
			{
				message:
					"Logo URL must be HTTPS and cannot point to internal/private addresses",
			},
		)
		.optional(),
	tax_id: z.string().min(1, "Tax ID is required"),
});

/**
 * 스키마에서 타입 추론
 */
export type CompanyInfoSchema = z.infer<typeof companyInfoSchema>;
