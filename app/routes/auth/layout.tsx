import { Outlet } from "react-router";

/**
 * 인증 페이지 공통 레이아웃
 * - 중앙 정렬, 배경 처리
 */
export default function AuthLayout() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
			<Outlet />
		</div>
	);
}
