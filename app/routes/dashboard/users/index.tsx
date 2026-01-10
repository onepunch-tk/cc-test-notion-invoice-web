import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Route } from "./+types/index";

/**
 * 사용자 목록 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "사용자 관리 - Claude RR7 Starterkit" },
];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	// TODO: Drizzle로 사용자 목록 조회
	// const { db } = createSupabaseServerClient(request, context.cloudflare.env);
	// const users = await db.select().from(profilesTable);

	// 임시 데이터
	const users = [
		{
			id: "1",
			email: "user1@example.com",
			fullName: "홍길동",
			createdAt: new Date("2024-01-01"),
		},
		{
			id: "2",
			email: "user2@example.com",
			fullName: "김철수",
			createdAt: new Date("2024-02-01"),
		},
		{
			id: "3",
			email: "user3@example.com",
			fullName: "이영희",
			createdAt: new Date("2024-03-01"),
		},
	];

	return { users };
};

export default function UsersList({ loaderData }: Route.ComponentProps) {
	const { users } = loaderData;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">사용자 관리</h1>
				<p className="text-muted-foreground">전체 사용자 목록을 확인하세요</p>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>이름</TableHead>
							<TableHead>이메일</TableHead>
							<TableHead>가입일</TableHead>
							<TableHead>상태</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.fullName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									{format(user.createdAt, "PPP", { locale: ko })}
								</TableCell>
								<TableCell>
									<Badge variant="default">활성</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
