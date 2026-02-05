/**
 * Cache Key Utilities
 *
 * 캐시 키 생성 함수 및 TTL 상수
 */

/**
 * Invoice ID 검증
 * Notion UUID 형식 또는 간단한 alphanumeric ID 허용 (최대 100자)
 */
const INVOICE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;

/**
 * IP 주소 검증 (IPv4 및 IPv6)
 */
const IP_ADDRESS_PATTERN =
	/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

/**
 * 캐시 키 입력 검증
 *
 * @param value - 검증할 값
 * @param pattern - 정규식 패턴
 * @returns 검증 통과 여부
 */
const isValidKeyInput = (value: string, pattern: RegExp): boolean => {
	return pattern.test(value);
};

/**
 * 캐시 TTL 상수 (초 단위)
 */
export const CACHE_TTL = {
	/** Invoice 목록 캐시 TTL: 5분 */
	INVOICE_LIST: 5 * 60,
	/** Invoice 상세 캐시 TTL: 10분 */
	INVOICE_DETAIL: 10 * 60,
	/** 회사 정보 캐시 TTL: 15분 */
	COMPANY_INFO: 15 * 60,
} as const;

/**
 * Rate Limiter 설정 상수
 */
export const RATE_LIMIT_CONFIG = {
	/** IP 기반 Rate Limit: 60 req/min */
	IP: {
		maxRequests: 60,
		windowSeconds: 60,
	},
	/** Notion API Rate Limit: 3 req/sec */
	NOTION_API: {
		maxRequests: 3,
		windowSeconds: 1,
	},
} as const;

/**
 * Circuit Breaker 설정 상수
 */
export const CIRCUIT_BREAKER_CONFIG = {
	/** Notion API Circuit Breaker */
	NOTION_API: {
		/** OPEN 상태로 전환되는 연속 실패 횟수 */
		failureThreshold: 5,
		/** OPEN → HALF_OPEN 대기 시간 (초) */
		recoveryTimeSeconds: 30,
		/** HALF_OPEN 상태에서 허용할 테스트 요청 수 */
		halfOpenRequests: 1,
	},
} as const;

/**
 * Invoice 목록 캐시 키 생성
 *
 * @returns 캐시 키
 */
export const invoiceListKey = (): string => "invoices:list";

/**
 * Invoice 상세 캐시 키 생성
 *
 * @param id - Invoice ID (alphanumeric, max 100 chars)
 * @returns 캐시 키
 * @throws Error ID 형식이 유효하지 않을 경우
 */
export const invoiceDetailKey = (id: string): string => {
	if (!isValidKeyInput(id, INVOICE_ID_PATTERN)) {
		throw new Error("Invalid invoice ID format for cache key");
	}
	return `invoices:detail:${id}`;
};

/**
 * 회사 정보 캐시 키 생성
 *
 * @returns 캐시 키
 */
export const companyInfoKey = (): string => "company:info";

/**
 * IP Rate Limit 키 생성
 *
 * @param ip - 클라이언트 IP 주소 (IPv4 또는 IPv6)
 * @returns Rate Limit 키
 * @throws Error IP 형식이 유효하지 않을 경우
 */
export const ipRateLimitKey = (ip: string): string => {
	if (!isValidKeyInput(ip, IP_ADDRESS_PATTERN)) {
		throw new Error("Invalid IP address format for rate limit key");
	}
	return `ratelimit:ip:${ip}`;
};

/**
 * Notion API Rate Limit 키 생성
 *
 * @returns Rate Limit 키
 */
export const notionApiRateLimitKey = (): string => "ratelimit:notion-api";

/**
 * Circuit Breaker 상태 키 생성
 *
 * @returns Circuit Breaker 키
 */
export const circuitBreakerKey = (): string => "circuit:notion-api";
