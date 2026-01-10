import type { Route } from "./+types/security";

/**
 * 보안 설정 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "보안 설정 - Claude RR7 Starterkit" },
];

export default function SecuritySettings() {
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
					<h2 className="text-xl font-semibold">비밀번호 변경</h2>
					<p className="mt-2 text-muted-foreground">
						새로운 비밀번호를 설정하세요.
					</p>
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
