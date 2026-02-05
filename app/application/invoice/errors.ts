/**
 * Invoice Application Layer 커스텀 에러 클래스
 *
 * 도메인 에러를 표현하는 커스텀 에러 클래스 정의
 */

/**
 * Invoice를 찾을 수 없을 때 발생하는 에러
 */
export class InvoiceNotFoundError extends Error {
	constructor(invoiceId: string) {
		super(`Invoice not found: ${invoiceId}`);
		this.name = "InvoiceNotFoundError";
	}
}

/**
 * Notion API 호출 중 발생하는 에러
 */
export class NotionApiError extends Error {
	constructor(
		message: string,
		public readonly cause?: unknown,
	) {
		super(message);
		this.name = "NotionApiError";
	}
}

/**
 * 데이터 검증 실패 시 발생하는 에러
 */
export class ValidationError extends Error {
	constructor(
		message: string,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = "ValidationError";
	}
}
