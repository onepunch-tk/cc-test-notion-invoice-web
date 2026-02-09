/**
 * Cloudflare Workers용 Vite 설정
 *
 * Cloudflare Vite 플러그인을 포함하여 Workers 환경에서 동작하도록 설정합니다.
 */
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		process.env.ANALYZE === "true" &&
			import("rollup-plugin-visualizer").then((m) =>
				m.visualizer({
					open: true,
					filename: "stats.html",
					gzipSize: true,
					brotliSize: true,
				}),
			),
	],
});
