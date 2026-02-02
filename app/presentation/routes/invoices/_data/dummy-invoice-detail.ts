/**
 * 더미 인보이스 상세 데이터
 *
 * 인보이스 상세 페이지에서 사용할 더미 데이터입니다.
 * - 회사 정보 (CompanyInfo)
 * - 라인 아이템 6개 (InvoiceLineItem[])
 * - 완전한 인보이스 데이터 (InvoiceWithLineItems)
 *
 * 금액 계산:
 * - Subtotal: 7,500,000 KRW
 * - Tax Rate: 10%
 * - Tax Amount: 750,000 KRW
 * - Total: 8,250,000 KRW
 */

import type { CompanyInfo } from "~/domain/company/company.types";
import type {
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice/invoice.types";

/**
 * 더미 회사 정보
 */
export const dummyCompanyInfo: CompanyInfo = {
	company_name: "테크솔루션 주식회사",
	company_address: "서울특별시 강남구 테헤란로 152, 강남파이낸스센터 15층",
	company_email: "billing@techsolution.co.kr",
	company_phone: "02-1234-5678",
	tax_id: "123-45-67890",
	logo_url: undefined,
};

/**
 * 더미 라인 아이템 (6개)
 *
 * 항목 합계: 7,500,000 KRW
 * - 웹 개발 컨설팅: 800,000 x 3 = 2,400,000
 * - UI/UX 디자인: 600,000 x 2 = 1,200,000
 * - 백엔드 API 개발: 1,500,000 x 1 = 1,500,000
 * - 프론트엔드 개발: 500,000 x 2 = 1,000,000
 * - QA 테스팅: 200,000 x 3 = 600,000
 * - 프로젝트 관리: 400,000 x 2 = 800,000
 */
export const dummyLineItems: InvoiceLineItem[] = [
	{
		id: "line-001",
		invoice_id: "inv-detail-001",
		description: "웹 개발 컨설팅 서비스",
		quantity: 3,
		unit_price: 800000,
		line_total: 2400000,
		sort_order: 1,
	},
	{
		id: "line-002",
		invoice_id: "inv-detail-001",
		description: "UI/UX 디자인",
		quantity: 2,
		unit_price: 600000,
		line_total: 1200000,
		sort_order: 2,
	},
	{
		id: "line-003",
		invoice_id: "inv-detail-001",
		description: "백엔드 API 개발",
		quantity: 1,
		unit_price: 1500000,
		line_total: 1500000,
		sort_order: 3,
	},
	{
		id: "line-004",
		invoice_id: "inv-detail-001",
		description: "프론트엔드 개발",
		quantity: 2,
		unit_price: 500000,
		line_total: 1000000,
		sort_order: 4,
	},
	{
		id: "line-005",
		invoice_id: "inv-detail-001",
		description: "QA 테스팅",
		quantity: 3,
		unit_price: 200000,
		line_total: 600000,
		sort_order: 5,
	},
	{
		id: "line-006",
		invoice_id: "inv-detail-001",
		description: "프로젝트 관리",
		quantity: 2,
		unit_price: 400000,
		line_total: 800000,
		sort_order: 6,
	},
];

/**
 * 더미 인보이스 상세 데이터
 *
 * InvoiceWithLineItems 타입의 완전한 인보이스 데이터
 */
export const dummyInvoiceDetail: InvoiceWithLineItems = {
	invoice_id: "inv-detail-001",
	invoice_number: "INV-2024-DETAIL-001",
	client_name: "스마트커머스 주식회사",
	client_email: "finance@smartcommerce.co.kr",
	client_address: "서울특별시 서초구 반포대로 45, 스마트타워 8층",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: "Sent",
	subtotal: 7500000,
	tax_rate: 10,
	tax_amount: 750000,
	total_amount: 8250000,
	currency: "KRW",
	notes:
		"본 인보이스는 2024년 1분기 웹 개발 프로젝트에 대한 청구서입니다. 문의사항이 있으시면 billing@techsolution.co.kr로 연락 주시기 바랍니다.",
	created_at: new Date("2024-01-15"),
	line_items: dummyLineItems,
};
