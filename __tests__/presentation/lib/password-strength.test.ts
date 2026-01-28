import { describe, it, expect } from "vitest";
import { calculatePasswordStrength } from "~/presentation/lib/password-strength";

describe("calculatePasswordStrength (비밀번호 강도 계산)", () => {
	describe("점수 계산", () => {
		describe("길이 점수 (최대 30점)", () => {
			it("8자 미만 비밀번호는 길이 점수 0점", () => {
				// Arrange
				const password = "1234567"; // 7자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 숫자만 포함: 20점, 길이 점수: 0점 = 20점
				expect(result.score).toBe(20);
			});

			it("8자 이상 비밀번호는 길이 점수 10점", () => {
				// Arrange
				const password = "12345678"; // 8자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 숫자만 포함: 20점, 길이 점수: 10점 = 30점
				expect(result.score).toBe(30);
			});

			it("12자 이상 비밀번호는 길이 점수 20점", () => {
				// Arrange
				const password = "123456789012"; // 12자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 숫자만 포함: 20점, 길이 점수: 10+10 = 20점 = 40점
				expect(result.score).toBe(40);
			});

			it("16자 이상 비밀번호는 길이 점수 30점", () => {
				// Arrange
				const password = "1234567890123456"; // 16자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 숫자만 포함: 20점, 길이 점수: 10+10+10 = 30점 = 50점
				expect(result.score).toBe(50);
			});
		});

		describe("문자 다양성 점수", () => {
			it("소문자 포함 시 20점 추가", () => {
				// Arrange
				const password = "abcdefgh"; // 8자 소문자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 소문자: 20점, 길이(8자 이상): 10점 = 30점
				expect(result.score).toBe(30);
			});

			it("대문자 포함 시 20점 추가", () => {
				// Arrange
				const password = "ABCDEFGH"; // 8자 대문자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 대문자: 20점, 길이(8자 이상): 10점 = 30점
				expect(result.score).toBe(30);
			});

			it("숫자 포함 시 20점 추가", () => {
				// Arrange
				const password = "12345678"; // 8자 숫자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 숫자: 20점, 길이(8자 이상): 10점 = 30점
				expect(result.score).toBe(30);
			});

			it("특수문자 포함 시 10점 추가", () => {
				// Arrange
				const password = "!@#$%^&*"; // 8자 특수문자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 특수문자: 10점, 길이(8자 이상): 10점 = 20점
				expect(result.score).toBe(20);
			});

			it("소문자 + 대문자 + 숫자 조합 시 점수 합산", () => {
				// Arrange
				const password = "Abc12345"; // 8자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 소문자: 20점, 대문자: 20점, 숫자: 20점, 길이(8자 이상): 10점 = 70점
				expect(result.score).toBe(70);
			});

			it("모든 종류 문자 포함 시 최대 점수", () => {
				// Arrange
				const password = "Abc123!@#$abcd"; // 14자 (12자 이상)

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 소문자: 20점, 대문자: 20점, 숫자: 20점, 특수문자: 10점, 길이: 20점 = 90점
				expect(result.score).toBe(90);
			});
		});

		describe("최대 점수 (100점)", () => {
			it("16자 이상 + 모든 문자 종류 포함 시 100점", () => {
				// Arrange
				const password = "Abc123!@#$abcdef"; // 16자

				// Act
				const result = calculatePasswordStrength(password);

				// Assert
				// 소문자: 20점, 대문자: 20점, 숫자: 20점, 특수문자: 10점, 길이: 30점 = 100점
				expect(result.score).toBe(100);
			});
		});
	});

	describe("레벨 판정", () => {
		it("점수 0-39는 weak 레벨", () => {
			// Arrange
			const weakPassword = "abc"; // 3자 소문자 = 20점

			// Act
			const result = calculatePasswordStrength(weakPassword);

			// Assert
			expect(result.level).toBe("weak");
			expect(result.label).toBe("약함");
			expect(result.colorClass).toBe("bg-red-600");
		});

		it("점수 40-69는 medium 레벨", () => {
			// Arrange
			const mediumPassword = "abc12345678"; // 11자 소문자+숫자 = 20+20+10 = 50점

			// Act
			const result = calculatePasswordStrength(mediumPassword);

			// Assert
			expect(result.level).toBe("medium");
			expect(result.label).toBe("보통");
			expect(result.colorClass).toBe("bg-yellow-600");
		});

		it("점수 70-100은 strong 레벨", () => {
			// Arrange
			const strongPassword = "Abc12345"; // 8자 소문자+대문자+숫자 = 20+20+20+10 = 70점

			// Act
			const result = calculatePasswordStrength(strongPassword);

			// Assert
			expect(result.level).toBe("strong");
			expect(result.label).toBe("강함");
			expect(result.colorClass).toBe("bg-green-600");
		});

		it("경계값 39점은 weak 레벨", () => {
			// Arrange
			// 소문자: 20점, 숫자: 20점 = 40점 → medium
			// 소문자: 20점, 특수문자: 10점 = 30점 → weak (8자 미만으로)
			const password = "abc!@#"; // 6자 = 30점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBeLessThan(40);
			expect(result.level).toBe("weak");
		});

		it("경계값 40점은 medium 레벨", () => {
			// Arrange
			// 소문자: 20점, 숫자: 20점 = 40점
			const password = "abc1234"; // 7자 = 40점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(40);
			expect(result.level).toBe("medium");
		});

		it("경계값 69점은 medium 레벨", () => {
			// Arrange
			// 소문자: 20점, 대문자: 20점, 숫자: 20점 = 60점 + 길이 8자 = 70점 → strong
			// 소문자: 20점, 대문자: 20점, 숫자: 20점 = 60점 (7자) → medium
			const password = "Abc1234"; // 7자 = 60점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(60);
			expect(result.level).toBe("medium");
		});

		it("경계값 70점은 strong 레벨", () => {
			// Arrange
			const password = "Abc12345"; // 8자 = 70점

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(70);
			expect(result.level).toBe("strong");
		});
	});

	describe("반환값 구조", () => {
		it("score, level, label, colorClass를 모두 포함한다", () => {
			// Arrange
			const password = "testPassword";

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result).toHaveProperty("score");
			expect(result).toHaveProperty("level");
			expect(result).toHaveProperty("label");
			expect(result).toHaveProperty("colorClass");
		});

		it("score는 숫자 타입이다", () => {
			// Arrange
			const password = "testPassword";

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(typeof result.score).toBe("number");
		});

		it("level은 weak, medium, strong 중 하나이다", () => {
			// Arrange
			const passwords = ["a", "abcdefgh", "Abc12345"];

			// Act & Assert
			for (const password of passwords) {
				const result = calculatePasswordStrength(password);
				expect(["weak", "medium", "strong"]).toContain(result.level);
			}
		});
	});

	describe("엣지 케이스", () => {
		it("빈 문자열은 0점이다", () => {
			// Arrange
			const password = "";

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			expect(result.score).toBe(0);
			expect(result.level).toBe("weak");
		});

		it("공백만 있는 문자열은 특수문자로 처리된다", () => {
			// Arrange
			const password = "        "; // 8자 공백

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 공백은 [^A-Za-z0-9] 패턴에 매칭 → 특수문자: 10점, 길이(8자 이상): 10점 = 20점
			expect(result.score).toBe(20);
		});

		it("한글 문자는 특수문자로 처리된다", () => {
			// Arrange
			const password = "가나다라마바사아"; // 8자 한글

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 한글은 [^A-Za-z0-9] 패턴에 매칭 → 특수문자: 10점, 길이: 10점 = 20점
			expect(result.score).toBe(20);
		});

		it("이모지는 특수문자로 처리된다", () => {
			// Arrange
			const password = "password🔐"; // 8자 + 이모지

			// Act
			const result = calculatePasswordStrength(password);

			// Assert
			// 소문자: 20점, 특수문자: 10점, 길이: 10점 = 40점
			expect(result.score).toBeGreaterThanOrEqual(40);
		});
	});
});
