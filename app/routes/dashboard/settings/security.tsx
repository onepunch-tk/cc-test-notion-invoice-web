import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
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
	type ChangePasswordFormData,
	changePasswordSchema,
} from "~/features/auth/types";
import { changePassword } from "~/lib/auth.client";
import type { Route } from "./+types/security";

/**
 * 보안 설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "보안 설정 - Claude RR7 Starterkit" },
];

export default function SecuritySettings() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const navigate = useNavigate();

	const form = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			newPasswordConfirm: "",
		},
	});

	const onSubmit = async (data: ChangePasswordFormData) => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await changePassword(data.currentPassword, data.newPassword, true);
			setSuccess("비밀번호가 성공적으로 변경되었습니다.");
			form.reset();

			// 비밀번호 변경 후 다른 세션이 무효화되었으므로 재로그인 권장
			setTimeout(() => {
				navigate("/auth/login");
			}, 2000);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "비밀번호 변경에 실패했습니다.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">보안 설정</h1>
				<p className="text-muted-foreground">
					계정 보안을 강화하고 비밀번호를 관리하세요
				</p>
			</div>

			<div className="space-y-4">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>

					{success && (
						<div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
							{success}
						</div>
					)}

					{error && (
						<div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>현재 비밀번호</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>새 비밀번호</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPasswordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel>새 비밀번호 확인</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={isLoading}>
								{isLoading ? "변경 중..." : "비밀번호 변경"}
							</Button>
						</form>
					</Form>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h2 className="text-xl font-semibold">2단계 인증</h2>
					<p className="mt-2 text-muted-foreground">
						계정 보안을 강화하기 위해 2단계 인증을 활성화하세요.
					</p>
				</div>
			</div>
		</div>
	);
}
