/**
 * InvoiceActions 컴포넌트
 *
 * 인보이스 상세 페이지의 액션 버튼들을 표시합니다.
 * - 목록으로: 인보이스 목록 페이지로 이동
 * - 인쇄: 브라우저 인쇄 기능 호출
 * - PDF 다운로드: PDF 생성 (placeholder)
 */

import { ArrowLeft, Download, Printer } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/presentation/components/ui/button";
import { cn } from "~/presentation/lib/utils";

interface InvoiceActionsProps {
	onDownloadPdf?: () => void;
	className?: string;
}

export default function InvoiceActions({
	onDownloadPdf,
	className,
}: InvoiceActionsProps) {
	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPdf = () => {
		if (onDownloadPdf) {
			onDownloadPdf();
		} else {
			toast.info("PDF 다운로드 기능은 추후 구현 예정입니다.");
		}
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

			<Button variant="default" size="sm" onClick={handleDownloadPdf}>
				<Download className="h-4 w-4 mr-1" />
				PDF 다운로드
			</Button>
		</div>
	);
}
