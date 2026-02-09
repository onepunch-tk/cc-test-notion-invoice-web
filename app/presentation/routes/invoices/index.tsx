/**
 * Invoice List Page
 *
 * 인보이스 목록을 그리드 레이아웃으로 표시합니다.
 * 로딩 상태, 빈 상태, 에러 상태를 조건부 렌더링합니다.
 */

import type { MetaFunction } from "react-router";
import {
	isRouteErrorResponse,
	useLoaderData,
	useNavigation,
	useRouteError,
} from "react-router";
import { NotionApiError } from "~/application/invoice/errors";
import { sanitizeErrorMessage } from "~/infrastructure/utils/error-sanitizer";
import { ErrorState } from "~/presentation/components/error";
import {
	EmptyInvoiceList,
	InvoiceCard,
	InvoiceListSkeleton,
} from "~/presentation/components/invoice";
import type { Route } from "./+types/index";

/**
 * Invoice List Page Meta
 *
 * SEO meta tags for the invoice list page
 */
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => {
	const headers = new Headers(loaderHeaders);
	headers.set(
		"Cache-Control",
		"public, max-age=0, s-maxage=300, stale-while-revalidate=60",
	);
	return headers;
};

export const meta: MetaFunction = () => {
	return [
		{ title: "인보이스 목록 - Invoice-Web" },
		{
			name: "description",
			content:
				"Notion 데이터베이스와 연동된 인보이스 관리 시스템. 발행된 인보이스를 목록으로 확인하고 각 인보이스의 상세 정보를 조회할 수 있습니다.",
		},
	];
};

/**
 * Invoice List Loader
 *
 * 서버에서 인보이스 목록을 가져옵니다.
 * DI 컨테이너를 통해 InvoiceService에 접근합니다.
 *
 * @param context - Route context with DI container
 * @returns 인보이스 목록 데이터
 * @throws Response(500) 서비스 에러 시
 */
export const loader = async ({ context }: Route.LoaderArgs) => {
	try {
		const invoices = await context.container.invoiceService.getInvoiceList();
		return { invoices };
	} catch (error) {
		const message =
			error instanceof Error
				? sanitizeErrorMessage(error.message)
				: "Failed to load invoices";

		if (error instanceof NotionApiError && error.cause) {
			const causeMessage =
				error.cause instanceof Error
					? error.cause.message
					: String(error.cause);
			console.error("[InvoiceList Loader]", message, "| Cause:", causeMessage);
		} else {
			console.error("[InvoiceList Loader]", message);
		}

		throw new Response(message, { status: 500 });
	}
};

/**
 * Invoice List Page Component
 *
 * Displays list of invoices with:
 * - Responsive grid layout
 * - Loading skeleton (via loader pending state)
 * - Empty state
 * - Invoice cards
 */
export default function InvoiceList() {
	const { invoices } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

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

/**
 * 페이지 새로고침으로 재시도
 */
const handlePageRetry = () => {
	window.location.reload();
};

/**
 * 에러 상태에 따른 메시지 결정
 *
 * @param error - Route error object
 * @returns title과 message를 포함한 객체
 */
const getErrorContent = (error: unknown) => {
	if (isRouteErrorResponse(error)) {
		return {
			title: "인보이스를 불러올 수 없습니다",
			message:
				typeof error.status === "number" && error.status === 500
					? "서버에서 데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
					: `오류가 발생했습니다 (${error.status})`,
		};
	}

	return {
		title: "예기치 않은 오류가 발생했습니다",
		message: "페이지를 다시 로드하거나 홈으로 이동해주세요.",
	};
};

/**
 * Invoice List Error Boundary
 *
 * 로더 에러 발생 시 사용자 친화적인 에러 UI를 표시합니다.
 * - 재시도 버튼
 * - 홈으로 이동 링크
 */
export function ErrorBoundary() {
	const error = useRouteError();
	const { title, message } = getErrorContent(error);

	return (
		<div
			data-testid="invoice-list-container"
			className="container mx-auto max-w-7xl px-4 py-8"
		>
			<ErrorState
				title={title}
				message={message}
				onRetry={handlePageRetry}
				actionHref="/"
				variant="error"
			/>
		</div>
	);
}
