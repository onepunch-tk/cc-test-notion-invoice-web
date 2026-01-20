import type {
	CreateProfileDTO,
	IProfile,
	IUser,
	IUserWithProfile,
	UpdateProfileDTO,
	UpdateUserDTO,
} from "~/domain/user";

/**
 * User Repository 인터페이스
 *
 * 데이터 접근 추상화 레이어입니다.
 * 구현체는 Infrastructure 레이어에서 제공됩니다.
 */
export interface IUserRepository {
	/**
	 * ID로 사용자 조회
	 */
	findById(id: string): Promise<IUser | null>;

	/**
	 * 이메일로 사용자 조회
	 */
	findByEmail(email: string): Promise<IUser | null>;

	/**
	 * 사용자와 프로필 함께 조회
	 */
	findWithProfile(userId: string): Promise<IUserWithProfile | null>;

	/**
	 * 사용자 정보 업데이트
	 */
	update(id: string, data: UpdateUserDTO): Promise<IUser>;
}

/**
 * Profile Repository 인터페이스
 */
export interface IProfileRepository {
	/**
	 * 사용자 ID로 프로필 조회
	 */
	findByUserId(userId: string): Promise<IProfile | null>;

	/**
	 * 프로필 생성
	 */
	create(data: CreateProfileDTO): Promise<IProfile>;

	/**
	 * 프로필 업데이트
	 */
	update(userId: string, data: UpdateProfileDTO): Promise<IProfile>;
}
