import { Github, LogOut } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useActionData,
	useOutletContext,
	useSearchParams,
} from "react-router";
import { FormField, SubmitButton } from "~/presentation/components/forms";
import { Alert, AlertDescription } from "~/presentation/components/ui/alert";
import { Button } from "~/presentation/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/presentation/components/ui/card";
import { Label } from "~/presentation/components/ui/label";
import type { User } from "~/infrastructure/persistence/schema";
import { type AuthActionResponse, loginSchema } from "~/domain/auth";
import { getAuthErrorMessage } from "~/features/auth/lib/error-handler";
import { signInWithCredentials, signInWithSocials } from "~/features/auth/lib/auth.server";
import { validateFormData } from "~/lib/form-helpers";
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
 */
export const action = async ({
	request,
	context,
}: ActionFunctionArgs): Promise<AuthActionResponse | Response> => {
	if (request.method !== "POST") {
		return { error: "POST 요청만 허용됩니다." };
	}

	const formData = await request.formData();
	const provider = formData.get("provider");

	if (provider) {
		try {
			const {
				headers: responseHeader,
				response: { redirect: canRedirect, url },
			} = await signInWithSocials({
				request,
				context,
				provider: "github",
			});

			if (!canRedirect || !url) {
				return { error: "소셜 로그인 URL을 생성할 수 없습니다." };
			}

			const headers = new Headers();
			for (const cookie of responseHeader.getSetCookie()) {
				headers.append("Set-Cookie", cookie);
			}

			return redirect(url, {
				headers,
			});
		} catch (error) {
			const errorMessage = getAuthErrorMessage(
				error,
				"소셜 로그인에 실패했습니다.",
			);
			return { error: errorMessage };
		}
	}

	// Zod 검증
	const validation = validateFormData(loginSchema, formData);
	if (!validation.success) {
		return { errors: validation.errors };
	}

	try {
		// 로그인 및 Set-Cookie 헤더 받기
		const { setCookie } = await signInWithCredentials({
			request,
			context,
			email: validation.data.email,
			password: validation.data.password,
		});

		// redirectTo 파라미터 확인 (없으면 대시보드로)
		const url = new URL(request.url);
		const redirectTo = url.searchParams.get("redirectTo") || "/my/dashboard";

		// Set-Cookie 헤더를 포함한 리다이렉트
		return redirect(redirectTo, {
			headers: setCookie ? { "Set-Cookie": setCookie } : undefined,
		});
	} catch (error) {
		// 에러 로깅 (디버깅용)
		console.error("로그인 실패:", error);

		// Better-auth 에러를 사용자 친화적인 메시지로 변환
		const errorMessage = getAuthErrorMessage(
			error,
			"로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
		);

		return { error: errorMessage };
	}
};

export default function SignIn() {
	const { user } = useOutletContext<{ user: User | null }>();
	const actionData = useActionData<typeof action>();
	const [searchParams] = useSearchParams();

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
							<Link to="/my/dashboard">대시보드로 이동</Link>
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
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>로그인</CardTitle>
					<CardDescription>
						계정에 로그인하여 서비스를 이용하세요
					</CardDescription>
				</CardHeader>

				<Form method="post">
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

						{/* 비밀번호 필드 */}
						<FormField
							name="password"
							label="비밀번호"
							type="password"
							required
							errors={actionData?.errors?.password?._errors}
						/>

						{/* 비밀번호 찾기 링크 */}
						<div className="flex justify-end -mt-1">
							<Link
								to="/auth/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								비밀번호를 잊으셨나요?
							</Link>
						</div>

						{/* 로그인 버튼 */}
						<SubmitButton className="w-full" loadingText="로그인 중...">
							로그인
						</SubmitButton>

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
				</Form>

				<Form method="post">
					<CardContent className="space-y-4">
						{/* GitHub OAuth 로그인 */}
						<input type="hidden" name="provider" defaultValue="github" />
						<Button type="submit" variant="outline" className="w-full">
							<Github className="mr-2 h-4 w-4" />
							GitHub로 로그인
						</Button>
					</CardContent>
				</Form>
			</Card>
		</div>
	);
}
