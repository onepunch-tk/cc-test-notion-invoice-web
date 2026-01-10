import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createAuthInstance } from "@/lib/auth.server";

/**
 * 로그아웃 라우트
 *
 * POST 요청만 받아서 로그아웃 처리
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	const env = context.cloudflare?.env;

	if (!env?.DATABASE_URL || !env?.BASE_URL || !env?.BETTER_AUTH_SECRET) {
		throw new Error("환경 변수가 설정되지 않았습니다.");
	}

	const auth = createAuthInstance(
		env.DATABASE_URL,
		env.BASE_URL,
		env.GITHUB_CLIENT_ID,
		env.GITHUB_CLIENT_SECRET,
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET,
		env.KAKAO_CLIENT_ID,
		env.KAKAO_CLIENT_SECRET,
	);

	await auth.api.signOut({ headers: request.headers });

	return redirect("/");
};
