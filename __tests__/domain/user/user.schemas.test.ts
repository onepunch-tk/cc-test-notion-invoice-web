import { describe, it, expect } from "vitest";

import {
	userSchema,
	profileSchema,
	isUser,
	isProfile,
	updateProfileSchema,
} from "~/domain/user/user.schemas";

describe("userSchema", () => {
	describe("유효한 데이터 검증", () => {
		it("모든 필수 필드가 있는 경우 통과해야 한다", () => {
			// Arrange: 유효한 사용자 데이터 준비
			const validUser = {
				id: "user-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				name: "홍길동",
				email: "hong@example.com",
				emailVerified: true,
				image: "https://example.com/avatar.png",
			};

			// Act: 스키마 검증 실행
			const result = userSchema.safeParse(validUser);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe("홍길동");
				expect(result.data.email).toBe("hong@example.com");
			}
		});

		it("image가 null인 경우에도 통과해야 한다", () => {
			// Arrange: image가 null인 사용자 데이터 준비
			const validUser = {
				id: "user-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				name: "홍길동",
				email: "hong@example.com",
				emailVerified: false,
				image: null,
			};

			// Act: 스키마 검증 실행
			const result = userSchema.safeParse(validUser);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("필수 필드 검증", () => {
		it("name이 없으면 실패해야 한다", () => {
			// Arrange: name이 없는 데이터 준비
			const invalidUser = {
				id: "user-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				email: "hong@example.com",
				emailVerified: true,
				image: null,
			};

			// Act: 스키마 검증 실행
			const result = userSchema.safeParse(invalidUser);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});

		it("email이 없으면 실패해야 한다", () => {
			// Arrange: email이 없는 데이터 준비
			const invalidUser = {
				id: "user-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				name: "홍길동",
				emailVerified: true,
				image: null,
			};

			// Act: 스키마 검증 실행
			const result = userSchema.safeParse(invalidUser);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});

		it("emailVerified가 없으면 실패해야 한다", () => {
			// Arrange: emailVerified가 없는 데이터 준비
			const invalidUser = {
				id: "user-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				name: "홍길동",
				email: "hong@example.com",
				image: null,
			};

			// Act: 스키마 검증 실행
			const result = userSchema.safeParse(invalidUser);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});
});

describe("profileSchema", () => {
	describe("유효한 데이터 검증", () => {
		it("모든 필드가 있는 경우 통과해야 한다", () => {
			// Arrange: 유효한 프로필 데이터 준비
			const validProfile = {
				id: "profile-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: "user-123",
				fullName: "홍길동",
				avatarUrl: "https://example.com/avatar.png",
				bio: "안녕하세요, 개발자입니다.",
			};

			// Act: 스키마 검증 실행
			const result = profileSchema.safeParse(validProfile);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});

		it("nullable 필드가 모두 null인 경우에도 통과해야 한다", () => {
			// Arrange: nullable 필드가 null인 프로필 데이터 준비
			const validProfile = {
				id: "profile-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: "user-123",
				fullName: null,
				avatarUrl: null,
				bio: null,
			};

			// Act: 스키마 검증 실행
			const result = profileSchema.safeParse(validProfile);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("필수 필드 검증", () => {
		it("userId가 없으면 실패해야 한다", () => {
			// Arrange: userId가 없는 데이터 준비
			const invalidProfile = {
				id: "profile-123",
				createdAt: new Date(),
				updatedAt: new Date(),
				fullName: "홍길동",
				avatarUrl: null,
				bio: null,
			};

			// Act: 스키마 검증 실행
			const result = profileSchema.safeParse(invalidProfile);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});
});

describe("isUser 타입 가드", () => {
	it("유효한 User 객체에 대해 true를 반환해야 한다", () => {
		// Arrange: 유효한 사용자 데이터 준비
		const validUser = {
			id: "user-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			name: "홍길동",
			email: "hong@example.com",
			emailVerified: true,
			image: null,
		};

		// Act: 타입 가드 실행
		const result = isUser(validUser);

		// Assert: true 반환 확인
		expect(result).toBe(true);
	});

	it("유효하지 않은 객체에 대해 false를 반환해야 한다", () => {
		// Arrange: 유효하지 않은 데이터 준비
		const invalidUser = {
			id: "user-123",
			name: "홍길동",
		};

		// Act: 타입 가드 실행
		const result = isUser(invalidUser);

		// Assert: false 반환 확인
		expect(result).toBe(false);
	});

	it("null에 대해 false를 반환해야 한다", () => {
		// Arrange: null 준비
		const nullValue = null;

		// Act: 타입 가드 실행
		const result = isUser(nullValue);

		// Assert: false 반환 확인
		expect(result).toBe(false);
	});

	it("undefined에 대해 false를 반환해야 한다", () => {
		// Arrange: undefined 준비
		const undefinedValue = undefined;

		// Act: 타입 가드 실행
		const result = isUser(undefinedValue);

		// Assert: false 반환 확인
		expect(result).toBe(false);
	});
});

describe("isProfile 타입 가드", () => {
	it("유효한 Profile 객체에 대해 true를 반환해야 한다", () => {
		// Arrange: 유효한 프로필 데이터 준비
		const validProfile = {
			id: "profile-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			userId: "user-123",
			fullName: "홍길동",
			avatarUrl: null,
			bio: null,
		};

		// Act: 타입 가드 실행
		const result = isProfile(validProfile);

		// Assert: true 반환 확인
		expect(result).toBe(true);
	});

	it("유효하지 않은 객체에 대해 false를 반환해야 한다", () => {
		// Arrange: 유효하지 않은 데이터 준비
		const invalidProfile = {
			id: "profile-123",
		};

		// Act: 타입 가드 실행
		const result = isProfile(invalidProfile);

		// Assert: false 반환 확인
		expect(result).toBe(false);
	});

	it("null에 대해 false를 반환해야 한다", () => {
		// Arrange: null 준비
		const nullValue = null;

		// Act: 타입 가드 실행
		const result = isProfile(nullValue);

		// Assert: false 반환 확인
		expect(result).toBe(false);
	});
});

describe("updateProfileSchema", () => {
	describe("유효한 데이터 검증", () => {
		it("모든 필드가 올바르게 입력된 경우 통과해야 한다", () => {
			// Arrange: 유효한 프로필 업데이트 데이터 준비
			const validData = {
				fullName: "홍길동",
				email: "hong@example.com",
				bio: "안녕하세요, 개발자입니다.",
				language: "ko" as const,
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});

		it("bio가 없는 경우에도 통과해야 한다 (optional)", () => {
			// Arrange: bio가 없는 데이터 준비
			const validData = {
				fullName: "홍길동",
				email: "hong@example.com",
				language: "en" as const,
				notifications: false,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("fullName 필드 검증", () => {
		it("fullName이 빈 문자열이면 실패해야 한다", () => {
			// Arrange: fullName이 빈 문자열인 데이터 준비
			const invalidData = {
				fullName: "",
				email: "hong@example.com",
				language: "ko" as const,
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const fullNameError = result.error.issues.find(
					(issue) => issue.path[0] === "fullName",
				);
				expect(fullNameError?.message).toBe("이름을 입력해주세요");
			}
		});
	});

	describe("email 필드 검증", () => {
		it("이메일 형식이 올바르지 않으면 실패해야 한다", () => {
			// Arrange: 잘못된 이메일 형식의 데이터 준비
			const invalidData = {
				fullName: "홍길동",
				email: "invalid-email",
				language: "ko" as const,
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const emailError = result.error.issues.find(
					(issue) => issue.path[0] === "email",
				);
				expect(emailError?.message).toBe("올바른 이메일 형식이 아닙니다");
			}
		});
	});

	describe("bio 필드 검증", () => {
		it("bio가 500자를 초과하면 실패해야 한다", () => {
			// Arrange: 500자를 초과하는 bio 데이터 준비
			const longBio = "a".repeat(501);
			const invalidData = {
				fullName: "홍길동",
				email: "hong@example.com",
				bio: longBio,
				language: "ko" as const,
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(invalidData);

			// Assert: 검증 실패 및 에러 메시지 확인
			expect(result.success).toBe(false);
			if (!result.success) {
				const bioError = result.error.issues.find(
					(issue) => issue.path[0] === "bio",
				);
				expect(bioError?.message).toBe(
					"자기소개는 500자 이내로 작성해주세요",
				);
			}
		});

		it("bio가 정확히 500자인 경우 통과해야 한다", () => {
			// Arrange: 정확히 500자인 bio 데이터 준비
			const exactBio = "a".repeat(500);
			const validData = {
				fullName: "홍길동",
				email: "hong@example.com",
				bio: exactBio,
				language: "ko" as const,
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(validData);

			// Assert: 검증 성공 확인
			expect(result.success).toBe(true);
		});
	});

	describe("language 필드 검증 (enum)", () => {
		it("ko, en, ja 값은 통과해야 한다", () => {
			// Arrange & Act & Assert: 각 언어 옵션 테스트
			const languages = ["ko", "en", "ja"] as const;

			for (const language of languages) {
				const validData = {
					fullName: "홍길동",
					email: "hong@example.com",
					language,
					notifications: true,
				};
				const result = updateProfileSchema.safeParse(validData);
				expect(result.success).toBe(true);
			}
		});

		it("허용되지 않은 언어 값은 실패해야 한다", () => {
			// Arrange: 허용되지 않은 언어 값 데이터 준비
			const invalidData = {
				fullName: "홍길동",
				email: "hong@example.com",
				language: "fr",
				notifications: true,
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});

	describe("notifications 필드 검증", () => {
		it("boolean 타입이 아니면 실패해야 한다", () => {
			// Arrange: notifications가 문자열인 데이터 준비
			const invalidData = {
				fullName: "홍길동",
				email: "hong@example.com",
				language: "ko",
				notifications: "true",
			};

			// Act: 스키마 검증 실행
			const result = updateProfileSchema.safeParse(invalidData);

			// Assert: 검증 실패 확인
			expect(result.success).toBe(false);
		});
	});
});
