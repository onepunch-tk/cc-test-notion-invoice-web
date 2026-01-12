import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { signOut } from "~/lib/auth-helpers.server";

/**
 * 로그아웃 라우트
 *
 * POST 요청만 받아서 로그아웃 처리
 */
export const action = async ({ request, context }: ActionFunctionArgs) => {
	await signOut({ request, context });
	return redirect("/");
};
