# Claude RR7 Starterkit

React Router v7 + Cloudflare Workers를 기반으로 한 프로덕션 레디 풀스택 웹 애플리케이션 스타터킷입니다.

## 🚀 주요 기능

### 핵심 기술 스택
- **React Router v7** - 풀스택 React 프레임워크 (SSR 지원)
- **Cloudflare Workers** - 엣지 컴퓨팅 배포 플랫폼
- **Better-auth** - 프레임워크 독립적 인증 라이브러리
- **Drizzle ORM** - Code-first 데이터베이스 스키마 관리
- **Supabase** - PostgreSQL 데이터베이스 (로컬 개발 환경 포함)
- **shadcn/ui** - 고품질 UI 컴포넌트 라이브러리
- **Tailwind CSS v4** - CSS Variables 기반 스타일링
- **TypeScript** - 타입 안전성

### 주요 특징
- ✅ 3단계 중첩 Layout 구조 (공개 → 인증 → 앱)
- ✅ Better-auth 통합 (이메일/비밀번호, OAuth, 2FA/TOTP)
- ✅ Resend 기반 실제 이메일 전송 (회원가입, 비밀번호 재설정)
- ✅ React Router 7 네이티브 Form + Zod 검증
- ✅ Drizzle ORM Code-first 접근 방식
- ✅ Docker 기반 로컬 개발 환경 (Supabase CLI)
- ✅ 재사용 가능한 Form 컴포넌트 (FormField, SubmitButton)
- ✅ GitHub Actions CI/CD 파이프라인
- ✅ 타입스크립트 엄격 모드
- ✅ Biome 린터/포맷터

## ⚡ 빠른 시작

```bash
# 1. 의존성 설치
bun install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값 입력

# 3. Supabase 로컬 환경 시작 (Docker 필요)
bunx supabase start

# 4. 데이터베이스 마이그레이션
bun run db:push

# 5. 개발 서버 실행
bun run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다! 🎉

---

## 📋 사전 요구사항

- **Bun** >= 1.0 (패키지 매니저)
- **Docker Desktop** (로컬 개발용)
- **Node.js** >= 20 (선택사항)
- **Cloudflare 계정** (배포용)

## 🛠️ 설치 및 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
bun install
```

### 2. 로컬 테스트 환경 (Supabase CLI + Docker)

이 프로젝트는 로컬 개발을 위해 **Docker 기반 Supabase**를 사용합니다.

#### 사전 요구사항
- **Docker Desktop** 설치 및 실행
- **Supabase CLI** (프로젝트에 포함됨)

#### 로컬 Supabase 시작

**1. Supabase 초기화** (최초 1회만)
```bash
bunx supabase init
```

**2. Docker로 로컬 Supabase 시작**
```bash
bunx supabase start
```

이 명령어는 다음 서비스를 Docker 컨테이너로 실행합니다:
- PostgreSQL (포트: 54322)
- Supabase Studio (포트: 54323)
- PostgREST API (포트: 54321)
- Inbucket (이메일 테스트, 포트: 54324)

**3. 연결 정보 확인**
```bash
bunx supabase status
```

출력 예시:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
```

#### Supabase Studio 사용

브라우저에서 `http://localhost:54323`을 열어 Supabase Studio에 접속:
- 테이블 확인 및 수정
- SQL 에디터
- 데이터 조회/편집

#### 이메일 테스트

로컬 환경에서는 실제 이메일이 전송되지 않고 Inbucket에 저장됩니다:
- URL: `http://localhost:54324`
- 회원가입/비밀번호 재설정 이메일 확인 가능

#### 로컬 Supabase 중지

```bash
bunx supabase stop
```

#### 로컬 Supabase 완전 삭제 (데이터 초기화)

```bash
bunx supabase stop --no-backup
```

### 3. 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

`.env` 파일을 열어 다음 값들을 설정하세요:

```bash
# 데이터베이스 설정
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
BASE_URL=http://localhost:5173

# Better-auth 설정 (필수!)
BETTER_AUTH_SECRET=m93eRhpinFSwxkJYbsdsTy330WzUpSIj

# Resend 이메일 서비스 (필수!)
# https://resend.com/api-keys에서 API 키 발급
RESEND_API_KEY=
# 로컬 테스트: claude-rr7@resend.dev 사용 가능
# 프로덕션: 도메인 인증 후 noreply@yourdomain.com 형식
RESEND_FROM_EMAIL=claude-rr7@resend.dev

# OAuth 프로바이더 (선택사항)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
```

**필수 설정:**
- `BETTER_AUTH_SECRET`: 암호화에 사용되는 비밀 키 (최소 32자)
  - 생성 방법: `openssl rand -base64 32`
  - 프로덕션에서는 반드시 다른 값으로 변경
- `RESEND_API_KEY`: Resend 이메일 서비스 API 키
  - 로컬 개발: 무료 플랜 사용 가능 (월 100통)
  - 프로덕션: 유료 플랜 필요
- `RESEND_FROM_EMAIL`: 발신자 이메일 주소

**OAuth 앱 설정 (선택사항):**
- GitHub: https://github.com/settings/developers
- Google: https://console.cloud.google.com/apis/credentials
- Kakao: https://developers.kakao.com/console/app

### 4. 데이터베이스 마이그레이션

```bash
# Drizzle로 데이터베이스 스키마 생성
bun run db:push

# 또는 마이그레이션 파일 생성 후 적용
bun run db:generate
bun run db:migrate

# Drizzle Studio로 데이터베이스 확인 (선택사항)
bun run db:studio
```

## 🚀 개발

### 개발 서버 실행

