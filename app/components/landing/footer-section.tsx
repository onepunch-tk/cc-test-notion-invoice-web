import { Link } from "react-router";

/**
 * 랜딩 페이지 Footer 섹션
 * - 저작권 표시
 * - 주요 링크
 */
export default function FooterSection() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border">
			<div className="container py-8">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					{/* 저작권 */}
					<p className="text-sm text-muted-foreground">
						© {currentYear} Claude RR7 Starterkit. All rights reserved.
					</p>

					{/* 링크 */}
					<nav className="flex gap-6 text-sm text-muted-foreground">
						<Link to="#" className="hover:text-foreground">
							개인정보처리방침
						</Link>
						<Link to="#" className="hover:text-foreground">
							이용약관
						</Link>
						<Link to="#" className="hover:text-foreground">
							고객지원
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
