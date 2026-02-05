import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import "./app.css";
import { ThemeProvider } from "next-themes";
import { sanitizeErrorMessage } from "~/infrastructure/utils/error-sanitizer";
import { ErrorState, NotFoundState } from "~/presentation/components/error";
import { Toaster } from "~/presentation/components/ui/sonner";
import type { Route } from "./+types/root";

/**
 * Handler for retry button - reloads the page.
 * Defined at module level to prevent recreation on each render.
 */
const handleRetry = () => {
	window.location.reload();
};

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
					<Toaster />
					<ScrollRestoration />
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return (
				<main className="container mx-auto flex min-h-dvh items-center justify-center p-4">
					<NotFoundState />
				</main>
			);
		}

		return (
			<main className="container mx-auto flex min-h-dvh items-center justify-center p-4">
				<ErrorState
					title={`Error ${error.status}`}
					message={error.statusText || "An unexpected error occurred."}
					actionHref="/"
				/>
			</main>
		);
	}

	if (error instanceof Error) {
		const displayMessage = import.meta.env.DEV
			? sanitizeErrorMessage(error.message)
			: "An unexpected error occurred.";

		return (
			<main className="container mx-auto flex min-h-dvh items-center justify-center p-4">
				<div className="w-full max-w-2xl">
					<ErrorState
						title="Something went wrong"
						message={displayMessage}
						onRetry={handleRetry}
						actionHref="/"
					/>
					{import.meta.env.DEV && error.stack && (
						<pre className="mt-8 w-full overflow-x-auto rounded-lg bg-muted p-4 text-xs">
							<code>{sanitizeErrorMessage(error.stack)}</code>
						</pre>
					)}
				</div>
			</main>
		);
	}

	return (
		<main className="container mx-auto flex min-h-dvh items-center justify-center p-4">
			<ErrorState
				title="Unknown Error"
				message="An unexpected error occurred."
				onRetry={handleRetry}
				actionHref="/"
			/>
		</main>
	);
}
