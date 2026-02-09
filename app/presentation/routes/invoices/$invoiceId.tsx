/**
 * Invoice Detail Page
 *
 * 인보이스 상세 정보를 표시하는 페이지입니다.
 * 회사 정보, 고객 정보, 라인 아이템 테이블, 합계 섹션을 포함합니다.
 * A4 인쇄 최적화 및 PDF 다운로드 플레이스홀더를 제공합니다.
 */

import { z } from "zod";
import {
	isRouteErrorResponse,
	useLoaderData,
	useNavigation,
	useRouteError,
} from "react-router";
import {
	InvoiceNotFoundError,
	NotionApiError,
} from "~/application/invoice/errors";
import { sanitizeErrorMessage } from "~/infrastructure/utils/error-sanitizer";
import { ErrorState, NotFoundState } from "~/presentation/components/error";
import {
	InvoiceActions,
	InvoiceHeader,
	InvoiceSummary,
	InvoiceTable,
} from "~/presentation/components/invoice";
import { Card, CardContent } from "~/presentation/components/ui/card";
import type { Route } from "./+types/$invoiceId";

/**
 * invoiceId 파라미터 검증 스키마
 *
 * Notion 페이지 ID 형식: 32자리 hex (하이픈 포함/미포함)
 * 허용: a-f, 0-9, 하이픈만
 */
const invoiceIdSchema = z
	.string()
	.min(1, "Invoice ID is required")
	.max(100, "Invoice ID is too long")
	.regex(
		/^[a-f0-9-]+$/i,
		"Invoice ID must contain only hexadecimal characters and hyphens",
	);

/**
 * Invoice Detail Page Meta
 *
 * SEO meta tags - loader 데이터로 동적 제목 설정
 */
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => {
	const headers = new Headers(loaderHeaders);
	headers.set(
		"Cache-Control",
		"public, max-age=0, s-maxage=600, stale-while-revalidate=60",
	);
	return headers;
};

export const meta: Route.MetaFunction = ({ data }) => {
	const title = data?.invoice
		? `Invoice #${data.invoice.invoice_number}`
		: "인보이스 상세 - Invoice-Web";

	return [
		{ title },
		{
			name: "description",
			content: "인보이스 상세 정보를 조회합니다.",
		},
	];
};

/**
 * Invoice Detail Loader
 *
 * params에서 invoiceId를 추출하고 검증한 후,
 * DI 컨테이너를 통해 인보이스 상세 정보를 가져옵니다.
 *
 * @throws Response(400) 잘못된 invoiceId 형식
 * @throws Response(404) 인보이스 미존재
 * @throws Response(500) 서비스 에러
 */
export const loader = async ({ params, context }: Route.LoaderArgs) => {
	// Step 1: invoiceId 파라미터 검증
	const parseResult = invoiceIdSchema.safeParse(params.invoiceId);
	if (!parseResult.success) {
		throw new Response("Invalid invoice ID format", { status: 400 });
	}

	const invoiceId = parseResult.data;

	// Step 2: 인보이스 상세 조회
	try {
		const { invoice, company } =
			await context.container.invoiceService.getInvoiceDetail(invoiceId);

		return {
			invoice,
			companyInfo: company,
		};
	} catch (error) {
		// 404: InvoiceNotFoundError
		if (error instanceof InvoiceNotFoundError) {
			throw new Response("Invoice not found", { status: 404 });
		}

		// 500: 기타 에러
		const message =
			error instanceof Error
				? sanitizeErrorMessage(error.message)
				: "Failed to load invoice detail";

		if (error instanceof NotionApiError && error.cause) {
			const causeMessage =
				error.cause instanceof Error
					? error.cause.message
					: String(error.cause);
			console.error(
				"[InvoiceDetail Loader]",
				message,
				"| Cause:",
				causeMessage,
			);
		} else {
			console.error("[InvoiceDetail Loader]", message);
		}

		throw new Response(message, { status: 500 });
	}
};

