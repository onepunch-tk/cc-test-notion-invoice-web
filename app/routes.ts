import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// 리소스 라우트 (레이아웃 외부)
	route("robots.txt", "presentation/routes/resources/robots.ts"),
	route("sitemap.xml", "presentation/routes/resources/sitemap.ts"),

	// 앱 라우트 (공통 레이아웃 적용)
	layout("presentation/routes/layouts/app.layout.tsx", [
		index("presentation/routes/home/home.tsx"),
		route("invoices", "presentation/routes/invoices/index.tsx"),
		route("invoices/:invoiceId", "presentation/routes/invoices/$invoiceId.tsx"),
		route("*", "presentation/routes/$.tsx"),
	]),
] satisfies RouteConfig;
