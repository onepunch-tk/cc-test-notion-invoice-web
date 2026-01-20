import type { IUser, IUserWithProfile, UpdateProfileDTO } from "~/domain/user";
import { ProfileNotFoundError, UserNotFoundError } from "~/domain/user";
import type { IProfileRepository, IUserRepository } from "./user.port";

/**
 * User Service 타입
 */
export type UserService = ReturnType<typeof createUserService>;

/**
 * User Service 팩토리
 *
 * 사용자 관련 비즈니스 로직을 제공합니다.
 *
 * @param userRepository - 사용자 저장소
 * @param profileRepository - 프로필 저장소
 */
export const createUserService = (
	userRepository: IUserRepository,
	profileRepository: IProfileRepository,
) => ({
	/**
	 * ID로 사용자 조회
	 */
	async getUserById(id: string): Promise<IUser> {
		const user = await userRepository.findById(id);
		if (!user) {
			throw new UserNotFoundError();
		}
		return user;
	},

	/**
	 * 이메일로 사용자 조회
	 */
	async getUserByEmail(email: string): Promise<IUser | null> {
		return userRepository.findByEmail(email);
	},

	/**
	 * 사용자와 프로필 함께 조회
	 */
	async getUserWithProfile(userId: string): Promise<IUserWithProfile> {
		const userWithProfile = await userRepository.findWithProfile(userId);
		if (!userWithProfile) {
			throw new UserNotFoundError();
		}
		return userWithProfile;
	},

	/**
	 * 프로필 업데이트
	 */
	async updateProfile(
		userId: string,
		data: UpdateProfileDTO,
	): Promise<IUserWithProfile> {
		// 사용자 존재 여부 확인
		const user = await userRepository.findById(userId);
		if (!user) {
			throw new UserNotFoundError();
		}

		// 프로필 존재 여부 확인
		const existingProfile = await profileRepository.findByUserId(userId);
		if (!existingProfile) {
			// 프로필이 없으면 생성
			await profileRepository.create({
				userId,
				...data,
			});
		} else {
			// 프로필이 있으면 업데이트
			await profileRepository.update(userId, data);
		}

		// 업데이트된 사용자+프로필 반환
		const updated = await userRepository.findWithProfile(userId);
		if (!updated) {
			throw new UserNotFoundError();
		}

		return updated;
	},
});
