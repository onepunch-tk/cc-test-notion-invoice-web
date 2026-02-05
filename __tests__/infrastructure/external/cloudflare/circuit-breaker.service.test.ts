import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
	CircuitBreaker,
	CircuitBreakerConfig,
} from "~/application/shared/circuit-breaker.port";
import { createCircuitBreaker } from "~/infrastructure/external/cloudflare/circuit-breaker.service";
import { CircuitOpenError } from "~/infrastructure/external/cloudflare/errors";
import {
	createMockKVNamespace,
	type MockKVNamespace,
} from "../../../fixtures/cloudflare/kv-namespace.fixture";

describe("createCircuitBreaker", () => {
	let mockKV: MockKVNamespace;
	let circuitBreaker: CircuitBreaker;
	let config: CircuitBreakerConfig;
	const circuitKey = "test:circuit";

	beforeEach(() => {
		mockKV = createMockKVNamespace();
		config = {
			failureThreshold: 3,
			recoveryTimeSeconds: 10,
			halfOpenRequests: 1,
		};
		circuitBreaker = createCircuitBreaker(mockKV, circuitKey, config, {
			getCurrentTime: () => mockKV._getCurrentTime(),
		});
	});

	describe("상태 전이: CLOSED → OPEN", () => {
		it("failureThreshold만큼 실패하면 OPEN 상태로 전환된다", async () => {
			// Arrange
			const operation = vi
				.fn()
				.mockRejectedValue(new Error("Operation failed"));

			// Act - failureThreshold만큼 실패 기록
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.state).toBe("OPEN");
			expect(state.failureCount).toBe(config.failureThreshold);
			expect(state.lastFailureTime).toBeGreaterThan(0);
			expect(state.nextRetryTime).toBeGreaterThan(Date.now());
		});
	});

	describe("상태 전이: OPEN → HALF_OPEN", () => {
		it("recoveryTimeSeconds 후 HALF_OPEN 상태로 전환된다", async () => {
			// Arrange - OPEN 상태로 만들기
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			// Act - 복구 시간만큼 시간 경과
			mockKV._advanceTime((config.recoveryTimeSeconds + 1) * 1000);

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.state).toBe("HALF_OPEN");
		});
	});

	describe("상태 전이: HALF_OPEN → CLOSED", () => {
		it("HALF_OPEN 상태에서 성공하면 CLOSED 상태로 전환된다", async () => {
			// Arrange - OPEN 상태로 만들기
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			// HALF_OPEN 상태로 전환
			mockKV._advanceTime((config.recoveryTimeSeconds + 1) * 1000);

			// Act - 성공 기록
			await circuitBreaker.recordSuccess();

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.state).toBe("CLOSED");
			expect(state.failureCount).toBe(0);
		});
	});

	describe("상태 전이: HALF_OPEN → OPEN", () => {
		it("HALF_OPEN 상태에서 실패하면 다시 OPEN 상태로 전환된다", async () => {
			// Arrange - OPEN 상태로 만들기
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			// HALF_OPEN 상태로 전환
			mockKV._advanceTime((config.recoveryTimeSeconds + 1) * 1000);

			// Act - 실패 기록
			await circuitBreaker.recordFailure();

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.state).toBe("OPEN");
		});
	});

	describe("execute - CLOSED 상태", () => {
		it("CLOSED 상태에서는 operation을 실행한다", async () => {
			// Arrange
			const operation = vi.fn().mockResolvedValue("success");

			// Act
			const result = await circuitBreaker.execute(operation);

			// Assert
			expect(result).toBe("success");
			expect(operation).toHaveBeenCalledOnce();
		});

		it("CLOSED 상태에서 operation 실패 시 에러를 전파한다", async () => {
			// Arrange
			const operationError = new Error("Operation failed");
			const operation = vi.fn().mockRejectedValue(operationError);

			// Act & Assert
			await expect(circuitBreaker.execute(operation)).rejects.toThrow(
				"Operation failed",
			);
			expect(operation).toHaveBeenCalledOnce();
		});
	});

	describe("execute - OPEN 상태", () => {
		it("OPEN 상태에서는 fallback을 실행한다", async () => {
			// Arrange - OPEN 상태로 만들기
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			const operation = vi.fn().mockResolvedValue("success");
			const fallback = vi.fn().mockResolvedValue("fallback");

			// Act
			const result = await circuitBreaker.execute(operation, fallback);

			// Assert
			expect(result).toBe("fallback");
			expect(operation).not.toHaveBeenCalled();
			expect(fallback).toHaveBeenCalledOnce();
		});

		it("OPEN 상태에서 fallback이 없으면 CircuitOpenError를 throw한다", async () => {
			// Arrange - OPEN 상태로 만들기
			for (let i = 0; i < config.failureThreshold; i++) {
				await circuitBreaker.recordFailure();
			}

			const operation = vi.fn().mockResolvedValue("success");

			// Act & Assert
			await expect(circuitBreaker.execute(operation)).rejects.toThrow(
				CircuitOpenError,
			);
			expect(operation).not.toHaveBeenCalled();
		});
	});

	describe("recordSuccess", () => {
		it("성공 기록 시 실패 카운터를 리셋한다", async () => {
			// Arrange
			await circuitBreaker.recordFailure();
			await circuitBreaker.recordFailure();

			// Act
			await circuitBreaker.recordSuccess();

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.failureCount).toBe(0);
			expect(state.state).toBe("CLOSED");
		});
	});

	describe("recordFailure", () => {
		it("실패 카운터를 증가시킨다", async () => {
			// Act
			await circuitBreaker.recordFailure();

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.failureCount).toBe(1);
		});

		it("연속 실패 시 카운터가 누적된다", async () => {
			// Act
			await circuitBreaker.recordFailure();
			await circuitBreaker.recordFailure();

			// Assert
			const state = await circuitBreaker.getState();
			expect(state.failureCount).toBe(2);
		});
	});
});
