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
	logo_url: z.string().url("Invalid URL format").optional(),
	tax_id: z.string().min(1, "Tax ID is required"),
});

/**
 * 스키마에서 타입 추론
 */
export type CompanyInfoSchema = z.infer<typeof companyInfoSchema>;