```bash
bun run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 타입 체크

```bash
bun run typecheck
```

### 린트

```bash
bunx @biomejs/biome check .

# 자동 수정
bunx @biomejs/biome check --write .
```

## 📦 빌드

프로덕션 빌드 생성:

```bash
bun run build
```

빌드 결과물:
```
build/
├── client/     # 정적 에셋
└── server/     # 서버 사이드 코드
```

## 🌐 배포

### Cloudflare Workers 배포

#### 1. Cloudflare 설정

먼저 Cloudflare 계정에 로그인합니다:

```bash
bunx wrangler login
```

#### 2. wrangler.toml 설정

`wrangler.toml` 파일을 열어 프로젝트에 맞게 수정하세요:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "your-project-name"  # ⭐ 프로젝트 이름으로 변경 (예: my-app)
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

main = "./workers/app.ts"

[build]
command = "bun run build"

[env.production]
name = "your-project-name-production"  # ⭐ 프로덕션 Worker 이름 (예: my-app-production)

[env.staging]
name = "your-project-name-staging"  # ⭐ 스테이징 Worker 이름 (예: my-app-staging)
```

**중요 설정 항목:**
- `name`: 기본 Worker 이름 (영문, 숫자, 하이픈만 사용 가능)
- `env.production.name`: Production 환경 Worker 이름
- `env.staging.name`: Staging 환경 Worker 이름

**배포 후 URL:**
- Production: `https://your-project-name-production.workers.dev`
- Staging: `https://your-project-name-staging.workers.dev`

> 💡 **팁**: 커스텀 도메인을 사용하려면 Cloudflare Dashboard에서 Route 설정을 추가하세요.

#### 3. Secrets 설정

Cloudflare Workers에서 환경 변수를 안전하게 관리:

```bash
# Staging 환경
bunx wrangler secret put VITE_SUPABASE_URL --env staging
bunx wrangler secret put VITE_SUPABASE_ANON_KEY --env staging
bunx wrangler secret put DATABASE_URL --env staging
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env staging
bunx wrangler secret put RESEND_API_KEY --env staging
bunx wrangler secret put RESEND_FROM_EMAIL --env staging

# Production 환경
bunx wrangler secret put VITE_SUPABASE_URL --env production
bunx wrangler secret put VITE_SUPABASE_ANON_KEY --env production
bunx wrangler secret put DATABASE_URL --env production
bunx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
bunx wrangler secret put RESEND_API_KEY --env production
bunx wrangler secret put RESEND_FROM_EMAIL --env production
```

#### 4. 배포 실행

```bash
# Staging 배포
bun run deploy:staging

# Production 배포
bun run deploy:production
```

배포가 완료되면 터미널에 배포된 URL이 표시됩니다:
```
✨  Success! Uploaded to Cloudflare Workers
 ⛅️ https://your-project-name-production.workers.dev
```

---

### GitHub Actions 자동 배포

프로젝트에 GitHub Actions CI/CD 파이프라인이 설정되어 있습니다.

#### 1. GitHub Secrets 설정

Repository → Settings → Secrets and variables → Actions에서 다음 Secret을 추가:

##### CLOUDFLARE_API_TOKEN
Cloudflare API 토큰을 생성합니다:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. "Create Token" 클릭
3. "Edit Cloudflare Workers" 템플릿 선택
4. **Account Resources**: Include → Your Account 선택
5. **Zone Resources**: All zones 선택
6. "Continue to summary" → "Create Token" 클릭
7. 생성된 토큰을 복사하여 GitHub Secret에 추가

##### CLOUDFLARE_ACCOUNT_ID
Cloudflare 계정 ID를 찾습니다:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. 우측 사이드바에서 "Account ID" 확인 및 복사
3. GitHub Secret에 추가

#### 2. .github/workflows/deploy.yml 설정

워크플로우 파일에서 배포 URL을 수정하세요:

```yaml
deploy-staging:
  environment:
    name: staging
    url: https://your-project-name-staging.workers.dev  # ⭐ 변경

deploy-production:
  environment:
    name: production
    url: https://your-project-name-production.workers.dev  # ⭐ 변경
```

**URL 형식:**
- `https://[wrangler.toml의 env.staging.name].workers.dev`
- `https://[wrangler.toml의 env.production.name].workers.dev`

#### 3. 자동 배포 트리거

설정이 완료되면 다음과 같이 자동 배포됩니다:

- ✅ `main` 브랜치에 push → **Production 배포**
- ✅ `staging` 브랜치에 push → **Staging 배포**
- ✅ Pull Request 생성 → 타입 체크 및 빌드 테스트

**첫 배포 시작하기:**
```bash
# Staging 브랜치 생성 및 푸시
git checkout -b staging
git push origin staging

# Production 배포 (main 브랜치에 푸시)
git checkout main
git push origin main
```

GitHub Actions 탭에서 배포 진행 상황을 확인할 수 있습니다.

---

### 📋 배포 체크리스트

실제 배포 전에 다음 사항을 확인하세요:

#### wrangler.toml
- [ ] `name` 변경 (your-project-name)
- [ ] `env.production.name` 변경 (your-project-name-production)
- [ ] `env.staging.name` 변경 (your-project-name-staging)

#### Cloudflare Secrets
- [ ] Staging 환경 Secrets 설정 완료
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - DATABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - RESEND_API_KEY
  - RESEND_FROM_EMAIL
- [ ] Production 환경 Secrets 설정 완료
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - DATABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - RESEND_API_KEY
  - RESEND_FROM_EMAIL

