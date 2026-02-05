import type { Route } from "./+types/sitemap";

/**
 * Sitemap URL 옵션
 */
interface SitemapUrlOptions {
	path: string;
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	priority?: string;
	lastmod?: string;
}

/**
 * Sitemap URL XML 생성
 *
 * @param domain - 사이트 도메인 (origin)
 * @param options - URL 옵션
 * @returns XML URL 요소 문자열
 */
const generateSitemapUrl = (
	domain: string,
	options: SitemapUrlOptions,
): string => {
	const { path, changefreq = "daily", priority, lastmod } = options;
	const resolvedPriority = priority ?? (path === "/" ? "1.0" : "0.8");

	return `  <url>
    <loc>${domain}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${resolvedPriority}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
};

export async function loader({ request }: Route.LoaderArgs) {
	const domain = new URL(request.url).origin;

	// 정적 페이지
	const staticPaths = ["/"];

	// 동적 페이지 (db 조회)
	// TODO: Task 010/011에서 인보이스 페이지 추가
	const dynamicPaths: string[] = [];

	const allPaths = [...staticPaths, ...dynamicPaths];

	// XML 생성
	const sitemapUrls = allPaths.map((path) =>
		generateSitemapUrl(domain, { path }),
	);

	const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
${sitemapUrls.join("\n")}
</urlset>`;

	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
