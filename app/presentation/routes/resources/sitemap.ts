import type { Route } from "./+types/sitemap";

export async function loader({ request }: Route.LoaderArgs) {
	const domain = new URL(request.url).origin;

	// 정적 페이지
	//예) const staticPaths = ["/", "/login", "/auth/signup"];
	const staticPaths = ["/"];

	// 동적 페이지 (db 조회)
	//예) const allPosts = await db.select().from(posts);
	/*
✅ (Good) 딱 필요한 컬럼만 가져옴 -> 속도와 메모리 수십 배 절약
const allPosts = await db
  .select({ 
    id: posts.id, 
    updatedAt: posts.updatedAt // lastmod용 (필요하면)
  })
  .from(posts);
   */
	const dynamicPaths: string[] = [];

	const allPaths = [...staticPaths, ...dynamicPaths];

	// 2. XML 생성 로직
	const sitemapUrls = allPaths.map((url) => {
		return `
    <url>
      <loc>${domain}${url}</loc>
      <changefreq>daily</changefreq>
      <priority>${url === "/" ? "1.0" : "0.8"}</priority>
    </url>`;
	});

	const content = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${sitemapUrls.join("")}
</urlset>
`.trim();

	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
