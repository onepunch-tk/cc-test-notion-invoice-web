import { beforeEach, describe, expect, it } from "vitest";
import type {
	RateLimiter,
	RateLimiterConfig,
} from "~/application/shared/rate-limiter.port";
import { createKVRateLimiter } from "~/infrastructure/external/cloudflare/rate-limiter.service";
import {
	createMockKVNamespace,
	type MockKVNamespace,
} from "../../../fixtures/cloudflare/kv-namespace.fixture";

describe("createKVRateLimiter", () => {
	let mockKV: MockKVNamespace;
	let rateLimiter: RateLimiter;
	let config: RateLimiterConfig;

	beforeEach(() => {
		mockKV = createMockKVNamespace();
		config = {
			maxRequests: 5,
			windowSeconds: 60,
		};
		rateLimiter = createKVRateLimiter(mockKV, config, {
			getCurrentTime: () => mockKV._getCurrentTime(),
		});
	});

	describe("checkLimit", () => {
		it("제한 이내일 때 allowed=true를 반환한다", async () => {
			// Arrange
			const key = "test:rate:limit";

			// Act
			const result = await rateLimiter.checkLimit(key);

			// Assert
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(config.maxRequests);
			expect(result.resetAt).toBeGreaterThan(Date.now());
		});

		it("제한 초과 시 allowed=false를 반환한다", async () => {
			// Arrange
			const key = "test:rate:limit";
			// 최대 요청 수만큼 요청 기록
			for (let i = 0; i < config.maxRequests; i++) {
				await rateLimiter.recordRequest(key);
			}

			// Act
			const result = await rateLimiter.checkLimit(key);

			// Assert
			expect(result.allowed).toBe(false);
			expect(result.remaining).toBe(0);
			expect(result.retryAfter).toBeDefined();
			expect(result.retryAfter).toBeGreaterThan(0);
		});
	});

	describe("recordRequest", () => {
		it("요청 카운터를 증가시킨다", async () => {
			// Arrange
			const key = "test:rate:limit";

			// Act
			await rateLimiter.recordRequest(key);

			// Assert
			const result = await rateLimiter.checkLimit(key);
			expect(result.remaining).toBe(config.maxRequests - 1);
		});

		it("여러 요청을 기록할 수 있다", async () => {
			// Arrange
			const key = "test:rate:limit";

			// Act
			await rateLimiter.recordRequest(key);
			await rateLimiter.recordRequest(key);
			await rateLimiter.recordRequest(key);

			// Assert
			const result = await rateLimiter.checkLimit(key);
			expect(result.remaining).toBe(config.maxRequests - 3);
		});
	});

	describe("checkAndRecord", () => {
		it("허용될 때 확인하고 기록한다", async () => {
			// Arrange
			const key = "test:rate:limit";

			// Act
			const result = await rateLimiter.checkAndRecord(key);

			// Assert
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(config.maxRequests - 1);

			// 실제로 기록되었는지 확인
			const checkResult = await rateLimiter.checkLimit(key);
			expect(checkResult.remaining).toBe(config.maxRequests - 1);
		});

		it("허용되지 않을 때는 기록하지 않는다", async () => {
			// Arrange
			const key = "test:rate:limit";
			// 최대 요청 수만큼 요청 기록
			for (let i = 0; i < config.maxRequests; i++) {
				await rateLimiter.recordRequest(key);
			}

			// Act
			const result = await rateLimiter.checkAndRecord(key);

			// Assert
			expect(result.allowed).toBe(false);
			expect(result.remaining).toBe(0);

			// 추가 기록되지 않았는지 확인
			const checkResult = await rateLimiter.checkLimit(key);
			expect(checkResult.remaining).toBe(0);
		});
	});

	describe("윈도우 리셋", () => {
		it("윈도우 만료 후 카운터가 리셋된다", async () => {
			// Arrange
			const key = "test:rate:limit";
			await rateLimiter.recordRequest(key);
			await rateLimiter.recordRequest(key);

			// Act - 윈도우 시간만큼 시간 경과
			mockKV._advanceTime((config.windowSeconds + 1) * 1000);

			// Assert
			const result = await rateLimiter.checkLimit(key);
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(config.maxRequests);
		});
	});

	describe("remaining 계산", () => {
		it("남은 요청 수를 정확하게 계산한다", async () => {
			// Arrange
			const key = "test:rate:limit";

			// Act & Assert
			let result = await rateLimiter.checkLimit(key);
			expect(result.remaining).toBe(config.maxRequests);

			await rateLimiter.recordRequest(key);
			result = await rateLimiter.checkLimit(key);
			expect(result.remaining).toBe(config.maxRequests - 1);

			await rateLimiter.recordRequest(key);
			result = await rateLimiter.checkLimit(key);
			expect(result.remaining).toBe(config.maxRequests - 2);
		});
	});
});
