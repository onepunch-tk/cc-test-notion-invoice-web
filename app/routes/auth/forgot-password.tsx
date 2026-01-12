import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionFunctionArgs } from "react-router";
import { Link, useFetcher } from "react-router";
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	type AuthActionResponse,
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "~/features/auth/types";
import { requestPasswordReset } from "~/lib/auth.server";
import type { Route } from "./+types/forgot-password";

/**
 * 비밀번호 찾기 페이지
 *
 * - 로그인 여부와 관계없이 접근 가능 (공개 페이지)
 * - 이메일 주소를 입력하면 비밀번호 재설정 링크 전송
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 찾기 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 비밀번호 재설정 요청 처리
 *
 * useFetcher와 함께 작동하여 폼 제출을 처리
 */
export const action = async ({
	request,
	context,
}: ActionFunctionArgs): Promise<AuthActionResponse> => {
	if (request.method !== "POST") {
		return { error: "POST 요청만 허용됩니다." };
	}

	const formData = await request.formData();
	const email = formData.get("email") as string | null;

	// 폼 검증
	const result = forgotPasswordSchema.safeParse({ email });
	if (!result.success) {
		return { error: "유효한 이메일을 입력해주세요." };
	}

	try {
		// 서버 사이드 비밀번호 재설정 요청
		await requestPasswordReset({
			request,
			context,
			email: result.data.email,
		});

		// 성공: 성공 메시지 반환 (보안상 이메일 노출하지 않음)
		return { success: true };
	} catch (error) {
		// 보안상 이유로 실제 오류와 관계없이 같은 메시지 반환
		// (이메일 존재 여부 노출 방지)
		console.error("비밀번호 재설정 요청 실패:", error);
		return { success: true };
	}
};

export default function ForgotPassword() {
	const fetcher = useFetcher<typeof action>();

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const isSubmitting = fetcher.state === "submitting";
	const isSuccess = fetcher.data?.success === true;

	const onSubmit = (data: ForgotPasswordFormData) => {
		fetcher.submit(data, { method: "post" });
	};

	// 성공 상태: 안내 메시지 표시
	if (isSuccess) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>이메일 전송 완료</CardTitle>
						<CardDescription>
							비밀번호 재설정 링크가 이메일로 전송되었습니다.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Alert>
							<AlertDescription>
								이메일의 링크를 클릭하여 새로운 비밀번호를 설정해주세요. 링크는
								24시간 동안 유효합니다.
							</AlertDescription>
						</Alert>
					</CardContent>

					<CardFooter className="flex justify-center">
						<Link
							to="/auth/signin"
							className="text-sm text-primary hover:underline"
						>
							로그인으로 돌아가기
						</Link>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// 입력 상태: 폼 표시
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>비밀번호 찾기</CardTitle>
					<CardDescription>
						이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다
					</CardDescription>
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

							{/* 전송 버튼 */}
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "전송 중..." : "재설정 링크 전송"}
							</Button>
						</CardContent>

						{/* 로그인 링크 */}
						<CardFooter className="flex justify-center">
							<Link
								to="/auth/signin"
								className="text-sm text-primary hover:underline"
							>
								로그인으로 돌아가기
							</Link>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
