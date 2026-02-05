/**
 * DI Container 인터페이스
 *
 * Presentation 레이어에서 Infrastructure 의존성을 제거하기 위한 추상화
 * Application과 Domain 레이어만 노출합니다.
 */

import type { InvoiceService } from "~/application/invoice/invoice.service";

/**
 * Application Container 인터페이스
 *
 * Presentation 레이어에서 사용할 수 있는 서비스들을 정의합니다.
 */
export interface IContainer {
	/**
	 * Invoice 관련 비즈니스 로직을 처리하는 서비스
	 */
	invoiceService: InvoiceService;
}
