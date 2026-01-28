import { describe, it, expect } from "vitest";

import { baseEntitySchema } from "~/domain/shared/common.schemas";

describe("baseEntitySchema", () => {
	describe("유효한 데이터 검증", () => {
		it("모든 필수 필드가 있는 경우 통과해야 한다", () => {
			// Arrange: 유효한 기본 엔티티 데이터 준비
			const validEntity = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				createdAt: new Date("2024-01-01T00:00:00Z"),
				updatedAt: new Date("2024-01-02T00:00:00Z"),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(validEntity);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validEntity.id);
				expect(result.data.createdAt).toEqual(validEntity.createdAt);
				expect(result.data.updatedAt).toEqual(validEntity.updatedAt);
			}
		});
	});

	describe("id 필드 검증", () => {
		it("id가 없으면 실패해야 한다", () => {
			// Arrange: id가 없는 데이터 준비
			const invalidEntity = {
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("id");
			}
		});

		it("id가 문자열이 아니면 실패해야 한다", () => {
			// Arrange: id가 숫자인 데이터 준비
			const invalidEntity = {
				id: 123,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("createdAt 필드 검증", () => {
		it("createdAt이 없으면 실패해야 한다", () => {
			// Arrange: createdAt이 없는 데이터 준비
			const invalidEntity = {
				id: "123",
				updatedAt: new Date(),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("createdAt");
			}
		});

		it("createdAt이 Date 타입이 아니면 실패해야 한다", () => {
			// Arrange: createdAt이 문자열인 데이터 준비
			const invalidEntity = {
				id: "123",
				createdAt: "2024-01-01",
				updatedAt: new Date(),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("updatedAt 필드 검증", () => {
		it("updatedAt이 없으면 실패해야 한다", () => {
			// Arrange: updatedAt이 없는 데이터 준비
			const invalidEntity = {
				id: "123",
				createdAt: new Date(),
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("updatedAt");
			}
		});

		it("updatedAt이 Date 타입이 아니면 실패해야 한다", () => {
			// Arrange: updatedAt이 문자열인 데이터 준비
			const invalidEntity = {
				id: "123",
				createdAt: new Date(),
				updatedAt: "2024-01-02",
			};

			// Act: 스키마 검증 실행
			const result = baseEntitySchema.safeParse(invalidEntity);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});
});
