import { Link, redirect, Form, useActionData } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { requireGuest } from "@/middleware/guest.middleware";
import { createAuthInstance } from "@/lib/auth.server";
import type { Route } from "./+types/login";
import { Github } from "lucide-react";

/**
 * 로그인 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "로그인 - Claude RR7 Starterkit" },
];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	await requireGuest({ request, context });
	return {};
};

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const provider = formData.get("provider") as string | null;

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

	// OAuth 로그인
	if (provider) {
		if (provider === "github" && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
			const redirectUrl = `${env.BASE_URL}/api/auth/callback/github`;
			return redirect(redirectUrl);
		}
		if (provider === "google" && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
			const redirectUrl = `${env.BASE_URL}/api/auth/callback/google`;
			return redirect(redirectUrl);
		}
		return { error: "지원하지 않는 OAuth 제공자입니다." };
	}

	// 이메일/비밀번호 로그인
	try {
		await auth.api.signInEmail({
			body: { email, password },
		});

		// redirectTo 파라미터가 있으면 해당 페이지로, 없으면 대시보드로
		const url = new URL(request.url);
		const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";
		return redirect(redirectTo);
	} catch (error) {
		return { error: error instanceof Error ? error.message : "로그인에 실패했습니다." };
	}
};

export default function Login() {
	const actionData = useActionData<typeof action>();

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>로그인</CardTitle>
				<CardDescription>
					계정에 로그인하여 서비스를 이용하세요
				</CardDescription>
			</CardHeader>

			<Form method="post">
				<CardContent className="space-y-4">
					{actionData?.error && (
						<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							{actionData.error}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="email">이메일</Label>
						<Input id="email" name="email" type="email" required />
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">비밀번호</Label>
							<Link
								to="/auth/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								비밀번호를 잊으셨나요?
							</Link>
						</div>
						<Input id="password" name="password" type="password" required />
					</div>

					<Button type="submit" className="w-full">
						로그인
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								또는
							</span>
						</div>
					</div>

					<Button
						type="submit"
						name="provider"
						value="github"
						variant="outline"
						className="w-full"
					>
						<Github className="mr-2 h-4 w-4" />
						GitHub로 로그인
					</Button>
				</CardContent>

				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						계정이 없으신가요?{" "}
						<Link to="/auth/signup" className="text-primary hover:underline">
							회원가입
						</Link>
					</p>
				</CardFooter>
			</Form>
		</Card>
	);
}
