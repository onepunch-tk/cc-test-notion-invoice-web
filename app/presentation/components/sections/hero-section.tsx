import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/presentation/components/ui/button";

/**
 * 랜딩 페이지 Hero 섹션
 * - 메인 타이틀 및 CTA
 * - 반응형 디자인
 */
export default function HeroSection() {
	return (
		<section className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
			<div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
				{/* 배지 */}
				<div className="inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
					<Zap className="mr-2 h-4 w-4 text-primary" />
					<span>React Router v7 + Supabase + Drizzle ORM</span>
				</div>

				{/* 메인 타이틀 */}
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
					빠르고 현대적인
					<br />
					<span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						풀스택 웹 개발
					</span>
				</h1>

				{/* 서브타이틀 */}
				<p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
					React Router v7, Supabase, Drizzle ORM, Tailwind CSS로 구축된
					<br className="hidden sm:inline" />
					프로덕션 레디 스타터킷으로 빠르게 시작하세요.
				</p>

				{/* CTA 버튼 */}
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button size="lg" asChild>
						<Link to="/auth/signup">
							시작하기
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
					<Button size="lg" variant="outline" asChild>
						<Link to="/auth/signin">로그인</Link>
					</Button>
				</div>

				{/* 기술 스택 태그 */}
				<div className="flex flex-wrap items-center justify-center gap-3 pt-8 text-sm text-muted-foreground">
					<span className="rounded-md bg-muted px-3 py-1">TypeScript</span>
					<span className="rounded-md bg-muted px-3 py-1">React 19</span>
					<span className="rounded-md bg-muted px-3 py-1">Tailwind CSS v4</span>
					<span className="rounded-md bg-muted px-3 py-1">shadcn/ui v3</span>
					<span className="rounded-md bg-muted px-3 py-1">
						Cloudflare Workers
					</span>
				</div>
			</div>
		</section>
	);
}
