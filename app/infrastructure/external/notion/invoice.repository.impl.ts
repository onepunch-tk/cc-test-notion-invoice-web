/**
 * Notion Invoice Repository 구현체
 *
 * InvoiceRepository 인터페이스를 Notion API를 통해 구현합니다.
 */

import type { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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

/**
 * Notion Invoice Repository 설정 인터페이스
 */
export interface NotionInvoiceRepositoryConfig {
	invoiceDbId: string;
	lineItemDbId: string;
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
	 */
	const findAll = async (): Promise<Invoice[]> => {
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
	};

	/**
	 * Invoice ID로 Invoice와 LineItems 함께 조회
	 */
	const findById = async (
		invoiceId: string,
	): Promise<InvoiceWithLineItems | null> => {
		const response = await client.databases.query({
			database_id: config.invoiceDbId,
			filter: {
				property: "Invoice ID",
				title: {
					equals: invoiceId,
				},
			},
		});

		const pages = response.results.filter(isPageObjectResponse);
		if (pages.length === 0) {
			return null;
		}

		const invoice = mapNotionPageToInvoice(pages[0]);
		const lineItems = await findLineItems(invoiceId);

		return {
			...invoice,
			line_items: lineItems,
		};
	};

	/**
	 * Invoice ID로 LineItems 조회
	 */
	const findLineItems = async (
		invoiceId: string,
	): Promise<InvoiceLineItem[]> => {
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
	};

	return {
		findAll,
		findById,
		findLineItems,
	};
};
