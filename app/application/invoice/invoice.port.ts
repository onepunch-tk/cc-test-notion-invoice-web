/**
 * Invoice Application Layer Port 인터페이스
 *
 * Repository 인터페이스 정의 (Hexagonal Architecture의 Port 역할)
 */

import type { CompanyInfo } from "~/domain/company";
import type {
	Invoice,
	InvoiceLineItem,
	InvoiceWithLineItems,
} from "~/domain/invoice";

/**
 * Invoice Repository 인터페이스
 *
 * Invoice 데이터에 대한 영속성 계층 추상화
 */
export interface InvoiceRepository {
	/**
	 * 모든 Invoice 목록 조회
	 */
	findAll(): Promise<Invoice[]>;

	/**
	 * ID로 특정 Invoice 조회 (LineItems 포함)
	 *
	 * @param invoiceId - 조회할 Invoice ID
	 * @returns Invoice와 LineItems 또는 null (존재하지 않는 경우)
	 */
	findById(invoiceId: string): Promise<InvoiceWithLineItems | null>;

	/**
	 * 특정 Invoice의 LineItems 조회
	 *
	 * @param invoiceId - Invoice ID
	 * @returns LineItems 배열
	 */
	findLineItems(invoiceId: string): Promise<InvoiceLineItem[]>;
}

/**
 * Company Repository 인터페이스
 *
 * 회사 정보에 대한 영속성 계층 추상화
 */
export interface CompanyRepository {
	/**
	 * 회사 정보 조회
	 *
	 * @returns 회사 정보
	 */
	getCompanyInfo(): Promise<CompanyInfo>;
}
