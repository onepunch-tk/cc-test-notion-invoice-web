import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "~/features/auth/types";
import { forgotPassword } from "~/lib/auth.client";
import type { Route } from "./+types/forgot-password";

/**
 * 비밀번호 찾기 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "비밀번호 찾기 - Claude RR7 Starterkit" },
];

// loader는 그대로 유지하되, action은 제거

export default function ForgotPassword() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await forgotPassword(data.email);
			setSuccess("비밀번호 재설정 이메일이 전송되었습니다.");
			form.reset();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "이메일 전송에 실패했습니다.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
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
						{error && (
							<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						{success && (
							<div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
								{success}
							</div>
						)}

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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "전송 중..." : "재설정 링크 전송"}
						</Button>
					</CardContent>

					<CardFooter className="flex justify-center">
						<Link
							to="/auth/login"
							className="text-sm text-primary hover:underline"
						>
							로그인으로 돌아가기
						</Link>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
