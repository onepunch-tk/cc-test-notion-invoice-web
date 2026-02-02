import { Link, Outlet } from "react-router";

/**
 * App Layout Component
 *
 * Common layout wrapper for all app routes including:
 * - Header with Invoice-Web branding
 * - Main content area with Outlet for child routes
 * - Footer section
 */
export default function AppLayout() {
	return (
		<div className="min-h-dvh flex flex-col">
			<header className="border-b bg-background">
				<div className="container mx-auto px-4 py-4">
					<Link to="/" className="text-xl font-bold text-foreground">
						Invoice-Web
					</Link>
				</div>
			</header>

			<main className="flex-1">
				<Outlet />
			</main>

			<footer className="border-t bg-muted/50">
				<div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Invoice-Web. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
