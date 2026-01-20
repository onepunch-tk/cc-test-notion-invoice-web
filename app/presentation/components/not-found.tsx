import { Link } from "react-router";

export function NotFound() {
	return (
		<div className="flex flex-col h-dvh items-center justify-center min-h-[60vh] text-center px-4">
			<h1 className="text-9xl font-black text-gray-200">404</h1>
			<h2 className="text-2xl font-bold md:text-3xl text-gray-800">
				페이지를 찾을 수 없습니다
			</h2>
			<p className="mt-4 text-gray-500 max-w-md mx-auto">
				요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 주소를
				다시 확인해주세요.
			</p>

			<div className="mt-8">
				<Link
					to="/"
					className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
				>
					홈으로 돌아가기
				</Link>
			</div>
		</div>
	);
}
