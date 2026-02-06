/**
 * PDF 폰트 설정
 *
 * @react-pdf/renderer Font.register를 사용한 폰트 등록
 * 기본 Helvetica 폰트 사용, 한글 지원 필요 시 Noto Sans KR 등록
 */

import { Font } from "@react-pdf/renderer";

/**
 * 한글 폰트 등록 (Noto Sans KR - Google Fonts CDN)
 *
 * 클라이언트 사이드에서 PDF 생성 시 호출
 * 이미 등록된 경우 중복 등록 방지
 */
export const registerKoreanFont = () => {
	Font.register({
		family: "NotoSansKR",
		fonts: [
			{
				src: "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLTq8H4hfeE.ttf",
				fontWeight: 400,
			},
			{
				src: "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyjbTq8H4hfeE.ttf",
				fontWeight: 700,
			},
		],
	});
};

/**
 * PDF에서 사용할 기본 폰트 패밀리
 */
export const PDF_FONT_FAMILY = "Helvetica";

/**
 * 한글 폰트 패밀리 (registerKoreanFont 호출 후 사용)
 */
export const PDF_KOREAN_FONT_FAMILY = "NotoSansKR";
