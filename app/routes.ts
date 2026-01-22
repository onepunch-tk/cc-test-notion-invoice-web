import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// 리소스 라우트
	route("robots.txt", "presentation/routes/resources/robots.ts"),
	route("sitemap.xml", "presentation/routes/resources/sitemap.ts"),

	// Better-auth API 라우트 (catch-all)
	route("auth/api/*", "presentation/routes/auth/api/$.tsx"),

	layout("presentation/routes/layouts/navigation.layout.tsx", [
		// 공개 페이지
		index("presentation/routes/home/home.tsx"),
		route("privacy-policy", "presentation/routes/privacy-policy.tsx"),
		route("terms", "presentation/routes/terms.tsx"),
		route("support", "presentation/routes/support.tsx"),

		// 인증 페이지
		route("auth/signin", "presentation/routes/auth/sign-in.tsx"),
		route("auth/signup", "presentation/routes/auth/sign-up.tsx"),
		route("auth/forgot-password", "presentation/routes/auth/forgot-password.tsx"),
		route("auth/reset-password", "presentation/routes/auth/reset-password.tsx"),

		// 인증 필수 페이지
		layout("presentation/routes/layouts/private.layout.tsx", [
			// 로그아웃 (인증 필수)
			route("auth/signout", "presentation/routes/auth/sign-out.tsx"),

			// 공유 사이드바 레이아웃
			layout("presentation/routes/layouts/app.layout.tsx", [
				// Dashboard (단일 페이지)
				route("my/dashboard", "presentation/routes/dashboard/index.tsx"),

				// Settings (단일 페이지)
				route("my/settings", "presentation/routes/settings/index.tsx"),
			]),
		]),
	]),
] satisfies RouteConfig;
