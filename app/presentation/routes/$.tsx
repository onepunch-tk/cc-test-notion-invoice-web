import type { MetaFunction } from "react-router";
import { NotFoundState } from "~/presentation/components/error";

/**
 * 404 Catch-all Route Meta
 *
 * SEO meta tags for the 404 page
 */
export const meta: MetaFunction = () => {
	return [
		{ title: "페이지를 찾을 수 없습니다 - Invoice-Web" },
		{
			name: "description",
			content: "요청하신 페이지를 찾을 수 없습니다.",
		},
	];
};

/**
 * 404 Catch-all Route Component
 *
 * Displays NotFoundState component for any unmatched routes
 */
export default function CatchAll() {
	return (
		<main className="container mx-auto flex min-h-dvh items-center justify-center p-4">
			<NotFoundState />
		</main>
	);
}
