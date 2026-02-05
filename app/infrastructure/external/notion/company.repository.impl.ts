/**
 * Notion Company Repository 구현체
 *
 * CompanyRepository 인터페이스의 Notion API 기반 구현
 */

import type { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { CompanyRepository } from "~/application/invoice/invoice.port";
import type { CompanyInfo } from "~/domain/company";
import { mapNotionPageToCompanyInfo } from "./notion.mapper";

/**
 * Notion Company Repository 설정 인터페이스
 */
export interface NotionCompanyRepositoryConfig {
	companyDbId: string;
}

/**
 * PageObjectResponse 타입 가드
 */
const isPageObjectResponse = (
	result: unknown,
): result is PageObjectResponse => {
	return (
		typeof result === "object" &&
		result !== null &&
		"object" in result &&
		(result as { object: string }).object === "page" &&
		"properties" in result
	);
};

/**
 * Notion 기반 Company Repository 생성 팩토리 함수
 *
 * @param client - Notion API 클라이언트
 * @param config - Repository 설정
 * @returns CompanyRepository 구현체
 */
export const createNotionCompanyRepository = (
	client: Client,
	config: NotionCompanyRepositoryConfig,
): CompanyRepository => {
	return {
		/**
		 * 회사 정보 조회
		 *
		 * Company 데이터베이스에서 첫 번째 레코드를 조회합니다.
		 * 회사 정보가 없을 경우 에러를 발생시킵니다.
		 */
		getCompanyInfo: async (): Promise<CompanyInfo> => {
			const response = await client.databases.query({
				database_id: config.companyDbId,
				page_size: 1,
			});

			const pages = response.results.filter(isPageObjectResponse);

			if (pages.length === 0) {
				throw new Error("Company information not found");
			}

			return mapNotionPageToCompanyInfo(pages[0]);
		},
	};
};
