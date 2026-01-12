import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useFetcher,
	useOutletContext,
} from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { User } from "~/db/schema";
import {
	AuthError,
	DuplicateEmailError,
	UserCreationError,
} from "~/features/auth/errors";
import { calculatePasswordStrength } from "~/features/auth/lib/password-strength";
import {
	type AuthActionResponse,
	type SignupFormData,
	signupSchema,
} from "~/features/auth/types";
import { signUpWithCredentials } from "~/lib/auth.server";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/sign-up";

/**
 * 회원가입 페이지
 *
 * - auth/layout.tsx의 getOptionalAuth로 user 정보를 이미 로드함
 * - useOutletContext로 user 정보 가져오기
 * - 로그인 상태: "이미 로그인됨" UI 표시 + 대시보드 이동 옵션
 * - 미로그인 상태: 회원가입 폼 표시
 * - 성공 시: /auth/signin?message=email-verification-sent로 리다이렉트
 */
export const meta: Route.MetaFunction = () => [
	{ title: "회원가입 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 회원가입 처리
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
	const name = formData.get("name") as string | null;
	const email = formData.get("email") as string | null;
	const password = formData.get("password") as string | null;
	const termsAgreed = formData.get("termsAgreed") === "true";

	// 폼 검증
	const result = signupSchema.safeParse({
		name,
		email,
		password,
		termsAgreed,
	});
	if (!result.success) {
		return { error: "입력값이 올바르지 않습니다." };
	}

	try {
		// 서버 사이드 회원가입
		await signUpWithCredentials({
			request,
			context,
			name: result.data.name,
			email: result.data.email,
			password: result.data.password,
		});

		// 회원가입 성공 → 이메일 인증 메시지와 함께 로그인 페이지로 리다이렉트
		return redirect("/auth/signin?message=email-verification-sent");
	} catch (error) {
		// 중복 이메일 에러
		if (error instanceof DuplicateEmailError) {
			return { error: error.message };
		}

		// 사용자 생성 실패 에러
		if (error instanceof UserCreationError) {
			return { error: error.message };
		}

		// 기타 인증 관련 에러
		if (error instanceof AuthError) {
			return { error: error.message };
		}

		// 일반 에러 (Better-auth 내부 에러 등)
		const errorMessage =
			error instanceof Error ? error.message : "회원가입에 실패했습니다.";
		return { error: errorMessage };
	}
};

export default function SignUp() {
	const { user } = useOutletContext<{ user: User | null }>();
	const fetcher = useFetcher<typeof action>();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			termsAgreed: false,
		},
	});

	const isSubmitting = fetcher.state === "submitting";

	// 비밀번호 실시간 감지 및 강도 계산
	const password = form.watch("password");
	const passwordStrength = password
		? calculatePasswordStrength(password)
		: null;

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

					<CardContent>
						<Button asChild className="w-full">
							<Link to="/dashboard">대시보드로 이동</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 미로그인 상태: 회원가입 폼
	const onSubmit = (data: SignupFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>회원가입</CardTitle>
					<CardDescription>
						새로운 계정을 만들어 서비스를 시작하세요
					</CardDescription>
				</CardHeader>

				<FormComponent {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							{/* 에러 메시지 */}
							{fetcher.data?.error && (
								<Alert variant="destructive">
									<AlertDescription>{fetcher.data.error}</AlertDescription>
								</Alert>
							)}

							{/* 이름 필드 */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>이름</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
										<FormLabel>비밀번호</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? "text" : "password"}
													{...field}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>

										{/* 비밀번호 강도 표시기 */}
										{passwordStrength && (
											<div className="space-y-1">
												<div className="flex gap-1">
													<div
														className={cn(
															"h-1 flex-1 rounded bg-muted",
															passwordStrength.score > 0 && "bg-destructive",
														)}
													/>
													<div
														className={cn(
															"h-1 flex-1 rounded bg-muted",
															passwordStrength.score >= 40 && "bg-orange-500",
														)}
													/>
													<div
														className={cn(
															"h-1 flex-1 rounded bg-muted",
															passwordStrength.score >= 70 && "bg-green-500",
														)}
													/>
												</div>
												<p className="text-xs text-muted-foreground">
													비밀번호 강도: {passwordStrength.message}
												</p>
											</div>
										)}

										<FormDescription>
											최소 8자 이상, 대소문자와 숫자를 포함해주세요
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 약관 동의 체크박스 */}
							<FormField
								control={form.control}
								name="termsAgreed"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												<Link
													to="/terms"
													className="text-primary hover:underline"
													target="_blank"
												>
													이용약관
												</Link>
												{" "}및{" "}
												<Link
													to="/privacy"
													className="text-primary hover:underline"
													target="_blank"
												>
													개인정보처리방침
												</Link>
												에 동의합니다
											</FormLabel>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							{/* 회원가입 버튼 */}
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "회원가입 중..." : "회원가입"}
							</Button>
						</CardContent>

						{/* 로그인 링크 */}
						<CardFooter className="flex justify-center">
							<p className="text-sm text-muted-foreground">
								이미 계정이 있으신가요?{" "}
								<Link to="/auth/signin" className="text-primary hover:underline">
									로그인
								</Link>
							</p>
						</CardFooter>
					</form>
				</FormComponent>
			</Card>
		</div>
	);
}
