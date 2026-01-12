import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
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
	type ResetPasswordFormData,
	resetPasswordSchema,
} from "~/features/auth/types";
import { resetPassword } from "~/lib/auth.client";
import type { Route } from "./+types/reset-password";

/**
 * 비밀번호 재설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 재설정 - Claude RR7 Starterkit" },
];

// action 함수는 더 이상 사용되지 않으므로 제거

export default function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			passwordConfirm: "",
			token: token || "",
		},
	});

	const onSubmit = async (data: ResetPasswordFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			await resetPassword(data.password, data.token);
			navigate("/auth/login");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "비밀번호 재설정에 실패했습니다.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return (
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>유효하지 않은 링크</CardTitle>
					<CardDescription>
						비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>비밀번호 재설정</CardTitle>
				<CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
			</CardHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						{error && (
							<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}

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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "재설정 중..." : "비밀번호 재설정"}
						</Button>
					</CardContent>
				</form>
			</Form>
		</Card>
	);
}
