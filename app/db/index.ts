import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Drizzle 클라이언트 생성
 * @param databaseUrl PostgreSQL 연결 URL
 * @returns Drizzle 클라이언트 인스턴스
 */
export const createDrizzleClient = (databaseUrl: string) => {
	const client = postgres(databaseUrl, { prepare: false });
	return drizzle(client, { schema });
};

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;

// 스키마 export
export * from "./schema";
