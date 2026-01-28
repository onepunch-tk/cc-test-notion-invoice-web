import { describe, it, expect } from "vitest";
import { z } from "zod";
import { parseFormData, validateFormData } from "~/presentation/lib/form-helpers";

describe("parseFormData (FormData를 객체로 변환)", () => {
	describe("기본 변환", () => {
		it("단일 필드를 객체로 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ email: "test@example.com" });
		});

		it("여러 필드를 객체로 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "secret123");
			formData.append("name", "홍길동");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({
				email: "test@example.com",
				password: "secret123",
				name: "홍길동",
			});
		});

		it("빈 FormData는 빈 객체를 반환한다", () => {
			// Arrange
			const formData = new FormData();

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({});
		});
	});

	describe("checkbox 처리", () => {
		it("체크된 checkbox 값 'on'을 true로 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("rememberMe", "on");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ rememberMe: true });
		});

		it("체크되지 않은 checkbox는 FormData에 포함되지 않는다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			// rememberMe는 체크되지 않아 FormData에 없음

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).not.toHaveProperty("rememberMe");
		});

		it("일반 필드와 checkbox를 함께 변환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("agreeTerms", "on");
			formData.append("newsletter", "on");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({
				email: "test@example.com",
				agreeTerms: true,
				newsletter: true,
			});
		});
	});

	describe("특수 값 처리", () => {
		it("빈 문자열을 그대로 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("name", "");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ name: "" });
		});

		it("숫자 문자열을 문자열로 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("age", "25");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ age: "25" });
			expect(typeof result.age).toBe("string");
		});

		it("공백 문자열을 그대로 유지한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("description", "   ");

			// Act
			const result = parseFormData(formData);

			// Assert
			expect(result).toEqual({ description: "   " });
		});
	});
});

describe("validateFormData (Zod 검증 + FormData 변환)", () => {
	// 테스트용 스키마 정의
	const testSchema = z.object({
		email: z.email("올바른 이메일 형식이 아닙니다"),
		password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
	});

	const schemaWithOptional = z.object({
		email: z.email(),
		name: z.string().optional(),
	});

	const schemaWithBoolean = z.object({
		email: z.email(),
		agreeTerms: z.boolean(),
	});

	describe("검증 성공", () => {
		it("유효한 데이터는 success: true와 data를 반환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "password123");

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({
					email: "test@example.com",
					password: "password123",
				});
			}
		});

		it("optional 필드가 없어도 검증 통과한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");

			// Act
			const result = validateFormData(schemaWithOptional, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({ email: "test@example.com" });
			}
		});

		it("checkbox 값을 boolean으로 검증한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("agreeTerms", "on");

			// Act
			const result = validateFormData(schemaWithBoolean, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.agreeTerms).toBe(true);
			}
		});
	});

	describe("검증 실패", () => {
		it("유효하지 않은 이메일은 success: false와 errors를 반환한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "invalid-email");
			formData.append("password", "password123");

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.errors).toBeDefined();
			}
		});

		it("비밀번호가 짧으면 검증 실패한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "short");

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("필수 필드가 없으면 검증 실패한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			// password 누락

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("여러 필드가 유효하지 않으면 모든 에러를 포함한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "invalid");
			formData.append("password", "short");

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			expect(result.success).toBe(false);
		});
	});

	describe("타입 추론", () => {
		it("성공 시 data는 스키마 타입으로 추론된다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "password123");

			// Act
			const result = validateFormData(testSchema, formData);

			// Assert
			if (result.success) {
				// TypeScript가 data의 타입을 올바르게 추론하는지 확인
				const email: string = result.data.email;
				const password: string = result.data.password;
				expect(email).toBe("test@example.com");
				expect(password).toBe("password123");
			}
		});
	});

	describe("복합 스키마", () => {
		const complexSchema = z.object({
			email: z.email(),
			password: z.string().min(8),
			confirmPassword: z.string(),
			agreeTerms: z.boolean(),
			newsletter: z.boolean().optional(),
		});

		it("복합 스키마 검증이 정상 동작한다", () => {
			// Arrange
			const formData = new FormData();
			formData.append("email", "test@example.com");
			formData.append("password", "password123");
			formData.append("confirmPassword", "password123");
			formData.append("agreeTerms", "on");

			// Act
			const result = validateFormData(complexSchema, formData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({
					email: "test@example.com",
					password: "password123",
					confirmPassword: "password123",
					agreeTerms: true,
				});
			}
		});
	});
});
