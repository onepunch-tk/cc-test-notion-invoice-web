import { useMediaQuery } from "usehooks-ts";

const MOBILE_BREAKPOINT = 768;

/**
 * 모바일 디바이스 여부를 확인하는 Hook
 * @returns 768px 미만일 경우 true, 그 외 false
 */
export const useIsMobile = () => {
	return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
};
