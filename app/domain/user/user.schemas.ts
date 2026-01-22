import { z } from "zod";

/**
 * 프로필 업데이트 폼 스키마
 */
export const updateProfileSchema = z.object({
	fullName: z.string().min(1, "이름을 입력해주세요"),
	email: z.email("올바른 이메일 형식이 아닙니다"),
	bio: z.string().max(500, "자기소개는 500자 이내로 작성해주세요").optional(),
	language: z.enum(["ko", "en", "ja"]),
	notifications: z.boolean(),
});

/**
 * 프로필 업데이트 폼 데이터 타입
 */
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
