/**
 * MSW v2 Handlers for Notion API
 *
 * Notion API 엔드포인트에 대한 MSW 핸들러 정의
 */

import { http, HttpResponse } from "msw";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
	createMockInvoicePage,
	createMockLineItemPage,
	createMockCompanyInfoPage,
	createNotionQueryResponse,
	createNotionErrorResponse,
} from "./data";

/**
 * 기본 Notion API 핸들러
 *
 * databaseId에 따라 적절한 mock 데이터를 반환합니다.
 */
export const notionHandlers = [
	http.post(
		"https://api.notion.com/v1/databases/:databaseId/query",
		({ params }) => {
			const { databaseId } = params;

			// Invoice DB 조회
			if (databaseId === "invoice-db-id") {
				const invoicePage = createMockInvoicePage();
				return HttpResponse.json(createNotionQueryResponse([invoicePage]));
			}

			// LineItem DB 조회
			if (databaseId === "lineitem-db-id") {
				const lineItemPage = createMockLineItemPage();
				return HttpResponse.json(createNotionQueryResponse([lineItemPage]));
			}

			// Company DB 조회
			if (databaseId === "company-db-id") {
				const companyPage = createMockCompanyInfoPage();
				return HttpResponse.json(createNotionQueryResponse([companyPage]));
			}

			// 알 수 없는 database ID
			return HttpResponse.json(createNotionQueryResponse([]));
		},
	),
];

/**
 * 특정 응답을 반환하는 커스텀 핸들러 팩토리
 *
 * @param databaseId - Database ID
 * @param pages - 반환할 페이지 배열
 * @returns MSW 핸들러
 */
export const createNotionHandler = (
	databaseId: string,
	pages: PageObjectResponse[],
) => {
	return http.post(
		"https://api.notion.com/v1/databases/:databaseId/query",
		({ params }) => {
			if (params.databaseId === databaseId) {
				return HttpResponse.json(createNotionQueryResponse(pages));
			}
			return HttpResponse.json(createNotionQueryResponse([]));
		},
	);
};

/**
 * 여러 Database ID에 대한 응답을 처리하는 핸들러 팩토리
 *
 * @param responseMap - Database ID를 키로, PageObjectResponse 배열을 값으로 하는 맵
 * @returns MSW 핸들러
 */
export const createMultiDatabaseHandler = (
	responseMap: Record<string, PageObjectResponse[]>,
) => {
	return http.post(
		"https://api.notion.com/v1/databases/:databaseId/query",
		({ params }) => {
			const { databaseId } = params;
			const pages = responseMap[databaseId as string] || [];
			return HttpResponse.json(createNotionQueryResponse(pages));
		},
	);
};

/**
 * Notion API 에러 핸들러 팩토리
 *
 * @param status - HTTP 상태 코드
 * @param code - Notion 에러 코드
 * @param message - 에러 메시지
 * @returns MSW 핸들러
 */
export const notionApiErrorHandler = (
	status: number,
	code: string,
	message: string,
) => {
	return http.post(
		"https://api.notion.com/v1/databases/:databaseId/query",
		() => {
			return HttpResponse.json(
				createNotionErrorResponse(status, code, message),
				{ status },
			);
		},
	);
};

/**
 * 401 Unauthorized 에러 핸들러
 */
export const notionUnauthorizedHandler = () => {
	return notionApiErrorHandler(
		401,
		"unauthorized",
		"API token is invalid or has been revoked.",
	);
};

/**
 * 429 Rate Limit 에러 핸들러
 */
export const notionRateLimitHandler = () => {
	return notionApiErrorHandler(
		429,
		"rate_limited",
		"You have exceeded the rate limit.",
	);
};

/**
 * 500 Server Error 핸들러
 */
export const notionServerErrorHandler = () => {
	return notionApiErrorHandler(
		500,
		"internal_server_error",
		"An unexpected error occurred.",
	);
};

/**
 * 네트워크 에러 핸들러
 */
export const notionNetworkErrorHandler = () => {
	return http.post(
		"https://api.notion.com/v1/databases/:databaseId/query",
		() => {
			return HttpResponse.error();
		},
	);
};
