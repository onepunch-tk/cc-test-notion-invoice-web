/**
 * InvoiceDetailSkeleton 컴포넌트
 *
 * 인보이스 상세 페이지 로딩 시 표시되는 스켈레톤 컴포넌트입니다.
 * 인보이스 상세의 레이아웃 구조를 유지하면서 로딩 상태를 시각화합니다.
 */

import { Skeleton } from "~/presentation/components/ui/skeleton";
import { cn } from "~/presentation/lib/utils";

interface InvoiceDetailSkeletonProps {
	className?: string;
}

export default function InvoiceDetailSkeleton({
	className,
}: InvoiceDetailSkeletonProps) {
	return (
		<div
			data-testid="invoice-detail-skeleton"
			className={cn("space-y-6", className)}
		>
			{/* Header Skeleton - Company Info & Invoice Meta */}
			<div
				data-testid="invoice-detail-skeleton-header"
				className="flex justify-between animate-pulse"
			>
				{/* Company Info (Left) */}
				<div className="space-y-3">
					<Skeleton
						data-testid="invoice-detail-skeleton-logo"
						className="h-12 w-24"
					/>
					<div
						data-testid="invoice-detail-skeleton-company-info"
						className="space-y-2"
					>
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-4 w-64" />
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>

				{/* Invoice Meta (Right) */}
				<div
					data-testid="invoice-detail-skeleton-meta"
					className="text-right space-y-2"
				>
					<Skeleton className="h-8 w-32 ml-auto" />
					<Skeleton className="h-5 w-40 ml-auto" />
					<Skeleton className="h-4 w-36 ml-auto" />
					<Skeleton className="h-4 w-36 ml-auto" />
				</div>
			</div>

			{/* Bill To Skeleton */}
			<div
				data-testid="invoice-detail-skeleton-bill-to"
				className="border-t pt-4 animate-pulse"
			>
				<Skeleton className="h-4 w-16 mb-2" />
				<div className="space-y-2">
					<Skeleton
						data-testid="invoice-detail-skeleton-client-name"
						className="h-5 w-48"
					/>
					<Skeleton
						data-testid="invoice-detail-skeleton-client-address"
						className="h-4 w-72"
					/>
					<Skeleton className="h-4 w-40" />
				</div>
			</div>

			{/* Table Skeleton */}
			<div
				data-testid="invoice-detail-skeleton-table"
				className="animate-pulse"
			>
				{/* Table Header */}
				<div
					data-testid="invoice-detail-skeleton-table-header"
					className="grid grid-cols-4 gap-4 py-3 border-b"
				>
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-12 ml-auto" />
					<Skeleton className="h-4 w-20 ml-auto" />
					<Skeleton className="h-4 w-16 ml-auto" />
				</div>

				{/* Table Rows (5 rows) */}
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={`skeleton-row-${index}`}
						data-testid="invoice-detail-skeleton-table-row"
						className="grid grid-cols-4 gap-4 py-3 border-b"
					>
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-4 w-8 ml-auto" />
						<Skeleton className="h-4 w-20 ml-auto" />
						<Skeleton className="h-4 w-20 ml-auto" />
					</div>
				))}
			</div>

			{/* Summary Skeleton */}
			<div
				data-testid="invoice-detail-skeleton-summary"
				className="flex flex-col items-end gap-2 animate-pulse"
			>
				<div className="flex gap-8">
					<Skeleton className="h-4 w-16" />
					<Skeleton
						data-testid="invoice-detail-skeleton-subtotal"
						className="h-4 w-24"
					/>
				</div>
				<div className="flex gap-8">
					<Skeleton
						data-testid="invoice-detail-skeleton-tax"
						className="h-4 w-20"
					/>
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="flex gap-8 border-t pt-2">
					<Skeleton className="h-5 w-12" />
					<Skeleton
						data-testid="invoice-detail-skeleton-total"
						className="h-5 w-28"
					/>
				</div>
			</div>
		</div>
	);
}
