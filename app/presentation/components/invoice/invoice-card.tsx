/**
 * InvoiceCard 컴포넌트
 *
 * 클릭 가능한 인보이스 카드를 표시합니다.
 */

import { Link } from "react-router";
import type { Invoice } from "~/domain/invoice/invoice.types";
import { Badge } from "~/presentation/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/presentation/components/ui/card";
import { formatCurrency, formatDate } from "~/presentation/lib/format";
import { getStatusBadgeVariant } from "~/presentation/lib/invoice-utils";
import { cn } from "~/presentation/lib/utils";

interface InvoiceCardProps {
	invoice: Invoice;
	className?: string;
}

export default function InvoiceCard({ invoice, className }: InvoiceCardProps) {
	const badgeVariant = getStatusBadgeVariant(invoice.status);

	return (
		<Link
			to={`/invoices/${invoice.invoice_id}`}
			className={cn("block", className)}
		>
			<Card className="hover:shadow-md transition-shadow">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
						<Badge variant={badgeVariant}>{invoice.status}</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-1">
						<p className="text-sm font-medium">{invoice.client_name}</p>
						<p className="text-sm text-muted-foreground">
							{formatDate(invoice.issue_date)}
						</p>
						<p className="text-lg font-semibold">
							{formatCurrency(invoice.total_amount, invoice.currency)}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
