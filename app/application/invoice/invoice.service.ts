/**
 * Invoice Application Service
 *
 * Invoice 관련 비즈니스 로직을 처리하는 Application Service
 */

import type { CompanyInfo } from "~/domain/company";
import type { Invoice, InvoiceWithLineItems } from "~/domain/invoice";
import { InvoiceNotFoundError } from "./errors";
import type { CompanyRepository, InvoiceRepository } from "./invoice.port";

/**
 * InvoiceService 의존성 인터페이스
 */
export interface InvoiceServiceDeps {
	invoiceRepository: InvoiceRepository;
	companyRepository: CompanyRepository;
}

/**
 * Invoice 상세 조회 결과 타입
 */
export interface InvoiceDetailResult {
	invoice: InvoiceWithLineItems;
	company: CompanyInfo;
}

/**
 * InvoiceService 인터페이스
 */
export interface InvoiceService {
	getInvoiceList(): Promise<Invoice[]>;
	getInvoiceDetail(invoiceId: string): Promise<InvoiceDetailResult>;
}

/**
 * InvoiceService 팩토리 함수
 *
 * @param deps - Service 의존성
 * @returns InvoiceService 구현체
 */
export const createInvoiceService = (
	deps: InvoiceServiceDeps,
): InvoiceService => {
	return {
		/**
		 * 인보이스 목록 조회
		 *
		 * @returns 모든 인보이스 목록
		 */
		getInvoiceList: async () => {
			return deps.invoiceRepository.findAll();
		},

		/**
		 * 인보이스 상세 조회
		 *
		 * 인보이스와 회사 정보를 병렬로 조회하여 성능을 최적화합니다.
		 *
		 * @param invoiceId - 조회할 인보이스 ID
		 * @returns 인보이스 상세 정보와 회사 정보
		 * @throws InvoiceNotFoundError 인보이스가 존재하지 않는 경우
		 * @throws Error 데이터 조회 중 오류 발생 시 (컨텍스트 포함)
		 */
		getInvoiceDetail: async (invoiceId: string) => {
			try {
				// Invoice와 Company 정보를 병렬로 조회하여 성능 최적화
				const [invoice, company] = await Promise.all([
					deps.invoiceRepository.findById(invoiceId),
					deps.companyRepository.getCompanyInfo(),
				]);

				if (!invoice) {
					throw new InvoiceNotFoundError(invoiceId);
				}

				return { invoice, company };
			} catch (error) {
				// 알려진 도메인 에러는 그대로 throw
				if (error instanceof InvoiceNotFoundError) {
					throw error;
				}
				// 기타 에러는 컨텍스트를 추가하여 wrap
				throw new Error(
					`Failed to fetch invoice detail (ID: ${invoiceId}): ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}
		},
	};
};
