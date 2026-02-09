import { Link } from "react-router";
import type { Route } from "./+types/home";

/**
 * Home Page Meta
 *
 * SEO meta tags for the home welcome page
 */
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => {
	const headers = new Headers(loaderHeaders);
	headers.set(
		"Cache-Control",
		"public, max-age=0, s-maxage=3600, stale-while-revalidate=60",
	);
	return headers;
};

export const meta = (_: Route.MetaArgs) => {
	return [
		{ title: "Invoice-Web - 인보이스 관리" },
		{
			name: "description",
			content:
				"Notion 데이터베이스로 관리되는 인보이스를 웹에서 조회하고 PDF로 다운로드하세요.",
		},
	];
};

/**
 * Home Page Component
 *
 * Welcome page with:
 * - Service introduction
 * - Link to invoice list
 */
export default function Home() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="mx-auto max-w-2xl text-center">
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
					Invoice-Web
				</h1>
				<p className="mt-6 text-lg leading-8 text-muted-foreground">
					Notion 데이터베이스로 관리되는 인보이스를 웹에서 조회하고 PDF로
					다운로드하세요.
				</p>
				<div className="mt-10">
					<Link
						to="/invoices"
						className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
					>
						인보이스 목록 보기
					</Link>
				</div>
			</div>
		</div>
	);
}
