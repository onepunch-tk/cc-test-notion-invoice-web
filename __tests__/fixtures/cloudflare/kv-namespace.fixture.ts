/**
 * Mock KVNamespace Fixture
 *
 * Cloudflare KVNamespace의 in-memory 구현체
 * miniflare 의존성 없이 단위 테스트에서 사용합니다.
 */

interface KVNamespaceGetOptions<
	Type extends "text" | "json" | "arrayBuffer" | "stream",
> {
	type: Type;
	cacheTtl?: number;
}

interface KVNamespacePutOptions {
	expiration?: number;
	expirationTtl?: number;
	metadata?: Record<string, unknown>;
}

interface KVNamespaceListOptions {
	prefix?: string;
	limit?: number;
	cursor?: string;
}

interface KVNamespaceListKey<Metadata> {
	name: string;
	expiration?: number;
	metadata?: Metadata;
}

interface KVNamespaceListResult<Metadata> {
	keys: KVNamespaceListKey<Metadata>[];
	list_complete: boolean;
	cursor?: string;
}

interface KVNamespaceGetWithMetadataResult<Value, Metadata> {
	value: Value | null;
	metadata: Metadata | null;
}

/**
 * 저장된 KV 항목 타입
 */
interface StoredItem {
	value: string;
	expiration?: number;
	metadata?: Record<string, unknown>;
}

/**
 * Mock KVNamespace 인터페이스
 *
 * Cloudflare KVNamespace와 동일한 인터페이스 + 테스트 헬퍼
 */
export interface MockKVNamespace {
	get(
		key: string,
		options?: Partial<KVNamespaceGetOptions<"text">>,
	): Promise<string | null>;
	get(
		key: string,
		options: KVNamespaceGetOptions<"text">,
	): Promise<string | null>;
	get<ExpectedValue = unknown>(
		key: string,
		options: KVNamespaceGetOptions<"json">,
	): Promise<ExpectedValue | null>;
	get(
		key: string,
		options: KVNamespaceGetOptions<"arrayBuffer">,
	): Promise<ArrayBuffer | null>;
	get(
		key: string,
		options: KVNamespaceGetOptions<"stream">,
	): Promise<ReadableStream | null>;
	get(
		key: string,
		options?: Partial<
			KVNamespaceGetOptions<"text" | "json" | "arrayBuffer" | "stream">
		>,
	): Promise<
		string | Record<string, unknown> | ArrayBuffer | ReadableStream | null
	>;

	getWithMetadata<ExpectedValue = unknown, ExpectedMetadata = unknown>(
		key: string,
		options?: Partial<
			KVNamespaceGetOptions<"text" | "json" | "arrayBuffer" | "stream">
		>,
	): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, ExpectedMetadata>>;

	put(
		key: string,
		value: string | ArrayBuffer | ReadableStream,
		options?: KVNamespacePutOptions,
	): Promise<void>;

	delete(key: string): Promise<void>;

	list<Metadata = unknown>(
		options?: KVNamespaceListOptions,
	): Promise<KVNamespaceListResult<Metadata>>;

	// 테스트 헬퍼 메서드
	_clear(): void;
	_getStore(): Map<string, StoredItem>;
	_setCurrentTime(time: number): void;
	_advanceTime(ms: number): void;
	_getCurrentTime(): number;
}

/**
 * Mock KVNamespace 생성 팩토리 함수
 *
 * @param initialTime - 초기 시간 (기본값: Date.now())
 * @returns MockKVNamespace 인스턴스
 */
