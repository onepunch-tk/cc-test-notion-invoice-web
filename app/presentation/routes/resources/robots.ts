import type { Route } from "./+types/robots";

export async function loader({ request }: Route.LoaderArgs) {
	const origin = new URL(request.url).origin;

	// 들여쓰기 없이 깔끔한 robots.txt 출력
	const content = `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml`;

	return new Response(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
			"Cache-Control": "public, max-age=86400", // 하루 캐시
		},
	});
}
