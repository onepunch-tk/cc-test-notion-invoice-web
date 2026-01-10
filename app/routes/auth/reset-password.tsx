import { redirect, Form, useActionData, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Route } from "./+types/reset-password";

/**
 * 비밀번호 재설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 재설정 - Claude RR7 Starterkit" },
];

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const password = formData.get("password") as string;
	const passwordConfirm = formData.get("passwordConfirm") as string;
	const token = formData.get("token") as string;

	if (!token) {
		return { error: "유효하지 않은 재설정 링크입니다." };
	}

	if (password !== passwordConfirm) {
		return { error: "비밀번호가 일치하지 않습니다." };
	}

	try {
		// Better-auth API를 통한 비밀번호 재설정
		const response = await fetch(`${context.cloudflare.env.BASE_URL}/api/auth/reset-password`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ newPassword: password, token }),
		});

		if (!response.ok) {
			const error = await response.json() as { message?: string };
			return { error: error.message || "비밀번호 재설정에 실패했습니다." };
		}

		return redirect("/auth/login");
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "비밀번호 재설정에 실패했습니다.",
		};
	}
};

export default function ResetPassword() {
	const actionData = useActionData<typeof action>();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	if (!token) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>유효하지 않은 링크</CardTitle>
					<CardDescription>
						비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>비밀번호 재설정</CardTitle>
				<CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
			</CardHeader>

			<Form method="post">
				<input type="hidden" name="token" value={token} />
				<CardContent className="space-y-4">
					{actionData?.error && (
						<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							{actionData.error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="password">새 비밀번호</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							minLength={8}
						/>
						<p className="text-xs text-muted-foreground">
							최소 8자 이상, 대소문자와 숫자를 포함해주세요
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="passwordConfirm">비밀번호 확인</Label>
						<Input
							id="passwordConfirm"
							name="passwordConfirm"
							type="password"
							required
							minLength={8}
						/>
					</div>

					<Button type="submit" className="w-full">
						비밀번호 재설정
					</Button>
				</CardContent>
			</Form>
		</Card>
	);
}
