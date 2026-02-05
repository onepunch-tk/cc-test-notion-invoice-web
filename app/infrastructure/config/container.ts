/**
 * DI Container 생성
 *
 * Composition Root에서 호출되어 모든 의존성을 생성하고 주입합니다.
 * Cloudflare Workers 환경에서 사용됩니다.
 */

import type { AppEnv } from "adapters/shared/env";
import { createInvoiceService } from "~/application/invoice/invoice.service";
import type { IContainer } from "~/application/shared/container.types";
import {
	CIRCUIT_BREAKER_CONFIG,
	RATE_LIMIT_CONFIG,
	circuitBreakerKey,
} from "~/infrastructure/external/cloudflare/cache-keys";
import { createCircuitBreaker } from "~/infrastructure/external/cloudflare/circuit-breaker.service";
import { createKVCacheService } from "~/infrastructure/external/cloudflare/kv-cache.service";
import {
	createNullCacheService,
	createNullCircuitBreaker,
	createNullRateLimiter,
} from "~/infrastructure/external/cloudflare/null-services";
import { createKVRateLimiter } from "~/infrastructure/external/cloudflare/rate-limiter.service";
import { createCachedCompanyRepository } from "~/infrastructure/external/notion/cached-company.repository";
import { createCachedInvoiceRepository } from "~/infrastructure/external/notion/cached-invoice.repository";
import { createNotionCompanyRepository } from "~/infrastructure/external/notion/company.repository.impl";
import { createNotionInvoiceRepository } from "~/infrastructure/external/notion/invoice.repository.impl";
import { createNotionClient } from "~/infrastructure/external/notion/notion.client";

/**
 * KVNamespace 인터페이스 (Cloudflare Workers 런타임에서 제공)
 */
interface KVNamespaceLike {
	get(key: string, options?: { type: "json" }): Promise<unknown>;
	put(
		key: string,
		value: string,
		options?: { expirationTtl?: number },
	): Promise<void>;
	delete(key: string): Promise<void>;
}

/**
 * 필수 환경 변수 검증
 *
 * @param env - 애플리케이션 환경 변수
 * @throws Error 필수 환경 변수가 누락된 경우
 */
const validateEnv = (env: AppEnv): void => {
	const requiredVars = [
		"NOTION_API_KEY",
		"NOTION_INVOICE_DATABASE_ID",
		"NOTION_LINE_ITEM_DATABASE_ID",
		"NOTION_COMPANY_DATABASE_ID",
	] as const;

	const missing = requiredVars.filter(
		(key) => !env[key as keyof AppEnv] || env[key as keyof AppEnv] === "",
	);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}`,
		);
	}
};

/**
 * DI Container 생성 팩토리 함수
 *
 * @param env - 애플리케이션 환경 변수
 * @param kv - Cloudflare KVNamespace (선택적, 없으면 Null 구현체 사용)
 * @returns IContainer 인터페이스를 구현하는 컨테이너
 * @throws Error 필수 환경 변수가 누락된 경우
 */
export const createContainer = (
	env: AppEnv,
	kv?: KVNamespaceLike,
): IContainer => {
	// 환경 변수 검증 (빠른 실패)
	validateEnv(env);

	// Cache, Rate Limiter, Circuit Breaker 생성
	// KV가 없으면 Null 구현체 사용 (개발 환경)
	const cacheService = kv ? createKVCacheService(kv) : createNullCacheService();
	const rateLimiter = kv
		? createKVRateLimiter(kv, RATE_LIMIT_CONFIG.NOTION_API)
		: createNullRateLimiter();
	const circuitBreaker = kv
		? createCircuitBreaker(
				kv,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
			)
		: createNullCircuitBreaker();

	// Notion Client 생성
	const notionClient = createNotionClient({
		apiKey: env.NOTION_API_KEY,
	});

	// Base Repository 생성
	const baseInvoiceRepository = createNotionInvoiceRepository(notionClient, {
		invoiceDbId: env.NOTION_INVOICE_DATABASE_ID,
		lineItemDbId: env.NOTION_LINE_ITEM_DATABASE_ID,
	});

	const baseCompanyRepository = createNotionCompanyRepository(notionClient, {
		companyDbId: env.NOTION_COMPANY_DATABASE_ID,
	});

	// Cached Repository 생성 (캐싱, Rate Limiting, Circuit Breaker 적용)
	const invoiceRepository = createCachedInvoiceRepository({
		repository: baseInvoiceRepository,
		cache: cacheService,
		rateLimiter,
		circuitBreaker,
	});

	const companyRepository = createCachedCompanyRepository({
		repository: baseCompanyRepository,
		cache: cacheService,
		rateLimiter,
		circuitBreaker,
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
