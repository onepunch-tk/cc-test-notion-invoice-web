/**
 * KV Rate Limiter Service Implementation
 *
 * Cloudflare KV 기반 Sliding Window Rate Limiter 서비스
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
	// Mock에서 시간 제어를 위한 선택적 메서드
	_getCurrentTime?: () => number;
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
 * @returns RateLimiter 인스턴스
 */
export const createKVRateLimiter = (
	kv: KVNamespaceLike,
	config: RateLimiterConfig,
): RateLimiter => {
	/**
	 * 현재 시간 가져오기 (Mock에서 오버라이드 가능)
	 */
	const getCurrentTime = (): number => {
		if (kv._getCurrentTime) {
			return kv._getCurrentTime();
		}
		return Date.now();
	};

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
