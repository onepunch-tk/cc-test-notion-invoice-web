/**
 * DI Container 생성
 *
 * Composition Root에서 호출되어 모든 의존성을 생성하고 주입합니다.
 * Cloudflare Workers 환경에서 사용됩니다.
 */

import type { AppEnv } from "adapters/shared/env";
import { createInvoiceService } from "~/application/invoice/invoice.service";
import type { IContainer } from "~/application/shared/container.types";
import { createNotionCompanyRepository } from "~/infrastructure/external/notion/company.repository.impl";
import { createNotionInvoiceRepository } from "~/infrastructure/external/notion/invoice.repository.impl";
import { createNotionClient } from "~/infrastructure/external/notion/notion.client";

/**
 * DI Container 생성 팩토리 함수
 *
 * @param env - 애플리케이션 환경 변수
 * @returns IContainer 인터페이스를 구현하는 컨테이너
 */
export const createContainer = (env: AppEnv): IContainer => {
	// Notion Client 생성
	const notionClient = createNotionClient({
		apiKey: env.NOTION_API_KEY,
	});

	// Repository 생성
	const invoiceRepository = createNotionInvoiceRepository(notionClient, {
		invoiceDbId: env.NOTION_INVOICE_DATABASE_ID,
		lineItemDbId: env.NOTION_LINE_ITEM_DATABASE_ID,
	});

	const companyRepository = createNotionCompanyRepository(notionClient, {
		companyDbId: env.NOTION_COMPANY_DATABASE_ID,
	});

	// Service 생성
	const invoiceService = createInvoiceService({
		invoiceRepository,
		companyRepository,
	});

	return {
		invoiceService,
	};
};
