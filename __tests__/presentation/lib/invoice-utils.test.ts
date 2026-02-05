/**
 * invoice-utils.ts 유틸리티 함수 테스트
 *
 * TDD Red 단계: 실패하는 테스트 작성
 */
import { describe, expect, it } from "vitest";
import { InvoiceStatus } from "~/domain/invoice/invoice.types";
import { getStatusBadgeVariant } from "~/presentation/lib/invoice-utils";

describe("getStatusBadgeVariant", () => {
	describe("상태별 배지 variant 매핑", () => {
		it("Draft 상태는 secondary variant를 반환해야 한다", () => {
			// Arrange
			const status = InvoiceStatus.Draft;

			// Act
			const result = getStatusBadgeVariant(status);

			// Assert
			expect(result).toBe("secondary");
		});

		it("Sent 상태는 outline variant를 반환해야 한다", () => {
			// Arrange
			const status = InvoiceStatus.Sent;

			// Act
			const result = getStatusBadgeVariant(status);

			// Assert
			expect(result).toBe("outline");
		});

		it("Paid 상태는 default variant를 반환해야 한다", () => {
			// Arrange
			const status = InvoiceStatus.Paid;

			// Act
			const result = getStatusBadgeVariant(status);

			// Assert
			expect(result).toBe("default");
		});

		it("Overdue 상태는 destructive variant를 반환해야 한다", () => {
			// Arrange
			const status = InvoiceStatus.Overdue;

			// Act
			const result = getStatusBadgeVariant(status);

			// Assert
			expect(result).toBe("destructive");
		});
	});

	describe("모든 유효한 상태값 테스트", () => {
		it("모든 InvoiceStatus 값에 대해 유효한 variant를 반환해야 한다", () => {
			// Arrange
			const allStatuses = Object.values(InvoiceStatus);
			const validVariants = ["default", "secondary", "destructive", "outline"];

			// Act & Assert
			for (const status of allStatuses) {
				const result = getStatusBadgeVariant(status);
				expect(validVariants).toContain(result);
			}
		});
	});

	describe("타입 안전성 테스트", () => {
		it("string 리터럴로 상태를 전달해도 동작해야 한다", () => {
			// Arrange
			const status = "Draft" as InvoiceStatus;

			// Act
			const result = getStatusBadgeVariant(status);

			// Assert
			expect(result).toBe("secondary");
		});
	});
});
