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
import { createAuthInstance } from "@/lib/auth.server";
import { requireGuest } from "@/middleware/guest.middleware";
import type { Route } from "./+types/signup";

/**
 * 회원가입 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "회원가입 - Claude RR7 Starterkit" },
];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	await requireGuest({ request, context });
	return {};
};

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;

	const env = context.cloudflare.env;
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

	try {
		await auth.api.signUpEmail({
			body: { email, password, name },
		});

		return {
			success: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
		};
	} catch (error) {
		return {
			error:
				error instanceof Error ? error.message : "회원가입에 실패했습니다.",
		};
	}
};

export default function Signup() {
	const actionData = useActionData<typeof action>();

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>회원가입</CardTitle>
				<CardDescription>
					새로운 계정을 만들어 서비스를 시작하세요
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
						<Label htmlFor="name">이름</Label>
						<Input id="name" name="name" type="text" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">이메일</Label>
						<Input id="email" name="email" type="email" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">비밀번호</Label>
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

					<Button type="submit" className="w-full">
						회원가입
					</Button>
				</CardContent>

				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						이미 계정이 있으신가요?{" "}
						<Link to="/auth/login" className="text-primary hover:underline">
							로그인
						</Link>
					</p>
				</CardFooter>
			</Form>
		</Card>
	);
}
