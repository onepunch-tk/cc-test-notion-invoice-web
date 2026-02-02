/**
 * 인보이스 관련 유틸리티 함수
 */

import type { InvoiceStatus } from "~/domain/invoice/invoice.types";

/**
 * Badge variant 타입
 */
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * 인보이스 상태에 따른 Badge variant를 반환합니다.
 *
 * @param status - 인보이스 상태
 * @returns Badge variant
 *
 * @example
 * getStatusBadgeVariant('Draft') // "secondary"
 * getStatusBadgeVariant('Paid') // "default"
 */
export const getStatusBadgeVariant = (status: InvoiceStatus): BadgeVariant => {
	const variantMap: Record<InvoiceStatus, BadgeVariant> = {
		Draft: "secondary",
		Sent: "outline",
		Paid: "default",
		Overdue: "destructive",
	};

	return variantMap[status];
};
