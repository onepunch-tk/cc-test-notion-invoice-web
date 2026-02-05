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
		getInvoiceList: async () => {
			return deps.invoiceRepository.findAll();
		},
		getInvoiceDetail: async (invoiceId: string) => {
			const invoice = await deps.invoiceRepository.findById(invoiceId);
			if (!invoice) {
				throw new InvoiceNotFoundError(invoiceId);
			}
			const company = await deps.companyRepository.getCompanyInfo();
			return { invoice, company };
		},
	};
};
