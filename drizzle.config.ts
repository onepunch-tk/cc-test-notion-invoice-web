import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./app/db/schema.ts",
	out: "./drizzle", // 마이그레이션 파일을 루트로 이동 (개발 전용)
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
