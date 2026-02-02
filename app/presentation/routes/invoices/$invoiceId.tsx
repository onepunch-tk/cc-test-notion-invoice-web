import { Link, useParams } from "react-router";
import type { MetaFunction } from "react-router";

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
 * - Invoice information placeholder
 * - PDF download button (to be implemented)
 * - Link back to invoice list
 */
export default function InvoiceDetail() {
	const { invoiceId } = useParams<{ invoiceId: string }>();
	const displayId = invoiceId ?? "inv-unknown";

	return (
		<div className="container mx-auto px-4 py-8">
			<header className="mb-8">
				<Link
					to="/invoices"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					← 목록으로 돌아가기
				</Link>
				<h1 className="mt-4 text-3xl font-bold text-foreground">
					인보이스 상세
				</h1>
				<p className="mt-2 text-muted-foreground">인보이스 ID: {displayId}</p>
			</header>

			<main>
				<div className="rounded-lg border border-dashed border-border p-8 text-center">
					<p className="text-muted-foreground">
						인보이스 상세 정보가 여기에 표시됩니다.
					</p>
					<p className="mt-2 text-sm text-muted-foreground/70">
						Notion API 연동 후 활성화됩니다.
					</p>
				</div>
			</main>
		</div>
	);
}
