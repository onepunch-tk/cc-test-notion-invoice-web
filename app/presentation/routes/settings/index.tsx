import { useEffect, useState } from "react";
import { Form } from "react-router";
import { toast } from "sonner";
import { changePasswordSchema } from "~/domain/auth";
import { updateProfileSchema } from "~/domain/user";
import { FormField, SubmitButton } from "~/presentation/components/forms";
import { Button } from "~/presentation/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/presentation/components/ui/card";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/presentation/components/ui/select";
import { Switch } from "~/presentation/components/ui/switch";
import { Textarea } from "~/presentation/components/ui/textarea";
import { getAuthErrorMessage } from "~/presentation/lib/error-handler";
import { validateFormData } from "~/presentation/lib/form-helpers";
import type { Route } from "./+types/index";

/**
 * 설정 페이지 메타
 */
export const meta: Route.MetaFunction = () => [
	{ title: "설정 - Claude RR7 Starterkit" },
];

/**
 * 다중 폼 처리 액션
 * - updateProfile: 프로필 업데이트
 * - changePassword: 비밀번호 변경
 */
export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const actionType = formData.get("_action") as string;

	// 프로필 업데이트
	if (actionType === "updateProfile") {
		const validation = validateFormData(updateProfileSchema, formData);
		if (!validation.success) {
			return { profileErrors: validation.errors };
		}

		try {
			// TODO: 프로필 업데이트 로직 (DB 저장)
			return { profileSuccess: "프로필이 성공적으로 업데이트되었습니다." };
		} catch (error) {
			console.error("프로필 업데이트 실패:", error);
			const errorMessage = getAuthErrorMessage(
				error,
				"프로필 업데이트에 실패했습니다.",
			);
			return { profileError: errorMessage };
		}
	}

	// 비밀번호 변경
	if (actionType === "changePassword") {
		const validation = validateFormData(changePasswordSchema, formData);
		if (!validation.success) {
			return { passwordErrors: validation.errors };
		}

		try {
			await context.container.authService.changePassword(
				validation.data.currentPassword,
				validation.data.newPassword,
				true,
				request.headers,
			);

			return { passwordSuccess: "비밀번호가 성공적으로 변경되었습니다." };
		} catch (error) {
			console.error("비밀번호 변경 실패:", error);

			const errorMessage = getAuthErrorMessage(
				error,
				"비밀번호 변경에 실패했습니다.",
			);

			return { passwordError: errorMessage };
		}
	}

	return { error: "올바르지 않은 요청입니다." };
};

/**
 * 설정 페이지
 * - 프로필 정보 설정
 * - 비밀번호 변경
 * - 2단계 인증 (미구현)
 */
export default function Settings({ actionData }: Route.ComponentProps) {
	// 클라이언트 상태로 관리
	const [language, setLanguage] = useState<"ko" | "en" | "ja">("ko");
	const [notifications, setNotifications] = useState(true);
	const [bio, setBio] = useState("");

	// 성공 메시지는 sonner로 표시
	useEffect(() => {
		if (actionData?.profileSuccess) {
			toast.success(actionData.profileSuccess);
		}
		if (actionData?.passwordSuccess) {
			toast.success(actionData.passwordSuccess);
		}
	}, [actionData?.profileSuccess, actionData?.passwordSuccess]);

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div>
				<h1 className="text-3xl font-bold">설정</h1>
				<p className="text-muted-foreground">
					계정 및 프로필 정보를 관리하세요
				</p>
			</div>

			{/* 프로필 정보 카드 */}
			<Card>
				<CardHeader>
					<CardTitle>프로필 정보</CardTitle>
					<CardDescription>
						공개 프로필에 표시될 정보를 설정하세요
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" className="space-y-6">
						<input type="hidden" name="_action" value="updateProfile" />

						{/* 일반 에러 메시지 */}
						{actionData?.profileError && (
							<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
								{actionData.profileError}
							</div>
						)}

						<FormField
							name="fullName"
							label="이름"
							type="text"
							required
							errors={actionData?.profileErrors?.fullName?._errors}
						/>

						<FormField
							name="email"
							label="이메일"
							type="email"
							required
							errors={actionData?.profileErrors?.email?._errors}
						/>

						{/* Textarea - 클라이언트 상태로 관리 */}
						<div className="space-y-2">
							<Label htmlFor="bio">자기소개</Label>
							<Textarea
								id="bio"
								name="bio"
								rows={4}
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								maxLength={500}
							/>
							<p className="text-sm text-muted-foreground">{bio.length}/500</p>
							{actionData?.profileErrors?.bio?._errors && (
								<p className="text-sm text-destructive">
									{actionData.profileErrors.bio._errors[0]}
								</p>
							)}
						</div>

						{/* Select - hidden input + 클라이언트 상태 */}
						<div className="space-y-2">
							<Label htmlFor="language">언어</Label>
							<input type="hidden" name="language" value={language} />
							<Select
								value={language}
								onValueChange={(value) =>
									setLanguage(value as "ko" | "en" | "ja")
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ko">한국어</SelectItem>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="ja">日本語</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Switch - hidden input + 클라이언트 상태 */}
						<div className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<Label className="text-base">알림 수신</Label>
								<p className="text-sm text-muted-foreground">
									이메일 알림을 받으시겠습니까?
								</p>
							</div>
							<input
								type="hidden"
								name="notifications"
								value={notifications ? "on" : "off"}
							/>
							<Switch
								checked={notifications}
								onCheckedChange={setNotifications}
							/>
						</div>

						<SubmitButton>변경사항 저장</SubmitButton>
					</Form>
				</CardContent>
			</Card>

			{/* 비밀번호 변경 카드 */}
			<Card>
				<CardHeader>
					<CardTitle>비밀번호 변경</CardTitle>
					<CardDescription>
						계정 보안을 위해 주기적으로 비밀번호를 변경하세요
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" className="space-y-4">
						<input type="hidden" name="_action" value="changePassword" />

						{/* 일반 에러 메시지 */}
						{actionData?.passwordError && (
							<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
								{actionData.passwordError}
							</div>
						)}

						<FormField
							name="currentPassword"
							label="현재 비밀번호"
							type="password"
							required
							errors={actionData?.passwordErrors?.currentPassword?._errors}
						/>

						<FormField
							name="newPassword"
							label="새 비밀번호"
							type="password"
							required
							errors={actionData?.passwordErrors?.newPassword?._errors}
						/>

						<FormField
							name="newPasswordConfirm"
							label="새 비밀번호 확인"
							type="password"
							required
							errors={actionData?.passwordErrors?.newPasswordConfirm?._errors}
						/>

						<SubmitButton loadingText="변경 중...">비밀번호 변경</SubmitButton>
					</Form>
				</CardContent>
			</Card>

			{/* 2단계 인증 카드 */}
			<Card>
				<CardHeader>
					<CardTitle>2단계 인증</CardTitle>
					<CardDescription>
						계정 보안을 강화하기 위해 2단계 인증을 활성화하세요
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						2단계 인증 기능은 아직 구현되지 않았습니다.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
