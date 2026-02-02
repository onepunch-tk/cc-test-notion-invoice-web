/**
 * InvoiceHeader 컴포넌트
 *
 * 인보이스 헤더(회사 정보, 인보이스 메타, 고객 정보)를 표시합니다.
 */

import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice } from "~/domain/invoice/invoice.types";
import { formatDate } from "~/presentation/lib/format";
import { cn } from "~/presentation/lib/utils";

interface InvoiceHeaderProps {
	invoice: Invoice;
	companyInfo: CompanyInfo;
	className?: string;
}

export default function InvoiceHeader({
	invoice,
	companyInfo,
	className,
}: InvoiceHeaderProps) {
	return (
		<div className={cn("space-y-6", className)}>
			{/* Top Section: Company Info & Invoice Meta */}
			<div className="flex justify-between">
				{/* Company Info (Left) */}
				<div className="space-y-2">
					{companyInfo.logo_url && (
						<img
							src={companyInfo.logo_url}
							alt={companyInfo.company_name}
							className="h-12 w-auto object-contain"
						/>
					)}
					<div>
						<h2 className="text-lg font-semibold">
							{companyInfo.company_name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{companyInfo.company_address}
						</p>
						<p className="text-sm text-muted-foreground">
							{companyInfo.company_email}
						</p>
						<p className="text-sm text-muted-foreground">
							{companyInfo.company_phone}
						</p>
					</div>
				</div>

				{/* Invoice Meta (Right) */}
				<div className="text-right space-y-1">
					<h1 className="text-2xl font-bold">INVOICE</h1>
					<p className="font-medium">{invoice.invoice_number}</p>
					<div className="text-sm text-muted-foreground space-y-0.5">
						<p>
							<span>Issue Date: </span>
							<span>{formatDate(invoice.issue_date)}</span>
						</p>
						<p>
							<span>Due Date: </span>
							<span>{formatDate(invoice.due_date)}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Bill To Section */}
			<div className="border-t pt-4">
				<h3 className="text-sm font-medium text-muted-foreground mb-2">
					Bill To
				</h3>
				<div>
					<p className="font-medium">{invoice.client_name}</p>
					<p className="text-sm text-muted-foreground">
						{invoice.client_address}
					</p>
					<p className="text-sm text-muted-foreground">
						{invoice.client_email}
					</p>
				</div>
			</div>
		</div>
	);
}
