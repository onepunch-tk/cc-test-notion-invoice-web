# 유닛 테스트 가이드 (TDD 기반)

unit-test-writer 에이전트가 참조하는 테스트 작성 가이드입니다.

---

## TDD 워크플로우

테스트 주도 개발(TDD) 사이클을 따릅니다:

### 0. 준비 (Prepare) - 테스트 리소스 정의

테스트 작성 전, 필요한 리소스를 먼저 정의합니다:

1. **Mock 데이터가 필요한 경우** → `tests/mocks/factories.ts`에 팩토리 추가
   - 새로운 도메인 엔티티 테스트 시
   - 기존 팩토리로 충분하면 생략

2. **API 호출이 필요한 경우** → `tests/mocks/handlers.ts`에 핸들러 추가
   - 외부 API를 호출하는 코드 테스트 시
   - 순수 함수/컴포넌트 테스트면 생략

### 1. Red - 실패하는 테스트 작성

### 2. Green - 테스트 통과하는 최소한의 코드 작성

### 3. Refactor - 코드 품질 개선 (테스트는 계속 통과 유지)

### 4. 반복

---

## 환경 설정

### 패키지 매니저 자동 감지

테스트 실행 전 프로젝트의 lock 파일을 확인하여 패키지 매니저를 결정합니다:

| Lock 파일 | 패키지 매니저 | 테스트 명령어 |
|-----------|---------------|---------------|
| `bun.lock` | bun | `bun run test` |
| `pnpm-lock.yaml` | pnpm | `pnpm test` |
| `yarn.lock` | yarn | `yarn test` |
| `package-lock.json` | npm | `npm run test` |

### 테스트 스크립트 (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 테스트 제외 대상 파일

다음 패턴의 파일은 테스트 작성 대상에서 **제외**합니다:

### 타입 선언 파일
- `*.d.ts` - TypeScript 선언 파일
- `**/types.ts` - 타입만 정의된 파일
- `**/types/**/*.ts` - types 디렉토리 내 모든 파일

### 인터페이스/포트 파일
- `**/*.port.ts` - 포트 인터페이스 (구현체 없음)
- `**/*.entity.ts` - 인터페이스만 정의된 엔티티 파일

### 인덱스/배럴 파일
- `**/index.ts` - re-export만 하는 배럴 파일

### 설정/상수 파일
- `*.config.ts` - 설정 파일
- `**/constants.ts` - 상수만 정의된 파일
- `**/const.ts` - 상수만 정의된 파일

### shadcn/ui 컴포넌트
- `**/components/ui/**` - shadcn/ui에서 생성된 컴포넌트 (외부 라이브러리 기반, 테스트 불필요)

### 기타
- `**/*.css`, `**/*.scss` - 스타일 파일
- `**/assets/**` - 정적 자산

---

## 테스트 파일 구조

### 파일 네이밍 규칙

소스 파일 경로와 일치하도록 테스트 파일을 생성합니다:

| 소스 파일 | 테스트 파일 |
|-----------|-------------|
| `app/domain/user/user.schema.ts` | `__tests__/domain/user/user.schema.test.ts` |
| `app/application/auth/auth.service.ts` | `__tests__/application/auth/auth.service.test.ts` |
| `app/presentation/components/button.tsx` | `__tests__/presentation/components/button.test.tsx` |

### 디렉토리 구조

```
root/
├── __tests__/
│   ├── domain/           # Domain 계층 테스트
│   ├── application/      # Application 계층 테스트
│   └── presentation/     # Presentation 계층 테스트
└── tests/
    ├── setup.ts          # 전역 테스트 셋업
    ├── mocks/
    │   ├── handlers.ts   # MSW API 핸들러
    │   ├── server.ts     # MSW 서버 설정
    │   └── factories.ts  # 테스트 데이터 팩토리
    └── helpers/
        └── router-stub.tsx # createRoutesStub 래퍼
```

---

## 테스트 리소스

### tests/setup.ts
전역 테스트 셋업. MSW 서버 시작/종료, Jest DOM 매처 확장 등을 설정합니다.

### tests/mocks/handlers.ts
MSW API 핸들러. **상대 경로 패턴**을 사용하여 환경 독립적으로 설정합니다.

