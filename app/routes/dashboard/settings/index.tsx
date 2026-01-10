import { Link } from "react-router";
import type { Route } from "./+types/index";

/**
 * 설정 메인 페이지
 */
export const meta: Route.MetaFunction = () => [
	{ title: "설정 - Claude RR7 Starterkit" },
];

export default function Settings() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">설정</h1>
				<p className="text-muted-foreground">
					계정 및 애플리케이션 설정을 관리하세요
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Link
					to="/dashboard/settings/profile"
					className="rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<h2 className="text-xl font-semibold">프로필 설정</h2>
					<p className="mt-2 text-muted-foreground">
						이름, 이메일, 자기소개 등 프로필 정보를 수정합니다.
					</p>
				</Link>

				<Link
					to="/dashboard/settings/security"
					className="rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<h2 className="text-xl font-semibold">보안 설정</h2>
					<p className="mt-2 text-muted-foreground">
						비밀번호 변경, 2단계 인증 등 보안 설정을 관리합니다.
					</p>
				</Link>
			</div>
		</div>
	);
}
