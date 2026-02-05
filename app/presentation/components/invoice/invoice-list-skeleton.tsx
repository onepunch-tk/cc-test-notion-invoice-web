/**
 * InvoiceListSkeleton 컴포넌트
 *
 * 인보이스 목록 로딩 시 표시되는 스켈레톤 컴포넌트입니다.
 * InvoiceCard와 동일한 레이아웃 구조를 가집니다.
 */

import {
	Card,
	CardContent,
	CardHeader,
} from "~/presentation/components/ui/card";
import { Skeleton } from "~/presentation/components/ui/skeleton";
import { cn } from "~/presentation/lib/utils";

interface InvoiceListSkeletonProps {
	count?: number;
	className?: string;
}

export default function InvoiceListSkeleton({
	count = 6,
	className,
}: InvoiceListSkeletonProps) {
	return (
		<div
			data-testid="invoice-skeleton-grid"
			className={cn(
				"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				className,
			)}
		>
			{Array.from({ length: count }).map((_, index) => (
				<Card key={`skeleton-${index}`} data-testid="invoice-skeleton-card">
					<CardHeader className="pb-2" data-testid="skeleton-header">
						<div className="flex items-center justify-between animate-pulse">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
					</CardHeader>
					<CardContent data-testid="skeleton-content">
						<div className="space-y-2 animate-pulse">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-28" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
