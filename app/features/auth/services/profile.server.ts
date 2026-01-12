import { eq } from "drizzle-orm";
import type { DrizzleClient } from "~/db";
import { profilesTable } from "~/db/schema";

/**
 * 사용자 프로필 생성
 *
 * 회원가입 시 profiles 테이블에 초기 프로필 레코드를 생성합니다.
 * Idempotent 작업으로 설계되어, 이미 프로필이 존재하면 업데이트합니다.
 *
 * @param db - Drizzle 클라이언트 인스턴스
 * @param data - 프로필 생성 데이터
 * @returns 생성 또는 업데이트된 프로필
 *
 * @example
 * ```typescript
 * const profile = await createUserProfile(db, {
 *   userId: "user_123",
 *   fullName: "홍길동",
 *   avatarUrl: null,
 *   bio: null,
 * });
 * ```
 */
export const createUserProfile = async (
	db: DrizzleClient,
	data: {
		userId: string;
		fullName: string | null;
		avatarUrl: string | null;
		bio: string | null;
	},
) => {
	// 1. 기존 프로필 조회
	const existingProfile = await db
		.select()
		.from(profilesTable)
		.where(eq(profilesTable.userId, data.userId))
		.limit(1);

	// 2. 이미 존재하면 업데이트
	if (existingProfile.length > 0) {
		return await db
			.update(profilesTable)
			.set({
				fullName: data.fullName,
				avatarUrl: data.avatarUrl,
				bio: data.bio,
				updatedAt: new Date(),
			})
			.where(eq(profilesTable.userId, data.userId))
			.returning();
	}

	// 3. 존재하지 않으면 새로 생성
	return await db
		.insert(profilesTable)
		.values({
			userId: data.userId,
			fullName: data.fullName,
			avatarUrl: data.avatarUrl,
			bio: data.bio,
		})
		.returning();
};
