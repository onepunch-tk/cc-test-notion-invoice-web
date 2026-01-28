import { describe, it, expect } from "vitest";
import {
	UserError,
	UserNotFoundError,
	ProfileNotFoundError,
	ProfileCreationError,
} from "~/domain/user/user.errors";

describe("User 도메인 에러 클래스", () => {
	describe("UserNotFoundError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new UserNotFoundError();

			// Assert
			expect(error.message).toBe("사용자를 찾을 수 없습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "ID가 123인 사용자를 찾을 수 없습니다.";

			// Act
			const error = new UserNotFoundError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("UserError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new UserNotFoundError();

			// Assert
			expect(error).toBeInstanceOf(UserError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 UserNotFoundError이다", () => {
			// Arrange & Act
			const error = new UserNotFoundError();

			// Assert
			expect(error.name).toBe("UserNotFoundError");
		});
	});

	describe("ProfileNotFoundError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new ProfileNotFoundError();

			// Assert
			expect(error.message).toBe("프로필을 찾을 수 없습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "사용자 abc의 프로필을 찾을 수 없습니다.";

			// Act
			const error = new ProfileNotFoundError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("UserError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new ProfileNotFoundError();

			// Assert
			expect(error).toBeInstanceOf(UserError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 ProfileNotFoundError이다", () => {
			// Arrange & Act
			const error = new ProfileNotFoundError();

			// Assert
			expect(error.name).toBe("ProfileNotFoundError");
		});
	});

	describe("ProfileCreationError", () => {
		it("기본 메시지로 인스턴스를 생성한다", () => {
			// Arrange & Act
			const error = new ProfileCreationError();

			// Assert
			expect(error.message).toBe("프로필 생성에 실패했습니다.");
		});

		it("커스텀 메시지로 인스턴스를 생성한다", () => {
			// Arrange
			const customMessage = "데이터베이스 연결 오류로 프로필 생성 실패";

			// Act
			const error = new ProfileCreationError(customMessage);

			// Assert
			expect(error.message).toBe(customMessage);
		});

		it("UserError의 인스턴스이다", () => {
			// Arrange & Act
			const error = new ProfileCreationError();

			// Assert
			expect(error).toBeInstanceOf(UserError);
			expect(error).toBeInstanceOf(Error);
		});

		it("name 프로퍼티가 ProfileCreationError이다", () => {
			// Arrange & Act
			const error = new ProfileCreationError();

			// Assert
			expect(error.name).toBe("ProfileCreationError");
		});
	});
});
