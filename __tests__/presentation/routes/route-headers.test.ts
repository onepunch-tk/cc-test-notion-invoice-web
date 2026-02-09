import { describe, expect, it } from "vitest";
import { headers as invoiceDetailHeaders } from "~/presentation/routes/invoices/$invoiceId";
import { headers as invoiceListHeaders } from "~/presentation/routes/invoices/index";
import { headers as homeHeaders } from "~/presentation/routes/home/home";

describe("Route Cache-Control headers", () => {
	const createHeadersArgs = (loaderHeaders?: Headers) => ({
		loaderHeaders: loaderHeaders ?? new Headers(),
		actionHeaders: new Headers(),
		parentHeaders: new Headers(),
		errorHeaders: undefined,
	});

	describe("Invoice Detail headers", () => {
		it("s-maxage=600으로 설정한다", () => {
			const result = invoiceDetailHeaders(createHeadersArgs() as any);
			const headers =
				result instanceof Headers ? result : new Headers(result as any);
			expect(headers.get("Cache-Control")).toBe(
				"public, max-age=0, s-maxage=600, stale-while-revalidate=60",
			);
		});

		it("loaderHeaders를 포함한다", () => {
			const loaderHeaders = new Headers({ "X-Custom": "test" });
			const result = invoiceDetailHeaders(
				createHeadersArgs(loaderHeaders) as any,
			);
			const headers =
				result instanceof Headers ? result : new Headers(result as any);
			expect(headers.get("X-Custom")).toBe("test");
		});
	});

	describe("Invoice List headers", () => {
		it("s-maxage=300으로 설정한다", () => {
			const result = invoiceListHeaders(createHeadersArgs() as any);
			const headers =
				result instanceof Headers ? result : new Headers(result as any);
			expect(headers.get("Cache-Control")).toBe(
				"public, max-age=0, s-maxage=300, stale-while-revalidate=60",
			);
		});
	});

	describe("Home headers", () => {
		it("s-maxage=3600으로 설정한다", () => {
			const result = homeHeaders(createHeadersArgs() as any);
			const headers =
				result instanceof Headers ? result : new Headers(result as any);
			expect(headers.get("Cache-Control")).toBe(
				"public, max-age=0, s-maxage=3600, stale-while-revalidate=60",
			);
		});
	});
});
