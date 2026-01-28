import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createProfileRepositoryImpl,
	createUserRepositoryImpl,
} from "~/infrastructure/persistence/drizzle/user.repository.impl";
import type { IProfile, IUser } from "~/domain/user";

/**
 * User Repository 구현체 테스트
 *
 * Drizzle ORM을 사용한 UserRepository 및 ProfileRepository 구현체에 대한 유닛 테스트.
 * 데이터베이스 클라이언트를 모킹하여 순수 유닛 테스트로 작성.
 */

// 테스트용 Mock 데이터
const mockUser: IUser = {
	id: "user-123",
	name: "테스트 사용자",
	email: "test@example.com",
	emailVerified: true,
	image: "https://example.com/avatar.png",
	createdAt: new Date("2024-01-01T00:00:00Z"),
	updatedAt: new Date("2024-01-01T00:00:00Z"),
};

const mockProfile: IProfile = {
	id: "profile-123",
	userId: "user-123",
	fullName: "테스트 풀네임",
	avatarUrl: "https://example.com/profile.png",
	bio: "테스트 자기소개",
	createdAt: new Date("2024-01-01T00:00:00Z"),
	updatedAt: new Date("2024-01-01T00:00:00Z"),
};

// Drizzle 쿼리 빌더 Mock 타입
interface MockQueryBuilder {
	select: ReturnType<typeof vi.fn>;
	from: ReturnType<typeof vi.fn>;
	where: ReturnType<typeof vi.fn>;
	limit: ReturnType<typeof vi.fn>;
	leftJoin: ReturnType<typeof vi.fn>;
	update: ReturnType<typeof vi.fn>;
	set: ReturnType<typeof vi.fn>;
	returning: ReturnType<typeof vi.fn>;
	insert: ReturnType<typeof vi.fn>;
	values: ReturnType<typeof vi.fn>;
}

/**
 * Mock Drizzle 클라이언트 생성
 * 체이닝 패턴을 지원하는 모킹 헬퍼
 */
const createMockDb = () => {
	const mockBuilder: MockQueryBuilder = {
		select: vi.fn(),
		from: vi.fn(),
		where: vi.fn(),
		limit: vi.fn(),
		leftJoin: vi.fn(),
		update: vi.fn(),
		set: vi.fn(),
		returning: vi.fn(),
		insert: vi.fn(),
		values: vi.fn(),
	};

	// 체이닝 설정
	mockBuilder.select.mockReturnValue(mockBuilder);
	mockBuilder.from.mockReturnValue(mockBuilder);
	mockBuilder.where.mockReturnValue(mockBuilder);
	mockBuilder.leftJoin.mockReturnValue(mockBuilder);
	mockBuilder.update.mockReturnValue(mockBuilder);
	mockBuilder.set.mockReturnValue(mockBuilder);
	mockBuilder.insert.mockReturnValue(mockBuilder);
	mockBuilder.values.mockReturnValue(mockBuilder);

	return mockBuilder;
};

describe("createUserRepositoryImpl", () => {
	let mockDb: MockQueryBuilder;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb = createMockDb();
	});

	describe("findById", () => {
		it("ID로 사용자를 찾으면 사용자 객체를 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([mockUser]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findById("user-123");

			// Assert
			expect(result).toEqual(mockUser);
			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.from).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.limit).toHaveBeenCalledWith(1);
		});

		it("존재하지 않는 ID로 조회하면 null을 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findById("non-existent-id");

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("findByEmail", () => {
		it("이메일로 사용자를 찾으면 사용자 객체를 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([mockUser]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findByEmail("test@example.com");

			// Assert
			expect(result).toEqual(mockUser);
			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.from).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.limit).toHaveBeenCalledWith(1);
		});

		it("존재하지 않는 이메일로 조회하면 null을 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findByEmail("notfound@example.com");

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("findWithProfile", () => {
		it("사용자와 프로필을 함께 조회하면 조인된 결과를 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([
				{
					user: mockUser,
					profiles: mockProfile,
				},
			]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findWithProfile("user-123");

			// Assert
			expect(result).toEqual({
				...mockUser,
				profile: mockProfile,
			});
			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.from).toHaveBeenCalled();
			expect(mockDb.leftJoin).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.limit).toHaveBeenCalledWith(1);
		});

		it("프로필이 없는 사용자를 조회하면 profile이 null인 결과를 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([
				{
					user: mockUser,
					profiles: null,
				},
			]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findWithProfile("user-123");

			// Assert
			expect(result).toEqual({
				...mockUser,
				profile: null,
			});
		});

		it("존재하지 않는 사용자 ID로 조회하면 null을 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.findWithProfile("non-existent-id");

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("update", () => {
		it("사용자 정보를 업데이트하면 업데이트된 사용자를 반환한다", async () => {
			// Arrange
			const updatedUser: IUser = {
				...mockUser,
				name: "업데이트된 이름",
				updatedAt: new Date("2024-06-01T00:00:00Z"),
			};
			mockDb.returning.mockResolvedValue([updatedUser]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			const result = await userRepository.update("user-123", {
				name: "업데이트된 이름",
			});

			// Assert
			expect(result).toEqual(updatedUser);
			expect(mockDb.update).toHaveBeenCalled();
			expect(mockDb.set).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.returning).toHaveBeenCalled();
		});

		it("업데이트 시 updatedAt이 설정된다", async () => {
			// Arrange
			const updatedUser: IUser = {
				...mockUser,
				name: "업데이트된 이름",
				updatedAt: new Date(),
			};
			mockDb.returning.mockResolvedValue([updatedUser]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act
			await userRepository.update("user-123", { name: "업데이트된 이름" });

			// Assert
			expect(mockDb.set).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "업데이트된 이름",
					updatedAt: expect.any(Date),
				}),
			);
		});

		it("존재하지 않는 사용자를 업데이트하면 에러를 던진다", async () => {
			// Arrange
			mockDb.returning.mockResolvedValue([]);
			const userRepository = createUserRepositoryImpl(
				mockDb as unknown as Parameters<typeof createUserRepositoryImpl>[0],
			);

			// Act & Assert
			await expect(
				userRepository.update("non-existent-id", { name: "새 이름" }),
			).rejects.toThrow("사용자를 찾을 수 없습니다.");
		});
	});
});

