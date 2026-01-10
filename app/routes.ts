import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/index.tsx"),

	// 인증 라우트 (레이아웃 포함)
	layout("routes/auth/layout.tsx", [
		route("auth/login", "routes/auth/login.tsx"),
		route("auth/signup", "routes/auth/signup.tsx"),
		route("auth/forgot-password", "routes/auth/forgot-password.tsx"),
		route("auth/reset-password", "routes/auth/reset-password.tsx"),
	]),
	route("auth/logout", "routes/auth/logout.tsx"), // 레이아웃 없음

	// Better-auth API 라우트 (catch-all)
	route("auth/api/*", "features/auth/api/$.tsx"),

	// 대시보드 라우트 (레이아웃 포함)
	layout("routes/dashboard/layout.tsx", [
		route("dashboard", "routes/dashboard/index.tsx"),
		route("dashboard/home", "routes/dashboard/home.tsx"),

		// 사용자 관리
		route("dashboard/users", "routes/dashboard/users/index.tsx"),
		route("dashboard/users/:id", "routes/dashboard/users/[id].tsx"),

		// 설정
		route("dashboard/settings", "routes/dashboard/settings/index.tsx"),
		route(
			"dashboard/settings/profile",
			"routes/dashboard/settings/profile.tsx",
		),
		route(
			"dashboard/settings/security",
			"routes/dashboard/settings/security.tsx",
		),
	]),

	// 리소스 라우트
	route("robots.txt", "routes/resources/robots.ts"),
	route("sitemap.xml", "routes/resources/sitemap.ts"),
] satisfies RouteConfig;
