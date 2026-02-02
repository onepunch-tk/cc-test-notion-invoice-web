/**
 * Invoice List Page
 *
 * 인보이스 목록을 그리드 레이아웃으로 표시합니다.
 * 로딩 상태, 빈 상태를 조건부 렌더링합니다.
 */

import { useState } from "react";
import type { MetaFunction } from "react-router";
import {
	EmptyInvoiceList,
	InvoiceCard,
	InvoiceListSkeleton,
} from "~/presentation/components/invoice";
import { Button } from "~/presentation/components/ui/button";
import { dummyInvoices } from "./_data/dummy-invoices";

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
 * - Responsive grid layout
 * - Loading skeleton
 * - Empty state
 * - Invoice cards
 */
export default function InvoiceList() {
	const [isLoading, setIsLoading] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);

	const invoices = isEmpty ? [] : dummyInvoices;
	const isDev = process.env.NODE_ENV === "development";

	return (
		<div
			data-testid="invoice-list-container"
			className="container mx-auto max-w-7xl px-4 py-8"
		>
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">인보이스 목록</h1>
				<p className="mt-2 text-muted-foreground">
					Notion 데이터베이스로 관리되는 인보이스를 조회합니다.
				</p>
			</header>

			{isDev && (
				<div className="mb-6 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsLoading(!isLoading)}
					>
						Toggle Loading
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEmpty(!isEmpty)}
					>
						Toggle Empty
					</Button>
				</div>
			)}

			<main>
				{isLoading ? (
					<InvoiceListSkeleton data-testid="invoice-list-skeleton" />
				) : invoices.length === 0 ? (
					<EmptyInvoiceList />
				) : (
					<div
						data-testid="invoice-grid"
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
					>
						{invoices.map((invoice) => (
							<InvoiceCard key={invoice.invoice_id} invoice={invoice} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}
