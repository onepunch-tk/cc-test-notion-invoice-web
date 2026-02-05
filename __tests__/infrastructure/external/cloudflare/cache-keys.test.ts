import { describe, expect, it } from "vitest";
import {
	CACHE_TTL,
	CIRCUIT_BREAKER_CONFIG,
	circuitBreakerKey,
	companyInfoKey,
	invoiceDetailKey,
	invoiceListKey,
	ipRateLimitKey,
	notionApiRateLimitKey,
	RATE_LIMIT_CONFIG,
} from "~/infrastructure/external/cloudflare/cache-keys";

describe("cache-keys", () => {
	describe("캐시 키 생성 함수", () => {
		it("invoiceListKey()는 invoices:list를 반환한다", () => {
			// Act
			const result = invoiceListKey();

			// Assert
			expect(result).toBe("invoices:list");
		});

		it("invoiceDetailKey(id)는 invoices:detail:{id}를 반환한다", () => {
			// Arrange
			const invoiceId = "test-invoice-123";

			// Act
			const result = invoiceDetailKey(invoiceId);

			// Assert
			expect(result).toBe(`invoices:detail:${invoiceId}`);
		});

		it("invoiceDetailKey는 유효하지 않은 ID에 대해 에러를 throw한다", () => {
			// Arrange - 특수 문자가 포함된 ID
			const invalidId = "test/../../../etc/passwd";

			// Act & Assert
			expect(() => invoiceDetailKey(invalidId)).toThrow(
				"Invalid invoice ID format for cache key",
			);
		});

		it("companyInfoKey()는 company:info를 반환한다", () => {
			// Act
			const result = companyInfoKey();

			// Assert
			expect(result).toBe("company:info");
		});

		it("ipRateLimitKey(ip)는 ratelimit:ip:{ip}를 반환한다", () => {
			// Arrange
			const ip = "192.168.1.100";

			// Act
			const result = ipRateLimitKey(ip);

			// Assert
			expect(result).toBe(`ratelimit:ip:${ip}`);
		});

		it("ipRateLimitKey는 유효하지 않은 IP에 대해 에러를 throw한다", () => {
			// Arrange - 잘못된 IP 형식
			const invalidIp = "not-an-ip-address";

			// Act & Assert
			expect(() => ipRateLimitKey(invalidIp)).toThrow(
				"Invalid IP address format for rate limit key",
			);
		});

		it("ipRateLimitKey는 IPv6 주소를 허용한다", () => {
			// Arrange
			const ipv6 = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";

			// Act
			const result = ipRateLimitKey(ipv6);

			// Assert
			expect(result).toBe(`ratelimit:ip:${ipv6}`);
		});

		it("notionApiRateLimitKey()는 ratelimit:notion-api를 반환한다", () => {
			// Act
			const result = notionApiRateLimitKey();

			// Assert
			expect(result).toBe("ratelimit:notion-api");
		});

		it("circuitBreakerKey()는 circuit:notion-api를 반환한다", () => {
			// Act
			const result = circuitBreakerKey();

			// Assert
			expect(result).toBe("circuit:notion-api");
		});
	});

	describe("CACHE_TTL 상수", () => {
		it("INVOICE_LIST는 300초(5분)이다", () => {
			expect(CACHE_TTL.INVOICE_LIST).toBe(300);
		});

		it("INVOICE_DETAIL는 600초(10분)이다", () => {
			expect(CACHE_TTL.INVOICE_DETAIL).toBe(600);
		});

		it("COMPANY_INFO는 900초(15분)이다", () => {
			expect(CACHE_TTL.COMPANY_INFO).toBe(900);
		});
	});

	describe("RATE_LIMIT_CONFIG 상수", () => {
		it("IP는 60 req/60s 설정을 가진다", () => {
			expect(RATE_LIMIT_CONFIG.IP).toEqual({
				maxRequests: 60,
				windowSeconds: 60,
			});
		});

		it("NOTION_API는 180 req/60s 설정을 가진다 (3 req/sec scaled for KV minimum TTL)", () => {
			expect(RATE_LIMIT_CONFIG.NOTION_API).toEqual({
				maxRequests: 180,
				windowSeconds: 60,
			});
		});
	});

	describe("CIRCUIT_BREAKER_CONFIG 상수", () => {
		it("NOTION_API는 올바른 Circuit Breaker 설정을 가진다", () => {
			expect(CIRCUIT_BREAKER_CONFIG.NOTION_API).toEqual({
				failureThreshold: 5,
				recoveryTimeSeconds: 30,
				halfOpenRequests: 1,
			});
		});
	});
});
