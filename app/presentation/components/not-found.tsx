import { Link } from "react-router";

/**
 * NotFound Component
 *
 * @deprecated Use `NotFoundState` from `~/presentation/components/error` instead.
 * This component will be removed in a future version.
 *
 * Migration guide:
 * ```tsx
 * // Before
 * import { NotFound } from "~/presentation/components/not-found";
 * <NotFound />
 *
 * // After
 * import { NotFoundState } from "~/presentation/components/error";
 * <NotFoundState
 *   title="인보이스를 찾을 수 없습니다"
 *   message="요청하신 인보이스가 존재하지 않거나 주소가 변경되었을 수 있습니다."
 *   actionLabel="인보이스 목록으로"
 *   actionHref="/"
 * />
 * ```
 */
export function NotFound() {
	return (
		<div className="flex flex-col h-dvh items-center justify-center min-h-[60vh] text-center px-4">
			<h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">
				404
			</h1>
			<h2 className="text-2xl font-bold md:text-3xl text-gray-800 dark:text-gray-200">
				인보이스를 찾을 수 없습니다
			</h2>
			<p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
				요청하신 인보이스가 존재하지 않거나 주소가 변경되었을 수 있습니다.
				인보이스 ID를 다시 확인해주세요.
			</p>

			<div className="mt-8">
				<Link
					to="/"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
				>
					인보이스 목록으로
				</Link>
			</div>
		</div>
	);
}
