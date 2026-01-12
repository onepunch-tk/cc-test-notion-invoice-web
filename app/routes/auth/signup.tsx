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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type SignupFormData, signupSchema } from "~/features/auth/types";
import { signUp } from "~/lib/auth.client";
import { requireGuest } from "~/middleware/guest.middleware";
import type { Route } from "./+types/signup";

/**
 * 회원가입 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "회원가입 - Claude RR7 Starterkit" },
];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	await requireGuest({ request, context });
	return {};
};

// action 함수는 더 이상 사용되지 않으므로 제거

export default function Signup() {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: SignupFormData) => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await signUp(data.email, data.password, data.name);
			setSuccess("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
			form.reset();
		} catch (err) {
			setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>회원가입</CardTitle>
				<CardDescription>
					새로운 계정을 만들어 서비스를 시작하세요
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>이름</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>비밀번호</FormLabel>
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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "회원가입 중..." : "회원가입"}
						</Button>
					</CardContent>

					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							이미 계정이 있으신가요?{" "}
							<Link to="/auth/login" className="text-primary hover:underline">
								로그인
							</Link>
						</p>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