```typescript
import { http, HttpResponse } from "msw";

// 상대 경로로 핸들러 정의 (BASE_URL 불필요)
export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({ id: params.id, name: "테스트 사용자" });
  }),
];

// 인증 핸들러 팩토리
export const createAuthHandlers = (options?: {
  sessionUser?: { id: string; name: string; email: string } | null;
}) => [
  http.get("/api/auth/session", () => {
    if (!options?.sessionUser) return HttpResponse.json(null);
    return HttpResponse.json({ user: options.sessionUser });
  }),
];
```

### tests/mocks/server.ts
MSW 서버 설정.

### tests/mocks/factories.ts
테스트 데이터 팩토리 함수들:

- `createMockUser()` - Mock User 생성
- `createMockProfile()` - Mock Profile 생성
- `createMockUserWithProfile()` - Mock UserWithProfile 생성
- `createMockHeaders()` - Mock Headers 생성
- `createMockFormData()` - Mock FormData 생성 (action 테스트용)
- `createMockRequest()` - Mock Request 생성 (action 테스트용)

### tests/helpers/router-stub.tsx
`createRoutesStub` 래퍼. React Router 테스트에 사용합니다.

**참고**: 단순 컴포넌트 테스트는 `@testing-library/react`의 `render`를 직접 사용하고, 라우팅(loader/action)이 필요한 테스트만 `renderWithRouteStub`을 사용합니다.

---

## 확장 가능한 테스트 리소스

테스트 작성 시 필요에 따라 확장할 수 있는 파일 목록입니다:

| 파일 | 확장 시점 | 빈도 |
|------|----------|------|
| `tests/mocks/factories.ts` | 새로운 도메인 엔티티 Mock 필요 시 | 자주 |
| `tests/mocks/handlers.ts` | API 호출 테스트 시 핸들러 필요 | 자주 |
| `tests/setup.ts` | 특수 브라우저 API 모킹 필요 시 | 드묾 |
| `tests/helpers/router-stub.tsx` | 라우트 테스트 헬퍼 확장 시 | 드묾 |

---

## 계층별 테스트 패턴

### Domain 계층 (스키마, 에러 클래스)

Zod 스키마와 Type Guard 테스트:

```typescript
describe("userSchema", () => {
  it("유효한 사용자 데이터를 통과시켜야 함", () => {
    const validUser = {
      id: "user-123",
      name: "홍길동",
      email: "hong@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = userSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("필수 필드가 없으면 실패해야 함", () => {
    const invalidUser = {
      id: "user-123",
      name: "홍길동",
      // email 누락
    };

    const result = userSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});

describe("isUser Type Guard", () => {
  it("유효한 User 객체에 대해 true 반환", () => {
    const validUser = createMockUser();
    expect(isUser(validUser)).toBe(true);
  });

  it("null에 대해 false 반환", () => {
    expect(isUser(null)).toBe(false);
  });
});
```

### Application 계층 (서비스 모킹)

서비스 테스트에서 외부 의존성 모킹:

```typescript
import { vi } from "vitest";
import { authService } from "~/application/auth/auth.service";

// 외부 모듈 모킹
vi.mock("~/infrastructure/auth/auth.adapter", () => ({
  authAdapter: {
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("로그인 성공 시 사용자 정보 반환", async () => {
    const mockUser = createMockUser();
    vi.mocked(authAdapter.signIn).mockResolvedValue(mockUser);

    const result = await authService.signIn("test@example.com", "password");

    expect(result).toEqual(mockUser);
    expect(authAdapter.signIn).toHaveBeenCalledWith("test@example.com", "password");
  });
});
```

### Presentation 계층 (컴포넌트, 라우트)

