/**
 * InvoiceActions 컴포넌트
 *
 * 인보이스 상세 페이지의 액션 버튼들을 표시합니다.
 * - 목록으로: 인보이스 목록 페이지로 이동
 * - 인쇄: 브라우저 인쇄 기능 호출
 * - PDF 다운로드: PdfDownloadButton 컴포넌트 사용
 */

import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { InvoiceWithLineItems } from "~/domain/invoice/invoice.types";
import { PdfDownloadButton } from "~/presentation/components/pdf";
import { Button } from "~/presentation/components/ui/button";
import { cn } from "~/presentation/lib/utils";

interface InvoiceActionsProps {
	invoice: InvoiceWithLineItems;
	companyInfo: CompanyInfo;
	className?: string;
}

export default function InvoiceActions({
	invoice,
	companyInfo,
	className,
}: InvoiceActionsProps) {
	const handlePrint = () => {
		window.print();
	};

	return (
		<div data-testid="invoice-actions" className={cn("flex gap-2", className)}>
			<Button asChild variant="outline" size="sm">
				<Link to="/invoices">
					<ArrowLeft className="h-4 w-4 mr-1" />
					목록으로
				</Link>
			</Button>

			<Button variant="outline" size="sm" onClick={handlePrint}>
				<Printer className="h-4 w-4 mr-1" />
				인쇄
			</Button>

			<PdfDownloadButton
				invoice={invoice}
				lineItems={invoice.line_items}
				companyInfo={companyInfo}
			/>
		</div>
	);
}
