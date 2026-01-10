import { Database, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

/**
 * 기능 소개 카드
 */
const features = [
	{
		icon: ShieldCheck,
		title: "Supabase 인증",
		description:
			"이메일 기반 회원가입, 로그인, 비밀번호 재설정 기능이 모두 포함되어 있습니다.",
	},
	{
		icon: LayoutDashboard,
		title: "대시보드",
		description:
			"인증된 사용자를 위한 대시보드 페이지가 준비되어 있어 바로 기능을 추가할 수 있습니다.",
	},
	{
		icon: Settings,
		title: "설정 페이지",
		description:
			"프로필 설정, 이메일 변경 등 사용자 설정 관리 기능이 구현되어 있습니다.",
	},
	{
		icon: Database,
		title: "Drizzle ORM",
		description:
			"타입 안전한 데이터베이스 ORM으로 빠르고 안전하게 데이터를 관리할 수 있습니다.",
	},
];

/**
 * 랜딩 페이지 기능 소개 섹션
 * - 4개의 주요 기능 카드
 * - 반응형 그리드 레이아웃
 */
export default function FeaturesSection() {
	return (
		<section className="container py-20">
			<div className="mx-auto max-w-6xl">
				{/* 섹션 헤더 */}
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						포함된 주요 기능
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						프로덕션 레디 기능들이 이미 구현되어 있습니다
					</p>
				</div>

				{/* 기능 카드 그리드 */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<Card
								key={feature.title}
								className="transition-all hover:shadow-lg"
							>
								<CardHeader>
									<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<CardTitle>{feature.title}</CardTitle>
									<CardDescription>{feature.description}</CardDescription>
								</CardHeader>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
