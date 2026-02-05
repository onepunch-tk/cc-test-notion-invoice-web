/**
 * Invoice Application Layer Port 인터페이스 테스트
 *
 * 인터페이스 규약 준수를 검증하기 위한 최소한의 테스트
 * Note: Port 인터페이스는 일반적으로 테스트 대상에서 제외되지만,
 * 명시적 요청에 따라 타입 안정성 검증을 위한 테스트 작성
 */

import type {
	CompanyRepository,
	InvoiceRepository,
} from "~/application/invoice/invoice.port";
import { createValidCompanyInfoData } from "../../fixtures/company/company.fixture";
import {
	createValidInvoiceData,
	createValidInvoiceWithLineItemsData,
	createValidLineItemData,
} from "../../fixtures/invoice/invoice.fixture";

describe("InvoiceRepository 인터페이스", () => {
	describe("인터페이스 구현 검증", () => {
		it("findAll 메서드를 구현한 Mock이 인터페이스를 만족해야 한다", async () => {
			// Arrange
			const mockRepository: InvoiceRepository = {
				findAll: async () => [
					createValidInvoiceData() as never,
					createValidInvoiceData({ invoice_id: "inv-002" }) as never,
				],
				findById: async () => null,
				findLineItems: async () => [],
			};

			// Act
			const result = await mockRepository.findAll();

			// Assert
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(2);
		});

		it("findById 메서드를 구현한 Mock이 인터페이스를 만족해야 한다", async () => {
			// Arrange
			const mockInvoice = createValidInvoiceWithLineItemsData();
			const mockRepository: InvoiceRepository = {
				findAll: async () => [],
				findById: async (invoiceId: string) => {
					if (invoiceId === "inv-001") {
						return mockInvoice as never;
					}
					return null;
				},
				findLineItems: async () => [],
			};

			// Act
			const result = await mockRepository.findById("inv-001");
			const notFound = await mockRepository.findById("non-existent");

			// Assert
			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			expect(notFound).toBeNull();
		});

		it("findLineItems 메서드를 구현한 Mock이 인터페이스를 만족해야 한다", async () => {
			// Arrange
			const mockLineItems = [
				createValidLineItemData(),
				createValidLineItemData({ id: "line-002" }),
			];
			const mockRepository: InvoiceRepository = {
				findAll: async () => [],
				findById: async () => null,
				findLineItems: async (invoiceId: string) => {
					if (invoiceId === "inv-001") {
						return mockLineItems as never;
					}
					return [];
				},
			};

			// Act
			const result = await mockRepository.findLineItems("inv-001");
			const empty = await mockRepository.findLineItems("non-existent");

			// Assert
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(2);
			expect(empty).toHaveLength(0);
		});
	});

	describe("메서드 시그니처 검증", () => {
		it("findAll은 Promise<Invoice[]>를 반환해야 한다", async () => {
			// Arrange
			const mockRepository: InvoiceRepository = {
				findAll: async () => [],
				findById: async () => null,
				findLineItems: async () => [],
			};

			// Act
			const promise = mockRepository.findAll();

			// Assert
			expect(promise).toBeInstanceOf(Promise);
			const result = await promise;
			expect(Array.isArray(result)).toBe(true);
		});

		it("findById는 string을 받고 Promise<InvoiceWithLineItems | null>을 반환해야 한다", async () => {
			// Arrange
			const mockRepository: InvoiceRepository = {
				findAll: async () => [],
				findById: async () => null,
				findLineItems: async () => [],
			};

			// Act
			const promise = mockRepository.findById("inv-001");

			// Assert
			expect(promise).toBeInstanceOf(Promise);
			const result = await promise;
			// null이거나 InvoiceWithLineItems 객체여야 함
			expect(result === null || typeof result === "object").toBe(true);
		});

		it("findLineItems는 string을 받고 Promise<InvoiceLineItem[]>을 반환해야 한다", async () => {
			// Arrange
			const mockRepository: InvoiceRepository = {
				findAll: async () => [],
				findById: async () => null,
				findLineItems: async () => [],
			};

			// Act
			const promise = mockRepository.findLineItems("inv-001");

			// Assert
			expect(promise).toBeInstanceOf(Promise);
			const result = await promise;
			expect(Array.isArray(result)).toBe(true);
		});
	});
});

