import type { AuthService } from "~/application/auth/auth.service";
import type { UserService } from "~/application/user/user.service";
import type { IEmailService } from "./email.port";

/**
 * DI Container 인터페이스
 *
 * Presentation 레이어에서 Infrastructure 의존성을 제거하기 위한 추상화
 * Application과 Domain 레이어만 노출합니다.
 */
export interface IContainer {
	/** 인증 관련 서비스 */
	authService: AuthService;

	/** 사용자 관련 서비스 */
	userService: UserService;

	/** 이메일 발송 서비스 */
	emailService: IEmailService;

	/**
	 * Better-auth API 핸들러
	 * OAuth 콜백 등 Better-auth가 처리하는 엔드포인트 위임
	 */
	betterAuthHandler: (request: Request) => Promise<Response>;

	/**
	 * 세션 쿠키 클리어 헤더 생성
	 * 로그아웃 시 클라이언트 쿠키 삭제용
	 */
	createClearSessionHeaders: () => Headers;
}
