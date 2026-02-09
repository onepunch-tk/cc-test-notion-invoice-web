/**
 * PDF Download Button Client Component
 *
 * @react-pdf/renderer를 사용하는 클라이언트 전용 컴포넌트
 * PDFDownloadLink는 브라우저 DOM이 필요하므로 .client.tsx 사용이 올바름
 */

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice/invoice.types";
import { Button } from "~/presentation/components/ui/button";
import InvoicePdfDocument from "./invoice-pdf-document";

interface PdfDownloadButtonClientProps {
	invoice: Invoice;
	lineItems: InvoiceLineItem[];
	companyInfo: CompanyInfo;
	fileName: string;
}

export default function PdfDownloadButtonClient({
	invoice,
	lineItems,
	companyInfo,
	fileName,
}: PdfDownloadButtonClientProps) {
	return (
		<PDFDownloadLink
			document={
				<InvoicePdfDocument
					invoice={invoice}
					lineItems={lineItems}
					companyInfo={companyInfo}
				/>
			}
			fileName={fileName}
		>
			{({ loading }) => (
				<Button variant="default" size="sm" disabled={loading}>
					{loading ? (
						<>
							<Loader2 className="animate-spin" />
							Preparing...
						</>
					) : (
						<>
							<Download />
							Download PDF
						</>
					)}
				</Button>
			)}
		</PDFDownloadLink>
	);
}
