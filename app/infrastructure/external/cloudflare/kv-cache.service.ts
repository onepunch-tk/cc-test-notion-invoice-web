/**
 * KV Cache Service Implementation
 *
 * Cloudflare KV 기반 캐시 서비스
 */

import type { CacheService } from "~/application/shared/cache.port";

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
 * KV Cache Service 생성 팩토리 함수
 *
 * @param kv - Cloudflare KVNamespace
 * @returns CacheService 인스턴스
 */
export const createKVCacheService = (kv: KVNamespaceLike): CacheService => {
	const get = async <T extends Record<string, unknown>>(
		key: string,
	): Promise<T | null> => {
		try {
			const value = await kv.get(key, { type: "json" });
			return value as T | null;
		} catch {
			// Graceful degradation: 에러 시 null 반환
			return null;
		}
	};

	const set = async <T extends Record<string, unknown>>(
		key: string,
		value: T,
		ttlSeconds?: number,
	): Promise<void> => {
		try {
			const options = ttlSeconds ? { expirationTtl: ttlSeconds } : undefined;
			await kv.put(key, JSON.stringify(value), options);
		} catch {
			// Graceful degradation: 에러 무시
		}
	};

	const deleteKey = async (key: string): Promise<void> => {
		try {
			await kv.delete(key);
		} catch {
			// Graceful degradation: 에러 무시
		}
	};

	const getOrSet = async <T extends Record<string, unknown>>(
		key: string,
		fetcher: () => Promise<T>,
		ttlSeconds?: number,
	): Promise<T> => {
		const cached = await get<T>(key);
		if (cached !== null) {
			return cached;
		}

		const value = await fetcher();
		await set(key, value, ttlSeconds);
		return value;
	};

	return {
		get,
		set,
		delete: deleteKey,
		getOrSet,
	};
};
