/// <reference types="vite/client" />

/**
 * Vite 환경 변수 타입 정의
 * import.meta.env로 접근 가능
 *
 * Better-auth는 서버 환경 변수로 실행되므로 여기에 포함하지 않음
 */
interface ImportMetaEnv {
	// 필요한 경우 클라이언트 환경 변수 추가
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