컴포넌트 테스트 (`@testing-library/react` 직접 사용):

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("children 텍스트 렌더링", () => {
    render(<Button>클릭하세요</Button>);
    expect(screen.getByRole("button", { name: "클릭하세요" })).toBeInTheDocument();
  });

  it("클릭 이벤트 핸들러 호출", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>클릭</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서 클릭 무시", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button disabled onClick={handleClick}>클릭</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

라우트 테스트 (createRoutesStub 활용):

```tsx
describe("LoginForm with createRoutesStub", () => {
  it("action에서 에러 반환 시 에러 메시지 표시", async () => {
    const user = userEvent.setup();

    renderWithRouteStub({
      initialEntries: ["/login"],
      routes: [
        {
          path: "/login",
          Component: LoginForm,
          action() {
            return { errors: { email: "이메일을 입력해주세요" } };
          },
        },
      ],
    });

    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("이메일을 입력해주세요");
    });
  });
});
```

---

## MSW 활용 패턴

### 상대 경로 기반 핸들러

```typescript
// handlers.ts - 상대 경로 사용 (환경 독립적)
export const handlers = [
  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({ id: params.id, name: "테스트 사용자" });
  }),
];
```

### 테스트별 오버라이드

```typescript
import { server } from "tests/mocks/server";
import { http, HttpResponse } from "msw";

test("에러 상황 처리", async () => {
  // 이 테스트에서만 404 응답 반환
  server.use(
    http.get("/api/users/:id", () => {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    })
  );

  // 에러 핸들링 테스트...
});
```

### 핸들러 팩토리 패턴

```typescript
import { createAuthHandlers, createErrorHandler } from "tests/mocks/handlers";

test("인증된 사용자 시나리오", async () => {
  server.use(
    ...createAuthHandlers({
      sessionUser: { id: "user-123", name: "테스트", email: "test@example.com" }
    })
  );
  // 테스트...
});

test("API 에러 시나리오", async () => {
  server.use(
    createErrorHandler("/api/users/:id", 404, { error: "사용자를 찾을 수 없습니다." })
  );
  // 테스트...
});
```

---

## 유틸리티 함수 테스트

```typescript
describe("cn", () => {
  it("단일 클래스 문자열 반환", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("여러 클래스 병합", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("조건부 클래스 처리", () => {
    const isActive = true;
    expect(cn("px-4", isActive && "bg-blue-500")).toBe("px-4 bg-blue-500");
  });

  it("Tailwind 클래스 충돌 해결", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("undefined와 null 무시", () => {
    expect(cn("px-4", undefined, null, "py-2")).toBe("px-4 py-2");
  });
});
```

---

## Action 테스트 (FormData, Request)

```typescript
import { createMockFormData, createMockRequest } from "tests/mocks/factories";

describe("loginAction", () => {
  it("유효한 자격 증명으로 로그인 성공", async () => {
    const formData = createMockFormData({
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    });

    const request = createMockRequest({
      url: "http://localhost/login",
      method: "POST",
      formData,
    });

    const result = await loginAction({ request, params: {}, context: {} });

    expect(result).toEqual({ success: true });
  });

  it("잘못된 이메일 형식에서 에러 반환", async () => {
    const formData = createMockFormData({
      email: "invalid-email",
      password: "password123",
    });

    const request = createMockRequest({
      url: "http://localhost/login",
      method: "POST",
      formData,
    });

    const result = await loginAction({ request, params: {}, context: {} });

    expect(result).toEqual({
      errors: { email: "올바른 이메일 형식이 아닙니다." },
    });
  });
});
```

---

## 테스트 완료 후 필수 검증

테스트 코드 작성 완료 후 **반드시** 다음 순서로 검증합니다:

### 1. 테스트 실행

```bash
bun run test:run  # 또는 해당 패키지 매니저 명령
```

### 2. 타입 체크 (필수)

```bash
bun run typecheck
```

- 테스트 코드의 타입 안전성 검증
- 모킹된 타입과 실제 타입 일치 확인
- 컴파일 에러 조기 발견

### 3. 커버리지 확인 (선택)

```bash
bun run test:coverage
```

---

## 추가 참고사항

### React Router v7 테스트 권장사항

- **컴포넌트 단위 테스트**: `createRoutesStub`으로 loader/action 모킹
- **서버사이드 로직**: MSW로 API 요청 모킹

### 테스트 작성 원칙

1. **Side Effect 최소화**: 미리 선언된 `tests/**/*` 리소스를 적극 활용
2. **리소스 확장**: 필요 시 `tests/mocks/handlers.ts`, `tests/mocks/factories.ts`에 추가
3. **명확한 테스트 설명**: 한글로 테스트 설명 작성
4. **AAA 패턴**: Arrange-Act-Assert 패턴 준수
