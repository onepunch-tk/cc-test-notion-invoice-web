/**
 * Null Services Implementation
 *
 * KV 없이 작동하는 개발/테스트용 null 구현체
 * 모든 작업이 pass-through되거나 항상 허용됩니다.
 */

import type { CacheService } from "~/application/shared/cache.port";
import type {
	CircuitBreaker,
	CircuitBreakerStatus,
} from "~/application/shared/circuit-breaker.port";
import type {
	RateLimiter,
	RateLimitResult,
} from "~/application/shared/rate-limiter.port";

/** Default rate limit window for null implementation (1 minute) */
const NULL_RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Null Cache Service 생성
 *
 * 캐싱 없이 pass-through로 동작합니다.
 * 모든 get은 null을 반환하고, set/delete는 무시됩니다.
 *
 * @returns CacheService 인스턴스
 */
export const createNullCacheService = (): CacheService => {
	const get = async <T extends Record<string, unknown>>(
		_key: string,
	): Promise<T | null> => {
		return null;
	};

	const set = async <T extends Record<string, unknown>>(
		_key: string,
		_value: T,
		_ttlSeconds?: number,
	): Promise<void> => {
		// No-op
	};

	const deleteKey = async (_key: string): Promise<void> => {
		// No-op
	};

	const getOrSet = async <T extends Record<string, unknown>>(
		_key: string,
		fetcher: () => Promise<T>,
		_ttlSeconds?: number,
	): Promise<T> => {
		// 항상 fetcher 호출 (캐싱 없음)
		return fetcher();
	};

	return {
		get,
		set,
		delete: deleteKey,
		getOrSet,
	};
};

/**
 * Null Rate Limiter 생성
 *
 * 모든 요청을 허용합니다.
 *
 * @returns RateLimiter 인스턴스
 */
export const createNullRateLimiter = (): RateLimiter => {
	const checkLimit = async (_key: string): Promise<RateLimitResult> => {
		return {
			allowed: true,
			remaining: Number.MAX_SAFE_INTEGER,
			resetAt: Date.now() + NULL_RATE_LIMIT_WINDOW_MS,
		};
	};

	const recordRequest = async (_key: string): Promise<void> => {
		// No-op
	};

	const checkAndRecord = async (_key: string): Promise<RateLimitResult> => {
		return {
			allowed: true,
			remaining: Number.MAX_SAFE_INTEGER,
			resetAt: Date.now() + NULL_RATE_LIMIT_WINDOW_MS,
		};
	};

	return {
		checkLimit,
		recordRequest,
		checkAndRecord,
	};
};

/**
 * Null Circuit Breaker 생성
 *
 * 항상 CLOSED 상태로 모든 작업을 허용합니다.
 *
 * @returns CircuitBreaker 인스턴스
 */
export const createNullCircuitBreaker = (): CircuitBreaker => {
	const getState = async (): Promise<CircuitBreakerStatus> => {
		return {
			state: "CLOSED",
			failureCount: 0,
			lastFailureTime: null,
			nextRetryTime: null,
		};
	};

	const execute = async <T>(
		operation: () => Promise<T>,
		_fallback?: () => Promise<T>,
	): Promise<T> => {
		// 항상 operation 실행 (circuit breaker 없음)
		return operation();
	};

	const recordSuccess = async (): Promise<void> => {
		// No-op
	};

	const recordFailure = async (): Promise<void> => {
		// No-op
	};

	return {
		getState,
		execute,
		recordSuccess,
		recordFailure,
	};
};
