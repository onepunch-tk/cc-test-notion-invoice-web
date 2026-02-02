/**
 * InvoiceSummary 컴포넌트
 *
 * 인보이스 요약 정보(소계, 세금, 총액)를 표시합니다.
 */

import { formatCurrency } from "~/presentation/lib/format";
import { cn } from "~/presentation/lib/utils";

interface InvoiceSummaryProps {
	subtotal: number;
	taxRate: number;
	taxAmount: number;
	totalAmount: number;
	currency?: string;
	className?: string;
}

export default function InvoiceSummary({
	subtotal,
	taxRate,
	taxAmount,
	totalAmount,
	currency = "KRW",
	className,
}: InvoiceSummaryProps) {
	return (
		<div
			data-testid="invoice-summary-container"
			className={cn("flex flex-col items-end gap-2", className)}
		>
			<div className="flex justify-between gap-8 text-sm">
				<span className="text-muted-foreground">Subtotal</span>
				<span data-testid="invoice-summary-subtotal">
					{formatCurrency(subtotal, currency)}
				</span>
			</div>

			<div className="flex justify-between gap-8 text-sm">
				<span
					data-testid="invoice-summary-tax-label"
					className="text-muted-foreground"
				>
					Tax ({taxRate}%)
				</span>
				<span data-testid="invoice-summary-tax-amount">
					{formatCurrency(taxAmount, currency)}
				</span>
			</div>

			<div className="flex justify-between gap-8 border-t pt-2 font-semibold">
				<span>Total</span>
				<span data-testid="invoice-summary-total">
					{formatCurrency(totalAmount, currency)}
				</span>
			</div>
		</div>
	);
}
