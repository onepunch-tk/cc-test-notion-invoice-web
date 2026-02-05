/**
 * ErrorState Component
 *
 * General error state component with retry functionality and variant support.
 * Supports both error (AlertCircle) and warning (AlertTriangle) variants.
 */

import { AlertCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/presentation/components/ui/button";
import { cn } from "~/presentation/lib/utils";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	actionLabel?: string;
	actionHref?: string;
	variant?: "error" | "warning";
	className?: string;
}

/**
 * Retry 버튼 라벨 결정
 * actionLabel이 제공되면 사용, 아니면 기본값 "Try Again"
 */
const getRetryButtonLabel = (actionLabel?: string): string => {
	return actionLabel ?? "Try Again";
};

/**
 * 네비게이션 버튼 라벨 결정
 * - onRetry가 있으면: 항상 "Go Home" (retry 버튼이 primary action)
 * - onRetry가 없으면: actionLabel 또는 기본값 "Go Home"
 */
const getNavigationButtonLabel = (
	hasRetry: boolean,
	actionLabel?: string,
): string => {
	if (hasRetry) {
		return "Go Home";
	}
	return actionLabel ?? "Go Home";
};

export default function ErrorState({
	title = "Something went wrong",
	message = "An unexpected error occurred.",
	onRetry,
	actionLabel,
	actionHref,
	variant = "error",
	className,
}: ErrorStateProps) {
	const Icon = variant === "error" ? AlertCircle : AlertTriangle;
	const iconTestId = variant === "error" ? "error-icon" : "warning-icon";

	const retryButtonLabel = getRetryButtonLabel(actionLabel);
	const navigationButtonLabel = getNavigationButtonLabel(
		!!onRetry,
		actionLabel,
	);

	return (
		<div
			data-testid="error-state"
			role="alert"
			aria-live="assertive"
			className={cn(
				"flex flex-col items-center justify-center py-16 text-center",
				className,
			)}
		>
			<div data-testid={iconTestId} className="mb-4 rounded-full bg-muted p-4">
				<Icon className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-bold text-foreground">{title}</h2>
			<p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
			<div className="mt-8 flex gap-4">
				{onRetry && (
					<Button
						variant={variant === "error" ? "destructive" : "default"}
						onClick={onRetry}
					>
						{retryButtonLabel}
					</Button>
				)}
				{actionHref && (
					<Button variant={onRetry ? "outline" : "default"} asChild>
						<Link to={actionHref}>{navigationButtonLabel}</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
