/**
 * Cloudflare Infrastructure Error Classes
 *
 * Cloudflare 관련 인프라 에러 클래스들
 */

/**
 * Sanitize cache key for error messages
 * Removes sensitive IDs to prevent information disclosure
 *
 * @param key - Original cache key
 * @returns Sanitized key safe for logging/error messages
 */
const sanitizeCacheKey = (key: string): string => {
	// Replace invoice IDs with placeholder
	let sanitized = key.replace(
		/invoices:detail:([^:]+)/,
		"invoices:detail:[ID]",
	);
	// Replace IP addresses with placeholder
	sanitized = sanitized.replace(
		/ratelimit:ip:[\d.:a-fA-F]+/,
		"ratelimit:ip:[REDACTED]",
	);
	return sanitized;
};

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
		// Use sanitized key in error message to prevent information disclosure
		const sanitizedKey = sanitizeCacheKey(key);
		const errorMessage =
			message ?? `Cache ${operation} failed for key: ${sanitizedKey}.`;
		super(errorMessage);
		this.name = "CacheError";
		this.operation = operation;
		this.key = key; // Keep original for internal debugging
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
		// Use sanitized key in error message to prevent IP address disclosure
		const sanitizedKey = sanitizeCacheKey(key);
		super(
			`Rate limit exceeded for resource: ${sanitizedKey}. Retry after ${retryAfter}s.`,
		);
		this.name = "RateLimitExceededError";
		this.key = key; // Keep original for internal use
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
			`Circuit breaker is OPEN for: ${circuitKey}. Retry in ${retryIn}s after ${failureCount} failures.`,
		);
		this.name = "CircuitOpenError";
		this.circuitKey = circuitKey;
		this.nextRetryTime = nextRetryTime;
		this.failureCount = failureCount;

		Object.setPrototypeOf(this, CircuitOpenError.prototype);
	}
}
