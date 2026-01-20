import type { Route } from "./+types/robots";

export async function loader({ request }: Route.LoaderArgs) {
	//예) Disallow: /dashboard
	const content = `
	User-agent: *
	Allow: /
	Sitemap: ${new URL(request.url).origin}/sitemap.xml
		`.trim();

	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
			"Cache-Control": "public, max-age=86400", // 하루 캐시
		},
	});
}
