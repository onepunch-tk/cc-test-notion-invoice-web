/**
 * InvoiceService 단위 테스트
 *
 * Invoice 관련 비즈니스 로직을 처리하는 Application Service 테스트
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvoiceNotFoundError } from "~/application/invoice/errors";
import type {
	CompanyRepository,
	InvoiceRepository,
} from "~/application/invoice/invoice.port";
import {
	createInvoiceService,
	type InvoiceServiceDeps,
} from "~/application/invoice/invoice.service";
import type { CompanyInfo } from "~/domain/company";
import type { Invoice, InvoiceWithLineItems } from "~/domain/invoice";
import { createValidCompanyInfoData } from "../../fixtures/company/company.fixture";
import {
	createValidInvoiceData,
	createValidInvoiceWithLineItemsData,
} from "../../fixtures/invoice/invoice.fixture";

describe("createInvoiceService", () => {
	let mockInvoiceRepository: InvoiceRepository;
	let mockCompanyRepository: CompanyRepository;
	let serviceDeps: InvoiceServiceDeps;

	beforeEach(() => {
		vi.clearAllMocks();

		// InvoiceRepository Mock 생성
		mockInvoiceRepository = {
			findAll: vi.fn(),
			findById: vi.fn(),
			findLineItems: vi.fn(),
		};

		// CompanyRepository Mock 생성
		mockCompanyRepository = {
			getCompanyInfo: vi.fn(),
		};

		// Service Dependencies 구성
		serviceDeps = {
			invoiceRepository: mockInvoiceRepository,
			companyRepository: mockCompanyRepository,
		};
	});

	describe("getInvoiceList", () => {
		it("Invoice 목록을 Repository에서 조회하여 반환한다", async () => {
			// Arrange
			const mockInvoices: Invoice[] = [
				createValidInvoiceData({
					invoice_id: "inv-001",
					invoice_number: "INV-2024-001",
					issue_date: new Date("2024-01-15"),
					due_date: new Date("2024-02-15"),
					created_at: new Date("2024-01-15"),
				}) as Invoice,
				createValidInvoiceData({
					invoice_id: "inv-002",
					invoice_number: "INV-2024-002",
					issue_date: new Date("2024-01-16"),
					due_date: new Date("2024-02-16"),
					created_at: new Date("2024-01-16"),
				}) as Invoice,
			];

			vi.mocked(mockInvoiceRepository.findAll).mockResolvedValue(mockInvoices);

			const service = createInvoiceService(serviceDeps);

			// Act
			const result = await service.getInvoiceList();

			// Assert
			expect(mockInvoiceRepository.findAll).toHaveBeenCalledOnce();
			expect(result).toEqual(mockInvoices);
			expect(result).toHaveLength(2);
			expect(result[0].invoice_id).toBe("inv-001");
			expect(result[1].invoice_id).toBe("inv-002");
		});

		it("Invoice가 없을 경우 빈 배열을 반환한다", async () => {
			// Arrange
			vi.mocked(mockInvoiceRepository.findAll).mockResolvedValue([]);

			const service = createInvoiceService(serviceDeps);

			// Act
			const result = await service.getInvoiceList();

			// Assert
			expect(mockInvoiceRepository.findAll).toHaveBeenCalledOnce();
			expect(result).toEqual([]);
			expect(result).toHaveLength(0);
		});

		it("Repository 오류 발생 시 에러를 전파한다", async () => {
			// Arrange
			const error = new Error("Repository Error");
			vi.mocked(mockInvoiceRepository.findAll).mockRejectedValue(error);

			const service = createInvoiceService(serviceDeps);

			// Act & Assert
			await expect(service.getInvoiceList()).rejects.toThrow(
				"Repository Error",
			);
			expect(mockInvoiceRepository.findAll).toHaveBeenCalledOnce();
		});
	});

	describe("getInvoiceDetail", () => {
		it("Invoice ID로 Invoice 상세 정보와 회사 정보를 함께 조회하여 반환한다", async () => {
			// Arrange
			const invoiceId = "inv-001";
			const mockInvoiceWithLineItems: InvoiceWithLineItems =
				createValidInvoiceWithLineItemsData(
					{
						invoice_id: invoiceId,
						issue_date: new Date("2024-01-15"),
						due_date: new Date("2024-02-15"),
						created_at: new Date("2024-01-15"),
					},
					[
						{ id: "line-001", description: "Service 1", line_total: 500 },
						{ id: "line-002", description: "Service 2", line_total: 500 },
					],
				) as InvoiceWithLineItems;
			const mockCompanyInfo: CompanyInfo = createValidCompanyInfoData({
				company_name: "Test Company Inc.",
			}) as CompanyInfo;

			vi.mocked(mockInvoiceRepository.findById).mockResolvedValue(
				mockInvoiceWithLineItems,
			);
			vi.mocked(mockCompanyRepository.getCompanyInfo).mockResolvedValue(
				mockCompanyInfo,
			);

			const service = createInvoiceService(serviceDeps);

			// Act
			const result = await service.getInvoiceDetail(invoiceId);

			// Assert
			expect(mockInvoiceRepository.findById).toHaveBeenCalledWith(invoiceId);
			expect(mockInvoiceRepository.findById).toHaveBeenCalledOnce();
			expect(mockCompanyRepository.getCompanyInfo).toHaveBeenCalledOnce();

			expect(result.invoice).toEqual(mockInvoiceWithLineItems);
			expect(result.invoice.invoice_id).toBe(invoiceId);
			expect(result.invoice.line_items).toHaveLength(2);

			expect(result.company).toEqual(mockCompanyInfo);
			expect(result.company.company_name).toBe("Test Company Inc.");
		});

		it("존재하지 않는 Invoice ID로 조회 시 InvoiceNotFoundError를 발생시킨다", async () => {
			// Arrange
			const invoiceId = "non-existent-id";

			vi.mocked(mockInvoiceRepository.findById).mockResolvedValue(null);

			const service = createInvoiceService(serviceDeps);

			// Act & Assert
			await expect(service.getInvoiceDetail(invoiceId)).rejects.toThrow(
				InvoiceNotFoundError,
			);
			await expect(service.getInvoiceDetail(invoiceId)).rejects.toThrow(
				`Invoice not found: ${invoiceId}`,
			);

			expect(mockInvoiceRepository.findById).toHaveBeenCalledWith(invoiceId);
			expect(mockCompanyRepository.getCompanyInfo).not.toHaveBeenCalled();
		});

		it("Invoice Repository 오류 발생 시 에러를 전파한다", async () => {
			// Arrange
			const invoiceId = "inv-001";
			const error = new Error("Invoice Repository Error");

			vi.mocked(mockInvoiceRepository.findById).mockRejectedValue(error);

			const service = createInvoiceService(serviceDeps);

			// Act & Assert
			await expect(service.getInvoiceDetail(invoiceId)).rejects.toThrow(
				"Invoice Repository Error",
			);
			expect(mockInvoiceRepository.findById).toHaveBeenCalledWith(invoiceId);
			expect(mockCompanyRepository.getCompanyInfo).not.toHaveBeenCalled();
		});

		it("Company Repository 오류 발생 시 에러를 전파한다", async () => {
			// Arrange
			const invoiceId = "inv-001";
			const mockInvoiceWithLineItems: InvoiceWithLineItems =
				createValidInvoiceWithLineItemsData({
					invoice_id: invoiceId,
					issue_date: new Date("2024-01-15"),
					due_date: new Date("2024-02-15"),
					created_at: new Date("2024-01-15"),
				}) as InvoiceWithLineItems;
			const error = new Error("Company Repository Error");

			vi.mocked(mockInvoiceRepository.findById).mockResolvedValue(
				mockInvoiceWithLineItems,
			);
			vi.mocked(mockCompanyRepository.getCompanyInfo).mockRejectedValue(error);

			const service = createInvoiceService(serviceDeps);

			// Act & Assert
			await expect(service.getInvoiceDetail(invoiceId)).rejects.toThrow(
				"Company Repository Error",
			);
			expect(mockInvoiceRepository.findById).toHaveBeenCalledWith(invoiceId);
			expect(mockCompanyRepository.getCompanyInfo).toHaveBeenCalledOnce();
		});
	});
});