describe("CompanyRepository 인터페이스", () => {
	describe("인터페이스 구현 검증", () => {
		it("getCompanyInfo 메서드를 구현한 Mock이 인터페이스를 만족해야 한다", async () => {
			// Arrange
			const mockCompanyInfo = createValidCompanyInfoData();
			const mockRepository: CompanyRepository = {
				getCompanyInfo: async () => mockCompanyInfo as never,
			};

			// Act
			const result = await mockRepository.getCompanyInfo();

			// Assert
			expect(result).toBeDefined();
			expect(result).toEqual(mockCompanyInfo);
		});

		it("다른 회사 정보를 반환하는 구현도 인터페이스를 만족해야 한다", async () => {
			// Arrange
			const customCompanyInfo = createValidCompanyInfoData({
				company_name: "Another Company",
				tax_id: "TAX-987654321",
			});
			const mockRepository: CompanyRepository = {
				getCompanyInfo: async () => customCompanyInfo as never,
			};

			// Act
			const result = await mockRepository.getCompanyInfo();

			// Assert
			expect(result).toBeDefined();
			expect(result.company_name).toBe("Another Company");
			expect(result.tax_id).toBe("TAX-987654321");
		});
	});

	describe("메서드 시그니처 검증", () => {
		it("getCompanyInfo는 Promise<CompanyInfo>를 반환해야 한다", async () => {
			// Arrange
			const mockCompanyInfo = createValidCompanyInfoData();
			const mockRepository: CompanyRepository = {
				getCompanyInfo: async () => mockCompanyInfo as never,
			};

			// Act
			const promise = mockRepository.getCompanyInfo();

			// Assert
			expect(promise).toBeInstanceOf(Promise);
			const result = await promise;
			expect(typeof result).toBe("object");
			expect(result).not.toBeNull();
		});
	});
});

describe("Repository 인터페이스 타입 안정성", () => {
	it("InvoiceRepository 타입은 모든 필수 메서드를 요구해야 한다", () => {
		// Arrange
		// 이 테스트는 컴파일 타임에 타입 체크를 검증합니다
		// @ts-expect-error - findAll 메서드 누락
		const incomplete1: InvoiceRepository = {
			findById: async () => null,
			findLineItems: async () => [],
		};

		// @ts-expect-error - findById 메서드 누락
		const incomplete2: InvoiceRepository = {
			findAll: async () => [],
			findLineItems: async () => [],
		};

		// @ts-expect-error - findLineItems 메서드 누락
		const incomplete3: InvoiceRepository = {
			findAll: async () => [],
			findById: async () => null,
		};

		// Assert
		// 타입스크립트가 위의 에러를 감지하면 테스트 통과
		expect(incomplete1).toBeDefined();
		expect(incomplete2).toBeDefined();
		expect(incomplete3).toBeDefined();
	});

	it("CompanyRepository 타입은 모든 필수 메서드를 요구해야 한다", () => {
		// Arrange
		// @ts-expect-error - getCompanyInfo 메서드 누락
		const incomplete: CompanyRepository = {};

		// Assert
		expect(incomplete).toBeDefined();
	});

	it("완전한 구현은 타입 에러 없이 할당 가능해야 한다", async () => {
		// Arrange
		const completeInvoiceRepo: InvoiceRepository = {
			findAll: async () => [],
			findById: async () => null,
			findLineItems: async () => [],
		};

		const completeCompanyRepo: CompanyRepository = {
			getCompanyInfo: async () => createValidCompanyInfoData() as never,
		};

		// Act & Assert
		expect(completeInvoiceRepo).toBeDefined();
		expect(completeCompanyRepo).toBeDefined();

		// 메서드 호출 가능 검증
		await completeInvoiceRepo.findAll();
		await completeInvoiceRepo.findById("test");
		await completeInvoiceRepo.findLineItems("test");
		await completeCompanyRepo.getCompanyInfo();
	});
});
