import { zodResolver } from "@hookform/resolvers/zod";
import { Github, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useFetcher,
	useOutletContext,
	useSearchParams,
} from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
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
	Form as FormComponent,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { User } from "~/db/schema";
import {
	type AuthActionResponse,
	type LoginFormData,
	loginSchema,
} from "~/features/auth/types";
import { signInWithCredentials } from "~/lib/auth.server";
import type { Route } from "./+types/sign-in";

/**
 * 로그인 페이지
 *
 * - auth/layout.tsx의 getOptionalAuth로 user 정보를 이미 로드함
 * - useOutletContext로 user 정보 가져오기
 * - 로그인 상태: "이미 로그인됨" UI 표시 + 대시보드 이동 / 다른 계정 로그인 옵션
 * - 미로그인 상태: 로그인 폼 표시
 */
export const meta: Route.MetaFunction = () => [
	{ title: "로그인 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 로그인 처리
 *
 * useFetcher와 함께 작동하여 폼 제출을 처리
 */
export const action = async ({
	request,
	context,
}: ActionFunctionArgs): Promise<AuthActionResponse | Response> => {
	if (request.method !== "POST") {
		return { error: "POST 요청만 허용됩니다." };
	}

	const formData = await request.formData();
	const email = formData.get("email") as string | null;
	const password = formData.get("password") as string | null;

	// 폼 검증
	const result = loginSchema.safeParse({ email, password });
	if (!result.success) {
		return { error: "이메일과 비밀번호를 입력해주세요." };
	}

	try {
		// 서버 사이드 로그인
		await signInWithCredentials({
			request,
			context,
			email: result.data.email,
			password: result.data.password,
		});

		// redirectTo 파라미터 처리
		const url = new URL(request.url);
		const redirectTo = url.searchParams.get("redirectTo");

		// Open Redirect 방지: 내부 URL만 허용
		const isInternalUrl =
			redirectTo?.startsWith("/") && !redirectTo.startsWith("//");
		const destination = isInternalUrl && redirectTo ? redirectTo : "/dashboard";

		return redirect(destination);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "로그인에 실패했습니다.";
		return { error: errorMessage };
	}
};

export default function SignIn() {
	const { user } = useOutletContext<{ user: User | null }>();
	const fetcher = useFetcher<typeof action>();
	const [searchParams] = useSearchParams();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const isSubmitting = fetcher.state === "submitting";

	// 로그인 상태: "이미 로그인됨" UI 표시
	if (user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>이미 로그인되어 있습니다</CardTitle>
						<CardDescription>
							{user.name}님으로 로그인되어 있습니다.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<Button asChild className="w-full">
							<Link to="/dashboard">대시보드로 이동</Link>
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

						{/* 로그아웃 폼 - 다른 계정으로 로그인 */}
						<Form method="post" action="/auth/signout">
							<Button type="submit" variant="outline" className="w-full">
								<LogOut className="mr-2 h-4 w-4" />
								다른 계정으로 로그인
							</Button>
						</Form>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 미로그인 상태: 로그인 폼
	const onSubmit = (data: LoginFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>로그인</CardTitle>
				<CardDescription>계정에 로그인하여 서비스를 이용하세요</CardDescription>
			</CardHeader>

			<FormComponent {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						{/* 회원가입 성공 메시지 */}
						{searchParams.get("message") === "email-verification-sent" && (
							<Alert>
								<AlertDescription>
									회원가입이 완료되었습니다. 이메일을 확인하여 인증을
									완료해주세요.
								</AlertDescription>
							</Alert>
						)}

						{/* 에러 메시지 */}
						{fetcher.data?.error && (
							<Alert variant="destructive">
								<AlertDescription>{fetcher.data.error}</AlertDescription>
							</Alert>
						)}

						{/* 이메일 필드 */}
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

						{/* 비밀번호 필드 */}
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

						{/* 로그인 버튼 */}
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "로그인 중..." : "로그인"}
						</Button>

						{/* 구분선 */}
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

						{/* GitHub OAuth 로그인 */}
						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={() => {
								// Better-auth API 엔드포인트로 직접 이동
								const callbackURL = `${new URL(window.location.href).origin}/dashboard`;
								window.location.href = `/auth/api/sign-in/social/github?callbackURL=${encodeURIComponent(callbackURL)}`;
							}}
						>
							<Github className="mr-2 h-4 w-4" />
							GitHub로 로그인
						</Button>
					</CardContent>

					{/* 회원가입 링크 */}
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							계정이 없으신가요?{" "}
							<Link to="/auth/signup" className="text-primary hover:underline">
								회원가입
							</Link>
						</p>
					</CardFooter>
				</form>
			</FormComponent>
			</Card>
		</div>
	);
}
