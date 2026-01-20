import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

/**
 * Better-auth API 핸들러 (Catch-all)
 *
 * auth/api/* 경로의 모든 요청을 Better-auth에 위임
 * Better-auth가 자동으로 다음 엔드포인트들을 처리:
 * - POST auth/api/sign-up
 * - POST auth/api/sign-in
 * - POST auth/api/sign-out
 * - GET auth/api/session
 * - POST auth/api/verify-email
 * - POST auth/api/send-verification-email
 * - POST auth/api/forget-password
 * - POST auth/api/reset-password
 * - GET auth/api/callback/github
 * - GET auth/api/callback/google
 * - 기타 모든 Better-auth 엔드포인트
 */

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	return context.container.betterAuthHandler(request);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	return context.container.betterAuthHandler(request);
};
