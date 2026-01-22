/**
 * 공통 타입 정의
 *
 * 모든 도메인에서 공유하는 기본 타입들을 정의합니다.
 */

/**
 * 기본 엔티티 인터페이스
 *
 * 모든 엔티티가 구현해야 하는 기본 속성
 */
export interface BaseEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Result 타입 (함수형 에러 처리)
 *
 * 성공/실패를 명시적으로 표현하는 Result 패턴
 */
export type Result<T, E extends Error = Error> =
	| { success: true; data: T }
	| { success: false; error: E };

/**
 * Pagination 타입
 *
 * 페이지네이션 관련 타입 정의
 */
export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
