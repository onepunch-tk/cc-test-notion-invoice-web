import { Form, Link, useActionData } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "@/lib/email.server";
import type { Route } from "./+types/forgot-password";

/**
 * 비밀번호 찾기 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 찾기 - Claude RR7 Starterkit" },
];

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const email = formData.get("email") as string;

	const env = context.cloudflare.env;

	try {
		// 임시 토큰 생성 (실제로는 DB에 저장하고 Better-auth API 사용)
		const token = crypto.randomUUID();

		// 비밀번호 재설정 이메일 전송
		await sendPasswordResetEmail(email, token, env.BASE_URL);

		return {
			success: "비밀번호 재설정 이메일이 전송되었습니다.",
		};
	} catch (error) {
		return {
			error:
				error instanceof Error ? error.message : "이메일 전송에 실패했습니다.",
		};
	}
};

export default function ForgotPassword() {
	const actionData = useActionData<typeof action>();

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>비밀번호 찾기</CardTitle>
				<CardDescription>
					이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다
				</CardDescription>
			</CardHeader>

			<Form method="post">
				<CardContent className="space-y-4">
					{actionData?.error && (
						<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							{actionData.error}
						</div>
					)}
					{actionData?.success && (
						<div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
							{actionData.success}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="email">이메일</Label>
						<Input id="email" name="email" type="email" required />
					</div>

					<Button type="submit" className="w-full">
						재설정 링크 전송
					</Button>
				</CardContent>

				<CardFooter className="flex justify-center">
					<Link
						to="/auth/login"
						className="text-sm text-primary hover:underline"
					>
						로그인으로 돌아가기
					</Link>
				</CardFooter>
			</Form>
		</Card>
	);
}
