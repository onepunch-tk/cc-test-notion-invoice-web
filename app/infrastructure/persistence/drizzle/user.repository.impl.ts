import { eq } from "drizzle-orm";
import type {
	IProfileRepository,
	IUserRepository,
} from "~/application/user/user.port";
import type {
	CreateProfileDTO,
	IProfile,
	IUser,
	IUserWithProfile,
	UpdateProfileDTO,
	UpdateUserDTO,
} from "~/domain/user";
import { profilesTable, userTable } from "../schema";
import type { DrizzleClient } from "./drizzle.server";

/**
 * User Repository 구현체
 *
 * Drizzle ORM을 사용한 IUserRepository 구현
 */
export const createUserRepositoryImpl = (
	db: DrizzleClient,
): IUserRepository => ({
	async findById(id: string): Promise<IUser | null> {
		const result = await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, id))
			.limit(1);

		return result[0] ?? null;
	},

	async findByEmail(email: string): Promise<IUser | null> {
		const result = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, email))
			.limit(1);

		return result[0] ?? null;
	},

	async findWithProfile(userId: string): Promise<IUserWithProfile | null> {
		const result = await db
			.select()
			.from(userTable)
			.leftJoin(profilesTable, eq(userTable.id, profilesTable.userId))
			.where(eq(userTable.id, userId))
			.limit(1);

		if (result.length === 0) {
			return null;
		}

		const { user, profiles } = result[0];

		return {
			...user,
			profile: profiles,
		};
	},

	async update(id: string, data: UpdateUserDTO): Promise<IUser> {
		const result = await db
			.update(userTable)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(userTable.id, id))
			.returning();

		if (result.length === 0) {
			throw new Error("사용자를 찾을 수 없습니다.");
		}

		return result[0];
	},
});

/**
 * Profile Repository 구현체
 *
 * Drizzle ORM을 사용한 IProfileRepository 구현
 */
export const createProfileRepositoryImpl = (
	db: DrizzleClient,
): IProfileRepository => ({
	async findByUserId(userId: string): Promise<IProfile | null> {
		const result = await db
			.select()
			.from(profilesTable)
			.where(eq(profilesTable.userId, userId))
			.limit(1);

		return result[0] ?? null;
	},

	async create(data: CreateProfileDTO): Promise<IProfile> {
		const result = await db
			.insert(profilesTable)
			.values({
				userId: data.userId,
				fullName: data.fullName ?? null,
				avatarUrl: data.avatarUrl ?? null,
				bio: data.bio ?? null,
			})
			.returning();

		return result[0];
	},

	async update(userId: string, data: UpdateProfileDTO): Promise<IProfile> {
		const result = await db
			.update(profilesTable)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(profilesTable.userId, userId))
			.returning();

		if (result.length === 0) {
			throw new Error("프로필을 찾을 수 없습니다.");
		}

		return result[0];
	},
});