#### GitHub Secrets
- [ ] CLOUDFLARE_API_TOKEN 추가
- [ ] CLOUDFLARE_ACCOUNT_ID 추가

#### GitHub Workflow
- [ ] `.github/workflows/deploy.yml`의 URL 수정
  - staging URL
  - production URL

#### 배포 테스트
- [ ] `bun run build` 성공 확인
- [ ] `bun run typecheck` 에러 없음 확인
- [ ] Staging 배포 테스트
- [ ] Production 배포 전 최종 확인

---

## 📁 프로젝트 구조 가이드 (클린 아키텍처)

### 🎯 핵심 원칙

이 프로젝트는 **클린 아키텍처(Clean Architecture)** 를 따릅니다:

1. **의존성 방향**: 외부 → 내부로만 의존 (Domain은 어떤 것에도 의존하지 않음)
2. **관심사 분리**: 각 레이어는 자신의 책임만 담당
3. **테스트 용이성**: 비즈니스 로직과 인프라를 분리하여 독립적 테스트 가능
4. **유연한 확장**: 인터페이스 기반으로 구현체 교체 용이

```
┌──────────────────────────────────────────────────────────────┐
│                    📱 Presentation Layer                      │
│              (routes, components, hooks, lib)                 │
├──────────────────────────────────────────────────────────────┤
│                    ⚙️ Application Layer                       │
│                 (services, ports/interfaces)                  │
├──────────────────────────────────────────────────────────────┤
│                     💎 Domain Layer                           │
│              (entities, types, errors, schemas)               │
├──────────────────────────────────────────────────────────────┤
│                   🔧 Infrastructure Layer                     │
│         (DB implementations, external APIs, config)           │
└──────────────────────────────────────────────────────────────┘
          ↑ 의존성 방향: 바깥쪽에서 안쪽으로만
```

---

### 📂 전체 구조

```
app/
├── domain/                      # 1️⃣ Domain Layer (가장 안쪽)
│   ├── auth/                   # 인증 도메인
│   │   ├── auth.types.ts       # 타입 정의
│   │   ├── auth.schemas.ts     # Zod 검증 스키마
│   │   └── auth.errors.ts      # 에러 클래스
│   ├── user/                   # 사용자 도메인
│   │   ├── user.entity.ts      # IUser, IProfile 엔티티
│   │   ├── user.types.ts       # DTO
│   │   ├── user.schemas.ts     # Zod 검증 스키마
│   │   └── user.errors.ts      # 에러 클래스
│   └── shared/                 # 공통 타입
│       └── common.types.ts     # BaseEntity 등
│
├── application/                 # 2️⃣ Application Layer
│   ├── auth/
│   │   ├── auth.port.ts        # IAuthProvider 인터페이스
│   │   └── auth.service.ts     # AuthService
│   ├── user/
│   │   ├── user.port.ts        # IUserRepository, IProfileRepository
│   │   └── user.service.ts     # UserService
│   └── shared/
│       ├── email.port.ts       # IEmailService
│       └── container.types.ts  # IContainer
│
├── infrastructure/              # 3️⃣ Infrastructure Layer
│   ├── config/
│   │   ├── container.ts        # DI Container (Composition Root)
│   │   └── env.ts              # 환경 변수 타입
│   ├── persistence/
│   │   ├── drizzle/            # Drizzle ORM 클라이언트
│   │   │   ├── drizzle.server.ts
│   │   │   └── user.repository.impl.ts
│   │   └── schema/             # DB 스키마
│   │       └── auth.schema.ts
│   └── external/
│       ├── better-auth/        # IAuthProvider 구현체
│       │   ├── auth.config.ts
│       │   ├── auth.const.ts
│       │   ├── auth.provider.impl.ts
│       │   └── auth.server.ts
│       └── resend/             # IEmailService 구현체
│           └── email.service.impl.ts
│
├── presentation/                # 4️⃣ Presentation Layer
│   ├── routes/                 # React Router 페이지
│   │   ├── layouts/            # Layout 컴포넌트
│   │   ├── auth/               # 인증 페이지
│   │   ├── dashboard/          # 대시보드 페이지
│   │   └── settings/           # 설정 페이지
│   ├── components/             # UI 컴포넌트
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── forms/              # FormField, SubmitButton
│   │   ├── sections/           # 섹션 컴포넌트
│   │   └── email/              # 이메일 템플릿
│   ├── hooks/                  # React 커스텀 훅
│   │   └── use-mobile.ts
│   └── lib/                    # 유틸리티
│       ├── middleware/         # auth, guest 미들웨어
│       ├── error-handler.ts    # 에러 핸들러
│       ├── form-helpers.ts     # Form 검증 유틸
│       ├── password-strength.ts # 비밀번호 강도 검사
│       └── utils.ts            # 공통 유틸리티
│
├── root.tsx                    # 루트 레이아웃
├── routes.ts                   # 라우트 설정
├── entry.server.tsx            # 서버 진입점
│
└── workers/app.ts              # Composition Root (진입점)
```

---

### 📋 레이어별 상세 설명

#### 1️⃣ Domain Layer (`app/domain/`)

**역할**: 비즈니스의 핵심 규칙과 엔티티를 정의. **어떤 외부 의존성도 없음**

**구성 요소**:
- **Entity**: 핵심 비즈니스 객체 (IUser, IProfile)
- **Types/DTO**: 데이터 전송 객체
- **Errors**: 도메인 에러 클래스
- **Schemas**: Zod 검증 스키마

**예시**:
```typescript
// domain/user/user.entity.ts
export interface IUser extends BaseEntity {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
}

// domain/user/user.errors.ts
export class UserNotFoundError extends Error {
  constructor() {
    super("사용자를 찾을 수 없습니다.");
  }
}
```

