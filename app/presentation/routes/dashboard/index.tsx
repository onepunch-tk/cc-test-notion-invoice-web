import { Card, CardContent, CardHeader, CardTitle } from "~/presentation/components/ui/card";
import type { Route } from "./+types/index";

/**
 * 대시보드 메인 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "대시보드 - Claude RR7 Starterkit" },
];

export default function Dashboard() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">대시보드</h1>
				<p className="text-muted-foreground">
					환영합니다! 이곳에서 전체 현황을 확인할 수 있습니다.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,234</div>
						<p className="text-xs text-muted-foreground">지난달 대비 +10%</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">567</div>
						<p className="text-xs text-muted-foreground">지난주 대비 +5%</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">신규 가입</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">89</div>
						<p className="text-xs text-muted-foreground">이번 주</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">전환율</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12.5%</div>
						<p className="text-xs text-muted-foreground">지난달 대비 +2.1%</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
