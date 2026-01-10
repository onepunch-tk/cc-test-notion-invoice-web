import type { Route } from "./+types/home";

/**
 * 대시보드 홈 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "홈 - Claude RR7 Starterkit" },
];

export default function Home() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">홈</h1>
				<p className="text-muted-foreground">
					최근 활동과 업데이트를 확인하세요.
				</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h2 className="text-xl font-semibold">최근 활동</h2>
				<p className="mt-2 text-muted-foreground">
					최근 활동 내역이 여기에 표시됩니다.
				</p>
			</div>
		</div>
	);
}
