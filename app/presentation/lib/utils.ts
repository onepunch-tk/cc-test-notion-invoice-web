import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스명을 조건부로 병합하는 유틸리티 함수
 *
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 클래스를 병합합니다.
 *
 * @param inputs - 병합할 클래스명 배열
 * @returns 병합된 클래스명 문자열
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", { "text-white": isActive })
 * // isActive가 true일 때: "px-4 py-2 bg-blue-500 text-white"
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
