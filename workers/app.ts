import { createRequestHandler } from "react-router";

/**
 * Cloudflare Workers 환경 변수 타입 정의
 */
interface Env {
	// 데이터베이스
	DATABASE_URL: string;

	// Better-auth
	BASE_URL: string;
	BETTER_AUTH_SECRET: string;

	// OAuth 프로바이더
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	KAKAO_CLIENT_ID?: string;
	KAKAO_CLIENT_SECRET?: string;
}

/**
 * React Router의 AppLoadContext에 Cloudflare 환경 정보 추가
 * loader/action에서 context.cloudflare.env로 접근 가능
 */
declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const build = await import("virtual:react-router/server-build");
const requestHandler = createRequestHandler(build, import.meta.env.MODE);

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		try {
			return await requestHandler(request, { cloudflare: { env, ctx } });
		} catch (error) {
			console.error("Worker fetch error:", error);
			return new Response("Internal Server Error", { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
