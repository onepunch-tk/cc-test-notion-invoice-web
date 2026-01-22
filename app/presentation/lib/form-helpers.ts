import { z } from "zod";

/**
 * FormData를 객체로 변환
 * checkbox는 "on"일 경우 true로 변환
 */
export const parseFormData = (formData: FormData) => {
	const data: Record<string, unknown> = {};

	for (const [key, value] of formData.entries()) {
		// checkbox 처리 (checked면 "on", unchecked면 undefined)
		if (value === "on") {
			data[key] = true;
		} else {
			data[key] = value;
		}
	}

	return data;
};

/**
 * Zod 검증 + 포맷팅된 에러 반환
 *
 * @param schema - Zod 스키마
 * @param formData - FormData 객체
 * @returns 성공 시 { success: true, data }, 실패 시 { success: false, errors }
 *
 * @example
 * const validation = validateFormData(loginSchema, formData);
 * if (!validation.success) {
 *   return { errors: validation.errors };
 * }
 * // validation.data는 타입 안전하게 사용 가능
 */
export const validateFormData = <T>(
	schema: z.ZodType<T>,
	formData: FormData,
):
	| { success: true; data: T }
	| { success: false; errors: z.core.$ZodFormattedError<T> } => {
	const data = parseFormData(formData);
	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			// Zod v4: .format() deprecated, z.formatError() 사용
			errors: z.formatError(result.error),
		};
	}

	return {
		success: true,
		data: result.data,
	};
};

/**
 * 액션 응답 타입
 * success: true일 경우 data 포함 가능
 * success: false일 경우 error(일반 에러) 또는 errors(필드별 에러) 포함
 */
export type ActionResponse<T = unknown> =
	| { success: true; data?: T }
	| {
			success: false;
			error?: string;
			errors?: z.core.$ZodFormattedError<unknown>;
	  };
