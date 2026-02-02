import {
	invoiceLineItemSchema,
	invoiceSchema,
	invoiceStatusSchema,
	invoiceWithLineItemsSchema,
} from "~/domain/invoice";
import {
	createValidInvoiceData,
	createValidInvoiceWithLineItemsData,
	createValidLineItemData,
	INVOICE_STATUS,
	invalidInvoiceDataCases,
	invalidLineItemDataCases,
} from "../../fixtures/invoice/invoice.fixture";

describe("invoiceStatusSchema", () => {
	describe("유효한 상태값 파싱", () => {
		it("Draft 상태를 파싱할 수 있어야 한다", () => {
			// Arrange
			const status = INVOICE_STATUS.DRAFT;

			// Act
			const result = invoiceStatusSchema.safeParse(status);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("Draft");
			}
		});

		it("Sent 상태를 파싱할 수 있어야 한다", () => {
			// Arrange
			const status = INVOICE_STATUS.SENT;

			// Act
			const result = invoiceStatusSchema.safeParse(status);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("Sent");
			}
		});

		it("Paid 상태를 파싱할 수 있어야 한다", () => {
			// Arrange
			const status = INVOICE_STATUS.PAID;

			// Act
			const result = invoiceStatusSchema.safeParse(status);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("Paid");
			}
		});

		it("Overdue 상태를 파싱할 수 있어야 한다", () => {
			// Arrange
			const status = INVOICE_STATUS.OVERDUE;

			// Act
			const result = invoiceStatusSchema.safeParse(status);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe("Overdue");
			}
		});
	});

	describe("유효하지 않은 상태값 거부", () => {
		it("유효하지 않은 상태값을 거부해야 한다", () => {
			// Arrange
			const invalidStatus = "InvalidStatus";

			// Act
			const result = invoiceStatusSchema.safeParse(invalidStatus);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 문자열을 거부해야 한다", () => {
			// Arrange
			const emptyStatus = "";

			// Act
			const result = invoiceStatusSchema.safeParse(emptyStatus);

			// Assert
			expect(result.success).toBe(false);
		});

		it("숫자를 거부해야 한다", () => {
			// Arrange
			const numericStatus = 1;

			// Act
			const result = invoiceStatusSchema.safeParse(numericStatus);

			// Assert
			expect(result.success).toBe(false);
		});
	});
});

describe("invoiceLineItemSchema", () => {
	describe("유효한 LineItem 파싱", () => {
		it("유효한 LineItem 데이터를 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidLineItemData();

			// Act
			const result = invoiceLineItemSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(validData.id);
				expect(result.data.invoice_id).toBe(validData.invoice_id);
				expect(result.data.description).toBe(validData.description);
				expect(result.data.quantity).toBe(validData.quantity);
				expect(result.data.unit_price).toBe(validData.unit_price);
				expect(result.data.line_total).toBe(validData.line_total);
				expect(result.data.sort_order).toBe(validData.sort_order);
			}
		});

		it("커스텀 값으로 LineItem 데이터를 파싱할 수 있어야 한다", () => {
			// Arrange
			const customData = createValidLineItemData({
				description: "Custom Service",
				quantity: 5,
				unit_price: 200,
				line_total: 1000,
			});

			// Act
			const result = invoiceLineItemSchema.safeParse(customData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.description).toBe("Custom Service");
				expect(result.data.quantity).toBe(5);
				expect(result.data.unit_price).toBe(200);
				expect(result.data.line_total).toBe(1000);
			}
		});
	});

	describe("유효하지 않은 LineItem 거부", () => {
		it("description이 누락된 데이터를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidLineItemDataCases.missingDescription;

			// Act
			const result = invoiceLineItemSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("음수 quantity를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidLineItemDataCases.negativeQuantity;

			// Act
			const result = invoiceLineItemSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("음수 unit_price를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidLineItemDataCases.negativeUnitPrice;

			// Act
			const result = invoiceLineItemSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("음수 sort_order를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidLineItemDataCases.negativeSortOrder;

			// Act
			const result = invoiceLineItemSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 description을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidLineItemDataCases.emptyDescription;

			// Act
			const result = invoiceLineItemSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});
	});
});

