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
		// 공개 페이지
		index("routes/home/home.tsx"),

		// 인증 페이지
		route("auth/signin", "routes/auth/sign-in.tsx"),
		route("auth/signup", "routes/auth/sign-up.tsx"),
		route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
		route("auth/reset-password", "routes/auth/reset-password.tsx"),

		// 인증 필수 페이지
		layout("routes/layouts/private.layout.tsx", [
			// 로그아웃 (인증 필수)
			route("auth/signout", "routes/auth/sign-out.tsx"),

			// 공유 사이드바 레이아웃
			layout("routes/layouts/app.layout.tsx", [
				// Dashboard (단일 페이지)
				route("my/dashboard", "routes/dashboard/index.tsx"),

				// Settings (단일 페이지)
				route("my/settings", "routes/settings/index.tsx"),
			]),
		]),
	]),
] satisfies RouteConfig;
