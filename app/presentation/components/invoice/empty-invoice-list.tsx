/**
 * EmptyInvoiceList 컴포넌트
 *
 * 인보이스가 없을 때 표시되는 빈 상태 컴포넌트입니다.
 * FileText 아이콘과 안내 메시지를 표시합니다.
 */

import { FileText } from "lucide-react";
import { cn } from "~/presentation/lib/utils";

interface EmptyInvoiceListProps {
	className?: string;
}

export default function EmptyInvoiceList({ className }: EmptyInvoiceListProps) {
	return (
		<div
			data-testid="empty-invoice-list"
			role="status"
			aria-live="polite"
			className={cn(
				"flex flex-col items-center justify-center py-16 text-center",
				className,
			)}
		>
			<div
				data-testid="empty-invoice-icon"
				className="mb-4 rounded-full bg-muted p-4"
			>
				<FileText className="h-12 w-12 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold text-foreground">
				인보이스가 없습니다
			</h3>
			<p className="mt-2 max-w-sm text-sm text-muted-foreground">
				Notion 데이터베이스에 인보이스를 추가해주세요.
			</p>
		</div>
	);
}