describe("invoiceSchema", () => {
	describe("유효한 Invoice 파싱", () => {
		it("유효한 Invoice 데이터를 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidInvoiceData();

			// Act
			const result = invoiceSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.invoice_id).toBe(validData.invoice_id);
				expect(result.data.invoice_number).toBe(validData.invoice_number);
				expect(result.data.client_name).toBe(validData.client_name);
				expect(result.data.client_email).toBe(validData.client_email);
				expect(result.data.status).toBe(validData.status);
				expect(result.data.total_amount).toBe(validData.total_amount);
			}
		});

		it("notes가 없는 Invoice 데이터를 파싱할 수 있어야 한다 (optional)", () => {
			// Arrange
			const dataWithoutNotes = { ...createValidInvoiceData() };
			// @ts-expect-error - notes를 의도적으로 삭제
			delete dataWithoutNotes.notes;

			// Act
			const result = invoiceSchema.safeParse(dataWithoutNotes);

			// Assert
			expect(result.success).toBe(true);
		});

		it("문자열 날짜를 Date 객체로 변환할 수 있어야 한다", () => {
			// Arrange
			const dataWithStringDates = createValidInvoiceData({
				issue_date: "2024-01-15",
				due_date: "2024-02-15",
				created_at: "2024-01-15",
			});

			// Act
			const result = invoiceSchema.safeParse(dataWithStringDates);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.issue_date).toBeInstanceOf(Date);
				expect(result.data.due_date).toBeInstanceOf(Date);
				expect(result.data.created_at).toBeInstanceOf(Date);
			}
		});

		it("ISO 날짜 문자열을 파싱할 수 있어야 한다", () => {
			// Arrange
			const dataWithISODates = createValidInvoiceData({
				issue_date: "2024-01-15T00:00:00.000Z",
				due_date: "2024-02-15T00:00:00.000Z",
				created_at: "2024-01-15T12:00:00.000Z",
			});

			// Act
			const result = invoiceSchema.safeParse(dataWithISODates);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.issue_date).toBeInstanceOf(Date);
			}
		});
	});

	describe("유효하지 않은 Invoice 거부", () => {
		it("필수 필드가 누락된 데이터를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.missingRequiredField;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("유효하지 않은 이메일 형식을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.invalidEmail;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const emailError = result.error.issues.find((issue) =>
					issue.path.includes("client_email"),
				);
				expect(emailError).toBeDefined();
			}
		});

		it("유효하지 않은 status를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.invalidStatus;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const statusError = result.error.issues.find((issue) =>
					issue.path.includes("status"),
				);
				expect(statusError).toBeDefined();
			}
		});

		it("음수 subtotal을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.negativeSubtotal;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("음수 tax_rate를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.negativeTaxRate;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 invoice_number를 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.emptyInvoiceNumber;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("빈 client_name을 거부해야 한다", () => {
			// Arrange
			const invalidData = invalidInvoiceDataCases.emptyClientName;

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("유효하지 않은 날짜 문자열을 거부해야 한다", () => {
			// Arrange
			const invalidData = createValidInvoiceData({
				issue_date: "not-a-date",
			});

			// Act
			const result = invoiceSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});
	});
});

describe("invoiceWithLineItemsSchema", () => {
	// TDD Red 단계: 스텁 스키마로 인해 타입 단언을 위한 헬퍼 타입
	type InvoiceWithLineItemsData = ReturnType<
		typeof createValidInvoiceWithLineItemsData
	>;

	describe("유효한 InvoiceWithLineItems 파싱", () => {
		it("Invoice와 LineItems를 함께 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidInvoiceWithLineItemsData();

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as InvoiceWithLineItemsData;
				expect(data.invoice_id).toBe(validData.invoice_id);
				expect(data.line_items).toHaveLength(1);
				expect(data.line_items[0].description).toBe("Test Service");
			}
		});

		it("여러 개의 LineItems를 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidInvoiceWithLineItemsData({}, [
				{ description: "Service 1" },
				{ description: "Service 2" },
				{ description: "Service 3" },
			]);

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as InvoiceWithLineItemsData;
				expect(data.line_items).toHaveLength(3);
				expect(data.line_items[0].description).toBe("Service 1");
				expect(data.line_items[1].description).toBe("Service 2");
				expect(data.line_items[2].description).toBe("Service 3");
			}
		});

		it("빈 line_items 배열을 파싱할 수 있어야 한다", () => {
			// Arrange
			const validData = createValidInvoiceWithLineItemsData({}, []);
			validData.line_items = [];

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				// TDD Red 단계: 스텁 스키마로 인해 타입 단언 필요
				const data = result.data as unknown as InvoiceWithLineItemsData;
				expect(data.line_items).toHaveLength(0);
			}
		});
	});

	describe("유효하지 않은 InvoiceWithLineItems 거부", () => {
		it("line_items가 누락된 데이터를 거부해야 한다", () => {
			// Arrange
			const invalidData = createValidInvoiceData(); // line_items 없음

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("line_items가 배열이 아닌 경우 거부해야 한다", () => {
			// Arrange
			const invalidData = {
				...createValidInvoiceData(),
				line_items: "not-an-array",
			};

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("유효하지 않은 LineItem을 포함한 경우 거부해야 한다", () => {
			// Arrange
			const invalidData = {
				...createValidInvoiceData(),
				line_items: [invalidLineItemDataCases.missingDescription],
			};

			// Act
			const result = invoiceWithLineItemsSchema.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});
	});
});