**규칙**:
- ✅ 순수 TypeScript (프레임워크 독립적)
- ✅ 외부 라이브러리 최소화 (Zod는 허용)
- ❌ React, Drizzle, Better-auth 등 외부 의존성 금지
- ❌ HTTP, DB 관련 코드 금지

---

#### 2️⃣ Application Layer (`app/application/`)

**역할**: 비즈니스 로직 조율, Port(인터페이스) 정의, Service 구현

**구성 요소**:
- **Port**: 인터페이스 정의 (Repository, Provider)
- **Service**: 비즈니스 로직 구현

**Port & Adapter 패턴**:
```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
│  ┌─────────────┐         ┌─────────────────────────┐   │
│  │   Service   │────────►│    Port (Interface)     │   │
│  │ (비즈니스)   │         │  IUserRepository        │   │
│  └─────────────┘         │  IAuthProvider          │   │
│                          └────────────┬────────────┘   │
└───────────────────────────────────────┼────────────────┘
                                        │ 구현
┌───────────────────────────────────────┼────────────────┐
│                Infrastructure Layer   ▼                │
│                     ┌─────────────────────────┐        │
│                     │   Adapter (구현체)        │        │
│                     │  UserRepositoryImpl      │        │
│                     │  AuthProviderImpl        │        │
│                     └─────────────────────────┘        │
└────────────────────────────────────────────────────────┘
```

**예시**:
```typescript
// application/user/user.port.ts (인터페이스 정의)
export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findWithProfile(userId: string): Promise<IUserWithProfile | null>;
  update(id: string, data: UpdateUserDTO): Promise<IUser>;
}

// application/user/user.service.ts (비즈니스 로직)
export const createUserService = (
  userRepository: IUserRepository,
  profileRepository: IProfileRepository,
) => ({
  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  },
  // ...
});
```

**규칙**:
- ✅ Domain만 import 가능
- ✅ 인터페이스(Port)로 Infrastructure와 분리
- ❌ Infrastructure 직접 import 금지
- ❌ Presentation 레이어 의존 금지

---

#### 3️⃣ Infrastructure Layer (`app/infrastructure/`)

**역할**: 외부 시스템과의 연결, Port 구현체 제공

