/**
 * PDF Download Button Wrapper Component
 *
 * SSR 안전 래퍼 컴포넌트 (React.lazy + Suspense)
 * .client.tsx 컴포넌트를 dynamic import로 로드
 */

import { Download } from "lucide-react";
import { lazy, Suspense } from "react";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice/invoice.types";
import { Button } from "~/presentation/components/ui/button";

// Dynamic import로 client 컴포넌트 로드 (SSR 시 번들에서 제외)
const PdfDownloadButtonClient = lazy(
	() => import("./pdf-download-button.client"),
);

interface PdfDownloadButtonProps {
	invoice: Invoice;
	lineItems: InvoiceLineItem[];
	companyInfo: CompanyInfo;
}

export default function PdfDownloadButton({
	invoice,
	lineItems,
	companyInfo,
}: PdfDownloadButtonProps) {
	// fileName 생성: invoice_number.pdf
	const fileName = `${invoice.invoice_number}.pdf`;

	return (
		<Suspense
			fallback={
				<Button variant="default" size="sm" disabled>
					<Download />
					Download PDF
				</Button>
			}
		>
			<PdfDownloadButtonClient
				invoice={invoice}
				lineItems={lineItems}
				companyInfo={companyInfo}
				fileName={fileName}
			/>
		</Suspense>
	);
}
