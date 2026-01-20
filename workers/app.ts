import { createRequestHandler } from "react-router";
import type { IContainer } from "~/application/shared/container.types";
import { createContainer } from "~/infrastructure/config/container";

/**
 * React Router의 AppLoadContext에 Cloudflare 환경 정보와 DI Container 추가
 * loader/action에서 context.container로 서비스 접근 가능
 */
declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
		container: IContainer;
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		// Composition Root: Container 생성 및 주입
		const container = createContainer(env);

		return requestHandler(request, {
			cloudflare: { env, ctx },
			container,
		});
	},
} satisfies ExportedHandler<Env>;
