/**
 * Error Sanitizer Unit Tests
 */

import { describe, expect, it } from "vitest";
import {
	sanitizeErrorForLogging,
	sanitizeErrorMessage,
} from "~/infrastructure/utils/error-sanitizer";

describe("error-sanitizer", () => {
	describe("sanitizeErrorMessage", () => {
		it("should redact API key patterns", () => {
			const message = "Error: api_key=secret123abc failed";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Error: API_KEY=[REDACTED] failed");
		});

		it("should redact API-KEY patterns with different formats", () => {
			const message1 = "api-key: my-secret-key error";
			const message2 = "apiKey=another_secret";

			expect(sanitizeErrorMessage(message1)).toBe("API_KEY=[REDACTED] error");
			expect(sanitizeErrorMessage(message2)).toBe("API_KEY=[REDACTED]");
		});

		it("should redact secret patterns", () => {
			const message = "secret=mysecretvalue123";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("SECRET=[REDACTED]");
		});

		it("should redact Notion UUID database IDs", () => {
			const message = "Database 2fbd6380-800d-81d8-96e0-e8fe519d03f5 not found";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Database [DATABASE_ID_REDACTED] not found");
		});

		it("should redact 32-character hex IDs", () => {
			const message = "Error in database a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Error in database [ID_REDACTED]");
		});

		it("should redact Bearer tokens", () => {
			const message = "Authorization failed: Bearer secret_token_123";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Authorization failed: Bearer [TOKEN_REDACTED]");
		});

		it("should redact authorization headers", () => {
			const message = "Request failed: authorization: basic-auth-token";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Request failed: Authorization=[REDACTED]");
		});

		it("should handle multiple sensitive patterns in one message", () => {
			const message =
				"API error: api_key=abc123 for database 2fbd6380-800d-81d8-96e0-e8fe519d03f5";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe(
				"API error: API_KEY=[REDACTED] for database [DATABASE_ID_REDACTED]",
			);
		});

		it("should return original message if no sensitive data found", () => {
			const message = "Simple error message with no sensitive data";
			const result = sanitizeErrorMessage(message);

			expect(result).toBe("Simple error message with no sensitive data");
		});

		it("should handle empty string", () => {
			const result = sanitizeErrorMessage("");

			expect(result).toBe("");
		});
	});

	describe("sanitizeErrorForLogging", () => {
		it("should handle Error instances", () => {
			const error = new Error(
				"Database a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4 error",
			);
			const result = sanitizeErrorForLogging(error);

			expect(result).toBe("[Error] Database [ID_REDACTED] error");
		});

		it("should include error name in output", () => {
			const error = new TypeError("Invalid api_key=secret123");
			const result = sanitizeErrorForLogging(error);

			expect(result).toBe("[TypeError] Invalid API_KEY=[REDACTED]");
		});

		it("should handle custom error classes", () => {
			class CustomError extends Error {
				constructor(message: string) {
					super(message);
					this.name = "CustomError";
				}
			}
			const error = new CustomError("secret=mysecret failed");
			const result = sanitizeErrorForLogging(error);

			expect(result).toBe("[CustomError] SECRET=[REDACTED] failed");
		});

		it("should return generic message for non-Error objects", () => {
			const result1 = sanitizeErrorForLogging("string error");
			const result2 = sanitizeErrorForLogging(null);
			const result3 = sanitizeErrorForLogging(undefined);
			const result4 = sanitizeErrorForLogging({ message: "object error" });

			expect(result1).toBe("Unknown error occurred");
			expect(result2).toBe("Unknown error occurred");
			expect(result3).toBe("Unknown error occurred");
			expect(result4).toBe("Unknown error occurred");
		});

		it("should handle Error with no name", () => {
			const error = new Error("test error");
			error.name = "";
			const result = sanitizeErrorForLogging(error);

			expect(result).toBe("[Error] test error");
		});
	});
});