**구성 요소**:
- **config/**: DI Container, 환경 변수
- **persistence/**: DB 클라이언트, Repository 구현체
- **external/**: 외부 서비스 연동 (Better-auth, Resend)

**예시**:
```typescript
// infrastructure/persistence/drizzle/user.repository.impl.ts
export const createUserRepositoryImpl = (db: DrizzleClient): IUserRepository => ({
  async findById(id: string) {
    const result = await db.query.user.findFirst({
      where: eq(user.id, id),
    });
    return result ? mapToUser(result) : null;
  },
  // ...
});

// infrastructure/external/better-auth/auth.provider.impl.ts
export const createAuthProviderImpl = (betterAuth: BetterAuth): IAuthProvider => ({
  async getSession(headers: Headers) {
    const session = await betterAuth.api.getSession({ headers });
    return session ? { user: mapToUser(session.user) } : null;
  },
  // ...
});
```

**규칙**:
- ✅ Application의 Port 인터페이스를 구현
- ✅ Domain 엔티티를 반환 타입으로 사용
- ✅ 외부 라이브러리 사용 가능 (Drizzle, Better-auth 등)
- ❌ Presentation 레이어 의존 금지

---

#### 4️⃣ Presentation Layer (`app/presentation/`)

**역할**: 사용자 인터페이스, 라우팅, 사용자 입력 처리

**구성 요소**:
- **routes/**: React Router 페이지
- **components/**: UI 컴포넌트
- **hooks/**: React 커스텀 훅
- **lib/**: 유틸리티, 미들웨어

**예시**:
```typescript
// presentation/routes/auth/sign-in.tsx
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { authService } = context.container;
  const formData = await request.formData();

  const validation = validateFormData(signInSchema, formData);
  if (!validation.success) return { errors: validation.errors };

  const result = await authService.signInWithCredentials(
    validation.data.email,
    validation.data.password,
    request.headers,
  );

  return redirect("/my/dashboard", {
    headers: { "Set-Cookie": result.setCookie ?? "" },
  });
};
```

**규칙**:
- ✅ Application Service를 context.container를 통해 사용
- ✅ Domain 타입 사용 가능
- ❌ Infrastructure 직접 import 금지 (container를 통해서만)
- ❌ DB 직접 접근 금지

---

### 🔧 DI Container 사용법

#### Composition Root (`workers/app.ts`)

모든 의존성이 조립되는 시작점:

```typescript
// workers/app.ts
import { createContainer } from "~/infrastructure/config/container";

export default {
  async fetch(request, env, ctx) {
    // Container 생성 (매 요청마다)
    const container = createContainer(env);

    return requestHandler(request, {
      cloudflare: { env, ctx },
      container,  // loader/action에서 사용 가능
    });
  },
};
```

#### Container 구조 (`infrastructure/config/container.ts`)

```typescript
export const createContainer = (env: CloudflareAuthEnv): IContainer => {
  // 1. Infrastructure: DB 클라이언트
  const db = createDrizzleClient(env.DATABASE_URL);

  // 2. Infrastructure: Email Service
  const emailService = createEmailServiceImpl(
    env.RESEND_API_KEY,
    env.RESEND_FROM_EMAIL,
  );

  // 3. Infrastructure: Repositories
  const userRepository = createUserRepositoryImpl(db);
  const profileRepository = createProfileRepositoryImpl(db);

  // 4. Infrastructure: Better-auth
  const betterAuth = createBetterAuth(db, env, emailService, profileRepository);
  const authProvider = createAuthProviderImpl(betterAuth);

  // 5. Application: Services
  const userService = createUserService(userRepository, profileRepository);
  const authService = createAuthService(authProvider, userRepository);

  return {
    authService,
    userService,
    emailService,
    betterAuthHandler: (request) => betterAuth.handler(request),
    createClearSessionHeaders,
  };
};
```

#### Route에서 사용하기

```typescript
// presentation/routes/settings/index.tsx
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  // Container에서 서비스 가져오기
  const { authService, userService } = context.container;

  // 인증 확인
  const session = await authService.getSession(request.headers);
  if (!session) return redirect("/auth/sign-in");

  // 사용자 정보 조회
  const userWithProfile = await userService.getUserWithProfile(session.user.id);

  return { user: userWithProfile };
};
```

---

### 🚀 새로운 기능 추가 가이드

#### 예시: "결제" 기능 추가

**1단계: Domain Layer - 엔티티, 타입, 에러 정의**
```bash
mkdir -p app/domain/payment
```

```typescript
// domain/payment/payment.entity.ts
export interface IPayment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
}

// domain/payment/payment.types.ts
export type PaymentStatus = "pending" | "completed" | "failed";
export interface CreatePaymentDTO {
  userId: string;
  amount: number;
  currency: string;
}

// domain/payment/payment.errors.ts
export class PaymentFailedError extends Error {
  constructor(reason: string) {
    super(`결제 실패: ${reason}`);
  }
}
```

**2단계: Application Layer - Port와 Service 정의**
```bash
mkdir -p app/application/payment
```

```typescript
// application/payment/payment.port.ts
export interface IPaymentRepository {
  create(data: CreatePaymentDTO): Promise<IPayment>;
  findById(id: string): Promise<IPayment | null>;
  updateStatus(id: string, status: PaymentStatus): Promise<IPayment>;
}

export interface IPaymentGateway {
  createPaymentIntent(amount: number, currency: string): Promise<{ clientSecret: string }>;
  confirmPayment(paymentIntentId: string): Promise<boolean>;
}

// application/payment/payment.service.ts
export const createPaymentService = (
  paymentRepository: IPaymentRepository,
  paymentGateway: IPaymentGateway,
) => ({
  async processPayment(userId: string, amount: number, currency: string) {
    const payment = await paymentRepository.create({ userId, amount, currency });
    const intent = await paymentGateway.createPaymentIntent(amount, currency);
    return { payment, clientSecret: intent.clientSecret };
  },
});
```

**3단계: Infrastructure Layer - 구현체 작성**
```bash
mkdir -p app/infrastructure/external/stripe
mkdir -p app/infrastructure/persistence/drizzle
```

```typescript
// infrastructure/external/stripe/payment.gateway.impl.ts
export const createPaymentGatewayImpl = (stripeApiKey: string): IPaymentGateway => ({
  async createPaymentIntent(amount, currency) {
    // Stripe API 호출
    return { clientSecret: "..." };
  },
});

// infrastructure/persistence/drizzle/payment.repository.impl.ts
export const createPaymentRepositoryImpl = (db: DrizzleClient): IPaymentRepository => ({
  async create(data) { /* ... */ },
  async findById(id) { /* ... */ },
});
```

**4단계: Container에 등록**
```typescript
// infrastructure/config/container.ts
export const createContainer = (env): IContainer => {
  // ... 기존 코드 ...

  const paymentRepository = createPaymentRepositoryImpl(db);
  const paymentGateway = createPaymentGatewayImpl(env.STRIPE_API_KEY);
  const paymentService = createPaymentService(paymentRepository, paymentGateway);

  return {
    // ... 기존 서비스 ...
    paymentService,
  };
};
```

**5단계: Presentation Layer - 라우트와 컴포넌트**
```typescript
// presentation/routes/payment/checkout.tsx
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { paymentService } = context.container;
  const formData = await request.formData();

  const result = await paymentService.processPayment(
    userId,
    Number(formData.get("amount")),
    "KRW",
  );

  return { clientSecret: result.clientSecret };
};
```

---

### ✅ 체크리스트

새로운 코드를 작성할 때 다음을 확인하세요:

#### 의존성 방향 체크
- [ ] Domain → 외부 의존성 없음?
- [ ] Application → Domain만 import?
- [ ] Infrastructure → Application Port 구현?
- [ ] Presentation → Container를 통해 서비스 접근?

#### Port & Adapter 패턴 체크
- [ ] 외부 시스템 연동 시 Port(인터페이스) 정의했는가?
- [ ] Infrastructure에서 Port 구현체 작성했는가?
- [ ] Container에서 의존성 주입했는가?

#### 레이어별 체크
- [ ] 비즈니스 엔티티 → `domain/`
- [ ] 비즈니스 로직 → `application/`
- [ ] DB/외부 서비스 연동 → `infrastructure/`
- [ ] UI/라우팅 → `presentation/`

---

### 🎓 참고 원칙

이 구조는 다음 원칙을 따릅니다:
- **클린 아키텍처 (Clean Architecture)**: 의존성 역전, 레이어 분리
- **Port & Adapter 패턴**: 외부 시스템 추상화
- **의존성 주입 (DI)**: Container를 통한 의존성 관리
- **단일 책임 원칙 (SRP)**: 각 레이어/모듈은 하나의 책임만

## 🗄️ 데이터베이스 스키마 관리

### Code-First 접근 방식

Drizzle ORM을 사용하여 TypeScript로 스키마를 정의합니다:

```typescript
// app/infrastructure/persistence/schema/auth.schema.ts
export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  // ...
});

