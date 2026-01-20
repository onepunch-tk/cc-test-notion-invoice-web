import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createClearSessionHeaders } from "~/features/auth/lib/auth.const";
import { signOut } from "~/features/auth/lib/auth.server";

/**
 * 로그아웃 라우트
 *
 * POST 요청만 받아서 로그아웃 처리
 * Supabase 세션 삭제 후에도 클라이언트가 로그인 상태를 유지하는 문제를 방지하기 위해
 * 세션 쿠키를 명시적으로 삭제
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	// HTTP 메서드 검증 (POST만 허용)
	if (request.method !== "POST") {
		throw new Response("Method not allowed", { status: 405 });
	}

	const headers = createClearSessionHeaders();

	try {
		await signOut({ request, context });
		return redirect("/", { headers });
	} catch (error) {
		console.error("로그아웃 실패:", error);
		// 실패해도 쿠키는 삭제하고 홈으로 리다이렉트 (세션이 이미 만료되었을 수 있음)
		return redirect("/", { headers });
	}
};