export const createMockKVNamespace = (
	initialTime?: number,
): MockKVNamespace => {
	const store = new Map<string, StoredItem>();
	let currentTime = initialTime ?? Date.now();

	/**
	 * 만료 여부 확인
	 */
	const isExpired = (item: StoredItem): boolean => {
		if (item.expiration === undefined) return false;
		return currentTime / 1000 >= item.expiration;
	};

	/**
	 * 만료된 항목 정리
	 */
	const cleanupExpired = (): void => {
		for (const [key, item] of store.entries()) {
			if (isExpired(item)) {
				store.delete(key);
			}
		}
	};

	const get = async (
		key: string,
		options?: Partial<
			KVNamespaceGetOptions<"text" | "json" | "arrayBuffer" | "stream">
		>,
	): Promise<
		string | Record<string, unknown> | ArrayBuffer | ReadableStream | null
	> => {
		cleanupExpired();
		const item = store.get(key);
		if (!item || isExpired(item)) {
			return null;
		}

		const type = options?.type ?? "text";
		switch (type) {
			case "json":
				return JSON.parse(item.value) as Record<string, unknown>;
			case "arrayBuffer":
				return new TextEncoder().encode(item.value).buffer;
			case "stream":
				return new ReadableStream({
					start(controller) {
						controller.enqueue(new TextEncoder().encode(item.value));
						controller.close();
					},
				});
			default:
				return item.value;
		}
	};

	const getWithMetadata = async <
		ExpectedValue = unknown,
		ExpectedMetadata = unknown,
	>(
		key: string,
		options?: Partial<
			KVNamespaceGetOptions<"text" | "json" | "arrayBuffer" | "stream">
		>,
	): Promise<
		KVNamespaceGetWithMetadataResult<ExpectedValue, ExpectedMetadata>
	> => {
		cleanupExpired();
		const item = store.get(key);
		if (!item || isExpired(item)) {
			return { value: null, metadata: null };
		}

		const type = options?.type ?? "text";
		let value: unknown;
		switch (type) {
			case "json":
				value = JSON.parse(item.value);
				break;
			case "arrayBuffer":
				value = new TextEncoder().encode(item.value).buffer;
				break;
			case "stream":
				value = new ReadableStream({
					start(controller) {
						controller.enqueue(new TextEncoder().encode(item.value));
						controller.close();
					},
				});
				break;
			default:
				value = item.value;
		}

		return {
			value: value as ExpectedValue,
			metadata: (item.metadata as ExpectedMetadata) ?? null,
		};
	};

	const put = async (
		key: string,
		value: string | ArrayBuffer | ReadableStream,
		options?: KVNamespacePutOptions,
	): Promise<void> => {
		let stringValue: string;

		if (typeof value === "string") {
			stringValue = value;
		} else if (value instanceof ArrayBuffer) {
			stringValue = new TextDecoder().decode(value);
		} else {
			// ReadableStream
			const reader = value.getReader();
			const chunks: Uint8Array[] = [];
			let done = false;
			while (!done) {
				const result = await reader.read();
				done = result.done;
				if (result.value) {
					chunks.push(result.value);
				}
			}
			const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
			const merged = new Uint8Array(totalLength);
			let offset = 0;
			for (const chunk of chunks) {
				merged.set(chunk, offset);
				offset += chunk.length;
			}
			stringValue = new TextDecoder().decode(merged);
		}

		let expiration: number | undefined;
		if (options?.expiration !== undefined) {
			expiration = options.expiration;
		} else if (options?.expirationTtl !== undefined) {
			expiration = Math.floor(currentTime / 1000) + options.expirationTtl;
		}

		store.set(key, {
			value: stringValue,
			expiration,
			metadata: options?.metadata,
		});
	};

	const deleteKey = async (key: string): Promise<void> => {
		store.delete(key);
	};

	const list = async <Metadata = unknown>(
		options?: KVNamespaceListOptions,
	): Promise<KVNamespaceListResult<Metadata>> => {
		cleanupExpired();

		const prefix = options?.prefix ?? "";
		const limit = options?.limit ?? 1000;
		const cursor = options?.cursor ? parseInt(options.cursor, 10) : 0;

		const matchingKeys: KVNamespaceListKey<Metadata>[] = [];
		let index = 0;
		let skipped = 0;

		for (const [key, item] of store.entries()) {
			if (key.startsWith(prefix)) {
				if (skipped < cursor) {
					skipped++;
					continue;
				}
				if (matchingKeys.length >= limit) {
					break;
				}
				matchingKeys.push({
					name: key,
					expiration: item.expiration,
					metadata: item.metadata as Metadata,
				});
				index++;
			}
		}

		const nextCursor = cursor + matchingKeys.length;
		const hasMore =
			Array.from(store.entries()).filter(([k]) => k.startsWith(prefix)).length >
			nextCursor;

		return {
			keys: matchingKeys,
			list_complete: !hasMore,
			cursor: hasMore ? nextCursor.toString() : undefined,
		};
	};

	return {
		get: get as MockKVNamespace["get"],
		getWithMetadata,
		put,
		delete: deleteKey,
		list,
		_clear: () => store.clear(),
		_getStore: () => store,
		_setCurrentTime: (time: number) => {
			currentTime = time;
		},
		_advanceTime: (ms: number) => {
			currentTime += ms;
		},
		_getCurrentTime: () => currentTime,
	};
};
