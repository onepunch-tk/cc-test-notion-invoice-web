import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스명을 조건부로 병합하는 유틸리티 함수
 *
 * `cn`은 "className"의 약자로, 많은 React + Tailwind 프로젝트에서 사용되는 관습적 이름입니다.
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 클래스를 병합합니다.
 *
 * @param inputs - 병합할 클래스명 배열 (문자열, 객체, 배열, 조건부 값 모두 지원)
 * @returns 병합된 클래스명 문자열
 *
 * @example
 * // 조건부 클래스 적용
 * cn("px-4 py-2", isActive && "bg-blue-500", { "text-white": isActive })
 * // isActive가 true일 때: "px-4 py-2 bg-blue-500 text-white"
 *
 * @example
 * // Tailwind 클래스 충돌 해결
 * cn("px-4", "px-2") // Result: "px-2" (나중 값이 우선)
 * cn("text-red-500", "text-blue-500") // Result: "text-blue-500"
 *
 * @example
 * // 객체 문법
 * cn("base-class", { "active": isActive, "disabled": isDisabled })
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};
