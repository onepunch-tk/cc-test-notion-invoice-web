import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	// ⚠️ 중요: Cloudflare 플러그인 포함하지 않음!
	// tsconfigPaths와 react 플러그인만 사용
	plugins: [react(), tsconfigPaths()],
	test: {
		// DOM 환경 설정
		environment: "jsdom",

		// describe, it, expect 등 import 없이 사용
		globals: true,

		// 테스트 설정 파일
		setupFiles: ["./__tests__/setup.ts"],

		// 테스트 파일 패턴
		include: ["__tests__/**/*.test.{ts,tsx}"],

		// 제외 패턴
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/build/**",
			"**/.react-router/**",
			"**/components/ui/**",
		],

		// 커버리지 설정
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage",
			include: [
				"adapters/**/*.ts",
				"app/domain/**/*.ts",
				"app/application/**/*.ts",
				"app/presentation/**/*.{ts,tsx}",
			],
			exclude: ["**/*.d.ts", "**/index.ts", "**/types/**"],
			// 커버리지 임계값 설정
			thresholds: {
				statements: 90,
				branches: 90,
				functions: 90,
				lines: 90,
			},
		},

		// 타임아웃 설정 (ms)
		testTimeout: 10000,
		hookTimeout: 10000,
	},
});
