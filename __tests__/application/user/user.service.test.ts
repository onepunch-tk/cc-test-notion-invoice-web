import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
	IProfile,
	IUser,
	IUserWithProfile,
	UpdateProfileDTO,
} from "~/domain/user";
import { UserNotFoundError } from "~/domain/user";
import type {
	IProfileRepository,
	IUserRepository,
} from "~/application/user/user.port";
import { createUserService } from "~/application/user/user.service";

/**
 * UserService 유닛 테스트
 *
 * Mock 대상: IUserRepository, IProfileRepository
 * 테스트 대상 메서드:
 * - getUserById
 * - getUserByEmail
 * - getUserWithProfile
 * - updateProfile
 */

// 테스트용 목 데이터
const mockUser: IUser = {
	id: "user-1",
	name: "테스트 사용자",
	email: "test@example.com",
	emailVerified: true,
	image: null,
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
};

const mockProfile: IProfile = {
	id: "profile-1",
	userId: "user-1",
	fullName: "테스트 사용자 전체이름",
	avatarUrl: "https://example.com/avatar.png",
	bio: "테스트 사용자의 소개",
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
};

const mockUserWithProfile: IUserWithProfile = {
	...mockUser,
	profile: mockProfile,
};

describe("UserService", () => {
	// 목 리포지토리
	let mockUserRepository: IUserRepository;
	let mockProfileRepository: IProfileRepository;

	beforeEach(() => {
		// 각 테스트 전에 목 초기화
		vi.clearAllMocks();

		mockUserRepository = {
			findById: vi.fn(),
			findByEmail: vi.fn(),
			findWithProfile: vi.fn(),
			update: vi.fn(),
		};

		mockProfileRepository = {
			findByUserId: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		};
	});

	describe("getUserById", () => {
		it("사용자가 존재하면 사용자를 반환한다", async () => {
			// Arrange: 사용자가 존재하는 경우 목 설정
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: getUserById 호출
			const result = await userService.getUserById("user-1");

			// Assert: 사용자가 반환되어야 함
			expect(result).toEqual(mockUser);
			expect(mockUserRepository.findById).toHaveBeenCalledWith("user-1");
			expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
		});

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange: 사용자가 존재하지 않는 경우 목 설정
			vi.mocked(mockUserRepository.findById).mockResolvedValue(null);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act & Assert: UserNotFoundError가 던져져야 함
			await expect(userService.getUserById("non-existent")).rejects.toThrow(
				UserNotFoundError,
			);
			expect(mockUserRepository.findById).toHaveBeenCalledWith("non-existent");
		});
	});

	describe("getUserByEmail", () => {
		it("이메일로 사용자가 존재하면 사용자를 반환한다", async () => {
			// Arrange: 사용자가 존재하는 경우 목 설정
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: getUserByEmail 호출
			const result = await userService.getUserByEmail("test@example.com");

			// Assert: 사용자가 반환되어야 함
			expect(result).toEqual(mockUser);
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
				"test@example.com",
			);
			expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
		});

		it("이메일로 사용자가 존재하지 않으면 null을 반환한다", async () => {
			// Arrange: 사용자가 존재하지 않는 경우 목 설정
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: getUserByEmail 호출
			const result = await userService.getUserByEmail("unknown@example.com");

			// Assert: null이 반환되어야 함
			expect(result).toBeNull();
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
				"unknown@example.com",
			);
		});
	});

	describe("getUserWithProfile", () => {
		it("사용자와 프로필이 존재하면 함께 반환한다", async () => {
			// Arrange: 사용자와 프로필이 존재하는 경우 목 설정
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(
				mockUserWithProfile,
			);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: getUserWithProfile 호출
			const result = await userService.getUserWithProfile("user-1");

			// Assert: 사용자와 프로필이 함께 반환되어야 함
			expect(result).toEqual(mockUserWithProfile);
			expect(result.profile).toEqual(mockProfile);
			expect(mockUserRepository.findWithProfile).toHaveBeenCalledWith("user-1");
			expect(mockUserRepository.findWithProfile).toHaveBeenCalledTimes(1);
		});

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange: 사용자가 존재하지 않는 경우 목 설정
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(null);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act & Assert: UserNotFoundError가 던져져야 함
			await expect(
				userService.getUserWithProfile("non-existent"),
			).rejects.toThrow(UserNotFoundError);
			expect(mockUserRepository.findWithProfile).toHaveBeenCalledWith(
				"non-existent",
			);
		});
	});

	describe("updateProfile", () => {
		const updateData: UpdateProfileDTO = {
			fullName: "업데이트된 이름",
			bio: "업데이트된 소개",
		};

		it("프로필이 없으면 새로 생성하고 사용자와 함께 반환한다", async () => {
			// Arrange: 사용자는 존재하지만 프로필이 없는 경우
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(null);
			vi.mocked(mockProfileRepository.create).mockResolvedValue({
				...mockProfile,
				...updateData,
			});
			const updatedUserWithProfile: IUserWithProfile = {
				...mockUser,
				profile: { ...mockProfile, ...updateData },
			};
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(
				updatedUserWithProfile,
			);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: updateProfile 호출
			const result = await userService.updateProfile("user-1", updateData);

			// Assert: 프로필이 생성되고 사용자와 함께 반환되어야 함
			expect(result).toEqual(updatedUserWithProfile);
			expect(mockUserRepository.findById).toHaveBeenCalledWith("user-1");
			expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith("user-1");
			expect(mockProfileRepository.create).toHaveBeenCalledWith({
				userId: "user-1",
				...updateData,
			});
			expect(mockProfileRepository.update).not.toHaveBeenCalled();
		});

		it("프로필이 존재하면 업데이트하고 사용자와 함께 반환한다", async () => {
			// Arrange: 사용자와 프로필이 모두 존재하는 경우
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(
				mockProfile,
			);
			vi.mocked(mockProfileRepository.update).mockResolvedValue({
				...mockProfile,
				...updateData,
			});
			const updatedUserWithProfile: IUserWithProfile = {
				...mockUser,
				profile: { ...mockProfile, ...updateData },
			};
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(
				updatedUserWithProfile,
			);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act: updateProfile 호출
			const result = await userService.updateProfile("user-1", updateData);

			// Assert: 프로필이 업데이트되고 사용자와 함께 반환되어야 함
			expect(result).toEqual(updatedUserWithProfile);
			expect(mockUserRepository.findById).toHaveBeenCalledWith("user-1");
			expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith("user-1");
			expect(mockProfileRepository.update).toHaveBeenCalledWith(
				"user-1",
				updateData,
			);
			expect(mockProfileRepository.create).not.toHaveBeenCalled();
		});

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange: 사용자가 존재하지 않는 경우
			vi.mocked(mockUserRepository.findById).mockResolvedValue(null);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act & Assert: UserNotFoundError가 던져져야 함
			await expect(
				userService.updateProfile("non-existent", updateData),
			).rejects.toThrow(UserNotFoundError);
			expect(mockUserRepository.findById).toHaveBeenCalledWith("non-existent");
			expect(mockProfileRepository.findByUserId).not.toHaveBeenCalled();
		});

		it("프로필 업데이트 후 findWithProfile이 null을 반환하면 UserNotFoundError를 던진다", async () => {
			// Arrange: 프로필 업데이트 후 사용자 조회 실패
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(
				mockProfile,
			);
			vi.mocked(mockProfileRepository.update).mockResolvedValue({
				...mockProfile,
				...updateData,
			});
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(null);
			const userService = createUserService(
				mockUserRepository,
				mockProfileRepository,
			);

			// Act & Assert: UserNotFoundError가 던져져야 함
			await expect(
				userService.updateProfile("user-1", updateData),
			).rejects.toThrow(UserNotFoundError);
		});
	});
});
