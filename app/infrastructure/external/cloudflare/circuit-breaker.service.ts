/**
 * Circuit Breaker Service Implementation
 *
 * Cloudflare KV 기반 Circuit Breaker 서비스
 */

import type {
	CircuitBreaker,
	CircuitBreakerConfig,
	CircuitBreakerStatus,
	CircuitState,
} from "~/application/shared/circuit-breaker.port";
import { CircuitOpenError } from "./errors";

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
 * Circuit Breaker 상태 저장 구조
 */
interface CircuitBreakerState {
	failureCount: number;
	lastFailureTime: number | null;
	state: CircuitState;
}

/**
 * Circuit Breaker 생성 팩토리 함수
 *
 * @param kv - Cloudflare KVNamespace
 * @param key - Circuit Breaker 상태 저장 키
 * @param config - Circuit Breaker 설정
 * @returns CircuitBreaker 인스턴스
 */
export const createCircuitBreaker = (
	kv: KVNamespaceLike,
	key: string,
	config: CircuitBreakerConfig,
): CircuitBreaker => {
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
	 * 저장된 상태 조회
	 */
	const loadState = async (): Promise<CircuitBreakerState> => {
		const state = (await kv.get(key, {
			type: "json",
		})) as CircuitBreakerState | null;
		return (
			state ?? {
				failureCount: 0,
				lastFailureTime: null,
				state: "CLOSED",
			}
		);
	};

	/**
	 * 상태 저장 (TTL: 복구 시간의 2배)
	 */
	const saveState = async (state: CircuitBreakerState): Promise<void> => {
		await kv.put(key, JSON.stringify(state), {
			expirationTtl: config.recoveryTimeSeconds * 2,
		});
	};

	/**
	 * 현재 상태 계산 (시간 기반 자동 전이 포함)
	 */
	const computeCurrentState = (stored: CircuitBreakerState): CircuitState => {
		if (stored.state !== "OPEN") {
			return stored.state;
		}

		// OPEN 상태에서 복구 시간 경과 시 HALF_OPEN으로 전이
		if (stored.lastFailureTime !== null) {
			const now = getCurrentTime();
			const recoveryTime =
				stored.lastFailureTime + config.recoveryTimeSeconds * 1000;
			if (now >= recoveryTime) {
				return "HALF_OPEN";
			}
		}

		return "OPEN";
	};

	const getState = async (): Promise<CircuitBreakerStatus> => {
		const stored = await loadState();
		const currentState = computeCurrentState(stored);

		let nextRetryTime: number | null = null;
		if (stored.state === "OPEN" && stored.lastFailureTime !== null) {
			nextRetryTime =
				stored.lastFailureTime + config.recoveryTimeSeconds * 1000;
		}

		return {
			state: currentState,
			failureCount: stored.failureCount,
			lastFailureTime: stored.lastFailureTime,
			nextRetryTime,
		};
	};

	const recordSuccess = async (): Promise<void> => {
		await saveState({
			failureCount: 0,
			lastFailureTime: null,
			state: "CLOSED",
		});
	};

	const recordFailure = async (): Promise<void> => {
		const stored = await loadState();
		const currentState = computeCurrentState(stored);
		const now = getCurrentTime();

		// HALF_OPEN 상태에서 실패하면 즉시 OPEN으로 전환
		const newFailureCount =
			currentState === "HALF_OPEN"
				? config.failureThreshold
				: stored.failureCount + 1;
		const newState: CircuitState =
			newFailureCount >= config.failureThreshold ? "OPEN" : stored.state;

		await saveState({
			failureCount: newFailureCount,
			lastFailureTime: now,
			state: newState,
		});
	};

	const execute = async <T>(
		operation: () => Promise<T>,
		fallback?: () => Promise<T>,
	): Promise<T> => {
		const stored = await loadState();
		const currentState = computeCurrentState(stored);

		if (currentState === "OPEN") {
			if (fallback) {
				return fallback();
			}

			const nextRetryTime =
				stored.lastFailureTime !== null
					? stored.lastFailureTime + config.recoveryTimeSeconds * 1000
					: getCurrentTime() + config.recoveryTimeSeconds * 1000;

			throw new CircuitOpenError(key, nextRetryTime, stored.failureCount);
		}

		try {
			const result = await operation();
			// HALF_OPEN에서 성공 시 CLOSED로 전이
			if (currentState === "HALF_OPEN") {
				await recordSuccess();
			}
			return result;
		} catch (error) {
			await recordFailure();
			throw error;
		}
	};

	return {
		getState,
		execute,
		recordSuccess,
		recordFailure,
	};
};
