/**
 * KV Rate Limiter Service Implementation
 *
 * Cloudflare KV 기반 Sliding Window Rate Limiter 서비스
 *
 * @remarks
 * **Known Limitation - Race Condition**:
 * This implementation uses non-atomic read-modify-write operations.
 * Under high concurrency, multiple requests may pass the rate limit check
 * before the count is updated (e.g., 4-5 requests may pass instead of 3).
 *
 * **Mitigation**:
 * - Set conservative rate limits (e.g., 2 req/sec instead of 3)
 * - The impact is limited to brief bursts, not sustained violations
 *
 * **Future Improvement**:
 * Consider Cloudflare Durable Objects for atomic counters if strict
 * rate limiting is required.
 */

import type {
	RateLimiter,
	RateLimiterConfig,
	RateLimitResult,
} from "~/application/shared/rate-limiter.port";

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
}

/**
 * Rate Limiter 옵션
 */
interface KVRateLimiterOptions {
	/**
	 * 현재 시간을 반환하는 함수 (테스트용 DI)
	 * 기본값: Date.now
	 */
	getCurrentTime?: () => number;
}

/**
 * Rate Limit 상태 저장 구조
 */
interface RateLimitState {
	count: number;
	windowStart: number;
}

/**
 * KV Rate Limiter 생성 팩토리 함수
 *
 * @param kv - Cloudflare KVNamespace
 * @param config - Rate Limiter 설정
 * @param options - 추가 옵션 (테스트용 시간 함수 등)
 * @returns RateLimiter 인스턴스
 */
export const createKVRateLimiter = (
	kv: KVNamespaceLike,
	config: RateLimiterConfig,
	options?: KVRateLimiterOptions,
): RateLimiter => {
	/**
	 * 현재 시간 가져오기 (옵션으로 주입된 함수 또는 Date.now)
	 */
	const getCurrentTime = options?.getCurrentTime ?? (() => Date.now());

	/**
	 * 현재 Rate Limit 상태 조회
	 */
	const getState = async (key: string): Promise<RateLimitState> => {
		const state = (await kv.get(key, {
			type: "json",
		})) as RateLimitState | null;
		const now = getCurrentTime();
		const windowStart =
			Math.floor(now / 1000 / config.windowSeconds) *
			config.windowSeconds *
			1000;

		if (!state || state.windowStart !== windowStart) {
			return { count: 0, windowStart };
		}

		return state;
	};

	/**
	 * Rate Limit 상태 저장
	 */
	const setState = async (
		key: string,
		state: RateLimitState,
	): Promise<void> => {
		await kv.put(key, JSON.stringify(state), {
			expirationTtl: config.windowSeconds + 1,
		});
	};

	const checkLimit = async (key: string): Promise<RateLimitResult> => {
		const state = await getState(key);
		const now = getCurrentTime();
		const resetAt = state.windowStart + config.windowSeconds * 1000;
		const remaining = Math.max(0, config.maxRequests - state.count);
		const allowed = state.count < config.maxRequests;

		const result: RateLimitResult = {
			allowed,
			remaining,
			resetAt,
		};

		if (!allowed) {
			result.retryAfter = Math.ceil((resetAt - now) / 1000);
		}

		return result;
	};

	const recordRequest = async (key: string): Promise<void> => {
		const state = await getState(key);
		state.count += 1;
		await setState(key, state);
	};

	const checkAndRecord = async (key: string): Promise<RateLimitResult> => {
		const state = await getState(key);
		const now = getCurrentTime();
		const resetAt = state.windowStart + config.windowSeconds * 1000;
		const allowed = state.count < config.maxRequests;

		if (allowed) {
			state.count += 1;
			await setState(key, state);
		}

		const remaining = Math.max(0, config.maxRequests - state.count);

		const result: RateLimitResult = {
			allowed,
			remaining,
			resetAt,
		};

		if (!allowed) {
			result.retryAfter = Math.ceil((resetAt - now) / 1000);
		}

		return result;
	};

	return {
		checkLimit,
		recordRequest,
		checkAndRecord,
	};
};
