/**
 * Cached Company Repository Wrapper
 *
 * CompanyRepository에 캐싱, Rate Limiting, Circuit Breaker를 적용하는 래퍼
 */

import type { CompanyRepository } from "~/application/invoice/invoice.port";
import type { CacheService } from "~/application/shared/cache.port";
import type { CircuitBreaker } from "~/application/shared/circuit-breaker.port";
import type { RateLimiter } from "~/application/shared/rate-limiter.port";
import type { CompanyInfo } from "~/domain/company";
import {
	CACHE_TTL,
	companyInfoKey,
	notionApiRateLimitKey,
} from "~/infrastructure/external/cloudflare/cache-keys";
import { RateLimitExceededError } from "~/infrastructure/external/cloudflare/errors";

/**
 * Cached Company Repository 의존성
 */
interface CachedCompanyRepositoryDeps {
	repository: CompanyRepository;
	cache: CacheService;
	rateLimiter: RateLimiter;
	circuitBreaker: CircuitBreaker;
}

/**
 * Cached Company Repository 생성 팩토리 함수
 *
 * 기존 CompanyRepository를 래핑하여 캐싱, Rate Limiting, Circuit Breaker를 적용합니다.
 *
 * @param deps - 의존성 객체
 * @returns CompanyRepository 구현체 (캐시 적용)
 */
export const createCachedCompanyRepository = (
	deps: CachedCompanyRepositoryDeps,
): CompanyRepository => {
	const { repository, cache, rateLimiter, circuitBreaker } = deps;

	/**
	 * Rate Limit 확인 및 요청
	 */
	const checkRateLimit = async (): Promise<void> => {
		const key = notionApiRateLimitKey();
		const result = await rateLimiter.checkAndRecord(key);

		if (!result.allowed) {
			throw new RateLimitExceededError(
				key,
				result.retryAfter ?? 1,
				result.resetAt,
			);
		}
	};

	/**
	 * Circuit Breaker를 통해 작업 실행
	 */
	const executeWithProtection = async <T>(
		operation: () => Promise<T>,
		fallback?: () => Promise<T>,
	): Promise<T> => {
		await checkRateLimit();
		return circuitBreaker.execute(operation, fallback);
	};

	const getCompanyInfo = async (): Promise<CompanyInfo> => {
		const cacheKey = companyInfoKey();

		return cache
			.getOrSet(
				cacheKey,
				async () => {
					const companyInfo = await executeWithProtection(() =>
						repository.getCompanyInfo(),
					);
					// CompanyInfo를 Record<string, unknown>으로 변환
					return { data: companyInfo } as { data: CompanyInfo };
				},
				CACHE_TTL.COMPANY_INFO,
			)
			.then((result) => result.data);
	};

	return {
		getCompanyInfo,
	};
};
