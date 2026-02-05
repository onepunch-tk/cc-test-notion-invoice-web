/**
 * Cache Service Port Interface
 *
 * 캐시 서비스에 대한 추상화 인터페이스
 * Infrastructure 레이어에서 구현됩니다 (예: Cloudflare KV)
 */

/**
 * 캐시 서비스 인터페이스
 *
 * 키-값 기반 캐시 작업을 정의합니다.
 */
export interface CacheService {
	/**
	 * 캐시에서 값 조회
	 *
	 * @param key - 캐시 키
	 * @returns 캐시된 값 또는 null (캐시 미스 또는 에러 시)
	 */
	get<T extends Record<string, unknown>>(key: string): Promise<T | null>;

	/**
	 * 캐시에 값 저장
	 *
	 * @param key - 캐시 키
	 * @param value - 저장할 값
	 * @param ttlSeconds - TTL (초 단위, 선택적)
	 */
	set<T extends Record<string, unknown>>(
		key: string,
		value: T,
		ttlSeconds?: number,
	): Promise<void>;

	/**
	 * 캐시에서 값 삭제
	 *
	 * @param key - 삭제할 캐시 키
	 */
	delete(key: string): Promise<void>;

	/**
	 * 캐시에서 조회하고, 없으면 fetcher로 값을 가져와 캐시에 저장
	 *
	 * @param key - 캐시 키
	 * @param fetcher - 캐시 미스 시 호출할 함수
	 * @param ttlSeconds - TTL (초 단위, 선택적)
	 * @returns 캐시된 값 또는 fetcher가 반환한 값
	 */
	getOrSet<T extends Record<string, unknown>>(
		key: string,
		fetcher: () => Promise<T>,
		ttlSeconds?: number,
	): Promise<T>;
}
