/**
 * Cloudflare Infrastructure Error Classes
 *
 * Cloudflare 관련 인프라 에러 클래스들
 */

/**
 * 캐시 작업 실패 에러
 */
export class CacheError extends Error {
	readonly operation: "get" | "set" | "delete";
	readonly key: string;
	readonly cause?: unknown;

	constructor(
		operation: "get" | "set" | "delete",
		key: string,
		message?: string,
		cause?: unknown,
	) {
		const errorMessage = message ?? `Cache ${operation} failed for key: ${key}`;
		super(errorMessage);
		this.name = "CacheError";
		this.operation = operation;
		this.key = key;
		this.cause = cause;

		// Error 상속 시 prototype chain 유지
		Object.setPrototypeOf(this, CacheError.prototype);
	}
}

/**
 * Rate Limit 초과 에러
 */
export class RateLimitExceededError extends Error {
	readonly key: string;
	readonly retryAfter: number;
	readonly resetAt: number;

	constructor(key: string, retryAfter: number, resetAt: number) {
		super(`Rate limit exceeded for key: ${key}. Retry after ${retryAfter}s`);
		this.name = "RateLimitExceededError";
		this.key = key;
		this.retryAfter = retryAfter;
		this.resetAt = resetAt;

		Object.setPrototypeOf(this, RateLimitExceededError.prototype);
	}
}

/**
 * Circuit Breaker Open 상태 에러
 */
export class CircuitOpenError extends Error {
	readonly circuitKey: string;
	readonly nextRetryTime: number;
	readonly failureCount: number;

	constructor(circuitKey: string, nextRetryTime: number, failureCount: number) {
		const retryIn = Math.max(0, Math.ceil((nextRetryTime - Date.now()) / 1000));
		super(
			`Circuit breaker is OPEN for: ${circuitKey}. Retry in ${retryIn}s after ${failureCount} failures`,
		);
		this.name = "CircuitOpenError";
		this.circuitKey = circuitKey;
		this.nextRetryTime = nextRetryTime;
		this.failureCount = failureCount;

		Object.setPrototypeOf(this, CircuitOpenError.prototype);
	}
}
