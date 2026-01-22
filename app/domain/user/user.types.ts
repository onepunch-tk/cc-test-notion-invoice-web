import type { IProfile, IUser } from "./user.entity";

/**
 * 사용자 생성 DTO
 */
export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

/**
 * 사용자 업데이트 DTO
 */
export interface UpdateUserDTO {
	name?: string;
	image?: string;
}

/**
 * 프로필 생성 DTO
 */
export interface CreateProfileDTO {
	userId: string;
	fullName?: string | null;
	avatarUrl?: string | null;
	bio?: string | null;
}

/**
 * 프로필 업데이트 DTO
 */
export interface UpdateProfileDTO {
	fullName?: string | null;
	avatarUrl?: string | null;
	bio?: string | null;
}

/**
 * User 타입 별칭
 *
 * 애플리케이션 레이어에서 사용하는 User 타입.
 * IUser는 도메인 엔티티 정의, User는 일반적인 사용을 위한 별칭.
 */
export type User = IUser;

/**
 * Profile 타입 별칭
 *
 * 애플리케이션 레이어에서 사용하는 Profile 타입.
 * IProfile은 도메인 엔티티 정의, Profile은 일반적인 사용을 위한 별칭.
 */
export type Profile = IProfile;
