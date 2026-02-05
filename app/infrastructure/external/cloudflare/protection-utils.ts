/**
 * Protection Utilities
 *
 * Rate limiting과 Circuit Breaker를 적용하는 공유 유틸리티 함수
 */

import type { CircuitBreaker } from "~/application/shared/circuit-breaker.port";
import type { RateLimiter } from "~/application/shared/rate-limiter.port";
import { notionApiRateLimitKey } from "./cache-keys";
import { RateLimitExceededError } from "./errors";

/**
 * Protection services for rate limiting and circuit breaker
 */
export interface ProtectionServices {
	rateLimiter: RateLimiter;
	circuitBreaker: CircuitBreaker;
}

/**
 * Create a protected execution function with rate limiting and circuit breaker
 *
 * @param services - Protection services (rate limiter and circuit breaker)
 * @returns Function that executes operations with protection
 *
 * @example
 * ```typescript
 * const execute = createProtectedExecutor({ rateLimiter, circuitBreaker });
 * const result = await execute(() => fetchData());
 * ```
 */
export const createProtectedExecutor = (services: ProtectionServices) => {
	const { rateLimiter, circuitBreaker } = services;

	/**
	 * Check rate limit and throw if exceeded
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
	 * Execute operation with rate limiting and circuit breaker protection
	 *
	 * @param operation - The operation to execute
	 * @param fallback - Optional fallback function when circuit is open
	 * @returns The operation result
	 * @throws RateLimitExceededError when rate limit is exceeded
	 * @throws CircuitOpenError when circuit is open and no fallback provided
	 */
	return async <T>(
		operation: () => Promise<T>,
		fallback?: () => Promise<T>,
	): Promise<T> => {
		await checkRateLimit();
		return circuitBreaker.execute(operation, fallback);
	};
};
