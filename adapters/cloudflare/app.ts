import { createRequestHandler } from "react-router";
import { createContainer } from "~/infrastructure/config/container";
import { extractCloudflareEnv } from "./env.adapter";

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

/**
 * Cloudflare Workers 진입점
 */
export default {
	async fetch(request, cloudflareEnv, ctx) {
		// 환경 변수 추출
		const env = extractCloudflareEnv(cloudflareEnv);

		// KV 바인딩 추출 (wrangler.toml에 INVOICE_CACHE로 설정됨)
		const kv = cloudflareEnv.INVOICE_CACHE;

		// Composition Root: Container 생성 및 주입 (KV 전달)
		const container = createContainer(env, kv);

		return requestHandler(request, {
			env,
			platform: "cloudflare",
			cloudflare: { ctx },
			container,
		});
	},
} satisfies ExportedHandler<Env>;
