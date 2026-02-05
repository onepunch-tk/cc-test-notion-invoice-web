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

	// Resolve button labels consistently
	const retryButtonLabel = actionLabel ?? "Try Again";
	const navigationButtonLabel = onRetry
		? "Go Home"
		: (actionLabel ?? "Go Home");

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
