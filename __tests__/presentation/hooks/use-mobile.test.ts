import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "~/presentation/hooks/use-mobile";

// usehooks-ts 모킹
vi.mock("usehooks-ts", () => ({
	useMediaQuery: vi.fn(),
}));

// 모킹된 useMediaQuery 가져오기
import { useMediaQuery } from "usehooks-ts";
const mockUseMediaQuery = vi.mocked(useMediaQuery);

describe("useIsMobile", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("768px 미만일 경우 true를 반환해야 한다", () => {
		// Arrange: 모바일 환경 설정 (max-width: 767px 매칭)
		mockUseMediaQuery.mockReturnValue(true);

		// Act: 훅 실행
		const { result } = renderHook(() => useIsMobile());

		// Assert: true 반환 확인
		expect(result.current).toBe(true);
		expect(mockUseMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
	});

	it("768px 이상일 경우 false를 반환해야 한다", () => {
		// Arrange: 데스크탑 환경 설정 (max-width: 767px 미매칭)
		mockUseMediaQuery.mockReturnValue(false);

		// Act: 훅 실행
		const { result } = renderHook(() => useIsMobile());

		// Assert: false 반환 확인
		expect(result.current).toBe(false);
		expect(mockUseMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
	});

	it("useMediaQuery에 올바른 미디어 쿼리를 전달해야 한다", () => {
		// Arrange: 반환값 설정
		mockUseMediaQuery.mockReturnValue(false);

		// Act: 훅 실행
		renderHook(() => useIsMobile());

		// Assert: 미디어 쿼리 문자열 확인
		expect(mockUseMediaQuery).toHaveBeenCalledTimes(1);
		expect(mockUseMediaQuery).toHaveBeenCalledWith("(max-width: 767px)");
	});
});
