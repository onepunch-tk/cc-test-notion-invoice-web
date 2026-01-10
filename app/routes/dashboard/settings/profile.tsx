import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Route } from "./+types/profile";

/**
 * 프로필 폼 스키마
 */
const profileSchema = z.object({
	fullName: z.string().min(1, "이름을 입력해주세요"),
	email: z.string().email("올바른 이메일 형식이 아닙니다"),
	bio: z.string().max(500, "자기소개는 500자 이내로 작성해주세요").optional(),
	language: z.enum(["ko", "en", "ja"]),
	notifications: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * 프로필 설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "프로필 설정 - Claude RR7 Starterkit" },
];

export const action = async ({ request, context }: Route.ActionArgs) => {
	const formData = await request.formData();
	const data = {
		fullName: formData.get("fullName") as string,
		email: formData.get("email") as string,
		bio: (formData.get("bio") as string) || undefined,
		language: formData.get("language") as "ko" | "en" | "ja",
		notifications: formData.get("notifications") === "on",
	};

	const result = profileSchema.safeParse(data);
	if (!result.success) {
		return { error: result.error.issues[0].message };
	}

	// TODO: 프로필 업데이트 로직
	return { success: "프로필이 성공적으로 업데이트되었습니다." };
};

export default function ProfileSettings({ actionData }: Route.ComponentProps) {
	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullName: "",
			email: "",
			bio: "",
			language: "ko",
			notifications: true,
		},
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">프로필 설정</h1>
				<p className="text-muted-foreground">프로필 정보를 관리하세요</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>프로필 정보</CardTitle>
					<CardDescription>
						공개 프로필에 표시될 정보를 설정하세요
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form method="post" className="space-y-6">
							{actionData?.error && (
								<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
									{actionData.error}
								</div>
							)}
							{actionData?.success && (
								<div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
									{actionData.success}
								</div>
							)}

							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>이름</FormLabel>
										<FormControl>
											<Input {...field} />
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
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>자기소개</FormLabel>
										<FormControl>
											<Textarea rows={4} {...field} />
										</FormControl>
										<FormDescription>
											{field.value?.length ?? 0}/500
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>언어</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ko">한국어</SelectItem>
												<SelectItem value="en">English</SelectItem>
												<SelectItem value="ja">日本語</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="notifications"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">알림 수신</FormLabel>
											<FormDescription>
												이메일 알림을 받으시겠습니까?
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<Button type="submit">변경사항 저장</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
