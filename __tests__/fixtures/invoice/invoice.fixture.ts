/**
 * Invoice 테스트용 fixture 빌더
 *
 * TDD Red 단계에서 사용할 테스트 데이터를 생성합니다.
 */

/**
 * InvoiceStatus 열거형 값
 */
export const INVOICE_STATUS = {
	DRAFT: "Draft",
	SENT: "Sent",
	PAID: "Paid",
	OVERDUE: "Overdue",
} as const;

/**
 * 유효한 Invoice 데이터 빌더
 */
export const createValidInvoiceData = (
	overrides: Partial<{
		invoice_id: string;
		invoice_number: string;
		client_name: string;
		client_email: string;
		client_address: string;
		issue_date: Date | string;
		due_date: Date | string;
		status: string;
		subtotal: number;
		tax_rate: number;
		tax_amount: number;
		total_amount: number;
		currency: string;
		notes: string;
		created_at: Date | string;
	}> = {},
) => ({
	invoice_id: "inv-001",
	invoice_number: "INV-2024-001",
	client_name: "Test Client",
	client_email: "client@example.com",
	client_address: "123 Test Street, Test City",
	issue_date: new Date("2024-01-15"),
	due_date: new Date("2024-02-15"),
	status: INVOICE_STATUS.DRAFT,
	subtotal: 1000,
	tax_rate: 10,
	tax_amount: 100,
	total_amount: 1100,
	currency: "USD",
	notes: "Test notes",
	created_at: new Date("2024-01-15"),
	...overrides,
});

/**
 * 유효한 InvoiceLineItem 데이터 빌더
 */
export const createValidLineItemData = (
	overrides: Partial<{
		id: string;
		invoice_id: string;
		description: string;
		quantity: number;
		unit_price: number;
		line_total: number;
		sort_order: number;
	}> = {},
) => ({
	id: "line-001",
	invoice_id: "inv-001",
	description: "Test Service",
	quantity: 2,
	unit_price: 500,
	line_total: 1000,
	sort_order: 1,
	...overrides,
});

/**
 * 유효한 InvoiceWithLineItems 데이터 빌더
 */
export const createValidInvoiceWithLineItemsData = (
	invoiceOverrides: Parameters<typeof createValidInvoiceData>[0] = {},
	lineItems: Parameters<typeof createValidLineItemData>[0][] = [{}],
) => ({
	...createValidInvoiceData(invoiceOverrides),
	line_items: lineItems.map((item, index) =>
		createValidLineItemData({
			id: `line-${String(index + 1).padStart(3, "0")}`,
			sort_order: index + 1,
			...item,
		}),
	),
});

/**
 * 잘못된 Invoice 데이터 케이스들
 */
export const invalidInvoiceDataCases = {
	missingRequiredField: {
		invoice_number: "INV-2024-001",
		// invoice_id 누락
	},
	invalidEmail: createValidInvoiceData({
		client_email: "invalid-email",
	}),
	invalidStatus: createValidInvoiceData({
		status: "InvalidStatus",
	}),
	negativeSubtotal: createValidInvoiceData({
		subtotal: -100,
	}),
	negativeTaxRate: createValidInvoiceData({
		tax_rate: -10,
	}),
	emptyInvoiceNumber: createValidInvoiceData({
		invoice_number: "",
	}),
	emptyClientName: createValidInvoiceData({
		client_name: "",
	}),
};

/**
 * 잘못된 LineItem 데이터 케이스들
 */
export const invalidLineItemDataCases = {
	missingDescription: {
		id: "line-001",
		invoice_id: "inv-001",
		quantity: 2,
		unit_price: 500,
		line_total: 1000,
		sort_order: 1,
	},
	negativeQuantity: createValidLineItemData({
		quantity: -1,
	}),
	negativeUnitPrice: createValidLineItemData({
		unit_price: -500,
	}),
	negativeSortOrder: createValidLineItemData({
		sort_order: -1,
	}),
	emptyDescription: createValidLineItemData({
		description: "",
	}),
};
