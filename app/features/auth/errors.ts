/**
 * 인증 관련 기본 에러 클래스
 *
 * 모든 인증 관련 에러의 기본 클래스입니다.
 */
export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}

/**
 * 이메일 중복 에러
 *
 * 이미 등록된 이메일로 회원가입을 시도할 때 발생합니다.
 */
export class DuplicateEmailError extends AuthError {
	constructor(message = "이미 사용 중인 이메일입니다.") {
		super(message);
		this.name = "DuplicateEmailError";
	}
}

/**
 * 사용자 생성 실패 에러
 *
 * Better-auth를 통한 사용자 생성이 실패했을 때 발생합니다.
 */
export class UserCreationError extends AuthError {
	constructor(message = "사용자 생성에 실패했습니다.") {
		super(message);
		this.name = "UserCreationError";
	}
}

/**
 * 프로필 생성 실패 에러 (비치명적)
 *
 * 프로필 테이블 레코드 생성이 실패했을 때 발생합니다.
 * 이 에러는 비치명적이므로 로그만 남기고 회원가입은 성공으로 처리됩니다.
 */
export class ProfileCreationError extends AuthError {
	constructor(message = "프로필 생성에 실패했습니다.") {
		super(message);
		this.name = "ProfileCreationError";
	}
}

/**
 * 이메일 서비스 미설정 에러
 *
 * Resend API 키가 설정되지 않았을 때 발생합니다.
 */
export class EmailServiceNotConfiguredError extends AuthError {
	constructor(message = "이메일 서비스가 설정되지 않았습니다.") {
		super(message);
		this.name = "EmailServiceNotConfiguredError";
	}
}

/**
 * 이메일 전송 실패 에러
 *
 * Resend API를 통한 이메일 전송이 실패했을 때 발생합니다.
 */
export class EmailSendError extends AuthError {
	constructor(message = "이메일 전송에 실패했습니다.") {
		super(message);
		this.name = "EmailSendError";
	}
}
