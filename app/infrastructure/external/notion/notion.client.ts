import { Client } from "@notionhq/client";

/**
 * Notion Client 설정 인터페이스
 */
export interface NotionClientConfig {
	/** Notion API 키 (Integration Token) */
	apiKey: string;
}

/**
 * Notion API 클라이언트 팩토리 함수
 *
 * @param config - Notion 클라이언트 설정
 * @returns Notion Client 인스턴스
 *
 * @example
 * ```ts
 * const client = createNotionClient({ apiKey: process.env.NOTION_API_KEY });
 * ```
 */
export const createNotionClient = (config: NotionClientConfig): Client => {
	return new Client({ auth: config.apiKey });
};
