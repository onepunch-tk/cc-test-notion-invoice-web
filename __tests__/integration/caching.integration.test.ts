/**
 * Caching Layer Integration Tests
 *
 * 캐싱 레이어 전체 통합 테스트
 * MockKV를 사용하여 실제 구현체를 통합 테스트합니다.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import type {
	CompanyRepository,
	InvoiceRepository,
} from "~/application/invoice/invoice.port";
import type {
	Invoice,
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice";
import type { CompanyInfo } from "~/domain/company";
import {
	CACHE_TTL,
	RATE_LIMIT_CONFIG,
	CIRCUIT_BREAKER_CONFIG,
	circuitBreakerKey,
} from "~/infrastructure/external/cloudflare/cache-keys";
import { createKVCacheService } from "~/infrastructure/external/cloudflare/kv-cache.service";
import { createKVRateLimiter } from "~/infrastructure/external/cloudflare/rate-limiter.service";
import { createCircuitBreaker } from "~/infrastructure/external/cloudflare/circuit-breaker.service";
import { createCachedInvoiceRepository } from "~/infrastructure/external/notion/cached-invoice.repository";
import { createCachedCompanyRepository } from "~/infrastructure/external/notion/cached-company.repository";
import {
	RateLimitExceededError,
	CircuitOpenError,
} from "~/infrastructure/external/cloudflare/errors";
import {
	createMockKVNamespace,
	type MockKVNamespace,
} from "../fixtures/cloudflare/kv-namespace.fixture";
import {
	createValidInvoiceData,
	createValidInvoiceWithLineItemsData,
} from "../fixtures/invoice/invoice.fixture";
import { createValidCompanyInfoData } from "../fixtures/company/company.fixture";

describe("Caching Layer Integration Tests", () => {
	let mockKV: MockKVNamespace;
	let baseInvoiceRepo: InvoiceRepository;
	let baseCompanyRepo: CompanyRepository;
	let mockInvoices: Invoice[];
	let mockInvoiceDetail: InvoiceWithLineItems;
	let mockCompanyInfo: CompanyInfo;

	beforeEach(() => {
		mockKV = createMockKVNamespace();

		// 테스트 데이터 준비
		// Date 객체는 JSON 직렬화 후 문자열이 되므로 문자열로 사용
		mockInvoices = [
			{
				...createValidInvoiceData({
					invoice_id: "inv-001",
					invoice_number: "INV-001",
				}),
				issue_date: new Date("2024-01-15"),
				due_date: new Date("2024-02-15"),
				created_at: new Date("2024-01-15"),
			} as Invoice,
			{
				...createValidInvoiceData({
					invoice_id: "inv-002",
					invoice_number: "INV-002",
				}),
				issue_date: new Date("2024-01-15"),
				due_date: new Date("2024-02-15"),
				created_at: new Date("2024-01-15"),
			} as Invoice,
		];

		mockInvoiceDetail = {
			...createValidInvoiceWithLineItemsData(
				{ invoice_id: "inv-001", invoice_number: "INV-001" },
				[
					{
						description: "Item 1",
						quantity: 2,
						unit_price: 500,
						line_total: 1000,
					},
					{
						description: "Item 2",
						quantity: 1,
						unit_price: 200,
						line_total: 200,
					},
				],
			),
			issue_date: new Date("2024-01-15"),
			due_date: new Date("2024-02-15"),
			created_at: new Date("2024-01-15"),
		} as InvoiceWithLineItems;

		mockCompanyInfo = createValidCompanyInfoData();

		// Base Repository Mock 초기화
		baseInvoiceRepo = {
			findAll: vi.fn().mockResolvedValue(mockInvoices),
			findById: vi.fn().mockResolvedValue(mockInvoiceDetail),
			findLineItems: vi.fn().mockResolvedValue(mockInvoiceDetail.line_items),
		};

		baseCompanyRepo = {
			getCompanyInfo: vi.fn().mockResolvedValue(mockCompanyInfo),
		};
	});

	describe("Cache Integration - Invoice List", () => {
		it("캐시 미스 시 base repository에서 조회 후 캐시에 저장한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act
			const result = await cachedRepo.findAll();

			// Assert
			expect(result).toEqual(mockInvoices);
			expect(baseInvoiceRepo.findAll).toHaveBeenCalledTimes(1);

			// 캐시 확인 (Date 객체는 JSON 직렬화되어 문자열이 됨)
			const cached = await cache.get<{ data: Invoice[] }>("invoices:list");
			expect(cached).not.toBeNull();
			expect(cached?.data).toBeDefined();
		});

		it("캐시 히트 시 base repository를 호출하지 않는다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.findAll();
			vi.clearAllMocks();

			// Act
			const result = await cachedRepo.findAll();

			// Assert — JSON 직렬화로 Date→string 변환됨
			expect(result).toHaveLength(mockInvoices.length);
			expect(result[0].invoice_id).toBe(mockInvoices[0].invoice_id);
			expect(baseInvoiceRepo.findAll).not.toHaveBeenCalled();
		});

		it("TTL 만료 후 다시 조회하면 base repository를 호출한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.findAll();
			vi.clearAllMocks();

			// TTL 만료 (5분 + 1초)
			mockKV._advanceTime((CACHE_TTL.INVOICE_LIST + 1) * 1000);

			// Act
			const result = await cachedRepo.findAll();

			// Assert
			expect(result).toEqual(mockInvoices);
			expect(baseInvoiceRepo.findAll).toHaveBeenCalledTimes(1);
		});
	});

	describe("Cache Integration - Invoice Detail", () => {
		it("캐시 미스 시 base repository에서 조회 후 캐시에 저장한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act
			const result = await cachedRepo.findById("inv-001");

			// Assert
			expect(result).toEqual(mockInvoiceDetail);
			expect(baseInvoiceRepo.findById).toHaveBeenCalledWith("inv-001");

			// 캐시 확인 (Date 객체는 JSON 직렬화되어 문자열이 됨)
			const cached = await cache.get<{ data: InvoiceWithLineItems }>(
				"invoices:detail:inv-001",
			);
			expect(cached).not.toBeNull();
			expect(cached?.data).toBeDefined();
		});

		it("캐시 히트 시 base repository를 호출하지 않는다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.findById("inv-001");
			vi.clearAllMocks();

			// Act
			const result = await cachedRepo.findById("inv-001");

			// Assert — JSON 직렬화로 Date→string 변환됨
			expect(result).not.toBeNull();
			expect(result?.invoice_id).toBe(mockInvoiceDetail.invoice_id);
			expect(result?.line_items).toHaveLength(
				mockInvoiceDetail.line_items.length,
			);
			expect(baseInvoiceRepo.findById).not.toHaveBeenCalled();
		});

		it("TTL 만료 후 다시 조회하면 base repository를 호출한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.findById("inv-001");
			vi.clearAllMocks();

			// TTL 만료 (10분 + 1초)
			mockKV._advanceTime((CACHE_TTL.INVOICE_DETAIL + 1) * 1000);

			// Act
			const result = await cachedRepo.findById("inv-001");

			// Assert
			expect(result).toEqual(mockInvoiceDetail);
			expect(baseInvoiceRepo.findById).toHaveBeenCalledWith("inv-001");
		});

		it("null 결과도 캐시에 저장한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			vi.mocked(baseInvoiceRepo.findById).mockResolvedValue(null);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act
			const result = await cachedRepo.findById("non-existent");

			// Assert
			expect(result).toBeNull();

			// 캐시 확인
			const cached = await cache.get<{ data: InvoiceWithLineItems | null }>(
				"invoices:detail:non-existent",
			);
			expect(cached).not.toBeNull();
			expect(cached?.data).toBeNull();

			// 두 번째 호출 시 base repository를 호출하지 않음
			vi.clearAllMocks();
			const secondResult = await cachedRepo.findById("non-existent");
			expect(secondResult).toBeNull();
			expect(baseInvoiceRepo.findById).not.toHaveBeenCalled();
		});
	});

	describe("Cache Integration - Company Info", () => {
		it("캐시 미스 시 base repository에서 조회 후 캐시에 저장한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedCompanyRepository({
				repository: baseCompanyRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act
			const result = await cachedRepo.getCompanyInfo();

			// Assert
			expect(result).toEqual(mockCompanyInfo);
			expect(baseCompanyRepo.getCompanyInfo).toHaveBeenCalledTimes(1);

			// 캐시 확인
			const cached = await cache.get<{ data: CompanyInfo }>("company:info");
			expect(cached).not.toBeNull();
			expect(cached?.data).toBeDefined();
		});

		it("캐시 히트 시 base repository를 호출하지 않는다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedCompanyRepository({
				repository: baseCompanyRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.getCompanyInfo();
			vi.clearAllMocks();

			// Act
			const result = await cachedRepo.getCompanyInfo();

			// Assert
			expect(result).toEqual(mockCompanyInfo);
			expect(baseCompanyRepo.getCompanyInfo).not.toHaveBeenCalled();
		});

		it("TTL 만료 후 다시 조회하면 base repository를 호출한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedCompanyRepository({
				repository: baseCompanyRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 호출로 캐시 채우기
			await cachedRepo.getCompanyInfo();
			vi.clearAllMocks();

			// TTL 만료 (15분 + 1초)
			mockKV._advanceTime((CACHE_TTL.COMPANY_INFO + 1) * 1000);

			// Act
			const result = await cachedRepo.getCompanyInfo();

			// Assert
			expect(result).toEqual(mockCompanyInfo);
			expect(baseCompanyRepo.getCompanyInfo).toHaveBeenCalledTimes(1);
		});
	});

	describe("Rate Limiter Integration", () => {
		it("제한 내 요청은 허용된다", async () => {
			// Arrange - 새로운 KV 인스턴스로 캐시 격리
			const freshKV = createMockKVNamespace();
			const cache = createKVCacheService(freshKV);
			const rateLimiter = createKVRateLimiter(
				freshKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => freshKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				freshKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act & Assert - 3번의 요청은 모두 성공 (첫 번째는 캐시 미스, 나머지는 캐시 히트)
			await expect(cachedRepo.findAll()).resolves.toBeDefined();
			await expect(cachedRepo.findById("inv-001")).resolves.toBeDefined();
			await expect(cachedRepo.findAll()).resolves.toBeDefined();
		});

		it("제한 초과 시 RateLimitExceededError를 발생시킨다", async () => {
			// Arrange - 새로운 KV 인스턴스로 격리
			const freshKV = createMockKVNamespace();
			const cache = createKVCacheService(freshKV);
			const rateLimiter = createKVRateLimiter(
				freshKV,
				{ maxRequests: 2, windowSeconds: 60 },
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);
			const circuitBreaker = createCircuitBreaker(
				freshKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act — findLineItems는 캐싱 없이 직접 executeWithProtection 호출
			await cachedRepo.findLineItems("inv-001");
			await cachedRepo.findLineItems("inv-001");

			// Assert - 3번째 요청은 rate limit 초과
			await expect(cachedRepo.findLineItems("inv-001")).rejects.toThrow(
				RateLimitExceededError,
			);
		});

		it("윈도우 리셋 후 요청이 다시 허용된다", async () => {
			// Arrange
			const freshKV = createMockKVNamespace();
			const cache = createKVCacheService(freshKV);
			const rateLimiter = createKVRateLimiter(
				freshKV,
				{ maxRequests: 2, windowSeconds: 60 },
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);
			const circuitBreaker = createCircuitBreaker(
				freshKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 2번 요청 후 제한 도달
			await cachedRepo.findLineItems("inv-001");
			await cachedRepo.findLineItems("inv-001");
			await expect(cachedRepo.findLineItems("inv-001")).rejects.toThrow(
				RateLimitExceededError,
			);

			// 윈도우 리셋 (60초 + 1초)
			freshKV._advanceTime(61 * 1000);

			// Act & Assert - 새 윈도우에서 요청 성공
			await expect(cachedRepo.findLineItems("inv-001")).resolves.toBeDefined();
		});
	});

	describe("Circuit Breaker Integration", () => {
		it("CLOSED 상태에서는 정상 동작한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act
			const result = await cachedRepo.findAll();

			// Assert
			expect(result).toEqual(mockInvoices);
			const status = await circuitBreaker.getState();
			expect(status.state).toBe("CLOSED");
		});

		it("연속 실패가 임계치를 초과하면 OPEN 상태로 전환된다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			// Base repository가 에러를 던지도록 설정
			const error = new Error("Notion API Error");
			vi.mocked(baseInvoiceRepo.findAll).mockRejectedValue(error);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act - 5번 연속 실패
			for (
				let i = 0;
				i < CIRCUIT_BREAKER_CONFIG.NOTION_API.failureThreshold;
				i++
			) {
				await expect(cachedRepo.findAll()).rejects.toThrow(error);
			}

			// Assert - OPEN 상태
			const status = await circuitBreaker.getState();
			expect(status.state).toBe("OPEN");
			expect(status.failureCount).toBe(
				CIRCUIT_BREAKER_CONFIG.NOTION_API.failureThreshold,
			);
		});

		it("OPEN 상태에서는 CircuitOpenError를 발생시킨다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const error = new Error("Notion API Error");
			vi.mocked(baseInvoiceRepo.findAll).mockRejectedValue(error);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Circuit을 OPEN 상태로 만들기
			for (
				let i = 0;
				i < CIRCUIT_BREAKER_CONFIG.NOTION_API.failureThreshold;
				i++
			) {
				await expect(cachedRepo.findAll()).rejects.toThrow(error);
			}

			// Act & Assert - OPEN 상태에서는 CircuitOpenError 발생
			await expect(cachedRepo.findAll()).rejects.toThrow(CircuitOpenError);
		});

		it("복구 시간 경과 후 HALF_OPEN 상태로 전환된다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const error = new Error("Notion API Error");
			vi.mocked(baseInvoiceRepo.findAll).mockRejectedValue(error);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Circuit을 OPEN 상태로 만들기
			for (
				let i = 0;
				i < CIRCUIT_BREAKER_CONFIG.NOTION_API.failureThreshold;
				i++
			) {
				await expect(cachedRepo.findAll()).rejects.toThrow(error);
			}

			// 복구 시간 경과 (30초 + 1초)
			mockKV._advanceTime(
				(CIRCUIT_BREAKER_CONFIG.NOTION_API.recoveryTimeSeconds + 1) * 1000,
			);

			// Act
			const status = await circuitBreaker.getState();

			// Assert
			expect(status.state).toBe("HALF_OPEN");
		});

		it("HALF_OPEN 상태에서 성공하면 CLOSED로 전환된다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const error = new Error("Notion API Error");
			vi.mocked(baseInvoiceRepo.findAll).mockRejectedValue(error);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Circuit을 OPEN 상태로 만들기
			for (
				let i = 0;
				i < CIRCUIT_BREAKER_CONFIG.NOTION_API.failureThreshold;
				i++
			) {
				await expect(cachedRepo.findAll()).rejects.toThrow(error);
			}

			// 복구 시간 경과
			mockKV._advanceTime(
				(CIRCUIT_BREAKER_CONFIG.NOTION_API.recoveryTimeSeconds + 1) * 1000,
			);

			// Base repository가 성공하도록 변경
			vi.mocked(baseInvoiceRepo.findAll).mockResolvedValue(mockInvoices);

			// Act - HALF_OPEN 상태에서 성공
			const result = await cachedRepo.findAll();

			// Assert
			expect(result).toEqual(mockInvoices);
			const status = await circuitBreaker.getState();
			expect(status.state).toBe("CLOSED");
			expect(status.failureCount).toBe(0);
		});
	});

	describe("Protection Order", () => {
		it("Rate Limit이 Circuit Breaker보다 먼저 확인된다", async () => {
			// Arrange — findLineItems는 캐싱 없이 매 호출마다 rate limit 체크
			const freshKV = createMockKVNamespace();
			const cache = createKVCacheService(freshKV);
			const rateLimiter = createKVRateLimiter(
				freshKV,
				{ maxRequests: 1, windowSeconds: 60 },
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);
			const circuitBreaker = createCircuitBreaker(
				freshKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => freshKV._getCurrentTime() },
			);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// 첫 번째 요청으로 rate limit 소진
			await cachedRepo.findLineItems("inv-001");

			// Act - 두 번째 요청은 rate limit에서 거부
			await expect(cachedRepo.findLineItems("inv-001")).rejects.toThrow(
				RateLimitExceededError,
			);

			// Assert - Circuit Breaker는 실행되지 않음 (실패 카운트가 증가하지 않음)
			const status = await circuitBreaker.getState();
			expect(status.state).toBe("CLOSED");
			expect(status.failureCount).toBe(0);
		});
	});

	describe("Error Propagation", () => {
		it("Base repository의 에러가 캐시 레이어를 통과한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			const notionError = new Error("Notion API Connection Failed");
			vi.mocked(baseInvoiceRepo.findAll).mockRejectedValue(notionError);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act & Assert
			await expect(cachedRepo.findAll()).rejects.toThrow(notionError);
		});

		it("null 결과를 캐시하고 다시 조회해도 null을 반환한다", async () => {
			// Arrange
			const cache = createKVCacheService(mockKV);
			const rateLimiter = createKVRateLimiter(
				mockKV,
				RATE_LIMIT_CONFIG.NOTION_API,
				{
					getCurrentTime: () => mockKV._getCurrentTime(),
				},
			);
			const circuitBreaker = createCircuitBreaker(
				mockKV,
				circuitBreakerKey(),
				CIRCUIT_BREAKER_CONFIG.NOTION_API,
				{ getCurrentTime: () => mockKV._getCurrentTime() },
			);

			vi.mocked(baseInvoiceRepo.findById).mockResolvedValue(null);

			const cachedRepo = createCachedInvoiceRepository({
				repository: baseInvoiceRepo,
				cache,
				rateLimiter,
				circuitBreaker,
			});

			// Act - 첫 번째 호출
			const firstResult = await cachedRepo.findById("non-existent");
			expect(firstResult).toBeNull();

			// 두 번째 호출 (캐시에서 조회)
			vi.clearAllMocks();
			const secondResult = await cachedRepo.findById("non-existent");

			// Assert
			expect(secondResult).toBeNull();
			expect(baseInvoiceRepo.findById).not.toHaveBeenCalled();
		});
	});
});
