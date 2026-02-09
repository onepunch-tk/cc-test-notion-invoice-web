/**
 * Notion Company Repository 구현체
 *
 * CompanyRepository 인터페이스의 Notion API 기반 구현
 */

import type { Client } from "@notionhq/client";
import {
	CompanyInfoNotFoundError,
	NotionApiError,
} from "~/application/invoice/errors";
import type { CompanyRepository } from "~/application/invoice/invoice.port";
import type { CompanyInfo } from "~/domain/company";
import { mapNotionPageToCompanyInfo } from "./notion.mapper";
import { isPageObjectResponse } from "./notion.types";

/**
 * Notion Company Repository 설정 인터페이스
 */
export interface NotionCompanyRepositoryConfig {
	companyDbId: string;
}

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
		 *
		 * @returns 회사 정보
		 * @throws CompanyInfoNotFoundError 회사 정보가 없는 경우
		 * @throws NotionApiError Notion API 호출 실패 시
		 */
		getCompanyInfo: async (): Promise<CompanyInfo> => {
			try {
				const response = await client.databases.query({
					database_id: config.companyDbId,
					page_size: 1,
				});

				const pages = response.results.filter(isPageObjectResponse);

				if (pages.length === 0) {
					throw new CompanyInfoNotFoundError();
				}

				return mapNotionPageToCompanyInfo(pages[0]);
			} catch (error) {
				// CompanyInfoNotFoundError는 그대로 전파
				if (error instanceof CompanyInfoNotFoundError) {
					throw error;
				}
				const detail = error instanceof Error ? error.message : "Unknown error";
				throw new NotionApiError(
					`Failed to fetch company information from Notion: ${detail}`,
					error,
				);
			}
		},
	};
};
