/**
 * 포맷팅 유틸리티 함수
 *
 * 통화, 날짜 등의 포맷팅을 담당합니다.
 */

/**
 * 통화에 따른 기본 로케일 매핑
 */
const currencyLocaleMap: Record<string, string> = {
	KRW: "ko-KR",
	USD: "en-US",
	EUR: "de-DE",
	JPY: "ja-JP",
	GBP: "en-GB",
	CNY: "zh-CN",
};

/**
 * 통화 금액을 포맷팅합니다.
 *
 * @param amount - 포맷팅할 금액
 * @param currency - ISO 4217 통화 코드 (기본값: 'KRW')
 * @param locale - BCP 47 언어 태그 (제공되지 않으면 통화에 따라 자동 감지)
 * @returns 포맷팅된 통화 문자열
 *
 * @example
 * formatCurrency(10000) // "₩10,000"
 * formatCurrency(1234.56, 'USD') // "$1,234.56"
 * formatCurrency(1234.56, 'USD', 'en-US') // "$1,234.56"
 */
export const formatCurrency = (
	amount: number,
	currency = "KRW",
	locale?: string,
): string => {
	const resolvedLocale = locale ?? currencyLocaleMap[currency] ?? "en-US";
	return new Intl.NumberFormat(resolvedLocale, {
		style: "currency",
		currency,
		minimumFractionDigits: currency === "KRW" ? 0 : 2,
		maximumFractionDigits: currency === "KRW" ? 0 : 2,
	}).format(amount);
};

/**
 * 날짜를 지정된 포맷으로 문자열로 변환합니다.
 *
 * @param date - 포맷팅할 날짜
 * @param formatStr - 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate(new Date('2024-01-15')) // "2024-01-15"
 * formatDate(new Date('2024-01-15'), 'yyyy년 MM월 dd일') // "2024년 01월 15일"
 */
export const formatDate = (date: Date, formatStr = "yyyy-MM-dd"): string => {
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	return formatStr
		.replace("yyyy", year)
		.replace("MM", month)
		.replace("dd", day);
};
