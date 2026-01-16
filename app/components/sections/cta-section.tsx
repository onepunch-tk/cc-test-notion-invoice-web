import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

/**
 * 랜딩 페이지 CTA(Call to Action) 섹션
 * - Git clone 명령어 제공 및 클립보드 복사 기능
 * - 단계별 빠른 시작 가이드
 * - GitHub 저장소 및 문서 링크
 * - Mobile-first 반응형 디자인
 */
export default function CtaSection() {
	const gitCloneCommand =
		"git clone https://github.com/onepunch-tk/claude-rr7-starterkit.git";

	const handleCopyToClipboard = () => {
		if (typeof navigator !== "undefined" && navigator.clipboard) {
			navigator.clipboard.writeText(gitCloneCommand);
			toast.success("클립보드에 복사되었습니다!");
		}
	};

	return (
		<section className="container py-20">
			<div className="mx-auto max-w-4xl">
				<Card className="border-2 border-primary/20 bg-linear-to-br from-background to-muted/30">
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-bold sm:text-4xl">
							지금 바로 시작하세요
						</CardTitle>
						<CardDescription className="text-base sm:text-lg">
							단 하나의 명령어로 프로젝트를 시작할 수 있습니다
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Git Clone 명령어 */}
						<div className="relative">
							<div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-4 font-mono text-sm sm:text-base">
								<code className="flex-1 overflow-x-auto">
									{gitCloneCommand}
								</code>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleCopyToClipboard}
									className="shrink-0"
									aria-label="클립보드에 복사"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* 빠른 시작 단계 */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">빠른 시작 가이드</h3>
							<ol className="space-y-3 text-muted-foreground">
								<li className="flex gap-3">
									<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
										1
									</span>
									<span className="pt-0.5">
										위 명령어로 프로젝트를 클론합니다
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
										2
									</span>
									<span className="pt-0.5">
										<code className="rounded bg-muted px-1.5 py-0.5 text-sm">
											bun install
										</code>
										로 의존성을 설치합니다
									</span>
								</li>
								<li className="flex gap-3">
									<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
										3
									</span>
									<span className="pt-0.5">
										환경 변수를 설정하고{" "}
										<code className="rounded bg-muted px-1.5 py-0.5 text-sm">
											bun run dev
										</code>
										로 시작합니다
									</span>
								</li>
							</ol>
						</div>

						{/* 문서 링크 */}
						<div className="flex flex-col gap-3 pt-4 sm:flex-row">
							<Button variant="default" size="lg" className="flex-1" asChild>
								<a
									href="https://github.com/onepunch-tk/claude-rr7-starterkit"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub에서 보기
								</a>
							</Button>
							<Button variant="outline" size="lg" className="flex-1" asChild>
								<a
									href="https://github.com/onepunch-tk/claude-rr7-starterkit#readme"
									target="_blank"
									rel="noopener noreferrer"
								>
									문서 읽기
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