export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
```

### 마이그레이션 워크플로우

```bash
# 1. schema 수정 후 마이그레이션 생성
bun run db:generate

# 2. 마이그레이션 적용
bun run db:migrate

# 3. 또는 개발 환경에서 직접 push
bun run db:push

# 4. Drizzle Studio로 DB 확인
bun run db:studio
```

### Better-auth CLI 스키마 생성

Better-auth CLI를 사용하여 인증 테이블 스키마를 자동 생성할 수 있습니다:

```bash
# Better-auth 스키마 생성
bun run db:auth

# 또는 직접 CLI 실행
bunx @better-auth/cli generate --config app/infrastructure/external/better-auth/auth.server.ts --output app/infrastructure/persistence/schema/auth.schema.ts
```

**스키마 분리 구조** (클린 아키텍처):
```
app/infrastructure/persistence/
├── drizzle/
│   ├── drizzle.server.ts      # DB 클라이언트 생성
│   └── user.repository.impl.ts # Repository 구현체
│
└── schema/
    └── auth.schema.ts          # Better-auth CLI 자동 생성 + 앱 전용 테이블
        ├── user                # 사용자 테이블
        ├── session             # 세션 테이블
        ├── account             # OAuth 계정 테이블
        ├── verification        # 이메일 인증 토큰 테이블
        ├── twoFactor           # 2FA 테이블
        └── profiles            # 프로필 테이블
