import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useFetcher, useSearchParams } from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	type AuthActionResponse,
	type ResetPasswordFormData,
	resetPasswordSchema,
} from "~/features/auth/types";
import { resetPasswordWithToken } from "~/lib/auth.server";
import type { Route } from "./+types/reset-password";

/**
 * 비밀번호 재설정 페이지
 *
 * - 이메일의 재설정 링크에서 token 파라미터 받음
 * - token이 없으면 유효하지 않은 링크 메시지 표시
 * - 새로운 비밀번호 입력 후 서버 사이드에서 재설정 처리
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 재설정 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 비밀번호 재설정 처리
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
	const password = formData.get("password") as string | null;
	const passwordConfirm = formData.get("passwordConfirm") as string | null;
	const token = formData.get("token") as string | null;

	// token 검증
	if (!token) {
		return { error: "유효하지 않은 토큰입니다." };
	}

	// 비밀번호 검증
	const result = resetPasswordSchema.safeParse({
		password,
		passwordConfirm,
		token,
	});

	if (!result.success) {
		const errorMessage = result.error.message || "입력값이 올바르지 않습니다.";
		return { error: errorMessage };
	}

	try {
		// 서버 사이드 비밀번호 재설정
		await resetPasswordWithToken({
			request,
			context,
			newPassword: result.data.password,
			token: result.data.token,
		});

		// 성공: 로그인 페이지로 리다이렉트
		return redirect("/auth/signin?message=password-reset-success");
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "비밀번호 재설정에 실패했습니다.";
		return { error: errorMessage };
	}
};

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const fetcher = useFetcher<typeof action>();
	const token = searchParams.get("token");

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			passwordConfirm: "",
			token: token || "",
		},
	});

	const isSubmitting = fetcher.state === "submitting";

	// token이 없으면 유효하지 않은 링크 표시
	if (!token) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>유효하지 않은 링크</CardTitle>
						<CardDescription>
							비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	// 폼 제출
	const onSubmit = (data: ResetPasswordFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>비밀번호 재설정</CardTitle>
					<CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
				</CardHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							{/* 에러 메시지 */}
							{fetcher.data?.error && (
								<Alert variant="destructive">
									<AlertDescription>{fetcher.data.error}</AlertDescription>
								</Alert>
							)}

							{/* 새 비밀번호 필드 */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>새 비밀번호</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormDescription>
											최소 8자 이상, 대소문자와 숫자를 포함해주세요
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 비밀번호 확인 필드 */}
							<FormField
								control={form.control}
								name="passwordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>비밀번호 확인</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* 재설정 버튼 */}
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "재설정 중..." : "비밀번호 재설정"}
							</Button>
						</CardContent>
					</form>
				</Form>
			</Card>
		</div>
	);
}
