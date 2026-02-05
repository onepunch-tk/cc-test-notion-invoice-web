/**
 * Notion Invoice Repository 구현체
 *
 * InvoiceRepository 인터페이스를 Notion API를 통해 구현합니다.
 */

import type { Client } from "@notionhq/client";
import { NotionApiError } from "~/application/invoice/errors";
import type { InvoiceRepository } from "~/application/invoice/invoice.port";
import type {
	Invoice,
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice";
import {
	mapNotionPageToInvoice,
	mapNotionPageToLineItem,
} from "./notion.mapper";
import { isPageObjectResponse } from "./notion.types";

/**
 * Notion Invoice Repository 설정 인터페이스
 */
export interface NotionInvoiceRepositoryConfig {
	invoiceDbId: string;
	lineItemDbId: string;
}

/**
 * Notion 기반 Invoice Repository 생성 팩토리 함수
 *
 * @param client - Notion API 클라이언트
 * @param config - Repository 설정
 * @returns InvoiceRepository 구현체
 */
export const createNotionInvoiceRepository = (
	client: Client,
	config: NotionInvoiceRepositoryConfig,
): InvoiceRepository => {
	/**
	 * 모든 Invoice 조회
	 *
	 * @returns 모든 Invoice 목록 (생성일 내림차순 정렬)
	 * @throws NotionApiError Notion API 호출 실패 시
	 */
	const findAll = async (): Promise<Invoice[]> => {
		try {
			const response = await client.databases.query({
				database_id: config.invoiceDbId,
				sorts: [
					{
						timestamp: "created_time",
						direction: "descending",
					},
				],
			});

			return response.results
				.filter(isPageObjectResponse)
				.map(mapNotionPageToInvoice);
		} catch (error) {
			throw new NotionApiError(
				"Failed to fetch invoice list from Notion",
				error,
			);
		}
	};

	/**
	 * Invoice ID로 Invoice와 LineItems 함께 조회
	 *
	 * Invoice와 LineItems를 병렬로 조회하여 성능을 최적화합니다.
	 *
	 * @param invoiceId - 조회할 Invoice ID
	 * @returns Invoice와 LineItems 또는 null (존재하지 않는 경우)
	 * @throws NotionApiError Notion API 호출 실패 시
	 */
	const findById = async (
		invoiceId: string,
	): Promise<InvoiceWithLineItems | null> => {
		try {
			// Invoice와 LineItems를 병렬로 조회하여 성능 최적화
			const [invoiceResponse, lineItemsResponse] = await Promise.all([
				client.databases.query({
					database_id: config.invoiceDbId,
					filter: {
						property: "Invoice ID",
						title: {
							equals: invoiceId,
						},
					},
				}),
				client.databases.query({
					database_id: config.lineItemDbId,
					filter: {
						property: "Invoice ID",
						rich_text: {
							equals: invoiceId,
						},
					},
					sorts: [
						{
							property: "Sort Order",
							direction: "ascending",
						},
					],
				}),
			]);

			const pages = invoiceResponse.results.filter(isPageObjectResponse);
			if (pages.length === 0) {
				return null;
			}

			const invoice = mapNotionPageToInvoice(pages[0]);
			const lineItems = lineItemsResponse.results
				.filter(isPageObjectResponse)
				.map(mapNotionPageToLineItem);

			return {
				...invoice,
				line_items: lineItems,
			};
		} catch (error) {
			throw new NotionApiError(
				`Failed to fetch invoice detail for ID: ${invoiceId}`,
				error,
			);
		}
	};

	/**
	 * Invoice ID로 LineItems 조회
	 *
	 * @param invoiceId - 조회할 Invoice ID
	 * @returns LineItems 목록 (Sort Order 오름차순 정렬)
	 * @throws NotionApiError Notion API 호출 실패 시
	 */
	const findLineItems = async (
		invoiceId: string,
	): Promise<InvoiceLineItem[]> => {
		try {
			const response = await client.databases.query({
				database_id: config.lineItemDbId,
				filter: {
					property: "Invoice ID",
					rich_text: {
						equals: invoiceId,
					},
				},
				sorts: [
					{
						property: "Sort Order",
						direction: "ascending",
					},
				],
			});

			return response.results
				.filter(isPageObjectResponse)
				.map(mapNotionPageToLineItem);
		} catch (error) {
			throw new NotionApiError(
				`Failed to fetch line items for invoice: ${invoiceId}`,
				error,
			);
		}
	};

	return {
		findAll,
		findById,
		findLineItems,
	};
};
