/**
 * Cached Invoice Repository Wrapper
 *
 * InvoiceRepository에 캐싱, Rate Limiting, Circuit Breaker를 적용하는 래퍼
 */

import type { InvoiceRepository } from "~/application/invoice/invoice.port";
import type { CacheService } from "~/application/shared/cache.port";
import type { CircuitBreaker } from "~/application/shared/circuit-breaker.port";
import type { RateLimiter } from "~/application/shared/rate-limiter.port";
import type {
	Invoice,
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice";
import {
	CACHE_TTL,
	invoiceDetailKey,
	invoiceListKey,
} from "~/infrastructure/external/cloudflare/cache-keys";
import { createProtectedExecutor } from "~/infrastructure/external/cloudflare/protection-utils";

/**
 * Cached Invoice Repository 의존성
 */
interface CachedInvoiceRepositoryDeps {
	repository: InvoiceRepository;
	cache: CacheService;
	rateLimiter: RateLimiter;
	circuitBreaker: CircuitBreaker;
}

/**
 * Cached Invoice Repository 생성 팩토리 함수
 *
 * 기존 InvoiceRepository를 래핑하여 캐싱, Rate Limiting, Circuit Breaker를 적용합니다.
 *
 * @param deps - 의존성 객체
 * @returns InvoiceRepository 구현체 (캐시 적용)
 */
export const createCachedInvoiceRepository = (
	deps: CachedInvoiceRepositoryDeps,
): InvoiceRepository => {
	const { repository, cache, rateLimiter, circuitBreaker } = deps;

	// Create protected executor with rate limiting and circuit breaker
	const executeWithProtection = createProtectedExecutor({
		rateLimiter,
		circuitBreaker,
	});

	const findAll = async (): Promise<Invoice[]> => {
		const cacheKey = invoiceListKey();

		return cache
			.getOrSet(
				cacheKey,
				async () => {
					const invoices = await executeWithProtection(() =>
						repository.findAll(),
					);
					// Invoice[] to Record<string, unknown> 변환을 위해 래핑
					return { data: invoices } as { data: Invoice[] };
				},
				CACHE_TTL.INVOICE_LIST,
			)
			.then((result) => result.data);
	};

	const findById = async (
		invoiceId: string,
	): Promise<InvoiceWithLineItems | null> => {
		const cacheKey = invoiceDetailKey(invoiceId);

		const result = await cache.getOrSet(
			cacheKey,
			async () => {
				const invoice = await executeWithProtection(() =>
					repository.findById(invoiceId),
				);
				// null 처리를 위해 래핑
				return { data: invoice } as { data: InvoiceWithLineItems | null };
			},
			CACHE_TTL.INVOICE_DETAIL,
		);

		return result.data;
	};

	const findLineItems = async (
		invoiceId: string,
	): Promise<InvoiceLineItem[]> => {
		// LineItems는 findById에서 함께 조회되므로 별도 캐싱 없이 직접 호출
		return executeWithProtection(() => repository.findLineItems(invoiceId));
	};

	return {
		findAll,
		findById,
		findLineItems,
	};
};
