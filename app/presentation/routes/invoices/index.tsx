import type { MetaFunction } from "react-router";

/**
 * Invoice List Page Meta
 *
 * SEO meta tags for the invoice list page
 */
export const meta: MetaFunction = () => {
	return [
		{ title: "인보이스 목록 - Invoice-Web" },
		{
			name: "description",
			content: "Notion 데이터베이스로 관리되는 인보이스 목록을 조회합니다.",
		},
	];
};

/**
 * Invoice List Page Component
 *
 * Displays list of invoices with:
 * - Invoice grid placeholder
 * - Links to invoice detail pages
 */
export default function InvoiceList() {
	return (
		<div className="container mx-auto px-4 py-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">인보이스 목록</h1>
				<p className="mt-2 text-muted-foreground">
					Notion 데이터베이스로 관리되는 인보이스를 조회합니다.
				</p>
			</header>

			<main>
				<div className="rounded-lg border border-dashed border-border p-8 text-center">
					<p className="text-muted-foreground">
						인보이스 목록이 여기에 표시됩니다.
					</p>
					<p className="mt-2 text-sm text-muted-foreground/70">
						Notion API 연동 후 활성화됩니다.
					</p>
				</div>
			</main>
		</div>
	);
}
