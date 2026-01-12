import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// 리소스 라우트
	route("robots.txt", "routes/resources/robots.ts"),
	route("sitemap.xml", "routes/resources/sitemap.ts"),

	// Better-auth API 라우트 (catch-all)
	route("auth/api/*", "features/auth/api/$.tsx"),

	layout("routes/layouts/navgation.layout.tsx", [
		// 공개 페이지 (navgation.layout 직속)
		index("routes/home/home.tsx"),

		// 인증 페이지
		route("auth/signin", "routes/auth/sign-in.tsx"),
		route("auth/signup", "routes/auth/sign-up.tsx"),
		route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
		route("auth/reset-password", "routes/auth/reset-password.tsx"),

		// 인증 필수 페이지 (private.layout)
		layout("routes/layouts/private.layout.tsx", [
			// 로그아웃 (인증 필수)
			route("auth/signout", "routes/auth/sign-out.tsx"),

			// 대시보드 (중첩 레이아웃)
			...prefix("dashboard", [
				layout("routes/dashboard/layout.tsx", [
					index("routes/dashboard/index.tsx"),

					// 사용자 관리
					route("users", "routes/dashboard/users/index.tsx"),
					route("users/:id", "routes/dashboard/users/[id].tsx"),

					// 설정
					...prefix("settings", [
						index("routes/dashboard/settings/index.tsx"),
						route("profile", "routes/dashboard/settings/profile.tsx"),
						route("security", "routes/dashboard/settings/security.tsx"),
					]),
				]),
			]),
		]),
	]),
] satisfies RouteConfig;