```

**auth.schema.ts 특징**:
- Better-auth CLI가 자동 생성하며, 수동 수정 불필요
- 테이블 간 relations 자동 정의 (userRelations, sessionRelations, accountRelations)
- 성능을 위한 인덱스 자동 추가 (session_userId_idx, account_userId_idx, verification_identifier_idx)

**CLI용 정적 auth 인스턴스** (`app/infrastructure/external/better-auth/auth.server.ts`):
```typescript
// CLI 스키마 생성 및 로컬 개발용 정적 인스턴스
// Cloudflare Workers 환경에서는 createContainer()를 통해 생성
export const auth = createAuth(
  process.env.DATABASE_URL!,
  process.env.BASE_URL!,
  // ... OAuth 설정
);
```

## 🔐 인증 시스템

이 프로젝트는 **Better-auth**를 사용하여 인증을 처리합니다. Better-auth는 프레임워크 독립적인 TypeScript 인증 라이브러리로, Drizzle ORM과 완벽하게 통합됩니다.

### 지원하는 인증 방법

- ✅ 이메일/비밀번호 로그인
- ✅ 이메일 인증
- ✅ 비밀번호 재설정
- ✅ OAuth 소셜 로그인 (GitHub, Google - 설정 필요)
- ✅ 2FA/TOTP (Google Authenticator)

### 3단계 Layout 구조

프로젝트는 다음과 같이 중첩된 Layout을 사용합니다:

**1) navgation.layout.tsx (L1 - 공개 레이아웃)**
- `getOptionalAuth` 사용으로 로그인 선택적 처리
- `SidebarProvider` 전역 제공
- `NavigationBar`와 `FooterSection` 포함
- 모든 페이지의 기본 틀

**2) private.layout.tsx (L2 - 인증 레이어)**
- `requireAuth` 미들웨어로 인증 강제
- UI 없음 (인증 로직만)
- user context를 하위로 전달

**3) app.layout.tsx (L3 - 앱 사이드바)**
- `AppSidebar` 컴포넌트 렌더링
- Dashboard와 Settings 페이지가 이 레이아웃 사용

---

### React Router 7 Form + Zod 검증

기존 React Hook Form이 제거되고, React Router 7의 네이티브 Form을 사용합니다:

**Form 컴포넌트들** (`app/presentation/components/forms/`)
- `FormField`: Label, Input, 에러 메시지를 통합한 재사용 컴포넌트
- `SubmitButton`: `useNavigation`으로 자동 로딩 상태 관리

**서버 사이드 검증** (`app/presentation/lib/form-helpers.ts`)
```typescript
// Zod 스키마로 검증
const validation = validateFormData(loginSchema, formData);
if (!validation.success) {
  return { errors: validation.errors };
}
```

**Action 함수 사용 예시** (클린 아키텍처 방식)
```typescript
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { authService } = context.container;  // DI Container에서 서비스 가져오기
  const formData = await request.formData();

  // Zod 검증
  const validation = validateFormData(loginSchema, formData);
  if (!validation.success) {
    return { errors: validation.errors };
  }

  // 서버 사이드 로그인 (Application Service 사용)
  const result = await authService.signInWithCredentials(
    validation.data.email,
    validation.data.password,
    request.headers,
  );

  return redirect('/my/dashboard', {
    headers: { "Set-Cookie": result.setCookie ?? "" },
  });
};
```

---

### Resend 이메일 서비스 통합

이메일 기반 회원가입 및 비밀번호 재설정을 Resend로 구현합니다:

**이메일 서비스 (클린 아키텍처)**

Port 인터페이스 (`app/application/shared/email.port.ts`):
```typescript
export interface IEmailService {
  sendVerificationEmail(email: string, verificationUrl: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetUrl: string): Promise<void>;
}
```

구현체 (`app/infrastructure/external/resend/email.service.impl.ts`):
```typescript
export const createEmailServiceImpl = (
  apiKey: string,
  fromEmail: string,
): IEmailService => ({
  async sendVerificationEmail(email, verificationUrl) {
    // Resend를 사용한 이메일 전송
  },
  async sendPasswordResetEmail(email, resetUrl) {
    // Resend를 사용한 이메일 전송
  },
});
```

**이메일 템플릿** (`app/presentation/components/email/`)
- `verification-email.tsx`: 이메일 인증 템플릿
- `password-reset-email.tsx`: 비밀번호 재설정 템플릿
- `email-layout.tsx`: 공통 레이아웃

**Better-auth 콜백 설정** (`app/infrastructure/external/better-auth/auth.config.ts`)
```typescript
emailVerification: {
  sendOnSignUp: true,
  sendVerificationEmail: async ({ user, url }) => {
    await emailService.sendVerificationEmail(user.email, url);
  },
},
emailAndPassword: {
  sendResetPassword: async ({ user, url }) => {
    await emailService.sendPasswordResetEmail(user.email, url);
  },
}
```

---

### Better-auth 구조 (클린 아키텍처)

#### 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │ routes/auth/sign-in.tsx                            │     │
│  │ routes/auth/api/$.tsx (Better-auth 엔드포인트)      │     │
│  └────────────────────────────────────────────────────┘     │
│                            │                                 │
│                 context.container.authService                │
│                            ↓                                 │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│  ┌─────────────────┐     ┌─────────────────────────────┐   │
│  │  AuthService    │────►│   IAuthProvider (Port)      │   │
│  └─────────────────┘     └──────────────┬──────────────┘   │
├─────────────────────────────────────────┼───────────────────┤
│                 Infrastructure Layer    │                    │
│                            ┌────────────▼──────────────┐    │
│                            │  AuthProviderImpl         │    │
│                            │  (Better-auth Adapter)    │    │
│                            └───────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

#### 1. Application Service (`app/application/auth/auth.service.ts`)

비즈니스 로직 조율:

```typescript
export const createAuthService = (
  authProvider: IAuthProvider,
  userRepository: IUserRepository,
) => ({
  async getSession(headers: Headers) {
    return authProvider.getSession(headers);
  },

  async signInWithCredentials(email: string, password: string, headers: Headers) {
    return authProvider.signInWithCredentials(email, password, headers);
  },

  async signUpWithCredentials(email: string, password: string, name: string, headers: Headers) {
    return authProvider.signUpWithCredentials(email, password, name, headers);
  },
  // ...
});
```

#### 2. Port 인터페이스 (`app/application/auth/auth.port.ts`)

인증 제공자 추상화:

```typescript
export interface IAuthProvider {
  getSession(headers: Headers): Promise<{ user: IUser } | null>;
  signInWithCredentials(email: string, password: string, headers: Headers): Promise<SignInResult>;
  signUpWithCredentials(email: string, password: string, name: string, headers: Headers): Promise<SignUpResult>;
  signInWithOAuth(provider: "github" | "google" | "kakao", callbackURL: string, headers: Headers): Promise<OAuthSignInResult>;
  signOut(headers: Headers): Promise<void>;
  // ...
}
```

#### 3. Infrastructure 구현체 (`app/infrastructure/external/better-auth/`)

**auth.provider.impl.ts**: IAuthProvider 구현체
```typescript
export const createAuthProviderImpl = (betterAuth: BetterAuth): IAuthProvider => ({
  async getSession(headers) {
    const session = await betterAuth.api.getSession({ headers });
    return session ? { user: mapToUser(session.user) } : null;
  },
  // ...
});
```

**auth.const.ts**: 쿠키 관련 상수
```typescript
export const COOKIE_PREFIX = "cc-rr7";
export const SESSION_COOKIE_NAMES = [
  `${COOKIE_PREFIX}.session_token`,
  `${COOKIE_PREFIX}.session_data`,
] as const;
export const createClearSessionHeaders = (): Headers => { ... };
```

**auth.config.ts**: Better-auth 설정
```typescript
export const createBetterAuth = (
  db: DrizzleClient,
  config: AuthConfig,
  sendVerificationEmail: (email: string, url: string) => Promise<void>,
  sendPasswordResetEmail: (email: string, url: string) => Promise<void>,
  profileRepository: IProfileRepository,
) => betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  // ... 설정
});
```

#### 4. API 라우트 (`app/presentation/routes/auth/api/$.tsx`)

Better-auth의 모든 엔드포인트를 처리하는 catch-all 라우트:

```typescript
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return context.container.betterAuthHandler(request);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  return context.container.betterAuthHandler(request);
};

