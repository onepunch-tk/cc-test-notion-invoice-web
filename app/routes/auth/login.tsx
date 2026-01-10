import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	type LoginFormData,
	loginSchema,
} from "~/features/auth/types";
import { requireGuest } from "~/middleware/guest.middleware";
import type { Route } from "./+types/login";

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

// action 함수는 더 이상 사용되지 않으므로 제거

export default function Login() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			// 이메일/비밀번호 로그인 API 호출
			const response = await fetch("/api/auth/sign-in/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});

			if (!response.ok) {
				const errorData = (await response.json()) as { message?: string };
				throw new Error(errorData.message || "로그인에 실패했습니다.");
			}

			// redirectTo 파라미터가 있으면 해당 페이지로, 없으면 대시보드로
			const redirectTo = searchParams.get("redirectTo") || "/dashboard";
			navigate(redirectTo);
		} catch (err) {
			setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOAuthLogin = (provider: string) => {
		// OAuth 로그인 처리
		const redirectUrl = `/api/auth/callback/${provider}`;
		window.location.href = redirectUrl;
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>로그인</CardTitle>
				<CardDescription>계정에 로그인하여 서비스를 이용하세요</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						{error && (
							<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>이메일</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>비밀번호</FormLabel>
										<Link
											to="/auth/forgot-password"
											className="text-sm text-primary hover:underline"
										>
											비밀번호를 잊으셨나요?
										</Link>
									</div>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "로그인 중..." : "로그인"}
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
							type="button"
							variant="outline"
							className="w-full"
							onClick={() => handleOAuthLogin("github")}
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
				</form>
			</Form>
		</Card>
	);
}
