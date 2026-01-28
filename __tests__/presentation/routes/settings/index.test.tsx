import { describe, it, expect, vi, beforeEach } from "vitest";
import { action } from "~/presentation/routes/settings/index";

/**
 * settings 라우트 Action 테스트
 *
 * 테스트 대상:
 * - 프로필 업데이트 (updateProfile)
 * - 비밀번호 변경 (changePassword)
 * - 유효성 검증 실패
 * - 알 수 없는 액션 타입 처리
 */

// Mock authService
const mockChangePassword = vi.fn();

const mockAuthService = {
	changePassword: mockChangePassword,
};

// Mock container
const mockContainer = {
	authService: mockAuthService,
};

// Helper: Request 생성
const createRequest = (formData: Record<string, string>): Request => {
	const form = new FormData();
	for (const [key, value] of Object.entries(formData)) {
		form.append(key, value);
	}
	return new Request("http://localhost:3000/my/settings", {
		method: "POST",
		body: form,
	});
};

// Helper: ActionArgs 생성
const createActionArgs = (request: Request) =>
	({
		request,
		context: { container: mockContainer },
		params: {},
	}) as unknown as Parameters<typeof action>[0];

describe("settings action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("프로필 업데이트 (updateProfile)", () => {
		it("유효한 데이터로 프로필 업데이트 성공 시 성공 메시지를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "updateProfile",
				fullName: "홍길동",
				email: "test@example.com",
				bio: "안녕하세요",
				language: "ko",
				notifications: "on",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({
				profileSuccess: "프로필이 성공적으로 업데이트되었습니다.",
			});
		});

		it("이름이 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "updateProfile",
				fullName: "",
				email: "test@example.com",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("profileErrors");
			const errors = (result as { profileErrors: Record<string, unknown> })
				.profileErrors;
			expect(errors).toHaveProperty("fullName");
		});

		it("이메일 형식이 잘못된 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "updateProfile",
				fullName: "홍길동",
				email: "invalid-email",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("profileErrors");
			const errors = (result as { profileErrors: Record<string, unknown> })
				.profileErrors;
			expect(errors).toHaveProperty("email");
		});
	});

	describe("비밀번호 변경 (changePassword)", () => {
		it("유효한 데이터로 비밀번호 변경 성공 시 성공 메시지를 반환한다", async () => {
			// Arrange
			mockChangePassword.mockResolvedValueOnce(undefined);
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "OldTest1234!",
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(mockChangePassword).toHaveBeenCalledWith(
				"OldTest1234!",
				"NewTest1234!",
				true,
				expect.any(Headers),
			);
			expect(result).toEqual({
				passwordSuccess: "비밀번호가 성공적으로 변경되었습니다.",
			});
		});

		it("현재 비밀번호가 비어있는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "",
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("passwordErrors");
			const errors = (result as { passwordErrors: Record<string, unknown> })
				.passwordErrors;
			expect(errors).toHaveProperty("currentPassword");
		});

		it("새 비밀번호가 복잡도 요구사항을 충족하지 않는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "OldTest1234!",
				newPassword: "weak",
				newPasswordConfirm: "weak",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("passwordErrors");
			const errors = (result as { passwordErrors: Record<string, unknown> })
				.passwordErrors;
			expect(errors).toHaveProperty("newPassword");
		});

		it("새 비밀번호 확인이 일치하지 않는 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "OldTest1234!",
				newPassword: "NewTest1234!",
				newPasswordConfirm: "DifferentTest1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("passwordErrors");
			const errors = (result as { passwordErrors: Record<string, unknown> })
				.passwordErrors;
			expect(errors).toHaveProperty("newPasswordConfirm");
		});

		it("새 비밀번호가 현재 비밀번호와 같은 경우 검증 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "Test1234!",
				newPassword: "Test1234!",
				newPasswordConfirm: "Test1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("passwordErrors");
			const errors = (result as { passwordErrors: Record<string, unknown> })
				.passwordErrors;
			expect(errors).toHaveProperty("newPassword");
		});

		it("비밀번호 변경 실패 시 에러 메시지를 반환한다", async () => {
			// Arrange
			mockChangePassword.mockRejectedValueOnce(
				new Error("Current password is incorrect"),
			);
			const request = createRequest({
				_action: "changePassword",
				currentPassword: "WrongPassword1!",
				newPassword: "NewTest1234!",
				newPasswordConfirm: "NewTest1234!",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toHaveProperty("passwordError");
			expect((result as { passwordError: string }).passwordError).toBe(
				"비밀번호 변경에 실패했습니다.",
			);
		});
	});

	describe("알 수 없는 액션 타입", () => {
		it("알 수 없는 _action 타입은 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				_action: "unknownAction",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "올바르지 않은 요청입니다." });
		});

		it("_action이 없는 경우 에러를 반환한다", async () => {
			// Arrange
			const request = createRequest({
				someField: "someValue",
			});
			const args = createActionArgs(request);

			// Act
			const result = await action(args);

			// Assert
			expect(result).toEqual({ error: "올바르지 않은 요청입니다." });
		});
	});
});
