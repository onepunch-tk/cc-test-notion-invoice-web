/**
 * Invoice 도메인 타입 정의
 *
 * PRD Data Model 기반 Invoice, InvoiceLineItem, InvoiceStatus 타입 정의
 */

/**
 * 인보이스 상태 열거형
 */
export const InvoiceStatus = {
	Draft: "Draft",
	Sent: "Sent",
	Paid: "Paid",
	Overdue: "Overdue",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

/**
 * 인보이스 라인 아이템 인터페이스
 */
export interface InvoiceLineItem {
	id: string;
	invoice_id: string;
	description: string;
	quantity: number;
	unit_price: number;
	line_total: number;
	sort_order: number;
}

/**
 * 인보이스 인터페이스
 */
export interface Invoice {
	invoice_id: string;
	invoice_number: string;
	client_name: string;
	client_email: string;
	client_address: string;
	issue_date: Date;
	due_date: Date;
	status: InvoiceStatus;
	subtotal: number;
	tax_rate: number;
	tax_amount: number;
	total_amount: number;
	currency: string;
	notes?: string;
	created_at: Date;
}

/**
 * 인보이스와 라인 아이템을 포함한 복합 타입
 */
export interface InvoiceWithLineItems extends Invoice {
	line_items: InvoiceLineItem[];
}
