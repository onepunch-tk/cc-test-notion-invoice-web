import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("isbot", () => ({
	isbot: vi.fn(() => false),
}));

vi.mock("react-dom/server", () => ({
	renderToReadableStream: vi.fn(() =>
		Promise.resolve(
			new ReadableStream({
				start(controller) {
					controller.enqueue(new TextEncoder().encode("<html></html>"));
					controller.close();
				},
			}),
		),
	),
}));

vi.mock("react-router", () => ({
	ServerRouter: () => null,
}));

vi.mock("~/infrastructure/utils/error-sanitizer", () => ({
	sanitizeErrorForLogging: vi.fn((e: unknown) => String(e)),
}));

import handleRequest from "~/entry.server";

describe("entry.server handleRequest", () => {
	const createMockRequest = () =>
		new Request("https://example.com/test", {
			headers: { "user-agent": "test-browser" },
		});

	const createMockContext = () => ({
		isSpaMode: false,
	});

	describe("Cache-Control 헤더", () => {
		it("200 응답에 기본 Cache-Control 헤더를 설정한다", async () => {
			const request = createMockRequest();
			const headers = new Headers();
			const routerContext = createMockContext();

			const response = await handleRequest(
				request,
				200,
				headers,
				routerContext as any,
				{} as any,
			);

			expect(response.headers.get("Cache-Control")).toBe(
				"public, max-age=0, s-maxage=300, stale-while-revalidate=60",
			);
		});

		it("non-200 응답에는 Cache-Control 헤더를 설정하지 않는다", async () => {
			const request = createMockRequest();
			const headers = new Headers();
			const routerContext = createMockContext();

			const response = await handleRequest(
				request,
				404,
				headers,
				routerContext as any,
				{} as any,
			);

			expect(response.headers.get("Cache-Control")).toBeNull();
		});

		it("500 응답에는 Cache-Control 헤더를 설정하지 않는다", async () => {
			const request = createMockRequest();
			const headers = new Headers();
			const routerContext = createMockContext();

			const response = await handleRequest(
				request,
				500,
				headers,
				routerContext as any,
				{} as any,
			);

			expect(response.headers.get("Cache-Control")).toBeNull();
		});
	});

	describe("Content-Type 헤더", () => {
		it("Content-Type을 text/html로 설정한다", async () => {
			const request = createMockRequest();
			const headers = new Headers();
			const routerContext = createMockContext();

			const response = await handleRequest(
				request,
				200,
				headers,
				routerContext as any,
				{} as any,
			);

			expect(response.headers.get("Content-Type")).toBe("text/html");
		});
	});
});
