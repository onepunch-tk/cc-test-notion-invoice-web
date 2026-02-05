import { Client } from "@notionhq/client";
import { describe, expect, it } from "vitest";
import {
	createNotionClient,
	type NotionClientConfig,
} from "~/infrastructure/external/notion/notion.client";

describe("createNotionClient", () => {
	describe("클라이언트 생성", () => {
		it("유효한 API 키로 Notion Client 인스턴스를 생성한다", () => {
			// Arrange
			const config: NotionClientConfig = {
				apiKey: "secret_test_api_key_123",
			};

			// Act
			const client = createNotionClient(config);

			// Assert
			expect(client).toBeInstanceOf(Client);
		});

		it("제공된 API 키를 사용하여 클라이언트를 초기화한다", () => {
			// Arrange
			const config: NotionClientConfig = {
				apiKey: "secret_specific_key_456",
			};

			// Act
			const client = createNotionClient(config);

			// Assert
			// @notionhq/client의 Client는 auth 속성을 직접 노출하지 않으므로
			// 인스턴스 생성 성공 여부로 검증
			expect(client).toBeDefined();
			expect(client).toBeInstanceOf(Client);
		});
	});

	describe("설정 검증", () => {
		it("빈 문자열 API 키로도 클라이언트를 생성한다", () => {
			// Arrange
			const config: NotionClientConfig = {
				apiKey: "",
			};

			// Act
			const client = createNotionClient(config);

			// Assert
			// 팩토리 함수는 단순 생성만 담당, 검증은 env.ts에서 처리
			expect(client).toBeInstanceOf(Client);
		});
	});

	describe("타입 안전성", () => {
		it("NotionClientConfig 타입을 올바르게 적용한다", () => {
			// Arrange
			const config: NotionClientConfig = {
				apiKey: "secret_type_safe_key",
			};

			// Act
			const client = createNotionClient(config);

			// Assert
			expect(client).toBeInstanceOf(Client);
		});

		it("반환된 클라이언트는 Client 타입이다", () => {
			// Arrange
			const config: NotionClientConfig = {
				apiKey: "secret_return_type_key",
			};

			// Act
			const client = createNotionClient(config);

			// Assert
			expect(client).toBeInstanceOf(Client);
			// Client의 주요 메서드가 존재하는지 확인
			expect(typeof client.databases.query).toBe("function");
			expect(typeof client.pages.retrieve).toBe("function");
		});
	});

	describe("여러 인스턴스 생성", () => {
		it("각기 다른 API 키로 독립적인 클라이언트를 생성한다", () => {
			// Arrange
			const config1: NotionClientConfig = {
				apiKey: "secret_client_1",
			};
			const config2: NotionClientConfig = {
				apiKey: "secret_client_2",
			};

			// Act
			const client1 = createNotionClient(config1);
			const client2 = createNotionClient(config2);

			// Assert
			expect(client1).toBeInstanceOf(Client);
			expect(client2).toBeInstanceOf(Client);
			expect(client1).not.toBe(client2); // 별도의 인스턴스
		});
	});
});
