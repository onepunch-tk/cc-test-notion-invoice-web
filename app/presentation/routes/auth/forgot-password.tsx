import type { ActionFunctionArgs } from "react-router";
import { Form, Link, useActionData } from "react-router";
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
import { type AuthActionResponse, forgotPasswordSchema } from "~/domain/auth";
import { requestPasswordReset } from "~/infrastructure/external/better-auth";
import { validateFormData } from "~/shared/lib/form-helpers";
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
 */
export const action = async ({
	request,
	context,
}: ActionFunctionArgs): Promise<AuthActionResponse> => {
	if (request.method !== "POST") {
		return { error: "POST 요청만 허용됩니다." };
	}

	const formData = await request.formData();

	// Zod 검증
	const validation = validateFormData(forgotPasswordSchema, formData);
	if (!validation.success) {
		return { errors: validation.errors };
	}

	try {
		// 서버 사이드 비밀번호 재설정 요청
		await requestPasswordReset({
			request,
			context,
			email: validation.data.email,
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
	const actionData = useActionData<typeof action>();

	// 성공 상태: 안내 메시지 표시
	if (actionData?.success === true) {
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

				<Form method="post">
					<CardContent className="space-y-4">
						{/* 일반 에러 메시지 */}
						{actionData?.error && (
							<p className="text-sm text-destructive">{actionData.error}</p>
						)}

						{/* 이메일 필드 */}
						<FormField
							name="email"
							label="이메일"
							type="email"
							required
							errors={actionData?.errors?.email?._errors}
						/>

						{/* 전송 버튼 */}
						<SubmitButton className="w-full" loadingText="전송 중...">
							재설정 링크 전송
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