// Better-auth가 자동으로 다음 엔드포인트들을 처리:
// POST /auth/api/sign-up
// POST /auth/api/sign-in
// POST /auth/api/sign-out
// GET /auth/api/session
// POST /auth/api/verify-email
// POST /auth/api/forget-password
// POST /auth/api/reset-password
// GET /auth/api/callback/github
// GET /auth/api/callback/google
```

#### 5. 인증 페이지 구조

모든 인증 페이지는 **Container를 통한 의존성 주입**을 사용합니다:

```typescript
// presentation/routes/auth/sign-in.tsx
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { authService } = context.container;  // DI Container에서 서비스 가져오기
  const formData = await request.formData();

  const validation = validateFormData(signInSchema, formData);
  if (!validation.success) {
    return { errors: validation.errors };
  }

  const result = await authService.signInWithCredentials(
    validation.data.email,
    validation.data.password,
    request.headers,
  );

  return redirect('/my/dashboard', {
    headers: { "Set-Cookie": result.setCookie ?? "" },
  });
};
```

**이점**:
- 모든 인증 로직이 서버에서 처리됨 (보안)
- 클라이언트가 우회할 수 없음
- 세션 쿠키는 httpOnly, secure로 자동 설정
- Progressive Enhancement 지원 (JS 비활성화 시에도 작동)
- **테스트 용이성**: IAuthProvider를 Mock으로 교체 가능

---

### OAuth 소셜 로그인 (서버 사이드)

OAuth 소셜 로그인이 클린 아키텍처 기반으로 구현되었습니다:

**AuthService를 통한 OAuth 로그인** (`app/application/auth/auth.service.ts`):
```typescript
// AuthService에서 IAuthProvider를 통해 OAuth 로그인 처리
async signInWithOAuth(
  provider: "github" | "google" | "kakao",
  callbackURL: string,
  headers: Headers,
) {
  return authProvider.signInWithOAuth(provider, callbackURL, headers);
}
```

**로그인 페이지에서 사용** (`app/presentation/routes/auth/sign-in.tsx`):
```tsx
// Form action으로 소셜 로그인 처리
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { authService } = context.container;
  const formData = await request.formData();
  const provider = formData.get("provider");

  if (provider === "github" || provider === "google") {
    const result = await authService.signInWithOAuth(
      provider,
      "/my/dashboard",
      request.headers,
    );

    const headers = new Headers();
    for (const cookie of result.setCookies) {
      headers.append("Set-Cookie", cookie);
    }
    return redirect(result.redirectUrl, { headers });
  }
  // ... 이메일 로그인 처리
};

// 소셜 로그인 버튼
<Form method="post">
  <input type="hidden" name="provider" value="github" />
  <Button type="submit">GitHub으로 로그인</Button>
</Form>
```

**OAuth 설정** (`app/infrastructure/external/better-auth/auth.config.ts`):
```typescript
// 신뢰할 수 있는 Origin 설정 (state_not_found 에러 방지)
trustedOrigins: [baseURL],

// 계정 연동 설정
account: {
  accountLinking: {
    enabled: true,
    trustedProviders: ["github", "google", "kakao"],
  },
},

// HTTP 개발 환경 지원
advanced: {
  useSecureCookies: baseURL.startsWith("https://"),
},
```

---

### OAuth 에러 처리

OAuth 관련 에러 메시지가 한글로 번역됩니다 (`app/presentation/lib/error-handler.ts`):

```typescript
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  state_not_found: "OAuth 인증 세션이 만료되었습니다. 다시 시도해주세요.",
  state_mismatch: "OAuth 인증 상태가 일치하지 않습니다. 다시 시도해주세요.",
  invalid_state: "유효하지 않은 인증 상태입니다. 다시 시도해주세요.",
  oauth_error: "OAuth 인증 중 오류가 발생했습니다.",
  access_denied: "접근이 거부되었습니다.",
  // ...
};
```

---

### 로그아웃 안정성 개선

로그아웃 시 세션 쿠키를 강제로 삭제하여 안정성을 높였습니다:

**쿠키 클리어 헬퍼** (`app/infrastructure/external/better-auth/auth.const.ts`):
```typescript
export const SESSION_COOKIE_NAMES = [
  `${COOKIE_PREFIX}.session_token`,
  `${COOKIE_PREFIX}.session_data`,
] as const;

export const createClearSessionHeaders = (): Headers => {
  const headers = new Headers();
  for (const name of SESSION_COOKIE_NAMES) {
    headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
    );
  }
  return headers;
};
```

**로그아웃 라우트** (`app/presentation/routes/auth/sign-out.tsx`):
```typescript
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { authService, createClearSessionHeaders } = context.container;
  const headers = createClearSessionHeaders();

  try {
    await authService.signOut(request.headers);
    return redirect("/", { headers });
  } catch (error) {
    // 실패해도 쿠키는 삭제하고 홈으로 리다이렉트
    return redirect("/", { headers });
  }
};
```

**개선 사항**:
- 쿠키 상수가 `auth.const.ts`에 중앙 집중화
- `cc-rr7.session_token`, `cc-rr7.session_data` 쿠키 명시적 만료
- 서버 측 세션 삭제 실패 시에도 클라이언트 쿠키는 삭제
- 세션 만료 상태에서 로그아웃 시도해도 정상 처리
- **DI Container를 통한 의존성 주입**: `context.container`에서 서비스 및 유틸리티 접근

## 📚 주요 라이브러리

### UI & 스타일링
- **shadcn/ui** - 고품질 컴포넌트
- **Tailwind CSS v4** - 유틸리티 퍼스트 CSS
- **lucide-react** - 아이콘 라이브러리

### 폼 관리
- **React Router 7 Form** - 서버 사이드 Form 처리
- **Zod** - 스키마 검증

### 이메일
- **Resend** - 실제 이메일 전송 서비스
- **@react-email/components** - 이메일 템플릿 작성

### 데이터베이스 & 인증
- **Drizzle ORM** - TypeScript ORM
- **Supabase** - 인증 및 PostgreSQL

### 유틸리티
- **date-fns** - 날짜/시간 처리
- **ky** - HTTP 클라이언트
- **clsx** / **tailwind-merge** - 클래스 이름 관리

## 🧪 테스트 (향후 추가 예정)

```bash
# 단위 테스트
bun test

# E2E 테스트
bun test:e2e
```

## 🤝 기여

기여를 환영합니다! Pull Request를 제출하기 전에:

1. 코드 스타일 확인: `bunx @biomejs/biome check .`
2. 타입 체크: `bun run typecheck`
3. 빌드 테스트: `bun run build`

## 📄 라이선스

MIT License

## 🙏 크레딧

- [React Router](https://reactrouter.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Supabase](https://supabase.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)
