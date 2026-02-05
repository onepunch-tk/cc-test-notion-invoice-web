/**
 * Rate Limiter Port Interface
 *
 * API 호출 제한을 위한 추상화 인터페이스
 * Infrastructure 레이어에서 구현됩니다 (예: Cloudflare KV 기반 Sliding Window)
 */

/**
 * Rate Limit 확인 결과
 */
export interface RateLimitResult {
	/**
	 * 요청 허용 여부
	 */
	allowed: boolean;

	/**
	 * 윈도우 내 남은 요청 수
	 */
	remaining: number;

	/**
	 * 윈도우 리셋 시간 (Unix timestamp, ms)
	 */
	resetAt: number;

	/**
	 * 재시도까지 대기 시간 (초 단위, allowed=false일 때만 존재)
	 */
	retryAfter?: number;
}

/**
 * Rate Limiter 인터페이스
 *
 * 요청 빈도 제한을 관리합니다.
 */
export interface RateLimiter {
	/**
	 * 현재 Rate Limit 상태 확인 (요청 기록 없이)
	 *
	 * @param key - Rate Limit 키 (예: IP 주소, API 엔드포인트)
	 * @returns Rate Limit 결과
	 */
	checkLimit(key: string): Promise<RateLimitResult>;

	/**
	 * 요청 기록 (Rate Limit 카운터 증가)
	 *
	 * @param key - Rate Limit 키
	 */
	recordRequest(key: string): Promise<void>;

	/**
	 * Rate Limit 확인 및 요청 기록 (허용 시에만 기록)
	 *
	 * @param key - Rate Limit 키
	 * @returns Rate Limit 결과
	 */
	checkAndRecord(key: string): Promise<RateLimitResult>;
}

/**
 * Rate Limiter 설정
 */
export interface RateLimiterConfig {
	/**
	 * 윈도우당 최대 요청 수
	 */
	maxRequests: number;

	/**
	 * 윈도우 크기 (초 단위)
	 */
	windowSeconds: number;
}
