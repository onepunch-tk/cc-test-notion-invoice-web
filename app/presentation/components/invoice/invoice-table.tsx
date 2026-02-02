/**
 * InvoiceTable 컴포넌트
 *
 * 인보이스 라인 아이템을 테이블로 표시합니다.
 */

import type { InvoiceLineItem } from "~/domain/invoice/invoice.types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/presentation/components/ui/table";
import { formatCurrency } from "~/presentation/lib/format";
import { cn } from "~/presentation/lib/utils";

interface InvoiceTableProps {
	lineItems: InvoiceLineItem[];
	currency?: string;
	className?: string;
}

export default function InvoiceTable({
	lineItems,
	currency = "KRW",
	className,
}: InvoiceTableProps) {
	const sortedItems = [...lineItems].sort(
		(a, b) => a.sort_order - b.sort_order,
	);

	return (
		<div className={cn(className)}>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Description</TableHead>
						<TableHead className="text-right">Qty</TableHead>
						<TableHead className="text-right">Unit Price</TableHead>
						<TableHead className="text-right">Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedItems.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className="text-center text-muted-foreground"
							>
								No items
							</TableCell>
						</TableRow>
					) : (
						sortedItems.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.description}</TableCell>
								<TableCell className="text-right">{item.quantity}</TableCell>
								<TableCell className="text-right">
									{formatCurrency(item.unit_price, currency)}
								</TableCell>
								<TableCell className="text-right">
									{formatCurrency(item.line_total, currency)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
