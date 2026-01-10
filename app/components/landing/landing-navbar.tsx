import { Link } from "react-router";
import { Button } from "~/components/ui/button";

/**
 * 랜딩 페이지 네비게이션 바
 * - 상단 고정
 * - 로그인/시작하기 버튼 제공
 */
export default function LandingNavbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* 로고 */}
				<Link to="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<span className="text-lg font-bold text-primary-foreground">C</span>
					</div>
					<span className="hidden font-bold sm:inline-block">
						Claude RR7 Starterkit
					</span>
				</Link>

				{/* 버튼 영역 */}
				<div className="flex items-center gap-2">
					<Button variant="ghost" asChild>
						<Link to="/auth/login">로그인</Link>
					</Button>
					<Button asChild>
						<Link to="/auth/signup">시작하기</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
}
