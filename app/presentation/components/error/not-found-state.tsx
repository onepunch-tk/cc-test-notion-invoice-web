/**
 * NotFoundState Component
 *
 * Reusable 404 state component with customizable props.
 * Follows EmptyInvoiceList pattern with centered flex layout.
 */

import { FileQuestion } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/presentation/components/ui/button";
import { cn } from "~/presentation/lib/utils";

interface NotFoundStateProps {
	title?: string;
	message?: string;
	actionLabel?: string;
	actionHref?: string;
	className?: string;
}

export default function NotFoundState({
	title = "Page Not Found",
	message = "The page you're looking for doesn't exist.",
	actionLabel = "Go to Invoice List",
	actionHref = "/invoices",
	className,
}: NotFoundStateProps) {
	return (
		<div
			data-testid="not-found-state"
			role="status"
			aria-live="polite"
			className={cn(
				"flex flex-col items-center justify-center py-16 text-center",
				className,
			)}
		>
			<h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">
				404
			</h1>
			<div
				data-testid="not-found-icon"
				className="mb-4 rounded-full bg-muted p-4"
			>
				<FileQuestion className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-bold text-foreground">{title}</h2>
			<p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
			<div className="mt-8">
				<Button asChild>
					<Link to={actionHref}>{actionLabel}</Link>
				</Button>
			</div>
		</div>
	);
}
