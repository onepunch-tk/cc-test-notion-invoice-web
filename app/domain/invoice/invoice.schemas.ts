import { z } from "zod";

/**
 * Invoice 도메인 스키마
 *
 * PRD Data Model 기반 Zod 스키마 정의
 * Notion API 응답 검증에 사용
 */

/**
 * InvoiceStatus 스키마
 *
 * 유효한 인보이스 상태값만 허용
 */
export const invoiceStatusSchema = z.enum(["Draft", "Sent", "Paid", "Overdue"]);

/**
 * InvoiceLineItem 스키마
 *
 * 인보이스 라인 아이템 검증
 */
export const invoiceLineItemSchema = z.object({
	id: z.string(),
	invoice_id: z.string(),
	description: z.string().min(1, "Description is required"),
	quantity: z.number().nonnegative("Quantity must be non-negative"),
	unit_price: z.number().nonnegative("Unit price must be non-negative"),
	line_total: z.number(),
	sort_order: z.number().nonnegative("Sort order must be non-negative"),
});

/**
 * Invoice 스키마
 *
 * 인보이스 데이터 검증
 * 날짜 필드는 문자열에서 Date로 자동 변환 (Notion API 응답 대응)
 *
 * @remarks
 * - `notes` 필드는 optional: 인보이스에 추가 메모가 없는 경우 undefined
 *   Notion에서 Notes 필드가 비어있거나 존재하지 않을 때 undefined로 처리됨
 */
export const invoiceSchema = z.object({
	invoice_id: z.string().min(1, "Invoice ID is required"),
	invoice_number: z.string().min(1, "Invoice number is required"),
	client_name: z.string().min(1, "Client name is required"),
	client_email: z.string().email("Invalid email format"),
	client_address: z.string(),
	issue_date: z.coerce.date(),
	due_date: z.coerce.date(),
	status: invoiceStatusSchema,
	subtotal: z.number().nonnegative("Subtotal must be non-negative"),
	tax_rate: z.number().nonnegative("Tax rate must be non-negative"),
	tax_amount: z.number(),
	total_amount: z.number(),
	currency: z.string(),
	/** 인보이스 추가 메모 (optional: 메모가 없는 경우 undefined) */
	notes: z.string().optional(),
	created_at: z.coerce.date(),
});

/**
 * InvoiceWithLineItems 스키마
 *
 * Invoice와 LineItems를 포함한 복합 스키마
 */
export const invoiceWithLineItemsSchema = invoiceSchema.extend({
	line_items: z.array(invoiceLineItemSchema),
});

/**
 * 스키마에서 타입 추론
 */
export type InvoiceStatusSchema = z.infer<typeof invoiceStatusSchema>;
export type InvoiceLineItemSchema = z.infer<typeof invoiceLineItemSchema>;
export type InvoiceSchema = z.infer<typeof invoiceSchema>;
export type InvoiceWithLineItemsSchema = z.infer<
	typeof invoiceWithLineItemsSchema
>;
