import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useActionData,
	useSearchParams,
} from "react-router";
import { type AuthActionResponse, resetPasswordSchema } from "~/domain/auth";
import { FormField, SubmitButton } from "~/presentation/components/forms";
import { Alert, AlertDescription } from "~/presentation/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/presentation/components/ui/card";
import { getAuthErrorMessage } from "~/presentation/lib/error-handler";
import { validateFormData } from "~/presentation/lib/form-helpers";
import type { Route } from "./+types/reset-password";

/**
 * 비밀번호 재설정 페이지
 *
 * - 이메일로 받은 링크를 통해 접근 (token 파라미터 필수)
 * - token이 없거나 유효하지 않은 경우 에러 메시지 표시
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 재설정 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 비밀번호 재설정 처리
 */
export const action = async ({
	request,
	context,
}: ActionFunctionArgs): Promise<AuthActionResponse | Response> => {
	if (request.method !== "POST") {
		return { error: "POST 요청만 허용됩니다." };
	}

	const formData = await request.formData();

	// Zod 검증
	const validation = validateFormData(resetPasswordSchema, formData);
	if (!validation.success) {
		return { errors: validation.errors };
	}

	try {
		// 서버 사이드 비밀번호 재설정
		await context.container.authService.resetPassword(
			validation.data.newPassword,
			validation.data.token,
			request.headers,
		);

		// 성공: 로그인 페이지로 리다이렉트 (성공 메시지 표시)
		return redirect("/auth/signin?message=password-reset-success");
	} catch (error) {
		console.error("비밀번호 재설정 실패:", error);

		const errorMessage = getAuthErrorMessage(
			error,
			"비밀번호 재설정에 실패했습니다.",
		);

		return { error: errorMessage };
	}
};

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const actionData = useActionData<typeof action>();

	// token이 없는 경우
	if (!token) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>잘못된 접근</CardTitle>
						<CardDescription>
							비밀번호 재설정 링크가 유효하지 않습니다.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Alert variant="destructive">
							<AlertDescription>
								이메일로 받은 링크를 통해 접근해주세요. 링크가 만료되었다면
								비밀번호 찾기를 다시 진행해주세요.
							</AlertDescription>
						</Alert>
					</CardContent>

					<CardFooter className="flex justify-center gap-4">
						<Link
							to="/auth/forgot-password"
							className="text-sm text-primary hover:underline"
						>
							비밀번호 찾기
						</Link>
						<span className="text-sm text-muted-foreground">·</span>
						<Link
							to="/auth/signin"
							className="text-sm text-primary hover:underline"
						>
							로그인
						</Link>
					</CardFooter>
				</Card>
			</div>
		);
	}

	// token이 있는 경우: 폼 표시
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>새 비밀번호 설정</CardTitle>
					<CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
				</CardHeader>

				<Form method="post">
					<CardContent className="space-y-4">
						{/* hidden input: token 전달 */}
						<input type="hidden" name="token" value={token} />

						{/* 일반 에러 메시지 */}
						{actionData?.error && (
							<Alert variant="destructive">
								<AlertDescription>{actionData.error}</AlertDescription>
							</Alert>
						)}

						{/* 새 비밀번호 필드 */}
						<FormField
							name="newPassword"
							label="새 비밀번호"
							type="password"
							required
							placeholder="8자 이상 입력해주세요"
							errors={actionData?.errors?.newPassword?._errors}
						/>

						{/* 새 비밀번호 확인 필드 */}
						<FormField
							name="newPasswordConfirm"
							label="새 비밀번호 확인"
							type="password"
							required
							placeholder="비밀번호를 다시 입력해주세요"
							errors={actionData?.errors?.newPasswordConfirm?._errors}
						/>

						{/* 제출 버튼 */}
						<SubmitButton className="w-full" loadingText="변경 중...">
							비밀번호 변경
						</SubmitButton>
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
				</Form>
			</Card>
		</div>
	);
}
