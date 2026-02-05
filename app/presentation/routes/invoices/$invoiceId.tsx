/**
 * Invoice Detail Page
 *
 * 인보이스 상세 정보를 표시하는 페이지입니다.
 * 회사 정보, 고객 정보, 라인 아이템 테이블, 합계 섹션을 포함합니다.
 * A4 인쇄 최적화 및 PDF 다운로드 플레이스홀더를 제공합니다.
 */

import type { MetaFunction } from "react-router";
import { useParams } from "react-router";
import {
	InvoiceActions,
	InvoiceHeader,
	InvoiceSummary,
	InvoiceTable,
} from "~/presentation/components/invoice";
import { Card, CardContent } from "~/presentation/components/ui/card";
import {
	dummyCompanyInfo,
	dummyInvoiceDetail,
} from "~/presentation/routes/invoices/_data/dummy-invoice-detail";

/**
 * Invoice Detail Page Meta
 *
 * SEO meta tags for the invoice detail page
 */
export const meta: MetaFunction = () => {
	return [
		{ title: "인보이스 상세 - Invoice-Web" },
		{
			name: "description",
			content: "인보이스 상세 정보를 조회합니다.",
		},
	];
};

/**
 * Invoice Detail Page Component
 *
 * Displays invoice details with:
 * - InvoiceActions (navigation, print, PDF download)
 * - InvoiceHeader (company info, invoice meta, client info)
 * - InvoiceTable (line items)
 * - InvoiceSummary (totals)
 * - Notes section (optional)
 */
export default function InvoiceDetail() {
	const { invoiceId } = useParams<{ invoiceId: string }>();
	const displayId = invoiceId ?? "inv-unknown";

	const invoice = dummyInvoiceDetail;
	const companyInfo = dummyCompanyInfo;

	return (
		<div
			data-testid="invoice-detail-container"
			className="container mx-auto px-4 py-8 max-w-4xl print-optimized"
		>
			{/* Actions - Hidden on print */}
			<div className="mb-6 flex justify-between items-center no-print">
				<div>
					<h1 className="text-3xl font-bold text-foreground">인보이스 상세</h1>
					<p className="mt-1 text-muted-foreground">인보이스 ID: {displayId}</p>
				</div>
				<InvoiceActions />
			</div>

			{/* Invoice Content Card */}
			<Card className="print-avoid-break">
				<CardContent className="p-6 md:p-8 space-y-6">
					{/* Header - Company & Client Info */}
					<InvoiceHeader invoice={invoice} companyInfo={companyInfo} />

					{/* Line Items Table */}
					<InvoiceTable
						lineItems={invoice.line_items}
						currency={invoice.currency}
						className="border-t pt-6"
					/>

					{/* Summary */}
					<InvoiceSummary
						subtotal={invoice.subtotal}
						taxRate={invoice.tax_rate}
						taxAmount={invoice.tax_amount}
						totalAmount={invoice.total_amount}
						currency={invoice.currency}
						className="border-t pt-6"
					/>

					{/* Notes Section */}
					{invoice.notes && (
						<div
							data-testid="invoice-notes"
							className="border-t pt-6 print-avoid-break"
						>
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								Notes
							</h3>
							<p className="text-sm text-foreground whitespace-pre-wrap">
								{invoice.notes}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
