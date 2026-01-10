import { redirect } from "react-router";
import type { Route } from "./+types/index";
import { getOptionalAuth } from "@/middleware/auth.middleware";
import LandingNavbar from "@/components/landing/landing-navbar";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import FooterSection from "@/components/landing/footer-section";

/**
 * 홈 페이지 loader
 * - 로그인한 사용자는 대시보드로 리다이렉트
 * - 비로그인 사용자는 랜딩 페이지 표시
 */
export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = await getOptionalAuth({ request, context });

	if (user) {
		return redirect("/dashboard");
	}

	return { user: null };
};

/**
 * 메타데이터 설정
 */
export const meta = (_: Route.MetaArgs) => {
	return [
		{ title: "Claude RR7 Starterkit - 빠른 풀스택 개발" },
		{
			name: "description",
			content:
				"React Router v7, Supabase, Drizzle ORM, Tailwind CSS로 구축된 프로덕션 레디 스타터킷",
		},
	];
};

/**
 * 홈 페이지 (랜딩 페이지)
 */
export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<LandingNavbar />
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
			</main>
			<FooterSection />
		</div>
	);
}