/**
 * Invoice Detail Page Component
 *
 * Displays invoice details with:
 * - InvoiceActions (navigation, print, PDF download)
 * - InvoiceHeader (company info, invoice meta, client info)
 * - InvoiceTable (line items)
 * - InvoiceSummary (totals)
 * - Notes section (optional)
 */
export default function InvoiceDetail() {
	const { invoice, companyInfo } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	if (isLoading) {
		return (
			<div
				data-testid="invoice-detail-container"
				className="container mx-auto px-4 py-8 max-w-4xl print-optimized"
			>
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-muted rounded w-1/3" />
					<div className="h-4 bg-muted rounded w-1/4" />
					<div className="h-64 bg-muted rounded" />
				</div>
			</div>
		);
	}

	return (
		<div
			data-testid="invoice-detail-container"
			className="container mx-auto px-4 py-8 max-w-4xl print-optimized"
		>
			{/* Actions - Hidden on print */}
			<div className="mb-6 flex justify-between items-center no-print">
				<div>
					<h1 className="text-3xl font-bold text-foreground">인보이스 상세</h1>
					<p className="mt-1 text-muted-foreground">
						인보이스 ID: {invoice.invoice_id}
					</p>
				</div>
				<InvoiceActions invoice={invoice} companyInfo={companyInfo} />
			</div>

			{/* Invoice Content Card */}
			<Card className="print-avoid-break">
				<CardContent className="p-6 md:p-8 space-y-6">
					{/* Header - Company & Client Info */}
					<InvoiceHeader invoice={invoice} companyInfo={companyInfo} />

					{/* Line Items Table */}
					<InvoiceTable
						lineItems={invoice.line_items}
						currency={invoice.currency}
						className="border-t pt-6"
					/>

					{/* Summary */}
					<InvoiceSummary
						subtotal={invoice.subtotal}
						taxRate={invoice.tax_rate}
						taxAmount={invoice.tax_amount}
						totalAmount={invoice.total_amount}
						currency={invoice.currency}
						className="border-t pt-6"
					/>

					{/* Notes Section */}
					{invoice.notes && (
						<div
							data-testid="invoice-notes"
							className="border-t pt-6 print-avoid-break"
						>
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								Notes
							</h3>
							<p className="text-sm text-foreground whitespace-pre-wrap">
								{invoice.notes}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * 페이지 새로고침으로 재시도
 */
const handlePageRetry = () => {
	window.location.reload();
};

/**
 * 에러 상태에 따른 콘텐츠 결정
 */
const getErrorContent = (error: unknown) => {
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return { type: "notFound" as const };
		}
		if (error.status === 400) {
			return {
				type: "error" as const,
				title: "잘못된 요청입니다",
				message: "인보이스 ID 형식이 올바르지 않습니다.",
			};
		}
		return {
			type: "error" as const,
			title: "인보이스를 불러올 수 없습니다",
			message:
				error.status === 500
					? "서버에서 데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
					: `오류가 발생했습니다 (${error.status})`,
		};
	}

	return {
		type: "error" as const,
		title: "예기치 않은 오류가 발생했습니다",
		message: "페이지를 다시 로드하거나 홈으로 이동해주세요.",
	};
};

/**
 * Invoice Detail Error Boundary
 *
 * 404: NotFoundState 렌더링
 * 400/500/기타: ErrorState 렌더링
 */
export function ErrorBoundary() {
	const error = useRouteError();
	const content = getErrorContent(error);

	return (
		<div
			data-testid="invoice-detail-container"
			className="container mx-auto max-w-4xl px-4 py-8"
		>
			{content.type === "notFound" ? (
				<NotFoundState
					title="인보이스를 찾을 수 없습니다"
					message="요청하신 인보이스가 존재하지 않거나 삭제되었습니다."
					actionLabel="인보이스 목록으로"
					actionHref="/invoices"
				/>
			) : (
				<ErrorState
					title={content.title}
					message={content.message}
					onRetry={handlePageRetry}
					actionHref="/invoices"
					variant="error"
				/>
			)}
		</div>
	);
}
