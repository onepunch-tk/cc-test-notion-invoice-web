/**
 * CompanyInfo 도메인 타입 정의
 *
 * PRD Data Model 기반 회사 정보 타입 정의
 */

/**
 * 회사 정보 인터페이스
 */
export interface CompanyInfo {
	company_name: string;
	company_address: string;
	company_email: string;
	company_phone: string;
	logo_url?: string;
	tax_id: string;
}
