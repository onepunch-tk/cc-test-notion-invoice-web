import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./app/infrastructure/persistence/schema/index.ts",
	out: "./supabase/migrations", // Supabase 표준 폴더 사용
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
