/**
 * Invoice Application Layer Error Classes 테스트
 *
 * TDD Red 단계: 커스텀 에러 클래스의 동작을 검증하는 테스트
 */

import {
	InvoiceNotFoundError,
	NotionApiError,
	ValidationError,
} from "~/application/invoice/errors";

describe("InvoiceNotFoundError", () => {
	describe("에러 생성", () => {
		it("주어진 invoiceId로 에러 메시지를 생성해야 한다", () => {
			// Arrange
			const invoiceId = "inv-001";

			// Act
			const error = new InvoiceNotFoundError(invoiceId);

			// Assert
			expect(error.message).toBe("Invoice not found: inv-001");
		});

		it("에러 이름이 'InvoiceNotFoundError'이어야 한다", () => {
			// Arrange
			const invoiceId = "inv-002";

			// Act
			const error = new InvoiceNotFoundError(invoiceId);

			// Assert
			expect(error.name).toBe("InvoiceNotFoundError");
		});

		it("Error 인스턴스이어야 한다", () => {
			// Arrange
			const invoiceId = "inv-003";

			// Act
			const error = new InvoiceNotFoundError(invoiceId);

			// Assert
			expect(error).toBeInstanceOf(Error);
		});

		it("InvoiceNotFoundError 인스턴스이어야 한다", () => {
			// Arrange
			const invoiceId = "inv-004";

			// Act
			const error = new InvoiceNotFoundError(invoiceId);

			// Assert
			expect(error).toBeInstanceOf(InvoiceNotFoundError);
		});

		it("다양한 invoiceId 형식을 처리할 수 있어야 한다", () => {
			// Arrange
			const testCases = ["inv-001", "INVOICE-2024-001", "12345", "abc-def-ghi"];

			// Act & Assert
			for (const invoiceId of testCases) {
				const error = new InvoiceNotFoundError(invoiceId);
				expect(error.message).toBe(`Invoice not found: ${invoiceId}`);
				expect(error.name).toBe("InvoiceNotFoundError");
			}
		});
	});

	describe("에러 throw 동작", () => {
		it("throw 가능해야 한다", () => {
			// Arrange
			const invoiceId = "inv-005";

			// Act & Assert
			expect(() => {
				throw new InvoiceNotFoundError(invoiceId);
			}).toThrow(InvoiceNotFoundError);
		});

		it("올바른 메시지와 함께 throw 되어야 한다", () => {
			// Arrange
			const invoiceId = "inv-006";

			// Act & Assert
			expect(() => {
				throw new InvoiceNotFoundError(invoiceId);
			}).toThrow("Invoice not found: inv-006");
		});

		it("try-catch로 잡을 수 있어야 한다", () => {
			// Arrange
			const invoiceId = "inv-007";
			let caughtError: Error | null = null;

			// Act
			try {
				throw new InvoiceNotFoundError(invoiceId);
			} catch (error) {
				caughtError = error as Error;
			}

			// Assert
			expect(caughtError).not.toBeNull();
			expect(caughtError).toBeInstanceOf(InvoiceNotFoundError);
			expect(caughtError?.message).toBe("Invoice not found: inv-007");
		});
	});
});

