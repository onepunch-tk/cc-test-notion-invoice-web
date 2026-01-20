import CtaSection from "~/presentation/components/sections/cta-section";
import FeaturesSection from "~/presentation/components/sections/features-section";
import HeroSection from "~/presentation/components/sections/hero-section";
import type { Route } from "./+types/home";
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

export default function Home() {
	return (
		<div className="container">
			<HeroSection />
			<FeaturesSection />
			<CtaSection />
		</div>
	);
}
