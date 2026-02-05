/**
 * format.ts 유틸리티 함수 테스트
 *
 * TDD Red 단계: 실패하는 테스트 작성
 */
import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "~/presentation/lib/format";

describe("formatCurrency", () => {
	describe("기본 동작", () => {
		it("기본값으로 KRW 통화와 ko-KR 로케일을 사용해야 한다", () => {
			// Arrange
			const amount = 10000;

			// Act
			const result = formatCurrency(amount);

			// Assert
			expect(result).toBe("₩10,000");
		});

		it("양수를 올바르게 포맷해야 한다", () => {
			// Arrange
			const amount = 1234567;

			// Act
			const result = formatCurrency(amount);

			// Assert
			expect(result).toBe("₩1,234,567");
		});
	});

	describe("특수 케이스", () => {
		it("0을 올바르게 처리해야 한다", () => {
			// Arrange
			const amount = 0;

			// Act
			const result = formatCurrency(amount);

			// Assert
			expect(result).toBe("₩0");
		});

		it("음수를 올바르게 처리해야 한다", () => {
			// Arrange
			const amount = -5000;

			// Act
			const result = formatCurrency(amount);

			// Assert
			expect(result).toContain("-");
			expect(result).toContain("5,000");
		});
	});

	describe("다른 통화 지원", () => {
		it("USD 통화를 올바르게 포맷해야 한다", () => {
			// Arrange
			const amount = 1234.56;
			const currency = "USD";
			const locale = "en-US";

			// Act
			const result = formatCurrency(amount, currency, locale);

			// Assert
			expect(result).toBe("$1,234.56");
		});

		it("EUR 통화를 올바르게 포맷해야 한다", () => {
			// Arrange
			const amount = 1234.56;
			const currency = "EUR";
			const locale = "de-DE";

			// Act
			const result = formatCurrency(amount, currency, locale);

			// Assert
			// 독일 로케일에서 EUR 포맷
			expect(result).toContain("1.234,56");
			expect(result).toContain("€");
		});

		it("소수점이 있는 USD 금액을 올바르게 처리해야 한다", () => {
			// Arrange
			const amount = 99.99;
			const currency = "USD";
			const locale = "en-US";

			// Act
			const result = formatCurrency(amount, currency, locale);

			// Assert
			expect(result).toBe("$99.99");
		});
	});

	describe("KRW 특수 처리", () => {
		it("KRW는 소수점 없이 표시되어야 한다", () => {
			// Arrange
			const amount = 10000.5;
			const currency = "KRW";
			const locale = "ko-KR";

			// Act
			const result = formatCurrency(amount, currency, locale);

			// Assert
			// KRW는 소수점을 사용하지 않음
			expect(result).toBe("₩10,001");
		});
	});
});

describe("formatDate", () => {
	describe("기본 동작", () => {
		it("기본 포맷 yyyy-MM-dd로 날짜를 포맷해야 한다", () => {
			// Arrange
			const date = new Date("2024-01-15");

			// Act
			const result = formatDate(date);

			// Assert
			expect(result).toBe("2024-01-15");
		});

		it("월과 일이 한 자리 숫자일 때 0을 붙여야 한다", () => {
			// Arrange
			const date = new Date("2024-03-05");

			// Act
			const result = formatDate(date);

			// Assert
			expect(result).toBe("2024-03-05");
		});
	});

	describe("커스텀 포맷 문자열", () => {
		it("한국어 포맷 문자열을 지원해야 한다", () => {
			// Arrange
			const date = new Date("2024-01-15");
			const formatStr = "yyyy년 MM월 dd일";

			// Act
			const result = formatDate(date, formatStr);

			// Assert
			expect(result).toBe("2024년 01월 15일");
		});

		it("다른 포맷 문자열을 지원해야 한다", () => {
			// Arrange
			const date = new Date("2024-12-25");
			const formatStr = "MM/dd/yyyy";

			// Act
			const result = formatDate(date, formatStr);

			// Assert
			expect(result).toBe("12/25/2024");
		});

		it("슬래시 구분자 포맷을 지원해야 한다", () => {
			// Arrange
			const date = new Date("2024-06-30");
			const formatStr = "yyyy/MM/dd";

			// Act
			const result = formatDate(date, formatStr);

			// Assert
			expect(result).toBe("2024/06/30");
		});
	});

	describe("경계값 테스트", () => {
		it("연말 날짜를 올바르게 처리해야 한다", () => {
			// Arrange
			const date = new Date("2024-12-31");

			// Act
			const result = formatDate(date);

			// Assert
			expect(result).toBe("2024-12-31");
		});

		it("연초 날짜를 올바르게 처리해야 한다", () => {
			// Arrange
			const date = new Date("2024-01-01");

			// Act
			const result = formatDate(date);

			// Assert
			expect(result).toBe("2024-01-01");
		});
	});
});
