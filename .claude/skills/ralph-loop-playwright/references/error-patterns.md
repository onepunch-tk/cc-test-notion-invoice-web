# 에러 패턴 레퍼런스

## 일반적인 JavaScript 에러

| 패턴 | 원인 | 해결 방향 |
|------|------|----------|
| `Cannot read property 'X' of undefined` | null/undefined 참조 | 옵셔널 체이닝 (`?.`) 사용 |
| `Cannot read property 'X' of null` | null 참조 | null 체크 또는 옵셔널 체이닝 |
| `X is not a function` | 함수가 아닌 값 호출 | 타입 확인, import 확인 |
| `X is not defined` | 변수/함수 미정의 | import 누락, 스코프 확인 |
| `Unexpected token` | 구문 오류 | JSON 파싱 오류 또는 문법 오류 |

## 네트워크 에러

| 패턴 | 원인 | 해결 방향 |
|------|------|----------|
| `Failed to fetch` | API 호출 실패 | 서버 상태, CORS, URL 확인 |
| `NetworkError` | 네트워크 연결 문제 | 서버 상태, 프록시 확인 |
| `401 Unauthorized` | 인증 실패 | 토큰 로직, 세션 확인 |
| `403 Forbidden` | 권한 없음 | 사용자 권한, API 키 확인 |
| `404 Not Found` | 리소스 없음 | URL 경로, 라우트 확인 |
| `500 Internal Server Error` | 서버 에러 | 서버 로그 확인 |

## React 에러

| 패턴 | 원인 | 해결 방향 |
|------|------|----------|
| `Invalid hook call` | 훅 규칙 위반 | 컴포넌트 최상위에서만 호출 |
| `Objects are not valid as a React child` | 객체를 직접 렌더링 | JSON.stringify 또는 속성 접근 |
| `Each child should have a unique "key" prop` | key 누락 | 리스트 아이템에 key 추가 |
| `Maximum update depth exceeded` | 무한 렌더링 루프 | useEffect 의존성 배열 확인 |

## TypeScript 에러

| 패턴 | 원인 | 해결 방향 |
|------|------|----------|
| `Type 'X' is not assignable to type 'Y'` | 타입 불일치 | 타입 정의 수정 또는 타입 캐스팅 |
| `Property 'X' does not exist on type 'Y'` | 속성 미존재 | 인터페이스 확장 또는 타입 가드 |
| `Argument of type 'X' is not assignable` | 인자 타입 불일치 | 함수 시그니처 확인 |

## 브라우저 에러

| 패턴 | 원인 | 해결 방향 |
|------|------|----------|
| `CORS policy` | CORS 정책 위반 | 서버 CORS 설정, 프록시 사용 |
| `Mixed Content` | HTTPS에서 HTTP 리소스 로드 | URL을 HTTPS로 변경 |
| `Content Security Policy` | CSP 위반 | CSP 헤더 수정 |
