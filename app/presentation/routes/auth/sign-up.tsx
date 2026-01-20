import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import {
	Form,
	Link,
	redirect,
	useActionData,
	useOutletContext,
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
import { Checkbox } from "~/presentation/components/ui/checkbox";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import type { User } from "~/infrastructure/persistence/schema";
import {
	type AuthActionResponse,
	signupSchema,
	AuthError,
	DuplicateEmailError,
	UserCreationError,
} from "~/domain/auth";
import { calculatePasswordStrength } from "~/shared/lib/password-strength";
import { signUpWithCredentials } from "~/infrastructure/external/better-auth";
import { validateFormData } from "~/shared/lib/form-helpers";
import { cn } from "~/shared/lib/utils";
import type { Route } from "./+types/sign-up";

/**
 * 회원가입 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "회원가입 - Claude RR7 Starterkit" },
];

/**
 * 서버 사이드 회원가입 처리
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
	const validation = validateFormData(signupSchema, formData);
	if (!validation.success) {
		return { errors: validation.errors };
	}

	try {
		// 서버 사이드 회원가입
		await signUpWithCredentials({
			request,
			context,
			name: validation.data.name,
			email: validation.data.email,
			password: validation.data.password,
		});

		// 회원가입 성공 → 페이지를 떠나지 않고 성공 메시지 표시
		return {
			success: true,
			message:
				"회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.",
		};
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
	const actionData = useActionData<typeof action>();
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState("");

	// 비밀번호 강도 계산
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
							<Link to="/my/dashboard">대시보드로 이동</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 회원가입 성공 시 성공 메시지 표시
	if (actionData?.success) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>회원가입 완료</CardTitle>
						<CardDescription>
							이메일을 확인하여 계정을 활성화해주세요
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						<Alert>
							<AlertDescription>{actionData.message}</AlertDescription>
						</Alert>

						<div className="text-sm text-muted-foreground space-y-2">
							<p>• 이메일 인증 링크를 클릭하면 자동으로 로그인됩니다.</p>
							<p>• 이메일이 오지 않았다면 스팸 폴더를 확인해주세요.</p>
						</div>

						<Button asChild variant="outline" className="w-full">
							<Link to="/auth/signin">로그인 페이지로 이동</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// 미로그인 상태: 회원가입 폼
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>회원가입</CardTitle>
					<CardDescription>
						새로운 계정을 만들어 서비스를 시작하세요
					</CardDescription>
				</CardHeader>

				<Form method="post">
					<CardContent className="space-y-4">
						{/* 일반 에러 메시지 */}
						{actionData?.error && (
							<Alert variant="destructive">
								<AlertDescription>{actionData.error}</AlertDescription>
							</Alert>
						)}

						{/* 이름 필드 */}
						<FormField
							name="name"
							label="이름"
							type="text"
							required
							placeholder="홍길동"
							errors={actionData?.errors?.name?._errors}
						/>

						{/* 이메일 필드 */}
						<FormField
							name="email"
							label="이메일"
							type="email"
							required
							placeholder="example@email.com"
							errors={actionData?.errors?.email?._errors}
						/>

						{/* 비밀번호 필드 (커스텀 - 강도 표시 및 토글) */}
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className={
									actionData?.errors?.password?._errors
										? "text-destructive"
										: ""
								}
							>
								비밀번호 <span className="text-destructive ml-1">*</span>
							</Label>

							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									placeholder="8자 이상 입력해주세요"
									aria-invalid={!!actionData?.errors?.password?._errors}
									aria-describedby={
										actionData?.errors?.password?._errors
											? "password-error"
											: undefined
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									aria-label={
										showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
									}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>

							{/* 비밀번호 강도 표시 */}
							{passwordStrength && (
								<div className="space-y-1">
									<div className="flex items-center gap-1">
										{[...Array(4)].map((_, i) => (
											<div
												key={i.toString()}
												className={cn(
													"h-1.5 flex-1 rounded-full transition-colors",
													i < passwordStrength.score
														? passwordStrength.colorClass
														: "bg-muted",
												)}
											/>
										))}
									</div>
									<p
										className={cn(
											"text-xs",
											passwordStrength.score >= 3
												? "text-green-600"
												: passwordStrength.score >= 2
													? "text-yellow-600"
													: "text-destructive",
										)}
									>
										강도: {passwordStrength.label}
									</p>
								</div>
							)}

							{actionData?.errors?.password?._errors && (
								<p id="password-error" className="text-sm text-destructive">
									{actionData.errors.password._errors[0]}
								</p>
							)}
						</div>

						{/* 약관 동의 체크박스 */}
						<div className="flex items-start space-x-2">
							<Checkbox
								id="termsAgreed"
								name="termsAgreed"
								required
								aria-describedby="terms-label"
							/>
							<label
								id="terms-label"
								htmlFor="termsAgreed"
								className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								<Link
									to="/terms"
									className="text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									이용약관
								</Link>{" "}
								및{" "}
								<Link
									to="/privacy"
									className="text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									개인정보 처리방침
								</Link>
								에 동의합니다 <span className="text-destructive">*</span>
							</label>
						</div>

						{/* 회원가입 버튼 */}
						<SubmitButton className="w-full" loadingText="가입 중...">
							회원가입
						</SubmitButton>
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
				</Form>
			</Card>
		</div>
	);
}