describe("createProfileRepositoryImpl", () => {
	let mockDb: MockQueryBuilder;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDb = createMockDb();
	});

	describe("findByUserId", () => {
		it("사용자 ID로 프로필을 찾으면 프로필 객체를 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([mockProfile]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			const result = await profileRepository.findByUserId("user-123");

			// Assert
			expect(result).toEqual(mockProfile);
			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.from).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.limit).toHaveBeenCalledWith(1);
		});

		it("프로필이 없는 사용자 ID로 조회하면 null을 반환한다", async () => {
			// Arrange
			mockDb.limit.mockResolvedValue([]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			const result = await profileRepository.findByUserId("user-without-profile");

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("create", () => {
		it("새로운 프로필을 생성하면 생성된 프로필을 반환한다", async () => {
			// Arrange
			mockDb.returning.mockResolvedValue([mockProfile]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			const result = await profileRepository.create({
				userId: "user-123",
				fullName: "테스트 풀네임",
				avatarUrl: "https://example.com/profile.png",
				bio: "테스트 자기소개",
			});

			// Assert
			expect(result).toEqual(mockProfile);
			expect(mockDb.insert).toHaveBeenCalled();
			expect(mockDb.values).toHaveBeenCalledWith({
				userId: "user-123",
				fullName: "테스트 풀네임",
				avatarUrl: "https://example.com/profile.png",
				bio: "테스트 자기소개",
			});
			expect(mockDb.returning).toHaveBeenCalled();
		});

		it("선택적 필드 없이 프로필을 생성할 수 있다", async () => {
			// Arrange
			const minimalProfile: IProfile = {
				...mockProfile,
				fullName: null,
				avatarUrl: null,
				bio: null,
			};
			mockDb.returning.mockResolvedValue([minimalProfile]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			const result = await profileRepository.create({
				userId: "user-123",
			});

			// Assert
			expect(result).toEqual(minimalProfile);
			expect(mockDb.values).toHaveBeenCalledWith({
				userId: "user-123",
				fullName: null,
				avatarUrl: null,
				bio: null,
			});
		});
	});

	describe("update", () => {
		it("프로필을 업데이트하면 업데이트된 프로필을 반환한다", async () => {
			// Arrange
			const updatedProfile: IProfile = {
				...mockProfile,
				fullName: "업데이트된 풀네임",
				bio: "업데이트된 자기소개",
				updatedAt: new Date("2024-06-01T00:00:00Z"),
			};
			mockDb.returning.mockResolvedValue([updatedProfile]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			const result = await profileRepository.update("user-123", {
				fullName: "업데이트된 풀네임",
				bio: "업데이트된 자기소개",
			});

			// Assert
			expect(result).toEqual(updatedProfile);
			expect(mockDb.update).toHaveBeenCalled();
			expect(mockDb.set).toHaveBeenCalled();
			expect(mockDb.where).toHaveBeenCalled();
			expect(mockDb.returning).toHaveBeenCalled();
		});

		it("업데이트 시 updatedAt이 설정된다", async () => {
			// Arrange
			const updatedProfile: IProfile = {
				...mockProfile,
				fullName: "업데이트된 풀네임",
				updatedAt: new Date(),
			};
			mockDb.returning.mockResolvedValue([updatedProfile]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act
			await profileRepository.update("user-123", { fullName: "업데이트된 풀네임" });

			// Assert
			expect(mockDb.set).toHaveBeenCalledWith(
				expect.objectContaining({
					fullName: "업데이트된 풀네임",
					updatedAt: expect.any(Date),
				}),
			);
		});

		it("존재하지 않는 사용자의 프로필을 업데이트하면 에러를 던진다", async () => {
			// Arrange
			mockDb.returning.mockResolvedValue([]);
			const profileRepository = createProfileRepositoryImpl(
				mockDb as unknown as Parameters<typeof createProfileRepositoryImpl>[0],
			);

			// Act & Assert
			await expect(
				profileRepository.update("non-existent-user", { fullName: "새 이름" }),
			).rejects.toThrow("프로필을 찾을 수 없습니다.");
		});
	});
});
