/**
 * Circuit Breaker Port Interface
 *
 * 외부 서비스 장애 격리를 위한 추상화 인터페이스
 * Infrastructure 레이어에서 구현됩니다 (예: Cloudflare KV 기반)
 */

/**
 * Circuit Breaker 상태
 *
 * - CLOSED: 정상 상태, 모든 요청 허용
 * - OPEN: 장애 상태, 모든 요청 차단 (fallback 실행)
 * - HALF_OPEN: 복구 확인 상태, 제한된 요청 허용
 */
export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

/**
 * Circuit Breaker 상태 정보
 */
export interface CircuitBreakerStatus {
	/**
	 * 현재 상태
	 */
	state: CircuitState;

	/**
	 * 연속 실패 횟수
	 */
	failureCount: number;

	/**
	 * 마지막 실패 시간 (Unix timestamp, ms)
	 */
	lastFailureTime: number | null;

	/**
	 * OPEN 상태에서 HALF_OPEN으로 전환되는 시간 (Unix timestamp, ms)
	 */
	nextRetryTime: number | null;
}

/**
 * Circuit Breaker 인터페이스
 *
 * 외부 서비스 호출을 보호하고 장애를 격리합니다.
 */
export interface CircuitBreaker {
	/**
	 * 현재 Circuit Breaker 상태 조회
	 *
	 * @returns 현재 상태 정보
	 */
	getState(): Promise<CircuitBreakerStatus>;

	/**
	 * Circuit Breaker를 통해 작업 실행
	 *
	 * - CLOSED: 작업 실행
	 * - OPEN: fallback 실행 (없으면 에러 throw)
	 * - HALF_OPEN: 작업 실행 후 결과에 따라 상태 전이
	 *
	 * @param operation - 실행할 작업
	 * @param fallback - 실패 시 대체 작업 (선택적)
	 * @returns 작업 결과
	 */
	execute<T>(
		operation: () => Promise<T>,
		fallback?: () => Promise<T>,
	): Promise<T>;

	/**
	 * 성공 기록 (실패 카운터 리셋)
	 */
	recordSuccess(): Promise<void>;

	/**
	 * 실패 기록 (실패 카운터 증가, 임계치 도달 시 OPEN 상태로 전이)
	 */
	recordFailure(): Promise<void>;
}

/**
 * Circuit Breaker 설정
 */
export interface CircuitBreakerConfig {
	/**
	 * OPEN 상태로 전환되는 연속 실패 횟수 임계치
	 */
	failureThreshold: number;

	/**
	 * OPEN에서 HALF_OPEN으로 전환되기까지 대기 시간 (초 단위)
	 */
	recoveryTimeSeconds: number;

	/**
	 * HALF_OPEN 상태에서 허용할 테스트 요청 수
	 */
	halfOpenRequests?: number;
}
