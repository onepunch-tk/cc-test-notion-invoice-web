import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CacheService } from "~/application/shared/cache.port";
import { createKVCacheService } from "~/infrastructure/external/cloudflare/kv-cache.service";
import {
	type MockKVNamespace,
	createMockKVNamespace,
} from "../../../fixtures/cloudflare/kv-namespace.fixture";

describe("createKVCacheService", () => {
	let mockKV: MockKVNamespace;
	let cacheService: CacheService;

	beforeEach(() => {
		mockKV = createMockKVNamespace();
		cacheService = createKVCacheService(mockKV);
	});

	describe("get", () => {
		it("캐시된 값을 성공적으로 반환한다", async () => {
			// Arrange
			const key = "test:key";
			const value = { data: "test-value" };
			await mockKV.put(key, JSON.stringify(value));

			// Act
			const result = await cacheService.get<typeof value>(key);

			// Assert
			expect(result).toEqual(value);
		});

		it("캐시 미스 시 null을 반환한다", async () => {
			// Arrange
			const key = "non-existent:key";

			// Act
			const result = await cacheService.get(key);

			// Assert
			expect(result).toBeNull();
		});

		it("KV 에러 발생 시 null을 반환한다 (graceful degradation)", async () => {
			// Arrange
			const key = "test:key";
			vi.spyOn(mockKV, "get").mockRejectedValueOnce(
				new Error("KV unavailable"),
			);

			// Act
			const result = await cacheService.get(key);

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("set", () => {
		it("값을 TTL과 함께 캐시에 저장한다", async () => {
			// Arrange
			const key = "test:key";
			const value = { data: "test-value" };
			const ttlSeconds = 300;

			// Act
			await cacheService.set(key, value, ttlSeconds);

			// Assert
			const stored = await mockKV.get(key, { type: "json" });
			expect(stored).toEqual(value);
		});

		it("TTL 없이 값을 저장한다", async () => {
			// Arrange
			const key = "test:key";
			const value = { data: "test-value" };

			// Act
			await cacheService.set(key, value);

			// Assert
			const stored = await mockKV.get(key, { type: "json" });
			expect(stored).toEqual(value);
		});

		it("KV 에러 발생 시 graceful하게 처리한다", async () => {
			// Arrange
			const key = "test:key";
			const value = { data: "test-value" };
			vi.spyOn(mockKV, "put").mockRejectedValueOnce(
				new Error("KV unavailable"),
			);

			// Act & Assert
			await expect(cacheService.set(key, value)).resolves.not.toThrow();
		});
	});

	describe("delete", () => {
		it("캐시된 값을 삭제한다", async () => {
			// Arrange
			const key = "test:key";
			const value = { data: "test-value" };
			await mockKV.put(key, JSON.stringify(value));

			// Act
			await cacheService.delete(key);

			// Assert
			const result = await mockKV.get(key);
			expect(result).toBeNull();
		});

		it("존재하지 않는 키 삭제 시에도 에러를 발생시키지 않는다", async () => {
			// Arrange
			const key = "non-existent:key";

			// Act & Assert
			await expect(cacheService.delete(key)).resolves.not.toThrow();
		});
	});

	describe("getOrSet", () => {
		it("캐시 히트 시 캐시된 값을 반환한다", async () => {
			// Arrange
			const key = "test:key";
			const cachedValue = { data: "cached-value" };
			await mockKV.put(key, JSON.stringify(cachedValue));

			const fetcherMock = vi.fn().mockResolvedValue({ data: "fetched-value" });

			// Act
			const result = await cacheService.getOrSet(key, fetcherMock);

			// Assert
			expect(result).toEqual(cachedValue);
			expect(fetcherMock).not.toHaveBeenCalled();
		});

		it("캐시 미스 시 fetcher를 호출하고 결과를 캐시에 저장한다", async () => {
			// Arrange
			const key = "test:key";
			const fetchedValue = { data: "fetched-value" };
			const fetcherMock = vi.fn().mockResolvedValue(fetchedValue);
			const ttlSeconds = 300;

			// Act
			const result = await cacheService.getOrSet(key, fetcherMock, ttlSeconds);

			// Assert
			expect(result).toEqual(fetchedValue);
			expect(fetcherMock).toHaveBeenCalledOnce();

			// 캐시에 저장되었는지 확인
			const stored = await mockKV.get(key, { type: "json" });
			expect(stored).toEqual(fetchedValue);
		});

		it("fetcher 실패 시 에러를 전파한다", async () => {
			// Arrange
			const key = "test:key";
			const fetcherError = new Error("Fetcher failed");
			const fetcherMock = vi.fn().mockRejectedValue(fetcherError);

			// Act & Assert
			await expect(cacheService.getOrSet(key, fetcherMock)).rejects.toThrow(
				"Fetcher failed",
			);
		});
	});
});
