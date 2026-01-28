import { describe, it, expect, beforeEach, vi } from "vitest";
import { createEmailServiceImpl } from "~/infrastructure/external/resend/email.service.impl";
import {
	EmailServiceNotConfiguredError,
	EmailSendError,
} from "~/domain/auth";
import type { ReactElement } from "react";

// Resend 인스턴스 모킹을 위한 변수
const mockEmailsSend = vi.fn();

// Resend 모듈 모킹 - 클래스 형태로 모킹
vi.mock("resend", () => {
	return {
		Resend: class MockResend {
			emails = {
				send: mockEmailsSend,
			};
		},
	};
});

// 이메일 컴포넌트 모킹
vi.mock("~/presentation/components/email/verification-email", () => ({
	default: vi.fn(({ verificationUrl }: { verificationUrl: string }) => ({
		type: "VerificationEmail",
		props: { verificationUrl },
	})),
}));

vi.mock("~/presentation/components/email/password-reset-email", () => ({
	default: vi.fn(({ resetUrl }: { resetUrl: string }) => ({
		type: "PasswordResetEmail",
		props: { resetUrl },
	})),
}));

describe("createEmailServiceImpl", () => {
	const TEST_API_KEY = "re_test_api_key_12345";
	const TEST_FROM_EMAIL = "noreply@example.com";
	const TEST_TO_EMAIL = "user@example.com";
	const TEST_SUBJECT = "테스트 제목";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("send", () => {
		it("API 키가 없을 때 EmailServiceNotConfiguredError를 던진다", async () => {
			// Arrange: API 키 없이 서비스 생성
			const emailService = createEmailServiceImpl(undefined, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act & Assert: send 호출 시 에러 발생 확인
			await expect(
				emailService.send({
					to: TEST_TO_EMAIL,
					subject: TEST_SUBJECT,
					react: mockReactElement,
				})
			).rejects.toThrow(EmailServiceNotConfiguredError);
		});

		it("이메일 전송에 성공하면 에러 없이 완료된다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act: 이메일 전송
			const sendPromise = emailService.send({
				to: TEST_TO_EMAIL,
				subject: TEST_SUBJECT,
				react: mockReactElement,
			});

			// Assert: 에러 없이 완료
			await expect(sendPromise).resolves.toBeUndefined();

			// Resend API 호출 확인
			expect(mockEmailsSend).toHaveBeenCalledWith({
				from: TEST_FROM_EMAIL,
				to: [TEST_TO_EMAIL],
				subject: TEST_SUBJECT,
				react: mockReactElement,
			});
		});

		it("Resend API 에러 응답 시 EmailSendError를 던진다", async () => {
			// Arrange: 에러 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: null,
				error: { message: "Invalid email address" },
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act & Assert: EmailSendError 발생 확인
			await expect(
				emailService.send({
					to: TEST_TO_EMAIL,
					subject: TEST_SUBJECT,
					react: mockReactElement,
				})
			).rejects.toThrow(EmailSendError);
		});

		it("Resend API 호출 중 예외 발생 시 EmailSendError를 던진다", async () => {
			// Arrange: 네트워크 에러 시뮬레이션
			mockEmailsSend.mockRejectedValue(new Error("Network error"));

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act & Assert: EmailSendError 발생 확인
			await expect(
				emailService.send({
					to: TEST_TO_EMAIL,
					subject: TEST_SUBJECT,
					react: mockReactElement,
				})
			).rejects.toThrow(EmailSendError);
		});

		it("from 옵션이 없으면 기본 이메일 주소를 사용한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act: from 옵션 없이 전송
			await emailService.send({
				to: TEST_TO_EMAIL,
				subject: TEST_SUBJECT,
				react: mockReactElement,
			});

			// Assert: 기본 from 이메일 사용 확인
			expect(mockEmailsSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: TEST_FROM_EMAIL,
				})
			);
		});

		it("from 옵션이 있으면 해당 이메일 주소를 사용한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const mockReactElement = { type: "div", props: {} } as ReactElement;
			const customFrom = "custom@example.com";

			// Act: from 옵션과 함께 전송
			await emailService.send({
				to: TEST_TO_EMAIL,
				subject: TEST_SUBJECT,
				react: mockReactElement,
				from: customFrom,
			});

			// Assert: 커스텀 from 이메일 사용 확인
			expect(mockEmailsSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: customFrom,
				})
			);
		});

		it("fromEmail이 undefined일 때 기본값 onboarding@resend.dev를 사용한다", async () => {
			// Arrange: fromEmail 없이 서비스 생성
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, undefined);
			const mockReactElement = { type: "div", props: {} } as ReactElement;

			// Act: 이메일 전송
			await emailService.send({
				to: TEST_TO_EMAIL,
				subject: TEST_SUBJECT,
				react: mockReactElement,
			});

			// Assert: 기본 from 이메일 사용 확인
			expect(mockEmailsSend).toHaveBeenCalledWith(
				expect.objectContaining({
					from: "onboarding@resend.dev",
				})
			);
		});
	});

	describe("sendVerificationEmail", () => {
		it("올바른 제목으로 인증 이메일을 전송한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act: 인증 이메일 전송
			await emailService.sendVerificationEmail(TEST_TO_EMAIL, verificationUrl);

			// Assert: 올바른 제목으로 호출 확인
			expect(mockEmailsSend).toHaveBeenCalledWith(
				expect.objectContaining({
					to: [TEST_TO_EMAIL],
					subject: "이메일 인증을 완료해주세요",
				})
			);
		});

		it("VerificationEmail 컴포넌트를 올바른 props로 전달한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const verificationUrl = "https://example.com/verify?token=abc123";

			// Act: 인증 이메일 전송
			await emailService.sendVerificationEmail(TEST_TO_EMAIL, verificationUrl);

			// Assert: React 컴포넌트가 올바른 props로 전달됨
			const callArgs = mockEmailsSend.mock.calls[0][0];
			expect(callArgs.react).toEqual({
				type: "VerificationEmail",
				props: { verificationUrl },
			});
		});
	});

	describe("sendPasswordResetEmail", () => {
		it("올바른 제목으로 비밀번호 재설정 이메일을 전송한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const resetUrl = "https://example.com/reset?token=xyz789";

			// Act: 비밀번호 재설정 이메일 전송
			await emailService.sendPasswordResetEmail(TEST_TO_EMAIL, resetUrl);

			// Assert: 올바른 제목으로 호출 확인
			expect(mockEmailsSend).toHaveBeenCalledWith(
				expect.objectContaining({
					to: [TEST_TO_EMAIL],
					subject: "비밀번호 재설정 요청",
				})
			);
		});

		it("PasswordResetEmail 컴포넌트를 올바른 props로 전달한다", async () => {
			// Arrange: 성공 응답 설정
			mockEmailsSend.mockResolvedValue({
				data: { id: "email_123" },
				error: null,
			});

			const emailService = createEmailServiceImpl(TEST_API_KEY, TEST_FROM_EMAIL);
			const resetUrl = "https://example.com/reset?token=xyz789";

			// Act: 비밀번호 재설정 이메일 전송
			await emailService.sendPasswordResetEmail(TEST_TO_EMAIL, resetUrl);

			// Assert: React 컴포넌트가 올바른 props로 전달됨
			const callArgs = mockEmailsSend.mock.calls[0][0];
			expect(callArgs.react).toEqual({
				type: "PasswordResetEmail",
				props: { resetUrl },
			});
		});
	});
});
