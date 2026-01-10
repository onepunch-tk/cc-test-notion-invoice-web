import type { Config } from "@react-router/dev/config";

export default {
	ssr: true,
	future: {
		v8_viteEnvironmentApi: true, // Cloudflare Workers 지원
	},
} satisfies Config;