describe("NotionApiError", () => {
	describe("에러 생성 (cause 없이)", () => {
		it("주어진 메시지로 에러를 생성해야 한다", () => {
			// Arrange
			const message = "Failed to fetch from Notion API";

			// Act
			const error = new NotionApiError(message);

			// Assert
			expect(error.message).toBe(message);
		});

		it("에러 이름이 'NotionApiError'이어야 한다", () => {
			// Arrange
			const message = "API error occurred";

			// Act
			const error = new NotionApiError(message);

			// Assert
			expect(error.name).toBe("NotionApiError");
		});

		it("cause가 undefined이어야 한다", () => {
			// Arrange
			const message = "Connection timeout";

			// Act
			const error = new NotionApiError(message);

			// Assert
			expect(error.cause).toBeUndefined();
		});

		it("Error 인스턴스이어야 한다", () => {
			// Arrange
			const message = "Unknown error";

			// Act
			const error = new NotionApiError(message);

			// Assert
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe("에러 생성 (cause와 함께)", () => {
		it("원인 에러를 cause 속성에 저장해야 한다", () => {
			// Arrange
			const message = "Database query failed";
			const originalError = new Error("Network timeout");

			// Act
			const error = new NotionApiError(message, originalError);

			// Assert
			expect(error.cause).toBe(originalError);
		});

		it("원인이 문자열인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Request failed";
			const causeString = "Rate limit exceeded";

			// Act
			const error = new NotionApiError(message, causeString);

			// Assert
			expect(error.cause).toBe(causeString);
		});

		it("원인이 객체인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Validation failed";
			const causeObject = { code: 400, details: "Invalid page ID" };

			// Act
			const error = new NotionApiError(message, causeObject);

			// Assert
			expect(error.cause).toBe(causeObject);
		});

		it("원인이 null인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Unknown error";
			const causeNull = null;

			// Act
			const error = new NotionApiError(message, causeNull);

			// Assert
			expect(error.cause).toBeNull();
		});
	});

	describe("에러 throw 동작", () => {
		it("throw 가능해야 한다", () => {
			// Arrange
			const message = "API connection failed";

			// Act & Assert
			expect(() => {
				throw new NotionApiError(message);
			}).toThrow(NotionApiError);
		});

		it("cause와 함께 throw 가능해야 한다", () => {
			// Arrange
			const message = "Notion API error";
			const originalError = new Error("HTTP 500");

			// Act & Assert
			expect(() => {
				throw new NotionApiError(message, originalError);
			}).toThrow(NotionApiError);
		});

		it("try-catch로 원인 에러에 접근할 수 있어야 한다", () => {
			// Arrange
			const message = "Request failed";
			const originalError = new Error("Connection refused");
			let caughtError: NotionApiError | null = null;

			// Act
			try {
				throw new NotionApiError(message, originalError);
			} catch (error) {
				caughtError = error as NotionApiError;
			}

			// Assert
			expect(caughtError).not.toBeNull();
			expect(caughtError?.cause).toBe(originalError);
		});
	});
});

describe("ValidationError", () => {
	describe("에러 생성 (details 없이)", () => {
		it("주어진 메시지로 에러를 생성해야 한다", () => {
			// Arrange
			const message = "Validation failed for invoice data";

			// Act
			const error = new ValidationError(message);

			// Assert
			expect(error.message).toBe(message);
		});

		it("에러 이름이 'ValidationError'이어야 한다", () => {
			// Arrange
			const message = "Invalid input";

			// Act
			const error = new ValidationError(message);

			// Assert
			expect(error.name).toBe("ValidationError");
		});

		it("details가 undefined이어야 한다", () => {
			// Arrange
			const message = "Field validation error";

			// Act
			const error = new ValidationError(message);

			// Assert
			expect(error.details).toBeUndefined();
		});

		it("Error 인스턴스이어야 한다", () => {
			// Arrange
			const message = "Schema validation failed";

			// Act
			const error = new ValidationError(message);

			// Assert
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe("에러 생성 (details와 함께)", () => {
		it("검증 세부정보를 details 속성에 저장해야 한다", () => {
			// Arrange
			const message = "Invoice validation failed";
			const details = {
				field: "total_amount",
				error: "Must be positive number",
			};

			// Act
			const error = new ValidationError(message, details);

			// Assert
			expect(error.details).toBe(details);
		});

		it("details가 배열인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Multiple validation errors";
			const details = [
				{ field: "email", error: "Invalid format" },
				{ field: "amount", error: "Must be positive" },
			];

			// Act
			const error = new ValidationError(message, details);

			// Assert
			expect(error.details).toBe(details);
		});

		it("details가 문자열인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Format error";
			const details = "Expected ISO date format";

			// Act
			const error = new ValidationError(message, details);

			// Assert
			expect(error.details).toBe(details);
		});

		it("details가 null인 경우 저장해야 한다", () => {
			// Arrange
			const message = "Validation error";
			const details = null;

			// Act
			const error = new ValidationError(message, details);

			// Assert
			expect(error.details).toBeNull();
		});

		it("복잡한 Zod 에러 객체를 저장할 수 있어야 한다", () => {
			// Arrange
			const message = "Schema validation failed";
			const zodLikeError = {
				issues: [
					{
						code: "invalid_type",
						expected: "string",
						received: "number",
						path: ["invoice_number"],
						message: "Expected string, received number",
					},
				],
			};

			// Act
			const error = new ValidationError(message, zodLikeError);

			// Assert
			expect(error.details).toBe(zodLikeError);
		});
	});

	describe("에러 throw 동작", () => {
		it("throw 가능해야 한다", () => {
			// Arrange
			const message = "Data validation failed";

			// Act & Assert
			expect(() => {
				throw new ValidationError(message);
			}).toThrow(ValidationError);
		});

		it("details와 함께 throw 가능해야 한다", () => {
			// Arrange
			const message = "Invalid data";
			const details = { field: "status", error: "Invalid value" };

			// Act & Assert
			expect(() => {
				throw new ValidationError(message, details);
			}).toThrow(ValidationError);
		});

		it("try-catch로 details에 접근할 수 있어야 한다", () => {
			// Arrange
			const message = "Validation failed";
			const details = { errors: ["field1", "field2"] };
			let caughtError: ValidationError | null = null;

			// Act
			try {
				throw new ValidationError(message, details);
			} catch (error) {
				caughtError = error as ValidationError;
			}

			// Assert
			expect(caughtError).not.toBeNull();
			expect(caughtError?.details).toBe(details);
		});
	});
});

describe("에러 클래스 타입 구분", () => {
	it("instanceof로 InvoiceNotFoundError를 구분할 수 있어야 한다", () => {
		// Arrange
		const invoiceError = new InvoiceNotFoundError("inv-001");
		const notionError = new NotionApiError("API failed");
		const validationError = new ValidationError("Invalid data");

		// Act & Assert
		expect(invoiceError instanceof InvoiceNotFoundError).toBe(true);
		expect(notionError instanceof InvoiceNotFoundError).toBe(false);
		expect(validationError instanceof InvoiceNotFoundError).toBe(false);
	});

	it("instanceof로 NotionApiError를 구분할 수 있어야 한다", () => {
		// Arrange
		const invoiceError = new InvoiceNotFoundError("inv-001");
		const notionError = new NotionApiError("API failed");
		const validationError = new ValidationError("Invalid data");

		// Act & Assert
		expect(invoiceError instanceof NotionApiError).toBe(false);
		expect(notionError instanceof NotionApiError).toBe(true);
		expect(validationError instanceof NotionApiError).toBe(false);
	});

	it("instanceof로 ValidationError를 구분할 수 있어야 한다", () => {
		// Arrange
		const invoiceError = new InvoiceNotFoundError("inv-001");
		const notionError = new NotionApiError("API failed");
		const validationError = new ValidationError("Invalid data");

		// Act & Assert
		expect(invoiceError instanceof ValidationError).toBe(false);
		expect(notionError instanceof ValidationError).toBe(false);
		expect(validationError instanceof ValidationError).toBe(true);
	});

	it("name 속성으로 에러 타입을 구분할 수 있어야 한다", () => {
		// Arrange
		const errors = [
			new InvoiceNotFoundError("inv-001"),
			new NotionApiError("API failed"),
			new ValidationError("Invalid data"),
		];

		// Act
		const names = errors.map((error) => error.name);

		// Assert
		expect(names).toEqual([
			"InvoiceNotFoundError",
			"NotionApiError",
			"ValidationError",
		]);
	});
});
