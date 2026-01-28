import { describe, it, expect } from "vitest";

import {
	loginSchema,
	signupSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema,
} from "~/domain/auth/auth.schemas";

describe("loginSchema", () => {
	describe("유효한 데이터 검증", () => {
		it("이메일과 비밀번호가 올바르게 입력된 경우 통과해야 한다", () => {
			// Arrange: 유효한 로그인 데이터 준비
			const validData = {
				email: "user@example.com",
				password: "password123",
			};

			// Act: 스키마 검증 실행
			const result = loginSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});

		it("provider가 있는 경우에도 통과해야 한다", () => {
			// Arrange: provider가 포함된 로그인 데이터 준비
			const validData = {
				email: "user@example.com",
				password: "password123",
				provider: "google",
			};

			// Act: 스키마 검증 실행
			const result = loginSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("email 필드 검증", () => {
		it("이메일 형식이 올바르지 않으면 실패해야 한다", () => {
			// Arrange: 잘못된 이메일 형식 데이터 준비
			const invalidData = {
				email: "invalid-email",
				password: "password123",
			};

			// Act: 스키마 검증 실행
			const result = loginSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const emailError = result.error.issues.find(
					(issue) => issue.path[0] === "email",
				);
				expect(emailError?.message).toBe("올바른 이메일 주소를 입력해주세요");
			}
		});
	});

	describe("password 필드 검증", () => {
		it("비밀번호가 빈 문자열이면 실패해야 한다", () => {
			// Arrange: 빈 비밀번호 데이터 준비
			const invalidData = {
				email: "user@example.com",
				password: "",
			};

			// Act: 스키마 검증 실행
			const result = loginSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordError = result.error.issues.find(
					(issue) => issue.path[0] === "password",
				);
				expect(passwordError?.message).toBe("비밀번호를 입력해주세요");
			}
		});
	});
});

describe("signupSchema", () => {
	// 유효한 비밀번호 (대문자, 소문자, 숫자, 특수문자 포함)
	const validPassword = "Test1234!";

	describe("유효한 데이터 검증", () => {
		it("모든 필드가 올바르게 입력된 경우 통과해야 한다", () => {
			// Arrange: 유효한 회원가입 데이터 준비
			const validData = {
				name: "홍길동",
				email: "user@example.com",
				password: validPassword,
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("name 필드 검증", () => {
		it("이름이 빈 문자열이면 실패해야 한다", () => {
			// Arrange: 빈 이름 데이터 준비
			const invalidData = {
				name: "",
				email: "user@example.com",
				password: validPassword,
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const nameError = result.error.issues.find(
					(issue) => issue.path[0] === "name",
				);
				expect(nameError?.message).toBe("이름을 입력해주세요");
			}
		});
	});

	describe("password 필드 검증 (비밀번호 정책)", () => {
		it("8자 미만이면 실패해야 한다", () => {
			// Arrange: 7자 비밀번호 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: "Test12!",
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordError = result.error.issues.find(
					(issue) => issue.path[0] === "password",
				);
				expect(passwordError?.message).toBe(
					"비밀번호는 최소 8자 이상이어야 합니다",
				);
			}
		});

		it("대문자가 없으면 실패해야 한다", () => {
			// Arrange: 대문자가 없는 비밀번호 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: "test1234!",
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordError = result.error.issues.find(
					(issue) => issue.path[0] === "password",
				);
				expect(passwordError?.message).toContain("대소문자, 숫자, 특수문자");
			}
		});

		it("소문자가 없으면 실패해야 한다", () => {
			// Arrange: 소문자가 없는 비밀번호 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: "TEST1234!",
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});

		it("숫자가 없으면 실패해야 한다", () => {
			// Arrange: 숫자가 없는 비밀번호 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: "TestTest!",
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});

		it("특수문자가 없으면 실패해야 한다", () => {
			// Arrange: 특수문자가 없는 비밀번호 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: "Test12345",
				termsAgreed: true,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("termsAgreed 필드 검증", () => {
		it("이용약관에 동의하지 않으면 실패해야 한다", () => {
			// Arrange: 이용약관 미동의 데이터 준비
			const invalidData = {
				name: "홍길동",
				email: "user@example.com",
				password: validPassword,
				termsAgreed: false,
			};

			// Act: 스키마 검증 실행
			const result = signupSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const termsError = result.error.issues.find(
					(issue) => issue.path[0] === "termsAgreed",
				);
				expect(termsError?.message).toBe("이용약관에 동의해주세요");
			}
		});
	});
});

describe("forgotPasswordSchema", () => {
	describe("유효한 데이터 검증", () => {
		it("올바른 이메일 형식이면 통과해야 한다", () => {
			// Arrange: 유효한 이메일 데이터 준비
			const validData = {
				email: "user@example.com",
			};

			// Act: 스키마 검증 실행
			const result = forgotPasswordSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("email 필드 검증", () => {
		it("이메일 형식이 올바르지 않으면 실패해야 한다", () => {
			// Arrange: 잘못된 이메일 형식 데이터 준비
			const invalidData = {
				email: "invalid-email",
			};

			// Act: 스키마 검증 실행
			const result = forgotPasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"올바른 이메일 주소를 입력해주세요",
				);
			}
		});
	});
});

describe("resetPasswordSchema", () => {
	const validPassword = "NewTest1234!";

	describe("유효한 데이터 검증", () => {
		it("모든 필드가 올바르고 비밀번호가 일치하면 통과해야 한다", () => {
			// Arrange: 유효한 비밀번호 재설정 데이터 준비
			const validData = {
				newPassword: validPassword,
				newPasswordConfirm: validPassword,
				token: "valid-reset-token-123",
			};

			// Act: 스키마 검증 실행
			const result = resetPasswordSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("newPassword 필드 검증", () => {
		it("비밀번호 정책을 충족하지 않으면 실패해야 한다", () => {
			// Arrange: 정책 미충족 비밀번호 데이터 준비
			const invalidData = {
				newPassword: "weak",
				newPasswordConfirm: "weak",
				token: "valid-token",
			};

			// Act: 스키마 검증 실행
			const result = resetPasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("비밀번호 확인 검증", () => {
		it("비밀번호가 일치하지 않으면 실패해야 한다", () => {
			// Arrange: 불일치 비밀번호 데이터 준비
			const invalidData = {
				newPassword: validPassword,
				newPasswordConfirm: "DifferentPass1!",
				token: "valid-token",
			};

			// Act: 스키마 검증 실행
			const result = resetPasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const confirmError = result.error.issues.find(
					(issue) => issue.path[0] === "newPasswordConfirm",
				);
				expect(confirmError?.message).toBe("비밀번호가 일치하지 않습니다");
			}
		});

		it("비밀번호 확인이 빈 문자열이면 실패해야 한다", () => {
			// Arrange: 빈 비밀번호 확인 데이터 준비
			const invalidData = {
				newPassword: validPassword,
				newPasswordConfirm: "",
				token: "valid-token",
			};

			// Act: 스키마 검증 실행
			const result = resetPasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const confirmError = result.error.issues.find(
					(issue) => issue.path[0] === "newPasswordConfirm",
				);
				expect(confirmError?.message).toBe("비밀번호 확인을 입력해주세요");
			}
		});
	});

	describe("token 필드 검증", () => {
		it("토큰이 빈 문자열이면 실패해야 한다", () => {
			// Arrange: 빈 토큰 데이터 준비
			const invalidData = {
				newPassword: validPassword,
				newPasswordConfirm: validPassword,
				token: "",
			};

			// Act: 스키마 검증 실행
			const result = resetPasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const tokenError = result.error.issues.find(
					(issue) => issue.path[0] === "token",
				);
				expect(tokenError?.message).toBe("유효하지 않은 재설정 링크입니다");
			}
		});
	});
});

describe("changePasswordSchema", () => {
	const currentPassword = "OldPass123!";
	const newPassword = "NewPass456!";

	describe("유효한 데이터 검증", () => {
		it("모든 필드가 올바르고 비밀번호가 일치하면 통과해야 한다", () => {
			// Arrange: 유효한 비밀번호 변경 데이터 준비
			const validData = {
				currentPassword,
				newPassword,
				newPasswordConfirm: newPassword,
			};

			// Act: 스키마 검증 실행
			const result = changePasswordSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("currentPassword 필드 검증", () => {
		it("현재 비밀번호가 빈 문자열이면 실패해야 한다", () => {
			// Arrange: 빈 현재 비밀번호 데이터 준비
			const invalidData = {
				currentPassword: "",
				newPassword,
				newPasswordConfirm: newPassword,
			};

			// Act: 스키마 검증 실행
			const result = changePasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const currentPasswordError = result.error.issues.find(
					(issue) => issue.path[0] === "currentPassword",
				);
				expect(currentPasswordError?.message).toBe(
					"현재 비밀번호를 입력하세요",
				);
			}
		});
	});

	describe("newPassword 필드 검증", () => {
		it("새 비밀번호가 현재 비밀번호와 같으면 실패해야 한다", () => {
			// Arrange: 동일한 비밀번호 데이터 준비
			const invalidData = {
				currentPassword,
				newPassword: currentPassword,
				newPasswordConfirm: currentPassword,
			};

			// Act: 스키마 검증 실행
			const result = changePasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const newPasswordError = result.error.issues.find(
					(issue) => issue.path[0] === "newPassword",
				);
				expect(newPasswordError?.message).toBe(
					"새 비밀번호는 현재 비밀번호와 달라야 합니다",
				);
			}
		});

		it("새 비밀번호가 정책을 충족하지 않으면 실패해야 한다", () => {
			// Arrange: 정책 미충족 비밀번호 데이터 준비
			const invalidData = {
				currentPassword,
				newPassword: "weak",
				newPasswordConfirm: "weak",
			};

			// Act: 스키마 검증 실행
			const result = changePasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("비밀번호 확인 검증", () => {
		it("새 비밀번호가 일치하지 않으면 실패해야 한다", () => {
			// Arrange: 불일치 비밀번호 데이터 준비
			const invalidData = {
				currentPassword,
				newPassword,
				newPasswordConfirm: "DifferentPass1!",
			};

			// Act: 스키마 검증 실행
			const result = changePasswordSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const confirmError = result.error.issues.find(
					(issue) => issue.path[0] === "newPasswordConfirm",
				);
				expect(confirmError?.message).toBe("새 비밀번호가 일치하지 않습니다");
			}
		});
	});
});
