import { redirect } from "react-router";
import type { Route } from "./+types/[id]";

/**
 * 사용자 상세 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "사용자 상세 - Claude RR7 Starterkit" },
];

export const loader = async ({
	params,
	request,
	context,
}: Route.LoaderArgs) => {
	const userId = params.id;

	// TODO: Drizzle로 사용자 조회
	// const { db } = createSupabaseServerClient(request, context.cloudflare.env);
	// const user = await db.select().from(profilesTable).where(eq(profilesTable.id, userId));

	// 임시 데이터
	const user = {
		id: userId,
		email: "user1@example.com",
		fullName: "홍길동",
		bio: "안녕하세요, 홍길동입니다.",
		createdAt: new Date("2024-01-01"),
	};

	return { user };
};

export default function UserDetail({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">사용자 상세</h1>
				<p className="text-muted-foreground">사용자 정보를 확인하세요</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<div className="space-y-4">
					<div>
						<div className="text-sm font-medium text-muted-foreground">
							이름
						</div>
						<div className="mt-1 text-lg font-semibold">{user.fullName}</div>
					</div>

					<div>
						<div className="text-sm font-medium text-muted-foreground">
							이메일
						</div>
						<div className="mt-1">{user.email}</div>
					</div>

					<div>
						<div className="text-sm font-medium text-muted-foreground">
							자기소개
						</div>
						<div className="mt-1">{user.bio || "자기소개가 없습니다."}</div>
					</div>

					<div>
						<div className="text-sm font-medium text-muted-foreground">
							가입일
						</div>
						<div className="mt-1">
							{user.createdAt.toLocaleDateString("ko-KR")}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
