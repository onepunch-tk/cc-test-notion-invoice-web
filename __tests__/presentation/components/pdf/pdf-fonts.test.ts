/**
 * PDF 폰트 설정 단위 테스트
 */

import { vi } from "vitest";

// Font.register 모킹
vi.mock("@react-pdf/renderer", () => ({
	Font: {
		register: vi.fn(),
	},
}));

import { Font } from "@react-pdf/renderer";
import {
	PDF_FONT_FAMILY,
	PDF_KOREAN_FONT_FAMILY,
	registerKoreanFont,
} from "~/presentation/components/pdf/pdf-fonts";

describe("pdf-fonts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("registerKoreanFont", () => {
		it("Font.register를 호출하여 NotoSansKR 폰트를 등록한다", () => {
			registerKoreanFont();

			expect(Font.register).toHaveBeenCalledOnce();
			expect(Font.register).toHaveBeenCalledWith(
				expect.objectContaining({
					family: "NotoSansKR",
					fonts: expect.arrayContaining([
						expect.objectContaining({ fontWeight: 400 }),
						expect.objectContaining({ fontWeight: 700 }),
					]),
				}),
			);
		});

		it("등록할 폰트에 src URL이 포함되어 있다", () => {
			registerKoreanFont();

			const callArg = vi.mocked(Font.register).mock.calls[0][0] as {
				fonts: Array<{ src: string }>;
			};
			for (const font of callArg.fonts) {
				expect(font.src).toMatch(/^https:\/\//);
			}
		});
	});

	describe("constants", () => {
		it("PDF_FONT_FAMILY가 Helvetica이다", () => {
			expect(PDF_FONT_FAMILY).toBe("Helvetica");
		});

		it("PDF_KOREAN_FONT_FAMILY가 NotoSansKR이다", () => {
			expect(PDF_KOREAN_FONT_FAMILY).toBe("NotoSansKR");
		});
	});
});
